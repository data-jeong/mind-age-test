const fs = require('fs');
const path = require('path');

// Helper function to generate mental age value based on pattern
function getAgeValue(pattern, index) {
  const patterns = {
    young: [15, 20, 25, 30],      // Younger to slightly mature
    balanced: [20, 30, 40, 45],    // Balanced distribution
    mature: [25, 35, 45, 50],      // More mature options
    varied: [15, 25, 40, 50],      // Wide spread
    teen: [15, 18, 22, 25],        // Very young mindset
    adult: [35, 40, 45, 50],       // Mature mindset
    middle: [25, 30, 35, 40],      // Middle-aged mindset
    genZ: [15, 20, 25, 30],        // Gen Z typical
    millennial: [25, 30, 35, 40],  // Millennial typical
    genX: [35, 40, 45, 50]         // Gen X typical
  };
  return patterns[pattern][index] || patterns.balanced[index];
}

// Massive question collection organized by major categories
const ultraQuestionBank = {
  // Social Media & Internet Culture
  social_media: {
    subcategories: {
      instagram: [
        {
          q: "인스타 스토리 올릴 때",
          a: [
            { t: "필터 10개는 써봄 ✨", v: 15 },
            { t: "자연스러운 게 최고 📸", v: 30 },
            { t: "스토리 안 올림 🤷", v: 40 },
            { t: "친한 친구 공개만 🔒", v: 25 }
          ]
        },
        {
          q: "인스타 팔로워 관리는",
          a: [
            { t: "맞팔 안하면 언팔 😤", v: 18 },
            { t: "신경 안 씀 😌", v: 35 },
            { t: "가끔 정리함 📊", v: 28 },
            { t: "비공개 계정임 🔐", v: 40 }
          ]
        },
        {
          q: "릴스 보는 시간은",
          a: [
            { t: "하루 3시간 이상 📱", v: 15 },
            { t: "잠들기 전 30분 🌙", v: 25 },
            { t: "가끔 심심할 때 🕐", v: 35 },
            { t: "릴스가 뭔지... 🤔", v: 50 }
          ]
        }
      ],
      tiktok: [
        {
          q: "틱톡 춤 추라고 하면",
          a: [
            { t: "이미 10개는 알아 💃", v: 15 },
            { t: "하나 정도는? 🕺", v: 25 },
            { t: "절대 안 해 😅", v: 40 },
            { t: "틱톡 안 함 📵", v: 45 }
          ]
        },
        {
          q: "FYP(For You Page)는",
          a: [
            { t: "내 취향 완벽 반영 🎯", v: 18 },
            { t: "가끔 신기한 게 뜸 👀", v: 25 },
            { t: "뭔 소리야? 🤷", v: 40 },
            { t: "알고리즘이 무서워 😰", v: 35 }
          ]
        }
      ],
      twitter: [
        {
          q: "트위터(X) 사용법은",
          a: [
            { t: "실시간 트렌드 체크 📈", v: 20 },
            { t: "덕질 계정 운영 💜", v: 22 },
            { t: "뉴스 보는 용도 📰", v: 38 },
            { t: "계정만 있음 💤", v: 35 }
          ]
        },
        {
          q: "트윗할 때 스타일은",
          a: [
            { t: "밈과 드립 가득 🤪", v: 18 },
            { t: "진지한 의견 공유 💭", v: 40 },
            { t: "RT만 가끔 🔄", v: 30 },
            { t: "관찰만 함 👀", v: 35 }
          ]
        }
      ],
      youtube: [
        {
          q: "유튜브 프리미엄은",
          a: [
            { t: "광고 없어서 필수 ✅", v: 30 },
            { t: "Vanced 쓰는데? 😏", v: 20 },
            { t: "광고 스킵하면 되지 ⏭️", v: 25 },
            { t: "음악 앱으로도 씀 🎵", v: 35 }
          ]
        },
        {
          q: "구독 채널 수는",
          a: [
            { t: "100개 넘음 📺", v: 20 },
            { t: "50개 정도? 📱", v: 25 },
            { t: "관심있는 것만 10개 ⭐", v: 35 },
            { t: "알고리즘에 맡김 🎲", v: 30 }
          ]
        },
        {
          q: "유튜브 쇼츠는",
          a: [
            { t: "중독성 있어서 계속 봄 🔄", v: 18 },
            { t: "가끔 재밌는 거 있음 😄", v: 28 },
            { t: "긴 영상이 낫지 📹", v: 38 },
            { t: "안 봄 ❌", v: 45 }
          ]
        }
      ],
      memes: [
        {
          q: "최신 밈 이해도는",
          a: [
            { t: "밈 제조기임 🏭", v: 15 },
            { t: "대부분 알아 😎", v: 20 },
            { t: "유명한 것만 🤏", v: 30 },
            { t: "뭔 소리인지... 😵", v: 45 }
          ]
        },
        {
          q: "'아 ㅋㅋ'하면 떠오르는 건",
          a: [
            { t: "찐따같이 웃지마 🤣", v: 18 },
            { t: "그냥 웃음 표현? 😄", v: 35 },
            { t: "뭔가 있나? 🤔", v: 45 },
            { t: "ㅋㅋㅋㅋㅋ만 씀 😂", v: 25 }
          ]
        },
        {
          q: "밈 사용 빈도는",
          a: [
            { t: "일상 대화의 80% 🗣️", v: 15 },
            { t: "친구들이랑만 가끔 👥", v: 25 },
            { t: "이해는 하는데 안 씀 🤐", v: 35 },
            { t: "밈이 뭐야? 🤷", v: 50 }
          ]
        }
      ],
      discord: [
        {
          q: "디스코드 서버 개수는",
          a: [
            { t: "20개 넘음 🎮", v: 18 },
            { t: "5-10개 정도 💬", v: 25 },
            { t: "친구랑만 1-2개 👥", v: 30 },
            { t: "디코가 뭐야? 📞", v: 45 }
          ]
        },
        {
          q: "디코 닉네임 스타일은",
          a: [
            { t: "특수문자 가득 ✨", v: 15 },
            { t: "게임 닉네임 그대로 🎯", v: 22 },
            { t: "본명이나 별명 📝", v: 35 },
            { t: "서버마다 다름 🔄", v: 28 }
          ]
        }
      ]
    }
  },

  // Gaming & Entertainment
  gaming: {
    subcategories: {
      pc_gaming: [
        {
          q: "게이밍 셋업은",
          a: [
            { t: "RGB 파티 🌈", v: 20 },
            { t: "성능만 좋으면 OK 💪", v: 30 },
            { t: "노트북이면 충분 💻", v: 35 },
            { t: "게임 안 함 🚫", v: 45 }
          ]
        },
        {
          q: "스팀 게임 개수는",
          a: [
            { t: "100개 넘는데 할 건 없음 😅", v: 25 },
            { t: "세일 때만 구매 💸", v: 30 },
            { t: "F2P만 함 🆓", v: 20 },
            { t: "스팀이 뭐야? 🤔", v: 45 }
          ]
        },
        {
          q: "게임할 때 포지션은",
          a: [
            { t: "무조건 딜러 ⚔️", v: 20 },
            { t: "팀 따라 유동적 🔄", v: 35 },
            { t: "서포터 전문 💚", v: 30 },
            { t: "솔로 게임만 🎮", v: 40 }
          ]
        }
      ],
      mobile_gaming: [
        {
          q: "모바일 게임 스타일은",
          a: [
            { t: "하드코어 게이머 🎮", v: 20 },
            { t: "출퇴근 시간만 🚇", v: 30 },
            { t: "캐주얼 게임만 🎲", v: 35 },
            { t: "게임 안 함 📵", v: 45 }
          ]
        },
        {
          q: "과금에 대한 생각은",
          a: [
            { t: "무과금이 자랑 😤", v: 25 },
            { t: "소과금 정도는 💳", v: 30 },
            { t: "게임이 좋으면 OK 💰", v: 35 },
            { t: "과금이 뭐야? 🤷", v: 45 }
          ]
        }
      ],
      streaming: [
        {
          q: "트위치 시청 시간은",
          a: [
            { t: "하루 5시간 이상 📺", v: 18 },
            { t: "좋아하는 스트리머만 ⭐", v: 25 },
            { t: "클립 영상만 봄 🎬", v: 30 },
            { t: "유튜브가 낫지 📹", v: 35 }
          ]
        },
        {
          q: "도네이션은",
          a: [
            { t: "룰루랄라 쏨 💸", v: 20 },
            { t: "구독만 가끔 🎫", v: 28 },
            { t: "무료 시청이 최고 🆓", v: 25 },
            { t: "돈 주고 봐? 😱", v: 40 }
          ]
        }
      ],
      anime_manga: [
        {
          q: "애니 시청 스타일은",
          a: [
            { t: "이번 분기 다 봄 📺", v: 18 },
            { t: "유명한 것만 🌟", v: 28 },
            { t: "추억의 애니만 💭", v: 38 },
            { t: "애니 안 봄 ❌", v: 45 }
          ]
        },
        {
          q: "만화책은",
          a: [
            { t: "웹툰만 봄 📱", v: 20 },
            { t: "종이책이 진리 📚", v: 35 },
            { t: "불법 사이트... 😅", v: 22 },
            { t: "만화 안 봄 🚫", v: 45 }
          ]
        }
      ],
      kpop: [
        {
          q: "K-POP 덕질 레벨은",
          a: [
            { t: "앨범 깡 전문가 💿", v: 20 },
            { t: "음원만 스밍 🎵", v: 25 },
            { t: "뮤비만 가끔 📺", v: 30 },
            { t: "관심 없음 🤷", v: 40 }
          ]
        },
        {
          q: "아이돌 콘서트는",
          a: [
            { t: "티켓팅 전쟁 참전 ⚔️", v: 20 },
            { t: "당첨되면 감 🎫", v: 28 },
            { t: "온라인으로 충분 💻", v: 35 },
            { t: "왜 감? 🤔", v: 45 }
          ]
        }
      ]
    }
  },

  // Technology & Digital Life
  technology: {
    subcategories: {
      devices: [
        {
          q: "스마트폰 교체 주기는",
          a: [
            { t: "신제품 나오면 바로 📱", v: 20 },
            { t: "2-3년마다 🔄", v: 30 },
            { t: "고장날 때까지 💪", v: 40 },
            { t: "중고로 충분 ♻️", v: 35 }
          ]
        },
        {
          q: "사용하는 앱 개수는",
          a: [
            { t: "100개 넘음 📲", v: 18 },
            { t: "50개 정도? 📱", v: 25 },
            { t: "필수 앱만 20개 ⭐", v: 35 },
            { t: "기본 앱만 씀 📞", v: 45 }
          ]
        },
        {
          q: "배터리 잔량 불안은",
          a: [
            { t: "50% 되면 충전 🔋", v: 20 },
            { t: "20% 되면 찾음 🔌", v: 30 },
            { t: "빨간불 들어오면 ⚡", v: 35 },
            { t: "꺼지면 충전 💀", v: 25 }
          ]
        }
      ],
      coding: [
        {
          q: "코딩에 대한 생각은",
          a: [
            { t: "이미 하고 있음 💻", v: 25 },
            { t: "배워보고 싶음 📚", v: 30 },
            { t: "어려워 보임 😵", v: 35 },
            { t: "관심 없음 🤷", v: 40 }
          ]
        },
        {
          q: "ChatGPT 사용법은",
          a: [
            { t: "일상 필수템 🤖", v: 20 },
            { t: "가끔 도움받음 💡", v: 30 },
            { t: "무서워서 안 씀 😰", v: 40 },
            { t: "뭔지 모름 ❓", v: 45 }
          ]
        }
      ],
      crypto: [
        {
          q: "암호화폐에 대한 생각은",
          a: [
            { t: "이미 투자 중 💰", v: 25 },
            { t: "공부하는 중 📊", v: 30 },
            { t: "사기 같음 🚫", v: 40 },
            { t: "관심 없음 😑", v: 35 }
          ]
        },
        {
          q: "NFT는",
          a: [
            { t: "프로필 사진 보유 🖼️", v: 20 },
            { t: "그림이 왜 비싸? 🤔", v: 30 },
            { t: "완전 거품 💭", v: 40 },
            { t: "NFT가 뭐야? ❓", v: 45 }
          ]
        }
      ],
      ai_tools: [
        {
          q: "AI 도구 활용도는",
          a: [
            { t: "업무 필수품 🤖", v: 25 },
            { t: "재미로 가끔 🎮", v: 30 },
            { t: "무서워서 안 씀 😱", v: 40 },
            { t: "뭐가 있는지 모름 🤷", v: 45 }
          ]
        },
        {
          q: "AI 그림 생성은",
          a: [
            { t: "프롬프트 장인 🎨", v: 20 },
            { t: "가끔 재미로 🖌️", v: 28 },
            { t: "예술가들 불쌍 😢", v: 35 },
            { t: "그게 뭐야? 🤔", v: 45 }
          ]
        }
      ]
    }
  },

  // Work & Career
  work: {
    subcategories: {
      remote_work: [
        {
          q: "재택근무 복장은",
          a: [
            { t: "파자마가 정장 🛌", v: 20 },
            { t: "상의만 갖춰입음 👔", v: 28 },
            { t: "평소처럼 차려입음 👗", v: 40 },
            { t: "회의 있을 때만 신경 💻", v: 30 }
          ]
        },
        {
          q: "재택 중 딴짓은",
          a: [
            { t: "유튜브가 메인 📺", v: 20 },
            { t: "가끔 휴식 필요 ☕", v: 30 },
            { t: "절대 안 함 💪", v: 45 },
            { t: "멀티태스킹 프로 🎯", v: 25 }
          ]
        }
      ],
      office_life: [
        {
          q: "회사 점심시간은",
          a: [
            { t: "혼밥이 최고 🍱", v: 25 },
            { t: "동료들과 함께 👥", v: 35 },
            { t: "도시락 지참 🍙", v: 40 },
            { t: "커피로 때움 ☕", v: 20 }
          ]
        },
        {
          q: "야근에 대한 생각은",
          a: [
            { t: "칼퇴가 생명 🏃", v: 20 },
            { t: "필요하면 해야지 💼", v: 35 },
            { t: "야근수당 굿 💰", v: 30 },
            { t: "일이 재밌어서 OK 😊", v: 25 }
          ]
        }
      ],
      freelance: [
        {
          q: "프리랜서의 삶은",
          a: [
            { t: "자유가 최고 🦅", v: 25 },
            { t: "불안정해서 무서워 😰", v: 35 },
            { t: "도전해보고 싶음 💪", v: 30 },
            { t: "정규직이 답 🏢", v: 40 }
          ]
        },
        {
          q: "부업에 대한 생각은",
          a: [
            { t: "이미 3개 하는 중 💼", v: 25 },
            { t: "하나 시작할 예정 📈", v: 30 },
            { t: "본업만으로도 바빠 😵", v: 35 },
            { t: "시간이 돈보다 중요 ⏰", v: 40 }
          ]
        }
      ]
    }
  },

  // Lifestyle & Daily Life
  lifestyle: {
    subcategories: {
      fashion: [
        {
          q: "옷 쇼핑 스타일은",
          a: [
            { t: "온라인이 편해 🛍️", v: 20 },
            { t: "직접 입어봐야 👕", v: 35 },
            { t: "빈티지샵 투어 🧥", v: 28 },
            { t: "있는 거 계속 입음 ♻️", v: 40 }
          ]
        },
        {
          q: "패션 정보는",
          a: [
            { t: "인스타에서 get 📸", v: 20 },
            { t: "유튜브 코디 영상 📺", v: 25 },
            { t: "친구들 따라하기 👥", v: 30 },
            { t: "편한 게 최고 😌", v: 40 }
          ]
        }
      ],
      food_delivery: [
        {
          q: "배달앱 사용 빈도는",
          a: [
            { t: "매일 사용 📱", v: 18 },
            { t: "주 3-4회 🍕", v: 25 },
            { t: "특별한 날만 🎉", v: 35 },
            { t: "직접 해먹음 👨‍🍳", v: 45 }
          ]
        },
        {
          q: "배달비 부담은",
          a: [
            { t: "편의가 최고 💸", v: 20 },
            { t: "쿠폰 있을 때만 🎟️", v: 28 },
            { t: "직접 포장 가 🚶", v: 35 },
            { t: "아까워서 안 시킴 💰", v: 40 }
          ]
        }
      ],
      exercise: [
        {
          q: "헬스장 출석률은",
          a: [
            { t: "매일 출석 💪", v: 40 },
            { t: "주 3회는 가야지 🏃", v: 35 },
            { t: "등록만 해둠 😅", v: 20 },
            { t: "홈트가 최고 🏠", v: 30 }
          ]
        },
        {
          q: "운동 영상은",
          a: [
            { t: "유튜브로 따라함 📺", v: 25 },
            { t: "PT 받는 중 🏋️", v: 35 },
            { t: "앱으로 관리 📱", v: 30 },
            { t: "운동이 뭐야 🛋️", v: 15 }
          ]
        }
      ],
      sleep: [
        {
          q: "잠들기 전 습관은",
          a: [
            { t: "폰 보다가 기절 📱", v: 20 },
            { t: "ASMR 필수 🎧", v: 25 },
            { t: "책 읽다가 잠 📚", v: 40 },
            { t: "명상하고 잠 🧘", v: 45 }
          ]
        },
        {
          q: "수면 시간은",
          a: [
            { t: "4시간도 많아 😵", v: 20 },
            { t: "6-7시간 적당 😴", v: 30 },
            { t: "8시간은 자야 💤", v: 35 },
            { t: "10시간도 부족 🛌", v: 25 }
          ]
        }
      ]
    }
  },

  // Relationships & Social
  relationships: {
    subcategories: {
      dating: [
        {
          q: "소개팅 어플은",
          a: [
            { t: "3개 이상 사용 중 📱", v: 20 },
            { t: "하나 정도는 💕", v: 25 },
            { t: "친구 소개가 낫지 👥", v: 35 },
            { t: "자연스러운 만남 원해 🌸", v: 40 }
          ]
        },
        {
          q: "데이트 코스는",
          a: [
            { t: "핫플 찾아다님 🔥", v: 20 },
            { t: "집 데이트 최고 🏠", v: 25 },
            { t: "맛집 투어 🍽️", v: 30 },
            { t: "산책이나 드라이브 🚗", v: 35 }
          ]
        }
      ],
      friendship: [
        {
          q: "친구들과 만날 때",
          a: [
            { t: "술 없인 못 만나 🍺", v: 25 },
            { t: "카페에서 수다 ☕", v: 30 },
            { t: "운동이나 취미 활동 🏃", v: 35 },
            { t: "온라인으로 충분 💻", v: 20 }
          ]
        },
        {
          q: "생일 축하는",
          a: [
            { t: "카톡으로 간단히 📱", v: 20 },
            { t: "선물은 필수 🎁", v: 35 },
            { t: "파티 준비 완료 🎉", v: 30 },
            { t: "달력에 메모해둠 📅", v: 40 }
          ]
        }
      ],
      family: [
        {
          q: "부모님과 연락은",
          a: [
            { t: "매일 안부 전화 📞", v: 40 },
            { t: "주 1-2회 정도 💬", v: 35 },
            { t: "생각날 때만 😅", v: 25 },
            { t: "명절에만 만남 🏮", v: 20 }
          ]
        },
        {
          q: "가족 모임은",
          a: [
            { t: "피하고 싶어 😰", v: 20 },
            { t: "의무감에 참석 😑", v: 25 },
            { t: "나름 재밌음 😊", v: 30 },
            { t: "기다려짐 💕", v: 40 }
          ]
        }
      ]
    }
  },

  // Money & Finance
  finance: {
    subcategories: {
      savings: [
        {
          q: "저축 방법은",
          a: [
            { t: "자동이체가 답 💰", v: 40 },
            { t: "남으면 저축 😅", v: 25 },
            { t: "적금 3개 이상 📊", v: 45 },
            { t: "저축이 뭐야 💸", v: 15 }
          ]
        },
        {
          q: "통장 잔고 확인은",
          a: [
            { t: "매일 확인 📱", v: 35 },
            { t: "월급날만 👀", v: 30 },
            { t: "무서워서 안 봄 😱", v: 20 },
            { t: "대충 감으로 💭", v: 25 }
          ]
        }
      ],
      investment: [
        {
          q: "주식 투자는",
          a: [
            { t: "이미 하는 중 📈", v: 30 },
            { t: "공부 중 📚", v: 35 },
            { t: "도박 같아서 안 해 🎰", v: 40 },
            { t: "뭔지 모름 🤷", v: 45 }
          ]
        },
        {
          q: "투자 정보는",
          a: [
            { t: "유튜브 구독 중 📺", v: 25 },
            { t: "커뮤니티 활동 💬", v: 30 },
            { t: "뉴스만 봄 📰", v: 35 },
            { t: "친구 추천 따라 👥", v: 20 }
          ]
        }
      ],
      spending: [
        {
          q: "충동구매 빈도는",
          a: [
            { t: "매일이 충동구매 🛍️", v: 18 },
            { t: "세일 때만 💸", v: 25 },
            { t: "계획 구매만 📝", v: 40 },
            { t: "사고 싶은 게 없음 😐", v: 35 }
          ]
        },
        {
          q: "가계부 작성은",
          a: [
            { t: "앱으로 자동 관리 📱", v: 35 },
            { t: "엑셀로 정리 💻", v: 40 },
            { t: "대충 머릿속으로 🧠", v: 25 },
            { t: "뭐하러 써 🤷", v: 20 }
          ]
        }
      ]
    }
  },

  // Health & Wellness
  health: {
    subcategories: {
      mental_health: [
        {
          q: "스트레스 해소법은",
          a: [
            { t: "게임으로 풀어 🎮", v: 20 },
            { t: "운동이 최고 💪", v: 35 },
            { t: "친구와 수다 💬", v: 30 },
            { t: "혼자 쉬기 🛌", v: 40 }
          ]
        },
        {
          q: "번아웃 왔을 때",
          a: [
            { t: "그냥 참고 일해 😤", v: 25 },
            { t: "휴가 신청 ✈️", v: 35 },
            { t: "상담 받아봄 🩺", v: 40 },
            { t: "번아웃이 뭐야? 🤔", v: 20 }
          ]
        }
      ],
      diet: [
        {
          q: "다이어트 방법은",
          a: [
            { t: "매번 내일부터 😅", v: 20 },
            { t: "간헐적 단식 ⏰", v: 30 },
            { t: "헬스+식단 병행 🥗", v: 40 },
            { t: "다이어트 안 해 😎", v: 25 }
          ]
        },
        {
          q: "건강 관리는",
          a: [
            { t: "영양제로 해결 💊", v: 30 },
            { t: "규칙적인 생활 ⏰", v: 45 },
            { t: "젊으니까 OK 💪", v: 20 },
            { t: "병원 가기 싫어 🏥", v: 25 }
          ]
        }
      ],
      wellness: [
        {
          q: "명상이나 요가는",
          a: [
            { t: "매일 루틴 🧘", v: 45 },
            { t: "가끔 유튜브로 📺", v: 30 },
            { t: "해보고 싶긴 해 💭", v: 25 },
            { t: "뭐하러 해 😑", v: 20 }
          ]
        },
        {
          q: "건강 검진은",
          a: [
            { t: "매년 필수 🏥", v: 45 },
            { t: "회사에서 시킬 때만 🏢", v: 30 },
            { t: "아프면 가지 뭐 😷", v: 20 },
            { t: "병원 무서워 😰", v: 25 }
          ]
        }
      ]
    }
  },

  // Education & Learning
  education: {
    subcategories: {
      online_learning: [
        {
          q: "온라인 강의는",
          a: [
            { t: "구독 3개 이상 📚", v: 30 },
            { t: "무료 강의만 🆓", v: 25 },
            { t: "유튜브로 충분 📺", v: 20 },
            { t: "책이 더 좋아 📖", v: 40 }
          ]
        },
        {
          q: "새로운 기술 배우기는",
          a: [
            { t: "항상 배우는 중 🎓", v: 35 },
            { t: "필요할 때만 📝", v: 30 },
            { t: "배울 시간이 없어 ⏰", v: 25 },
            { t: "있는 것도 못해 😵", v: 20 }
          ]
        }
      ],
      languages: [
        {
          q: "외국어 공부는",
          a: [
            { t: "듀오링고 연속 기록 중 🔥", v: 25 },
            { t: "유튜브로 공부 📺", v: 30 },
            { t: "학원 다님 🏫", v: 35 },
            { t: "한국어로 충분 🇰🇷", v: 40 }
          ]
        },
        {
          q: "영어 실력은",
          a: [
            { t: "원어민 수준 🌏", v: 35 },
            { t: "일상 회화 가능 💬", v: 30 },
            { t: "번역기가 있잖아 📱", v: 20 },
            { t: "Korean English 🤷", v: 25 }
          ]
        }
      ]
    }
  },

  // Future & Goals
  future: {
    subcategories: {
      career_goals: [
        {
          q: "5년 후 나는",
          a: [
            { t: "대표님 될 거야 👔", v: 25 },
            { t: "전문가가 목표 🎯", v: 35 },
            { t: "지금이 좋아 😊", v: 30 },
            { t: "모르겠어 🤷", v: 20 }
          ]
        },
        {
          q: "은퇴 계획은",
          a: [
            { t: "FIRE 목표 🔥", v: 30 },
            { t: "60세까지 열심히 💼", v: 40 },
            { t: "평생 일할 듯 😅", v: 35 },
            { t: "로또 당첨 기대 🎰", v: 20 }
          ]
        }
      ],
      life_goals: [
        {
          q: "버킷리스트는",
          a: [
            { t: "100개 넘음 📝", v: 25 },
            { t: "10개 정도 ⭐", v: 30 },
            { t: "머릿속에만 💭", v: 35 },
            { t: "그런 거 없어 🤷", v: 20 }
          ]
        },
        {
          q: "인생 목표는",
          a: [
            { t: "행복하게 살기 😊", v: 30 },
            { t: "부자 되기 💰", v: 25 },
            { t: "가족과 함께 👨‍👩‍👧‍👦", v: 40 },
            { t: "하루하루 살기 🌅", v: 20 }
          ]
        }
      ]
    }
  },

  // Environmental & Social Issues
  environment: {
    subcategories: {
      sustainability: [
        {
          q: "텀블러 사용은",
          a: [
            { t: "항상 들고 다님 🥤", v: 40 },
            { t: "가끔 생각날 때 💭", v: 30 },
            { t: "일회용이 편해 🥤", v: 20 },
            { t: "집에만 10개 😅", v: 25 }
          ]
        },
        {
          q: "분리수거는",
          a: [
            { t: "완벽하게 함 ♻️", v: 45 },
            { t: "대충은 함 📦", v: 30 },
            { t: "귀찮아서 대충 😅", v: 20 },
            { t: "그게 뭐야? 🤷", v: 15 }
          ]
        }
      ],
      social_issues: [
        {
          q: "기부 활동은",
          a: [
            { t: "정기 후원 중 💝", v: 40 },
            { t: "가끔 소액 기부 💰", v: 35 },
            { t: "마음만 있음 💭", v: 25 },
            { t: "내가 더 급해 😅", v: 20 }
          ]
        },
        {
          q: "사회 이슈 관심은",
          a: [
            { t: "뉴스 매일 체크 📰", v: 40 },
            { t: "SNS로 대충 📱", v: 25 },
            { t: "관심 없음 😑", v: 20 },
            { t: "너무 우울해서 안 봄 😔", v: 30 }
          ]
        }
      ]
    }
  },

  // Travel & Adventure
  travel: {
    subcategories: {
      travel_style: [
        {
          q: "여행 계획은",
          a: [
            { t: "분 단위로 짜놓음 📋", v: 40 },
            { t: "대충 큰 틀만 🗺️", v: 30 },
            { t: "무계획이 계획 🎲", v: 20 },
            { t: "패키지가 편해 🚌", v: 35 }
          ]
        },
        {
          q: "여행 예산은",
          a: [
            { t: "돈 걱정 없이 💸", v: 25 },
            { t: "알뜰하게 계획 💰", v: 35 },
            { t: "카드 긁고 후회 😅", v: 20 },
            { t: "최저가 숙소 찾기 🏨", v: 30 }
          ]
        }
      ],
      destinations: [
        {
          q: "가고 싶은 여행지는",
          a: [
            { t: "유럽 한 달 살기 🏰", v: 30 },
            { t: "동남아 휴양지 🏝️", v: 25 },
            { t: "국내 숨은 명소 🇰🇷", v: 35 },
            { t: "집이 최고야 🏠", v: 40 }
          ]
        },
        {
          q: "여행 사진은",
          a: [
            { t: "인스타용 필수 📸", v: 20 },
            { t: "추억으로 남기기 📷", v: 30 },
            { t: "눈으로만 담기 👀", v: 40 },
            { t: "셀카만 100장 🤳", v: 25 }
          ]
        }
      ]
    }
  },

  // Pop Culture & Trends
  pop_culture: {
    subcategories: {
      movies_shows: [
        {
          q: "넷플릭스 시청은",
          a: [
            { t: "정주행 마스터 📺", v: 20 },
            { t: "주말에만 몰아서 🍿", v: 30 },
            { t: "계정 공유 중 😅", v: 25 },
            { t: "TV가 뭐야 📵", v: 40 }
          ]
        },
        {
          q: "영화관은",
          a: [
            { t: "OTT 기다림 📱", v: 25 },
            { t: "블록버스터만 🎬", v: 30 },
            { t: "독립영화도 봄 🎞️", v: 35 },
            { t: "팝콘이 본체 🍿", v: 20 }
          ]
        }
      ],
      music: [
        {
          q: "음악 스트리밍은",
          a: [
            { t: "유튜브 뮤직 🎵", v: 20 },
            { t: "스포티파이 💚", v: 25 },
            { t: "멜론 세대 🍈", v: 30 },
            { t: "음원 구매파 💿", v: 40 }
          ]
        },
        {
          q: "플레이리스트는",
          a: [
            { t: "장르별로 정리 🎼", v: 35 },
            { t: "알고리즘 추천 🤖", v: 25 },
            { t: "한 곡 무한반복 🔁", v: 20 },
            { t: "차트만 들음 📊", v: 30 }
          ]
        }
      ],
      fashion_trends: [
        {
          q: "패션 트렌드는",
          a: [
            { t: "남들보다 빠르게 🏃", v: 20 },
            { t: "적당히 따라가 👕", v: 30 },
            { t: "나만의 스타일 😎", v: 35 },
            { t: "편한 게 최고 👔", v: 40 }
          ]
        },
        {
          q: "명품에 대한 생각은",
          a: [
            { t: "플렉스 필수 💎", v: 20 },
            { t: "가품도 OK 🤫", v: 25 },
            { t: "돈 아까워 💸", v: 35 },
            { t: "관심 없음 🤷", v: 40 }
          ]
        }
      ]
    }
  },

  // Generation-specific questions
  generation: {
    subcategories: {
      gen_z: [
        {
          q: "베이비붐 세대하면",
          a: [
            { t: "우리 부모님 👨‍👩‍👧", v: 20 },
            { t: "회식 문화 🍺", v: 25 },
            { t: "열심히 사신 분들 💼", v: 35 },
            { t: "세대 갈등 😓", v: 30 }
          ]
        },
        {
          q: "틱톡 vs 인스타",
          a: [
            { t: "틱톡이 대세 🎵", v: 18 },
            { t: "인스타가 편해 📸", v: 25 },
            { t: "둘 다 씀 📱", v: 22 },
            { t: "둘 다 안 씀 ❌", v: 40 }
          ]
        }
      ],
      millennial: [
        {
          q: "싸이월드 추억은",
          a: [
            { t: "BGM 고르던 시절 🎵", v: 30 },
            { t: "일촌평 써주던 때 💬", v: 32 },
            { t: "도토리 거래 💰", v: 28 },
            { t: "그게 뭐야? 🤔", v: 20 }
          ]
        },
        {
          q: "2000년대 향수는",
          a: [
            { t: "피처폰 시절 📱", v: 35 },
            { t: "스타 맵 고르기 🎮", v: 30 },
            { t: "버디버디 채팅 💬", v: 33 },
            { t: "기억 안 남 👶", v: 20 }
          ]
        }
      ],
      gen_x: [
        {
          q: "아날로그 감성은",
          a: [
            { t: "LP판이 최고 🎵", v: 45 },
            { t: "필름 카메라 📷", v: 40 },
            { t: "레트로가 힙해 🕰️", v: 25 },
            { t: "디지털이 편해 💻", v: 20 }
          ]
        },
        {
          q: "추억의 게임은",
          a: [
            { t: "오락실 가던 날 🕹️", v: 40 },
            { t: "PC방 스타크래프트 💻", v: 35 },
            { t: "닌텐도 마리오 🎮", v: 38 },
            { t: "모바일 게임만 📱", v: 20 }
          ]
        }
      ]
    }
  },

  // Food & Dining
  food_dining: {
    subcategories: {
      coffee_culture: [
        {
          q: "카페 선택 기준은",
          a: [
            { t: "인스타 감성 📸", v: 20 },
            { t: "커피 맛이 중요 ☕", v: 35 },
            { t: "콘센트 많은 곳 🔌", v: 25 },
            { t: "조용한 곳 🤫", v: 40 }
          ]
        },
        {
          q: "커피 주문은",
          a: [
            { t: "아아 고정 🧊", v: 25 },
            { t: "디카페인만 ☕", v: 35 },
            { t: "시즌 메뉴 도전 🌟", v: 20 },
            { t: "차가 더 좋아 🍵", v: 40 }
          ]
        }
      ],
      food_trends: [
        {
          q: "맛집 정보는",
          a: [
            { t: "인스타 맛집 계정 📱", v: 20 },
            { t: "네이버 리뷰 보고 🔍", v: 30 },
            { t: "TV 맛집 프로 📺", v: 35 },
            { t: "동네 단골집 🏪", v: 40 }
          ]
        },
        {
          q: "새로운 음식 도전은",
          a: [
            { t: "뭐든 먹어봄 🍴", v: 25 },
            { t: "리뷰 보고 결정 📝", v: 30 },
            { t: "익숙한 게 좋아 🍕", v: 35 },
            { t: "모험은 싫어 ❌", v: 40 }
          ]
        }
      ],
      cooking: [
        {
          q: "요리 실력은",
          a: [
            { t: "유튜브 보고 따라해 📺", v: 25 },
            { t: "레시피북 수준 👨‍🍳", v: 35 },
            { t: "라면도 실패 😅", v: 20 },
            { t: "배달이 최고 📱", v: 22 }
          ]
        },
        {
          q: "집밥 빈도는",
          a: [
            { t: "매일 해먹음 🍳", v: 45 },
            { t: "주말에만 👩‍🍳", v: 35 },
            { t: "밀키트로 해결 📦", v: 25 },
            { t: "집밥이 뭐야 🤷", v: 18 }
          ]
        }
      ]
    }
  },

  // Shopping & Consumer Behavior
  shopping: {
    subcategories: {
      online_shopping: [
        {
          q: "새벽 배송은",
          a: [
            { t: "인생이 편해짐 🚚", v: 25 },
            { t: "환경이 걱정돼 🌍", v: 35 },
            { t: "일반 배송으로 충분 📦", v: 40 },
            { t: "직접 사러 가 🚶", v: 45 }
          ]
        },
        {
          q: "리뷰 작성은",
          a: [
            { t: "포인트 받으려고 💰", v: 25 },
            { t: "도움 되라고 상세히 📝", v: 35 },
            { t: "귀찮아서 안 씀 😅", v: 20 },
            { t: "별점만 남김 ⭐", v: 30 }
          ]
        }
      ],
      brand_loyalty: [
        {
          q: "브랜드 충성도는",
          a: [
            { t: "애플 생태계 갇힘 🍎", v: 25 },
            { t: "가성비가 최고 💰", v: 30 },
            { t: "브랜드 상관없음 🤷", v: 35 },
            { t: "국산품 애용 🇰🇷", v: 40 }
          ]
        },
        {
          q: "할인 쿠폰은",
          a: [
            { t: "쿠폰 모으기 프로 🎟️", v: 30 },
            { t: "있으면 쓰고 말고 💳", v: 35 },
            { t: "찾기 귀찮아 😑", v: 25 },
            { t: "정가로 사는 게 편해 💸", v: 20 }
          ]
        }
      ]
    }
  },

  // Hobbies & Interests
  hobbies: {
    subcategories: {
      collecting: [
        {
          q: "수집 취미는",
          a: [
            { t: "굿즈 수집가 🎁", v: 20 },
            { t: "미니멀이 최고 🏠", v: 35 },
            { t: "추억은 마음에 💭", v: 40 },
            { t: "디지털로 충분 💾", v: 25 }
          ]
        },
        {
          q: "취미 생활비는",
          a: [
            { t: "월급의 절반 💸", v: 20 },
            { t: "적당히 쓰는 편 💰", v: 30 },
            { t: "최소한만 💵", v: 40 },
            { t: "취미가 돈 벌기 💼", v: 35 }
          ]
        }
      ],
      creative: [
        {
          q: "창작 활동은",
          a: [
            { t: "블로그/유튜브 운영 📝", v: 25 },
            { t: "그림 그리기 🎨", v: 30 },
            { t: "음악 만들기 🎵", v: 28 },
            { t: "소비만 하는 중 📱", v: 20 }
          ]
        },
        {
          q: "DIY 프로젝트는",
          a: [
            { t: "뭐든 만들어봄 🔨", v: 30 },
            { t: "키트 정도는 🧩", v: 25 },
            { t: "설명서도 어려워 📖", v: 20 },
            { t: "완제품이 최고 🛍️", v: 35 }
          ]
        }
      ],
      outdoor: [
        {
          q: "캠핑은",
          a: [
            { t: "장비 빨이지 ⛺", v: 25 },
            { t: "글램핑이 딱 좋아 🏕️", v: 30 },
            { t: "백패킹 미니멀 🎒", v: 35 },
            { t: "호텔이 최고 🏨", v: 40 }
          ]
        },
        {
          q: "등산은",
          a: [
            { t: "매주 산행 ⛰️", v: 45 },
            { t: "가까운 동네 산 🏔️", v: 35 },
            { t: "케이블카 있는 곳만 🚡", v: 25 },
            { t: "평지가 좋아 🚶", v: 20 }
          ]
        }
      ],
      pets: [
        {
          q: "반려동물은",
          a: [
            { t: "우리 아기 🐕", v: 30 },
            { t: "키우고 싶은데... 😢", v: 25 },
            { t: "식물도 죽여 🌱", v: 20 },
            { t: "알러지 있어 🤧", v: 35 }
          ]
        },
        {
          q: "펫 용품 쇼핑은",
          a: [
            { t: "최고급만 🛍️", v: 25 },
            { t: "필요한 것만 📦", v: 35 },
            { t: "DIY로 만들어 🔨", v: 30 },
            { t: "반려동물 없음 🤷", v: 40 }
          ]
        }
      ]
    }
  },

  // Communication & Language
  communication: {
    subcategories: {
      texting: [
        {
          q: "카톡 답장 속도는",
          a: [
            { t: "즉답이 예의 ⚡", v: 20 },
            { t: "봤을 때 답장 💬", v: 30 },
            { t: "급한 것만 📱", v: 35 },
            { t: "씹는 게 일상 😅", v: 25 }
          ]
        },
        {
          q: "이모티콘 사용은",
          a: [
            { t: "이모티콘 부자 💎", v: 20 },
            { t: "기본 이모티콘만 😊", v: 30 },
            { t: "ㅋㅋㅋ로 충분 😂", v: 25 },
            { t: "이모티콘 안 씀 😐", v: 40 }
          ]
        }
      ],
      phone_calls: [
        {
          q: "전화 통화는",
          a: [
            { t: "문자가 편해 📱", v: 20 },
            { t: "급한 일만 📞", v: 30 },
            { t: "통화가 빨라 ☎️", v: 40 },
            { t: "전화 공포증 😰", v: 25 }
          ]
        },
        {
          q: "영상통화는",
          a: [
            { t: "화장 안 한 날은 NO 💄", v: 25 },
            { t: "가족이랑만 👨‍👩‍👧", v: 35 },
            { t: "업무용으로만 💼", v: 30 },
            { t: "절대 안 함 🙅", v: 20 }
          ]
        }
      ],
      slang: [
        {
          q: "신조어 사용은",
          a: [
            { t: "찐으로 많이 씀 ㅇㅈ? 🔥", v: 18 },
            { t: "알긴 아는데... 🤔", v: 25 },
            { t: "무슨 말인지 😵", v: 40 },
            { t: "표준어가 좋아 📖", v: 45 }
          ]
        },
        {
          q: "줄임말은",
          a: [
            { t: "ㅇㅇ ㄱㅊ ㅇㅋ 👌", v: 20 },
            { t: "친한 사람끼리만 💬", v: 25 },
            { t: "풀어서 써야지 📝", v: 35 },
            { t: "무슨 암호야? 🔐", v: 40 }
          ]
        }
      ]
    }
  },

  // Personal Growth
  personal_growth: {
    subcategories: {
      self_improvement: [
        {
          q: "자기계발서는",
          a: [
            { t: "매달 1권 이상 📚", v: 35 },
            { t: "유튜브 요약 영상 📺", v: 25 },
            { t: "자기계발 지쳤어 😔", v: 30 },
            { t: "소설이 더 재밌어 📖", v: 20 }
          ]
        },
        {
          q: "새해 목표는",
          a: [
            { t: "작심삼일 전문 😅", v: 20 },
            { t: "1년 계획 세움 📅", v: 40 },
            { t: "목표 없이 살기 🌊", v: 25 },
            { t: "매일이 새해 🎊", v: 30 }
          ]
        }
      ],
      habits: [
        {
          q: "습관 만들기는",
          a: [
            { t: "66일 챌린지 중 💪", v: 35 },
            { t: "앱으로 관리 📱", v: 30 },
            { t: "3일도 힘들어 😫", v: 20 },
            { t: "있는 그대로가 좋아 😌", v: 25 }
          ]
        },
        {
          q: "루틴은",
          a: [
            { t: "모닝 루틴 완벽 ☀️", v: 40 },
            { t: "대충 있음 📝", v: 30 },
            { t: "매일이 다름 🎲", v: 25 },
            { t: "루틴이 뭐야? 🤷", v: 20 }
          ]
        }
      ]
    }
  }
};

