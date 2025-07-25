# 정신연령 테스트 - TODO List

## ✅ 완료된 작업

### 1. Google Analytics 4 추적 설정
- [x] GA4 측정 ID 추가 (G-96LH7VJXEG)
- [x] 맞춤 측정기준 설정 (session_id, test_date, mental_age_result)
- [x] 이벤트 추적 구현
  - test_start: 테스트 시작
  - question_answered: 각 질문 답변
  - test_complete: 테스트 완료
  - test_abandon: 중도 이탈
  - share: 공유 액션
  - test_retry: 다시 하기

### 2. Google Search Console 연동
- [x] 인증 메타 태그 추가
- [x] sitemap.xml 생성 및 자동 업데이트
- [x] robots.txt 설정

### 3. Google AdSense 설정
- [x] ads.txt 파일 추가
- [x] 광고 위치 선정 및 스타일링
- [x] 광고 코드 삽입 (현재 주석 처리)

### 4. SEO 최적화
- [x] 메타 태그 확장
- [x] 구조화된 데이터 추가 (Schema.org)
- [x] Open Graph & Twitter Card
- [x] 한국 검색엔진 최적화
- [x] SEO 푸터 (숨김 처리)

### 5. 기능 구현
- [x] 매일 질문 자동 로테이션 (GitHub Actions)
- [x] 1000개 질문 풀 생성
- [x] 답변 위치 셔플링
- [x] 중복 질문 방지
- [x] 결과 다양화 (100개 타이틀 x 5개 설명)

## 📌 대기 중인 작업

### 1. AdSense 승인 후 광고 활성화
- [ ] AdSense 승인 확인
- [ ] 광고 단위 생성 및 ID 획득
- [ ] index.html에서 광고 코드 주석 해제
- [ ] `YOUR_AD_SLOT_ID`를 실제 광고 단위 ID로 교체
- [ ] AdSense 스크립트 활성화

### 2. 검색 순위 상승 전략 실행

#### 즉시 실행 가능
- [ ] OG 이미지 생성 (og-image-template.html 활용)
- [ ] 네이버 웹마스터도구 등록
- [ ] 다음 검색등록 신청
- [ ] Google Search Console에서 색인 요청

#### 백링크 구축
- [ ] 관련 커뮤니티 공유
  - 에펨코리아
  - 디시인사이드
  - 클리앙
  - 보배드림 자유게시판
- [ ] 블로그 리뷰 유도
- [ ] 인스타그램/틱톡 콘텐츠 제작

#### 콘텐츠 마케팅
- [ ] "오늘의 정신연령 질문" SNS 시리즈
- [ ] 연령대별 통계 인포그래픽
- [ ] 재미있는 결과 모음집

#### 성능 최적화
- [ ] Core Web Vitals 측정 및 개선
- [ ] 이미지 최적화 (WebP 변환)
- [ ] 폰트 로딩 최적화
- [ ] 캐싱 전략 수립

## 🎯 타겟 키워드

### 주요 키워드
- 정신연령 테스트
- 나이 테스트
- 정신연령테스트
- 멘탈 나이
- 심리테스트

### 롱테일 키워드
- 내 정신연령은 몇살
- 정신연령 알아보기
- 무료 심리테스트 사이트
- 10초 정신연령 테스트
- 정신나이 테스트

## 📊 추적 지표

### GA4에서 확인할 지표
- 일일 활성 사용자 (DAU)
- 테스트 완료율
- 평균 답변 시간
- 질문별 이탈률
- 공유 비율
- 재시도율

### Search Console에서 확인할 지표
- 검색 노출수
- 클릭률 (CTR)
- 평균 순위
- 유입 키워드

## 💡 개선 아이디어

### 기능 추가
- [ ] 결과 이미지 다운로드 기능
- [ ] 친구와 비교하기 기능
- [ ] 월별/연도별 통계 페이지
- [ ] 다크모드/라이트모드 토글

### 수익화
- [ ] AdSense 최적화
- [ ] 프리미엄 테스트 (더 정확한 분석)
- [ ] 관련 상품 추천 (책, 앱 등)

## 📅 업데이트 로그

### 2025-01-19
- 초기 버전 출시
- GA4, Search Console, AdSense 설정
- SEO 최적화 완료
- 광고 영역 임시 비활성화