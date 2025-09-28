import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from './components/navbar.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navbar
      onLoadSample={() => { /* TODO: implement sample loading */ }}
      onReset={() => { /* TODO: implement reset */ }}
      onExport={() => { /* TODO: implement export */ }}
    />
    <App />
  </StrictMode>,
)
