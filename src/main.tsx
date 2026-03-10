import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { InstallApp } from "./components/InstallApp"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <InstallApp />
  </StrictMode>,
)
