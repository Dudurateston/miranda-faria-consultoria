import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";

/**
 * Link que atravessa páginas com a View Transitions API.
 *
 * Por que não a prop `viewTransition` do React Router: ela só funciona
 * com o data router (`createBrowserRouter`), e migrar para ele mexeria
 * no fluxo de autenticação do Base44 que já está de pé. Este componente
 * resolve o mesmo com quinze linhas e sem tocar no roteador.
 *
 * O `flushSync` é obrigatório: `startViewTransition` tira uma foto do
 * DOM, roda a função e tira outra. Sem ele o React agenda a atualização
 * para depois, as duas fotos saem iguais e a transição não acontece.
 *
 * Degrada sozinho: navegador sem suporte navega normal, e quem prefere
 * menos movimento também.
 */
export default function TransitionLink({ to, children, onClick, ...rest }) {
  const navigate = useNavigate();

  const handle = useCallback(
    (e) => {
      onClick?.(e);
      if (e.defaultPrevented) return;

      // Deixa passar o comportamento nativo do navegador: abrir em nova
      // aba, nova janela, salvar. Interceptar isso irrita.
      if (
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
        e.button !== 0 ||
        rest.target === "_blank"
      ) {
        return;
      }

      const supported =
        typeof document !== "undefined" &&
        typeof document.startViewTransition === "function" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!supported) return; // segue como link normal

      e.preventDefault();
      document.startViewTransition(() => {
        flushSync(() => navigate(to));
      });
    },
    [navigate, onClick, to, rest.target]
  );

  return (
    <Link to={to} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
