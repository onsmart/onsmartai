import EcosystemChart from "@/components/site/EcosystemChart";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import { useSiteContent } from "@/data/site-content";
import "./inner.css";
import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Layers3,
  Building2,
  Construction,
  Network,
  ShieldCheck,
} from "lucide-react";
import { ButtonLink, PageHero, SectionHeading } from "@/components/site/Common";
import { useSiteCopy } from "@/i18n/useSiteCopy";

const companyIcons = {
  tech: Building2,
  ai: Layers3,
  growth: BarChart3,
  robotics: Construction,
} as const;

export default function Ecosystem() {
  const { text: cmsText, href: cmsHref } = useCmsCopy();
  const { companies } = useSiteContent();
  const { t } = useSiteCopy();

  return (
    <div className="inner-page ecosystem-page">
      <PageHero
        eyebrow={cmsText("Ecossistema")}
        title={cmsText(
          "Um grupo conectado para levar conhecimento à operação."
        )}
        text={cmsText(
          "Conheça as empresas do Grupo Onsmart e a atuação da Onsmart.AI em educação, consultoria e soluções de inteligência artificial."
        )}
      >
        <div className="ecosystem-hero-actions">
          <a className="button button-primary" href="#ecosystem-diagram">
            {cmsText("Explorar o ecossistema ")}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <ButtonLink href={cmsHref("/contato")} variant="text">
            {cmsText("Falar com a equipe")}
          </ButtonLink>
        </div>
      </PageHero>

      <div className="inner-body">
        <section className="section ecosystem-overview">
          <div className="container ecosystem-overview-grid">
            <div>
              <p className="eyebrow">
                <span />
                {cmsText("Grupo Onsmart")}
              </p>
              <h2>
                {cmsText(
                  "Uma estrutura central para diferentes especialidades."
                )}
              </h2>
            </div>
            <div className="ecosystem-overview-copy">
              <p>
                {cmsText(
                  "O grupo conecta empresas com papéis distintos em tecnologia, inteligência artificial, crescimento e inovação. Cada marca tem site e proposta próprios — explore abaixo."
                )}
              </p>
              <a className="ecosystem-scroll-link" href="#tech">
                {cmsText("Ver empresas ")}
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="section ecosystem-diagram-section"
          id="ecosystem-diagram"
        >
          <div className="container">
            <div className="ecosystem-diagram-heading">
              <SectionHeading
                eyebrow={cmsText("Mapa do grupo")}
                title={cmsText(
                  "Selecione uma empresa para continuar a leitura."
                )}
                text={cmsText(
                  "O diagrama é conceitual. Os nós são links de âncora e funcionam por clique, toque e teclado."
                )}
              />
              <span className="ecosystem-diagram-label">
                <Network size={16} aria-hidden="true" />
                {cmsText(" Estrutura conectada")}
              </span>
            </div>
            <EcosystemChart />
          </div>
        </section>

        <section className="section ecosystem-companies-section">
          <div className="container">
            <div className="ecosystem-companies-lead">
              <SectionHeading
                eyebrow={cmsText("Empresas")}
                title={cmsText(
                  "Um ecossistema empresarial. Diferentes frentes de atuação."
                )}
                text={cmsText(
                  "Conheça cada marca do grupo, com descrição resumida e link para o site oficial quando disponível."
                )}
              />
              <span className="ecosystem-companies-count">
                04
                <br />
                <small>{cmsText("empresas no mapa")}</small>
              </span>
            </div>

            <div className="ecosystem-company-sections">
              {companies.map((company, index) => {
                const Icon = companyIcons[company.id];
                return (
                  <article
                    className={`ecosystem-company-section ecosystem-company-section-${company.id}`}
                    id={company.id}
                    key={company.id}
                  >
                    <div className="ecosystem-company-section-meta">
                      <span>0{index + 1}</span>
                      <Icon size={19} aria-hidden="true" />
                    </div>
                    <div className="ecosystem-company-section-content">
                      <CompanyLogo
                        id={company.id}
                        className="company-section-logo"
                      />
                      <h2>{company.headline}</h2>
                      <p>{company.text}</p>
                      {company.id === "ai" && (
                        <div className="ecosystem-ai-pillars">
                          <span>{cmsText("Educação")}</span>
                          <span>{cmsText("Consultoria")}</span>
                          <span>{cmsText("Desenvolvimento")}</span>
                          <span>{cmsText("SON.IA")}</span>
                        </div>
                      )}
                      <div className="ecosystem-company-actions">
                        {company.status === "live" && company.website && (
                          <a
                            className="button button-outline ecosystem-site-link"
                            href={cmsHref(company.website)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t("ecosystem.visitSite")} — ${company.name}`}
                          >
                            {t("ecosystem.visitSite")}
                            <ArrowUpRight size={16} aria-hidden="true" />
                          </a>
                        )}
                        {company.id === "ai" && (
                          <ButtonLink
                            href={cmsHref("/servicos")}
                            variant="outline"
                          >
                            {t("ecosystem.exploreSolutions")}
                          </ButtonLink>
                        )}
                        {company.status === "development" && (
                          <div className="ecosystem-coming-soon">
                            <ShieldCheck size={20} aria-hidden="true" />
                            <span>{t("ecosystem.inDevelopment")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="ecosystem-company-state">
                      {company.state}
                    </span>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section ecosystem-closing">
          <div className="container ecosystem-closing-panel">
            <div>
              <p className="eyebrow">
                <span />
                {cmsText("Da visão à prática")}
              </p>
              <h2>
                {cmsText(
                  "O ecossistema é uma jornada, não uma promessa isolada."
                )}
              </h2>
            </div>
            <ButtonLink href={cmsHref("/contato")} variant="primary">
              {cmsText("Conversar sobre a sua empresa")}
            </ButtonLink>
          </div>
        </section>
      </div>
    </div>
  );
}
