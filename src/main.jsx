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

// Aviso benigno do Chrome: o observador interno do Lenis (autoResize)
// dispara quando fontes e videos mudam a altura do conteudo no mesmo
// quadro — a notificacao e simplesmente reentregue no quadro seguinte,
// sem perda. Filtro cirurgico: so essa mensagem, nenhum outro erro.
const suppressResizeObserverLoop = (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
};
window.addEventListener('error', suppressResizeObserverLoop);

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)