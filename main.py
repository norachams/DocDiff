import requests
from dotenv import load_dotenv
import os
import json, pathlib
load_dotenv()
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

cardinal_api_key = os.getenv("CARDINAL_API_KEY")
pdf_path1 = os.getenv("PDF_PATH")
pdf_path2 = os.getenv("PDF_PATH_2")

url = "https://api.trycardinal.ai/markdown"
headers = {"x-api-key": cardinal_api_key}
data = {"markdown": "true", "denseTables": "true"}

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+$", 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


def extract_text(payload):

    chunks = []
    for p in payload.get("pages", []):
        txt = p.get("markdown") or p.get("html") or p.get("content") or p.get("raw_text")
        if txt:
            chunks.append(txt)

    return "\n\n---\n\n".join(chunks) if chunks else "# (No text found)\n"


@app.post("/api/extract")
async def extract(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a .pdf")

    try:
        files = {"file": (file.filename, await file.read(), "application/pdf")}
        resp = requests.post(url, headers=headers, files=files, data=data, timeout=120)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Upstream error: {e}")

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text[:1000])

    payload = resp.json()
    md = extract_text(payload)
    original_page_count = len(payload.get("pages", [])) or payload.get("total_pages")

    return {
        "markdown": md,
        "original_page_count": original_page_count,
        "page_num": 1,  
    }






    