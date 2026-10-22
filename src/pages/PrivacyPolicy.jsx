import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, revokeConsent } from "@/lib/siteAnalytics";
import { useLang } from "@/lib/i18n";
import { EMAIL } from "@/lib/site";

/**
 * Política de Privacidade — a página é o contrato do site com quem
 * visita: medição própria, formulário e serviços externos. No
 * mesmo idiagem visual do resto, com revogação de consentimento em
 * um toque (LGPD).
 */

const SECTIONS = [
  {
    "t": "Em uma frase",
    "p": [
      "O site usa registros de navegação para entender o uso das páginas e recebe os dados que você envia pelo formulário de contato. O Google Analytics e os serviços externos de contato têm políticas próprias. Não vendemos dados pessoais."
    ]
  },
  {
    "t": "Quem trata os dados",
    "p": [
      "Eduardo Miranda Faria, consultoria e tecnologia, Brasil. Dúvidas e solicitações sobre privacidade podem ser enviadas ao e-mail indicado no fim desta página."
    ]
  },
  {
    "t": "O que é registrado",
    "p": [
      "A medição própria registra eventos de navegação após o aceite, como páginas visitadas, origem da visita, parâmetros de campanha, categoria do aparelho, idioma e interações. A decisão do aviso de privacidade também é registrada.",
      "Quando você envia o formulário de contato, são registrados nome, e-mail, empresa quando informada, tipo de projeto, mensagem, preferência de contato por WhatsApp e idioma. Esses dados apoiam a análise e a resposta ao pedido. O formulário é processado pela plataforma Base44.",
      "A sessão da medição própria usa um identificador aleatório no navegador, renovado após 30 minutos de inatividade. O Google Analytics também mede visitas e navegação por seus próprios recursos."
    ]
  },
  {
    "t": "Diagnóstico",
    "p": [
      "O cálculo do Diagnóstico acontece no navegador. O novo fluxo não cria um registro automático de lead ao apresentar o resultado. Você pode editar e copiar o resumo e escolher se deseja compartilhá-lo pelos links de contato. Isso não substitui os recursos de navegação, hospedagem e medição descritos nesta página."
    ]
  },
  {
    "t": "Consentimento e revogação",
    "p": [
      "As preferências abaixo controlam os eventos de navegação da medição própria. A revogação interrompe esses eventos neste navegador e remove o identificador local da sessão. Ela não apaga automaticamente registros já armazenados no servidor. Para solicitar informações ou exclusão, use o e-mail de contato.",
      "Na configuração atual, o Google Analytics carrega desde o primeiro acesso. O controle da medição própria abaixo não desativa esse serviço; seus recursos e cookies seguem a política do Google."
    ]
  },
  {
    "t": "Serviços externos",
    "p": [
      "A Base44 fornece a plataforma de execução e processamento do formulário. Ao abrir WhatsApp ou Calendly, você passa a usar o serviço escolhido, sujeito à política de privacidade dele. O conteúdo de uma conversa nesses serviços não é registrado pelo componente do Diagnóstico."
    ]
  },
  {
    "t": "Seus direitos",
    "p": [
      "Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção, informação sobre compartilhamento, portabilidade, eliminação quando aplicável e revogação de consentimento. Envie a solicitação ao e-mail abaixo para análise conforme a legislação."
    ]
  },
  {
    "t": "Retenção",
    "p": [
      "A retenção considera a finalidade do atendimento, da medição e as obrigações aplicáveis. Você pode solicitar informações sobre os registros e sua exclusão pelo e-mail de contato. Revogar a medição no navegador é uma ação diferente de solicitar a eliminação dos dados já registrados."
    ]
  }
];


