import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster"
import SiteAnalytics from "@/components/SiteAnalytics"
import ConsentBanner from "@/components/ConsentBanner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
/* ROUTE SPLITTING (Eduardo 17/09: otimizar mantendo qualidade): paginas
   de conteudo viram chunks lazy — so baixam no clique. Home fica EAGER
   (e o LCP). Bug historico do "blank ate recarregar" era falta de
   <Suspense> em volta das Routes (router legacy); agora existe e TODAS
   as rotas sao testadas com Playwright apos o build. */
const Work = React.lazy(() => import("@/pages/Work"));
const Practice = React.lazy(() => import("@/pages/Practice"));
const WorkCase = React.lazy(() => import("@/pages/WorkCase"));
const HowIWork = React.lazy(() => import("@/pages/HowIWork"));
const Servicos = React.lazy(() => import("@/pages/Servicos"));
const Insights = React.lazy(() => import("@/pages/Insights"));
const About = React.lazy(() => import("@/pages/About"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const PrivacyPolicy = React.lazy(() => import("@/pages/PrivacyPolicy"));
import Home from "@/pages/Home";
import TransitionCurtain from "@/components/layout/TransitionCurtain";
import LogoEasterEgg from "@/components/layout/LogoEasterEgg";









const Connect = React.lazy(() => import("@/pages/Connect"));
const Login = React.lazy(() => import("@/pages/Login"));
const Register = React.lazy(() => import("@/pages/Register"));
const ForgotPassword = React.lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("@/pages/ResetPassword"));
const OAuthConsent = React.lazy(() => import("@/pages/OAuthConsent"));
import SmoothScroll from "@/components/SmoothScroll";
import CopperCursor from "@/components/CopperCursor";
import MfProgress from "@/components/MfProgress";
import SiteLayout from "@/components/layout/SiteLayout";
import { LanguageProvider, useLang, detectLang, isLang } from "@/lib/i18n";
import { PRACTICE_SLUGS } from "@/content/copy";

/**
 * Casca das rotas de conteudo. O idioma vem do primeiro segmento da
 * URL — `/en/work`, `/pt/work` — e nao de hash nem de IP, para o
 * hreflang apontar para paginas reais (DECISIONS.md).
 */
/** Slug aposentado -> slug vigente, mantendo o idioma da URL. */
function OldSlugRedirect({ to }) {
  const { path } = useLang();
  return <Navigate to={path(to)} replace />;
}

const LangShell = () => {
  const { lang } = useParams();
  if (!isLang(lang)) return <Navigate to={`/${detectLang()}`} replace />;
  return (
    <LanguageProvider lang={lang}>
      <TransitionCurtain />
      <LogoEasterEgg />
      <SiteLayout />
      <ConsentBanner />
    </LanguageProvider>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <React.Suspense fallback={<div className="mf-route-load" aria-hidden="true" />}>
      <Routes>
      {/* Raiz decide o idioma uma vez e redireciona para a rota real. */}
      <Route path="/" element={<Navigate to={`/${detectLang()}`} replace />} />

      {/* Conteudo, por idioma. Segmentos estaticos como /login vencem
          o dinamico /:lang no ranking do React Router. */}
      <Route path="/:lang" element={<LangShell />}>
        <Route index element={<Home />} />

        {/* As tres verticais de pratica compartilham a mesma pagina,
            dirigida pelo slug. */}
        {PRACTICE_SLUGS.map((slug) => (
          <Route key={slug} path={slug} element={<Practice slug={slug} />} />
        ))}

        {/* Taxonomia antiga — quem tem link salvo chega na nova. */}
        <Route path="systems" element={<OldSlugRedirect to="gestao" />} />
        <Route path="business" element={<OldSlugRedirect to="desenvolvimento" />} />

        <Route path="servicos" element={<Servicos />} />
        <Route path="insights" element={<Insights />} />
        <Route path="work" element={<Work />} />
        <Route path="work/:slug" element={<WorkCase />} />
        <Route path="how-i-work" element={<HowIWork />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacidade" element={<PrivacyPolicy />} />
      </Route>

      {/* Paginas de infraestrutura Base44 — sem prefixo de idioma. */}
      <Route path="/privacidade" element={<PrivacyPolicy />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth/consent" element={<OAuthConsent />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
      </React.Suspense>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <SmoothScroll>
          <CopperCursor />
          <MfProgress />
          <Router>
            <ScrollToTop />
            {/* Dentro do Router: a rampa de fundo precisa recalcular na
                troca de rota, senao a pagina nova herda a profundidade
                da anterior ate o proximo tick. O SiteAnalytics tambem
                precisa do contexto de rotas (pageview por navegacao). */}
            <SiteAnalytics />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </SmoothScroll>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App