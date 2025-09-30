import React, { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import ReactMarkdown from "react-markdown";      
import remarkGfm from "remark-gfm";  


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();


type Props = {
  markdownA?: string;
  markdownB?: string;
  className?: string;
  pdfUrlA?: string;
  pdfUrlB?: string;
  isExtractingA?: boolean;
  isExtractingB?: boolean;
};

const Extract: React.FC<Props> = ({
  markdownA = "",
  markdownB = "",
  className = "",
  pdfUrlA,
  pdfUrlB,
  isExtractingA = false,
  isExtractingB = false,
}) => {
  const [tab, setTab] = useState<"A" | "B">("A");
  const [mode, setMode] = useState<"text" | "pdf">("text");
  const currentMarkdown = tab === "A" ? markdownA : markdownB;
  const currentPdf = tab === "A" ? pdfUrlA : pdfUrlB;
  const isLoading = tab === "A" ? isExtractingA : isExtractingB;

  return (
    <section className={`w-full ${className}`}>
      {/* Simple tabs */}
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("A")}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
            tab === "A"
              ? "bg-neutral-100 text-neutral-900"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Document A
        </button>
        <button
          type="button"
          onClick={() => setTab("B")}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
            tab === "B"
              ? "bg-neutral-100 text-neutral-900"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Document B
        </button>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
         <div className="flex items-center justify-between">
          

          <div className="inline-flex rounded-xl border border-neutral-200 overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => setMode("text")}
              className={`px-3 py-1.5 ${
                mode === "text"
                  ? "bg-neutral-100 text-neutral-900"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setMode("pdf")}
              className={`px-3 py-1.5 border-l border-neutral-200 ${
                mode === "pdf"
                  ? "bg-neutral-100 text-neutral-900"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              PDF
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <span
                className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900"
                aria-label="Loading"
              />
            </div>
          ) : mode === "text" ? (
            currentMarkdown ? (
                 <div className="text-sm text-neutral-900 leading-6">        
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>                
                    {currentMarkdown}                                       
                  </ReactMarkdown>                                          
                </div>
            ) : (
              <div className="text-sm text-neutral-400 font-mono">(empty)</div>
            )
          ) : currentPdf ? (
            <div className="w-full h-[28rem] overflow-auto flex justify-center">
             <Document
              file={{ url: currentPdf }}
              onLoadError={(e) => console.error("PDF load error:", e)}
            >
              <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} width={800} />
            </Document>
            </div> 
          ) : (
            <div className="text-sm text-neutral-400 font-mono">
              (no PDF loaded)
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Extract;

