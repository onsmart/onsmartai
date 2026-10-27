import { useCms } from "./components/cms/CmsProvider";
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
import Legal from "./pages/Legal";
import SolutionLanding from "./pages/SolutionLanding";
import Partners from "./pages/Partners";
import ErrorBoundary from "./components/ErrorBoundary";
import { metadata } from "./data/site";
import { commercialMetadata } from "./data/commercial";
import { useLocale } from "./i18n/LocaleProvider";
import { useSiteCopy } from "./i18n/useSiteCopy";
import {
  defaultSiteMeta,
  siteMetadata,
} from "./i18n/site-metadata";
import { cmsPageIsAvailable, resolveCmsPageDocument } from "@shared/cms-page";

function LegalLegacyRedirect({ slug }: { slug: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (slug === "cookies") setLocation("/legal/privacidade#cookies");
    else if (slug === "privacidade" || slug === "termos")
      setLocation(`/legal/${slug}`);
    else setLocation("/");
  }, [slug, setLocation]);
  return null;
}

function Router() {
  const [location] = useLocation();
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const { documents, ready } = useCms();
  const normalized = location
    .replace("/previa/solucao/", "/servicos/")
    .replace("/previa/parcerias/programa", "/parcerias");
  const known = Boolean(
    siteMetadata(normalized, locale) ||
      metadata[normalized] ||
      commercialMetadata(normalized, locale)
  );
  if (
    ready &&
    known &&
    !cmsPageIsAvailable(documents, normalized, locale)
  )
    return (
      <section className="not-found">
        <div className="container">
          <h1>{t("errors.pageUnavailableTitle")}</h1>
          <p>{t("errors.pageUnavailableBody")}</p>
          <Link href="/" className="button button-outline">
            {t("errors.backHome")}
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
      <Route path="/legal/:slug" component={Legal} />
      <Route path="/previa/legal/:slug">
        {params => <LegalLegacyRedirect slug={params.slug} />}
      </Route>
      <Route path="/admin" component={Admin} />
      <Route path="/admin/*" component={Admin} />
      <Route path="/previa/:type/:slug" component={Preview} />
      <Route>
        <NotFoundRoute />
      </Route>
    </Switch>
  );
}

function NotFoundRoute() {
  const { t } = useSiteCopy();
  return (
    <section className="not-found">
      <div className="container">
        <p className="eyebrow">{t("errors.notFoundEyebrow")}</p>
        <h1>{t("errors.notFoundTitle")}</h1>
        <p>{t("errors.notFoundBody")}</p>
        <Link className="button button-primary" href="/">
          {t("errors.backHome")}
        </Link>
      </div>
    </section>
  );
}

export default function App() {
  const [location] = useLocation();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const { documents } = useCms();
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const normalized = location
    .replace("/previa/solucao/", "/servicos/")
    .replace("/previa/parcerias/programa", "/parcerias");
  const cmsDocument =
    resolveCmsPageDocument(documents, normalized, locale) ??
    documents.find(
      doc =>
        (doc.locale === locale ||
          (locale !== "pt-BR" && doc.locale === "pt-BR")) &&
        normalized === `/conteudo/${doc.slug}` &&
        !["page", "landing", "banner"].includes(doc.kind)
    );
  useEffect(() => {
    const info = (location.startsWith("/admin")
      ? {
          title: t("errors.adminTitle"),
          description: t("errors.adminDescription"),
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
            title: t("errors.articleNotFoundTitle"),
            description: t("errors.articleNotFoundDescription"),
          }
        : undefined) ??
      commercialMetadata(location, locale) ??
      siteMetadata(location, locale) ??
      metadata[location] ??
      defaultSiteMeta(locale);
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
  }, [location, cmsDocument, locale, t]);
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
        {t("errors.skipToContent")}
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
