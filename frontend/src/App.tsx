// src/App.tsx
import Upload from "./components/upload";
import DiffPreview from "./components/DiffPreview";
import Extract from "./components/extract";   
import { useState } from "react";

export default function App() {
  const [markdownA, setMarkdownA] = useState<string>("");
  const [markdownB, setMarkdownB] = useState<string>("");

  return (
    <main className="mx-auto max-w-8xl px-4 py-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Upload
          className="sm:col-span-1"
          onMarkdownA={setMarkdownA}
          onMarkdownB={setMarkdownB}
        />  
        <DiffPreview className="md:col-span-2"/>

        <Extract className="md:col-span-3 mt-6"
          markdownA={markdownA}
          markdownB={markdownB}
        />
      </div>
    </main>
  );
}