// Function to generate questions with variations
function generateQuestions() {
  const questions = [];
  let globalId = 1;

  // Process each major category
  Object.entries(ultraQuestionBank).forEach(([majorCategory, categoryData]) => {
    Object.entries(categoryData.subcategories).forEach(([subCategory, questionList]) => {
      questionList.forEach((questionTemplate) => {
        // Generate base question
        const baseQuestion = {
          id: `${majorCategory}_${subCategory}_${globalId++}`,
          category: majorCategory,
          subcategory: subCategory,
          q: questionTemplate.q,
          a: questionTemplate.a
        };
        questions.push(baseQuestion);

        // Generate variations if we want even more questions
        if (questions.length < 1000) {
          // Time-based variations
          const timeVariations = ['아침에', '점심에', '저녁에', '주말에', '휴일에', '평일에'];
          const randomTime = timeVariations[Math.floor(Math.random() * timeVariations.length)];
          
          if (Math.random() > 0.7 && !questionTemplate.q.includes(randomTime)) {
            const timeVariation = {
              id: `${majorCategory}_${subCategory}_${globalId++}`,
              category: majorCategory,
              subcategory: subCategory,
              q: `${randomTime} ${questionTemplate.q}`,
              a: questionTemplate.a.map((answer, idx) => ({
                t: answer.t,
                v: getAgeValue(['young', 'balanced', 'mature', 'varied'][Math.floor(Math.random() * 4)], idx)
              }))
            };
            questions.push(timeVariation);
          }

          // Mood-based variations
          const moodVariations = ['기분 좋을 때', '우울할 때', '스트레스 받을 때', '피곤할 때'];
          const randomMood = moodVariations[Math.floor(Math.random() * moodVariations.length)];
          
          if (Math.random() > 0.8 && !questionTemplate.q.includes(randomMood)) {
            const moodVariation = {
              id: `${majorCategory}_${subCategory}_${globalId++}`,
              category: majorCategory,
              subcategory: subCategory,
              q: `${randomMood} ${questionTemplate.q}`,
              a: questionTemplate.a.map((answer, idx) => ({
                t: answer.t,
                v: getAgeValue(['teen', 'young', 'middle', 'adult'][Math.floor(Math.random() * 4)], idx)
              }))
            };
            questions.push(moodVariation);
          }
        }
      });
    });
  });

  // Add some completely random fun questions
  const randomFunQuestions = [
    {
      q: "좀비 아포칼립스가 온다면",
      a: [
        { t: "게임처럼 생존 🧟", v: 20 },
        { t: "마트로 대피 🏪", v: 25 },
        { t: "산으로 도망 ⛰️", v: 35 },
        { t: "그냥 포기 😵", v: 30 }
      ]
    },
    {
      q: "타임머신이 있다면",
      a: [
        { t: "미래로 가서 로또 번호 🎰", v: 20 },
        { t: "과거로 가서 인생 리셋 🔄", v: 25 },
        { t: "역사적 순간 구경 📚", v: 35 },
        { t: "현재가 최고야 😊", v: 40 }
      ]
    },
    {
      q: "초능력을 가진다면",
      a: [
        { t: "순간이동 최고 ⚡", v: 25 },
        { t: "마음 읽기 🧠", v: 30 },
        { t: "시간 정지 ⏱️", v: 20 },
        { t: "투명인간 👻", v: 35 }
      ]
    },
    {
      q: "외계인이 나타난다면",
      a: [
        { t: "셀카 먼저 📸", v: 20 },
        { t: "정부에 신고 📞", v: 40 },
        { t: "친구 하자고 👽", v: 25 },
        { t: "도망가기 🏃", v: 35 }
      ]
    },
    {
      q: "복권 1등 당첨되면 제일 먼저",
      a: [
        { t: "회사에 사표 던지기 📄", v: 20 },
        { t: "부모님께 집 사드리기 🏠", v: 40 },
        { t: "세계일주 떠나기 ✈️", v: 25 },
        { t: "투자해서 더 불리기 📈", v: 35 }
      ]
    }
  ];

  // Add random fun questions
  randomFunQuestions.forEach(q => {
    questions.push({
      id: `fun_random_${globalId++}`,
      category: 'fun',
      subcategory: 'random',
      q: q.q,
      a: q.a
    });
  });

  return questions;
}

