import SitePhotography from "@/components/site/SitePhotography";
import { SoniaCharacter } from "@/components/site/BrandMedia";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import "./inner.css";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  Layers3,
} from "lucide-react";
import {
  ButtonLink,
  Notice,
  PageHero,
  SectionHeading,
} from "@/components/site/Common";
import { solutionHref, solutions, type Solution } from "@/data/site";

type CategoryFilter = "Todas" | Solution["category"];

const categoryMeta: Record<
  Solution["category"],
  {
    id: string;
    kicker: string;
    title: string;
    text: string;
    icon: typeof GraduationCap;
  }
> = {
  Educação: {
    id: "educacao",
    kicker: "01 / Educação",
    title: "Aprender para decidir melhor.",
    text: "Jornadas para aproximar pessoas, lideranças e empresas das possibilidades reais da IA corporativa.",
    icon: GraduationCap,
  },
  Serviços: {
    id: "servicos",
    kicker: "02 / Serviços",
    title: "Estruturar a mudança na operação.",
    text: "Consultoria e desenvolvimento para transformar desafios empresariais em caminhos de implementação.",
    icon: BriefcaseBusiness,
  },
  Plataforma: {
    id: "plataforma",
    kicker: "03 / Plataforma",
    title: "Conectar inteligência a processos governados.",
    text: "A SON.IA reúne conversas, agentes, sistemas e processos em uma plataforma de IA operacional.",
    icon: Layers3,
  },
};

const categoryOrder: Solution["category"][] = [
  "Educação",
  "Serviços",
  "Plataforma",
];

function solutionsFor(category: CategoryFilter) {
  return category === "Todas"
    ? solutions
    : solutions.filter(solution => solution.category === category);
}

