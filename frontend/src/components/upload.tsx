import React from "react";

type Props = {
  onMarkdownA: (md: string) => void;
  onMarkdownB: (md: string) => void;
  className?: string;
};


const Upload: React.FC<Props> = ({ onMarkdownA, onMarkdownB, className = "" }) => {
  async function handlePdf(e: React.ChangeEvent<HTMLInputElement>, which: "A" | "B") {
    const inputEl = e.currentTarget;           
    const file = inputEl.files?.[0];           
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) return;

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/extract", { method: "POST", body: form });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const md: string = data?.markdown ?? "";
      if (which === "A") {
        onMarkdownA(md);
      } else {
        onMarkdownB(md);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to extract. Check backend logs and CARDINAL_API_KEY.");
    } finally {
      inputEl.value = "";                       
    }
  }

  return (
    <section className={`w-full ${className}`}>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-base font-semibold text-neutral-900">Inputs</h2>

        {/* Document A */}
        <div className="mt-4">
          <p className="text-sm font-medium text-neutral-900">Document A</p>
          <div className="mt-2">
            <label className="inline-flex">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handlePdf(e, "A")}
                className="hidden"
              />
              <span className="cursor-pointer rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
                Choose PDF
              </span>
            </label>
          </div>
        </div>

        <hr className="my-5 border-neutral-200" />

        {/* Document B */}
        <div>
          <p className="text-sm font-medium text-neutral-900">Document B</p>
          <div className="mt-2">
            <label className="inline-flex">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handlePdf(e, "B")}
                className="hidden"
              />
              <span className="cursor-pointer rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
                Choose PDF
              </span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Upload;
