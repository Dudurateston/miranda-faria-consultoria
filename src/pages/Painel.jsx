import React, { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

/**
 * PAINEL OPERACIONAL — KPIs, leads e qualidade do site num só lugar.
 *
 * (Eduardo 25/09: "melhorar os KPIs, dados e análise; automatizar os
 * dados; painel operacional".) Lê a medição first-party (SiteEvent,
 * catálogo HEART/AARRR já implantado no site) + os leads (ContactRequest,
 * DiagnosticoLead). Sem gráficos pesados: números que importam, funil,
 * qualidade técnica (web vitals) e as duas listas de leads recentes.
 *
 * ACESSO: só autenticado (rota fora do sitemap, disallow no robots,
 * leitura das entidades é RLS admin). Entrar em mirandafaria.com.br/painel.
 *
 * GA4: quando o ID de medição entrar em ga.js, os eventos do catálogo
 * fluem pro Google Analytics automaticamente — este painel segue como
 * visão first-party, sem terceiros.
 */

const PERIODOS = [
  { key: 1, label: "Hoje" },
  { key: 7, label: "7 dias" },
  { key: 30, label: "30 dias" },
];

const DAY = 24 * 60 * 60 * 1000;

function fmtData(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function mediana(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

async function puxar(entidade, params) {
  const res = await base44.entities[entidade].list(params);
  return Array.isArray(res) ? res : res?.data || [];
}

function periodOk(reg, dias) {
  return new Date(reg.created_date).getTime() >= Date.now() - dias * DAY;
}

export default function Painel() {
  // fora do casco de idioma: title direto, sem useLang
  useEffect(() => { document.title = "Painel Operacional — Miranda Faria"; }, []);
  const { isAuthenticated, isLoadingAuth, navigateToLogin, logout, user } = useAuth();
  const [periodo, setPeriodo] = useState(7);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [dados, setDados] = useState(null);
  const [atualizado, setAtualizado] = useState(null);

  const carregar = useCallback(async (dias) => {
    setCarregando(true);
    setErro(null);
    try {
      // janela de eventos: busca larga, corta no cliente (limite duro 500)
      const [eventos, contatos, diagnosticos] = await Promise.all([
        puxar("SiteEvent", { limit: 500, sort: "-created_date" }),
        puxar("ContactRequest", { limit: 100, sort: "-created_date" }),
        puxar("DiagnosticoLead", { limit: 100, sort: "-created_date" }),
      ]);
      const desde = Date.now() - dias * DAY;
      const ev = eventos.filter((e) => new Date(e.created_date).getTime() >= desde);
      setDados({ ev, contatos, diagnosticos, janela: dias });
      setAtualizado(new Date().toISOString());
    } catch (e) {
      setErro(String(e?.message || e).slice(0, 140));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) carregar(periodo);
    else setCarregando(false);
  }, [isAuthenticated, periodo, carregar]);

  const kpi = useMemo(() => {
    if (!dados) return null;
    const { ev } = dados;
    const por = (t) => ev.filter((e) => e.event_type === t);
    const sessoes = new Set(ev.map((e) => e.session_id).filter(Boolean)).size;
    const views = por("page_view").length;
    const engajou = new Set(
      ev.filter((e) => e.event_type === "scroll_depth" || e.event_type === "engaged_time").map((e) => e.session_id)
    ).size;
    const ctas = ev.filter((e) => e.event_type === "cta_whatsapp" || e.event_type === "cta_click").length;
    const formSubmits = por("form_submit").length;
    const diagOk = por("diag_complete").length;
    const errosJs = por("error_js").length;

    const vit = ev.filter((e) => e.event_type === "web_vitals").map((e) => e.extra_data || {});
    const num = (v) => typeof v === "number" && isFinite(v);
    const lcp = mediana(vit.map((v) => v.lcp).filter(num));
    const cls = mediana(vit.map((v) => v.cls).filter(num));
    const inp = mediana(vit.map((v) => v.inp).filter(num));

    const contar = (campo, top) => {
      const m = new Map();
      ev.forEach((e) => {
        const k = e[campo] || "(direto)";
        m.set(k, (m.get(k) || 0) + 1);
      });
      return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, top);
    };

    return {
      sessoes, views, engajou, ctas, formSubmits, diagOk, errosJs,
      lcp, cls, inp,
      paginas: contar("page", 6),
      referrers: contar("referrer", 5),
      devices: contar("device", 3),
      langs: contar("lang", 2),
    };
  }, [dados]);

  const contatosRecentes = useMemo(() => (dados ? dados.contatos.slice(0, 12) : []), [dados]);
  const diagsRecentes = useMemo(() => (dados ? dados.diagnosticos.slice(0, 12) : []), [dados]);

  if (isLoadingAuth) {
    return (
      <div className="pnl">
        <div className="pnl__wrap"><p className="pnl__mono">carregando…</p></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pnl">
        <div className="pnl__wrap pnl__wrap--centro">
          <p className="pnl__mono">MIRANDA FARIA · ACESSO RESTRITO</p>
          <h1 className="pnl__h1">Painel operacional</h1>
          <p className="pnl__desc">KPIs, leads e qualidade do site. Entre com sua conta para abrir.</p>
          <button className="pnl__btn" onClick={() => navigateToLogin()}>Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pnl">
      <div className="pnl__wrap">
        <header className="pnl__topo">
          <div>
            <p className="pnl__mono">MIRANDA FARIA · FIRST-PARTY</p>
            <h1 className="pnl__h1">Painel operacional</h1>
            <p className="pnl__desc">
              {atualizado ? `atualizado ${fmtData(atualizado)}` : ""}
              {user?.email ? ` · ${user.email}` : ""}
            </p>
          </div>
          <div className="pnl__acoes">
            {PERIODOS.map((p) => (
              <button
                key={p.key}
                className={`pnl__chip ${periodo === p.key ? "pnl__chip--on" : ""}`}
                onClick={() => setPeriodo(p.key)}
              >
                {p.label}
              </button>
            ))}
            <button className="pnl__chip" onClick={() => carregar(periodo)}>↻ atualizar</button>
            <button className="pnl__chip pnl__chip--sair" onClick={() => logout()}>sair</button>
          </div>
        </header>

        {erro && <div className="pnl__erro">Falha ao ler dados: {erro}</div>}
        {carregando && <p className="pnl__mono">lendo medição…</p>}

        {kpi && !carregando && (
          <>
            <section className="pnl__cards">
              <div className="pnl__card"><p className="pnl__mono">SESSÕES</p><p className="pnl__num">{kpi.sessoes}</p><p className="pnl__notas">visitantes únicos</p></div>
              <div className="pnl__card"><p className="pnl__mono">PAGE VIEWS</p><p className="pnl__num">{kpi.views}</p><p className="pnl__notas">páginas vistas</p></div>
              <div className="pnl__card"><p className="pnl__mono">ENGAJADOS</p><p className="pnl__num">{kpi.engajou}</p><p className="pnl__notas">scroll profundo / 15s+</p></div>
              <div className="pnl__card"><p className="pnl__mono">CTAs</p><p className="pnl__num">{kpi.ctas}</p><p className="pnl__notas">WhatsApp e outros</p></div>
              <div className="pnl__card"><p className="pnl__mono">CONTATOS</p><p className="pnl__num">{contatosRecentes.filter((c) => periodOk(c, dados.janela)).length}</p><p className="pnl__notas">formulários no período</p></div>
              <div className="pnl__card"><p className="pnl__mono">DIAGNÓSTICOS</p><p className="pnl__num">{diagsRecentes.filter((c) => periodOk(c, dados.janela)).length}</p><p className="pnl__notas">completos no período</p></div>
            </section>

            <section className="pnl__grid">
              <div className="pnl__card">
                <p className="pnl__mono">FUNIL — {dados.janela === 1 ? "HOJE" : `${dados.janela} DIAS`}</p>
                <div className="pnl__funil">
                  <Linha rotulo="visitas" valor={kpi.sessoes} max={kpi.sessoes || 1} />
                  <Linha rotulo="engajou" valor={kpi.engajou} max={kpi.sessoes || 1} />
                  <Linha rotulo="CTA" valor={kpi.ctas} max={kpi.sessoes || 1} />
                  <Linha rotulo="contato/diag" valor={kpi.formSubmits + kpi.diagOk} max={kpi.sessoes || 1} />
                </div>
              </div>
              <div className="pnl__card">
                <p className="pnl__mono">QUALIDADE TÉCNICA</p>
                <p className="pnl__vit"><b>LCP</b> {kpi.lcp ? `${(kpi.lcp / 1000).toFixed(2)}s` : "—"} <b>CLS</b> {kpi.cls != null ? kpi.cls.toFixed(3) : "—"} <b>INP</b> {kpi.inp ? `${Math.round(kpi.inp)}ms` : "—"}</p>
                <p className="pnl__notas">medianas · erros JS no período: {kpi.errosJs}</p>
                <p className="pnl__notas">idiomas: {kpi.langs.map(([l, n]) => `${l} ${n}`).join(" · ")}</p>
              </div>
            </section>

            <section className="pnl__grid pnl__grid--3">
              <div className="pnl__card">
                <p className="pnl__mono">PÁGINAS TOP</p>
                <ul className="pnl__lista">
                  {kpi.paginas.map(([pg, n]) => <li key={pg}><span>{pg || "/"}</span><b>{n}</b></li>)}
                </ul>
              </div>
              <div className="pnl__card">
                <p className="pnl__mono">DE ONDE VEM</p>
                <ul className="pnl__lista">
                  {kpi.referrers.map(([rf, n]) => <li key={rf}><span>{String(rf).replace(/^https?:\/\//, "").slice(0, 28)}</span><b>{n}</b></li>)}
                </ul>
              </div>
              <div className="pnl__card">
                <p className="pnl__mono">DISPOSITIVOS</p>
                <ul className="pnl__lista">
                  {kpi.devices.map(([dv, n]) => <li key={dv}><span>{dv}</span><b>{n}</b></li>)}
                </ul>
              </div>
            </section>

            <section className="pnl__grid pnl__grid--2">
              <div className="pnl__card">
                <p className="pnl__mono">CONTATOS RECENTES</p>
                {contatosRecentes.length === 0 && <p className="pnl__notas">nenhum ainda — o formulário e o WhatsApp abrem a torneira.</p>}
                <ul className="pnl__leads">
                  {contatosRecentes.map((c) => (
                    <li key={c.id}>
                      <div className="pnl__lead-l1"><b>{c.nome || "—"}</b><span>{fmtData(c.created_date)}</span></div>
                      <div className="pnl__lead-l2">{c.empresa || ""} {c.tipo_projeto ? `· ${c.tipo_projeto}` : ""}</div>
                      <div className="pnl__lead-l2 pnl__lead-l2--cobre">{c.email || c.mensagem || ""}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pnl__card">
                <p className="pnl__mono">DIAGNÓSTICOS RECENTES</p>
                {diagsRecentes.length === 0 && <p className="pnl__notas">nenhum ainda — a rota /diagnostico gera um por conclusão.</p>}
                <ul className="pnl__leads">
                  {diagsRecentes.map((dg) => (
                    <li key={dg.id}>
                      <div className="pnl__lead-l1"><b>{dg.classificacao_icp || dg.dor || "—"}</b><span>{fmtData(dg.created_date)}</span></div>
                      <div className="pnl__lead-l2">
                        {dg.dor ? `dor: ${dg.dor}` : ""}
                        {dg.vertical_recomendada ? ` · ${dg.vertical_recomendada}` : ""}
                      </div>
                      <div className="pnl__lead-l2 pnl__lead-l2--cobre">
                        {(dg.vazamento_piso || dg.vazamento_teto) ? `faixa R$ ${dg.vazamento_piso}–${dg.vazamento_teto}` : ""}
                        {dg.contato ? ` · ${dg.contato}` : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </div>

      <style>{`
        .pnl { min-height: 100svh; background: var(--bone); color: var(--ink); padding: 48px 0 96px; }
        .pnl__wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
        .pnl__wrap--centro { text-align: center; padding-top: 18svh; }
        .pnl__mono { font-family: var(--font-mono, monospace); font-size: 11px; letter-spacing: 0.18em; color: var(--copper-text); margin: 0 0 6px; }
        .pnl__h1 { font-size: clamp(30px, 4.4vw, 44px); margin: 0; line-height: 1.04; }
        .pnl__desc { color: var(--ink-dim); font-size: 13px; margin: 8px 0 0; }
        .pnl__topo { display: flex; flex-wrap: wrap; gap: 18px; justify-content: space-between; align-items: flex-end; margin-bottom: 34px; }
        .pnl__acoes { display: flex; gap: 8px; flex-wrap: wrap; }
        .pnl__chip { font-family: inherit; font-size: 12px; padding: 7px 13px; border: 1px solid var(--ink); background: transparent; color: var(--ink); border-radius: 999px; cursor: pointer; }
        .pnl__chip--on { background: var(--ink); color: var(--bone); }
        .pnl__chip--sair { border-color: var(--ink-dim); color: var(--ink-dim); }
        .pnl__btn { font-family: inherit; font-size: 15px; padding: 13px 34px; background: var(--ink); color: var(--bone); border: 0; cursor: pointer; margin-top: 22px; border-radius: 999px; }
        .pnl__erro { border: 1px solid var(--copper); color: var(--copper-text); padding: 12px 16px; font-size: 13px; margin-bottom: 20px; }
        .pnl__cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 12px; }
        .pnl__grid { display: grid; gap: 12px; grid-template-columns: 1fr; margin-bottom: 12px; }
        .pnl__grid--2 { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
        .pnl__grid--3 { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        .pnl__card { border: 1px solid rgba(26,26,24,0.22); padding: 16px 18px; background: rgba(255,255,255,0.32); }
        .pnl__num { font-size: clamp(30px, 3.4vw, 40px); font-weight: 600; margin: 4px 0 2px; line-height: 1; }
        .pnl__notas { font-size: 11px; color: var(--ink-dim); margin: 0; }
        .pnl__vit { font-size: 14px; margin: 10px 0 6px; display: flex; gap: 14px; flex-wrap: wrap; align-items: baseline; }
        .pnl__vit b { color: var(--copper-text); font-size: 11px; letter-spacing: 0.08em; }
        .pnl__funil { display: flex; flex-direction: column; gap: 9px; margin-top: 14px; }
        .pnl__funil-barra { height: 10px; background: var(--copper); min-width: 2px; }
        .pnl__funil-linha { display: flex; align-items: center; gap: 10px; font-size: 12px; }
        .pnl__funil-linha span:first-child { min-width: 96px; color: var(--ink-dim); }
        .pnl__lista { list-style: none; margin: 12px 0 0; padding: 0; font-size: 13px; }
        .pnl__lista li { display: flex; justify-content: space-between; gap: 10px; padding: 5px 0; border-bottom: 1px solid rgba(26,26,24,0.10); }
        .pnl__leads { list-style: none; margin: 12px 0 0; padding: 0; }
        .pnl__leads li { padding: 10px 0; border-bottom: 1px solid rgba(26,26,24,0.10); }
        .pnl__lead-l1 { display: flex; justify-content: space-between; font-size: 14px; }
        .pnl__lead-l1 span { color: var(--ink-dim); font-size: 11px; }
        .pnl__lead-l2 { font-size: 12px; color: var(--ink-dim); margin-top: 2px; }
        .pnl__lead-l2--cobre { color: var(--copper-text); }
        @media (max-width: 700px) { .pnl { padding-top: 28px; } .pnl__topo { align-items: flex-start; } }
        html[data-skin="dark"] .pnl__card { background: rgba(255,255,255,0.045); border-color: rgba(245,241,234,0.16); }
        html[data-skin="dark"] .pnl__chip { color: var(--bone); border-color: rgba(245,241,234,0.4); }
        html[data-skin="dark"] .pnl__chip--on { background: var(--bone); color: var(--ink); }
      `}</style>
    </div>
  );
}

function Linha({ rotulo, valor, max }) {
  const pct = max > 0 ? Math.max(2, Math.round((valor / max) * 100)) : 0;
  return (
    <div className="pnl__funil-linha">
      <span>{rotulo}</span>
      <div className="pnl__funil-barra" style={{ width: `${pct}%` }} />
      <span><b>{valor}</b> · {pct}%</span>
    </div>
  );
}
