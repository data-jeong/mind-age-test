#!/usr/bin/env python3
import json
import random
from datetime import datetime

def fix_score_distribution(questions):
    """Fix score distribution for all questions"""
    # Define score templates for different answer patterns
    score_templates = [
        [15, 25, 35, 45],  # Even distribution
        [18, 28, 38, 48],  # Slightly higher
        [20, 30, 40, 50],  # Higher range
        [15, 30, 40, 45],  # Mixed
        [20, 25, 35, 45],  # Youth-middle focus
        [15, 25, 40, 50],  # Extreme ends
        [18, 32, 42, 48],  # Middle-aged focus
        [20, 35, 40, 45],  # Middle-upper focus
    ]
    
    for q in questions:
        scores = [a['v'] for a in q['a']]
        
        # Check if score distribution needs fixing
        if max(scores) - min(scores) < 20 or len(set(scores)) < 4:
            # Select a random template and shuffle
            template = random.choice(score_templates).copy()
            random.shuffle(template)
            
            # Apply to answers
            for i, answer in enumerate(q['a']):
                if i < len(template):
                    answer['v'] = template[i]
        
        # Ensure no duplicate scores
        seen_scores = set()
        for answer in q['a']:
            while answer['v'] in seen_scores:
                answer['v'] = max(10, min(55, answer['v'] + random.choice([-2, -1, 1, 2])))
            seen_scores.add(answer['v'])
    
    return questions

def main():
    # Load current data
    with open('data/question-pool-ultra.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Fix score distributions
    print("Fixing score distributions...")
    data['questions'] = fix_score_distribution(data['questions'])
    data['generatedAt'] = datetime.utcnow().isoformat() + 'Z'
    
    # Save updated data
    with open('data/question-pool-ultra.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("✅ Score distributions fixed!")
    
    # Validate again
    score_ranges = {'10-20': 0, '21-30': 0, '31-40': 0, '41-55': 0}
    for q in data['questions']:
        for a in q['a']:
            v = a['v']
            if 10 <= v <= 20:
                score_ranges['10-20'] += 1
            elif 21 <= v <= 30:
                score_ranges['21-30'] += 1
            elif 31 <= v <= 40:
                score_ranges['31-40'] += 1
            elif 41 <= v <= 55:
                score_ranges['41-55'] += 1
    
    print("\n📊 New score distribution:")
    for range_name, count in score_ranges.items():
        print(f"  {range_name}: {count} answers ({count/40:.1f}%)")

if __name__ == "__main__":
    main()