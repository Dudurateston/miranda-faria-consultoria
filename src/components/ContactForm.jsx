import React, { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";

const inputStyle = {
  width: "100%",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: 15,
  color: "#1A1A18",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(138,133,120,0.28)",
  padding: "14px 0",
  outline: "none",
};
const labelStyle = {
  display: "block",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: 10,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "#8A8578",
  marginBottom: 6,
};

export default function ContactForm() {
  const [form, setForm] = useState({
    nome: "",
    contato: "",
    empresa: "",
    mensagem: "",
    consentimento: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const honeypot = useRef("");
  const loadTime = useRef(Date.now());

  useEffect(() => {
    loadTime.current = Date.now();
  }, []);

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (honeypot.current) return;
    if (Date.now() - loadTime.current < 3000) {
      setError("Muito rápido. Tente novamente em alguns segundos.");
      return;
    }
    const count = Number(sessionStorage.getItem("mf_submits") || 0);
    if (count >= 3) {
      setError("Limite de envios atingido. Tente pelo WhatsApp: (37) 99951-2146");
      return;
    }
    if (!form.nome.trim())
      return setError("Preencha o nome para eu conseguir responder.");
    if (!form.contato.trim())
      return setError("Preencha o WhatsApp ou e-mail para eu conseguir responder.");
    if (!form.mensagem.trim())
      return setError("Preencha o que está travando para eu conseguir responder.");
    if (!form.consentimento)
      return setError("Autorize o contato para eu conseguir responder.");

    setSubmitting(true);
    try {
      await base44.entities.Contato.create({
        nome: form.nome.trim(),
        contato: form.contato.trim(),
        empresa: form.empresa.trim() || undefined,
        mensagem: form.mensagem.trim(),
        consentimento: true,
        origem: "site",
      });
      sessionStorage.setItem("mf_submits", String(count + 1));
      setSuccess(true);
    } catch (err) {
      setError("Não consegui enviar. Tente pelo WhatsApp: (37) 99951-2146");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ paddingTop: 20 }}>
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22,
            color: "#1A1A18",
            margin: 0,
          }}
        >
          Recebido. Respondo hoje ainda.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }} noValidate>
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, top: -9999 }}>
        <label>
          Não preencha
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot.current}
            onChange={(e) => (honeypot.current = e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="cf-nome">Nome *</label>
        <input id="cf-nome" style={inputStyle} value={form.nome} onChange={set("nome")} autoComplete="name" />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="cf-contato">WhatsApp ou e-mail *</label>
        <input id="cf-contato" style={inputStyle} value={form.contato} onChange={set("contato")} autoComplete="tel email" />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="cf-empresa">Empresa</label>
        <input id="cf-empresa" style={inputStyle} value={form.empresa} onChange={set("empresa")} autoComplete="organization" />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle} htmlFor="cf-msg">O que está travando? *</label>
        <textarea id="cf-msg" style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.mensagem} onChange={set("mensagem")} rows={4} />
      </div>

      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 26, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={form.consentimento}
          onChange={set("consentimento")}
          style={{ marginTop: 6, width: 18, height: 18, accentColor: "#B5502E" }}
        />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#8A8578", lineHeight: 1.6 }}>
          Autorizo o contato sobre esta solicitação.
        </span>
      </label>

      {error && (
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#B5502E", margin: "0 0 20px" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        data-cursor="link"
        disabled={submitting}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          padding: "16px 28px",
          minHeight: 44,
          background: "#1A1A18",
          color: "#F5F1EA",
          border: "none",
          borderRadius: 2,
          cursor: submitting ? "wait" : "pointer",
          opacity: submitting ? 0.5 : 1,
        }}
      >
        {submitting ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}