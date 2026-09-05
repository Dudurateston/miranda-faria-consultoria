import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
// Fontes self-hosted — mesmos arquivos do Google Fonts, servidos daqui:
// menos uma dependencia externa no caminho critico e zero vazar de DNS.
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/inter/latin-300.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