// Generate the massive question pool
const ultraMassiveQuestionPool = generateQuestions();

// Ensure we have at least 1000 questions by duplicating with slight variations if needed
while (ultraMassiveQuestionPool.length < 1000) {
  const originalQuestion = ultraMassiveQuestionPool[Math.floor(Math.random() * ultraMassiveQuestionPool.length)];
  const variations = ['정말', '진짜', '솔직히', '요즘'];
  const randomVariation = variations[Math.floor(Math.random() * variations.length)];
  
  const variedQuestion = {
    id: `varied_${ultraMassiveQuestionPool.length + 1}`,
    category: originalQuestion.category,
    subcategory: originalQuestion.subcategory,
    q: `${randomVariation} ${originalQuestion.q}`,
    a: originalQuestion.a.map((answer, idx) => ({
      t: answer.t,
      v: answer.v + (Math.random() > 0.5 ? 5 : -5)
    }))
  };
  
  ultraMassiveQuestionPool.push(variedQuestion);
}

// Write to file
const outputPath = path.join(__dirname, '..', 'data', 'question-pool-ultra.json');
const outputData = {
  version: "1.0.0",
  generatedAt: new Date().toISOString(),
  totalQuestions: ultraMassiveQuestionPool.length,
  categories: [...new Set(ultraMassiveQuestionPool.map(q => q.category))],
  questions: ultraMassiveQuestionPool
};

fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

console.log(`✅ Successfully generated ${ultraMassiveQuestionPool.length} questions!`);
console.log(`📁 Output saved to: ${outputPath}`);
console.log(`📊 Categories: ${outputData.categories.join(', ')}`);
console.log(`🎯 Mental age range: 15-50`);