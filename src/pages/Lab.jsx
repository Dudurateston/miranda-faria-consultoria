import React from "react";
import { Navigate, useParams } from "react-router-dom";
import OpeningSequence from "@/components/OpeningSequence";
import { INTENSIDADES } from "@/components/StrataField";
import { LanguageProvider, detectLang } from "@/lib/i18n";

/**
 * PAGINA DESCARTAVEL — nao faz parte do site.
 *
 * Existe para uma decisao so: a intensidade do terreno da abertura. Ele
 * esta discreto de proposito, porque as duas tentativas anteriores de
 * por um elemento gerado como protagonista foram rejeitadas — mas
 * "discreto demais" e "forte demais" nao se decidem lendo codigo nem
 * olhando captura de tela. Se decidem rolando a pagina e passando o
 * dedo por cima.
 *
 * Entao as tres vivem lado a lado, na abertura de verdade, e a escolha
 * e feita com o site na frente.
 *
 * Escolhida a intensidade, ela vira o padrao em StrataField e ESTE
 * ARQUIVO SAI, junto da rota em App.jsx e da linha no robots.txt. Nao
 * entra no sitemap e nao e linkado de lugar nenhum do site.
 */

const VARIANTES = {
  a: { preset: "discreto", nome: "A · discreto", nota: "O que esta no ar hoje. Atmosfera; a tipografia manda." },
  b: { preset: "medio",    nome: "B · medio",    nota: "Camadas mais presentes, sondagem mais frequente, halo maior." },
  c: { preset: "forte",    nome: "C · forte",    nota: "Terreno bem visivel em repouso. Risco de virar protagonista." },
};

export default function Lab() {
  const { variant } = useParams();
  const v = VARIANTES[variant];
  if (!v) return <Navigate to="/lab/a" replace />;

  return (
    <LanguageProvider lang={detectLang()}>
      <div className="mf-lab">
        <OpeningSequence intensidade={v.preset} />

        {/* Barra de comparacao. Link normal, nao TransitionLink: aqui a
            troca precisa remontar o canvas, e uma transicao suave so
            atrapalharia a comparacao. */}
        <nav className="mf-lab__bar" aria-label="Intensidades">
          <span className="mf-lab__tag">Terreno · teste</span>
          {Object.entries(VARIANTES).map(([k, x]) => (
            <a
              key={k}
              href={`/lab/${k}`}
              className={`mf-lab__btn${k === variant ? " is-on" : ""}`}
              aria-current={k === variant ? "page" : undefined}
            >
              {x.nome}
            </a>
          ))}
          <span className="mf-lab__nota">{v.nota}</span>
        </nav>

        <style>{`
.mf-lab__bar{
  position:fixed;left:0;right:0;bottom:0;z-index:90;
  display:flex;flex-wrap:wrap;align-items:center;gap:0.6rem 1.4rem;
  padding:0.9rem var(--gutter);
  background:var(--ink);border-top:1px solid var(--copper);
}
.mf-lab__tag,.mf-lab__btn,.mf-lab__nota{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
}
.mf-lab__tag{color:rgba(245,241,234,0.62)}
.mf-lab__btn{
  color:rgba(245,241,234,0.84);text-decoration:none;
  padding-bottom:3px;border-bottom:1px solid transparent;
}
.mf-lab__btn.is-on{color:var(--bone);border-bottom-color:var(--copper)}
.mf-lab__nota{
  color:rgba(245,241,234,0.72);text-transform:none;letter-spacing:0.04em;
  margin-left:auto;max-width:46ch;
}
@media(max-width:859px){.mf-lab__nota{margin-left:0}}
        `}</style>
      </div>
    </LanguageProvider>
  );
}

export { VARIANTES, INTENSIDADES };
