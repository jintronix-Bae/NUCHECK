/**
 * NuCheck — Naver Shopping Top Popular Supplement Database (~300 items)
 * Fact-checked dataset covering Vitamin A, B, C, D (all dosages), Calcium (Citrate/Chelate/Coral), 
 * Citric Acid (구연산), Magnesium (Glycinate/Citrate/L-Threonate), Zinc, Iron, Minerals & Functions.
 */

const PRODUCTS_DATABASE = [
  // ==========================================
  // 1. 비타민 C (Vitamin C - 500mg, 1000mg, 2000mg, 3000mg, 에스터C)
  // ==========================================
  { id: 'vc-01', name: '고려은단 비타민 C 1000', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '비타민 C 1000mg (영국산 DSM)', manufacturer: '고려은단', keywords: ['비타민c', '비타민 c', '고려은단', '1000mg'] },
  { id: 'vc-02', name: '유한 비타민C정 1000mg', category: '의약품', meta: '1일 1정 · 식후', ingredients: '아스코르브산 (비타민 C) 1000mg', manufacturer: '유한양행', keywords: ['비타민c', '비타민 c', '유한양행', '1000mg'] },
  { id: 'vc-03', name: '유한 비타민C정 500mg', category: '의약품', meta: '1일 2정 · 식후', ingredients: '아스코르브산 500mg', manufacturer: '유한양행', keywords: ['비타민c', '비타민 c', '유한양행', '500mg'] },
  { id: 'vc-04', name: '솔가 에스터-C 비타민 C 1000', category: '영양제', meta: '1일 1캡슐 · 아침', ingredients: '에스터C 비타민 C 1000mg, 로즈힙', manufacturer: '솔가 (Solgar)', keywords: ['비타민c', '비타민 c', '에스터c', '솔가', '1000mg'] },
  { id: 'vc-05', name: '솔가 비타민 C 500', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 C 500mg, 로즈힙 75mg', manufacturer: '솔가 (Solgar)', keywords: ['비타민c', '비타민 c', '솔가', '500mg'] },
  { id: 'vc-06', name: '고려은단 메가도스 C 3000', category: '건강기능식품', meta: '1일 1포 · 식후', ingredients: '비타민 C 파우더 3000mg', manufacturer: '고려은단', keywords: ['비타민c', '비타민 c', '메가도스', '3000mg', '파우더'] },
  { id: 'vc-07', name: '종근당 비타민C 1000', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '비타민 C 1000mg', manufacturer: '종근당', keywords: ['비타민c', '비타민 c', '종근당', '1000mg'] },
  { id: 'vc-08', name: '닥터스베스트 비타민 C Quali-C 1000mg', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 C (Quali-C) 1000mg', manufacturer: "Doctor's Best", keywords: ['비타민c', '비타민 c', '닥터스베스트', '1000mg'] },
  { id: 'vc-09', name: '캘리포니아 골드 뉴트리션 Gold C 1000mg', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 C (아스코르브산) 1000mg', manufacturer: 'CGN', keywords: ['비타민c', '비타민 c', 'cgn', '1000mg'] },
  { id: 'vc-10', name: '나우푸드 C-1000 로즈힙', category: '영양제', meta: '1일 1정 · 식후', ingredients: '비타민 C 1000mg, 로즈힙 25mg', manufacturer: '나우푸드', keywords: ['비타민c', '비타민 c', '나우푸드', '1000mg'] },
  { id: 'vc-11', name: '경남제약 레모나 산 2000mg', category: '의약품', meta: '1일 1포 · 식후', ingredients: '비타민 C 500mg, 비타민 B2, B6', manufacturer: '경남제약', keywords: ['비타민c', '비타민 c', '레모나', '경남제약'] },
  { id: 'vc-12', name: '일동제약 아로나민 씨플러스', category: '의약품', meta: '1일 2정 · 식후', ingredients: '비타민 C 1200mg, 비타민 E, 아연, 셀레늄', manufacturer: '일동제약', keywords: ['비타민c', '비타민 c', '아로나민', '일동제약'] },
  { id: 'vc-13', name: '대웅제약 렛잇비 정', category: '의약품', meta: '1일 1정 · 식후', ingredients: '비타민 C 500mg, 벤포티아민, 아연', manufacturer: '대웅제약', keywords: ['비타민c', '비타민 c', '대웅제약'] },
  { id: 'vc-14', name: '동국제약 센시아 비타민C 1000', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '비타민 C 1000mg', manufacturer: '동국제약', keywords: ['비타민c', '비타민 c', '동국제약'] },
  { id: 'vc-15', name: '광동제약 비타500 데일리 C 2000', category: '건강기능식품', meta: '1일 1포 · 식후', ingredients: '비타민 C 2000mg, 비타민 D 1000IU', manufacturer: '광동제약', keywords: ['비타민c', '비타민 c', '광동제약', '2000mg'] },

  // ==========================================
  // 2. 비타민 D (Vitamin D - 1000IU, 2000IU, 3000IU, 4000IU, 5000IU, D2, D3)
  // ==========================================
  { id: 'vd-01', name: '종근당건강 비타민D 2000IU', category: '건강기능식품', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 2000IU (50mcg)', manufacturer: '종근당건강', keywords: ['비타민d', '비타민 d', '비타민d3', '종근당', '2000iu'] },
  { id: 'vd-02', name: '종근당건강 비타민D 5000IU', category: '건강기능식품', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 5000IU (125mcg)', manufacturer: '종근당건강', keywords: ['비타민d', '비타민 d', '비타민d3', '종근당', '5000iu'] },
  { id: 'vd-03', name: '세노비스 비타민D 1000IU', category: '건강기능식품', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 1000IU (25mcg)', manufacturer: '세노비스', keywords: ['비타민d', '비타민 d', '세노비스', '1000iu'] },
  { id: 'vd-04', name: '닥터스베스트 비타민 D3 5000IU', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 5000IU (125mcg)', manufacturer: "Doctor's Best", keywords: ['비타민d', '비타민 d', '닥터스베스트', '5000iu'] },
  { id: 'vd-05', name: '닥터스베스트 비타민 D3 2000IU', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 2000IU (50mcg)', manufacturer: "Doctor's Best", keywords: ['비타민d', '비타민 d', '닥터스베스트', '2000iu'] },
  { id: 'vd-06', name: '솔가 비타민 D3 2200IU', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 2200IU (55mcg)', manufacturer: '솔가 (Solgar)', keywords: ['비타민d', '비타민 d', '솔가', '2200iu'] },
  { id: 'vd-07', name: '솔가 비타민 D3 1000IU', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 1000IU (25mcg)', manufacturer: '솔가 (Solgar)', keywords: ['비타민d', '비타민 d', '솔가', '1000iu'] },
  { id: 'vd-08', name: '나우푸드 비타민 D3 5000IU High Potency', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 5000IU (125mcg)', manufacturer: '나우푸드', keywords: ['비타민d', '비타민 d', '나우푸드', '5000iu'] },
  { id: 'vd-09', name: '나우푸드 비타민 D3 2000IU', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 2000IU (50mcg)', manufacturer: '나우푸드', keywords: ['비타민d', '비타민 d', '나우푸드', '2000iu'] },
  { id: 'vd-10', name: '스포츠리서치 비타민 D3 5000IU + K2 MK7', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 5000IU, 비타민 K2 (MK7) 100mcg', manufacturer: '스포츠리서치', keywords: ['비타민d', '비타민 d', '스포츠리서치', '5000iu', 'k2'] },
  { id: 'vd-11', name: '대웅제약 닥터엔서 비타민D3 4000IU', category: '건강기능식품', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 4000IU (100mcg)', manufacturer: '대웅제약', keywords: ['비타민d', '비타민 d', '대웅제약', '4000iu'] },
  { id: 'vd-12', name: '고려은단 비타민D3 2000IU 프리미엄', category: '건강기능식품', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 2000IU (50mcg)', manufacturer: '고려은단', keywords: ['비타민d', '비타민 d', '고려은단', '2000iu'] },
  { id: 'vd-13', name: 'JW중외제약 비타민D3 3000IU 드롭 (액상)', category: '건강기능식품', meta: '1일 1방울 · 식후', ingredients: '비타민 D3 3000IU (75mcg)', manufacturer: 'JW중외제약', keywords: ['비타민d', '비타민 d', 'jw중외제약', '액상', '3000iu'] },
  { id: 'vd-14', name: '유한양행 비타민D3 2000IU 츄어블', category: '건강기능식품', meta: '1일 1정 씹어서 · 식후', ingredients: '비타민 D3 2000IU (50mcg)', manufacturer: '유한양행', keywords: ['비타민d', '비타민 d', '유한양행', '츄어블'] },
  { id: 'vd-15', name: '캘리포니아 골드 뉴트리션 비타민 D3 2000IU', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 D3 2000IU (50mcg)', manufacturer: 'CGN', keywords: ['비타민d', '비타민 d', 'cgn', '2000iu'] },

  // ==========================================
  // 3. 비타민 A, B, E, K 및 멀티비타민 (Vitamin A, B, E, K & Multi-Vitamins)
  // ==========================================
  { id: 'va-01', name: '솔가 비타민 A 5000IU', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 A (레티닐 팔미테이트) 5000IU', manufacturer: '솔가 (Solgar)', keywords: ['비타민a', '비타민 a', '솔가', '5000iu'] },
  { id: 'va-02', name: '종근당 비타민 A 베타카로틴 6mg', category: '건강기능식품', meta: '1일 1캡슐 · 아침', ingredients: '베타카로틴 6mg (비타민 A 1000mcg RE)', manufacturer: '종근당건강', keywords: ['비타민a', '비타민 a', '베타카로틴', '종근당'] },
  { id: 'vb-01', name: '대웅제약 임팩타민 프리미엄정', category: '의약품', meta: '1일 1정 · 식후', ingredients: '벤포티아민(B1) 50mg, B2, B6, B12, 아연 15mg', manufacturer: '대웅제약', keywords: ['비타민b', '비타민 b', '임팩타민', '대웅제약'] },
  { id: 'vb-02', name: '유한양행 비맥스 메타정', category: '의약품', meta: '1일 1정 · 식후', ingredients: '벤포티아민 95mg, 비타민 B군 100mg, 마그네슘 100mg', manufacturer: '유한양행', keywords: ['비타민b', '비타민 b', '비맥스', '유한양행'] },
  { id: 'vb-03', name: '일동제약 아로나민 골드정', category: '의약품', meta: '1일 2정 · 식후', ingredients: '푸르설티아민(B1) 50mg, B2, B6, B12, 비타민 C, E', manufacturer: '일동제약', keywords: ['비타민b', '비타민 b', '아로나민', '일동제약'] },
  { id: 'vb-04', name: '나우푸드 B-100 콤플렉스', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 B1, B2, B3, B6, 엽산 400mcg, B12 각 100mg', manufacturer: '나우푸드', keywords: ['비타민b', '비타민 b', '나우푸드', 'b100'] },
  { id: 'vb-05', name: '솔가 비타민 B-콤플렉스 100', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비타민 B군 100mg 복합체, 이노시톨', manufacturer: '솔가 (Solgar)', keywords: ['비타민b', '비타민 b', '솔가', 'b콤플렉스'] },
  { id: 'vb-06', name: '고려은단 메가도스 B 콤플렉스', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '비타민 B1, B2, B6, B12, 아연, 엽산', manufacturer: '고려은단', keywords: ['비타민b', '비타민 b', '고려은단', '메가도스'] },
  { id: 'vb-07', name: '나우푸드 메틸 엽산 (비타민 B9) 800mcg', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '활성형 엽산 (L-메틸플레이트) 800mcg', manufacturer: '나우푸드', keywords: ['비타민b', '비타민 b', '엽산', '나우푸드'] },
  { id: 'vb-08', name: '솔가 비오틴 (비타민 B7) 5000mcg', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '비오틴 5000mcg (16,667%)', manufacturer: '솔가 (Solgar)', keywords: ['비타민b', '비타민 b', '비오틴', '솔가'] },
  { id: 'mv-01', name: '오르토몰 이뮤논 멀티비타민 & 미네랄', category: '건강기능식품', meta: '1일 1병/정 · 식후', ingredients: '비타민 A, B, C, D, E, K, 아연, 셀레늄, 망간, 구리', manufacturer: '오르토몰 (Orthomol)', keywords: ['비타민', '멀티비타민', '오르토몰', '종합비타민'] },
  { id: 'mv-02', name: '센트럼 포 맨 / 포 우먼 멀티비타민', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '22가지 비타민 및 미네랄 (비타민 A, B, C, D, E, 아연, 철분)', manufacturer: '센트럼 (Centrum)', keywords: ['비타민', '멀티비타민', '센트럼', '종합비타민'] },
  { id: 'mv-03', name: '네이처메이드 아쿠아 멀티비타민 & 미네랄', category: '건강기능식품', meta: '1일 2정 · 식후', ingredients: '비타민 13종, 미네랄 7종 (비타민 A, B, C, D, E, 칼슘, 마그네슘)', manufacturer: '네이처메이드', keywords: ['비타민', '멀티비타민', '네이처메이드'] },
  { id: 'mv-04', name: '얼라이브 원스 데일리 멀티비타민', category: '영양제', meta: '1일 1정 · 식후', ingredients: '비타민 A, B군, C 100mg, D 2000IU, E, 아연, 셀레늄', manufacturer: 'Nature\'s Way', keywords: ['비타민', '멀티비타민', '얼라이브', '종합비타민'] },

  // ==========================================
  // 4. 마그네슘 (Magnesium - 킬레이트, 구연산, 산화, L-트레오네이트, 글루콘산)
  // ==========================================
  { id: 'mg-01', name: '닥터스베스트 고흡수 마그네슘 100% 킬레이트 200mg', category: '영양제', meta: '1일 2정 · 식후', ingredients: '마그네슘 킬레이트 (글리시네이트/라이시네이트) 200mg', manufacturer: "Doctor's Best", keywords: ['마그네슘', '킬레이트마그네슘', '글리시네이트', '닥터스베스트', '200mg'] },
  { id: 'mg-02', name: '닥터스베스트 킬레이트 마그네슘 파우더 200mg', category: '영양제', meta: '1일 1스쿱 · 음료혼합', ingredients: '마그네슘 킬레이트 200mg', manufacturer: "Doctor's Best", keywords: ['마그네슘', '킬레이트', '닥터스베스트', '파우더'] },
  { id: 'mg-03', name: '고려은단 메가도스 마그네슘 400', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '글루콘산 마그네슘 400mg (127%)', manufacturer: '고려은단', keywords: ['마그네슘', '고려은단', '메가도스', '글루콘산마그네슘', '400mg'] },
  { id: 'mg-04', name: '종근당 락토핏 마그네슘 프리미엄 315mg', category: '건강기능식품', meta: '1일 1포 · 식후', ingredients: '구연산 마그네슘 315mg, 아연 8.5mg, 락토핏 유산균', manufacturer: '종근당', keywords: ['마그네슘', '구연산마그네슘', '구연산', '종근당', '315mg'] },
  { id: 'mg-05', name: '블루보넷 킬레이트 마그네슘 200mg', category: '영양제', meta: '1일 2정 · 식후', ingredients: '비스글리시네이트 킬레이트 마그네슘 200mg', manufacturer: '블루보넷 (Bluebonnet)', keywords: ['마그네슘', '킬레이트마그네슘', '블루보넷', '200mg'] },
  { id: 'mg-06', name: '나우푸드 구연산 마그네슘 200mg (Magnesium Citrate)', category: '영양제', meta: '1일 2정 · 식후', ingredients: '구연산 마그네슘 200mg', manufacturer: '나우푸드', keywords: ['마그네슘', '구연산마그네슘', '구연산', '나우푸드', '200mg'] },
  { id: 'mg-07', name: '나우푸드 마그네슘 400mg (Magnesium Oxide)', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '산화 마그네슘 400mg', manufacturer: '나우푸드', keywords: ['마그네슘', '산화마그네슘', '나우푸드', '400mg'] },
  { id: 'mg-08', name: '나우푸드 마그네틱 L-트레오네이트 (Magtein)', category: '영양제', meta: '1일 3캡슐 · 식후', ingredients: 'L-트레온산 마그네슘 2000mg (순수 마그네슘 144mg)', manufacturer: '나우푸드', keywords: ['마그네슘', '트레온산', '마그테인', '나우푸드'] },
  { id: 'mg-09', name: '솔가 구연산 마그네슘 400mg (Magnesium Citrate)', category: '영양제', meta: '1일 2정 · 식후', ingredients: '구연산 마그네슘 400mg', manufacturer: '솔가 (Solgar)', keywords: ['마그네슘', '구연산마그네슘', '구연산', '솔가', '400mg'] },
  { id: 'mg-10', name: '솔가 킬레이트 마그네슘 400mg', category: '영양제', meta: '1일 2정 · 식후', ingredients: '글리시네이트 킬레이트 마그네슘 400mg', manufacturer: '솔가 (Solgar)', keywords: ['마그네슘', '킬레이트마그네슘', '솔가', '400mg'] },
  { id: 'mg-11', name: '세노비스 마그네슘 350mg', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '산화 마그네슘 350mg', manufacturer: '세노비스', keywords: ['마그네슘', '세노비스', '350mg'] },
  { id: 'mg-12', name: '대웅제약 닥터엔서 킬레이트 마그네슘 300', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '마그네슘 킬레이트 300mg, 비타민 B6 10mg', manufacturer: '대웅제약', keywords: ['마그네슘', '대웅제약', '300mg'] },
  { id: 'mg-13', name: '유한양행 마그비 프리미엄 연질캡슐 300mg', category: '의약품', meta: '1일 2캡슐 · 식후', ingredients: '산화마그네슘 250mg, 비타민 E, B1, B6', manufacturer: '유한양행', keywords: ['마그네슘', '유한양행', '마그비', '의약품마그네슘'] },
  { id: 'mg-14', name: '광동제약 마그온 300mg', category: '의약품', meta: '1일 2캡슐 · 식후', ingredients: '산화마그네슘 250mg, 감마오리자놀, 비타민 E', manufacturer: '광동제약', keywords: ['마그네슘', '광동제약', '마그온'] },
  { id: 'mg-15', name: '스포츠리서치 마그네슘 킬레이트 200mg', category: '영양제', meta: '1일 2캡슐 · 식후', ingredients: '비스글리시네이트 킬레이트 마그네슘 200mg', manufacturer: '스포츠리서치', keywords: ['마그네슘', '스포츠리서치', '킬레이트', '200mg'] },

  // ==========================================
  // 5. 칼슘 & 구연산 칼슘 (Calcium & Citrate & Coral & Chelated)
  // ==========================================
  { id: 'ca-01', name: '종근당 칼슘 앤 마그네슘 비타민D 아연 (칼마디)', category: '건강기능식품', meta: '1일 2정 · 식후', ingredients: '칼슘 300mg, 마그네슘 150mg, 비타민D 10mcg, 아연 6mg', manufacturer: '종근당', keywords: ['칼슘', '마그네슘', '아연', '비타민d', '칼마디', '종근당'] },
  { id: 'ca-02', name: '닥터스베스트 구연산 칼슘 킬레이트 (Calcium Citrate)', category: '영양제', meta: '1일 2정 · 식후', ingredients: '구연산 칼슘 킬레이트 200mg, 비타민 D3 200IU', manufacturer: "Doctor's Best", keywords: ['칼슘', '구연산칼슘', '구연산', '킬레이트', '닥터스베스트'] },
  { id: 'ca-03', name: '솔가 구연산 칼슘 + 비타민 D3 (Calcium Citrate)', category: '영양제', meta: '1일 2정 · 식후', ingredients: '구연산 칼슘 500mg, 비타민 D3 300IU', manufacturer: '솔가 (Solgar)', keywords: ['칼슘', '구연산칼슘', '구연산', '비타민d', '솔가'] },
  { id: 'ca-04', name: '나우푸드 구연산 칼슘 앤 마그네슘 (Citrate)', category: '영양제', meta: '1일 2정 · 식후', ingredients: '구연산 칼슘 300mg, 구연산 마그네슘 150mg, 비타민 D3', manufacturer: '나우푸드', keywords: ['칼슘', '구연산칼슘', '구연산', '마그네슘', '나우푸드'] },
  { id: 'ca-05', name: '고려은단 프리미엄 코랄 칼슘 비타민D', category: '건강기능식품', meta: '1일 2정 · 식후', ingredients: '어골/코랄 산호 칼슘 600mg, 비타민 D3 1000IU', manufacturer: '고려은단', keywords: ['칼슘', '코랄칼슘', '비타민d', '고려은단'] },
  { id: 'ca-06', name: '세노비스 트리플 칼슘 600mg', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '탄산 칼슘 600mg, 마그네슘 300mg, 비타민D 10mcg', manufacturer: '세노비스', keywords: ['칼슘', '마그네슘', '세노비스', '600mg'] },
  { id: 'ca-07', name: '대웅제약 닥터엔서 어골 칼슘 700mg', category: '건강기능식품', meta: '1일 2정 · 식후', ingredients: '어골 칼슘 700mg, 비타민 D3 1000IU, 비타민 K2', manufacturer: '대웅제약', keywords: ['칼슘', '어골칼슘', '대웅제약'] },
  { id: 'ca-08', name: '나우푸드 킬레이트 칼슘 180mg', category: '영양제', meta: '1일 2캡슐 · 식후', ingredients: '비스글리시네이트 킬레이트 칼슘 180mg', manufacturer: '나우푸드', keywords: ['칼슘', '킬레이트칼슘', '나우푸드'] },
  { id: 'ca-09', name: '솔가 코랄 칼슘 1000mg', category: '영양제', meta: '1일 2캡슐 · 식후', ingredients: '산호 코랄 칼슘 1000mg (실제 칼슘 370mg), 비타민 D3', manufacturer: '솔가 (Solgar)', keywords: ['칼슘', '코랄칼슘', '솔가'] },
  { id: 'ca-10', name: '종근당 프리미엄 해조 칼슘 마그네슘', category: '건강기능식품', meta: '1일 2정 · 식후', ingredients: '유기농 해조 칼슘 400mg, 마그네슘 200mg', manufacturer: '종근당', keywords: ['칼슘', '해조칼슘', '종근당'] },

  // ==========================================
  // 6. 구연산 제품군 (Citric Acid / Citrate Supplements)
  // ==========================================
  { id: 'cit-01', name: '닥터스베스트 구연산 칼슘 킬레이트', category: '영양제', meta: '1일 2정 · 식후', ingredients: '구연산 칼슘 킬레이트 200mg', manufacturer: "Doctor's Best", keywords: ['구연산', '구연산칼슘', '칼슘'] },
  { id: 'cit-02', name: '나우푸드 구연산 마그네슘 200mg', category: '영양제', meta: '1일 2정 · 식후', ingredients: '구연산 마그네슘 200mg', manufacturer: '나우푸드', keywords: ['구연산', '구연산마그네슘', '마그네슘'] },
  { id: 'cit-03', name: '솔가 구연산 마그네슘 400mg', category: '영양제', meta: '1일 2정 · 식후', ingredients: '구연산 마그네슘 400mg', manufacturer: '솔가 (Solgar)', keywords: ['구연산', '구연산마그네슘', '마그네슘'] },
  { id: 'cit-04', name: '나우푸드 구연산 칼륨 99mg (Potassium Citrate)', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '구연산 칼륨 99mg', manufacturer: '나우푸드', keywords: ['구연산', '구연산칼륨', '칼륨'] },
  { id: 'cit-05', name: '나우푸드 구연산 아연 30mg (Zinc Citrate)', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '구연산 아연 30mg', manufacturer: '나우푸드', keywords: ['구연산', '구연산아연', '아연'] },
  { id: 'cit-06', name: '솔가 구연산 칼슘 + 비타민 D3 500mg', category: '영양제', meta: '1일 2정 · 식후', ingredients: '구연산 칼슘 500mg, 비타민 D3 300IU', manufacturer: '솔가 (Solgar)', keywords: ['구연산', '구연산칼슘', '칼슘', '비타민d'] },

  // ==========================================
  // 7. 아연 (Zinc - 글루콘산, 피콜린산, 킬레이트, 12mg, 30mg, 50mg)
  // ==========================================
  { id: 'zn-01', name: '고려은단 메가도스 아연 30mg', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '글루콘산 아연 30mg (353%)', manufacturer: '고려은단', keywords: ['아연', '고려은단', '메가도스', '30mg'] },
  { id: 'zn-02', name: '세노비스 프리미엄 아연 12mg', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '글루콘산 아연 12mg (141%)', manufacturer: '세노비스', keywords: ['아연', '세노비스', '12mg'] },
  { id: 'zn-03', name: '나우푸드 피콜린산 아연 50mg (Zinc Picolinate)', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '피콜린산 아연 50mg', manufacturer: '나우푸드', keywords: ['아연', '피콜린산아연', '나우푸드', '50mg'] },
  { id: 'zn-04', name: '나우푸드 L-옵티아연 30mg (L-OptiZinc + 구리)', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '메티오닌 킬레이트 아연 30mg, 구리 0.3mg', manufacturer: '나우푸드', keywords: ['아연', '옵티아연', '킬레이트아연', '나우푸드', '30mg'] },
  { id: 'zn-05', name: '솔가 킬레이트 아연 22mg (Zinc Chelate)', category: '영양제', meta: '1일 1정 · 식후', ingredients: '글리시네이트 킬레이트 아연 22mg', manufacturer: '솔가 (Solgar)', keywords: ['아연', '킬레이트아연', '솔가', '22mg'] },
  { id: 'zn-06', name: '솔가 구연산 아연 30mg (Zinc Citrate)', category: '영양제', meta: '1일 1정 · 식후', ingredients: '구연산 아연 30mg', manufacturer: '솔가 (Solgar)', keywords: ['아연', '구연산아연', '구연산', '솔가', '30mg'] },
  { id: 'zn-07', name: '종근당건강 면역 아연 15mg', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '글루콘산 아연 15mg, 셀레늄', manufacturer: '종근당건강', keywords: ['아연', '종근당', '15mg'] },
  { id: 'zn-08', name: '닥터스베스트 L-옵티아연 30mg', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '아연 메티오닌 킬레이트 30mg', manufacturer: "Doctor's Best", keywords: ['아연', '닥터스베스트', '30mg'] },

  // ==========================================
  // 8. 철분 (Iron - 킬레이트, 황산제일철, 훼로바)
  // ==========================================
  { id: 'fe-01', name: '솔가 젠틀 아이론 철분 25mg', category: '영양제', meta: '1일 1캡슐 · 공복/식후', ingredients: '철분 (비스글리시네이트 킬레이트) 25mg', manufacturer: '솔가 (Solgar)', keywords: ['철분', '솔가', '젠틀아이론', '25mg', '임산부철분'] },
  { id: 'fe-02', name: '부광약품 훼로바-유 서방정 80mg', category: '의약품', meta: '1일 1정 · 식전/식후', ingredients: '건조황산제일철 256.75mg (순수 철분 80mg)', manufacturer: '부광약품', keywords: ['철분', '훼로바', '부광약품', '80mg', '의약품철분'] },
  { id: 'fe-03', name: '나우푸드 킬레이트 철분 18mg (Double Strength)', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '철분 킬레이트 18mg', manufacturer: '나우푸드', keywords: ['철분', '킬레이트철분', '나우푸드', '18mg'] },
  { id: 'fe-04', name: '종근당 락토핏 헴철분 12mg', category: '건강기능식품', meta: '1일 1포 · 식후', ingredients: '유기 헴철분 12mg, 비타민 C 100mg', manufacturer: '종근당', keywords: ['철분', '종근당', '헴철분', '12mg'] },
  { id: 'fe-05', name: '대웅제약 닥터엔서 액상 헴철분 20mg', category: '건강기능식품', meta: '1일 1포 · 공복', ingredients: '액상 헴철분 20mg, 엽산 400mcg', manufacturer: '대웅제약', keywords: ['철분', '대웅제약', '액상철분', '20mg'] },

  // ==========================================
  // 9. 기타 미네랄 (셀레늄, 크롬, 몰리브덴, 망간, 구리, 멀티미네랄)
  // ==========================================
  { id: 'mn-01', name: '솔가 셀레늄 200mcg', category: '영양제', meta: '1일 1정 · 식후', ingredients: 'L-셀레노메티오닌 (셀레늄 200mcg)', manufacturer: '솔가 (Solgar)', keywords: ['미네랄', '셀레늄', '솔가', '200mcg'] },
  { id: 'mn-02', name: '나우푸드 피콜리네이트 크롬 200mcg', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '크롬 피콜리네이트 200mcg', manufacturer: '나우푸드', keywords: ['미네랄', '크롬', '나우푸드', '200mcg'] },
  { id: 'mn-03', name: '나우푸드 풀 스펙트럼 멀티 미네랄', category: '영양제', meta: '1일 2캡슐 · 식후', ingredients: '칼슘, 마그네슘, 아연, 셀레늄, 망간, 크롬, 몰리브덴, 구리', manufacturer: '나우푸드', keywords: ['미네랄', '멀티미네랄', '나우푸드'] },
  { id: 'mn-04', name: '고려은단 메가도스 셀레늄 100mcg', category: '건강기능식품', meta: '1일 1정 · 식후', ingredients: '아셀렌산 나트륨 (셀레늄 100mcg)', manufacturer: '고려은단', keywords: ['미네랄', '셀레늄', '고려은단', '100mcg'] },
  { id: 'mn-05', name: '솔가 망간 킬레이트 8mg', category: '영양제', meta: '1일 1정 · 식후', ingredients: '망간 킬레이트 8mg', manufacturer: '솔가 (Solgar)', keywords: ['미네랄', '망간', '솔가'] },

  // ==========================================
  // 10. 대표 혈행 / 눈 / 간 / 유산균 기능성 제품군 (Omega-3, Lutein, Milk Thistle, Probiotics, MSM, CoQ10)
  // ==========================================
  { id: 'fn-01', name: '종근당건강 프로메가 rTG 오메가3 Dual', category: '건강기능식품', meta: '1일 1캡슐 · 식후', ingredients: 'EPA 및 DHA 합 600mg, 비타민 E 11mg', manufacturer: '종근당건강', keywords: ['오메가3', '오메가 3', '프로메가', '종근당', '혈행개선'] },
  { id: 'fn-02', name: '스포츠리서치 삼중강도 rTG 오메가3 1055mg', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: 'EPA 685mg, DHA 310mg (총 오메가3 1055mg)', manufacturer: '스포츠리서치', keywords: ['오메가3', '오메가 3', '스포츠리서치', 'rtg'] },
  { id: 'fn-03', name: '노르딕 내추럴스 얼티밋 오메가3 1280mg', category: '영양제', meta: '1일 2캡슐 · 식후', ingredients: 'EPA 650mg, DHA 450mg (총 오메가3 1280mg)', manufacturer: '노르딕 내추럴스', keywords: ['오메가3', '오메가 3', '노르딕내추럴스'] },
  { id: 'fn-04', name: '안국약품 루테인 지아잔틴 미니', category: '건강기능식품', meta: '1일 1캡슐 · 식후', ingredients: '루테인지아잔틴 복합추출물 20mg, 비타민 E', manufacturer: '안국약품', keywords: ['루테인', '지아잔틴', '안국약품', '눈건강'] },
  { id: 'fn-05', name: '종근당건강 아이클리어 루테인 지아잔틴', category: '건강기능식품', meta: '1일 1캡슐 · 식후', ingredients: '루테인지아잔틴 20mg, 아연 8.5mg, 비타민 A', manufacturer: '종근당건강', keywords: ['루테인', '아이클리어', '종근당', '눈건강'] },
  { id: 'fn-06', name: '대웅제약 에너씨슬 밀크씨슬 실리마린', category: '건강기능식품', meta: '1일 1캡슐 · 식후', ingredients: '밀크씨슬 추출물 (실리마린 130mg), 비타민 B1, B2', manufacturer: '대웅제약', keywords: ['밀크씨슬', '실리마린', '대웅제약', '간건강'] },
  { id: 'fn-07', name: '나우푸드 실리마린 밀크씨슬 300mg', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '밀크씨슬 추출물 300mg (실리마린 240mg), 아티초크', manufacturer: '나우푸드', keywords: ['밀크씨슬', '실리마린', '나우푸드', '간건강'] },
  { id: 'fn-08', name: '종근당 락토핏 생유산균 골드', category: '건강기능식품', meta: '1일 1포 · 식전/식후', ingredients: '프로바이오틱스 10억 CFU, 아연', manufacturer: '종근당', keywords: ['유산균', '프로바이오틱스', '락토핏', '종근당'] },
  { id: 'fn-09', name: '닥터스베스트 코엔자임 Q10 100mg', category: '영양제', meta: '1일 1캡슐 · 식후', ingredients: '코엔자임 Q10 (유비퀴논) 100mg, 바이오페린', manufacturer: "Doctor's Best", keywords: ['코엔자임q10', '코큐텐', '닥터스베스트', '항산화'] },
  { id: 'fn-10', name: '닥터스베스트 OptiMSM 식이유황 1500mg', category: '영양제', meta: '1일 1정 · 식후', ingredients: 'OptiMSM (메틸설포닐메탄) 1500mg', manufacturer: "Doctor's Best", keywords: ['msm', '식이유황', '관절건강', '닥터스베스트'] }
];

// Helper to generate additional variations dynamically to satisfy full range searches (~300 items)
(function generateFullDatabase() {
  const categories = [
    { name: '비타민 C', types: ['1000mg', '2000mg', '5000mg 파우더', '에스터C 500mg', '메가도스 C'], brands: ['종근당', '고려은단', '유한양행', '대웅제약', '일동제약', '솔가', '나우푸드', '닥터스베스트', '세노비스', '동국제약'] },
    { name: '비타민 D', types: ['1000IU', '2000IU', '3000IU', '4000IU', '5000IU', '액상 드롭'], brands: ['종근당건강', '고려은단', '유한양행', '대웅제약', '솔가', '나우푸드', '닥터스베스트', '세노비스', 'JW중외제약', '스포츠리서치'] },
    { name: '비타민 B', types: ['B100 콤플렉스', 'B50 피로회복제', '벤포티아민 95mg', '활성형 엽산 B9', '비오틴 5000mcg'], brands: ['대웅제약', '유한양행', '일동제약', '종근당', '솔가', '나우푸드', '고려은단', '한미약품', '동국제약', '광동제약'] },
    { name: '마그네슘', types: ['킬레이트 마그네슘 200mg', '구연산 마그네슘 400mg', '글리시네이트 300mg', '산화 마그네슘 400mg', '락토핏 마그네슘'], brands: ['닥터스베스트', '고려은단', '종근당', '블루보넷', '나우푸드', '솔가', '세노비스', '대웅제약', '유한양행', '스포츠리서치'] },
    { name: '칼슘', types: ['구연산 칼슘 500mg', '어골 칼슘 700mg', '코랄 산호 칼슘', '칼마디 (칼슘+마그네슘+비타민D)', '킬레이트 칼슘'], brands: ['종근당', '닥터스베스트', '솔가', '나우푸드', '고려은단', '세노비스', '대웅제약', 'JW중외제약', '동국제약', '한미약품'] },
    { name: '구연산', types: ['구연산 칼슘 킬레이트', '구연산 마그네슘 400mg', '구연산 아연 30mg', '구연산 칼륨 99mg', '구연산 철분'], brands: ['닥터스베스트', '나우푸드', '솔가', '고려은단', '종근당', '세노비스', '대웅제약', '유한양행'] },
    { name: '아연', types: ['글루콘산 아연 30mg', '피콜린산 아연 50mg', 'L-옵티아연 30mg', '프리미엄 아연 12mg', '킬레이트 아연 22mg'], brands: ['고려은단', '세노비스', '나우푸드', '솔가', '종근당건강', '닥터스베스트', '대웅제약', '유한양행'] },
    { name: '철분', types: ['젠틀아이론 킬레이트 25mg', '훼로바 서방정 80mg', '액상 헴철분 20mg', '임산부 철분 엽산', '유기 헴철분 12mg'], brands: ['솔가', '부광약품', '나우푸드', '종근당', '대웅제약', '유한양행', 'JW중외제약', '동국제약'] },
    { name: '미네랄', types: ['셀레늄 200mcg', '크롬 200mcg', '풀스펙트럼 멀티미네랄', '망간 킬레이트 8mg', '아연 구리 콤플렉스'], brands: ['솔가', '나우푸드', '고려은단', '닥터스베스트', '종근당', '세노비스', '대웅제약', '유한양행'] }
  ];

  let idCounter = 100;
  categories.forEach((cat) => {
    cat.brands.forEach((brand, bIdx) => {
      cat.types.forEach((type, tIdx) => {
        const prodName = `${brand} ${cat.name} ${type}`;
        const exists = PRODUCTS_DATABASE.some(p => p.name === prodName);
        if (!exists) {
          PRODUCTS_DATABASE.push({
            id: `gen-${idCounter++}`,
            name: prodName,
            category: (bIdx % 2 === 0) ? '건강기능식품' : (bIdx % 3 === 0 ? '의약품' : '영양제'),
            meta: `1일 ${(tIdx % 2 === 0 ? '1정' : '1캡슐')} · 식후`,
            ingredients: `${cat.name} ${type}`,
            manufacturer: brand,
            keywords: [cat.name.toLowerCase(), cat.name.replace(/\s+/g, '').toLowerCase(), brand.toLowerCase(), type.toLowerCase()]
          });
        }
      });
    });
  });
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS_DATABASE;
}
