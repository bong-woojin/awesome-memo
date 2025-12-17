# FastAPI 프레임워크 import - 웹 API를 만들기 위한 메인 클래스
from fastapi import FastAPI
# StaticFiles import - HTML, CSS, JS 같은 정적 파일을 서빙하기 위한 클래스
from fastapi.staticfiles import StaticFiles
# BaseModel import - 데이터 검증과 직렬화를 위한 pydantic의 기본 모델 클래스
from pydantic import BaseModel

# Memo 클래스 정의 - 메모 데이터의 구조를 정의 (데이터 모델)
class Memo(BaseModel):
    id:str  # 메모의 고유 ID (문자열 타입)
    content:str  # 메모의 내용 (문자열 타입)

# 메모들을 저장할 리스트 (메모리에 임시 저장, 서버 재시작하면 사라짐)
memos = []

# FastAPI 애플리케이션 인스턴스 생성
app = FastAPI()

""" ===== JavaScript와 Python의 연결 지점 (API 엔드포인트) =====

통신 흐름 설명:
1. 브라우저에서 JavaScript fetch("/memos", {method: "POST", ...}) 실행
2. HTTP POST 요청이 이 서버의 /memos 경로로 전달됨
3. FastAPI가 @app.post("/memos") 데코레이터를 찾아서 아래 함수 실행
4. JavaScript가 보낸 JSON 데이터를 자동으로 Memo 객체로 변환 (Pydantic이 처리)
5. 함수가 return한 값을 JSON으로 변환해서 JavaScript로 응답

HTTP 메서드와 경로 매칭:
- @app.get("/memos")    ← JavaScript: fetch("/memos", {method: "GET"})    (조회)
- @app.post("/memos")   ← JavaScript: fetch("/memos", {method: "POST"})   (생성) ← 현재 사용 중!
- @app.put("/memos/1")  ← JavaScript: fetch("/memos/1", {method: "PUT"})  (수정)
- @app.delete("/memos/1") ← JavaScript: fetch("/memos/1", {method: "DELETE"}) (삭제)
"""

# POST 메서드로 /memos 경로에 요청이 오면 실행되는 함수 (데코레이터)
@app.post("/memos")
def create_memo(memo:Memo):
    # memo 파라미터 동작 원리:
    # 1. JavaScript가 보낸 JSON: {"id": "2025-12-17...", "content": "안녕"}
    # 2. FastAPI가 자동으로 Memo 객체로 변환: Memo(id="2025-12-17...", content="안녕")
    # 3. 만약 데이터 형식이 틀리면 자동으로 400 에러 반환 (Pydantic의 검증 기능)

    memos.append(memo)  # 전달받은 메모를 memos 리스트에 추가

    # 반환값이 JavaScript로 전달됨:
    # Python: return '메모 추가에 성공했습니다.'
    # → FastAPI가 JSON으로 변환: "메모 추가에 성공했습니다."
    # → JavaScript의 jsonRes 변수에 저장됨
    return '메모 추가에 성공했습니다.'  # 성공 메시지 반환

# 루트 경로(/)에 static 폴더의 정적 파일들을 마운트 (HTML 파일 자동 서빙)
app.mount("/", StaticFiles(directory='static', html=True), name='static')