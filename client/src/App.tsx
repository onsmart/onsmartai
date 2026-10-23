import { useCms, useCmsDocument } from "./components/cms/CmsProvider";
import { CmsBanners, CmsBlocks } from "./components/cms/CmsBlocks";
import CmsArticle from "./pages/CmsArticle";
import Admin from "./pages/admin/Admin";
import { useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import Header from "./components/site/Header";
import Footer from "./components/site/Footer";
import Consent from "./components/site/Consent";
import SoniaDemo from "./components/site/SoniaDemo";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Ecosystem from "./pages/Ecosystem";
import Content from "./pages/Content";
import Contact from "./pages/Contact";
import Preview from "./pages/Preview";
import SolutionLanding from "./pages/SolutionLanding";
import Partners from "./pages/Partners";
import ErrorBoundary from "./components/ErrorBoundary";
import { metadata } from "./data/site";
import { commercialMetadata } from "./data/commercial";
function Router() {
  const [location] = useLocation();
  const { documents, ready } = useCms();
  const normalized = location
    .replace("/previa/solucao/", "/servicos/")
    .replace("/previa/parcerias/programa", "/parcerias");
  const known = Boolean(metadata[normalized] || commercialMetadata(normalized));
  if (
    ready &&
    known &&
    !documents.some(doc => doc.key === normalized && doc.locale === "pt-BR")
  )
    return (
      <section className="not-found">
        <div className="container">
          <h1>Página não disponível.</h1>
          <p>Esta página está despublicada na homologação.</p>
          <Link href="/" className="button button-outline">
            Voltar à Home
          </Link>
        </div>
      </section>
    );
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quem-somos" component={About} />
      <Route path="/servicos" component={Services} />
      <Route path="/ecossistema" component={Ecosystem} />
      <Route path="/conteudo" component={Content} />
      <Route path="/contato" component={Contact} />
      <Route path="/servicos/:slug" component={SolutionLanding} />
      <Route path="/parcerias" component={Partners} />
      <Route path="/conteudo/:slug" component={CmsArticle} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/*" component={Admin} />
      <Route path="/previa/:type/:slug" component={Preview} />
      <Route>
        <section className="not-found">
          <div className="container">
            <p className="eyebrow">404 · Página não encontrada</p>
            <h1>Vamos encontrar o seu próximo passo?</h1>
            <p>Esta página não faz parte do protótipo.</p>
            <Link className="button button-primary" href="/">
              Voltar à Home
            </Link>
          </div>
        </section>
      </Route>
    </Switch>
  );
}
export default function App() {
  const [location] = useLocation();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const { documents } = useCms();
  const normalized = location
    .replace("/previa/solucao/", "/servicos/")
    .replace("/previa/parcerias/programa", "/parcerias");
  const cmsDocument = documents.find(
    doc =>
      doc.locale === "pt-BR" &&
      (doc.key === normalized ||
        (normalized === `/conteudo/${doc.slug}` &&
          !["page", "landing", "banner"].includes(doc.kind)))
  );
  useEffect(() => {
    const info = (location.startsWith("/admin")
      ? {
          title: "CMS Onsmart.AI | Administração",
          description: "Painel administrativo protegido da Onsmart.AI.",
        }
      : undefined) ??
      (cmsDocument
        ? {
            title: cmsDocument.payload.seoTitle || cmsDocument.payload.title,
            description:
              cmsDocument.payload.seoDescription || cmsDocument.payload.summary,
          }
        : undefined) ??
      (normalized.startsWith("/conteudo/")
        ? {
            title: "Página não encontrada | Onsmart.AI",
            description:
              "Esta página não está disponível no ambiente de homologação.",
          }
        : undefined) ??
      commercialMetadata(location) ??
      metadata[location] ?? {
        title: "Prévia | Onsmart.AI",
        description:
          "Protótipo navegável Onsmart.AI. Destino provisório em homologação.",
      };
    document.title = info.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", info.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", info.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", info.description);
    for (const [name, content] of [
      ["twitter:title", info.title],
      ["twitter:description", info.description],
    ]) {
      document
        .querySelector(`meta[name="${name}"]`)
        ?.setAttribute("content", content);
    }
    if (window.location.hash) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView()
      );
    } else window.scrollTo(0, 0);
  }, [location, cmsDocument]);
  useEffect(() => {
    function scrollHash() {
      if (window.location.hash)
        document
          .getElementById(decodeURIComponent(window.location.hash.slice(1)))
          ?.scrollIntoView();
    }
    window.addEventListener("hashchange", scrollHash);
    return () => window.removeEventListener("hashchange", scrollHash);
  }, []);
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 }
    );
    document
      .querySelectorAll(
        ".section-heading, .journey-card, .product-card, .editorial-card, .pillar"
      )
      .forEach(node => {
        node.classList.add("motion-reveal");
        observer.observe(node);
      });
    return () => {
      observer.disconnect();
      document
        .querySelectorAll(".motion-reveal")
        .forEach(node => node.classList.remove("motion-reveal", "is-visible"));
    };
  }, [location]);
  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-link">
        Ir para o conteúdo
      </a>
      <Header />
      <main id="main-content">
        <CmsBanners />
        <Router />
        {cmsDocument?.kind === "page" &&
          cmsDocument.payload.blocks.length > 0 && (
            <section className="cms-extra-section">
              <div className="container">
                <CmsBlocks blocks={cmsDocument.payload.blocks} />
              </div>
            </section>
          )}
      </main>
      <Footer onPreferences={() => setPreferencesOpen(true)} />
      <Consent open={preferencesOpen} onOpenChange={setPreferencesOpen} />
      <SoniaDemo />
    </ErrorBoundary>
  );
}