/* EN — espelho juridico das secoes PT (route /en/privacidade) */
const SECTIONS_EN = [
  {
    "t": "In one sentence",
    "p": [
      "The site uses navigation records to understand how its pages are used and receives the details you submit through the contact form. Google Analytics and external contact services have their own policies. We do not sell personal data."
    ]
  },
  {
    "t": "Who processes the data",
    "p": [
      "Eduardo Miranda Faria, consulting and technology, Brazil. Privacy questions and requests can be sent to the email listed at the end of this page."
    ]
  },
  {
    "t": "What is recorded",
    "p": [
      "After consent, our own measurement records navigation events such as pages visited, visit origin, campaign parameters, device category, language and interactions. The choice made in the privacy notice is also recorded.",
      "When you submit the contact form, it records your name, email, company if provided, project type, message, WhatsApp contact preference and language. These details support the review of and response to your request. The form is processed through the Base44 platform.",
      "Our own measurement session uses a random browser identifier, renewed after 30 minutes of inactivity. Google Analytics also measures visits and navigation through its own resources."
    ]
  },
  {
    "t": "Business diagnostic",
    "p": [
      "The diagnostic calculation runs in the browser. The new flow does not create an automatic lead record when displaying the result. You can edit and copy the summary and decide whether to share it through the contact links. This is separate from the navigation, hosting and measurement resources described on this page."
    ]
  },
  {
    "t": "Consent and revocation",
    "p": [
      "The preferences below control navigation events in our own measurement. Revoking consent stops those events in this browser and removes the local session identifier. It does not automatically delete records already stored on the server. Use the contact email to request information or deletion.",
      "In the current configuration, Google Analytics loads from the first visit. The own-measurement control below does not disable that service; its resources and cookies follow Google’s policy."
    ]
  },
  {
    "t": "External services",
    "p": [
      "Base44 provides the platform used to run the site and process its contact form. Opening WhatsApp or Calendly takes you to the chosen service, under its privacy policy. The diagnostic component does not record conversations held in those services."
    ]
  },
  {
    "t": "Your rights",
    "p": [
      "Under Brazil’s LGPD, you can request confirmation of processing, access, correction, sharing information, portability, deletion where applicable and withdrawal of consent. Send your request to the email below for review under the law."
    ]
  },
  {
    "t": "Retention",
    "p": [
      "Retention considers the purposes of enquiries and measurement and applicable obligations. You can use the contact email to request information about records and their deletion. Revoking browser measurement is different from requesting deletion of data already recorded."
    ]
  }
];

export default function PrivacyPolicy() {
  const { lang, path } = useLang();
  const en = lang === "en";
  const S = en ? SECTIONS_EN : SECTIONS;
  useEffect(() => {
    document.title = en ? "Privacy Policy · Miranda Faria" : "Política de Privacidade · Miranda Faria";
  }, [en]);
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
        <Link to={path("")} data-cursor="link" className="mf-priv__back">
          {en ? "← Back to the site" : "← Voltar ao site"}
        </Link>
        <p className="mf-label">Legal · LGPD</p>
        <h1 className="mf-priv__title">{en ? "Privacy Policy" : "Política de Privacidade"}</h1>
        <p className="mf-priv__updated">{en ? "Last updated: 22 October 2026" : "Última atualização: 22 de outubro de 2026"}</p>

        <div className="mf-priv__sections">
          {S.map((s) => (
            <section key={s.t} className="mf-priv__sec">
              <h2 className="mf-priv__st">{s.t}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="mf-priv__sp">{para}</p>
              ))}
            </section>
          ))}

          <section className="mf-priv__sec">
            <h2 className="mf-priv__st">{en ? "Contact" : "Contato"}</h2>
            <p className="mf-priv__sp">
              <a href={`mailto:${EMAIL}`} data-cursor="link" className="mf-priv__mail">
                {EMAIL}
              </a>
            </p>
          </section>

          <section className="mf-priv__revoke" aria-live="polite">
            <p className="mf-priv__rlabel">{en ? "Your measurement consent" : "Seu consentimento de medição"}</p>
            <p className="mf-priv__rstate">
              {consent === "granted"
                ? en ? "Own navigation measurement is enabled." : "Medição própria de navegação ativada."
                : consent === "denied"
                ? en ? "Own navigation measurement is disabled in this browser." : "Medição própria de navegação desativada neste navegador."
                : en ? "Not yet decided in the privacy notice." : "Ainda não decidido no aviso de privacidade."}
            </p>
            {consent === "granted" ? (
              <button type="button" className="mf-priv__btn" onClick={revoke} data-cursor="link">
                {en ? "Revoke consent" : "Revogar consentimento"}
              </button>
            ) : revoked ? (
              <p className="mf-priv__done">{en ? "Revoked. Own measurement has been turned off in this browser." : "Revogado. A medição própria foi desligada neste navegador."}</p>
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
  color:#F5F1EA;background:var(--copper,#B5502E);
  border:1px solid var(--copper,#B5502E);
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
