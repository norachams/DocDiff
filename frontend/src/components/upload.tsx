import React from "react";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

type Props = {
  onMarkdownA: (md: string) => void;
  onMarkdownB: (md: string) => void;
  className?: string;
  onLoadingChange?: (which: "A" | "B", isLoading: boolean) => void;

  onPdfUrlA?: (url: string) => void; 
  onPdfUrlB?: (url: string) => void;
};



const Upload: React.FC<Props> = ({ onMarkdownA, onMarkdownB, className = "", onLoadingChange, onPdfUrlA, onPdfUrlB, }) => {
  async function handlePdf(e: React.ChangeEvent<HTMLInputElement>, which: "A" | "B") {
    const inputEl = e.currentTarget;           
    const file = inputEl.files?.[0];           
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) return;

    const url = URL.createObjectURL(file); 
    if (which === "A") onPdfUrlA?.(url); else onPdfUrlB?.(url);

    const form = new FormData();
    form.append("file", file);

    try {
      onLoadingChange?.(which, true);
      // const res = await fetch("http://localhost:8000/api/extract", { method: "POST", body: form });
      const res = await fetch(`${API_BASE}/api/extract`, { method: "POST", body: form });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const { markdown } = await res.json();
      const md = markdown ?? "";
      // const data = await res.json();
      // const md: string = data?.markdown ?? "";
      if (which === "A") {
        onMarkdownA(md);
      } else {
        onMarkdownB(md);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to extract. Check backend logs and CARDINAL_API_KEY.");
    } finally {
      onLoadingChange?.(which, false);
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
            <input accept=".pdf" id="file_input" type="file" onChange={(e) => handlePdf(e, "A")}
            className="block w-full text-sm text-neutral-900
            rounded-lg border border-neutral-300           
            bg-white                               
            cursor-pointer focus:outline-none
            focus:ring-2 focus:ring-neutral-800/10       
            overflow-hidden                                 
            file:mr-4                                    
            file:rounded-l-lg                              
            file:border-0                                 
            file:px-4 file:py-2                           
            file:text-sm file:font-medium
            file:bg-neutral-200 file:text-black           
            hover:file:bg-neutral-300 "
            >
            </input>
          </div>
        </div>

        <hr className="my-5 border-neutral-200" />

        {/* Document B */}
        <div>
          <p className="text-sm font-medium text-neutral-900">Document B</p>
          <div className="mt-2">
           <input accept=".pdf" id="file_input" type="file" onChange={(e) => handlePdf(e, "B")}
            className="block w-full text-sm text-neutral-900
            rounded-lg border border-neutral-300           
            bg-white                               
            cursor-pointer focus:outline-none
            focus:ring-2 focus:ring-neutral-800/10       
            overflow-hidden                                 
            file:mr-4                                    
            file:rounded-l-lg                              
            file:border-0                                 
            file:px-4 file:py-2                           
            file:text-sm file:font-medium
            file:bg-neutral-200 file:text-black           
            hover:file:bg-neutral-300 "
            >
            </input>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Upload;
