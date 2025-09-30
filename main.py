import requests
from dotenv import load_dotenv
import os
import json, pathlib
load_dotenv()
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import difflib
from fastapi import Body
from fastapi.middleware.cors import CORSMiddleware



load_dotenv()

cardinal_api_key = os.getenv("CARDINAL_API_KEY")

url = "https://api.trycardinal.ai/markdown"
headers = {"x-api-key": cardinal_api_key}
data = {
    "markdown": "true",
}


app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+$", 
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://doc-diff-three.vercel.app",  
        "http://localhost:5173",              
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def extract_text(payload):
    chunks = []
    for p in payload.get("pages", []):
        txt = p.get("content")

        if txt:
            chunks.append(txt)
    return "\n\n---\n\n".join(chunks) if chunks else "# (No text found)\n"




@app.post("/api/extract")
async def extract(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a .pdf")
    try:
        files = {"file": (file.filename, await file.read(), "application/pdf")}
        response = requests.post(url, headers=headers, files=files, data=data) 
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Upstream error: {e}")

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text[:1000])

    payload = response.json()
    md = extract_text(payload)
    
    original_page_count = len(payload.get("pages", [])) or payload.get("total_pages")

    return {
        "markdown": md,
        "original_page_count": original_page_count,
        "page_num": 1,  
    }


@app.post("/api/diff")
def diff_lines(payload: dict = Body(...)):
    a = (payload.get("a") or "").splitlines()
    b = (payload.get("b") or "").splitlines()

    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)  
    ops = sm.get_opcodes()  #
    return {"ops": ops}






    # def get_pdf(path):

#     p = pathlib.Path(path).expanduser()  
#     if not p.exists():                   
#         print(f"File not found: {p}")
#         return
    
#     with p.open("rb") as upload_file:
#         response = requests.post(url, headers=headers, files={"file": upload_file}, data=data)

#     response.raise_for_status()
#     payload = response.json()

#     with open("output.json", "w", encoding="utf-8") as f:
#         json.dump(payload, f, ensure_ascii=False, indent=2)
#     print("Saved API output to output.json")
#     extract_text(payload)

