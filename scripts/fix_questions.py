#!/usr/bin/env python3
import json
import random
from datetime import datetime

# 새로운 질문 템플릿 (카테고리별)
NEW_QUESTIONS = {
    "social_media": [
        {
            "q": "친구들이랑 만나면 주로 뭐하시나요?",
            "a": [
                {"t": "카페에서 수다 떨기", "v": 25},
                {"t": "맛집 탐방하기", "v": 30},
                {"t": "게임이나 노래방", "v": 20},
                {"t": "집에서 넷플릭스", "v": 35}
            ]
        },
        {
            "q": "SNS 피드를 보다가 광고가 나오면?",
            "a": [
                {"t": "재밌으면 끝까지 봄", "v": 20},
                {"t": "바로 스킵", "v": 30},
                {"t": "관심 있으면 클릭", "v": 25},
                {"t": "광고 차단 앱 사용", "v": 35}
            ]
        },
        {
            "q": "프로필 사진은 얼마나 자주 바꾸시나요?",
            "a": [
                {"t": "매달 바꿈", "v": 15},
                {"t": "몇 달에 한 번", "v": 25},
                {"t": "1년에 한두 번", "v": 35},
                {"t": "거의 안 바꿈", "v": 45}
            ]
        }
    ],
    "lifestyle": [
        {
            "q": "주말 아침은 보통 어떻게 보내시나요?",
            "a": [
                {"t": "늦잠 자기", "v": 25},
                {"t": "운동하러 가기", "v": 35},
                {"t": "브런치 먹으러 가기", "v": 30},
                {"t": "집안일 하기", "v": 40}
            ]
        },
        {
            "q": "카페에서 주문할 때 어떤 스타일이신가요?",
            "a": [
                {"t": "신메뉴 도전", "v": 20},
                {"t": "늘 먹던 것만", "v": 40},
                {"t": "기분따라 다르게", "v": 30},
                {"t": "직원 추천 메뉴", "v": 25}
            ]
        },
        {
            "q": "집에서 혼자 있을 때 뭐하시나요?",
            "a": [
                {"t": "유튜브나 넷플릭스", "v": 25},
                {"t": "게임하기", "v": 20},
                {"t": "책 읽기", "v": 40},
                {"t": "요리나 청소", "v": 35}
            ]
        }
    ],
    "shopping": [
        {
            "q": "온라인 쇼핑할 때 리뷰는 얼마나 보시나요?",
            "a": [
                {"t": "별점만 확인", "v": 30},
                {"t": "사진 리뷰 위주로", "v": 25},
                {"t": "꼼꼼히 다 읽음", "v": 40},
                {"t": "안 보고 바로 구매", "v": 20}
            ]
        },
        {
            "q": "쇼핑할 때 결제 수단은?",
            "a": [
                {"t": "간편결제 앱", "v": 25},
                {"t": "신용카드", "v": 35},
                {"t": "체크카드", "v": 30},
                {"t": "계좌이체", "v": 40}
            ]
        }
    ],
    "technology": [
        {
            "q": "새로운 앱을 설치할 때 어떻게 하시나요?",
            "a": [
                {"t": "권한 설정 꼼꼼히 확인", "v": 35},
                {"t": "그냥 다 허용", "v": 20},
                {"t": "필요한 것만 허용", "v": 30},
                {"t": "잘 모르겠어서 기본값", "v": 40}
            ]
        },
        {
            "q": "스마트폰 배터리가 20% 남았을 때?",
            "a": [
                {"t": "바로 충전기 찾기", "v": 35},
                {"t": "절전모드 켜기", "v": 30},
                {"t": "그냥 계속 사용", "v": 20},
                {"t": "보조배터리 연결", "v": 25}
            ]
        }
    ],
    "food_dining": [
        {
            "q": "배달 음식 주문할 때 어떻게 고르시나요?",
            "a": [
                {"t": "평점 높은 곳", "v": 30},
                {"t": "늘 시키던 곳", "v": 40},
                {"t": "새로운 곳 도전", "v": 25},
                {"t": "할인 이벤트 중인 곳", "v": 20}
            ]
        },
        {
            "q": "음식 사진은 언제 찍으시나요?",
            "a": [
                {"t": "먹기 전에 무조건", "v": 20},
                {"t": "예쁘면 찍음", "v": 25},
                {"t": "거의 안 찍음", "v": 40},
                {"t": "특별한 날만", "v": 35}
            ]
        }
    ],
    "communication": [
        {
            "q": "메신저 알림이 울렸을 때?",
            "a": [
                {"t": "바로 확인", "v": 25},
                {"t": "나중에 몰아서", "v": 35},
                {"t": "중요한 사람만 바로", "v": 30},
                {"t": "무음이라 잘 모름", "v": 20}
            ]
        },
        {
            "q": "이모티콘은 주로 어떤 걸 쓰시나요?",
            "a": [
                {"t": "최신 유행 이모티콘", "v": 20},
                {"t": "기본 이모티콘", "v": 40},
                {"t": "구매한 캐릭터", "v": 30},
                {"t": "움직이는 스티커", "v": 25}
            ]
        }
    ],
    "work": [
        {
            "q": "회의할 때 주로 어떤 역할인가요?",
            "a": [
                {"t": "적극적으로 의견 제시", "v": 35},
                {"t": "필요할 때만 발언", "v": 30},
                {"t": "주로 듣는 편", "v": 25},
                {"t": "회의록 작성", "v": 40}
            ]
        },
        {
            "q": "업무 메신저 답장은 언제 하시나요?",
            "a": [
                {"t": "즉시 답장", "v": 25},
                {"t": "업무시간에만", "v": 35},
                {"t": "급한 것만 바로", "v": 30},
                {"t": "여유 있을 때", "v": 40}
            ]
        }
    ],
    "health": [
        {
            "q": "운동은 주로 언제 하시나요?",
            "a": [
                {"t": "아침 일찍", "v": 40},
                {"t": "퇴근 후 저녁", "v": 30},
                {"t": "주말에만", "v": 25},
                {"t": "생각날 때", "v": 20}
            ]
        },
        {
            "q": "건강 관리 앱을 사용하시나요?",
            "a": [
                {"t": "매일 체크", "v": 35},
                {"t": "가끔씩", "v": 30},
                {"t": "깔아만 놓음", "v": 25},
                {"t": "사용 안 함", "v": 40}
            ]
        }
    ],
    "relationships": [
        {
            "q": "친구 생일은 어떻게 기억하시나요?",
            "a": [
                {"t": "달력에 저장", "v": 30},
                {"t": "SNS 알림으로", "v": 25},
                {"t": "그냥 외움", "v": 40},
                {"t": "잘 못 챙김", "v": 20}
            ]
        },
        {
            "q": "모임에 늦을 것 같을 때?",
            "a": [
                {"t": "미리 연락", "v": 35},
                {"t": "도착 예정 시간 공유", "v": 30},
                {"t": "최대한 빨리 가기", "v": 25},
                {"t": "늦는대로 도착", "v": 20}
            ]
        }
    ]
}

