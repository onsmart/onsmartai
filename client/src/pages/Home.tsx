import HomePartnerships from "@/components/site/HomePartnerships";
import AcademyHomePhoto from "@/components/site/AcademyHomePhoto";
import heroVideo from "@/data/hero-video.json";
import SolutionShowcase from "@/components/site/SolutionShowcase";
import SitePhotography from "@/components/site/SitePhotography";
import HomeMediaStories from "@/components/site/HomeMediaStories";
import clientLogos from "@/data/client-logos.json";
import {
  SoniaPresentation,
  SoniaCharacter,
} from "@/components/site/BrandMedia";
import { CmsContentCard } from "./CmsArticle";
import { useCms, useCmsCopy } from "@/components/cms/CmsProvider";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Pause,
  Play,
  GraduationCap,
  Workflow,
  Layers3,
  Monitor,
  Youtube,
} from "lucide-react";
import { Link } from "wouter";
import { solutionHref } from "@/data/site";
import {
  ButtonLink,
  EditorialCard,
  MissionSection,
  Notice,
  SectionHeading,
  SoniaProcess,
} from "@/components/site/Common";
import { Newsletter } from "@/components/site/Forms";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { useLocale } from "@/i18n/LocaleProvider";
import { useWhatsappLink } from "@/i18n/site";

