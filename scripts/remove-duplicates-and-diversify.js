const fs = require('fs');
const path = require('path');

// 새로운 질문 풀 (세대별 특성을 잘 드러내는 질문들)
const newQuestions = {
  social_media: [
    {
      subcategory: "platform_preference",
      q: "SNS 플랫폼 중 가장 자주 사용하는 건?",
      a: [
        { t: "틱톡이 최고야", v: 18 },
        { t: "인스타그램이지", v: 25 },
        { t: "페이스북 아직도 씀", v: 35 },
        { t: "트위터(X)가 진리", v: 28 }
      ]
    },
    {
      subcategory: "cyworld",
      q: "싸이월드 BGM이 들리면?",
      a: [
        { t: "그게 뭐야?", v: 15 },
        { t: "아련하다...", v: 35 },
        { t: "도토리 깎던 시절", v: 40 },
        { t: "일촌평 생각남", v: 38 }
      ]
    },
    {
      subcategory: "messenger",
      q: "처음 쓴 메신저는?",
      a: [
        { t: "카톡이 처음", v: 18 },
        { t: "네이트온", v: 30 },
        { t: "MSN 메신저", v: 35 },
        { t: "버디버디", v: 40 }
      ]
    },
    {
      subcategory: "content_creation",
      q: "숏폼 콘텐츠 제작 경험은?",
      a: [
        { t: "매일 올림", v: 20 },
        { t: "가끔 도전", v: 25 },
        { t: "보기만 함", v: 30 },
        { t: "관심 없음", v: 40 }
      ]
    },
    {
      subcategory: "influencer",
      q: "인플루언서가 추천하면?",
      a: [
        { t: "바로 구매 검토", v: 20 },
        { t: "리뷰 더 찾아봄", v: 28 },
        { t: "반신반의함", v: 35 },
        { t: "광고인지 의심", v: 40 }
      ]
    }
  ],
  gaming: [
    {
      subcategory: "classic",
      q: "스타크래프트 하면 떠오르는 건?",
      a: [
        { t: "그게 뭐야?", v: 15 },
        { t: "아재 게임", v: 20 },
        { t: "PC방 추억", v: 35 },
        { t: "아직도 가끔 함", v: 40 }
      ]
    },
    {
      subcategory: "metaverse",
      q: "로블록스나 제페토 같은 메타버스는?",
      a: [
        { t: "자주 접속함", v: 15 },
        { t: "가끔 구경", v: 20 },
        { t: "이해 안 됨", v: 35 },
        { t: "관심 없음", v: 40 }
      ]
    },
    {
      subcategory: "mobile",
      q: "첫 모바일 게임은?",
      a: [
        { t: "브롤스타즈", v: 15 },
        { t: "클래시 오브 클랜", v: 22 },
        { t: "애니팡", v: 30 },
        { t: "뱀 게임", v: 40 }
      ]
    },
    {
      subcategory: "esports",
      q: "e스포츠 경기 시청은?",
      a: [
        { t: "열심히 챙겨봄", v: 20 },
        { t: "가끔 하이라이트만", v: 25 },
        { t: "관심 있지만 안 봄", v: 30 },
        { t: "게임을 왜 봐?", v: 40 }
      ]
    },
    {
      subcategory: "vr",
      q: "VR 게임 경험은?",
      a: [
        { t: "집에 VR 기기 있음", v: 25 },
        { t: "체험해본 적 있음", v: 30 },
        { t: "해보고 싶음", v: 35 },
        { t: "어지러울 것 같아", v: 40 }
      ]
    }
  ],
  technology: [
    {
      subcategory: "ai",
      q: "AI 어시스턴트 사용 빈도는?",
      a: [
        { t: "거의 매일 사용", v: 25 },
        { t: "가끔 필요할 때만", v: 30 },
        { t: "써본 적 있음", v: 35 },
        { t: "필요성 못 느낌", v: 45 }
      ]
    },
    {
      subcategory: "smart_home",
      q: "스마트홈 기기는?",
      a: [
        { t: "집안 가득함", v: 28 },
        { t: "스피커 정도만", v: 30 },
        { t: "관심은 있음", v: 35 },
        { t: "필요 없음", v: 45 }
      ]
    },
    {
      subcategory: "payment",
      q: "주로 사용하는 결제 수단은?",
      a: [
        { t: "삼성/애플페이", v: 25 },
        { t: "카카오페이", v: 28 },
        { t: "신용카드", v: 35 },
        { t: "현금", v: 45 }
      ]
    },
    {
      subcategory: "cloud",
      q: "사진 백업은 주로?",
      a: [
        { t: "클라우드 자동 백업", v: 25 },
        { t: "가끔 수동 백업", v: 30 },
        { t: "컴퓨터에 저장", v: 35 },
        { t: "백업 안 함", v: 40 }
      ]
    },
    {
      subcategory: "gadget",
      q: "웨어러블 기기 사용은?",
      a: [
        { t: "스마트워치 필수", v: 28 },
        { t: "운동할 때만", v: 30 },
        { t: "선물 받았지만...", v: 35 },
        { t: "시계는 시계", v: 45 }
      ]
    }
  ],
  lifestyle: [
    {
      subcategory: "work_life",
      q: "워라밸에 대한 생각은?",
      a: [
        { t: "절대 양보 못 함", v: 25 },
        { t: "중요하지만 융통성", v: 30 },
        { t: "일이 우선", v: 40 },
        { t: "상황에 따라", v: 35 }
      ]
    },
    {
      subcategory: "subscription",
      q: "구독 서비스 개수는?",
      a: [
        { t: "5개 이상", v: 25 },
        { t: "2-3개 정도", v: 30 },
        { t: "1개", v: 35 },
        { t: "구독 안 함", v: 45 }
      ]
    },
    {
      subcategory: "minimalism",
      q: "미니멀 라이프에 대해?",
      a: [
        { t: "실천 중", v: 30 },
        { t: "동경함", v: 28 },
        { t: "나랑 안 맞아", v: 35 },
        { t: "뭔지 모름", v: 40 }
      ]
    },
    {
      subcategory: "eco",
      q: "텀블러 사용 빈도는?",
      a: [
        { t: "항상 들고 다님", v: 28 },
        { t: "가끔 생각날 때", v: 30 },
        { t: "집에만 있음", v: 35 },
        { t: "없음", v: 40 }
      ]
    },
    {
      subcategory: "wellness",
      q: "명상이나 요가는?",
      a: [
        { t: "루틴에 포함", v: 30 },
        { t: "앱으로 가끔", v: 28 },
        { t: "해보고 싶음", v: 35 },
        { t: "관심 없음", v: 40 }
      ]
    }
  ],
  relationships: [
    {
      subcategory: "dating",
      q: "소개팅 앱에 대한 생각은?",
      a: [
        { t: "적극 활용", v: 25 },
        { t: "한번쯤은", v: 28 },
        { t: "아직은 부담", v: 35 },
        { t: "절대 안 해", v: 40 }
      ]
    },
    {
      subcategory: "marriage",
      q: "결혼에 대한 생각은?",
      a: [
        { t: "선택사항", v: 25 },
        { t: "하고 싶지만 여건이", v: 30 },
        { t: "당연히 해야지", v: 40 },
        { t: "아직 모르겠음", v: 28 }
      ]
    },
    {
      subcategory: "friendship",
      q: "친구들과 주로 만나는 방법은?",
      a: [
        { t: "온라인으로 충분", v: 20 },
        { t: "온오프 반반", v: 28 },
        { t: "직접 만나야 함", v: 35 },
        { t: "자주 안 만남", v: 40 }
      ]
    },
    {
      subcategory: "communication",
      q: "부모님과의 연락은?",
      a: [
        { t: "매일 카톡", v: 25 },
        { t: "주 1-2회 통화", v: 30 },
        { t: "명절에만", v: 35 },
        { t: "필요할 때만", v: 40 }
      ]
    }
  ],
  finance: [
    {
      subcategory: "investment",
      q: "주식 투자 경험은?",
      a: [
        { t: "MTS로 활발히", v: 25 },
        { t: "소액으로 시작", v: 28 },
        { t: "관심만 있음", v: 35 },
        { t: "도박 같아서 안 해", v: 40 }
      ]
    },
    {
      subcategory: "crypto",
      q: "암호화폐 투자는?",
      a: [
        { t: "여러 종류 보유", v: 22 },
        { t: "비트코인 정도만", v: 28 },
        { t: "공부 중", v: 30 },
        { t: "사기 같음", v: 45 }
      ]
    },
    {
      subcategory: "saving",
      q: "저축 방법은?",
      a: [
        { t: "자동이체가 답", v: 30 },
        { t: "챌린지로 재미있게", v: 25 },
        { t: "남으면 저축", v: 35 },
        { t: "저축이 뭐야", v: 20 }
      ]
    },
    {
      subcategory: "bnpl",
      q: "무이자 할부나 BNPL은?",
      a: [
        { t: "적극 활용", v: 25 },
        { t: "큰 금액만", v: 30 },
        { t: "현금이 최고", v: 40 },
        { t: "빚은 무서워", v: 35 }
      ]
    }
  ],
  generation: [
    {
      subcategory: "school",
      q: "학창시절 급식 추억은?",
      a: [
        { t: "초코우유 쟁탈전", v: 20 },
        { t: "김치볶음밥 최고", v: 25 },
        { t: "도시락 싸왔음", v: 35 },
        { t: "급식이 없었음", v: 45 }
      ]
    },
    {
      subcategory: "music",
      q: "음악 듣는 방법의 변화는?",
      a: [
        { t: "스트리밍만 써봄", v: 18 },
        { t: "MP3에서 시작", v: 28 },
        { t: "CD 플레이어 있었음", v: 35 },
        { t: "카세트테이프도 씀", v: 45 }
      ]
    },
    {
      subcategory: "tv",
      q: "어린 시절 TV 프로그램은?",
      a: [
        { t: "유튜브가 TV", v: 15 },
        { t: "투니버스 세대", v: 25 },
        { t: "지상파 예능 전성기", v: 35 },
        { t: "주말의 명화", v: 45 }
      ]
    },
    {
      subcategory: "trend",
      q: "'갓생'이라는 단어를 들으면?",
      a: [
        { t: "내 목표야", v: 20 },
        { t: "부담스러워", v: 25 },
        { t: "뭔 뜻이야?", v: 40 },
        { t: "그냥 열심히 살자", v: 35 }
      ]
    }
  ],
  food_dining: [
    {
      subcategory: "delivery",
      q: "배달 앱 사용 빈도는?",
      a: [
        { t: "거의 매일", v: 25 },
        { t: "주 2-3회", v: 28 },
        { t: "특별한 날만", v: 35 },
        { t: "직접 가서 먹음", v: 45 }
      ]
    },
    {
      subcategory: "coffee",
      q: "커피 취향은?",
      a: [
        { t: "스페셜티 원두", v: 30 },
        { t: "프랜차이즈 커피", v: 25 },
        { t: "믹스커피가 최고", v: 40 },
        { t: "커피 안 마심", v: 35 }
      ]
    },
    {
      subcategory: "diet",
      q: "비건이나 특별한 식단은?",
      a: [
        { t: "실천 중", v: 28 },
        { t: "간헐적으로", v: 30 },
        { t: "관심은 있음", v: 35 },
        { t: "고기가 최고", v: 40 }
      ]
    },
    {
      subcategory: "dining",
      q: "혼밥에 대한 생각은?",
      a: [
        { t: "완전 편함", v: 25 },
        { t: "익숙해짐", v: 30 },
        { t: "가끔은 괜찮아", v: 35 },
        { t: "같이 먹어야 맛있지", v: 45 }
      ]
    }
  ],
  shopping: [
    {
      subcategory: "online",
      q: "새벽 배송 서비스는?",
      a: [
        { t: "없으면 못 살아", v: 25 },
        { t: "편리해서 자주", v: 28 },
        { t: "비싸서 가끔만", v: 35 },
        { t: "마트 가는 게 나아", v: 45 }
      ]
    },
    {
      subcategory: "secondhand",
      q: "중고거래 플랫폼은?",
      a: [
        { t: "당근 프로", v: 25 },
        { t: "가끔 이용", v: 30 },
        { t: "믿을 수 없어", v: 40 },
        { t: "새 것만 사용", v: 45 }
      ]
    },
    {
      subcategory: "luxury",
      q: "명품에 대한 생각은?",
      a: [
        { t: "플렉스 문화 이해", v: 22 },
        { t: "가성비가 중요", v: 28 },
        { t: "특별한 날 선물", v: 35 },
        { t: "사치스러워", v: 45 }
      ]
    },
    {
      subcategory: "review",
      q: "구매 전 리뷰 확인은?",
      a: [
        { t: "유튜브 리뷰 필수", v: 25 },
        { t: "별점과 후기 확인", v: 30 },
        { t: "대충 보고 구매", v: 35 },
        { t: "직접 봐야 앎", v: 45 }
      ]
    }
  ],
  hobbies: [
    {
      subcategory: "content",
      q: "취미 관련 콘텐츠 소비는?",
      a: [
        { t: "유튜브 알고리즘 신뢰", v: 25 },
        { t: "인스타 릴스로", v: 22 },
        { t: "네이버 카페 활동", v: 35 },
        { t: "책이나 잡지", v: 45 }
      ]
    },
    {
      subcategory: "outdoor",
      q: "캠핑이나 차박은?",
      a: [
        { t: "장비 다 갖춤", v: 30 },
        { t: "글램핑 정도", v: 28 },
        { t: "해보고 싶음", v: 35 },
        { t: "집이 최고", v: 40 }
      ]
    },
    {
      subcategory: "creative",
      q: "DIY나 만들기는?",
      a: [
        { t: "유튜브 보고 따라함", v: 25 },
        { t: "키트로 시작", v: 28 },
        { t: "손재주 없음", v: 35 },
        { t: "시간 낭비", v: 40 }
      ]
    },
    {
      subcategory: "collecting",
      q: "수집 취미는?",
      a: [
        { t: "디지털 굿즈 수집", v: 20 },
        { t: "피규어나 굿즈", v: 25 },
        { t: "앨범이나 책", v: 35 },
        { t: "짐만 늘어남", v: 45 }
      ]
    }
  ],
  health: [
    {
      subcategory: "fitness",
      q: "운동 방법은?",
      a: [
        { t: "홈트 유튜브", v: 25 },
        { t: "헬스장 PT", v: 28 },
        { t: "동네 산책", v: 40 },
        { t: "운동이 뭐야", v: 35 }
      ]
    },
    {
      subcategory: "mental",
      q: "정신 건강 관리는?",
      a: [
        { t: "상담 받고 있음", v: 28 },
        { t: "명상 앱 사용", v: 25 },
        { t: "친구와 수다", v: 35 },
        { t: "그냥 참음", v: 45 }
      ]
    },
    {
      subcategory: "sleep",
      q: "수면 패턴은?",
      a: [
        { t: "수면 앱으로 관리", v: 25 },
        { t: "불규칙하지만 노력", v: 28 },
        { t: "일찍 자고 일찍 일어남", v: 40 },
        { t: "새벽형 인간", v: 30 }
      ]
    }
  ],
  education: [
    {
      subcategory: "online",
      q: "온라인 강의는?",
      a: [
        { t: "여러 개 수강 중", v: 25 },
        { t: "필요할 때만", v: 30 },
        { t: "유튜브로 충분", v: 28 },
        { t: "오프라인이 나아", v: 40 }
      ]
    },
    {
      subcategory: "skill",
      q: "새로운 스킬 학습은?",
      a: [
        { t: "유튜브 독학", v: 25 },
        { t: "온라인 클래스", v: 28 },
        { t: "학원 등록", v: 35 },
        { t: "배울 시간 없음", v: 40 }
      ]
    }
  ],
  environment: [
    {
      subcategory: "recycling",
      q: "분리수거는?",
      a: [
        { t: "완벽하게 실천", v: 28 },
        { t: "대충은 함", v: 30 },
        { t: "헷갈림", v: 25 },
        { t: "귀찮음", v: 35 }
      ]
    },
    {
      subcategory: "consumption",
      q: "친환경 제품 구매는?",
      a: [
        { t: "적극적으로", v: 28 },
        { t: "가격 맞으면", v: 30 },
        { t: "특별히 안 찾음", v: 35 },
        { t: "비싸서 패스", v: 40 }
      ]
    }
  ],
  travel: [
    {
      subcategory: "style",
      q: "여행 계획은?",
      a: [
        { t: "엑셀로 분 단위", v: 30 },
        { t: "대략적인 일정만", v: 28 },
        { t: "그때그때 기분따라", v: 25 },
        { t: "패키지가 편해", v: 40 }
      ]
    },
    {
      subcategory: "accommodation",
      q: "숙소 선택 기준은?",
      a: [
        { t: "에어비앤비 선호", v: 25 },
        { t: "호텔이 안전", v: 35 },
        { t: "게스트하우스", v: 28 },
        { t: "지인 집", v: 30 }
      ]
    }
  ],
  communication: [
    {
      subcategory: "emoji",
      q: "이모지 사용은?",
      a: [
        { t: "거의 모든 문장에", v: 20 },
        { t: "포인트로만", v: 28 },
        { t: "어색해서 안 씀", v: 40 },
        { t: "ㅋㅋ가 편해", v: 35 }
      ]
    },
    {
      subcategory: "voice",
      q: "음성 메시지는?",
      a: [
        { t: "자주 보냄", v: 25 },
        { t: "급할 때만", v: 30 },
        { t: "듣기만 함", v: 35 },
        { t: "부담스러워", v: 40 }
      ]
    }
  ],
  fun: [
    {
      subcategory: "humor",
      q: "밈이나 짤에 대한 반응은?",
      a: [
        { t: "직접 만들기도", v: 20 },
        { t: "열심히 수집", v: 25 },
        { t: "보면 웃음", v: 30 },
        { t: "이해 못 함", v: 45 }
      ]
    },
    {
      subcategory: "karaoke",
      q: "노래방 선곡은?",
      a: [
        { t: "최신 차트", v: 20 },
        { t: "아이돌 댄스곡", v: 25 },
        { t: "7080 발라드", v: 45 },
        { t: "부르기 쉬운 곡", v: 35 }
      ]
    }
  ]
};

