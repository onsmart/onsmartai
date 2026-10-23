import { CompanyLogo, type CompanyId } from "./CompanyLogo";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ArrowUpRight, ChevronDown, Menu, X, Globe2 } from "lucide-react";
import { companies, solutions, solutionHref } from "@/data/site";

export default function Header() {
  const [location] = useLocation();
  const search = useSearch();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const root = useRef<HTMLElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const previousRoute = useRef(`${location}?${search}`);
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
  return (
    <header className="site-header" ref={root}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Onsmart.AI — Home">
          <CompanyLogo id="ai" className="primary-logo" />
        </Link>
        <button
          className="mobile-toggle"
          type="button"
          aria-label={mobile ? "Fechar navegação" : "Abrir navegação"}
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
          aria-label="Navegação principal"
        >
          <Link href="/" aria-current={location === "/" ? "page" : undefined}>
            Home
          </Link>
          <Link
            href="/quem-somos"
            aria-current={location === "/quem-somos" ? "page" : undefined}
          >
            Quem Somos
          </Link>
          {["Serviços", "Ecossistema", "Conteúdo"].map(label => {
            const path =
              label === "Serviços"
                ? "/servicos"
                : label === "Ecossistema"
                  ? "/ecossistema"
                  : "/conteudo";
            return (
              <div className="nav-item" key={label}>
                <Link
                  href={path}
                  aria-current={location === path ? "page" : undefined}
                >
                  {label}
                </Link>
                <button
                  type="button"
                  className="nav-dropdown-toggle"
                  aria-label={`${open === label ? "Fechar" : "Abrir"} ${label}`}
                  aria-expanded={open === label}
                  aria-controls={`dropdown-${label}`}
                  onClick={e => toggle(label, e.currentTarget)}
                >
                  <ChevronDown size={13} />
                </button>
                {open === label && (
                  <div
                    id={`dropdown-${label}`}
                    className={`nav-dropdown ${label === "Serviços" ? "mega-menu" : ""}`}
                  >
                    {label === "Serviços" ? (
                      <>
                        <div className="mega-intro">
                          <p className="eyebrow">Do aprendizado à operação</p>
                          <h2>
                            Qual é o próximo passo
                            <br />
                            da sua empresa?
                          </h2>
                          <Link href="/servicos" className="mega-all">
                            Conhecer todas as soluções
                            <ArrowUpRight size={17} />
                          </Link>
                        </div>
                        <div className="mega-columns">
                          {(
                            ["Educação", "Serviços", "Plataforma"] as const
                          ).map(category => (
                            <div key={category}>
                              <h3>{category}</h3>
                              {solutions
                                .filter(s => s.category === category)
                                .map(s => (
                                  <Link
                                    key={s.slug}
                                    href={solutionHref(s.slug)}
                                  >
                                    <span>{s.title}</span>
                                    <ArrowUpRight size={13} />
                                  </Link>
                                ))}
                            </div>
                          ))}
                        </div>
                        <p className="mega-note">
                          Páginas comerciais disponíveis · condições em
                          validação.
                        </p>
                      </>
                    ) : label === "Ecossistema" ? (
                      <>
                        <Link href="/ecossistema">
                          Grupo Onsmart
                          <ArrowUpRight size={14} />
                        </Link>
                        {companies.map(c => (
                          <a href={`/ecossistema#${c.id}`} key={c.id}>
                            <span className="company-menu-brand">
                              <CompanyLogo id={c.id as CompanyId} />
                            </span>
                            {c.id === "robotics" ? (
                              <span className="tiny-tag">Em breve</span>
                            ) : (
                              <ArrowUpRight size={14} />
                            )}
                          </a>
                        ))}
                      </>
                    ) : (
                      <>
                        {[
                          { label: "Blog", href: "/conteudo?categoria=Blog" },
                          {
                            label: "Materiais gratuitos",
                            href: "/conteudo?categoria=Materiais%20gratuitos",
                          },
                          {
                            label: "YouTube",
                            href: "https://www.youtube.com/@onsmartai",
                          },
                          {
                            label: "Onsmart na mídia",
                            href: "/conteudo?categoria=Onsmart%20na%20m%C3%ADdia",
                          },
                          { label: "Cases", href: "/conteudo?categoria=Cases" },
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
            Contato
          </Link>
          <div className="nav-item language-nav">
            <button
              type="button"
              className="language-toggle"
              aria-expanded={open === "Idioma"}
              aria-controls="dropdown-idioma"
              onClick={e => toggle("Idioma", e.currentTarget)}
            >
              <Globe2 size={15} />
              PT
              <ChevronDown size={12} />
            </button>
            {open === "Idioma" && (
              <div
                id="dropdown-idioma"
                className="nav-dropdown language-dropdown"
              >
                <p>
                  <strong>Português</strong>
                  <span>Versão do protótipo</span>
                </p>
                <p>
                  English<span>Disponível na Fase 5</span>
                </p>
                <p>
                  Español<span>Disponível na Fase 5</span>
                </p>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
