import { CompanyLogo, type CompanyId } from "./CompanyLogo";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ArrowUpRight, ChevronDown, Menu, X, Globe2 } from "lucide-react";
import { useSiteContent } from "@/data/site-content";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  localizedSolutionCategory,
  localizedSolutionTitle,
} from "@/i18n/site";
import { CMS_LOCALES } from "@shared/cms";
import { LOCALE_NAMES, type SiteLocale } from "@shared/locale";

const SECTION_KEYS = ["services", "ecosystem", "content"] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

const SECTION_PATH: Record<SectionKey, string> = {
  services: "/servicos",
  ecosystem: "/ecossistema",
  content: "/conteudo",
};

export default function Header() {
  const [location] = useLocation();
  const search = useSearch();
  const { ui, locale, setLocale, localeShort } = useLocale();
  const { companies, solutions, solutionHref } = useSiteContent();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const root = useRef<HTMLElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const previousRoute = useRef(`${location}?${search}`);

  const sectionLabel: Record<SectionKey, string> = {
    services: ui.nav.services,
    ecosystem: ui.nav.ecosystem,
    content: ui.nav.content,
  };

  useEffect(() => {
    const route = `${location}?${search}`;
    if (previousRoute.current !== route) {
      setOpen(null);
      setMobile(false);
      previousRoute.current = route;
    }
  }, [location, search]);
  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
        lastTrigger.current?.focus();
      }
    }
    function outside(e: MouseEvent) {
      const path = e.composedPath();
      if (
        !path.includes(root.current as EventTarget) ||
        path.some(node => node instanceof Element && node.tagName === "A")
      ) {
        setOpen(null);
        setMobile(false);
      }
    }
    document.addEventListener("keydown", close);
    document.addEventListener("click", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("click", outside);
    };
  }, []);
  function toggle(name: string, el: HTMLButtonElement) {
    lastTrigger.current = el;
    setOpen(open === name ? null : name);
  }
  function pickLocale(code: SiteLocale) {
    setLocale(code);
    setOpen(null);
  }

  return (
    <header className="site-header" ref={root}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Onsmart.AI — Home">
          <CompanyLogo id="ai" className="primary-logo" />
        </Link>
        <button
          className="mobile-toggle"
          type="button"
          aria-label={mobile ? ui.nav.closeNav : ui.nav.openNav}
          aria-expanded={mobile}
          aria-controls="main-navigation"
          onClick={e => {
            lastTrigger.current = e.currentTarget;
            setMobile(!mobile);
          }}
        >
          {mobile ? <X size={25} /> : <Menu size={25} />}
        </button>
        <nav
          id="main-navigation"
          className={mobile ? "main-nav mobile-open" : "main-nav"}
          aria-label={ui.nav.mainNav}
        >
          <Link href="/" aria-current={location === "/" ? "page" : undefined}>
            {ui.nav.home}
          </Link>
          <Link
            href="/quem-somos"
            aria-current={location === "/quem-somos" ? "page" : undefined}
          >
            {ui.nav.about}
          </Link>
          {SECTION_KEYS.map(section => {
            const path = SECTION_PATH[section];
            const label = sectionLabel[section];
            return (
              <div className="nav-item" key={section}>
                <Link
                  href={path}
                  aria-current={location === path ? "page" : undefined}
                >
                  {label}
                </Link>
                <button
                  type="button"
                  className="nav-dropdown-toggle"
                  aria-label={`${open === section ? ui.nav.closeSection : ui.nav.openSection} ${label}`}
                  aria-expanded={open === section}
                  aria-controls={`dropdown-${section}`}
                  onClick={e => toggle(section, e.currentTarget)}
                >
                  <ChevronDown size={13} />
                </button>
                {open === section && (
                  <div
                    id={`dropdown-${section}`}
                    className={`nav-dropdown ${section === "services" ? "mega-menu" : ""}`}
                  >
                    {section === "services" ? (
                      <>
                        <div className="mega-intro">
                          <p className="eyebrow">{ui.mega.eyebrow}</p>
                          <h2>
                            {ui.mega.titleLine1}
                            <br />
                            {ui.mega.titleLine2}
                          </h2>
                          <Link href="/servicos" className="mega-all">
                            {ui.mega.allSolutions}
                            <ArrowUpRight size={17} />
                          </Link>
                        </div>
                        <div className="mega-columns">
                          {(
                            ["Educação", "Serviços", "Plataforma"] as const
                          ).map(category => (
                            <div key={category}>
                              <h3>
                                {localizedSolutionCategory(category, locale)}
                              </h3>
                              {solutions
                                .filter(s => s.category === category)
                                .map(s => (
                                  <Link
                                    key={s.slug}
                                    href={solutionHref(s.slug)}
                                  >
                                    <span>
                                      {localizedSolutionTitle(
                                        s.slug,
                                        s.title,
                                        locale
                                      )}
                                    </span>
                                    <ArrowUpRight size={13} />
                                  </Link>
                                ))}
                            </div>
                          ))}
                        </div>
                        <p className="mega-note">{ui.mega.note}</p>
                      </>
                    ) : section === "ecosystem" ? (
                      <>
                        <Link href="/ecossistema">
                          {ui.mega.groupOnsmart}
                          <ArrowUpRight size={14} />
                        </Link>
                        {companies.map(c => (
                          <a href={`/ecossistema#${c.id}`} key={c.id}>
                            <span className="company-menu-brand">
                              <CompanyLogo id={c.id as CompanyId} />
                            </span>
                            {c.id === "robotics" ? (
                              <span className="tiny-tag">
                                {ui.mega.comingSoon}
                              </span>
                            ) : (
                              <ArrowUpRight size={14} />
                            )}
                          </a>
                        ))}
                      </>
                    ) : (
                      <>
                        {[
                          {
                            label: ui.contentMenu.blog,
                            href: "/conteudo?categoria=Blog",
                          },
                          {
                            label: ui.contentMenu.materials,
                            href: "/conteudo?categoria=Materiais%20gratuitos",
                          },
                          {
                            label: ui.contentMenu.youtube,
                            href: "https://www.youtube.com/@onsmartai",
                          },
                          {
                            label: ui.contentMenu.media,
                            href: "/conteudo?categoria=Onsmart%20na%20m%C3%ADdia",
                          },
                          {
                            label: ui.contentMenu.cases,
                            href: "/conteudo?categoria=Cases",
                          },
                        ].map(item =>
                          item.href.startsWith("http") ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={item.label}
                            >
                              {item.label}
                              <ArrowUpRight size={14} />
                            </a>
                          ) : (
                            <Link href={item.href} key={item.label}>
                              {item.label}
                              <ArrowUpRight size={14} />
                            </Link>
                          )
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/contato"
            aria-current={location === "/contato" ? "page" : undefined}
          >
            {ui.nav.contact}
          </Link>
          <div className="nav-item language-nav">
            <button
              type="button"
              className="language-toggle"
              aria-expanded={open === "language"}
              aria-controls="dropdown-idioma"
              onClick={e => toggle("language", e.currentTarget)}
            >
              <Globe2 size={15} />
              {localeShort}
              <ChevronDown size={12} />
            </button>
            {open === "language" && (
              <div
                id="dropdown-idioma"
                className="nav-dropdown language-dropdown"
              >
                {CMS_LOCALES.map(code => (
                  <button
                    key={code}
                    type="button"
                    className={
                      locale === code ? "language-option is-active" : "language-option"
                    }
                    aria-current={locale === code ? "true" : undefined}
                    onClick={() => pickLocale(code)}
                  >
                    <strong>{LOCALE_NAMES[code]}</strong>
                    {locale === code ? <span>{ui.nav.selected}</span> : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
