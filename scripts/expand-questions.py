#!/usr/bin/env python3
import json
import random
from datetime import datetime

# 기존 질문 로드
with open('../data/question-pool-ultra.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 새로운 질문 로드
with open('../data/new-questions.json', 'r', encoding='utf-8') as f:
    new_data = json.load(f)

# 추가 질문 로드 (215개)
with open('../data/additional-questions-2.json', 'r', encoding='utf-8') as f:
    additional_data = json.load(f)

# 최종 질문 로드 (123개)
with open('../data/final-questions.json', 'r', encoding='utf-8') as f:
    final_data = json.load(f)

# 마지막 질문 로드 (41개)
with open('../data/last-questions.json', 'r', encoding='utf-8') as f:
    last_data = json.load(f)

# 기존 질문들
existing_questions = data['questions']
new_questions = new_data['newQuestions']
more_questions = additional_data['additionalQuestions']
final_questions = final_data['finalQuestions']
last_questions = last_data['lastQuestions']

# 추가로 필요한 질문들 생성
additional_questions = [
    {
        "id": "daily_wake_up_time_1",
        "category": "lifestyle",
        "subcategory": "daily_routine",
        "q": "평일에 몇 시에 일어나시나요?",
        "a": [
            {"t": "새벽 5시 미라클 모닝 🌅", "v": 35},
            {"t": "7시 정도 여유있게 ⏰", "v": 40},
            {"t": "8시 30분 아슬아슬 🏃", "v": 25},
            {"t": "재택이라 자유롭게 😴", "v": 20}
        ]
    },
    {
        "id": "social_media_story_check_1",
        "category": "social_media",
        "subcategory": "behavior",
        "q": "친구들 스토리는 얼마나 자주 확인하시나요?",
        "a": [
            {"t": "올라오는 족족 다 봄 👀", "v": 15},
            {"t": "관심 있는 사람만 🔍", "v": 25},
            {"t": "가끔 심심할 때만 📱", "v": 35},
            {"t": "스토리 안 봄 🚫", "v": 45}
        ]
    },
    {
        "id": "finance_luxury_1",
        "category": "finance",
        "subcategory": "spending",
        "q": "명품이나 고가 제품 구매는?",
        "a": [
            {"t": "플렉스는 인생의 낙 💎", "v": 20},
            {"t": "특별한 날 자기 선물 🎁", "v": 30},
            {"t": "가성비가 최고 💰", "v": 35},
            {"t": "명품 관심 없음 🚫", "v": 40}
        ]
    },
    {
        "id": "entertainment_binge_watching_1",
        "category": "lifestyle",
        "subcategory": "entertainment",
        "q": "정주행할 때 어떻게 보시나요?",
        "a": [
            {"t": "밤새서 완주 🌙", "v": 20},
            {"t": "주말에 몰아보기 📺", "v": 30},
            {"t": "하루에 1-2편씩 🎬", "v": 35},
            {"t": "정주행 안 함 🚫", "v": 45}
        ]
    },
    {
        "id": "health_gym_membership_1",
        "category": "health",
        "subcategory": "fitness",
        "q": "헬스장 등록은 어떻게 하시나요?",
        "a": [
            {"t": "1년 끊고 작심삼일 😅", "v": 20},
            {"t": "3개월씩 꾸준히 💪", "v": 30},
            {"t": "PT까지 받으며 열심히 🏋️", "v": 35},
            {"t": "홈트가 최고 🏠", "v": 25}
        ]
    },
    {
        "id": "food_diet_delivery_1",
        "category": "food_dining",
        "subcategory": "diet",
        "q": "다이어트 식단은 어떻게 준비하시나요?",
        "a": [
            {"t": "식단 배송 서비스 이용 📦", "v": 30},
            {"t": "도시락 직접 준비 🍱", "v": 35},
            {"t": "샐러드 가게 단골 🥗", "v": 25},
            {"t": "그냥 적게 먹기 🍽️", "v": 20}
        ]
    },
    {
        "id": "technology_smart_watch_1",
        "category": "technology",
        "subcategory": "wearable",
        "q": "스마트워치는 어떻게 활용하시나요?",
        "a": [
            {"t": "운동 데이터 체크용 📊", "v": 30},
            {"t": "알림 확인용 📱", "v": 25},
            {"t": "패션 아이템으로 ⌚", "v": 20},
            {"t": "아날로그 시계가 최고 🕐", "v": 45}
        ]
    },
    {
        "id": "shopping_impulse_buy_1",
        "category": "shopping",
        "subcategory": "behavior",
        "q": "충동구매는 얼마나 자주 하시나요?",
        "a": [
            {"t": "새벽 감성에 지름신 💸", "v": 20},
            {"t": "세일 보면 못 참음 🛍️", "v": 25},
            {"t": "계획적으로만 구매 📝", "v": 40},
            {"t": "장바구니만 채우고 안 삼 🛒", "v": 30}
        ]
    },
    {
        "id": "work_overtime_1",
        "category": "work",
        "subcategory": "balance",
        "q": "야근은 어떻게 생각하시나요?",
        "a": [
            {"t": "칼퇴가 진리 🏃", "v": 25},
            {"t": "필요하면 당연히 💼", "v": 40},
            {"t": "야근 수당 받으면 OK 💰", "v": 30},
            {"t": "워라밸 우선 ⚖️", "v": 20}
        ]
    },
    {
        "id": "relationships_breakup_1",
        "category": "relationships",
        "subcategory": "dating",
        "q": "이별 후에는 어떻게 지내시나요?",
        "a": [
            {"t": "SNS 다 차단하고 정리 🚫", "v": 25},
            {"t": "친구로 지내기 🤝", "v": 35},
            {"t": "바로 새로운 만남 💕", "v": 20},
            {"t": "혼자만의 시간 갖기 🧘", "v": 40}
        ]
    },
    {
        "id": "lifestyle_vacation_1",
        "category": "lifestyle",
        "subcategory": "travel",
        "q": "휴가는 주로 어떻게 보내시나요?",
        "a": [
            {"t": "해외여행 필수 ✈️", "v": 25},
            {"t": "국내 여행 충분 🚗", "v": 35},
            {"t": "집에서 완전 휴식 🏠", "v": 30},
            {"t": "부업이나 자기계발 💻", "v": 20}
        ]
    },
    {
        "id": "travel_airport_1",
        "category": "travel",
        "subcategory": "transportation",
        "q": "공항에는 얼마나 일찍 가시나요?",
        "a": [
            {"t": "3시간 전 여유있게 ⏰", "v": 40},
            {"t": "2시간 전 적당히 ✈️", "v": 35},
            {"t": "1시간 전 아슬아슬 🏃", "v": 20},
            {"t": "온라인 체크인으로 시간 단축 📱", "v": 25}
        ]
    },
    {
        "id": "hobbies_plant_1",
        "category": "hobbies",
        "subcategory": "gardening",
        "q": "식물 키우기는 어떠신가요?",
        "a": [
            {"t": "플랜테리어 고수 🌿", "v": 30},
            {"t": "선인장도 죽임 😅", "v": 20},
            {"t": "텃밭 가꾸기 🌱", "v": 45},
            {"t": "조화가 편함 🌸", "v": 35}
        ]
    },
    {
        "id": "communication_phone_call_1",
        "category": "communication",
        "subcategory": "preference",
        "q": "전화 받을 때 어떤 기분이신가요?",
        "a": [
            {"t": "무슨 일인가 불안 😰", "v": 20},
            {"t": "문자가 더 편함 📱", "v": 25},
            {"t": "반가운 마음 😊", "v": 40},
            {"t": "상황에 따라 다름 🤷", "v": 35}
        ]
    },
    {
        "id": "generation_childhood_game_1",
        "category": "generation",
        "subcategory": "nostalgia",
        "q": "어릴 때 주로 뭘 하고 놀았나요?",
        "a": [
            {"t": "모바일 게임 📱", "v": 15},
            {"t": "PC방에서 스타 🖥️", "v": 25},
            {"t": "동네에서 숨바꼭질 🏃", "v": 35},
            {"t": "만화책 보기 📚", "v": 40}
        ]
    },
    {
        "id": "personal_growth_failure_1",
        "category": "personal_growth",
        "subcategory": "mindset",
        "q": "실패했을 때 어떻게 대처하시나요?",
        "a": [
            {"t": "SNS에 위로 받기 📱", "v": 20},
            {"t": "혼자 조용히 극복 🧘", "v": 35},
            {"t": "바로 다시 도전 💪", "v": 30},
            {"t": "친구들과 술 한잔 🍺", "v": 25}
        ]
    },
    {
        "id": "finance_retirement_1",
        "category": "finance",
        "subcategory": "planning",
        "q": "노후 준비는 어떻게 하시나요?",
        "a": [
            {"t": "연금저축 꾸준히 💰", "v": 40},
            {"t": "부동산 투자 🏠", "v": 45},
            {"t": "주식이나 코인 📈", "v": 25},
            {"t": "아직 생각 안 함 😅", "v": 20}
        ]
    },
    {
        "id": "food_convenience_store_1",
        "category": "food_dining",
        "subcategory": "convenience",
        "q": "편의점은 얼마나 자주 가시나요?",
        "a": [
            {"t": "하루에 한 번은 🏪", "v": 20},
            {"t": "일주일에 2-3번 🛒", "v": 30},
            {"t": "급할 때만 가끔 🏃", "v": 35},
            {"t": "거의 안 감 🚫", "v": 40}
        ]
    },
    {
        "id": "work_job_change_1",
        "category": "work",
        "subcategory": "career",
        "q": "이직은 어떻게 생각하시나요?",
        "a": [
            {"t": "3년마다 고민 💼", "v": 25},
            {"t": "더 좋은 조건 있으면 🎯", "v": 30},
            {"t": "한 직장에 오래 🏢", "v": 40},
            {"t": "프리랜서가 목표 💻", "v": 20}
        ]
    },
    {
        "id": "communication_argument_1",
        "category": "communication",
        "subcategory": "conflict",
        "q": "의견 충돌이 있을 때 어떻게 하시나요?",
        "a": [
            {"t": "끝까지 설득 시도 💬", "v": 25},
            {"t": "적당히 맞춰주기 🤝", "v": 35},
            {"t": "침묵으로 회피 😶", "v": 20},
            {"t": "논리적으로 대화 🗣️", "v": 40}
        ]
    },
    {
        "id": "hobbies_concert_1",
        "category": "hobbies",
        "subcategory": "entertainment",
        "q": "콘서트나 페스티벌은 어떻게 즐기시나요?",
        "a": [
            {"t": "스탠딩 1열 사수 🎤", "v": 20},
            {"t": "좌석에서 편하게 🪑", "v": 35},
            {"t": "온라인 생중계 시청 📱", "v": 30},
            {"t": "시끄러워서 안 감 🚫", "v": 45}
        ]
    },
    {
        "id": "lifestyle_morning_coffee_1",
        "category": "lifestyle",
        "subcategory": "routine",
        "q": "모닝커피는 어떻게 드시나요?",
        "a": [
            {"t": "매일 카페 테이크아웃 ☕", "v": 25},
            {"t": "집에서 핸드드립 ☕", "v": 35},
            {"t": "회사 무료 커피 🏢", "v": 30},
            {"t": "커피 안 마심 🚫", "v": 40}
        ]
    },
    {
        "id": "technology_new_phone_1",
        "category": "technology",
        "subcategory": "upgrade",
        "q": "새 휴대폰은 언제 바꾸시나요?",
        "a": [
            {"t": "신제품 나오면 바로 📱", "v": 20},
            {"t": "2-3년 주기로 교체 🔄", "v": 30},
            {"t": "고장날 때까지 사용 🔧", "v": 40},
            {"t": "약정 끝나면 바로 📅", "v": 35}
        ]
    },
    {
        "id": "food_late_night_snack_1",
        "category": "food_dining",
        "subcategory": "snack",
        "q": "야식은 주로 뭘 드시나요?",
        "a": [
            {"t": "치킨이나 피자 🍗", "v": 20},
            {"t": "라면 끓여먹기 🍜", "v": 25},
            {"t": "과일이나 요거트 🥝", "v": 35},
            {"t": "야식 안 먹음 🚫", "v": 40}
        ]
    },
    {
        "id": "shopping_waiting_line_1",
        "category": "shopping",
        "subcategory": "experience",
        "q": "오픈런이나 대기줄은 어떻게 생각하시나요?",
        "a": [
            {"t": "한정판이면 당연히 🏃", "v": 20},
            {"t": "온라인으로 해결 📱", "v": 30},
            {"t": "시간 아까워서 안 함 ⏰", "v": 40},
            {"t": "경험삼아 한번쯤 🎯", "v": 25}
        ]
    },
    {
        "id": "relationships_parents_1",
        "category": "relationships",
        "subcategory": "family",
        "q": "부모님과는 얼마나 자주 연락하시나요?",
        "a": [
            {"t": "매일 안부 전화 📞", "v": 40},
            {"t": "일주일에 한두 번 💬", "v": 35},
            {"t": "명절이나 생신 때 🎂", "v": 25},
            {"t": "카톡으로 가끔 📱", "v": 30}
        ]
    },
    {
        "id": "health_health_checkup_2",
        "category": "health",
        "subcategory": "prevention",
        "q": "건강 관리 앱은 어떻게 활용하시나요?",
        "a": [
            {"t": "매일 걸음수 체크 🚶", "v": 30},
            {"t": "수면 패턴 분석 😴", "v": 25},
            {"t": "칼로리 계산용 🍽️", "v": 20},
            {"t": "앱 안 씀 🚫", "v": 40}
        ]
    },
    {
        "id": "travel_local_trip_1",
        "category": "travel",
        "subcategory": "domestic",
        "q": "국내 여행은 어떻게 다니시나요?",
        "a": [
            {"t": "렌터카로 자유롭게 🚗", "v": 30},
            {"t": "기차나 버스 여행 🚂", "v": 35},
            {"t": "패키지 투어 이용 🚌", "v": 40},
            {"t": "당일치기 선호 🎒", "v": 25}
        ]
    },
    {
        "id": "generation_sns_platform_1",
        "category": "generation",
        "subcategory": "social_media",
        "q": "주로 사용하는 SNS는?",
        "a": [
            {"t": "틱톡이나 릴스 🎵", "v": 15},
            {"t": "인스타그램 📸", "v": 25},
            {"t": "페이스북 👥", "v": 40},
            {"t": "트위터(X) 🐦", "v": 30}
        ]
    },
    {
        "id": "environment_plastic_use_1",
        "category": "environment",
        "subcategory": "daily",
        "q": "일회용품 사용은 어떻게 하시나요?",
        "a": [
            {"t": "텀블러, 장바구니 필수 🌱", "v": 35},
            {"t": "편할 때만 사용 🥤", "v": 25},
            {"t": "신경 안 쓰고 사용 😅", "v": 20},
            {"t": "상황에 따라 유동적 🔄", "v": 30}
        ]
    },
    {
        "id": "fun_birthday_party_1",
        "category": "fun",
        "subcategory": "celebration",
        "q": "생일 파티는 어떻게 하시나요?",
        "a": [
            {"t": "서프라이즈 파티 준비 🎉", "v": 25},
            {"t": "가족끼리 조용히 🎂", "v": 40},
            {"t": "SNS에 축하 받기 📱", "v": 20},
            {"t": "그냥 평범한 날 📅", "v": 35}
        ]
    },
    {
        "id": "personal_growth_self_care_1",
        "category": "personal_growth",
        "subcategory": "wellness",
        "q": "셀프케어는 어떻게 하시나요?",
        "a": [
            {"t": "스파나 마사지 💆", "v": 30},
            {"t": "홈케어 제품 사용 🧴", "v": 25},
            {"t": "운동으로 스트레스 해소 💪", "v": 35},
            {"t": "특별히 안 함 🚫", "v": 20}
        ]
    },
    {
        "id": "social_media_follower_1",
        "category": "social_media",
        "subcategory": "engagement",
        "q": "팔로워 관리는 어떻게 하시나요?",
        "a": [
            {"t": "맞팔은 기본 매너 🤝", "v": 20},
            {"t": "아는 사람만 팔로우 👥", "v": 35},
            {"t": "팔로워 수 신경 안 씀 🤷", "v": 40},
            {"t": "비공개 계정 운영 🔒", "v": 30}
        ]
    },
    {
        "id": "lifestyle_minimalist_2",
        "category": "lifestyle",
        "subcategory": "philosophy",
        "q": "물건 정리는 어떻게 하시나요?",
        "a": [
            {"t": "정리 정돈 유튜브 참고 📱", "v": 25},
            {"t": "1년 안 쓰면 버리기 🗑️", "v": 30},
            {"t": "추억이 있으면 보관 📦", "v": 40},
            {"t": "중고로 팔기 💰", "v": 35}
        ]
    },
    {
        "id": "technology_streaming_device_1",
        "category": "technology",
        "subcategory": "entertainment",
        "q": "OTT는 뭘로 보시나요?",
        "a": [
            {"t": "스마트 TV로 편하게 📺", "v": 35},
            {"t": "태블릿이나 폰으로 📱", "v": 25},
            {"t": "노트북 연결해서 💻", "v": 30},
            {"t": "프로젝터로 크게 📽️", "v": 20}
        ]
    },
    {
        "id": "food_food_trend_1",
        "category": "food_dining",
        "subcategory": "trend",
        "q": "맛집은 어떻게 찾으시나요?",
        "a": [
            {"t": "인스타 맛집 계정 📸", "v": 20},
            {"t": "네이버 지도 리뷰 📍", "v": 30},
            {"t": "TV 맛집 프로그램 📺", "v": 40},
            {"t": "지인 추천 🤝", "v": 35}
        ]
    },
    {
        "id": "shopping_membership_1",
        "category": "shopping",
        "subcategory": "loyalty",
        "q": "멤버십은 어떻게 관리하시나요?",
        "a": [
            {"t": "앱으로 통합 관리 📱", "v": 25},
            {"t": "주요 브랜드만 가입 💳", "v": 35},
            {"t": "귀찮아서 안 함 😅", "v": 20},
            {"t": "혜택 따져서 선택 💰", "v": 30}
        ]
    },
    {
        "id": "relationships_friendship_maintain_1",
        "category": "relationships",
        "subcategory": "friendship",
        "q": "오래된 친구들과는 어떻게 지내시나요?",
        "a": [
            {"t": "정기 모임 필수 📅", "v": 35},
            {"t": "SNS로 근황 확인 📱", "v": 25},
            {"t": "1년에 한두 번 만남 🤝", "v": 40},
            {"t": "자연스럽게 멀어짐 😢", "v": 30}
        ]
    },
    {
        "id": "health_mental_health_app_1",
        "category": "health",
        "subcategory": "mental",
        "q": "마음 건강은 어떻게 챙기시나요?",
        "a": [
            {"t": "명상 앱 활용 🧘", "v": 25},
            {"t": "일기 쓰기 📔", "v": 35},
            {"t": "상담 받기 💬", "v": 30},
            {"t": "친구들과 수다 🗣️", "v": 20}
        ]
    },
    {
        "id": "education_hobby_class_1",
        "category": "education",
        "subcategory": "hobby",
        "q": "취미 클래스는 어떻게 선택하시나요?",
        "a": [
            {"t": "원데이 클래스 체험 🎨", "v": 25},
            {"t": "온라인 클래스 수강 💻", "v": 30},
            {"t": "동호회 가입 👥", "v": 35},
            {"t": "독학으로 충분 📚", "v": 20}
        ]
    },
    {
        "id": "entertainment_k_content_1",
        "category": "pop_culture",
        "subcategory": "korean",
        "q": "K-콘텐츠는 어떻게 즐기시나요?",
        "a": [
            {"t": "드라마 정주행 📺", "v": 30},
            {"t": "K-POP 플레이리스트 🎵", "v": 25},
            {"t": "예능 프로그램 시청 😄", "v": 35},
            {"t": "한국 콘텐츠 안 봄 🚫", "v": 40}
        ]
    },
    {
        "id": "finance_cashless_1",
        "category": "finance",
        "subcategory": "payment",
        "q": "현금은 얼마나 들고 다니시나요?",
        "a": [
            {"t": "현금 없는 생활 📱", "v": 25},
            {"t": "비상금 정도만 💵", "v": 30},
            {"t": "항상 어느 정도는 💰", "v": 40},
            {"t": "카드보다 현금 선호 💴", "v": 45}
        ]
    },
    {
        "id": "travel_travel_buddy_1",
        "category": "travel",
        "subcategory": "companion",
        "q": "여행은 누구와 가시나요?",
        "a": [
            {"t": "혼자 자유여행 🎒", "v": 25},
            {"t": "친구나 연인과 👫", "v": 30},
            {"t": "가족과 함께 👨‍👩‍👧‍👦", "v": 40},
            {"t": "패키지 단체 투어 🚌", "v": 35}
        ]
    },
    {
        "id": "generation_future_worry_1",
        "category": "generation",
        "subcategory": "perspective",
        "q": "미래에 대한 가장 큰 걱정은?",
        "a": [
            {"t": "집값과 전세 문제 🏠", "v": 25},
            {"t": "노후 자금 준비 💰", "v": 40},
            {"t": "AI가 일자리 대체 🤖", "v": 30},
            {"t": "기후변화와 환경 🌍", "v": 20}
        ]
    },
    {
        "id": "environment_eco_product_1",
        "category": "environment",
        "subcategory": "consumption",
        "q": "친환경 제품 구매는?",
        "a": [
            {"t": "비싸도 환경 생각해서 🌱", "v": 30},
            {"t": "가격 비교 후 결정 💰", "v": 35},
            {"t": "특별히 구분 안 함 🤷", "v": 25},
            {"t": "그린워싱 의심 🤔", "v": 20}
        ]
    },
    {
        "id": "fun_karaoke_1",
        "category": "fun",
        "subcategory": "entertainment",
        "q": "노래방은 어떻게 가시나요?",
        "a": [
            {"t": "코인 노래방 혼자 🎤", "v": 25},
            {"t": "친구들과 떼창 🎵", "v": 30},
            {"t": "회식 2차로만 😅", "v": 35},
            {"t": "노래방 안 감 🚫", "v": 40}
        ]
    },
    {
        "id": "personal_growth_morning_routine_1",
        "category": "personal_growth",
        "subcategory": "routine",
        "q": "아침 시간 활용은?",
        "a": [
            {"t": "미라클 모닝 실천 🌅", "v": 35},
            {"t": "출근 준비만 급하게 🏃", "v": 25},
            {"t": "여유있게 아침 식사 🍳", "v": 40},
            {"t": "스누즈 10번 누르기 😴", "v": 20}
        ]
    },
    {
        "id": "work_workplace_culture_1",
        "category": "work",
        "subcategory": "culture",
        "q": "회식 문화는 어떻게 생각하시나요?",
        "a": [
            {"t": "1차만 참석 🍺", "v": 25},
            {"t": "끝까지 함께 🍻", "v": 40},
            {"t": "회식보다 회비 💰", "v": 20},
            {"t": "상황에 따라 유동적 🤷", "v": 30}
        ]
    },
    {
        "id": "communication_text_length_1",
        "category": "communication",
        "subcategory": "style",
        "q": "메시지는 어떻게 보내시나요?",
        "a": [
            {"t": "짧고 간단하게 ✉️", "v": 35},
            {"t": "긴 글로 자세히 📝", "v": 30},
            {"t": "음성 메시지 선호 🎙️", "v": 25},
            {"t": "이모티콘으로 대화 😊", "v": 20}
        ]
    },
    {
        "id": "hobbies_sports_watching_1",
        "category": "hobbies",
        "subcategory": "sports",
        "q": "스포츠 경기는 어떻게 보시나요?",
        "a": [
            {"t": "OTT로 생중계 시청 📱", "v": 25},
            {"t": "경기장 직관 필수 🏟️", "v": 30},
            {"t": "하이라이트만 확인 ⚡", "v": 20},
            {"t": "스포츠 관심 없음 🚫", "v": 40}
        ]
    },
    {
        "id": "lifestyle_hair_salon_1",
        "category": "lifestyle",
        "subcategory": "beauty",
        "q": "미용실은 얼마나 자주 가시나요?",
        "a": [
            {"t": "한 달에 한 번은 💇", "v": 25},
            {"t": "2-3개월에 한 번 ✂️", "v": 35},
            {"t": "1년에 몇 번 정도 💈", "v": 40},
            {"t": "셀프 커트 도전 ✂️", "v": 20}
        ]
    },
    {
        "id": "technology_digital_detox_2",
        "category": "technology",
        "subcategory": "wellness",
        "q": "스마트폰 없이 하루를 보낸다면?",
        "a": [
            {"t": "불안해서 못 견딤 😰", "v": 20},
            {"t": "오히려 편할 듯 😌", "v": 40},
            {"t": "필요할 때만 확인 📱", "v": 35},
            {"t": "이미 가끔 그렇게 함 🚫", "v": 30}
        ]
    },
    {
        "id": "food_food_delivery_tip_1",
        "category": "food_dining",
        "subcategory": "delivery",
        "q": "배달 팁은 어떻게 생각하시나요?",
        "a": [
            {"t": "비싸도 편의를 위해 💰", "v": 25},
            {"t": "팁 적은 곳만 주문 🔍", "v": 30},
            {"t": "직접 포장 주문 🚶", "v": 35},
            {"t": "배달 자체를 안 함 🚫", "v": 40}
        ]
    },
    {
        "id": "shopping_sustainable_fashion_1",
        "category": "shopping",
        "subcategory": "fashion",
        "q": "패스트패션에 대해 어떻게 생각하시나요?",
        "a": [
            {"t": "가성비 좋아서 애용 👕", "v": 20},
            {"t": "환경 생각해서 자제 🌍", "v": 30},
            {"t": "품질 좋은 옷 선호 👔", "v": 40},
            {"t": "빈티지나 중고 선호 ♻️", "v": 25}
        ]
    },
    {
        "id": "relationships_social_media_couple_1",
        "category": "relationships",
        "subcategory": "dating",
        "q": "연애할 때 SNS는 어떻게 하시나요?",
        "a": [
            {"t": "커플 계정 운영 💕", "v": 20},
            {"t": "로판(러브스타그램) 가끔 📸", "v": 25},
            {"t": "프라이빗하게 유지 🔒", "v": 35},
            {"t": "평소와 똑같이 🤷", "v": 40}
        ]
    },
    {
        "id": "health_sleep_time_1",
        "category": "health",
        "subcategory": "sleep",
        "q": "평균 수면 시간은?",
        "a": [
            {"t": "4-5시간 부족 😴", "v": 20},
            {"t": "6-7시간 적당히 😪", "v": 30},
            {"t": "8시간 이상 푹 😴", "v": 35},
            {"t": "불규칙해서 모름 🌙", "v": 25}
        ]
    },
    {
        "id": "travel_travel_insurance_1",
        "category": "travel",
        "subcategory": "preparation",
        "q": "여행자 보험은 어떻게 하시나요?",
        "a": [
            {"t": "무조건 가입 🛡️", "v": 40},
            {"t": "카드 혜택으로 해결 💳", "v": 30},
            {"t": "큰 여행만 가입 ✈️", "v": 25},
            {"t": "보험 안 들어요 🚫", "v": 20}
        ]
    },
    {
        "id": "generation_ideal_life_1",
        "category": "generation",
        "subcategory": "values",
        "q": "이상적인 삶은 어떤 모습인가요?",
        "a": [
            {"t": "일 안하고 놀기만 🏖️", "v": 20},
            {"t": "일과 삶의 균형 ⚖️", "v": 30},
            {"t": "열정적인 커리어 💼", "v": 25},
            {"t": "소박하고 행복하게 🏡", "v": 40}
        ]
    },
    {
        "id": "environment_climate_action_1",
        "category": "environment",
        "subcategory": "activism",
        "q": "기후변화 대응은 어떻게 하시나요?",
        "a": [
            {"t": "일상에서 실천 ♻️", "v": 35},
            {"t": "관심은 있지만... 😅", "v": 25},
            {"t": "기부나 후원 💰", "v": 30},
            {"t": "개인이 할 건 없음 🤷", "v": 20}
        ]
    },
    {
        "id": "fun_hobby_budget_1",
        "category": "fun",
        "subcategory": "spending",
        "q": "취미 생활 예산은?",
        "a": [
            {"t": "수입의 10% 이상 💸", "v": 25},
            {"t": "여유 있을 때만 💰", "v": 30},
            {"t": "정해진 예산 내에서 📊", "v": 35},
            {"t": "돈 안 드는 취미만 🆓", "v": 40}
        ]
    },
    {
        "id": "personal_growth_life_motto_1",
        "category": "personal_growth",
        "subcategory": "philosophy",
        "q": "인생 모토는 무엇인가요?",
        "a": [
            {"t": "YOLO 인생은 한 번 🎉", "v": 20},
            {"t": "성실하게 최선을 💪", "v": 40},
            {"t": "행복이 최우선 😊", "v": 30},
            {"t": "그때그때 다름 🤷", "v": 25}
        ]
    }
]

# 모든 질문 합치기
all_questions = existing_questions + new_questions + additional_questions + more_questions + final_questions + last_questions

# 중복 제거 (id 기준)
seen_ids = set()
unique_questions = []
for q in all_questions:
    if q['id'] not in seen_ids:
        seen_ids.add(q['id'])
        unique_questions.append(q)

# 1000개로 맞추기
if len(unique_questions) < 1000:
    # 더 많은 질문이 필요한 경우
    print(f"현재 {len(unique_questions)}개의 질문이 있습니다. 1000개까지 {1000 - len(unique_questions)}개가 더 필요합니다.")
else:
    # 1000개로 제한
    unique_questions = unique_questions[:1000]

# 데이터 업데이트
data['questions'] = unique_questions
data['totalQuestions'] = len(unique_questions)
data['generatedAt'] = datetime.now().isoformat() + 'Z'

# 파일 저장
with open('../data/question-pool-ultra.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ 질문 풀이 {len(unique_questions)}개로 확장되었습니다!")

# 카테고리별 통계 출력
category_count = {}
for q in unique_questions:
    cat = q['category']
    if cat not in category_count:
        category_count[cat] = 0
    category_count[cat] += 1

print("\n📊 카테고리별 질문 수:")
for cat, count in sorted(category_count.items(), key=lambda x: x[1], reverse=True):
    print(f"  - {cat}: {count}개")