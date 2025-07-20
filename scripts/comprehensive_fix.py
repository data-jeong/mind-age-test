#!/usr/bin/env python3
import json
import random
import re
from datetime import datetime
from collections import defaultdict

# 2025년 트렌드에 맞는 다양한 질문들
COMPREHENSIVE_QUESTIONS = {
    "social_media": [
        # 일상적인 SNS 사용 패턴
        {"q": "친구가 스토리에 나를 태그하면?", "a": [
            {"t": "바로 리포스트", "v": 18},
            {"t": "댓글로 반응", "v": 25},
            {"t": "DM으로 고마워", "v": 30},
            {"t": "그냥 확인만", "v": 40}
        ]},
        {"q": "인스타그램 릴스를 만들어본 적이?", "a": [
            {"t": "자주 만들어 올림", "v": 15},
            {"t": "가끔 재미로", "v": 25},
            {"t": "한두 번 해봄", "v": 35},
            {"t": "만들 생각 없음", "v": 45}
        ]},
        {"q": "팔로워가 급격히 늘어난다면?", "a": [
            {"t": "신나서 더 열심히", "v": 20},
            {"t": "부담스러워질 듯", "v": 30},
            {"t": "별로 상관없음", "v": 40},
            {"t": "계정 비공개 전환", "v": 35}
        ]},
        {"q": "SNS에서 논란이 생기면?", "a": [
            {"t": "적극적으로 해명", "v": 25},
            {"t": "조용히 삭제", "v": 30},
            {"t": "무시하고 지나감", "v": 35},
            {"t": "잠시 활동 중단", "v": 40}
        ]},
    ],
    
    "lifestyle": [
        # 라이프스타일과 일상
        {"q": "아침에 일어나자마자 하는 일은?", "a": [
            {"t": "핸드폰 확인", "v": 20},
            {"t": "물 한 잔 마시기", "v": 35},
            {"t": "스트레칭", "v": 40},
            {"t": "알람 끄고 더 자기", "v": 25}
        ]},
        {"q": "집에서 가장 편한 복장은?", "a": [
            {"t": "잠옷 그대로", "v": 25},
            {"t": "트레이닝복", "v": 30},
            {"t": "편한 홈웨어", "v": 35},
            {"t": "외출복 그대로", "v": 40}
        ]},
        {"q": "청소는 언제 하시나요?", "a": [
            {"t": "매일 조금씩", "v": 40},
            {"t": "주말에 몰아서", "v": 30},
            {"t": "더러워지면", "v": 25},
            {"t": "손님 올 때만", "v": 20}
        ]},
        {"q": "취미 생활에 투자하는 시간은?", "a": [
            {"t": "매일 1시간 이상", "v": 35},
            {"t": "주말에만", "v": 30},
            {"t": "가끔씩", "v": 25},
            {"t": "취미가 없음", "v": 40}
        ]},
    ],
    
    "technology": [
        # 기술 활용 (2025년 트렌드)
        {"q": "AI 챗봇을 활용하시나요?", "a": [
            {"t": "매일 사용", "v": 25},
            {"t": "필요할 때만", "v": 30},
            {"t": "가끔 궁금해서", "v": 35},
            {"t": "사용 안 함", "v": 45}
        ]},
        {"q": "비밀번호 관리는 어떻게?", "a": [
            {"t": "생체 인증만 사용", "v": 25},
            {"t": "비밀번호 관리 앱", "v": 30},
            {"t": "메모장에 저장", "v": 40},
            {"t": "머릿속에 기억", "v": 35}
        ]},
        {"q": "스마트워치 알림 설정은?", "a": [
            {"t": "모든 알림 허용", "v": 20},
            {"t": "중요한 것만", "v": 35},
            {"t": "운동할 때만 착용", "v": 30},
            {"t": "스마트워치 없음", "v": 40}
        ]},
        {"q": "클라우드 저장소 사용은?", "a": [
            {"t": "여러 개 사용 중", "v": 30},
            {"t": "하나만 사용", "v": 35},
            {"t": "무료 용량만", "v": 25},
            {"t": "사용 안 함", "v": 45}
        ]},
    ],
    
    "shopping": [
        # 쇼핑 패턴
        {"q": "새벽 배송 서비스는?", "a": [
            {"t": "자주 이용", "v": 25},
            {"t": "급할 때만", "v": 30},
            {"t": "가끔 이용", "v": 35},
            {"t": "필요 없음", "v": 45}
        ]},
        {"q": "쇼핑 앱 알림은?", "a": [
            {"t": "세일 정보 다 받음", "v": 20},
            {"t": "관심 상품만", "v": 30},
            {"t": "대부분 꺼놓음", "v": 40},
            {"t": "앱 자체가 없음", "v": 45}
        ]},
        {"q": "장바구니에 담아둔 상품은?", "a": [
            {"t": "바로바로 구매", "v": 25},
            {"t": "세일 기다림", "v": 30},
            {"t": "고민하다 삭제", "v": 35},
            {"t": "그냥 보관용", "v": 20}
        ]},
        {"q": "반품이나 교환은?", "a": [
            {"t": "불만족하면 바로", "v": 25},
            {"t": "정말 안 맞을 때만", "v": 35},
            {"t": "귀찮아서 안 함", "v": 30},
            {"t": "처음부터 신중히 구매", "v": 40}
        ]},
    ],
    
    "food_dining": [
        # 음식과 식사
        {"q": "새로운 음식점 정보는 어디서?", "a": [
            {"t": "인스타그램 탐색", "v": 20},
            {"t": "네이버 지도 리뷰", "v": 30},
            {"t": "지인 추천", "v": 40},
            {"t": "우연히 발견", "v": 35}
        ]},
        {"q": "배달 주문 빈도는?", "a": [
            {"t": "일주일에 3번 이상", "v": 20},
            {"t": "일주일에 1-2번", "v": 30},
            {"t": "특별한 날만", "v": 40},
            {"t": "거의 안 시킴", "v": 45}
        ]},
        {"q": "음식 남기는 것에 대해?", "a": [
            {"t": "포장해서 가져감", "v": 40},
            {"t": "최대한 다 먹음", "v": 35},
            {"t": "배부르면 남김", "v": 25},
            {"t": "적당히 주문해서 안 남김", "v": 30}
        ]},
        {"q": "카페에서 텀블러 사용은?", "a": [
            {"t": "항상 가지고 다님", "v": 40},
            {"t": "가끔 생각날 때", "v": 30},
            {"t": "집에만 있음", "v": 25},
            {"t": "텀블러 없음", "v": 20}
        ]},
    ],
    
    "communication": [
        # 소통 방식
        {"q": "단톡방 알림은?", "a": [
            {"t": "다 켜놓음", "v": 25},
            {"t": "중요한 방만", "v": 35},
            {"t": "대부분 무음", "v": 30},
            {"t": "아예 안 봄", "v": 40}
        ]},
        {"q": "전화 통화보다 선호하는 건?", "a": [
            {"t": "음성 메시지", "v": 20},
            {"t": "텍스트 메시지", "v": 30},
            {"t": "영상 통화", "v": 25},
            {"t": "직접 만나서", "v": 40}
        ]},
        {"q": "이메일 확인 주기는?", "a": [
            {"t": "실시간 알림", "v": 30},
            {"t": "하루에 한두 번", "v": 35},
            {"t": "며칠에 한 번", "v": 25},
            {"t": "거의 안 봄", "v": 20}
        ]},
        {"q": "모르는 번호로 전화가 오면?", "a": [
            {"t": "안 받음", "v": 30},
            {"t": "받고 확인", "v": 35},
            {"t": "검색해보고 결정", "v": 25},
            {"t": "차단 목록 추가", "v": 20}
        ]},
    ],
    
    "work": [
        # 업무 스타일
        {"q": "재택근무를 한다면?", "a": [
            {"t": "더 효율적", "v": 30},
            {"t": "집중 안 됨", "v": 25},
            {"t": "반반", "v": 35},
            {"t": "출근이 더 좋음", "v": 40}
        ]},
        {"q": "점심시간 활용은?", "a": [
            {"t": "동료들과 식사", "v": 35},
            {"t": "혼자 여유롭게", "v": 30},
            {"t": "운동이나 산책", "v": 25},
            {"t": "일하면서 대충", "v": 20}
        ]},
        {"q": "업무 관련 공부는?", "a": [
            {"t": "퇴근 후 자기계발", "v": 35},
            {"t": "주말에 시간 내서", "v": 30},
            {"t": "회사에서 시키면", "v": 25},
            {"t": "따로 안 함", "v": 20}
        ]},
        {"q": "동료와 의견 충돌 시?", "a": [
            {"t": "논리적으로 설득", "v": 35},
            {"t": "적당히 타협", "v": 30},
            {"t": "일단 수용", "v": 25},
            {"t": "상사에게 판단 요청", "v": 40}
        ]},
    ],
    
    "health": [
        # 건강 관리
        {"q": "물은 하루에 얼마나?", "a": [
            {"t": "2L 이상", "v": 35},
            {"t": "1L 정도", "v": 30},
            {"t": "생각날 때만", "v": 25},
            {"t": "커피로 대체", "v": 20}
        ]},
        {"q": "건강검진은?", "a": [
            {"t": "매년 꼬박꼬박", "v": 40},
            {"t": "회사에서 하라면", "v": 30},
            {"t": "몇 년에 한 번", "v": 25},
            {"t": "아프면 병원", "v": 20}
        ]},
        {"q": "수면 패턴은?", "a": [
            {"t": "규칙적인 시간", "v": 40},
            {"t": "평일/주말 다름", "v": 30},
            {"t": "들쭉날쭉", "v": 25},
            {"t": "새벽형 인간", "v": 20}
        ]},
        {"q": "스트레스 해소법은?", "a": [
            {"t": "운동으로 땀 흘리기", "v": 35},
            {"t": "맛있는 거 먹기", "v": 25},
            {"t": "잠으로 해결", "v": 30},
            {"t": "취미 활동", "v": 40}
        ]},
    ],
    
    "relationships": [
        # 인간관계
        {"q": "새로운 모임에 초대받으면?", "a": [
            {"t": "기대하며 참석", "v": 25},
            {"t": "고민 후 결정", "v": 30},
            {"t": "웬만하면 거절", "v": 40},
            {"t": "분위기 봐서", "v": 35}
        ]},
        {"q": "친구와 약속 잡기는?", "a": [
            {"t": "일정 먼저 제안", "v": 30},
            {"t": "상대가 제안하면", "v": 35},
            {"t": "즉흥적으로", "v": 25},
            {"t": "약속 자체를 안 함", "v": 40}
        ]},
        {"q": "경조사 참석은?", "a": [
            {"t": "무조건 참석", "v": 40},
            {"t": "가까운 사이만", "v": 35},
            {"t": "축의금만 전달", "v": 30},
            {"t": "웬만하면 안 감", "v": 25}
        ]},
        {"q": "SNS 친구 신청이 오면?", "a": [
            {"t": "아는 사람만 수락", "v": 35},
            {"t": "프로필 확인 후", "v": 30},
            {"t": "대부분 수락", "v": 25},
            {"t": "거의 거절", "v": 40}
        ]},
    ],
    
    "finance": [
        # 금융과 소비
        {"q": "월급날 가장 먼저 하는 일은?", "a": [
            {"t": "저축 먼저", "v": 40},
            {"t": "고정 지출 정리", "v": 35},
            {"t": "갖고 싶던 거 구매", "v": 20},
            {"t": "투자 상품 확인", "v": 30}
        ]},
        {"q": "포인트나 쿠폰 활용은?", "a": [
            {"t": "꼼꼼히 다 챙김", "v": 35},
            {"t": "큰 것만 사용", "v": 30},
            {"t": "있으면 쓰고 말고", "v": 25},
            {"t": "귀찮아서 안 씀", "v": 20}
        ]},
        {"q": "구독 서비스 관리는?", "a": [
            {"t": "정기적으로 정리", "v": 35},
            {"t": "필요한 것만 유지", "v": 40},
            {"t": "가끔 확인", "v": 25},
            {"t": "뭐가 있는지 모름", "v": 20}
        ]},
        {"q": "충동구매를 하게 되면?", "a": [
            {"t": "후회하며 반품", "v": 30},
            {"t": "다음엔 신중하자", "v": 35},
            {"t": "만족하면 OK", "v": 25},
            {"t": "자주 있는 일", "v": 20}
        ]},
    ],
    
    "education": [
        # 학습과 성장
        {"q": "새로운 것을 배울 때?", "a": [
            {"t": "유튜브로 독학", "v": 25},
            {"t": "온라인 강의 수강", "v": 30},
            {"t": "책으로 공부", "v": 40},
            {"t": "직접 해보며 익힘", "v": 35}
        ]},
        {"q": "자격증 준비는?", "a": [
            {"t": "계획적으로 준비", "v": 35},
            {"t": "필요하면 도전", "v": 30},
            {"t": "시작했다가 포기", "v": 25},
            {"t": "관심 없음", "v": 20}
        ]},
        {"q": "독서 습관은?", "a": [
            {"t": "매일 조금씩", "v": 40},
            {"t": "한 달에 1-2권", "v": 35},
            {"t": "가끔 읽음", "v": 30},
            {"t": "거의 안 읽음", "v": 20}
        ]},
        {"q": "온라인 세미나 참여는?", "a": [
            {"t": "적극적으로 참여", "v": 35},
            {"t": "관심 있는 주제만", "v": 30},
            {"t": "회사에서 시키면", "v": 25},
            {"t": "시간 낭비", "v": 20}
        ]},
    ],
    
    "travel": [
        # 여행과 이동
        {"q": "여행 계획 스타일은?", "a": [
            {"t": "시간별로 짜임새 있게", "v": 40},
            {"t": "큰 틀만 정하고", "v": 35},
            {"t": "완전 자유 여행", "v": 25},
            {"t": "패키지 여행 선호", "v": 30}
        ]},
        {"q": "비행기 좌석 선택은?", "a": [
            {"t": "창가 좌석", "v": 30},
            {"t": "통로 좌석", "v": 35},
            {"t": "비상구 좌석", "v": 25},
            {"t": "아무데나", "v": 20}
        ]},
        {"q": "여행 중 사진은?", "a": [
            {"t": "인생샷 건지기", "v": 20},
            {"t": "기록용으로만", "v": 35},
            {"t": "눈으로만 감상", "v": 40},
            {"t": "동행이 찍어주면", "v": 30}
        ]},
        {"q": "숙소 예약 기준은?", "a": [
            {"t": "위치가 최우선", "v": 35},
            {"t": "가성비 중시", "v": 30},
            {"t": "리뷰 평점 확인", "v": 25},
            {"t": "분위기와 인테리어", "v": 20}
        ]},
    ],
    
    "environment": [
        # 환경과 지속가능성
        {"q": "일회용품 사용에 대해?", "a": [
            {"t": "최대한 안 쓰려고", "v": 40},
            {"t": "대체품이 있으면", "v": 35},
            {"t": "편한 게 최고", "v": 25},
            {"t": "상황에 따라", "v": 30}
        ]},
        {"q": "분리수거는?", "a": [
            {"t": "완벽하게 분류", "v": 40},
            {"t": "대충은 함", "v": 30},
            {"t": "헷갈리는 건 일반쓰레기", "v": 25},
            {"t": "잘 모르겠음", "v": 20}
        ]},
        {"q": "중고거래 활용은?", "a": [
            {"t": "자주 사고팔고", "v": 25},
            {"t": "필요할 때만", "v": 30},
            {"t": "사기만 함", "v": 35},
            {"t": "새 제품 선호", "v": 40}
        ]},
        {"q": "친환경 제품 구매는?", "a": [
            {"t": "비싸도 구매", "v": 40},
            {"t": "가격 비슷하면", "v": 35},
            {"t": "특별히 신경 안 씀", "v": 25},
            {"t": "성능이 우선", "v": 30}
        ]},
    ],
    
    "pop_culture": [
        # 대중문화
        {"q": "최신 드라마나 예능은?", "a": [
            {"t": "실시간으로 시청", "v": 25},
            {"t": "주말에 몰아보기", "v": 30},
            {"t": "화제작만 봄", "v": 35},
            {"t": "관심 없음", "v": 40}
        ]},
        {"q": "음악은 주로 어떻게?", "a": [
            {"t": "스트리밍 실시간 차트", "v": 20},
            {"t": "내 플레이리스트", "v": 30},
            {"t": "추천 알고리즘", "v": 25},
            {"t": "라디오나 TV", "v": 45}
        ]},
        {"q": "영화관 가는 빈도는?", "a": [
            {"t": "한 달에 2번 이상", "v": 25},
            {"t": "가끔 대작 나오면", "v": 30},
            {"t": "1년에 몇 번", "v": 35},
            {"t": "거의 안 감", "v": 40}
        ]},
        {"q": "팬덤 활동은?", "a": [
            {"t": "적극적인 덕후", "v": 20},
            {"t": "가볍게 좋아함", "v": 30},
            {"t": "관심은 있음", "v": 35},
            {"t": "팬덤 문화 모름", "v": 45}
        ]},
    ],
    
    "generation": [
        # 세대 특성
        {"q": "밈(meme) 문화에 대해?", "a": [
            {"t": "직접 만들기도 함", "v": 15},
            {"t": "보고 웃는 정도", "v": 25},
            {"t": "가끔 이해 안 됨", "v": 35},
            {"t": "뭔지 모르겠음", "v": 50}
        ]},
        {"q": "신조어 사용은?", "a": [
            {"t": "자연스럽게 사용", "v": 20},
            {"t": "아는 것만", "v": 30},
            {"t": "들어는 봤음", "v": 40},
            {"t": "무슨 말인지", "v": 50}
        ]},
        {"q": "복고 트렌드에 대해?", "a": [
            {"t": "새롭고 신선해", "v": 20},
            {"t": "예쁘긴 한데", "v": 25},
            {"t": "추억이 새록새록", "v": 40},
            {"t": "옛날이 좋았어", "v": 50}
        ]},
        {"q": "어린 시절 놀이는?", "a": [
            {"t": "온라인 게임", "v": 20},
            {"t": "보드게임이나 레고", "v": 30},
            {"t": "동네에서 뛰어놀기", "v": 40},
            {"t": "독서나 그림 그리기", "v": 35}
        ]},
    ],
    
    "hobbies": [
        # 취미 활동
        {"q": "주말 취미 활동은?", "a": [
            {"t": "새로운 곳 탐방", "v": 25},
            {"t": "집에서 영화 감상", "v": 30},
            {"t": "운동이나 등산", "v": 35},
            {"t": "가족과 시간 보내기", "v": 40}
        ]},
        {"q": "DIY나 만들기는?", "a": [
            {"t": "유튜브 보고 따라함", "v": 25},
            {"t": "키트 구매해서", "v": 30},
            {"t": "관심은 있는데", "v": 35},
            {"t": "손재주가 없어서", "v": 40}
        ]},
        {"q": "반려식물 키우기는?", "a": [
            {"t": "집이 정글", "v": 30},
            {"t": "몇 개 키움", "v": 35},
            {"t": "선인장만 겨우", "v": 25},
            {"t": "다 죽임", "v": 20}
        ]},
        {"q": "보드게임이나 방탈출은?", "a": [
            {"t": "마니아 수준", "v": 25},
            {"t": "친구들이랑 가끔", "v": 30},
            {"t": "해본 적 있음", "v": 35},
            {"t": "관심 없음", "v": 40}
        ]},
    ],
    
    "personal_growth": [
        # 개인 성장
        {"q": "목표 설정은?", "a": [
            {"t": "구체적인 계획 수립", "v": 35},
            {"t": "큰 방향만 정함", "v": 30},
            {"t": "마음속으로만", "v": 25},
            {"t": "흘러가는 대로", "v": 20}
        ]},
        {"q": "실패했을 때 반응은?", "a": [
            {"t": "원인 분석하고 재도전", "v": 35},
            {"t": "잠시 쉬고 다시", "v": 30},
            {"t": "다른 방법 찾기", "v": 25},
            {"t": "포기하고 다른 일", "v": 20}
        ]},
        {"q": "하루를 마무리할 때?", "a": [
            {"t": "일기나 회고 작성", "v": 40},
            {"t": "내일 할 일 정리", "v": 35},
            {"t": "오늘 하루 감사", "v": 30},
            {"t": "그냥 잠들기", "v": 20}
        ]},
        {"q": "새해 계획은?", "a": [
            {"t": "세부 계획까지 작성", "v": 35},
            {"t": "큰 목표 몇 개", "v": 30},
            {"t": "마음가짐만 새로", "v": 25},
            {"t": "작심삼일", "v": 20}
        ]},
    ],
    
    "fun": [
        # 재미와 오락
        {"q": "유머 코드는?", "a": [
            {"t": "아재개그도 OK", "v": 40},
            {"t": "블랙코미디", "v": 30},
            {"t": "상황극이나 드립", "v": 20},
            {"t": "진지한 게 좋아", "v": 35}
        ]},
        {"q": "노래방에서는?", "a": [
            {"t": "마이크 안 놓음", "v": 25},
            {"t": "분위기 맞춰서", "v": 30},
            {"t": "남들 노래 감상", "v": 35},
            {"t": "노래방 안 감", "v": 40}
        ]},
        {"q": "게임할 때 스타일은?", "a": [
            {"t": "승부욕 불타오름", "v": 25},
            {"t": "재미있으면 OK", "v": 30},
            {"t": "스토리 위주로", "v": 35},
            {"t": "게임 안 함", "v": 45}
        ]},
        {"q": "파티나 모임에서는?", "a": [
            {"t": "분위기 메이커", "v": 25},
            {"t": "적당히 어울림", "v": 30},
            {"t": "조용히 관찰", "v": 35},
            {"t": "일찍 집에 가고 싶어", "v": 40}
        ]},
    ],
    
    "gaming": [
        # 게임 관련
        {"q": "모바일 게임은?", "a": [
            {"t": "여러 개 동시 진행", "v": 20},
            {"t": "한 게임만 집중", "v": 30},
            {"t": "가끔 심심할 때", "v": 35},
            {"t": "게임 안 함", "v": 45}
        ]},
        {"q": "게임 아이템 구매는?", "a": [
            {"t": "과금 전사", "v": 20},
            {"t": "가끔 소액 결제", "v": 25},
            {"t": "무과금 주의", "v": 35},
            {"t": "게임에 돈 쓰는 게 이해 안 됨", "v": 45}
        ]},
        {"q": "e스포츠 관람은?", "a": [
            {"t": "경기장까지 가서 봄", "v": 20},
            {"t": "온라인 생중계", "v": 25},
            {"t": "하이라이트만", "v": 30},
            {"t": "관심 없음", "v": 45}
        ]},
        {"q": "레트로 게임에 대해?", "a": [
            {"t": "요즘 게임보다 재밌어", "v": 40},
            {"t": "추억의 게임 가끔", "v": 35},
            {"t": "리메이크 나오면", "v": 25},
            {"t": "옛날 게임은 불편해", "v": 20}
        ]},
    ],
    
    "future": [
        # 미래 전망
        {"q": "10년 후 나의 모습은?", "a": [
            {"t": "구체적인 계획 있음", "v": 35},
            {"t": "대략적인 그림", "v": 30},
            {"t": "잘 모르겠음", "v": 25},
            {"t": "생각해본 적 없음", "v": 20}
        ]},
        {"q": "은퇴 후 계획은?", "a": [
            {"t": "이미 준비 중", "v": 45},
            {"t": "막연히 생각만", "v": 35},
            {"t": "아직 멀었음", "v": 25},
            {"t": "은퇴가 가능할까", "v": 20}
        ]},
        {"q": "미래 기술에 대한 기대는?", "a": [
            {"t": "빨리 경험하고 싶어", "v": 25},
            {"t": "기대반 우려반", "v": 30},
            {"t": "지금도 충분해", "v": 40},
            {"t": "너무 빨라서 무서워", "v": 45}
        ]},
        {"q": "평생 학습에 대해?", "a": [
            {"t": "당연히 계속 배워야지", "v": 35},
            {"t": "필요하면 배움", "v": 30},
            {"t": "배울 게 너무 많아", "v": 25},
            {"t": "이제 그만 배우고 싶어", "v": 45}
        ]},
    ]
}

