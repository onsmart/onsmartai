import EcosystemChart from "@/components/site/EcosystemChart";
import { CompanyLogo, type CompanyId } from "@/components/site/CompanyLogo";
import { useCmsCopy } from "@/components/cms/CmsProvider";
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
import {
  ButtonLink,
  Notice,
  PageHero,
  SectionHeading,
} from "@/components/site/Common";
import { companies } from "@/data/site";

const companyIcons = {
  tech: Building2,
  ai: Layers3,
  growth: BarChart3,
  robotics: Construction,
};

export default function Ecosystem() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

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
                  "O grupo conecta empresas com papéis distintos. Onde a documentação institucional ainda não está disponível, a página mantém o espaço preparado e sinaliza a pendência — sem presumir produtos ou diferenciais."
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
                  "Explore as marcas do Grupo Onsmart. As apresentações complementares serão incorporadas com os materiais oficiais."
                )}
              />
              <span className="ecosystem-companies-count">
                04
                <br />
                <small>{cmsText("empresas no mapa")}</small>
              </span>
            </div>

            <div className="ecosystem-company-sections">
              <article
                className="ecosystem-company-section ecosystem-company-section-tech"
                id="tech"
              >
                <div className="ecosystem-company-section-meta">
                  <span>01</span>
                  <Building2 size={19} aria-hidden="true" />
                </div>
                <div className="ecosystem-company-section-content">
                  <CompanyLogo id="tech" className="company-section-logo" />
                  <h2>{cmsText("Tecnologia desde 2014.")}</h2>
                  <p>
                    {cmsText(
                      "O registro público da Onsmart Tech é a fonte do marco de 2014. A apresentação da atuação, dos produtos e dos diferenciais será incorporada quando os materiais oficiais do grupo forem validados."
                    )}
                  </p>
                  <Notice>
                    {cmsText(
                      "Conteúdo institucional em atualização."
                    )}
                  </Notice>
                </div>
                <span className="ecosystem-company-state">
                  {cmsText("Onsmart Tech")}
                </span>
              </article>

              <article
                className="ecosystem-company-section ecosystem-company-section-ai"
                id="ai"
              >
                <div className="ecosystem-company-section-meta">
                  <span>02</span>
                  <Layers3 size={19} aria-hidden="true" />
                </div>
                <div className="ecosystem-company-section-content">
                  <CompanyLogo id="ai" className="company-section-logo" />
                  <h2>
                    {cmsText(
                      "Educação, consultoria e desenvolvimento personalizado."
                    )}
                  </h2>
                  <p>
                    {cmsText(
                      "A empresa responsável por educação, consultoria, serviços e soluções de inteligência artificial para o ambiente corporativo. O Ecossistema SON.IA conecta conversas, agentes, sistemas e processos em ações de negócio governadas."
                    )}
                  </p>
                  <div className="ecosystem-ai-pillars">
                    <span>{cmsText("Educação")}</span>
                    <span>{cmsText("Consultoria")}</span>
                    <span>{cmsText("Desenvolvimento")}</span>
                    <span>{cmsText("SON.IA")}</span>
                  </div>
                  <ButtonLink href={cmsHref("/servicos")} variant="outline">
                    {cmsText("Conhecer soluções")}
                  </ButtonLink>
                </div>
                <span className="ecosystem-company-state">
                  {cmsText("Educação, serviços e plataforma de IA")}
                </span>
              </article>

              <article
                className="ecosystem-company-section ecosystem-company-section-growth"
                id="growth"
              >
                <div className="ecosystem-company-section-meta">
                  <span>03</span>
                  <BarChart3 size={19} aria-hidden="true" />
                </div>
                <div className="ecosystem-company-section-content">
                  <CompanyLogo id="growth" className="company-section-logo" />
                  <h2>
                    {cmsText("Crescimento e novos negócios.")}
                  </h2>
                  <p>
                    {cmsText(
                      "Frente do Grupo Onsmart dedicada a acelerar resultados e expandir oportunidades com tecnologia."
                    )}
                  </p>
                </div>
                <span className="ecosystem-company-state">
                  {cmsText("Onsmart Growth")}
                </span>
              </article>

              <article
                className="ecosystem-company-section ecosystem-company-section-robotics"
                id="robotics"
              >
                <div className="ecosystem-company-section-meta">
                  <span>04</span>
                  <Construction size={19} aria-hidden="true" />
                </div>
                <div className="ecosystem-company-section-content">
                  <CompanyLogo id="robotics" className="company-section-logo" />
                  <h2>{cmsText("Em breve.")}</h2>
                  <p>
                    {cmsText(
                      "Uma frente reservada para o próximo capítulo do Grupo Onsmart, sem produtos, tecnologias ou prazo inventados."
                    )}
                  </p>
                  <div className="ecosystem-coming-soon">
                    <ShieldCheck size={20} aria-hidden="true" />
                    <span>{cmsText("Em breve")}</span>
                  </div>
                </div>
                <span className="ecosystem-company-state">
                  {cmsText("Em breve")}
                </span>
              </article>
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
