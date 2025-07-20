#!/usr/bin/env python3
import json
from collections import defaultdict, Counter

def validate_questions(filepath):
    """Validate the fixed question pool"""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data['questions']
    issues = []
    
    # Check for duplicates
    seen_questions = set()
    duplicates = []
    
    for q in questions:
        q_text = q['q'].lower().strip()
        if q_text in seen_questions:
            duplicates.append(q_text)
        seen_questions.add(q_text)
    
    if duplicates:
        issues.append(f"Found {len(duplicates)} duplicate questions")
    
    # Check score distribution
    score_issues = 0
    for q in questions:
        scores = [a['v'] for a in q['a']]
        if max(scores) - min(scores) < 15:
            score_issues += 1
    
    if score_issues > 0:
        issues.append(f"Found {score_issues} questions with poor score distribution")
    
    # Check for problematic content
    problematic = 0
    problematic_terms = ['vanced', 'nft', '암호화폐', 'fyp 알고리즘', 'api', 'sdk']
    
    for q in questions:
        q_text = q['q'].lower()
        a_texts = ' '.join([a['t'].lower() for a in q['a']])
        all_text = q_text + ' ' + a_texts
        
        if any(term in all_text for term in problematic_terms):
            problematic += 1
    
    if problematic > 0:
        issues.append(f"Found {problematic} questions with problematic content")
    
    # Category distribution
    category_counts = defaultdict(int)
    for q in questions:
        category_counts[q['category']] += 1
    
    # Summary
    print("=== VALIDATION REPORT ===")
    print(f"Total questions: {len(questions)}")
    print(f"Unique questions: {len(seen_questions)}")
    
    if issues:
        print("\n❌ Issues found:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("\n✅ No issues found!")
    
    print("\n📊 Category distribution:")
    for cat, count in sorted(category_counts.items()):
        print(f"  {cat}: {count}")
    
    # Score distribution analysis
    all_scores = []
    for q in questions:
        all_scores.extend([a['v'] for a in q['a']])
    
    score_counter = Counter(all_scores)
    print("\n📈 Score distribution:")
    print(f"  10-20 (young): {sum(score_counter[i] for i in range(10, 21))} answers")
    print(f"  21-30 (youth): {sum(score_counter[i] for i in range(21, 31))} answers")
    print(f"  31-40 (middle): {sum(score_counter[i] for i in range(31, 41))} answers")
    print(f"  41-55 (older): {sum(score_counter[i] for i in range(41, 56))} answers")

if __name__ == "__main__":
    validate_questions('data/question-pool-ultra.json')