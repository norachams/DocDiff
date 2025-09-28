import requests
from dotenv import load_dotenv
import os
import json, pathlib
load_dotenv()

cardinal_api_key = os.getenv("CARDINAL_API_KEY")
pdf_path = os.getenv("PDF_PATH")

url = "https://api.trycardinal.ai/markdown"
headers = {"x-api-key": cardinal_api_key}
data = {"markdown": "true", "denseTables": "true"}


def get_pdf():
    with open(pdf_path, "rb") as upload_file:
        response = requests.post(url, headers=headers, files={"file": upload_file}, data=data)

    response.raise_for_status()

    payload = response.json()

    with open("output.json", "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print("Saved API output to output.json")
    extract_text(payload)

    # with open("output.json", "w", encoding="utf-8") as f:
    #     json.dump(response.json(), f, ensure_ascii=False, indent=2)
    #     print("Saved API output to output.json")
    #     data = json.load(f)
    #     extract_text(data)



def extract_text():

    chunks = []
    for p in data.get("pages", []):
        txt = p.get("markdown") or p.get("html") or p.get("content") or p.get("raw_text")
        if txt:
            chunks.append(txt)

    out = "\n\n---\n\n".join(chunks) if chunks else "# (No text found)\n"
    pathlib.Path("output.md").write_text(out, encoding="utf-8")
    print("Wrote output.md")


if __name__ == "__main__":
    get_pdf()