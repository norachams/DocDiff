import Upload from "./components/upload";
import DiffPreview from "./components/DiffPreview";
import Extract from "./components/extract";   
import { useState } from "react";

export default function App() {
  const [markdownA, setMarkdownA] = useState<string>("");
  const [markdownB, setMarkdownB] = useState<string>("");
  const [loadingA, setLoadingA] = useState<boolean>(false);
  const [loadingB, setLoadingB] = useState<boolean>(false);
  const [pdfUrlA, setPdfUrlA] = useState<string | undefined>(undefined); 
  const [pdfUrlB, setPdfUrlB] = useState<string | undefined>(undefined); 

  const handleLoadingChange = (which: "A" | "B", isLoading: boolean) => {
    if (which === "A") {
      setLoadingA(isLoading);
    } else {
      setLoadingB(isLoading);
    }
  };

  return (
    <main className="mx-auto max-w-8xl px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Upload
          className="md:col-span-1"
          onMarkdownA={setMarkdownA}
          onMarkdownB={setMarkdownB}
          onLoadingChange={handleLoadingChange}
          onPdfUrlA={setPdfUrlA}   
          onPdfUrlB={setPdfUrlB} 
        />  
        <DiffPreview className="md:col-span-3"/>
      </div>
        <Extract className="md:col-span-3 mt-6"
          markdownA={markdownA}
          markdownB={markdownB}
          pdfUrlA={pdfUrlA}       
          pdfUrlB={pdfUrlB} 
          isExtractingA={loadingA}
          isExtractingB={loadingB}
        />
    </main>
  );
}

