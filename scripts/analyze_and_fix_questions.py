#!/usr/bin/env python3
import json
import re
from collections import defaultdict, Counter
from datetime import datetime

def load_questions(filepath):
    """Load questions from JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def analyze_questions(data):
    """Analyze questions for duplicates and issues"""
    questions = data['questions']
    
    # Find duplicate or similar questions
    duplicate_groups = defaultdict(list)
    question_texts = []
    
    for idx, q in enumerate(questions):
        question_text = q['q']
        question_texts.append((idx, question_text, q['id']))
        
        # Normalize for comparison
        normalized = re.sub(r'[?!.,\s]+', ' ', question_text.lower()).strip()
        duplicate_groups[normalized].append((idx, q['id'], question_text))
    
    # Find actual duplicates
    duplicates = {k: v for k, v in duplicate_groups.items() if len(v) > 1}
    
    # Find problematic content
    problematic = []
    for idx, q in enumerate(questions):
        issues = []
        
        # Check for illegal app mentions
        if 'vanced' in q['q'].lower() or any('vanced' in a['t'].lower() for a in q['a']):
            issues.append('illegal_app')
        
        # Check for outdated topics
        outdated_terms = ['nft', '암호화폐', '비트코인', '이더리움', '도지코인', '테슬라 주식']
        if any(term in q['q'].lower() for term in outdated_terms):
            issues.append('outdated_topic')
        
        # Check for overly technical terms
        technical_terms = ['fyp 알고리즘', 'api', 'sdk', '블록체인', '메타버스']
        if any(term in q['q'].lower() for term in technical_terms):
            issues.append('too_technical')
            
        # Check for unnatural Korean
        if '하시나요?' in q['q'] and q['q'].count('하시나요?') > 1:
            issues.append('repetitive')
            
        if issues:
            problematic.append({
                'idx': idx,
                'id': q['id'],
                'question': q['q'],
                'issues': issues
            })
    
    # Check score distribution
    score_issues = []
    for idx, q in enumerate(questions):
        scores = [a['v'] for a in q['a']]
        
        # Check if scores make logical sense
        if max(scores) - min(scores) < 10:
            score_issues.append({
                'idx': idx,
                'id': q['id'],
                'question': q['q'],
                'scores': scores,
                'issue': 'low_variance'
            })
    
    return {
        'total_questions': len(questions),
        'duplicates': duplicates,
        'duplicate_count': sum(len(v) - 1 for v in duplicates.values()),
        'problematic': problematic,
        'score_issues': score_issues
    }

def print_analysis(analysis):
    """Print analysis results"""
    print(f"Total questions: {analysis['total_questions']}")
    print(f"Duplicate questions: {analysis['duplicate_count']}")
    print(f"Problematic questions: {len(analysis['problematic'])}")
    print(f"Score distribution issues: {len(analysis['score_issues'])}")
    
    print("\nSample duplicates:")
    for key, items in list(analysis['duplicates'].items())[:5]:
        print(f"\nDuplicate group:")
        for idx, qid, text in items:
            print(f"  - [{idx}] {qid}: {text}")
    
    print("\nSample problematic questions:")
    for item in analysis['problematic'][:10]:
        print(f"\n[{item['idx']}] {item['id']}: {item['question']}")
        print(f"  Issues: {', '.join(item['issues'])}")

if __name__ == "__main__":
    # Load and analyze
    data = load_questions('data/question-pool-ultra.json')
    analysis = analyze_questions(data)
    print_analysis(analysis)
    
    # Save analysis report
    with open('data/question_analysis_report.json', 'w', encoding='utf-8') as f:
        json.dump(analysis, f, ensure_ascii=False, indent=2)
    
    print("\nAnalysis report saved to data/question_analysis_report.json")