// 질문 ID 생성 함수
function generateQuestionId(category, subcategory, index) {
  return `${category}_${subcategory}_${index}`;
}

// 추가 질문 생성 함수
function generateAdditionalQuestions() {
  const additional = [
    // Work & Career
    {
      category: "work",
      subcategory: "meetings",
      q: "화상회의 중 카메라는?",
      a: [
        { t: "항상 켜놓음", v: 25 },
        { t: "필요할 때만", v: 30 },
        { t: "절대 안 켬", v: 35 },
        { t: "배경 고민됨", v: 28 }
      ]
    },
    {
      category: "work",
      subcategory: "career",
      q: "이직에 대한 생각은?",
      a: [
        { t: "항상 기회 엿봄", v: 25 },
        { t: "좋은 곳 있으면", v: 30 },
        { t: "한 곳에 정착", v: 40 },
        { t: "창업이 목표", v: 28 }
      ]
    },
    {
      category: "work",
      subcategory: "side_hustle",
      q: "부업이나 N잡은?",
      a: [
        { t: "이미 여러 개", v: 25 },
        { t: "하나 준비 중", v: 28 },
        { t: "본업에 집중", v: 35 },
        { t: "시간이 없어", v: 40 }
      ]
    },
    // Personal Growth
    {
      category: "personal_growth",
      subcategory: "habits",
      q: "미라클 모닝은?",
      a: [
        { t: "매일 실천", v: 30 },
        { t: "도전했다가 실패", v: 28 },
        { t: "관심은 있음", v: 25 },
        { t: "아침잠이 최고", v: 35 }
      ]
    },
    {
      category: "personal_growth",
      subcategory: "reading",
      q: "독서 습관은?",
      a: [
        { t: "전자책 구독", v: 28 },
        { t: "종이책 선호", v: 35 },
        { t: "오디오북 애용", v: 25 },
        { t: "유튜브 요약", v: 20 }
      ]
    },
    // Pop Culture
    {
      category: "pop_culture",
      subcategory: "streaming",
      q: "넷플릭스 시청 패턴은?",
      a: [
        { t: "정주행 마스터", v: 25 },
        { t: "추천 알고리즘 신뢰", v: 28 },
        { t: "한국 콘텐츠만", v: 35 },
        { t: "계정 공유", v: 30 }
      ]
    },
    {
      category: "pop_culture",
      subcategory: "trends",
      q: "챌린지 참여는?",
      a: [
        { t: "트렌드 선도", v: 20 },
        { t: "재미있으면 참여", v: 25 },
        { t: "구경만", v: 35 },
        { t: "유치해 보임", v: 40 }
      ]
    },
    // Future & Innovation
    {
      category: "future",
      subcategory: "tech",
      q: "전기차에 대한 생각은?",
      a: [
        { t: "다음 차는 전기차", v: 28 },
        { t: "아직은 시기상조", v: 35 },
        { t: "충전이 불편할 듯", v: 40 },
        { t: "차가 필요 없음", v: 25 }
      ]
    },
    {
      category: "future",
      subcategory: "society",
      q: "10년 후 내 모습은?",
      a: [
        { t: "디지털 노마드", v: 25 },
        { t: "전문가로 성장", v: 30 },
        { t: "안정적인 가정", v: 35 },
        { t: "은퇴 준비", v: 45 }
      ]
    },
    // More diverse questions
    {
      category: "technology",
      subcategory: "security",
      q: "비밀번호 관리는?",
      a: [
        { t: "앱으로 완벽 관리", v: 28 },
        { t: "몇 개 돌려씀", v: 30 },
        { t: "머릿속에 저장", v: 35 },
        { t: "포스트잇에 적음", v: 45 }
      ]
    },
    {
      category: "lifestyle",
      subcategory: "morning",
      q: "아침 루틴의 시작은?",
      a: [
        { t: "스마트폰 확인", v: 25 },
        { t: "스트레칭", v: 30 },
        { t: "커피 한 잔", v: 35 },
        { t: "뉴스 시청", v: 45 }
      ]
    },
    {
      category: "finance",
      subcategory: "mindset",
      q: "돈에 대한 가치관은?",
      a: [
        { t: "경험에 투자", v: 25 },
        { t: "미래를 위한 저축", v: 35 },
        { t: "현재를 즐기자", v: 28 },
        { t: "안정이 최우선", v: 40 }
      ]
    },
    {
      category: "health",
      subcategory: "diet",
      q: "다이어트 방법은?",
      a: [
        { t: "간헐적 단식", v: 28 },
        { t: "운동으로 해결", v: 30 },
        { t: "작심삼일", v: 25 },
        { t: "살 안 찜", v: 35 }
      ]
    },
    {
      category: "education",
      subcategory: "language",
      q: "외국어 공부는?",
      a: [
        { t: "앱으로 매일", v: 25 },
        { t: "유튜브로 독학", v: 28 },
        { t: "학원 등록", v: 35 },
        { t: "번역기면 충분", v: 30 }
      ]
    },
    {
      category: "environment",
      subcategory: "transport",
      q: "주 이동수단은?",
      a: [
        { t: "대중교통 + 공유킥보드", v: 25 },
        { t: "자가용 필수", v: 35 },
        { t: "자전거 애용", v: 30 },
        { t: "걷기 좋아함", v: 40 }
      ]
    },
    {
      category: "travel",
      subcategory: "preference",
      q: "여행 스타일은?",
      a: [
        { t: "혼자 자유여행", v: 28 },
        { t: "친구와 함께", v: 25 },
        { t: "가족 여행", v: 35 },
        { t: "패키지 투어", v: 45 }
      ]
    },
    {
      category: "communication",
      subcategory: "conflict",
      q: "의견 충돌 시 대처는?",
      a: [
        { t: "DM으로 해결", v: 25 },
        { t: "직접 대화", v: 35 },
        { t: "시간을 두고", v: 30 },
        { t: "그냥 넘어감", v: 28 }
      ]
    },
    {
      category: "fun",
      subcategory: "weekend",
      q: "주말 보내는 방법은?",
      a: [
        { t: "넷플 정주행", v: 25 },
        { t: "카페 투어", v: 28 },
        { t: "집에서 휴식", v: 35 },
        { t: "야외 활동", v: 30 }
      ]
    }
  ];
  
  // ID 생성
  return additional.map((q, idx) => ({
    id: generateQuestionId(q.category, q.subcategory, `add_${idx + 1}`),
    ...q
  }));
}