export default function Services() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Todas");
  const visibleSolutions = useMemo(
    () => solutionsFor(activeCategory),
    [activeCategory]
  );
  useEffect(() => {
    function revealAnchor() {
      const id = window.location.hash.slice(1);
      if (["educacao", "servicos", "plataforma"].includes(id)) {
        setActiveCategory("Todas");
        requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView()
        );
      }
    }
    window.addEventListener("hashchange", revealAnchor);
    return () => window.removeEventListener("hashchange", revealAnchor);
  }, []);

  return (
    <div className="inner-page services-page">
      <PageHero
        eyebrow={cmsText("Serviços")}
        visual={<SitePhotography photoKey="workshop" eager />}
        title={cmsText(
          "Da estratégia à operação: soluções de IA para cada etapa da sua empresa."
        )}
        text={cmsText(
          "Educação, consultoria, desenvolvimento personalizado e tecnologia para ajudar sua empresa a compreender, implementar e escalar inteligência artificial com governança."
        )}
      >
        <div className="services-hero-actions">
          <a className="button button-primary" href="#services-portfolio">
            {cmsText("Explorar soluções ")}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <ButtonLink href={cmsHref("/contato")} variant="text">
            {cmsText("Conversar sobre um próximo passo")}
          </ButtonLink>
        </div>
      </PageHero>

      <div className="inner-body">
        <section className="section services-intro" id="services-portfolio">
          <div className="container services-intro-grid">
            <div>
              <p className="eyebrow">
                <span />
                {cmsText("Portfólio por jornada")}
              </p>
              <h2>{cmsText("Comece onde a sua empresa está.")}</h2>
            </div>
            <div className="services-intro-copy">
              <p>
                {cmsText(
                  "O portfólio foi organizado para que diferentes perfis encontrem um primeiro passo possível — da formação ao desenho de processos e à operação conectada."
                )}
              </p>
              <a className="services-scroll-link" href="#educacao">
                <span>{cmsText("Ir para Educação")}</span>
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="services-filter-section"
          aria-label="Filtro de soluções"
        >
          <div className="container services-filter-layout">
            <div className="services-filter-label">
              <span>{cmsText("Filtre por categoria")}</span>
              <small>{cmsText("ou percorra as três seções")}</small>
            </div>
            <div
              className="services-filter-controls"
              role="group"
              aria-label="Categorias do portfólio"
            >
              {(["Todas", ...categoryOrder] as CategoryFilter[]).map(
                category => (
                  <button
                    type="button"
                    key={category}
                    className={`services-filter-button ${activeCategory === category ? "is-active" : ""}`}
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        <div className="services-catalog" aria-live="polite">
          {categoryOrder.map(category => {
            const meta = categoryMeta[category];
            const categorySolutions = visibleSolutions.filter(
              solution => solution.category === category
            );
            if (categorySolutions.length === 0) return null;
            const Icon = meta.icon;

            return (
              <section
                className={`section services-category services-category-${meta.id}`}
                id={meta.id}
                key={category}
              >
                <div className="container">
                  <div className="services-category-header">
                    <div className="services-category-title">
                      <span className="services-category-icon">
                        <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="eyebrow">
                          <span />
                          {meta.kicker}
                        </p>
                        <h2>{meta.title}</h2>
                      </div>
                    </div>
                    <p className="services-category-text">{meta.text}</p>
                  </div>

                  <div className="services-solution-list">
                    {categorySolutions.map((solution, solutionIndex) => {
                      const globalIndex =
                        solutions.findIndex(
                          item => item.slug === solution.slug
                        ) + 1;
                      return (
                        <article
                          className={`services-solution services-solution-${solutionIndex % 2 === 0 ? "light" : "soft"}`}
                          id={`solution-${solution.slug}`}
                          key={solution.slug}
                        >
                          <div
                            className="services-solution-index"
                            aria-hidden="true"
                          >
                            {String(globalIndex).padStart(2, "0")}
                          </div>
                          <div className="services-solution-main">
                            {solution.slug === "sonia" && (
                              <SoniaCharacter className="service-sonia-character" />
                            )}
                            <div className="services-solution-title-row">
                              <h3>{solution.title}</h3>
                              <span className="services-solution-category">
                                {solution.category}
                              </span>
                            </div>
                            <p className="services-solution-description">
                              {solution.description}
                            </p>
                            <div className="services-solution-details">
                              <div>
                                <span>{cmsText("Para quem é")}</span>
                                <p>{solution.audience}</p>
                              </div>
                              <div>
                                <span>{cmsText("Como se aplica")}</span>
                                <p>{solution.detail}</p>
                              </div>
                            </div>
                            {solution.slug === "academia" && (
                              <div className="services-academy-note">
                                <strong>{cmsText("A partir de R$349")}</strong>
                                <span>
                                  {cmsText(
                                    "ou 12x de R$29,08 · 12 meses de acesso"
                                  )}
                                </span>
                                <small>
                                  {cmsText(
                                    "Curso introdutório gratuito — confirmação comercial pendente."
                                  )}
                                </small>
                              </div>
                            )}
                          </div>
                          <div className="services-solution-cta">
                            <ButtonLink
                              href={solutionHref(solution.slug)}
                              variant="outline"
                              className="services-solution-link"
                            >
                              {solution.cta}
                            </ButtonLink>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <section className="section services-closing">
          <div className="container services-closing-panel">
            <div>
              <p className="eyebrow">
                <span />
                {cmsText("Próximo passo")}
              </p>
              <h2>
                {cmsText("Uma conversa clara antes de escolher a solução.")}
              </h2>
              <p>
                {cmsText(
                  "Conte o estágio da sua empresa. A próxima etapa comercial será definida com contexto, sem promessas genéricas."
                )}
              </p>
            </div>
            <ButtonLink href={cmsHref("/contato")} variant="primary">
              {cmsText("Falar com a equipe")}
            </ButtonLink>
          </div>
          <div className="container services-closing-notice">
            <Notice>
              {cmsText(
                "Escopo, investimento e cronograma são definidos em proposta comercial personalizada."
              )}
            </Notice>
          </div>
        </section>
      </div>
    </div>
  );
}