def load_questions(filepath):
    """Load questions from JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_questions(data, filepath):
    """Save questions to JSON file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def normalize_text(text):
    """Normalize text for comparison"""
    # Remove special characters and extra spaces
    text = re.sub(r'[?!.,\s]+', ' ', text.lower()).strip()
    # Remove common endings
    text = re.sub(r'(하시나요|하나요|인가요|있나요|있으신가요)$', '', text)
    return text.strip()

def is_duplicate(q1, q2, threshold=0.8):
    """Check if two questions are too similar"""
    norm1 = normalize_text(q1)
    norm2 = normalize_text(q2)
    
    # Exact match after normalization
    if norm1 == norm2:
        return True
    
    # Check for subset relationship
    if norm1 in norm2 or norm2 in norm1:
        return True
    
    # Check for high word overlap
    words1 = set(norm1.split())
    words2 = set(norm2.split())
    if len(words1) > 2 and len(words2) > 2:
        overlap = len(words1.intersection(words2))
        total = len(words1.union(words2))
        if overlap / total >= threshold:
            return True
    
    return False

def has_problematic_content(question_data):
    """Check if question contains problematic content"""
    q_text = question_data['q'].lower()
    a_texts = [a['t'].lower() for a in question_data['a']]
    all_text = q_text + ' ' + ' '.join(a_texts)
    
    # Illegal or inappropriate content
    illegal_terms = ['vanced', 'crack', 'torrent', 'apk 다운', '무료 다운로드']
    
    # Outdated topics (2025 perspective)
    outdated_terms = ['nft', '암호화폐', '비트코인', '이더리움', '도지코인', 
                     '테슬라 주식', '게임스탑', 'amc 주식', '밈코인']
    
    # Overly technical terms
    technical_terms = ['fyp 알고리즘', 'api', 'sdk', '블록체인', 
                      'defi', 'dao', 'web3', 'p2e']
    
    # Check all terms
    all_problematic = illegal_terms + outdated_terms + technical_terms
    for term in all_problematic:
        if term in all_text:
            return True
    
    # Check for awkward Korean
    if q_text.count('하시나요?') > 1:
        return True
    
    if '어떻게' in q_text and q_text.count('어떻게') > 1:
        return True
    
    return False

