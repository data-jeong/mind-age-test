# 🧠 정신연령 테스트

매일 새로운 질문으로 만나는 정신연령 테스트\!

## 🎲 특징

- **1000개 이상의 질문**: 매일 다른 10개 질문이 자동 선택
- **다양한 카테고리**: SNS, 게임, 라이프스타일, 음식, 일 등 20개 카테고리
- **자동 업데이트**: GitHub Actions로 매일 자정 자동 갱신
- **모바일 최적화**: 반응형 디자인

## 🛠 기술 스택

- HTML/CSS/JavaScript
- GitHub Actions (자동화)
- Vercel (배포)

## 📁 구조

```
/
├── index.html              # 메인 페이지
├── favicon.svg            # 파비콘
├── data/
│   └── question-pool-ultra.json  # 1000개 질문 풀
├── scripts/
│   ├── rotate-questions.js       # 질문 로테이션 스크립트
│   └── generate-ultra-massive-pool.js  # 질문 생성기
└── .github/workflows/
    └── update-questions.yml      # 자동화 워크플로우
```

## 🔄 작동 원리

1. 매일 한국시간 자정에 GitHub Actions 실행
2. 1000개 질문 중 10개 무작위 선택
3. 결과 메시지도 매일 다르게 조합
4. 자동으로 커밋 & Vercel 배포

## 🚀 로컬 실행

```bash
# 질문 업데이트
node scripts/rotate-questions.js

# 브라우저에서 열기
open index.html
```

## 📝 질문 추가

`data/question-pool-ultra.json` 파일 수정 또는
`scripts/generate-ultra-massive-pool.js` 스크립트 수정 후 실행

## 🎯 점수 체계

- 15-20점: 매우 어린 정신연령
- 21-30점: 젊은 정신연령  
- 31-40점: 적당한 정신연령
- 41-50점: 성숙한 정신연령
- 51점+: 매우 성숙한 정신연령
