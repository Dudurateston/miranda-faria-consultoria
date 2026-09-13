import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, revokeConsent } from "@/lib/siteAnalytics";
import { EMAIL } from "@/lib/site";

/**
 * Política de Privacidade — a página é o contrato do site com quem
 * visita: medição própria, sem terceiros, sem dados pessoais. No
 * mesmo idiagem visual do resto, com revogação de consentimento em
 * um toque (LGPD).
 */

const SECTIONS = [
  {
    t: "Em uma frase",
    p: [
      "Este site usa medição própria anônima — eventos que dizem quais páginas ajudam e quais atrapalham — e, também, o Google Analytics para medir visitas e comportamento. Não vendemos e não compartilhamos dados com ninguém além do processamento do próprio Google Analytics, que usa cookies sob a política de privacidade do Google.",
    ],
  },
  {
    t: "Quem trata os dados",
    p: [
      "Eduardo Miranda Faria, consultoria e tecnologia, Brasil. Para qualquer dúvida sobre privacidade, escreva para o e-mail no fim desta página — respondemos em até 15 dias.",
    ],
  },
  {
    t: "O que é registrado",
    p: [
      "Com o seu aceite no aviso de privacidade, registramos: as páginas visitadas, a origem da visita (de onde você veio e parâmetros de campanha), a categoria do aparelho (celular, tablet ou computador), o idioma da visita, cliques nos botões de WhatsApp e a conclusão do diagnóstico — apenas as respostas escolhidas, nada que identifique você.",
      "O que nunca registramos: nome, e-mail, telefone, IP armazenado, ou qualquer dado que permita identify você. A sessão é um número aleatório guardado apenas no seu navegador, que expira após 30 minutos de inatividade.",
      "Além dessa medição própria, o Google Analytics registra visitas e navegação por meio de cookies do Google, nos termos da política de privacidade deles. Nenhuma informação sua que apareça aqui no site é enviada a ele.",
    ],
  },
  {
    t: "Consentimento e revogação",
    p: [
      "A medição própria nada grava antes do seu aceite. O Google Analytics, por decisão de quem publica o site, carrega desde o primeiro acesso; para não ser medido por ele, bloqueie ou limpe os cookies do navegador. Para a medição própria, revogue abaixo — a revogação é imediata.",
    ],
  },
  {
    t: "Sobre o WhatsApp",
    p: [
      "Quando você chama no WhatsApp, a conversa passa a existir na plataforma da Meta, sob a política de privacidade deles. O clique de saída é contado aqui; o conteúdo da conversa, nunca.",
    ],
  },
  {
    t: "Seus direitos",
    p: [
      "Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018, art. 18), você pode confirmar a existência de tratamento, acessar, corrigir, solicitar exclusão e portabilidade dos seus dados, além de revogar consentimentos. Como os registros são anônimos, na prática a exclusão é total: basta revogar ou pedir por e-mail.",
    ],
  },
  {
    t: "Retenção",
    p: [
      "Eventos anônimos são mantidos apenas enquanto servem à melhoria do site e podem ser excluídos a qualquer momento, no todo ou em parte, a seu pedido.",
    ],
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    // fora do LanguageProvider: titulo direto, sem hook de idioma
    document.title = "Política de Privacidade · Miranda Faria";
  }, []);
  const [consent, setConsent] = useState("…");
  const [revoked, setRevoked] = useState(false);

  useEffect(() => {
    setConsent(getConsent());
  }, []);

  const revoke = () => {
    revokeConsent();
    setConsent("denied");
    setRevoked(true);
  };

  return (
    <div className="mf-priv">
      <div className="mf-priv__inner">
        <Link to="/pt" data-cursor="link" className="mf-priv__back">
          ← Voltar ao site
        </Link>
        <p className="mf-label">Legal · LGPD</p>
        <h1 className="mf-priv__title">Política de Privacidade</h1>
        <p className="mf-priv__updated">Última atualização: setembro de 2026</p>

        <div className="mf-priv__sections">
          {SECTIONS.map((s) => (
            <section key={s.t} className="mf-priv__sec">
              <h2 className="mf-priv__st">{s.t}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="mf-priv__sp">{para}</p>
              ))}
            </section>
          ))}

          <section className="mf-priv__sec">
            <h2 className="mf-priv__st">Contato</h2>
            <p className="mf-priv__sp">
              <a href={`mailto:${EMAIL}`} data-cursor="link" className="mf-priv__mail">
                {EMAIL}
              </a>
            </p>
          </section>

          <section className="mf-priv__revoke" aria-live="polite">
            <p className="mf-priv__rlabel">Seu consentimento de medição</p>
            <p className="mf-priv__rstate">
              {consent === "granted"
                ? "Concedido — eventos anônimos estão sendo registrados."
                : consent === "denied"
                ? "Recusado — nada além do essencial é registrado."
                : "Ainda não decidido no aviso de privacidade."}
            </p>
            {consent === "granted" ? (
              <button type="button" className="mf-priv__btn" onClick={revoke} data-cursor="link">
                Revogar consentimento
              </button>
            ) : revoked ? (
              <p className="mf-priv__done">Revogado. A medição própria foi desligada neste navegador.</p>
            ) : null}
          </section>
        </div>
      </div>

      <style>{`
.mf-priv{
  min-height:100vh;background:var(--color-bg);
  padding:calc(var(--nav-height) + 3rem) var(--gutter) 6rem;
}
.mf-priv__inner{max-width:720px;margin:0 auto}
.mf-priv__back{
  display:inline-block;
  font-family:var(--font-mono);font-size:11px;
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);text-decoration:none;
  margin-bottom:2.5rem;
}
.mf-priv__back:hover{color:var(--color-accent)}
.mf-priv__title{
  font-family:var(--font-display);font-weight:400;
  font-size:clamp(2.2rem,6vw,3.4rem);line-height:1.1;
  letter-spacing:var(--tracking-display);
  color:var(--color-text-primary);margin:0.9rem 0 0.5rem;
}
.mf-priv__updated{
  font-family:var(--font-mono);font-size:12px;
  letter-spacing:var(--tracking-label);
  color:var(--color-text-ghost);margin:0 0 2.2rem;
}
.mf-priv__sec{margin:0 0 2.4rem}
.mf-priv__st{
  font-family:var(--font-display);font-weight:400;
  font-size:1.35rem;letter-spacing:0.01em;
  color:var(--color-text-primary);margin:0 0 0.7rem;
}
.mf-priv__sp{
  font-family:var(--font-body);font-weight:300;
  font-size:1rem;line-height:1.75;
  color:var(--color-text-secondary);margin:0 0 0.8rem;
}
.mf-priv__mail{color:var(--color-accent)}
.mf-priv__revoke{
  border-top:1px solid var(--color-divider);
  padding-top:1.6rem;
}
.mf-priv__rlabel{
  font-family:var(--font-mono);font-size:11px;
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);margin:0 0 0.4rem;
}
.mf-priv__rstate{
  font-family:var(--font-body);font-weight:300;
  font-size:0.95rem;line-height:1.6;
  color:var(--color-text-primary);margin:0 0 1rem;
}
.mf-priv__btn{
  font-family:var(--font-mono);font-size:11px;
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--bone);background:var(--mf-terracotta);
  border:1px solid var(--mf-terracotta);
  padding:0.7rem 1.3rem;cursor:pointer;
}
.mf-priv__done{
  font-family:var(--font-mono);font-size:12px;
  color:var(--color-text-secondary);margin:0;
}
      `}</style>
    </div>
  );
}