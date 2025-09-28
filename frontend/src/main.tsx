import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import Navbar from './components/navbar.tsx'
import Upload from './components/upload.tsx'
import DiffPreview from './components/DiffPreview.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <Navbar
      onLoadSample={() => { /* TODO: implement sample loading */ }}
      onReset={() => { /* TODO: implement reset */ }}
      onExport={() => { /* TODO: implement export */ }}
    />
    <Upload
      setTextA={(v) => { console.log("Set Text A:", v); }}
      setTextB={(v) => { console.log("Set Text B:", v); }}
    />
    <DiffPreview />
  </StrictMode>,
)