def fix_score_distribution(answers):
    """Ensure proper score distribution"""
    scores = [a['v'] for a in answers]
    
    # Check if scores have good variance
    if max(scores) - min(scores) < 20:
        # Redistribute scores
        if len(answers) == 4:
            new_scores = [15, 25, 35, 45]
            random.shuffle(new_scores)
            for i, answer in enumerate(answers):
                answer['v'] = new_scores[i]
    
    return answers

def get_random_question(category):
    """Get a random question from the comprehensive pool"""
    if category in COMPREHENSIVE_QUESTIONS:
        questions = COMPREHENSIVE_QUESTIONS[category]
    else:
        # Use a random category
        all_questions = []
        for cat_questions in COMPREHENSIVE_QUESTIONS.values():
            all_questions.extend(cat_questions)
        questions = all_questions
    
    if questions:
        return random.choice(questions).copy()
    return None

def comprehensive_fix(data):
    """Comprehensive fix of all questions"""
    questions = data['questions']
    fixed_questions = []
    seen_questions = set()
    question_count = defaultdict(int)
    
    # Track all question texts for duplicate detection
    all_question_texts = [q['q'] for q in questions]
    
    for idx, question in enumerate(questions):
        q_text = question['q']
        category = question.get('category', 'general')
        
        # Check if we should replace this question
        should_replace = False
        
        # Check for exact duplicates
        norm_text = normalize_text(q_text)
        if norm_text in seen_questions:
            should_replace = True
        
        # Check for similar questions
        for seen in seen_questions:
            if is_duplicate(q_text, seen):
                should_replace = True
                break
        
        # Check for problematic content
        if has_problematic_content(question):
            should_replace = True
        
        # Check category balance (max 60 questions per category)
        if question_count[category] >= 60:
            should_replace = True
        
        if should_replace:
            # Get replacement question
            new_q = get_random_question(category)
            if new_q:
                # Ensure the replacement isn't a duplicate
                attempts = 0
                while attempts < 10:
                    new_q_text = new_q['q']
                    if normalize_text(new_q_text) not in seen_questions:
                        break
                    new_q = get_random_question(category)
                    attempts += 1
                
                # Create properly formatted question
                fixed_q = {
                    "id": f"{category}_fixed_{idx}",
                    "category": category,
                    "subcategory": category,
                    "q": new_q['q'],
                    "a": fix_score_distribution(new_q['a'])
                }
                fixed_questions.append(fixed_q)
                seen_questions.add(normalize_text(new_q['q']))
                question_count[category] += 1
            else:
                # If no replacement available, skip this question
                continue
        else:
            # Keep the question but fix scores if needed
            question['a'] = fix_score_distribution(question['a'])
            fixed_questions.append(question)
            seen_questions.add(norm_text)
            question_count[category] += 1
    
    # If we have fewer than 1000 questions, add more
    while len(fixed_questions) < 1000:
        # Find categories with fewer questions
        min_category = min(question_count.keys(), key=lambda k: question_count[k])
        
        new_q = get_random_question(min_category)
        if new_q:
            fixed_q = {
                "id": f"{min_category}_added_{len(fixed_questions)}",
                "category": min_category,
                "subcategory": min_category,
                "q": new_q['q'],
                "a": fix_score_distribution(new_q['a'])
            }
            
            # Check it's not a duplicate
            if normalize_text(new_q['q']) not in seen_questions:
                fixed_questions.append(fixed_q)
                seen_questions.add(normalize_text(new_q['q']))
                question_count[min_category] += 1
    
    # Update data
    data['questions'] = fixed_questions[:1000]  # Ensure exactly 1000
    data['totalQuestions'] = len(data['questions'])
    data['generatedAt'] = datetime.utcnow().isoformat() + 'Z'
    
    return data

