import requests
from dotenv import load_dotenv
import os
load_dotenv()
import json

cardinal_api_key = os.getenv("CARDINAL_API_KEY")
pdf_path = os.getenv("PDF_PATH")

url = "https://api.trycardinal.ai/markdown"
headers = {"x-api-key": cardinal_api_key}
data = {"markdown": "true", "denseTables": "true"}

with open(pdf_path, "rb") as upload_file:
    response = requests.post(url, headers=headers, files={"file": upload_file}, data=data)

response.raise_for_status()

with open("output.json", "w", encoding="utf-8") as f:
    json.dump(response.json(), f, ensure_ascii=False, indent=2)
    print("Saved API output to output.json")
