# 성분비교소 — 프론트엔드 로직 레이어

화면(디자인) 없이 **기능만** 담은 프론트엔드 레이어예요. 상태 관리, 유효성 검사,
API 호출까지 전부 훅(hook)으로 만들어놨어서, 나중에 화면 디자인을 가져오면
그 컴포넌트 안에서 이 훅들만 호출해서 값과 함수를 연결하면 됨

## 이 레이어가 하는 일

- 복용 중인 제품 목록 상태 관리 (추가/삭제)
- 새 제품 입력 폼 상태 관리 (필드/성분 행 추가·삭제, 유효성 검사)
- 4단계 플로우 상태머신 (현재 제품 → 새 제품 → 분석 중 → 결과)
- 분석 API 호출 및 로딩/성공/실패 상태 관리
- 백엔드 연동 지점 (`src/api/client.js`)

## 이 레이어가 하지 않는 일

- 어떤 JSX 마크업도, CSS도 없음
- 버튼, 입력창, 카드 같은 시각 요소 전혀 없음 — 전부 나중에 붙일 화면 쪽 몫임

## 폴더 구조

```
src/
  index.js                 전체 공개 API (여기서부터 import)
  hooks/
    useComparisonFlow.js    ★ 메인 훅 — 화면에서는 보통 이거 하나만 쓰면 됨
    useProductForm.js       제품 1개 등록 폼 로직 (현재/새 제품 공통)
    useProductList.js       현재 복용 중인 제품 목록 로직
    useAnalysis.js          AI 분석 호출 + 로딩/에러/결과 상태
  api/
    client.js               API 호출 (지금은 mock, 나중에 실제 백엔드로 스위치)
  data/
    mockAnalysis.js          백엔드 없을 때 임시로 결과를 만들어주는 로직
  utils/
    types.js                 프론트-백엔드 데이터 계약 (JSDoc)
    product.js                제품 객체 생성/검증 유틸
```

## 화면을 가져왔을 때 연결하는 방법

컴포넌트 안에서 `useComparisonFlow()` 훅 하나만 호출하면, 4단계에 필요한
모든 상태와 함수가 나옵니다. 아래는 화면팀이 참고할 수 있는 연결 예시
(실제 마크업/스타일은 화면팀 코드로 대체하면 됨):

```jsx
import { useComparisonFlow } from "./src";

function ComparisonScreen() {
  const flow = useComparisonFlow();

  if (flow.step === "current") {
    // flow.currentProducts.products        -> 등록된 제품 목록
    // flow.currentProducts.addProduct(p)    -> 제품 추가
    // flow.currentProducts.removeProduct(id)-> 제품 삭제
    // flow.goToNewProductStep()             -> 다음 단계로
  }

  if (flow.step === "new") {
    // flow.newProductForm.product                    -> 입력 중인 제품 값
    // flow.newProductForm.updateField(field, value)   -> 필드 수정
    // flow.newProductForm.updateIngredient(i, field, value)
    // flow.newProductForm.addIngredientRow() / removeIngredientRow(i)
    // flow.submitNewProduct()                         -> 검증 후 분석 시작 (자동으로 3단계 이동)
    //   -> 반환값 { valid: false } 면 화면에서 에러 메시지 표시
  }

  if (flow.step === "analyzing") {
    // flow.analysis.status === "loading"
  }

  if (flow.step === "result") {
    // flow.analysis.result   -> AnalysisResult (src/utils/types.js 참고)
    // flow.analysis.error    -> 실패 시 에러 메시지
    // flow.restart()         -> 처음부터 다시 시작
  }
}
```

`useComparisonFlow` 대신 개별 훅(`useProductForm`, `useProductList`, `useAnalysis`)을
따로 조합해서 써도 됨 — 화면 구조에 따라 자유롭게 선택

## 백엔드 연동 방법

1. `.env` 파일에 API 주소 지정:

   ```
   VITE_API_BASE_URL=https://your-backend.example.com
   ```
   (번들러를 아직 정하지 않았다면 화면팀이 쓰는 빌드 도구의 환경변수 방식에 맞춰야함)

2. `src/api/client.js` 에서 `USE_MOCK` 을 `false` 로 변경 — 이미 작성된 실제
   `fetch('/api/analyze')` 호출 코드가 바로 동작할듯함

### API 스펙 — `POST /api/analyze`

요청 바디 (`AnalyzeRequest`):

```json
{
  "currentProducts": [
    {
      "id": "uuid",
      "name": "센트룸 우먼",
      "brand": "한국화이자",
      "category": "supplement",
      "form": "정제",
      "dosagePerDay": 1,
      "ingredients": [{ "name": "비타민D3", "amount": 10, "unit": "mcg" }],
      "purpose": "종합 영양 보충",
      "notes": ""
    }
  ],
  "newProduct": { "...": "위와 동일한 형태" }
}
```

응답 바디 (`AnalysisResult`):

```json
{
  "verdict": "recommend | caution | avoid",
  "summary": "한 줄 요약",
  "overlaps": [
    {
      "ingredient": "비타민D",
      "currentAmount": 10,
      "newAmount": 15,
      "combinedAmount": 25,
      "unit": "mcg",
      "upperLimit": "100mcg",
      "risk": "low | medium | high",
      "note": "설명 문장"
    }
  ],
  "pros": ["문장1", "문장2"],
  "cons": ["문장1", "문장2"],
  "interactions": [
    { "with": "기존 제품명", "description": "설명", "severity": "low | medium | high" }
  ],
  "recommendation": "종합 권장 문구"
}
```

에러 시에는 4xx/5xx 상태 코드와 함께 `{ "message": "사용자에게 보여줄 문구" }` 형태로
응답 `useAnalysis` 훅이 이 메시지를 `analysis.error` 에 담아 화면에서
그대로 보여줄 수 있게 되어 있음

## 정확한 타입/형태가 궁금할 때

`src/utils/types.js` 에 `Product`, `AnalysisResult`, `AnalyzeRequest` 등
모든 데이터 형태가 JSDoc으로 정리해놓음
