import React from "react";
import { Link } from "react-router-dom";
import { EMAIL } from "@/lib/site";

function H({ children }) {
  return (
    <h2
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 400,
        fontSize: "clamp(22px, 3vw, 30px)",
        letterSpacing: "0.02em",
        color: "#1A1A18",
        margin: "40px 0 16px",
      }}
    >
      {children}
    </h2>
  );
}
function P({ children }) {
  return (
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.8, color: "#1A1A18", margin: "0 0 16px" }}>
      {children}
    </p>
  );
}

export default function PrivacyPolicy() {
  return (
    <div style={{ background: "#F5F1EA", minHeight: "100vh" }}>
      <div className="px-6 md:px-10" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="mx-auto" style={{ maxWidth: 680 }}>
          <Link
            to="/"
            data-cursor="link"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#8A8578",
              textDecoration: "none",
            }}
          >
            ← Voltar ao site
          </Link>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(26px, 4vw, 40px)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#1A1A18",
              margin: "32px 0 8px",
            }}
          >
            Política de Privacidade
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8A8578", margin: "0 0 24px" }}>
            Última atualização: agosto de 2026
          </p>

          <H>Dados que coletamos</H>
          <P>Quando você envia o formulário de contato, coletamos: nome, WhatsApp ou e-mail, empresa (opcional) e a mensagem que você escreve sobre o que está travando.</P>
          <P>Não coletamos CPF, endereço ou qualquer dado sensível. Nome, contato e mensagem bastam para responder.</P>

          <H>Para que usamos</H>
          <P>Usamos esses dados somente para responder à sua solicitação de contato e, se avançar, para a conversa sobre o serviço. Nenhum dado é compartilhado, vendido ou cedido a terceiros.</P>

          <H>Por quanto tempo guardamos</H>
          <P>Os dados de contato ficam armazenados por até 24 meses. Depois disso, são apagados.</P>

          <H>Seus direitos</H>
          <P>Você pode pedir a qualquer momento a exclusão dos seus dados. Basta enviar um e-mail para {EMAIL} com o assunto "Excluir meus dados" e a solicitação será atendida.</P>

          <H>Segurança</H>
          <P>Os dados ficam em ambiente protegido, acessível apenas ao administrador do site. O envio do formulário é protegido por mecanismos anti-spam e o consentimento é registrado junto à solicitação.</P>

          <H>Contato</H>
          <P>Para qualquer dúvida sobre esta política, escreva para {EMAIL}.</P>
        </div>
      </div>
    </div>
  );
}