def fix_questions(data):
    """Fix problematic questions and remove duplicates"""
    questions = data['questions']
    seen_questions = set()
    fixed_questions = []
    
    # Track which indices to replace
    to_replace = set()
    
    # First pass: identify duplicates and problematic questions
    for idx, q in enumerate(questions):
        q_text = q['q'].lower().strip()
        
        # Check for duplicates
        if q_text in seen_questions:
            to_replace.add(idx)
            continue
        seen_questions.add(q_text)
        
        # Check for problematic content
        if any(term in q_text for term in ['vanced', 'nft', '암호화폐', '비트코인', 
                                           'fyp 알고리즘', 'api', 'sdk', '블록체인', '메타버스']):
            to_replace.add(idx)
            continue
            
        # Check for repetitive phrasing
        if q_text.count('하시나요?') > 1 or q_text.count('어떻게') > 2:
            to_replace.add(idx)
            continue
    
    # Create pool of replacement questions
    replacement_pool = []
    for category, questions_list in NEW_QUESTIONS.items():
        for q_template in questions_list:
            replacement_pool.append((category, q_template))
    
    # Second pass: build fixed question list
    replacement_idx = 0
    for idx, q in enumerate(questions):
        if idx in to_replace:
            # Get replacement question
            if replacement_idx < len(replacement_pool):
                category, new_q = replacement_pool[replacement_idx]
                replacement_idx += 1
                
                # Create new question with proper structure
                new_question = {
                    "id": f"{category}_fixed_{idx}",
                    "category": category,
                    "subcategory": category,
                    "q": new_q["q"],
                    "a": new_q["a"]
                }
                fixed_questions.append(new_question)
            else:
                # Generate a new question if we run out of replacements
                fixed_questions.append(generate_new_question(idx, q.get('category', 'general')))
        else:
            # Fix score distribution if needed
            q_fixed = fix_score_distribution(q)
            fixed_questions.append(q_fixed)
    
    # Update data
    data['questions'] = fixed_questions
    data['generatedAt'] = datetime.utcnow().isoformat() + 'Z'
    
    return data