function Hero() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();
  const { t } = useSiteCopy();
  const whatsapp = useWhatsappLink();

  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    function update() {
      setReduced(query.matches);
      if (query.matches) video.current?.pause();
    }
    update();
    setMotionReady(true);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  async function toggle() {
    if (!video.current) return;
    if (video.current.paused) {
      try {
        await video.current.play();
      } catch {
        setPlaying(false);
      }
    } else video.current.pause();
  }
  return (
    <section className="home-hero">
      <div className="hero-media">
        <video
          key={heroVideo.desktopUrl}
          ref={video}
          muted
          loop
          playsInline
          autoPlay={motionReady && !reduced}
          preload="metadata"
          poster={cmsImage(heroVideo.posterUrl).url}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setPlaying(false)}
          aria-hidden="true"
        >
          <source
            src={heroVideo.mobileUrl}
            type="video/mp4"
            media="(max-width: 700px)"
          />
          <source src={heroVideo.desktopUrl} type="video/mp4" />
        </video>
      </div>
      <div className="hero-shade" />
      <div className="container hero-content">
        <p className="eyebrow">
          <span />
          {cmsText("Educação, serviços e plataforma de IA")}
        </p>
        <h1>
          {t("home.heroLine1")}
          <br />
          {t("home.heroLine2")}
          <br />
          <span>{t("home.heroLine3")}</span>
        </h1>
        <p className="hero-description">{t("home.heroSubtitle")}</p>
        <ButtonLink href={whatsapp}>
          {cmsText("Falar com especialista")}
        </ButtonLink>
      </div>
      <div className="container hero-bottom">
        <p>
          {cmsText(
            "Filmagem ilustrativa licenciada · não representa a equipe ou os sistemas da Onsmart.AI"
          )}
        </p>
        <div>
          <span>{cmsText("Conhecimento que vira operação")}</span>
          <button
            className="video-control"
            onClick={toggle}
            aria-label={
              playing ? t("a11y.pauseVideo") : t("a11y.playVideo")
            }
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
        </div>
      </div>
    </section>
  );
}
function Authority() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();
  const { t } = useSiteCopy();
  const [paused, setPaused] = useState(false);
  return (
    <section className="authority-section">
      <div className="container authority-heading">
        <div className="youtube-metric">
          <Youtube size={28} strokeWidth={1.5} />
          <strong>{cmsText("+100 mil")}</strong>
          <span>
            {cmsText("inscritos no YouTube")}
            <br />
            <small>{cmsText("alcançados em 18 meses*")}</small>
          </span>
        </div>
        <p>
          {cmsText("Empresas atendidas pela Onsmart.AI")}
          <br />
          <strong>{cmsText("ao longo de sua trajetória")}</strong>
        </p>
        <button
          className="carousel-toggle"
          onClick={() => setPaused(!paused)}
          aria-label={
            paused ? t("a11y.resumeCarousel") : t("a11y.pauseCarousel")
          }
        >
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>
      <div
        className={`client-marquee ${paused ? "paused" : ""}`}
        tabIndex={0}
        aria-label={t("a11y.clientLogos")}
      >
        <div className="client-track">
          {[0, 1].map(copy => (
            <div
              className="client-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {(
                clientLogos.items as {
                  name: string;
                  url: string;
                  variant?: string;
                }[]
              ).map(item => (
                <span
                  className={`client-logo ${item.variant === "white" ? "logo-white" : ""}`}
                  key={item.name}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="container">
        <Notice>
          {cmsText(
            "Marcas exibidas com autorização. A lista de clientes e métricas pode ser atualizada periodicamente."
          )}
        </Notice>
      </div>
    </section>
  );
}
function Journeys() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

  return (
    <section className="section journey-section">
      <div className="container">
        <SectionHeading
          eyebrow={cmsText("Por onde começar")}
          title={cmsText(
            "Inteligência artificial para você e para a sua empresa"
          )}
          text={cmsText(
            "Quem aprende leva a IA para dentro da empresa. Quem decide encontra aqui o caminho para implantar com governança."
          )}
        />
        <div className="journey-grid">
          <article className="journey-card personal">
            <div className="journey-card-top">
              <span>{cmsText("PARA VOCÊ")}</span>
              <BookOpen size={25} strokeWidth={1.3} />
            </div>
            <AcademyHomePhoto />
            <h3>
              {cmsText("Academia")}
              <br />
              {cmsText("Onsmart.AI")}
            </h3>
            <p>
              {cmsText(
                "Cursos gravados de IA para profissionais e gestores, do primeiro prompt à gestão de agentes."
              )}
            </p>
            <span className="journey-detail">
              {cmsText("Comece pelo curso introdutório gratuito.")}
            </span>
            <ButtonLink href={solutionHref("academia")} variant="text">
              {cmsText("Conhecer a Academia")}
            </ButtonLink>
          </article>
          <article className="journey-card business">
            <div className="journey-card-top">
              <span>{cmsText("PARA A SUA EMPRESA")}</span>
              <BriefcaseBusiness size={25} strokeWidth={1.3} />
            </div>
            <SitePhotography photoKey="workshop" className="journey-photo" />
            <h3>
              {cmsText("Da capacitação")}
              <br />
              {cmsText("à operação")}
            </h3>
            <p>
              {cmsText(
                "Palestras, capacitação de líderes, consultoria, desenvolvimento sob medida e a plataforma SON.IA, no ritmo e na etapa em que a sua empresa está."
              )}
            </p>
            <span className="journey-detail">
              {cmsText(
                "Licenças para equipes, in-company e projetos sob proposta."
              )}
            </span>
            <ButtonLink href={cmsHref("/servicos")} variant="text">
              {cmsText("Conhecer soluções para empresas")}
            </ButtonLink>
          </article>
        </div>
      </div>
    </section>
  );
}
function Platform() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

  return (
    <section className="section platform-section">
      <div className="container platform-layout">
        <div>
          <p className="eyebrow">
            <span />
            {cmsText("Conheça nossa plataforma")}
          </p>
          <img
            src={cmsImage("/assets/sonia-logo.png").url}
            alt="SON.IA"
            className="platform-logo"
            width="220"
            height="76"
            loading="lazy"
          />
          <h2>{cmsText("SON.IA - Plataforma Operacional Agêntica")}</h2>
          <p>
            {cmsText(
              "Conecta conversas, agentes, sistemas e processos para transformar interações contínuas em ações de negócio governadas."
            )}
          </p>
          <ButtonLink href={cmsHref("https://sonia.onsmart.ai/")}>
            {cmsText("Conhecer a SON.IA")}
          </ButtonLink>
          <Notice>
            {cmsText(
              "Ilustração da jornada operacional na SON.IA: conversas, agentes e processos conectados com governança."
            )}
          </Notice>
        </div>
        <div className="platform-visual">
          <div className="platform-visual-heading">
            <Monitor size={18} />
            <span>{cmsText("Inteligência conectada à operação")}</span>
          </div>
          <SoniaPresentation />
          <SoniaProcess />
          <div className="platform-quote">
            <span />
            {cmsText("Tudo o que você aprende nos nossos programas,")}
            <br />
            <strong>{cmsText("você coloca em operação aqui.")}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function Home() {
  const { locale } = useLocale();
  const { documents } = useCms();
  const publishedEditorial = documents.filter(
    doc =>
      (doc.locale === locale ||
        (locale !== "pt-BR" && doc.locale === "pt-BR")) &&
      !["page", "landing", "banner"].includes(doc.kind)
  );
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

  return (
    <>
      <Hero />
      <Authority />
      <Journeys />
      <SolutionShowcase />
      <MissionSection />
      <Platform />
      <HomePartnerships />
      <section className="section media-section">
        <div className="container">
          <div className="media-heading">
            <SectionHeading
              eyebrow={cmsText("Conhecimento, negócios e comunidade")}
              title={cmsText("Onsmart na mídia")}
            />
            <ButtonLink href={cmsHref("/conteudo")} variant="text">
              {cmsText("Todos os conteúdos")}
            </ButtonLink>
          </div>
          <HomeMediaStories />
        </div>
      </section>
      <Newsletter />
    </>
  );
}
