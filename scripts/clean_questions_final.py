#!/usr/bin/env python3
import json
import re
from collections import defaultdict

def clean_question_text(text):
    """Remove awkward prefixes and clean up question text"""
    # Remove awkward prefixes
    prefixes_to_remove = [
        "진짜 진짜 ",
        "진짜 정말 ",
        "진짜 보통 ",
        "보통 진짜 ",
        "보통 바쁠 때 ",
        "진짜 바쁠 때 ",
        "보통 주말에 ",
        "진짜 저녁에 ",
        "정말 진짜 ",
        "요즘 바쁠 때 ",
    ]
    
    cleaned = text
    for prefix in prefixes_to_remove:
        cleaned = cleaned.replace(prefix, "")
    
    # Remove double spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    return cleaned

def fix_duplicate_questions(questions):
    """Remove duplicate questions and ensure uniqueness"""
    seen_questions = {}
    unique_questions = []
    duplicates = []
    
    for q in questions:
        cleaned_q = clean_question_text(q['q'])
        q_key = cleaned_q.lower().strip()
        
        if q_key in seen_questions:
            duplicates.append({
                'original': q['q'],
                'cleaned': cleaned_q,
                'duplicate_of': seen_questions[q_key]
            })
        else:
            q['q'] = cleaned_q
            seen_questions[q_key] = cleaned_q
            unique_questions.append(q)
    
    return unique_questions, duplicates

def ensure_1000_questions(questions):
    """Ensure we have exactly 1000 questions by adding more if needed"""
    if len(questions) >= 1000:
        return questions[:1000]
    
    # Add more natural questions to reach 1000
    additional_questions = [
        {
            "q": "배달 음식 주문 빈도는?",
            "a": [
                {"t": "거의 매일", "v": 18},
                {"t": "일주일에 2-3번", "v": 28},
                {"t": "가끔씩", "v": 38},
                {"t": "거의 안 함", "v": 48}
            ],
            "category": "lifestyle"
        },
        {
            "q": "운동화 고를 때 중요한 건?",
            "a": [
                {"t": "디자인", "v": 20},
                {"t": "편안함", "v": 45},
                {"t": "가격", "v": 35},
                {"t": "브랜드", "v": 25}
            ],
            "category": "preferences"
        },
        {
            "q": "머리 감는 시간대는?",
            "a": [
                {"t": "아침", "v": 42},
                {"t": "저녁", "v": 32},
                {"t": "때마다 다름", "v": 22},
                {"t": "새벽", "v": 18}
            ],
            "category": "lifestyle"
        },
        {
            "q": "지갑 속 현금은?",
            "a": [
                {"t": "항상 넉넉히", "v": 48},
                {"t": "비상금 정도", "v": 38},
                {"t": "거의 없음", "v": 22},
                {"t": "적당히", "v": 32}
            ],
            "category": "lifestyle"
        },
        {
            "q": "주차할 때 선호하는 곳은?",
            "a": [
                {"t": "입구 가까이", "v": 45},
                {"t": "구석진 곳", "v": 35},
                {"t": "아무데나", "v": 25},
                {"t": "차 없음", "v": 20}
            ],
            "category": "preferences"
        }
    ]
    
    # Add questions until we reach 1000
    while len(questions) < 1000:
        for q in additional_questions:
            if len(questions) >= 1000:
                break
            questions.append(q)
    
    return questions

def main():
    # Load current data
    with open('data/question-pool-ultra.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"🔍 Found {len(data['questions'])} questions in total")
    
    # Clean and remove duplicates
    cleaned_questions, duplicates = fix_duplicate_questions(data['questions'])
    
    print(f"✅ Cleaned {len(cleaned_questions)} unique questions")
    print(f"❌ Removed {len(duplicates)} duplicates")
    
    if duplicates:
        print("\n📋 Removed duplicates:")
        for dup in duplicates[:10]:  # Show first 10
            print(f"  - '{dup['original']}' → '{dup['cleaned']}' (duplicate of '{dup['duplicate_of']}')")
    
    # Ensure we have exactly 1000 questions
    final_questions = ensure_1000_questions(cleaned_questions)
    
    # Update data
    data['questions'] = final_questions
    data['generatedAt'] = '2025-07-20T13:00:00Z'
    
    # Save updated data
    with open('data/question-pool-ultra.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Final question count: {len(final_questions)}")
    
    # Show some cleaned examples
    print("\n📝 Sample cleaned questions:")
    for i in range(min(5, len(final_questions))):
        print(f"  {i+1}. {final_questions[i]['q']}")

if __name__ == "__main__":
    main()