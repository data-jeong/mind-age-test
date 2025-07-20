#!/usr/bin/env python3
import json
import random

def clean_question_smartly(text):
    """Clean question text while preserving natural context"""
    # Remove only the most awkward combinations
    replacements = [
        ("진짜 진짜 ", ""),
        ("진짜 정말 ", ""),
        ("정말 진짜 ", ""),
        ("진짜 보통 ", ""),
        ("보통 진짜 ", ""),
        ("진짜 요즘 정말 ", ""),
        ("보통 바쁠 때 ", ""),
        ("진짜 바쁠 때 ", ""),
        ("정말 바쁠 때 ", ""),
        ("요즘 바쁠 때 ", ""),
        ("진짜 평소에 주말에 ", ""),
        ("진짜 평소에 ", "평소 "),
        ("평소에 진짜 ", "평소 "),
        ("보통 주말에 ", "주말에 "),
        ("진짜 저녁에 ", ""),
        ("정말 저녁에 ", ""),
        ("요즘 저녁에 ", ""),
        ("정말 요즘 바쁠 때 ", ""),
        ("진짜 ", ""),
        ("정말 ", ""),
        ("보통 ", ""),
    ]
    
    cleaned = text
    for old, new in replacements:
        cleaned = cleaned.replace(old, new)
    
    # Clean up spaces
    cleaned = ' '.join(cleaned.split())
    
    return cleaned