def print_summary(original_data, fixed_data):
    """Print summary of changes"""
    orig_count = len(original_data['questions'])
    fixed_count = len(fixed_data['questions'])
    
    print(f"\n=== 수정 완료 ===")
    print(f"원본 질문 수: {orig_count}")
    print(f"수정된 질문 수: {fixed_count}")
    
    # Count by category
    category_counts = defaultdict(int)
    for q in fixed_data['questions']:
        category_counts[q.get('category', 'unknown')] += 1
    
    print(f"\n카테고리별 질문 수:")
    for cat in sorted(category_counts.keys()):
        print(f"  {cat}: {category_counts[cat]}")
    
    # Sample some fixed questions
    print(f"\n수정된 질문 예시:")
    sample_indices = random.sample(range(len(fixed_data['questions'])), min(5, len(fixed_data['questions'])))
    for idx in sample_indices:
        q = fixed_data['questions'][idx]
        print(f"\n[{idx}] {q['q']}")
        for a in q['a']:
            print(f"  - {a['t']} ({a['v']}점)")

def main():
    # Load original data
    print("질문 파일을 읽는 중...")
    data = load_questions('data/question-pool-ultra.json')
    
    # Create backup
    backup_filename = f"data/question-pool-ultra.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    save_questions(data, backup_filename)
    print(f"백업 파일 생성: {backup_filename}")
    
    # Fix questions
    print("\n질문을 수정하는 중...")
    fixed_data = comprehensive_fix(data.copy())
    
    # Save fixed data
    save_questions(fixed_data, 'data/question-pool-ultra.json')
    print("\n수정된 파일 저장 완료: data/question-pool-ultra.json")
    
    # Print summary
    print_summary(data, fixed_data)

if __name__ == "__main__":
    main()