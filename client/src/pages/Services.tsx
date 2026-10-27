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
import type { Solution } from "@/data/site";
import { useSiteContent } from "@/data/site-content";
import { useSiteCopy } from "@/i18n/useSiteCopy";

type CategoryFilter = "Todas" | Solution["category"];

const categoryOrder: Solution["category"][] = [
  "Educação",
  "Serviços",
  "Plataforma",
];

export default function Services() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();
  const { t } = useSiteCopy();
  const { solutions, solutionHref, solutionCategoryLabel } = useSiteContent();

  const categoryMeta = useMemo(
    () => ({
      Educação: {
        id: "educacao",
        kicker: t("services.categoryEducationKicker"),
        title: t("services.categoryEducationTitle"),
        text: t("services.categoryEducationText"),
        icon: GraduationCap,
      },
      Serviços: {
        id: "servicos",
        kicker: t("services.categoryServicesKicker"),
        title: t("services.categoryServicesTitle"),
        text: t("services.categoryServicesText"),
        icon: BriefcaseBusiness,
      },
      Plataforma: {
        id: "plataforma",
        kicker: t("services.categoryPlatformKicker"),
        title: t("services.categoryPlatformTitle"),
        text: t("services.categoryPlatformText"),
        icon: Layers3,
      },
    }),
    [t]
  );

  const filterLabels: Record<CategoryFilter, string> = useMemo(
    () => ({
      Todas: t("services.filterAll"),
      Educação: t("services.filterEducation"),
      Serviços: t("services.filterServices"),
      Plataforma: t("services.filterPlatform"),
    }),
    [t]
  );

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Todas");
  const visibleSolutions = useMemo(
    () =>
      activeCategory === "Todas"
        ? solutions
        : solutions.filter(solution => solution.category === activeCategory),
    [activeCategory, solutions]
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
          aria-label={t("services.filterA11y")}
        >
          <div className="container services-filter-layout">
            <div className="services-filter-label">
              <span>{cmsText("Filtre por categoria")}</span>
              <small>{cmsText("ou percorra as três seções")}</small>
            </div>
            <div
              className="services-filter-controls"
              role="group"
              aria-label={t("services.categoriesA11y")}
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
                    {filterLabels[category]}
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
                                {solutionCategoryLabel(solution.category)}
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
