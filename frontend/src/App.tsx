import Upload from "./components/upload";
import DiffPreview from "./components/DiffPreview";
import Extract from "./components/extract";   
import { useState } from "react";
import Navbar from './components/navbar.tsx'


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

  const handleReset = () => {
    setMarkdownA("");
    setMarkdownB("");
    setPdfUrlA(undefined);
    setPdfUrlB(undefined);
    setLoadingA(false);
    setLoadingB(false);
  };

  return (
    <>
     <Navbar
      onLoadSample={() => { /* TODO: implement sample loading */ }}
      onReset={handleReset}  
      onExport={() => { /* TODO: implement export */ }}
    />
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
        <DiffPreview
          className="md:col-span-3"
          left={markdownA}
          right={markdownB}
        />
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
     </>
  );
}

