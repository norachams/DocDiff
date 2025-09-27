import json, pathlib

with open("output.json", "r", encoding="utf-8") as f:
    data = json.load(f)

chunks = []
for p in data.get("pages", []):
    txt = p.get("markdown") or p.get("html") or p.get("content") or p.get("raw_text")
    if txt:
        chunks.append(txt)

out = "\n\n---\n\n".join(chunks) if chunks else "# (No text found)\n"
pathlib.Path("output.md").write_text(out, encoding="utf-8")
print("Wrote output.md")
