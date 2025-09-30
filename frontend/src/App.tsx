import Upload from "./components/upload";
import DiffPreview from "./components/DiffPreview";
import Extract from "./components/extract";   
import { useState } from "react";
import Navbar from "./components/navbar";

const example1 = "/Example-1.pdf";
const example2 = "/Example-2.pdf";

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

  async function loadSample(which: "A" | "B", path: string) { 

    const setLoading = which === "A" ? setLoadingA : setLoadingB;    
    const setPdfUrl  = which === "A" ? setPdfUrlA  : setPdfUrlB;      
    const setMd      = which === "A" ? setMarkdownA : setMarkdownB;  

    setLoading(true);
    try {
      const r = await fetch(path);
      if (!r.ok) throw new Error(`Failed to fetch ${path}`);
      const blob = await r.blob();

      const file = new File([blob], path.split("/").pop() || "sample.pdf", {
        type: "application/pdf",
      });

      setPdfUrl(URL.createObjectURL(blob));

      const form = new FormData();
      form.append("file", file);
      const res = await fetch("http://localhost:8000/api/extract", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMd(data?.markdown ?? "");
    } catch (e) {
      console.error(e);
      alert(`Failed to load ${which} sample`);
    } finally {
      setLoading(false);
    }
  } 
  

  const handleLoadSample = () => {                   
    loadSample("A", example1);         
    loadSample("B", example2);        
  };

  return (
    <>
     <Navbar
      onLoadSample={handleLoadSample} 
      onReset={handleReset}  
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
