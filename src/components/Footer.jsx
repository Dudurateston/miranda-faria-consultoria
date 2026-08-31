import React from "react";
import Link from "@/components/TransitionLink";

import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { LINKEDIN_URL } from "@/lib/site";

export default function Footer() {
  const { lang, path } = useLang();
  const t = copy[lang];

  return (
    <>
      <footer className="mf-foot">
        <div className="mf-foot__inner">
          <p className="mf-foot__tag">{t.footer.tagline}</p>
          <nav className="mf-foot__links" aria-label={t.nav.home}>
            <Link to={path("work")} data-cursor="link" className="mf-foot__link">
              {t.nav.work}
            </Link>
            <Link to={path("how-i-work")} data-cursor="link" className="mf-foot__link">
              {t.nav.howIWork}
            </Link>
            <Link to={path("about")} data-cursor="link" className="mf-foot__link">
              {t.nav.about}
            </Link>
            <Link to={path("contact")} data-cursor="link" className="mf-foot__link">
              {t.nav.contact}
            </Link>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="mf-foot__link"
            >
              {t.footer.linkedin}
            </a>
            <Link to="/privacidade" data-cursor="link" className="mf-foot__link">
              {t.footer.privacy}
            </Link>
          </nav>
        </div>

        {/* Farol de cobre — o unico do site inteiro (DECISIONS.md). */}
        <span className="mf-foot__beacon" aria-hidden="true" />
      </footer>

      <style>{`
.mf-foot{
  position:relative;
  padding:clamp(3.5rem,7vh,5rem) var(--gutter) clamp(2.5rem,5vh,3.5rem);
  border-top:1px solid var(--color-divider);
}
.mf-foot__inner{
  max-width:var(--max-width-page);margin:0 auto;
  display:flex;flex-direction:column;gap:1.75rem;
}
@media(min-width:768px){
  .mf-foot__inner{flex-direction:row;align-items:center;justify-content:space-between;gap:2rem}
}
.mf-foot__tag{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-ghost);margin:0;
}
.mf-foot__links{display:flex;flex-wrap:wrap;gap:1rem 1.6rem}
.mf-foot__link{
  font-family:var(--font-mono);font-size:var(--text-label);
  letter-spacing:var(--tracking-label);text-transform:uppercase;
  color:var(--color-text-secondary);text-decoration:none;
  transition:color var(--duration-fast) var(--ease-in-out);
}
.mf-foot__link:hover{color:var(--color-accent)}

.mf-foot__beacon{
  position:absolute;right:var(--gutter);bottom:1.4rem;
  width:6px;height:6px;border-radius:50%;
  background:var(--copper);
  animation:mf-beacon 3.4s var(--ease-in-out) infinite;
}
@keyframes mf-beacon{
  0%,100%{opacity:0.25;transform:scale(1)}
  50%{opacity:1;transform:scale(1.35)}
}
@media(prefers-reduced-motion:reduce){
  .mf-foot__beacon{animation:none;opacity:0.7}
}
      `}</style>
    </>
  );
}
