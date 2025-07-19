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

// 질문 선택 로직 (단순화)
function selectDailyQuestions() {
    // 질문 풀 로드
    const poolPath = path.join(__dirname, '../data/question-pool-ultra.json');
    const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
    
    // 오늘의 시드
    const seed = getDailySeed();
    
    // 전체 질문을 섞어서 10개 선택
    const allQuestions = pool.questions || [];
    const shuffled = shuffleArray(allQuestions, seed);
    
    return shuffled.slice(0, 10);
}

// 결과 메시지 선택
function selectDailyResults() {
    const seed = getDailySeed();
    
    // 결과 메시지 풀 (하드코딩)
    const resultPool = {
        age_ranges: [
            {
                min: 0, max: 20,
                emoji: "👶",
                titles: ["완전 애기네?", "순수함 그 자체", "피터팬 증후군", "막내 온 탑", "응애 나 애기"],
                descriptions: [
                    "순수함 그 자체... 세상 참 재밌게 사는구나? 근데 가끔은 어른스러워도 괜찮아 ㅋㅋ",
                    "아직 세상이 동화책처럼 보이나봐! 그 순수함 잃지 말고 쭉 가자~",
                    "매일이 놀이터! 근데 가끔은 현실도 봐야해 ㅋㅋㅋ"
                ]
            },
            {
                min: 21, max: 30,
                emoji: "😎",
                titles: ["딱 좋은 나이!", "청춘 그 자체", "인생 황금기", "열정 가득", "젊음의 절정"],
                descriptions: [
                    "열정도 있고 현실감각도 있고~ 인생 제일 재밌을 때야. 이 텐션 쭉 가져가!",
                    "젊음의 패기와 어른의 지혜가 공존! 지금이 네 전성기야~",
                    "뭘 해도 다 잘될 것 같은 나이! 이 기운 받아서 뭐든 도전해봐"
                ]
            },
            {
                min: 31, max: 40,
                emoji: "🧑‍💼",
                titles: ["어른스러운 편", "책임감 MAX", "든든한 어른", "성숙미 폭발", "어른이 중간쯤"],
                descriptions: [
                    "책임감 있고 든든한 스타일! 근데 가끔은 막 살아도 돼... 인생은 한 번뿐이잖아?",
                    "주변에서 의지하는 사람 많지? 근데 너도 가끔은 기대도 괜찮아!",
                    "어른미 뿜뿜~ 근데 너무 진지하게만 살지 마. 인생은 즐거워야지!"
                ]
            },
            {
                min: 41, max: 50,
                emoji: "🧘",
                titles: ["마음의 평화", "인생 2회차", "여유로운 현자", "달관의 경지", "노련미 장착"],
                descriptions: [
                    "세상 다 겪어본 관록이 느껴져~ 주변 사람들이 너한테 조언 많이 구하지? ㅋㅋ",
                    "인생 뭔지 다 아는 사람! 그 여유로움이 부러워~",
                    "나이는 숫자일 뿐이라지만... 넌 진짜 어른이구나!"
                ]
            },
            {
                min: 51, max: 100,
                emoji: "👴",
                titles: ["현자 모드", "인생 마스터", "깨달음의 경지", "신선 같은 나이", "인생 만렙"],
                descriptions: [
                    "와... 이 정도면 거의 도사급? 인생의 지혜가 몸에서 뿜어져 나와. 존경합니다!",
                    "모든 걸 달관한 현자의 자세... 근데 가끔은 젊게 살아도 괜찮아요!",
                    "인생 다 살아본 느낌? 이제 즐기면서 살면 되겠네~ 부럽다!"
                ]
            }
        ]
    };
    
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
    const resultPattern = /if \(age <= 20\) \{[\s\S]*?\} else \{[\s\S]*?\}/;
    html = html.replace(resultPattern, resultLogic.trim());
    
    fs.writeFileSync(indexPath, html);
    
    console.log(`✅ Updated for ${new Date().toISOString().split('T')[0]}`);
    console.log(`📝 Selected 10 questions from pool of ${questions.length > 0 ? '1000+' : '0'}`);
    console.log(`🎲 Today's seed: ${getDailySeed()}`);
}

// 실행
updateIndexHtml();