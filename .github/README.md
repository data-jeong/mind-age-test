# 📂 .github 폴더

GitHub 관련 설정 및 자동화 워크플로우를 관리합니다.

## 📁 구조

```
.github/
└── workflows/
    └── update-questions.yml
```

## 🔄 GitHub Actions Workflow

### update-questions.yml
- **이름**: Daily Question Rotation
- **실행 시간**: 매일 한국시간 자정 (UTC 15:00)
- **수동 실행**: 가능 (workflow_dispatch)

### 워크플로우 단계

1. **Checkout repository**
   - 저장소 코드 체크아웃
   - GitHub token 사용

2. **Setup Node.js**
   - Node.js 18 버전 설정

3. **Rotate questions**
   - `scripts/rotate-questions.js` 실행
   - 새로운 10개 질문 선택

4. **Commit and push**
   - 변경사항 자동 커밋
   - 커밋 메시지: "🎲 Daily question rotation - YYYY-MM-DD"
   - GitHub Actions bot으로 푸시

## ⚙️ 권한 설정

```yaml
permissions:
  contents: write
```
- 저장소에 쓰기 권한 필요
- 자동 커밋/푸시를 위함

## 🚀 수동 실행 방법

1. GitHub 저장소 → Actions 탭
2. "Daily Question Rotation" 선택
3. "Run workflow" 버튼 클릭
4. Branch: main 선택
5. "Run workflow" 실행

## 🔧 트러블슈팅

### 실행 실패 시
- Actions 탭에서 로그 확인
- 주로 권한 문제일 가능성
- Settings → Actions → General에서 권한 확인

### 시간대 문제
- Cron은 UTC 기준
- 한국시간 자정 = UTC 15:00
- 서머타임 주의

## 📅 Cron 표현식

```
0 15 * * *
```
- 분(0) 시(15) 일(*) 월(*) 요일(*)
- 매일 UTC 15:00 (한국시간 자정)