def fix_score_distribution(question):
    """Ensure proper score distribution for age ranges"""
    # Score ranges: 10-20 (young), 20-30 (youth), 30-40 (middle), 40-55 (older)
    answers = question['a']
    
    # If variance is too low, redistribute scores
    scores = [a['v'] for a in answers]
    if max(scores) - min(scores) < 15:
        # Redistribute scores evenly across age ranges
        new_scores = [15, 25, 35, 45]
        random.shuffle(new_scores)
        
        for i, answer in enumerate(answers):
            if i < len(new_scores):
                answer['v'] = new_scores[i]
    
    return question

def generate_new_question(idx, category):
    """Generate a new question when we run out of templates"""
    templates = [
        {
            "q": "평소에 뉴스는 어떻게 보시나요?",
            "a": [
                {"t": "유튜브 요약 영상", "v": 20},
                {"t": "포털 사이트", "v": 30},
                {"t": "신문이나 방송", "v": 45},
                {"t": "SNS 타임라인", "v": 25}
            ]
        },
        {
            "q": "새로운 사람을 만날 때 어떤가요?",
            "a": [
                {"t": "먼저 말 걸기", "v": 25},
                {"t": "상대가 먼저 말하길 기다림", "v": 35},
                {"t": "자연스럽게", "v": 30},
                {"t": "최대한 피함", "v": 40}
            ]
        },
        {
            "q": "휴가 계획은 보통 언제 세우시나요?",
            "a": [
                {"t": "몇 달 전부터", "v": 40},
                {"t": "한 달 전쯤", "v": 35},
                {"t": "1-2주 전", "v": 25},
                {"t": "즉흥적으로", "v": 20}
            ]
        }
    ]
    
    template = random.choice(templates)
    return {
        "id": f"{category}_generated_{idx}",
        "category": category,
        "subcategory": category,
        "q": template["q"],
        "a": template["a"]
    }

def main():
    # Load original data
    with open('data/question-pool-ultra.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create backup
    backup_filename = f"data/question-pool-ultra.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(backup_filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Backup created: {backup_filename}")
    
    # Fix questions
    fixed_data = fix_questions(data)
    
    # Save fixed data
    with open('data/question-pool-ultra.json', 'w', encoding='utf-8') as f:
        json.dump(fixed_data, f, ensure_ascii=False, indent=2)
    
    print("Questions fixed and saved!")
    print(f"Total questions: {len(fixed_data['questions'])}")

if __name__ == "__main__":
    main()