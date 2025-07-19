# 📂 Data 폴더

이 폴더는 정신연령 테스트의 질문 데이터를 관리합니다.

## 📄 파일 구조

### question-pool-ultra.json
- **용도**: 1000개의 질문과 결과 메시지를 담은 대용량 질문 풀
- **크기**: 약 500KB
- **구조**:
  ```json
  {
    "version": "1.0.0",
    "totalQuestions": 1000,
    "categories": ["social_media", "gaming", "lifestyle", ...],
    "questions": [
      {
        "id": "unique_id",
        "category": "category_name",
        "subcategory": "subcategory_name",
        "q": "질문 텍스트",
        "a": [
          { "t": "답변 텍스트", "v": 점수 }
        ]
      }
    ]
  }
  ```

## 🎯 카테고리 (20개)

1. **social_media** - SNS, 인스타, 틱톡 관련
2. **gaming** - 게임, e스포츠
3. **technology** - 기술, AI, 암호화폐
4. **work** - 직장, 재택근무
5. **lifestyle** - 라이프스타일
6. **relationships** - 인간관계
7. **finance** - 돈, 투자
8. **health** - 건강, 운동
9. **education** - 교육, 학습
10. **future** - 미래 계획
11. **environment** - 환경, 사회이슈
12. **travel** - 여행
13. **pop_culture** - 대중문화
14. **generation** - 세대별 특성
15. **food_dining** - 음식, 배달
16. **shopping** - 쇼핑
17. **communication** - 소통
18. **hobbies** - 취미
19. **personal_growth** - 자기계발
20. **fun** - 재미있는 가상 상황

## 📊 점수 체계

- **15-20점**: 매우 어린 정신연령 (Z세대 특성)
- **21-30점**: 젊은 정신연령 (밀레니얼 특성)
- **31-40점**: 중간 정신연령 (X세대 특성)
- **41-50점**: 성숙한 정신연령 (베이비부머 특성)
- **50점+**: 매우 성숙한 정신연령

## 🔄 업데이트 방법

1. JSON 파일 직접 수정
2. 또는 `scripts/generate-ultra-massive-pool.js` 수정 후 재실행