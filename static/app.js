/* ===== JavaScript(클라이언트)에서 Python(서버)로 데이터 보내기 =====
 *
 * 통신 흐름:
 * 1. 사용자가 폼 작성 후 제출 버튼 클릭
 * 2. JavaScript(브라우저)가 fetch()로 HTTP 요청을 서버로 전송
 * 3. Python FastAPI(서버)가 요청을 받아서 처리
 * 4. Python이 처리 결과를 JSON으로 응답
 * 5. JavaScript가 응답을 받아서 처리
 *
 * HTTP 메서드 종류:
 * - GET: 데이터 조회 (예: 메모 목록 가져오기)
 * - POST: 데이터 생성 (예: 새 메모 추가) ← 현재 코드에서 사용 중
 * - PUT: 데이터 전체 수정
 * - PATCH: 데이터 부분 수정
 * - DELETE: 데이터 삭제
 */

// 비동기 함수 정의 - 서버에 메모를 생성하는 요청을 보냄
async function createMemo(value) {
  // async와 await는 항상 세트로 사용 (비동기 작업을 동기적으로 보이게 함)

  /* ===== fetch()로 Python 서버에 POST 요청 보내기 =====
   *
   * fetch("/memos", {...}) 의미:
   * - "/memos" 경로로 요청을 보냄 (Python의 @app.post("/memos")와 연결됨!)
   * - 같은 서버이므로 "/memos"만 써도 됨 (전체 URL: http://localhost:8000/memos)
   *
   * 요청 구조:
   * [브라우저(JS)] --POST 요청--> [서버(Python)]
   *                 { id: ..., content: "..." }
   */
  const res = await fetch("/memos", {
    method: "POST",  // HTTP 메서드를 POST로 설정 (데이터 생성/전송)

    headers: {
      // 헤더: 서버에게 보내는 메타 정보 (데이터에 대한 설명)
      "Content-Type": "application/json",  // "나는 JSON 형식으로 데이터를 보낼게요" 라고 서버에 알림
    },

    // body: 실제로 서버에 보낼 데이터 (반드시 문자열이어야 함)
    body: JSON.stringify({  // JavaScript 객체 → JSON 문자열로 변환
      // 보내는 데이터 구조는 Python의 Memo 클래스와 일치해야 함!
      id: new Date(),  // 현재 날짜와 시간을 ID로 사용
      content: value,  // 메모 내용 (함수 파라미터로 받은 값)
    }),
    // JSON.stringify 예시: {id: "...", content: "안녕"} → '{"id":"...","content":"안녕"}'
  });

  /* ===== Python 서버로부터 응답 받기 =====
   *
   * 응답 흐름:
   * [서버(Python)] --응답--> [브라우저(JS)]
   *                "메모 추가에 성공했습니다."
   *
   * Python의 return '메모 추가에 성공했습니다.' 이 부분이 여기로 전달됨!
   */
  const jsonRes = await res.json();  // 서버 응답(JSON 문자열)을 JavaScript 객체로 변환
  console.log(jsonRes);  // 콘솔에 출력: "메모 추가에 성공했습니다."
}

// 폼 제출 이벤트를 처리하는 함수
function handleSubmit(event) {
  event.preventDefault();  // 폼의 기본 동작(페이지 새로고침) 방지
  const input = document.querySelector("#memo-input");  // ID가 memo-input인 입력창 선택
  createMemo(input.value);  // 입력창의 값으로 메모 생성 함수 호출
  input.value = "";  // 입력창 비우기 (초기화)
}

// ID가 memo-form인 폼 요소를 선택
const form = document.querySelector("#memo-form");
// 폼에 submit 이벤트 리스너 추가 (폼 제출 시 handleSubmit 함수 실행)
form.addEventListener("submit", handleSubmit);