// 질문 변형 생성 함수
function generateQuestionVariations(existingQuestions, needed) {
  const variations = [];
  const contexts = ['출근길에', '퇴근 후', '휴가 중에', '스트레스 받을 때', '월급날에', '연말에', '새해에', '생일날'];
  const modifiers = ['요즘', '최근', '주로', '보통'];
  
  for (let i = 0; i < needed && i < existingQuestions.length; i++) {
    const original = existingQuestions[i % existingQuestions.length];
    const context = contexts[i % contexts.length];
    const modifier = modifiers[i % modifiers.length];
    
    // 답변 점수 약간 조정
    const adjustedAnswers = original.a.map(answer => ({
      ...answer,
      v: Math.min(50, Math.max(15, answer.v + (Math.random() * 10 - 5)))
    }));
    
    variations.push({
      id: `${original.id}_var_${i + 1}`,
      category: original.category,
      subcategory: original.subcategory,
      q: `${context} ${modifier} ${original.q}`,
      a: adjustedAnswers
    });
  }
  
  return variations;
}

// 중복 제거 및 다양화 함수
function removeDuplicatesAndDiversify() {
  const inputPath = path.join(__dirname, '../data/question-pool-ultra.json');
  const outputPath = path.join(__dirname, '../data/question-pool-ultra.json');
  const backupPath = path.join(__dirname, '../data/question-pool-ultra.backup.json');
  
  // 백업 생성
  const originalData = fs.readFileSync(inputPath, 'utf8');
  fs.writeFileSync(backupPath, originalData, 'utf8');
  console.log(`백업 파일 생성: ${backupPath}`);
  
  // 파일 읽기
  const data = JSON.parse(originalData);
  
  // 중복 질문 추적
  const questionTexts = new Map();
  const duplicates = [];
  const uniqueQuestions = [];
  
  // 중복 찾기
  data.questions.forEach((q, index) => {
    const normalizedQ = q.q.replace(/^(진짜\s*|정말\s*|솔직히\s*|요즘\s*)+/g, '').trim();
    
    if (questionTexts.has(normalizedQ)) {
      duplicates.push({ index, question: q });
    } else {
      questionTexts.set(normalizedQ, true);
      uniqueQuestions.push(q);
    }
  });
  
  console.log(`총 질문 수: ${data.questions.length}`);
  console.log(`중복 질문 수: ${duplicates.length}`);
  console.log(`고유 질문 수: ${uniqueQuestions.length}`);
  
  // 새 질문들로 교체할 인덱스 목록
  const replaceIndices = duplicates.map(d => d.index);
  
  // 새 질문 목록 생성
  const newQuestionsList = [];
  for (const [category, questions] of Object.entries(newQuestions)) {
    questions.forEach((q, idx) => {
      newQuestionsList.push({
        id: generateQuestionId(category, q.subcategory, idx + 1),
        category: category,
        subcategory: q.subcategory,
        q: q.q,
        a: q.a
      });
    });
  }
  
  // 기존 질문 중 너무 비슷한 패턴들도 교체 대상에 추가
  const similarPatterns = [
    /인스타 스토리/,
    /^(아침에|점심에|저녁에|주말에|휴일에|피곤할 때|기분 좋을 때|우울할 때)\s+(.+)$/
  ];
  
  uniqueQuestions.forEach((q, index) => {
    const hasInstaStory = /인스타 스토리/.test(q.q);
    const countInstaStory = uniqueQuestions.filter(uq => /인스타 스토리/.test(uq.q)).length;
    
    // 인스타 스토리 질문이 3개 이상이면 추가로 교체
    if (hasInstaStory && countInstaStory > 3 && Math.random() > 0.3) {
      replaceIndices.push(index);
    }
  });
  
  // 더 많은 새 질문 생성
  const additionalQuestions = generateAdditionalQuestions();
  const allNewQuestions = [...newQuestionsList, ...additionalQuestions];
  
  // 최종 질문 배열 생성 - 유니크한 질문들부터 시작
  let finalQuestions = [...uniqueQuestions];
  let newQuestionIndex = 0;
  
  // 중복된 자리에 새 질문으로 교체하는 대신, 유니크한 질문들에 새 질문들을 추가
  console.log('\n새로운 질문 추가 중...');
  
  // 1000개가 될 때까지 새 질문 추가
  while (finalQuestions.length < 1000 && newQuestionIndex < allNewQuestions.length) {
    const newQ = allNewQuestions[newQuestionIndex++];
    finalQuestions.push(newQ);
  }
  
  // 여전히 부족하면 변형 질문 생성
  if (finalQuestions.length < 1000) {
    const variations = generateQuestionVariations(finalQuestions, 1000 - finalQuestions.length);
    finalQuestions = [...finalQuestions, ...variations];
  }
  
  // 1000개로 조정
  if (finalQuestions.length > 1000) {
    finalQuestions = finalQuestions.slice(0, 1000);
  }
  
  // 업데이트된 데이터
  data.questions = finalQuestions;
  data.totalQuestions = finalQuestions.length;
  data.generatedAt = new Date().toISOString();
  
  // 파일 저장
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  
  console.log(`\n결과:`);
  console.log(`- 제거된 중복 질문: ${duplicates.length}개`);
  console.log(`- 추가된 새 질문: ${newQuestionIndex}개`);
  console.log(`- 최종 질문 수: ${data.questions.length}개`);
  console.log(`- 파일 저장 완료: ${outputPath}`);
  
  // 카테고리별 통계
  const categoryStats = {};
  data.questions.forEach(q => {
    categoryStats[q.category] = (categoryStats[q.category] || 0) + 1;
  });
  
  console.log('\n카테고리별 질문 수:');
  Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
}

// 실행
removeDuplicatesAndDiversify();