import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Página de instruções para conectar um cliente de IA ao servidor MCP deste app.
// NÃO é setup do MCP — apenas ensina o usuário final a apontar seu assistente.
const clients = [
  {
    id: "claude",
    label: "Claude",
    steps: [
      "Abra o menu de perfil e vá em Settings → Connectors.",
      "Clique em \"Add custom connector\".",
      "Dê um nome (ex.: Miranda Faria) e cole a URL do servidor.",
      "Clique em Add.",
    ],
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    steps: [
      "Vá em Apps e ative o Developer mode (atenção ao aviso que o ChatGPT mostra sobre apps de terceiros).",
      "Clique em \"Create app\".",
      "Dê um nome, cole a URL do servidor e clique em Create.",
      "Ative o app pelo composer do chat antes de conversar com ele.",
    ],
  },
  {
    id: "cursor",
    label: "Cursor",
    steps: [
      "Vá em Settings → Tools & Integrations → \"New MCP Server\".",
      "Isso abre o arquivo mcp.json.",
      "Adicione uma entrada cujo url seja a URL do servidor e salve.",
      "Ative o servidor no toggle.",
    ],
  },
  {
    id: "custom",
    label: "Custom",
    steps: [
      "Copie a URL do servidor.",
      "Adicione como um servidor MCP streamable HTTP.",
      "Nome e URL bastam para a maioria dos clientes.",
      "Recarregue o cliente.",
    ],
  },
];

export default function Connect() {
  const [active, setActive] = useState("claude");
  const [copied, setCopied] = useState(false);
  const url = useMemo(
    () => new URL("/api/mcp", window.location.origin).toString(),
    []
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      /* ignore */
    }
  };

  const current = clients.find((c) => c.id === active);

  return (
    <>
      <div
        className="mf-connect"
        style={{ background: "var(--bg-light)", minHeight: "100vh" }}
      >
        <div className="mf-connect__inner">
          <Link to="/" className="mf-connect__back" data-cursor="link">
            ← Voltar ao site
          </Link>
          <p className="mf-label">Conectar IA</p>
          <h1 className="mf-connect__title">
            Conecte seu assistente a este app.
          </h1>
          <p className="mf-connect__lead">
            Este app expõe um servidor MCP. Aponte seu cliente de IA para a URL
            abaixo para ler dados e executar ações com a sua permissão.
          </p>

          <div className="mf-connect__url">
            <span className="mf-connect__urltext">{url}</span>
            <button
              type="button"
              className="mf-connect__copy"
              data-cursor="link"
              onClick={copy}
            >
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>

          <div className="mf-connect__tabs" role="tablist">
            {clients.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={active === c.id}
                data-cursor="link"
                className={`mf-connect__tab${
                  active === c.id ? " is-active" : ""
                }`}
                onClick={() => setActive(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <ol className="mf-connect__steps">
            {current.steps.map((s, i) => (
              <li className="mf-connect__step" key={i}>
                <span className="mf-connect__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mf-connect__text">{s}</span>
              </li>
            ))}
          </ol>

          <div className="mf-connect__note">
            <p className="mf-label">Depois de conectar</p>
            <p className="mf-connect__notetext">
              O cliente abre a página de consentimento deste app. Você entra com
              a sua própria conta e aprova — o assistente age sempre em seu nome.
            </p>
          </div>

          <p className="mf-connect__refresh">
            Atualize o conector depois que publicarmos mudanças: os assistentes
            guardam a lista de ferramentas em cache.
          </p>
        </div>
      </div>
      <style>{`
.mf-connect{font-family:var(--font-body);color:var(--color-text-primary)}
.mf-connect__inner{max-width:680px;margin:0 auto;padding:clamp(80px,12vh,140px) var(--gutter) 80px}
.mf-connect__back{font-family:var(--font-body);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:var(--color-text-ghost);text-decoration:none;display:inline-block;margin-bottom:40px}
.mf-connect__title{font-family:var(--font-display);font-weight:400;font-size:clamp(28px,5vw,44px);line-height:1.05;letter-spacing:var(--tracking-display);color:var(--color-text-primary);margin:1.25rem 0 1.5rem}
.mf-connect__lead{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);max-width:var(--max-width-body);margin:0 0 2.5rem}
.mf-connect__url{display:flex;align-items:center;gap:1rem;border-top:1px solid var(--color-divider);border-bottom:1px solid var(--color-divider);padding:1rem 0;margin-bottom:2.5rem}
.mf-connect__urltext{font-family:var(--font-mono);font-size:12px;color:var(--color-text-primary);word-break:break-all;flex:1}
.mf-connect__copy{font-family:var(--font-body);font-weight:400;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:var(--copper);background:transparent;border:1px solid var(--color-divider);padding:10px 16px;cursor:pointer;border-radius:2px;white-space:nowrap}
.mf-connect__tabs{display:flex;flex-wrap:wrap;border-bottom:1px solid var(--color-divider);margin-bottom:2rem}
.mf-connect__tab{font-family:var(--font-body);font-weight:400;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-text-ghost);background:transparent;border:none;padding:14px 18px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px}
.mf-connect__tab.is-active{color:var(--color-text-primary);border-bottom-color:var(--copper)}
.mf-connect__steps{list-style:none;margin:0;padding:0}
.mf-connect__step{display:grid;grid-template-columns:2.5rem 1fr;gap:1rem;padding:1.1rem 0;border-top:1px solid var(--color-divider)}
.mf-connect__step:last-child{border-bottom:1px solid var(--color-divider)}
.mf-connect__num{font-family:var(--font-mono);font-size:var(--text-label);letter-spacing:var(--tracking-label);color:var(--color-text-ghost)}
.mf-connect__text{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary)}
.mf-connect__note{margin-top:3rem}
.mf-connect__notetext{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-secondary);max-width:var(--max-width-body);margin:0.8rem 0 0}
.mf-connect__refresh{font-family:var(--font-body);font-weight:300;font-size:var(--text-body-md);line-height:var(--leading-body);color:var(--color-text-ghost);max-width:var(--max-width-body);margin:2.5rem 0 0}
      `}</style>
    </>
  );
}