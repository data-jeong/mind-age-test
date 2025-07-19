# Scripts 폴더 설명

이 폴더에는 GitHub Actions에서 실행되는 자동화 스크립트가 들어있습니다.

## generate-questions.js

OpenAI API를 사용해서 매일 새로운 정신연령 테스트 질문을 생성합니다.

### 작동 방식:
1. GitHub Actions가 매일 자정에 실행
2. GPT-4 API로 새로운 질문 10개 생성
3. index.html의 questions 배열 자동 업데이트
4. 변경사항 자동 커밋 & 푸시

### 필요한 설정:
- GitHub Secrets에 `OPENAI_API_KEY` 추가 필요