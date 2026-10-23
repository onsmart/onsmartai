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
import { companies, WHATSAPP } from "@/data/site";

const milestones = [
  {
    marker: "2014",
    title: "Marco empresarial da Onsmart Tech",
    text: "O registro público da Onsmart Tech indica 2014 como marco de origem empresarial. A relação formal entre essa cronologia e o Grupo Onsmart ainda aguarda validação interna.",
    source: "Fonte empresarial • confirmação institucional pendente",
  },
  {
    marker: "Próximo marco",
    title: "Cronologia preparada para receber fontes oficiais",
    text: "Outros capítulos da trajetória serão publicados somente depois da revisão documental do grupo.",
    source: "Sem data preenchida nesta fase",
  },
  {
    marker: "Estado atual",
    title: "Educação, consultoria e operação de IA",
    text: "A Onsmart.AI apresenta jornadas de educação, serviços e plataforma para empresas que desejam adotar inteligência artificial com governança.",
    source: "Posicionamento do briefing • sem cronologia adicional",
  },
];

const achievements = [
  {
    title: "Canal da Onsmart.AI",
    text: "Aproximadamente 103 mil inscritos no canal oficial do YouTube. A formulação “100 mil em 18 meses” segue pendente de comprovação documental.",
    icon: Building2,
  },
  {
    title: "Lançamento da SON.IA",
    text: "A plataforma foi apresentada em publicação oficial. A data editorial e os detalhes de lançamento permanecem pendentes.",
    icon: ShieldCheck,
  },
  {
    title: "Vôlei Adaptado de Paulínia",
    text: "Apoio registrado em fonte oficial, sem acrescentar placar, data ou resultado de campeonato ao protótipo.",
    icon: Landmark,
  },
];

export default function About() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

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
          <ButtonLink href={WHATSAPP} variant="text">
            {cmsText("Falar com especialista")}
          </ButtonLink>
        </div>
        <Notice>
          {cmsText(
            "12 anos é uma informação fornecida no briefing e aguarda validação institucional antes da publicação."
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
                  {cmsText("informada no briefing")}
                </span>
              </div>
              <div className="about-story-panel-copy">
                <span className="about-panel-kicker">
                  {cmsText("Validação necessária")}
                </span>
                <p>
                  {cmsText(
                    "A contagem e a cronologia completa serão confirmadas pelo Grupo antes de qualquer publicação definitiva."
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
              aria-label="Linha do tempo institucional"
            >
              {milestones.map((milestone, index) => (
                <article className="about-timeline-item" key={milestone.marker}>
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
                        <h3>{cmsText(milestone.title)}</h3>
                        <span className="timeline-expand">
                          {cmsText("Ver detalhes")}
                        </span>
                      </summary>
                      <p>{cmsText(milestone.text)}</p>
                      <span className="about-timeline-source">
                        {cmsText(milestone.source)}
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
              <figcaption>
                Ricardo Palomar · fotografia fornecida para esta página.
              </figcaption>
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
              {achievements.map(({ title, text, icon: Icon }, index) => (
                <article className="about-achievement" key={title}>
                  <div className="about-achievement-top">
                    <span>0{index + 1}</span>
                    <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                  </div>
                  {title === "Lançamento da SON.IA" && (
                    <SoniaCharacter className="achievement-sonia-character" />
                  )}
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <MissionSection about />
      </div>
    </div>
  );
}
