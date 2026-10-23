import { useCmsCopy, useCmsDocument } from "@/components/cms/CmsProvider";
import { useLocation } from "wouter";
import { safeCmsUrl } from "@shared/cms";
import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  ShieldCheck,
  Workflow,
  MessageSquare,
  Database,
  Fingerprint,
  Zap,
  Eye,
} from "lucide-react";
import {
  processSteps,
  pillars,
  MISSION,
  WHATSAPP,
  type Editorial,
} from "@/data/site";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "text";
  className?: string;
}) {
  const { text: cmsText, href: cmsHref } = useCmsCopy();
  href = cmsHref(href);
  children = typeof children === "string" ? cmsText(children) : children;
  const classes = `button button-${variant} ${className}`;
  return href.startsWith("/") ? (
    <Link href={href} className={classes}>
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
  const { text: cmsText } = useCmsCopy();
  if (title !== MISSION) title = cmsText(title);
  if (text) text = cmsText(text);
  if (eyebrow) eyebrow = cmsText(eyebrow);
  return (
    <div className={`section-heading ${light ? "light" : ""}`}>
      {eyebrow && (
        <p className="eyebrow">
          <span />
          {eyebrow}
        </p>
      )}
      <h2>{title}</h2>
      {text && <p className="section-intro">{text}</p>}
    </div>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="notice">
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
export function PageHero({
  eyebrow,
  title,
  text,
  children,
  visual,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  children?: ReactNode;
  visual?: ReactNode;
}) {
  const { text: cmsText } = useCmsCopy();
  const [location] = useLocation();
  const document = useCmsDocument(location);
  title = cmsText(title);
  if (text) text = cmsText(text);
  eyebrow = cmsText(eyebrow);
  const cmsPhoto =
    document?.payload.imageUrl && safeCmsUrl(document.payload.imageUrl) ? (
      <img
        className="cms-page-image"
        src={safeCmsUrl(document.payload.imageUrl)}
        alt={document.payload.imageAlt}
        loading={visual ? "eager" : "lazy"}
      />
    ) : null;
  const copy = (
    <>
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h1>{title}</h1>
      {text && <p className="hero-intro">{text}</p>}
      {children}
      {!visual && cmsPhoto}
    </>
  );
  return (
    <section className={`page-hero ${visual ? "has-visual" : ""}`}>
      <div className="container">
        {visual ? <div className="page-hero-copy">{copy}</div> : copy}
        {visual && (
          <figure className="page-hero-visual">{cmsPhoto || visual}</figure>
        )}
        <div className="hero-rule">
          <span>ONSMART.AI</span>
          <span>Conhecimento. Estratégia. Operação.</span>
        </div>
      </div>
    </section>
  );
}
export function SoniaProcess({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  const icons = [MessageSquare, Database, Fingerprint, Zap, Eye];
  const ActiveIcon = icons[active];
  return (
    <div className={`sonia-process ${compact ? "compact" : ""}`}>
      <div className="process-top">
        <span className="process-label">
          <Workflow size={15} /> Fluxo operacional
        </span>
        <span className="concept-tag">Diagrama conceitual</span>
      </div>
      <div
        className="process-controls"
        role="group"
        aria-label="Etapas do processo SON.IA"
      >
        {processSteps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            aria-pressed={active === i}
            className={`process-step ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="step-number">0{i + 1}</span>
            <span>{s.title}</span>
            {i < 4 && <ArrowRight size={15} aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="process-detail" aria-live="polite">
        <div className="process-icon">
          <ActiveIcon size={27} strokeWidth={1.4} />
        </div>
        <div>
          <h3>{processSteps[active].title}</h3>
          <p>{processSteps[active].text}</p>
        </div>
        <span className="step-progress">0{active + 1} / 05</span>
      </div>
      <div className="process-bottom">
        <ShieldCheck size={16} />
        <span>Regras, permissões e supervisão humana em todo o fluxo.</span>
      </div>
    </div>
  );
}
export function MissionSection({ about = false }: { about?: boolean }) {
  const icons = [Check, ShieldCheck, Workflow];
  return (
    <section className="section mission-section">
      <div className="container">
        <SectionHeading eyebrow="Nossa missão" title={MISSION} />
        <div className="pillar-grid">
          {pillars.map((p, i) => {
            const Icon = icons[i];
            return (
              <div className="pillar" key={p.title}>
                <Icon size={30} strokeWidth={1.4} />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            );
          })}
        </div>
        <ButtonLink href={about ? WHATSAPP : "/quem-somos"} variant="outline">
          {about ? "Falar com especialista" : "Conheça nossa história"}
        </ButtonLink>
      </div>
    </section>
  );
}
export function EditorialCard({ item }: { item: Editorial }) {
  return (
    <article className="editorial-card">
      <Link
        href={`/previa/conteudo/${item.slug}`}
        className={`editorial-cover editorial-${item.slug}`}
        aria-label={`Ler: ${item.title}`}
      >
        {item.image ? (
          <img
            src={item.image}
            alt="Miniatura do vídeo oficial de lançamento da SON.IA"
            loading="lazy"
          />
        ) : (
          <div className="editorial-placeholder">
            <span>
              {item.slug === "esporte-e-inclusao" ? "COMUNIDADE" : "CONEXÕES"}
            </span>
            <span>Fotografia oficial pendente</span>
          </div>
        )}
        <span className="cover-arrow">
          <ArrowUpRight size={22} />
        </span>
      </Link>
      <div className="editorial-body">
        <span className="eyebrow">{item.type}</span>
        <h3>
          <Link href={`/previa/conteudo/${item.slug}`}>{item.title}</Link>
        </h3>
        <p>{item.excerpt}</p>
        <span className="editorial-status">{item.state}</span>
      </div>
    </article>
  );
}
