#!/usr/bin/env python3
import json
import re

def deep_clean_question(text):
    """Thoroughly clean question text"""
    # List of all problematic patterns to remove
    patterns_to_remove = [
        r"진짜\s+진짜\s+",
        r"진짜\s+정말\s+",
        r"정말\s+진짜\s+",
        r"진짜\s+보통\s+",
        r"보통\s+진짜\s+",
        r"진짜\s+요즘\s+정말\s+",
        r"진짜\s+요즘\s+",
        r"요즘\s+진짜\s+",
        r"진짜\s+평소에\s+주말에\s+",
        r"진짜\s+평소에\s+",
        r"평소에\s+진짜\s+",
        r"보통\s+바쁠\s+때\s+",
        r"진짜\s+바쁠\s+때\s+",
        r"정말\s+바쁠\s+때\s+",
        r"요즘\s+바쁠\s+때\s+",
        r"보통\s+주말에\s+",
        r"진짜\s+저녁에\s+",
        r"정말\s+저녁에\s+",
        r"요즘\s+저녁에\s+",
        r"진짜\s+",
        r"정말\s+",
        r"보통\s+",
    ]
    
    cleaned = text
    for pattern in patterns_to_remove:
        cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)
    
    # Remove multiple spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    return cleaned

def find_all_duplicates(questions):
    """Find all duplicate questions with detailed info"""
    question_map = {}
    duplicates = []
    
    for i, q in enumerate(questions):
        cleaned = deep_clean_question(q['q'])
        normalized = cleaned.lower().strip()
        
        if normalized in question_map:
            duplicates.append({
                'index': i,
                'original': q['q'],
                'cleaned': cleaned,
                'duplicate_of_index': question_map[normalized]['index'],
                'duplicate_of_original': question_map[normalized]['original']
            })
        else:
            question_map[normalized] = {
                'index': i,
                'original': q['q'],
                'cleaned': cleaned,
                'question': q
            }
    
    return list(question_map.values()), duplicates

def main():
    # Load current data
    with open('data/question-pool-ultra.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"🔍 Analyzing {len(data['questions'])} questions...")
    
    # Find and remove duplicates
    unique_questions_info, duplicates = find_all_duplicates(data['questions'])
    
    print(f"\n❌ Found {len(duplicates)} duplicates:")
    for dup in duplicates[:20]:  # Show first 20
        print(f"  [{dup['index']}] '{dup['original']}' -> '{dup['cleaned']}'")
        print(f"      duplicate of [{dup['duplicate_of_index']}] '{dup['duplicate_of_original']}'")
    
    # Clean all questions
    cleaned_questions = []
    for info in unique_questions_info:
        q = info['question'].copy()
        q['q'] = info['cleaned']
        cleaned_questions.append(q)
    
    print(f"\n✅ {len(cleaned_questions)} unique questions after cleaning")
    
    # Show questions that still have issues
    print("\n🔍 Checking for remaining issues...")
    issues = []
    for i, q in enumerate(cleaned_questions):
        if any(phrase in q['q'] for phrase in ['주말에', '저녁에', '평일에', '아침에', '요즘', '평소에']):
            issues.append((i, q['q']))
    
    if issues:
        print(f"\n⚠️  Found {len(issues)} questions with time/context phrases:")
        for idx, q_text in issues[:10]:
            print(f"  [{idx}] {q_text}")
    
    # Ensure we have 1000 questions
    if len(cleaned_questions) < 1000:
        print(f"\n📝 Need to add {1000 - len(cleaned_questions)} questions to reach 1000")
    
    # Update and save
    data['questions'] = cleaned_questions[:1000]
    
    with open('data/question-pool-ultra.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Saved {len(data['questions'])} cleaned questions")

if __name__ == "__main__":
    main()