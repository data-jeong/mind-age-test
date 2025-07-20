const fs = require('fs');
const path = require('path');

// 날짜별 시드 생성 (같은 날은 같은 결과)
function getDailySeed() {
    const today = new Date();
    // 테스트를 위해 하루 추가 (내일 질문 미리보기)
    // today.setDate(today.getDate() + 1);
    const dateStr = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    return parseInt(dateStr);
}

// 시드 기반 랜덤 함수
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// 배열 셔플 (Fisher-Yates)
function shuffleArray(array, seed) {
    const arr = [...array];
    let currentSeed = seed;
    
    for (let i = arr.length - 1; i > 0; i--) {
        currentSeed++;
        const j = Math.floor(seededRandom(currentSeed) * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr;
}

// 질문 선택 로직 (중복 방지 추가)
function selectDailyQuestions() {
    // 질문 풀 로드
    const poolPath = path.join(__dirname, '../data/question-pool-ultra.json');
    const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
    
    // 오늘의 시드
    const seed = getDailySeed();
    
    // 전체 질문을 섞어서 선택
    const allQuestions = pool.questions || [];
    const shuffled = shuffleArray(allQuestions, seed);
    
    // 중복 방지를 위해 정확한 질문 텍스트로 필터링
    const selectedQuestions = [];
    const usedQuestions = new Set();
    
    for (const question of shuffled) {
        // 질문 텍스트를 정규화 (공백, 특수문자 제거)
        const normalizedQ = question.q.toLowerCase().replace(/[^\w가-힣]/g, '');
        
        // 완전히 동일한 질문이 없으면 추가
        if (!usedQuestions.has(normalizedQ) && selectedQuestions.length < 10) {
            usedQuestions.add(normalizedQ);
            selectedQuestions.push(question);
        }
        
        if (selectedQuestions.length >= 10) break;
    }
    
    // 선택된 10개 질문의 답변도 섞기 (옵션)
    const SHUFFLE_ANSWERS = true; // false로 설정하면 원래 순서 유지
    
    return selectedQuestions.map((q, index) => {
        if (SHUFFLE_ANSWERS) {
            // 각 질문의 답변을 질문별로 다른 시드로 섞기
            const shuffledAnswers = shuffleArray(q.a, seed + index * 100);
            return {
                ...q,
                a: shuffledAnswers
            };
        }
        return q;
    });
}

// 결과 메시지 선택
function selectDailyResults() {
    const seed = getDailySeed();
    
    // 결과 메시지 풀 로드
    const poolPath = path.join(__dirname, '../data/results-pool.json');
    const resultPool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
    
    const results = {};
    
    resultPool.age_ranges.forEach((range, index) => {
        const titleIndex = Math.floor(seededRandom(seed + index * 10) * range.titles.length);
        const descIndex = Math.floor(seededRandom(seed + index * 20) * range.descriptions.length);
        
        results[`${range.min}_${range.max}`] = {
            emoji: range.emoji,
            title: range.titles[titleIndex],
            desc: range.descriptions[descIndex]
        };
    });
    
    return results;
}

// index.html 업데이트
function updateIndexHtml() {
    const questions = selectDailyQuestions();
    const results = selectDailyResults();
    
    const indexPath = path.join(__dirname, '../index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // 질문 배열 교체
    const questionsStr = JSON.stringify(questions.map(q => ({
        q: q.q,
        a: q.a
    })), null, 12).split('\n').map(line => '        ' + line).join('\n').trim();
    
    html = html.replace(
        /const questions = \[[\s\S]*?\];/,
        `const questions = ${questionsStr};`
    );
    
    // 결과 로직 업데이트 (세분화된 연령대)
    let resultLogic = '';
    const ranges = [
        { min: 0, max: 15 },
        { min: 16, max: 20 },
        { min: 21, max: 25 },
        { min: 26, max: 30 },
        { min: 31, max: 35 },
        { min: 36, max: 40 },
        { min: 41, max: 45 },
        { min: 46, max: 50 },
        { min: 51, max: 60 },
        { min: 61, max: 100 }
    ];
    
    ranges.forEach((range, i) => {
        const key = `${range.min}_${range.max}`;
        const result = results[key];
        
        if (!result) return; // 결과가 없으면 스킵
        
        if (i === 0) {
            resultLogic += `            if (age <= ${range.max}) {\n`;
        } else if (i === ranges.length - 1) {
            resultLogic += `            } else {\n`;
        } else {
            resultLogic += `            } else if (age <= ${range.max}) {\n`;
        }
        
        resultLogic += `                emoji = "${result.emoji}";\n`;
        resultLogic += `                title = "${result.title}";\n`;
        resultLogic += `                desc = "${result.desc}";\n`;
    });
    
    resultLogic += '            }';
    
    // showResult 함수에서 if-else 블록 교체
    const resultPattern = /if \(age <= \d+\) \{[\s\S]*?\} else \{[\s\S]*?\}/;
    html = html.replace(resultPattern, resultLogic.trim());
    
    fs.writeFileSync(indexPath, html);
    
    // sitemap.xml의 lastmod 업데이트
    updateSitemap();
    
    console.log(`✅ Updated for ${new Date().toISOString().split('T')[0]}`);
    console.log(`📝 Selected 10 questions from pool of ${questions.length > 0 ? '1000+' : '0'}`);
    console.log(`🎲 Today's seed: ${getDailySeed()}`);  
}

// sitemap.xml 업데이트 함수
function updateSitemap() {
    const sitemapPath = path.join(__dirname, '../sitemap.xml');
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    
    // 오늘 날짜로 lastmod 업데이트
    const today = new Date().toISOString().split('T')[0];
    sitemap = sitemap.replace(
        /<lastmod>[\d-]+<\/lastmod>/,
        `<lastmod>${today}</lastmod>`
    );
    
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`🗓️ Sitemap lastmod updated to: ${today}`);
}

// 실행
updateIndexHtml();