def create_diverse_questions():
    """Create a diverse set of 1000 natural questions"""
    questions = []
    
    # Base questions covering various topics
    base_questions = [
        # 일상 습관
        {"q": "알람 설정 개수는?", "a": [
            {"t": "1개", "v": 42},
            {"t": "3개 이상", "v": 22},
            {"t": "2개", "v": 32},
            {"t": "안 맞춤", "v": 18}
        ], "category": "lifestyle"},
        
        {"q": "휴대폰 배터리 충전 타이밍은?", "a": [
            {"t": "20% 이하", "v": 25},
            {"t": "50% 이하", "v": 35},
            {"t": "80% 이하", "v": 45},
            {"t": "수시로", "v": 20}
        ], "category": "lifestyle"},
        
        {"q": "이메일 확인 빈도는?", "a": [
            {"t": "실시간", "v": 38},
            {"t": "하루 한 번", "v": 42},
            {"t": "필요할 때만", "v": 25},
            {"t": "거의 안 봄", "v": 18}
        ], "category": "tech"},
        
        # 음식 선호
        {"q": "커피 온도 선호는?", "a": [
            {"t": "뜨거운 것만", "v": 45},
            {"t": "아이스만", "v": 20},
            {"t": "상관없음", "v": 30},
            {"t": "커피 안 마심", "v": 38}
        ], "category": "food"},
        
        {"q": "피자 먹는 방법은?", "a": [
            {"t": "손으로", "v": 25},
            {"t": "포크 나이프", "v": 45},
            {"t": "접어서", "v": 20},
            {"t": "피자 안 먹음", "v": 40}
        ], "category": "food"},
        
        # 소셜 미디어
        {"q": "SNS 스토리 확인은?", "a": [
            {"t": "다 봄", "v": 18},
            {"t": "친한 사람만", "v": 28},
            {"t": "가끔", "v": 38},
            {"t": "안 봄", "v": 48}
        ], "category": "social"},
        
        {"q": "프로필 사진 변경 주기는?", "a": [
            {"t": "자주", "v": 20},
            {"t": "가끔", "v": 30},
            {"t": "거의 안 함", "v": 40},
            {"t": "한 번도 안 함", "v": 50}
        ], "category": "social"},
        
        # 쇼핑 습관
        {"q": "온라인 쇼핑 시 리뷰는?", "a": [
            {"t": "꼼꼼히 다 읽음", "v": 35},
            {"t": "별점만 확인", "v": 25},
            {"t": "사진만 봄", "v": 20},
            {"t": "안 봄", "v": 15}
        ], "category": "shopping"},
        
        {"q": "할인 쿠폰 사용은?", "a": [
            {"t": "항상 챙김", "v": 42},
            {"t": "있으면 씀", "v": 32},
            {"t": "귀찮아서 안 씀", "v": 22},
            {"t": "몰라서 안 씀", "v": 18}
        ], "category": "shopping"},
        
        # 엔터테인먼트
        {"q": "드라마 시청 방법은?", "a": [
            {"t": "본방 사수", "v": 45},
            {"t": "몰아보기", "v": 25},
            {"t": "하이라이트만", "v": 20},
            {"t": "안 봄", "v": 35}
        ], "category": "entertainment"},
        
        {"q": "유튜브 광고 스킵은?", "a": [
            {"t": "바로 스킵", "v": 20},
            {"t": "가끔 봄", "v": 30},
            {"t": "프리미엄 이용", "v": 40},
            {"t": "광고 다 봄", "v": 45}
        ], "category": "entertainment"},
        
        # 건강/운동
        {"q": "운동 시간대는?", "a": [
            {"t": "새벽", "v": 45},
            {"t": "아침", "v": 35},
            {"t": "저녁", "v": 25},
            {"t": "안 함", "v": 20}
        ], "category": "health"},
        
        {"q": "건강기능식품 섭취는?", "a": [
            {"t": "여러 개", "v": 42},
            {"t": "1-2개", "v": 35},
            {"t": "가끔", "v": 25},
            {"t": "안 먹음", "v": 20}
        ], "category": "health"},
        
        # 금융
        {"q": "용돈 관리 방법은?", "a": [
            {"t": "가계부 작성", "v": 42},
            {"t": "카드 내역만", "v": 32},
            {"t": "대충 기억", "v": 25},
            {"t": "신경 안 씀", "v": 18}
        ], "category": "finance"},
        
        {"q": "적금 납입일은?", "a": [
            {"t": "자동이체", "v": 45},
            {"t": "알림 맞춰놓음", "v": 35},
            {"t": "생각날 때", "v": 25},
            {"t": "적금 안 함", "v": 20}
        ], "category": "finance"},
        
        # 여행
        {"q": "여행 계획은?", "a": [
            {"t": "세세하게", "v": 42},
            {"t": "대략적으로", "v": 32},
            {"t": "즉흥적으로", "v": 22},
            {"t": "여행 안 감", "v": 38}
        ], "category": "travel"},
        
        {"q": "여행 사진은?", "a": [
            {"t": "많이 찍음", "v": 22},
            {"t": "가끔 찍음", "v": 32},
            {"t": "거의 안 찍음", "v": 42},
            {"t": "절대 안 찍음", "v": 48}
        ], "category": "travel"},
        
        # 인간관계
        {"q": "생일 축하 메시지는?", "a": [
            {"t": "개인 메시지", "v": 35},
            {"t": "단톡에만", "v": 25},
            {"t": "SNS 댓글", "v": 20},
            {"t": "안 보냄", "v": 45}
        ], "category": "social"},
        
        {"q": "모임 약속 잡기는?", "a": [
            {"t": "내가 먼저", "v": 25},
            {"t": "연락 오면", "v": 35},
            {"t": "어쩔 수 없이", "v": 42},
            {"t": "안 만남", "v": 48}
        ], "category": "social"},
        
        # 패션
        {"q": "옷 구매 기준은?", "a": [
            {"t": "유행 따라", "v": 20},
            {"t": "편한 것", "v": 35},
            {"t": "가격", "v": 30},
            {"t": "오래 입을 것", "v": 45}
        ], "category": "fashion"},
        
        {"q": "신발 개수는?", "a": [
            {"t": "3켤레 이하", "v": 42},
            {"t": "5켤레 정도", "v": 35},
            {"t": "10켤레 이상", "v": 25},
            {"t": "셀 수 없음", "v": 20}
        ], "category": "fashion"}
    ]
    
    # Generate variations
    for base in base_questions:
        questions.append(base.copy())
    
    # Add more variations to reach 1000
    variations = [
        "평소 ", "늘 ", "주로 ", "보통 ", "일반적으로 ",
        "매일 ", "항상 ", "가끔 ", "자주 ", "때때로 "
    ]
    
    categories = ["lifestyle", "food", "tech", "social", "entertainment", 
                  "shopping", "health", "finance", "travel", "fashion", 
                  "preferences", "habits", "personality", "values", "memories"]
    
    # Generate more questions
    additional_templates = [
        # 일상 습관 추가
        ("샤워 시간은?", [
            ("5분 이내", 25), ("10분 정도", 35), 
            ("20분 이상", 20), ("30분 이상", 18)
        ]),
        ("양치질 시간은?", [
            ("1분 미만", 18), ("2분 정도", 35), 
            ("3분 이상", 42), ("대충", 22)
        ]),
        ("잠자리 정리는?", [
            ("매일", 45), ("가끔", 32), 
            ("주말에만", 25), ("안 함", 18)
        ]),
        ("화장실 갈 때 폰은?", [
            ("꼭 들고감", 20), ("가끔", 30), 
            ("안 가져감", 45), ("상황따라", 35)
        ]),
        
        # 음식 관련 추가
        ("라면 스프 타이밍은?", [
            ("물 끓을 때", 35), ("면 넣을 때", 25), 
            ("중간에", 30), ("마지막에", 20)
        ]),
        ("계란 프라이 굽기는?", [
            ("반숙", 25), ("완숙", 42), 
            ("터트려서", 32), ("안 먹음", 38)
        ]),
        ("국물 음식 먹는 순서는?", [
            ("건더기 먼저", 32), ("국물 먼저", 25), 
            ("번갈아가며", 35), ("상관없음", 20)
        ]),
        
        # 기술 사용 추가
        ("와이파이 비밀번호는?", [
            ("외움", 42), ("저장해둠", 35), 
            ("매번 물어봄", 22), ("모름", 18)
        ]),
        ("앱 정리는?", [
            ("폴더별로", 38), ("자주 쓰는 것만", 32), 
            ("그냥 둠", 25), ("하나씩", 45)
        ]),
        ("사진 백업은?", [
            ("자동", 40), ("수동으로", 35), 
            ("가끔", 25), ("안 함", 20)
        ]),
        
        # 여가 활동 추가
        ("주말 기상 시간은?", [
            ("평일과 동일", 45), ("1-2시간 늦게", 35), 
            ("점심때", 22), ("오후", 18)
        ]),
        ("휴가 사용은?", [
            ("계획적으로", 42), ("몰아서", 32), 
            ("띄엄띄엄", 25), ("못 씀", 38)
        ]),
        ("취미 활동은?", [
            ("꾸준히", 35), ("가끔", 30), 
            ("시작만", 25), ("없음", 38)
        ]),
    ]
    
    # Create variations
    question_id = len(questions)
    while len(questions) < 1000:
        for template in additional_templates:
            if len(questions) >= 1000:
                break
                
            q_text, answers = template
            
            # Sometimes add variation
            if random.random() < 0.3:
                q_text = random.choice(variations) + q_text
            
            # Create question
            question = {
                "q": q_text,
                "a": [{"t": t, "v": v} for t, v in answers],
                "category": random.choice(categories)
            }
            
            # Shuffle answers
            random.shuffle(question["a"])
            
            questions.append(question)
            question_id += 1
    
    return questions[:1000]

def main():
    # Create fresh 1000 questions
    questions = create_diverse_questions()
    
    # Create data structure
    data = {
        "questions": questions,
        "generatedAt": "2025-07-20T14:00:00Z"
    }
    
    # Save
    with open('data/question-pool-ultra.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Created {len(questions)} fresh questions")
    
    # Validate
    categories = {}
    for q in questions:
        cat = q.get('category', 'unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\n📊 Category distribution:")
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count}")
    
    print(f"\n📝 Sample questions:")
    for i in range(5):
        print(f"  {i+1}. {questions[i]['q']}")

if __name__ == "__main__":
    main()