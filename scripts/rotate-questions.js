const fs = require('fs');
const path = require('path');

// 날짜별 시드 생성 (같은 날은 같은 결과)
function getDailySeed() {
    const today = new Date();
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

// 질문 선택 로직
function selectDailyQuestions() {
    // 질문 풀 로드
    const poolPath = path.join(__dirname, '../data/question-pool.json');
    const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
    
    // 오늘의 시드
    const seed = getDailySeed();
    
    // 카테고리별로 질문 선택
    const selectedQuestions = [];
    const categories = Object.keys(pool.categories);
    
    // 각 카테고리에서 최소 1개씩 선택
    categories.forEach((category, index) => {
        const questions = pool.categories[category];
        const shuffled = shuffleArray(questions, seed + index);
        selectedQuestions.push(shuffled[0]);
    });
    
    // 나머지 자리는 랜덤으로 채우기 (총 10개)
    const allQuestions = [];
    categories.forEach(category => {
        allQuestions.push(...pool.categories[category]);
    });
    
    const shuffledAll = shuffleArray(allQuestions, seed + 100);
    
    while (selectedQuestions.length < 10) {
        const nextQuestion = shuffledAll.find(q => 
            !selectedQuestions.some(selected => selected.id === q.id)
        );
        if (nextQuestion) {
            selectedQuestions.push(nextQuestion);
        }
    }
    
    // 최종 10개 셔플
    return shuffleArray(selectedQuestions.slice(0, 10), seed + 200);
}

// 결과 메시지 선택
function selectDailyResults() {
    const poolPath = path.join(__dirname, '../data/question-pool.json');
    const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
    const seed = getDailySeed();
    
    const results = {};
    
    pool.results.age_ranges.forEach((range, index) => {
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

// 버전 정보 업데이트
function updateVersion() {
    const versionPath = path.join(__dirname, '../data/version.json');
    let versionData = { history: [] };
    
    if (fs.existsSync(versionPath)) {
        versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    }
    
    const today = new Date().toISOString().split('T')[0];
    const questions = selectDailyQuestions();
    const results = selectDailyResults();
    
    versionData.current = {
        date: today,
        seed: getDailySeed(),
        questionIds: questions.map(q => q.id),
        resultsConfig: results
    };
    
    // 히스토리에 추가 (최근 30일만 보관)
    versionData.history.unshift(versionData.current);
    versionData.history = versionData.history.slice(0, 30);
    
    fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));
    
    return { questions, results };
}

// index.html 업데이트
function updateIndexHtml() {
    const { questions, results } = updateVersion();
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
    
    // 결과 로직 업데이트
    let resultLogic = '';
    const ranges = [
        { min: 0, max: 20 },
        { min: 21, max: 30 },
        { min: 31, max: 40 },
        { min: 41, max: 50 },
        { min: 51, max: 100 }
    ];
    
    ranges.forEach((range, i) => {
        const key = `${range.min}_${range.max}`;
        const result = results[key];
        
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
    const resultPattern = /if \(age < 20\) \{[\s\S]*?\} else \{[\s\S]*?\}/;
    html = html.replace(resultPattern, resultLogic.trim());
    
    fs.writeFileSync(indexPath, html);
    
    console.log(`✅ Updated for ${new Date().toISOString().split('T')[0]}`);
    console.log(`📝 Selected ${questions.length} questions`);
    console.log(`🎯 Question IDs: ${questions.map(q => q.id).join(', ')}`);
}

// 실행
updateIndexHtml();