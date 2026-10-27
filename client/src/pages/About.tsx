import brandMedia from "@/data/brand-media.json";
import { CompanyLogo, type CompanyId } from "@/components/site/CompanyLogo";
import { RicardoPortrait, SoniaCharacter } from "@/components/site/BrandMedia";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import "./inner.css";
import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  CalendarDays,
  ExternalLink,
  Landmark,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  ButtonLink,
  MissionSection,
  Notice,
  PageHero,
  SectionHeading,
} from "@/components/site/Common";
import { useSiteContent } from "@/data/site-content";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { useWhatsappLink } from "@/i18n/site";

const achievementIcons = {
  youtube: Building2,
  "sonia-launch": ShieldCheck,
  volei: Landmark,
} as const;

export default function About() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();
  const { t } = useSiteCopy();
  const { companies, aboutMilestones, aboutAchievements } = useSiteContent();
  const whatsapp = useWhatsappLink();

  return (
    <div className="inner-page about-page">
      <PageHero
        eyebrow={cmsText("Quem somos")}
        visual={
          <img
            src={cmsImage(brandMedia.ricardoHero.url).url}
            alt={
              cmsImage(brandMedia.ricardoHero.url).alt ||
              brandMedia.ricardoHero.alt
            }
            width={brandMedia.ricardoHero.width}
            height={brandMedia.ricardoHero.height}
            loading="eager"
            decoding="async"
          />
        }
        title={cmsText(
          "Tecnologia, conhecimento e inovação para transformar a operação das empresas."
        )}
        text={cmsText(
          "Conheça a trajetória, a missão e as empresas que estruturam o Grupo Onsmart."
        )}
      >
        <div className="about-hero-actions">
          <a className="button button-primary" href="#about-story">
            {cmsText("Conhecer nossa história")}{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <ButtonLink href={whatsapp} variant="text">
            {cmsText("Falar com especialista")}
          </ButtonLink>
        </div>
        <Notice>
          {cmsText(
            "Mais de uma década de atuação do Grupo Onsmart em tecnologia e educação."
          )}
        </Notice>
      </PageHero>

      <div className="inner-body">
        <section className="section about-story" id="about-story">
          <div className="container about-story-grid">
            <div className="about-story-intro">
              <p className="eyebrow">
                <span />
                {cmsText("Nossa trajetória")}
              </p>
              <h2>{cmsText("Uma trajetória de tecnologia e conhecimento.")}</h2>
              <p>
                {cmsText(
                  "O Grupo Onsmart reúne diferentes frentes de atuação empresarial. A Onsmart.AI conecta educação, consultoria e soluções de inteligência artificial para aproximar conhecimento e operação."
                )}
              </p>
              <a className="about-scroll-link" href="#about-timeline">
                <span>{cmsText("Ver linha do tempo")}</span>
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
            <div className="about-story-panel">
              <div className="about-metric">
                <span className="about-metric-number">12</span>
                <span className="about-metric-label">
                  {cmsText("anos de trajetória")}
                  <br />
                  {cmsText("de experiência do grupo")}
                </span>
              </div>
              <div className="about-story-panel-copy">
                <span className="about-panel-kicker">
                  {cmsText("Grupo Onsmart")}
                </span>
                <p>
                  {cmsText(
                    "Educar, consultar e operar IA corporativa com clareza e governança."
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section about-timeline-section" id="about-timeline">
          <div className="container">
            <SectionHeading
              eyebrow={cmsText("Linha do tempo")}
              title={cmsText("Uma história em evolução.")}
              text={cmsText(
                "Explore os marcos disponíveis. A cronologia completa será incorporada após a revisão dos materiais oficiais."
              )}
            />
            <div
              className="about-timeline"
              aria-label={t("about.timelineA11y")}
            >
              {aboutMilestones.map((milestone, index) => (
                <article
                  className="about-timeline-item"
                  key={`${milestone.marker}-${index}`}
                >
                  <div className="about-timeline-marker" aria-hidden="true">
                    <span>0{index + 1}</span>
                  </div>
                  <div className="about-timeline-copy">
                    <details open={index === 0}>
                      <summary>
                        <span className="about-timeline-year">
                          {milestone.marker === "2014" && (
                            <CalendarDays size={15} aria-hidden="true" />
                          )}
                          {milestone.marker}
                        </span>
                        {milestone.marker === "2014" && (
                          <CompanyLogo
                            id="tech"
                            className="timeline-company-logo"
                          />
                        )}
                        <h3>{milestone.title}</h3>
                        <span className="timeline-expand">
                          {cmsText("Ver detalhes")}
                        </span>
                      </summary>
                      <p>{milestone.text}</p>
                      <span className="about-timeline-source">
                        {milestone.source}
                      </span>
                    </details>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-companies-section">
          <div className="container">
            <div className="about-section-lead">
              <SectionHeading
                eyebrow={cmsText("Grupo Onsmart")}
                title={cmsText(
                  "Empresas conectadas por uma visão de futuro responsável."
                )}
                text={cmsText(
                  "O ecossistema reúne marcas com papéis distintos. Cada apresentação respeita o material institucional disponível."
                )}
              />
              <div className="about-section-index" aria-hidden="true">
                03<span>{cmsText("/04")}</span>
              </div>
            </div>
            <div className="about-companies-list">
              {companies.map((company, index) => (
                <article
                  className={`about-company-row about-company-row-${company.id}`}
                  key={company.id}
                >
                  <span className="about-company-number">0{index + 1}</span>
                  <div className="about-company-name">
                    <h3>
                      <CompanyLogo id={company.id as CompanyId} />
                    </h3>
                  </div>
                  <div className="about-company-copy">
                    <span>{cmsText(company.state)}</span>
                    <p>{cmsText(company.text)}</p>
                  </div>
                  <ArrowUpRight
                    className="about-company-arrow"
                    size={20}
                    aria-hidden="true"
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-leadership-section">
          <div className="container about-leadership-grid">
            <figure className="about-portrait has-photo">
              <RicardoPortrait />
              <figcaption>{t("about.portraitCaption")}</figcaption>
            </figure>
            <div className="about-leadership-copy">
              <p className="eyebrow">
                <span />
                {cmsText("Liderança")}
              </p>
              <h2>{cmsText("Ricardo Palomar")}</h2>
              <p className="about-leadership-role">
                {cmsText("CEO / Founder")}
              </p>
              <p>
                {cmsText(
                  "Ricardo Palomar é identificado publicamente como CEO da Onsmart e do Onsmart Group. A fotografia foi fornecida para esta página. A biografia executiva completa permanece pendente de validação oficial."
                )}
              </p>
              <div className="about-leadership-links">
                <a
                  href={cmsHref("https://br.linkedin.com/in/ricardo-palomar")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cmsText("LinkedIn ")}
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
                <a
                  href={cmsHref("https://www.instagram.com/ricardompalomar/")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cmsText("Instagram ")}
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              </div>
              <Notice>
                {cmsText(
                  "Fotografia fornecida. Biografia executiva complementar sujeita a validação institucional."
                )}
              </Notice>
            </div>
          </div>
        </section>

        <section className="section about-achievements-section">
          <div className="container">
            <SectionHeading
              eyebrow={cmsText("Registros e conquistas")}
              title={cmsText("Conhecimento que alcança pessoas e empresas.")}
              text={cmsText(
                "Conteúdo, tecnologia e participação na comunidade fazem parte dos registros apresentados nesta página."
              )}
            />
            <div className="about-achievements-grid">
              {aboutAchievements.map((item, index) => {
                const Icon = achievementIcons[item.id];
                return (
                  <article className="about-achievement" key={item.id}>
                    <div className="about-achievement-top">
                      <span>0{index + 1}</span>
                      <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                    </div>
                    {item.id === "sonia-launch" && (
                      <SoniaCharacter className="achievement-sonia-character" />
                    )}
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <MissionSection about />
      </div>
    </div>
  );
}
