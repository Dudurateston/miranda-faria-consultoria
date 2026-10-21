import React, { useCallback } from "react";
import { Link } from "react-router-dom";

/**
 * Link interno do site — agora um <Link> puro do react-router.
 *
 * 21/10 (Eduardo, "elegante e breve"): a View Transitions API saiu daqui
 * — a TransitionCurtain (rodízio cobre/filete) é o ÚNICO sistema de
 * transição do site; as duas juntas poderiam sobrepor animações.
 * Mantida a mesma API (to, onClick, ...rest) para não tocar nas páginas.
 *
 * O clique segue nativo: a cortina intercepta na fase de captura (document),
 * previne o default e conduz a coreografia. Reduced-motion e cliques
 * modificados atravessam como links comuns.
 */
export default function TransitionLink({ to, children, onClick, ...rest }) {
  const handle = useCallback(
    (e) => {
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <Link to={to} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
