# 📂 Scripts 폴더

정신연령 테스트의 자동화 스크립트들을 관리합니다.

## 🔧 스크립트 목록

### rotate-questions.js
- **용도**: 매일 새로운 질문 10개를 선택하여 index.html 업데이트
- **실행**: `node scripts/rotate-questions.js`
- **기능**:
  - 날짜 기반 시드로 매일 같은 결과 보장
  - 1000개 질문 중 10개 무작위 선택
  - 결과 메시지도 매일 다르게 조합
  - index.html 자동 업데이트

### generate-ultra-massive-pool.js
- **용도**: 1000개의 질문을 생성하는 스크립트
- **실행**: `node scripts/generate-ultra-massive-pool.js`
- **출력**: `data/question-pool-ultra.json`
- **특징**:
  - 20개 카테고리
  - 각 질문에 4개 선택지
  - 15-50점 범위의 점수 체계

### analyze-questions.js (있을 경우)
- **용도**: 질문 풀 분석 및 통계
- **기능**: 카테고리별 분포, 점수 분포 등 분석

## 🔄 자동화 프로세스

1. **GitHub Actions 트리거** (매일 자정)
2. **rotate-questions.js 실행**
3. **index.html 업데이트**
4. **자동 커밋 & 푸시**
5. **Vercel 자동 배포**

## 💡 사용 예시

```bash
# 수동으로 질문 로테이션
node scripts/rotate-questions.js

# 새로운 질문 풀 생성
node scripts/generate-ultra-massive-pool.js

# 특정 날짜의 질문 확인 (시드 값 변경)
# rotate-questions.js 내 getDailySeed() 함수 수정
```

## ⚙️ 주요 함수

### getDailySeed()
- 오늘 날짜를 시드로 변환
- 같은 날은 항상 같은 시드

### shuffleArray(array, seed)
- Fisher-Yates 알고리즘
- 시드 기반 셔플로 일관성 보장

### selectDailyQuestions()
- 1000개 중 10개 선택
- 카테고리 균형 고려 가능

### selectDailyResults()
- 결과 메시지 매일 다르게 조합
- 5개 연령대별 다른 메시지