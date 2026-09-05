import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import Practice from "@/pages/Practice";
import WorkCase from "@/pages/WorkCase";
import HowIWork from "@/pages/HowIWork";
import Servicos from "@/pages/Servicos";
import Insights from "@/pages/Insights";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Connect from "@/pages/Connect";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import OAuthConsent from "@/pages/OAuthConsent";
import SmoothScroll from "@/components/SmoothScroll";
import CopperCursor from "@/components/CopperCursor";
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
      <SiteLayout />
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
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <SmoothScroll>
          <CopperCursor />
          <Router>
            <ScrollToTop />
            {/* Dentro do Router: a rampa de fundo precisa recalcular na
                troca de rota, senao a pagina nova herda a profundidade
                da anterior ate o proximo tick. */}
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </SmoothScroll>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App