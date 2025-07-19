const fs = require('fs');
const path = require('path');

// 질문을 자연스럽게 수정하는 함수
function improveQuestion(question) {
  let improved = question;
  
  // 불필요한 수식어 제거
  improved = improved.replace(/^정말 정말\s+/, '');
  improved = improved.replace(/^요즘 진짜\s+/, '');
  improved = improved.replace(/^진짜 요즘 진짜\s+/, '');
  improved = improved.replace(/^솔직히\s+/, '');
  improved = improved.replace(/^요즘 요즘 진짜\s+/, '');
  improved = improved.replace(/^정말\s+/, '');
  improved = improved.replace(/^요즘\s+/, '');
  
  // 중복된 표현 제거
  improved = improved.replace(/요즘 기분 좋을 때/, '기분 좋을 때');
  improved = improved.replace(/정말 충동구매/, '충동구매');
  
  // 특정 패턴별 개선
  const patterns = [
    // 인스타 관련
    { pattern: /^인스타 스토리 올릴 때$/, replacement: '인스타 스토리는 어떻게 올리시나요?' },
    { pattern: /^아침에 인스타 스토리 올릴 때$/, replacement: '아침에 인스타 스토리를 올린다면 어떻게 하시나요?' },
    { pattern: /^피곤할 때 인스타 스토리 올릴 때$/, replacement: '피곤할 때도 인스타 스토리를 올리시나요?' },
    { pattern: /^인스타 팔로워 관리는$/, replacement: '인스타 팔로워는 어떻게 관리하시나요?' },
    { pattern: /^릴스 보는 시간은$/, replacement: '인스타 릴스는 하루에 얼마나 보시나요?' },
    
    // 틱톡 관련
    { pattern: /^틱톡 춤 추라고 하면$/, replacement: '틱톡 챌린지 춤을 추라고 하면 어떻게 하시나요?' },
    { pattern: /^FYP\(For You Page\)는$/, replacement: '틱톡 FYP(For You Page) 알고리즘은 어떻게 생각하시나요?' },
    
    // 트위터 관련
    { pattern: /^트위터\(X\) 사용법은$/, replacement: '트위터(X)는 주로 어떻게 사용하시나요?' },
    { pattern: /^트윗할 때 스타일은$/, replacement: '트윗을 작성할 때 어떤 스타일을 선호하시나요?' },
    { pattern: /^주말에 트윗할 때 스타일은$/, replacement: '주말에 트윗을 작성할 때는 어떤 스타일인가요?' },
    
    // 유튜브 관련
    { pattern: /^유튜브 프리미엄은$/, replacement: '유튜브 프리미엄에 대해 어떻게 생각하시나요?' },
    { pattern: /^구독 채널 수는$/, replacement: '유튜브 구독 채널은 몇 개나 되시나요?' },
    { pattern: /^유튜브 시청 시간은$/, replacement: '유튜브는 하루에 얼마나 시청하시나요?' },
    { pattern: /^유튜브 쇼츠는$/, replacement: '유튜브 쇼츠를 자주 보시나요?' },
    { pattern: /^아침에 유튜브 쇼츠는$/, replacement: '아침에 유튜브 쇼츠를 보시나요?' },
    
    // 디스코드 관련
    { pattern: /^디스코드 사용 빈도는$/, replacement: '디스코드는 얼마나 자주 사용하시나요?' },
    { pattern: /^디코 닉네임 스타일은$/, replacement: '디스코드 닉네임은 어떤 스타일로 정하시나요?' },
    { pattern: /^주말에 디코 닉네임 스타일은$/, replacement: '주말에 디스코드를 사용할 때 닉네임은 어떻게 정하시나요?' },
    { pattern: /^디스코드 서버 개수는$/, replacement: '참여 중인 디스코드 서버는 몇 개나 되나요?' },
    { pattern: /^휴일에 디스코드 서버 개수는$/, replacement: '휴일에 활발히 활동하는 디스코드 서버는 몇 개나 되나요?' },
    
    // 게임 관련
    { pattern: /^게이밍 셋업은$/, replacement: '게이밍 환경은 어떻게 구성하셨나요?' },
    { pattern: /^주말에 게이밍 셋업은$/, replacement: '주말 게이밍 환경은 어떻게 되나요?' },
    { pattern: /^스팀 게임 개수는$/, replacement: '스팀 라이브러리에 게임이 몇 개나 있나요?' },
    { pattern: /^점심에 스팀 게임 개수는$/, replacement: '점심시간에 즐길 수 있는 스팀 게임은 몇 개나 있나요?' },
    { pattern: /^우울할 때 스팀 게임 개수는$/, replacement: '기분 전환용으로 플레이하는 스팀 게임은 몇 개나 있나요?' },
    { pattern: /^게임할 때 포지션은$/, replacement: '팀 게임에서 어떤 포지션을 선호하시나요?' },
    { pattern: /^모바일 게임 스타일은$/, replacement: '모바일 게임은 어떤 장르를 선호하시나요?' },
    { pattern: /^아침에 모바일 게임 스타일은$/, replacement: '아침에 모바일 게임을 한다면 어떤 게임을 하시나요?' },
    
    // 기술 관련
    { pattern: /^스마트폰 교체 주기는$/, replacement: '스마트폰은 얼마나 자주 바꾸시나요?' },
    { pattern: /^점심에 스마트폰 교체 주기는$/, replacement: '스마트폰 교체에 대해 어떻게 생각하시나요?' },
    { pattern: /^사용하는 앱 개수는$/, replacement: '스마트폰에 설치된 앱은 몇 개나 되나요?' },
    { pattern: /^배터리 잔량 불안은$/, replacement: '휴대폰 배터리는 보통 몇 %에서 충전하시나요?' },
    { pattern: /^휴일에 배터리 잔량 불안은$/, replacement: '휴일에는 휴대폰 배터리를 몇 %에서 충전하시나요?' },
    { pattern: /^코딩에 대한 생각은$/, replacement: '프로그래밍에 대해 어떻게 생각하시나요?' },
    { pattern: /^ChatGPT 사용법은$/, replacement: 'ChatGPT는 주로 어떤 용도로 사용하시나요?' },
    { pattern: /^암호화폐에 대한 생각은$/, replacement: '암호화폐에 대해 어떻게 생각하시나요?' },
    { pattern: /^NFT는$/, replacement: 'NFT에 대해 어떻게 생각하시나요?' },
    { pattern: /^점심에 NFT는$/, replacement: 'NFT 투자에 관심이 있으신가요?' },
    
    // 밈 관련
    { pattern: /^최신 밈 이해도는$/, replacement: '최신 인터넷 밈을 얼마나 잘 아시나요?' },
    { pattern: /^기분 좋을 때 최신 밈 이해도는$/, replacement: '기분 좋을 때 인터넷 밈을 자주 사용하시나요?' },
    { pattern: /^밈 사용 빈도는$/, replacement: '일상 대화에서 밈을 얼마나 자주 사용하시나요?' },
    { pattern: /^'아 ㅋㅋ'하면 떠오르는 건$/, replacement: '\'아 ㅋㅋ\'하면 무엇이 떠오르시나요?' },
    
    // 엔터테인먼트 관련
    { pattern: /^도네이션은$/, replacement: '스트리머에게 도네이션을 하시나요?' },
    { pattern: /^주말에 도네이션은$/, replacement: '주말에 스트리밍을 보면서 도네이션을 하시나요?' },
    { pattern: /^애니 시청 스타일은$/, replacement: '애니메이션은 어떤 방식으로 시청하시나요?' },
    { pattern: /^기분 좋을 때 애니 시청 스타일은$/, replacement: '기분 좋을 때 보는 애니메이션 장르는 무엇인가요?' },
    { pattern: /^만화책은$/, replacement: '만화책을 자주 읽으시나요?' },
    { pattern: /^K-POP 덕질 레벨은$/, replacement: 'K-POP 팬 활동은 어느 정도 하시나요?' },
    { pattern: /^점심에 K-POP 덕질 레벨은$/, replacement: '점심시간에 K-POP 영상을 보시나요?' },
    { pattern: /^아이돌 콘서트는$/, replacement: '아이돌 콘서트에 자주 가시나요?' },
    { pattern: /^트위치 시청 시간은$/, replacement: '트위치는 하루에 얼마나 시청하시나요?' },
    
    // 일반적인 패턴 (더 구체적인 패턴 다음에 배치)
    { pattern: /^(.+)에 대한 생각은$/, replacement: '$1에 대해 어떻게 생각하시나요?' },
    { pattern: /^(.+) 빈도는$/, replacement: '$1 빈도는 어떻게 되나요?' },
    { pattern: /^(.+) 스타일은$/, replacement: '$1 스타일은 어떤가요?' },
    { pattern: /^(.+) 생각은$/, replacement: '$1에 대해 어떻게 생각하시나요?' },
    { pattern: /^(.+) 방법은$/, replacement: '$1 방법은 무엇인가요?' },
    { pattern: /^(.+)할 때$/, replacement: '$1할 때는 어떻게 하시나요?' },
    { pattern: /^(.+)에 대한 태도는$/, replacement: '$1에 대해 어떤 태도를 가지고 계신가요?' },
    { pattern: /^(.+) 반응은$/, replacement: '$1에 어떻게 반응하시나요?' },
    { pattern: /^(.+) 선호도는$/, replacement: '$1을 얼마나 선호하시나요?' },
    { pattern: /^(.+)는$/, replacement: '$1은 어떤가요?' },
    { pattern: /^(.+)은$/, replacement: '$1은 어떤가요?' },
    
    // 특수 케이스
    { pattern: /^충동구매 빈도는$/, replacement: '충동구매를 얼마나 자주 하시나요?' },
    { pattern: /^야근에 대한 생각은$/, replacement: '야근에 대해 어떻게 생각하시나요?' },
    { pattern: /^여행 계획은$/, replacement: '여행 계획은 어떻게 세우시나요?' },
    { pattern: /^은퇴 계획은$/, replacement: '은퇴 후 계획이 있으신가요?' },
    { pattern: /^저녁에 은퇴 계획은$/, replacement: '은퇴 후의 삶을 어떻게 상상하시나요?' },
    { pattern: /^요리 실력은$/, replacement: '요리 실력은 어느 정도라고 생각하시나요?' },
    { pattern: /^리뷰 작성은$/, replacement: '온라인 리뷰는 자주 작성하시나요?' },
    { pattern: /^창작 활동은$/, replacement: '창작 활동을 하시나요?' },
    { pattern: /^옷 쇼핑 스타일은$/, replacement: '옷은 주로 어떻게 구매하시나요?' },
    { pattern: /^패션 정보는$/, replacement: '패션 정보는 어디서 얻으시나요?' },
    { pattern: /^타임머신이 있다면$/, replacement: '타임머신이 있다면 언제로 가고 싶으신가요?' },
    { pattern: /^할인 쿠폰은$/, replacement: '할인 쿠폰을 자주 사용하시나요?' },
    { pattern: /^과금에 대한 생각은$/, replacement: '게임 내 과금에 대해 어떻게 생각하시나요?' }
  ];
  
  // 패턴 매칭 적용
  for (const { pattern, replacement } of patterns) {
    if (pattern.test(improved)) {
      improved = improved.replace(pattern, replacement);
      break;
    }
  }
  
  // 마지막 정리
  improved = improved.trim();
  
  // 물음표로 끝나지 않는 질문에 물음표 추가
  if (!improved.endsWith('?') && !improved.endsWith('!') && !improved.includes('하면')) {
    improved += '?';
  }
  
  return improved;
}

// 메인 함수
function main() {
  const inputPath = path.join(__dirname, '../data/question-pool-ultra.json');
  const outputPath = path.join(__dirname, '../data/question-pool-ultra-improved.json');
  
  // 파일 읽기
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  // 각 질문 개선
  let improvedCount = 0;
  data.questions = data.questions.map(question => {
    const originalQ = question.q;
    const improvedQ = improveQuestion(originalQ);
    
    if (originalQ !== improvedQ) {
      improvedCount++;
      console.log(`개선됨: "${originalQ}" → "${improvedQ}"`);
    }
    
    return {
      ...question,
      q: improvedQ
    };
  });
  
  // 파일 저장
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  
  console.log(`\n총 ${data.questions.length}개 질문 중 ${improvedCount}개 개선됨`);
  console.log(`결과가 ${outputPath}에 저장되었습니다.`);
}

// 실행
main();