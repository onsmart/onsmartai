import SitePhotography from "@/components/site/SitePhotography";
import { photoForSolution } from "@/data/photography";
import {
  SoniaPresentation,
  SoniaCharacter,
} from "@/components/site/BrandMedia";
import { useCmsDocument } from "@/components/cms/CmsProvider";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  BookOpen,
  Workflow,
  ShieldCheck,
  Target,
  Layers3,
  Check,
} from "lucide-react";
import {
  getCommercial,
  commercialWhatsapp,
  landingPath,
  type LandingData,
} from "@/data/commercial";
import { MARKETING_EMAIL } from "@shared/contact";
import { useSiteContent } from "@/data/site-content";
import { ButtonLink, Notice, SoniaProcess } from "@/components/site/Common";
import CommercialForm from "@/components/site/CommercialForm";
import { useLocale } from "@/i18n/LocaleProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import "./commercial.css";

export function CommercialFAQ({ data }: { data: LandingData }) {
  const { t } = useSiteCopy();
  return (
    <section className="commercial-section commercial-faq" id="commercial-faq">
      <div className="container commercial-two-col">
        <div>
          <p className="eyebrow">
            <span />
            {t("commercial.faqEyebrow")}
          </p>
          <h2>{t("commercial.faqTitle")}</h2>
          <p className="commercial-muted">{t("commercial.faqLead")}</p>
        </div>
        <div className="commercial-faq-list">
          {data.faqs.map((faq, index) => (
            <details key={faq.q} open={index === 0}>
              <summary>
                {faq.q}
                <Plus size={18} aria-hidden="true" />
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
export function CommercialClosing({
  data,
  selectedMode,
}: {
  data: LandingData;
  selectedMode?: string;
}) {
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  return (
    <section
      className="commercial-section commercial-contact-section"
      id="commercial-contact"
    >
      <div className="container commercial-contact-layout">
        <div className="commercial-contact-copy">
          <p className="eyebrow">
            <span />
            {t("commercial.closingEyebrow")}
          </p>
          <h2>
            {data.slug === "parcerias"
              ? t("commercial.closingTitlePartners")
              : t("commercial.closingTitleDefault")}
          </h2>
          <p>{t("commercial.closingBody")}</p>
          <a
            className="button button-primary"
            href={commercialWhatsapp(data, locale)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.slug === "parcerias"
              ? t("commercial.partnersCta")
              : data.cta}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a className="commercial-email" href={`mailto:${MARKETING_EMAIL}`}>
            {MARKETING_EMAIL}
          </a>
          <Notice>{t("commercial.whatsappNotice")}</Notice>
        </div>
        <CommercialForm
          key={data.slug}
          data={data}
          selectedMode={selectedMode}
        />
      </div>
    </section>
  );
}
function HeroVisual({ data }: { data: LandingData }) {
  const { t } = useSiteCopy();
  const { locale } = useLocale();
  const publishedPhoto = useCmsDocument(landingPath(data.slug), locale);
  if (data.slug === "sonia")
    return (
      <div className="commercial-hero-visual commercial-visual-platform has-sonia-media">
        <img
          src="/assets/sonia-logo.png"
          width="230"
          height="82"
          alt={t("commercialPage.soniaBrandAlt")}
        />
        <p>{t("commercial.soniaHeroTagline")}</p>
        <SoniaPresentation />
      </div>
    );
  return (
    <SitePhotography
      photoKey={photoForSolution(data.slug)}
      className="commercial-hero-visual"
      eager
      overrideUrl={publishedPhoto?.payload.imageUrl}
      overrideAlt={publishedPhoto?.payload.imageAlt}
    />
  );
}

export default function SolutionLanding({
  params,
}: {
  params: { slug: string };
}) {
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const { solutions, solutionCategoryLabel } = useSiteContent();
  const published = useCmsDocument(`/servicos/${params.slug}`, locale);
  const data = published
    ? (published.payload.fields as LandingData)
    : getCommercial(params.slug, locale);
  if (!data || params.slug === "parcerias")
    return (
      <section className="not-found">
        <div className="container">
          <p className="eyebrow">{t("commercial.solutionNotFoundEyebrow")}</p>
          <h1>{t("commercial.solutionNotFoundTitle")}</h1>
          <p>{t("commercial.solutionNotFoundBody")}</p>
          <ButtonLink href="/servicos">
            {t("commercial.exploreSolutions")}
          </ButtonLink>
        </div>
      </section>
    );
  const solution = solutions.find(s => s.slug === params.slug);
  if (!solution) return null;
  const related = solutions
    .filter(s => s.slug !== data.slug)
    .sort(
      (a, b) =>
        Number(b.category === solution.category) -
        Number(a.category === solution.category)
    )
    .slice(0, 3);
  return (
    <div
      className={`commercial-page commercial-${solution.category === "Educação" ? "education" : solution.category === "Serviços" ? "service" : "platform"}`}
    >
      <section className="commercial-hero">
        <div className="container">
          <nav
            className="commercial-breadcrumb"
            aria-label={t("a11y.breadcrumbs")}
          >
            <Link href="/">{t("commercial.homeBreadcrumb")}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/servicos">{t("commercialPage.servicesBreadcrumb")}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{solution.title}</span>
          </nav>
          <div className="commercial-hero-layout">
            <div className="commercial-hero-copy">
              <p className="eyebrow">
                <span />
                {data.eyebrow}
              </p>
              <h1>{data.heroTitle}</h1>
              <p className="commercial-lead">{data.lead}</p>
              <div className="commercial-hero-actions">
                <a className="button button-primary" href="#commercial-contact">
                  {data.cta}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                {data.slug === "sonia" ? (
                  <a
                    href="https://sonia.onsmart.ai/"
                    className="commercial-secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("commercialPage.visitOfficialSite")}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <a
                    href="#commercial-solution"
                    className="commercial-secondary"
                  >
                    {t("commercialPage.understandSolution")}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
              <p className="commercial-status">
                {t("commercialPage.commercialStatus")}
              </p>
            </div>
            <HeroVisual data={data} />
          </div>
        </div>
      </section>
      <nav
        className="commercial-subnav"
        aria-label={t("commercialPage.subnavSolution")}
      >
        <div className="container">
          <a href="#commercial-solution">{t("commercialPage.subnavSolution")}</a>
          <a href="#commercial-audience">{t("commercialPage.subnavAudience")}</a>
          <a href="#commercial-how">{t("commercialPage.subnavHow")}</a>
          <a href="#commercial-scope">{t("commercialPage.subnavScope")}</a>
          <a href="#commercial-faq">{t("commercialPage.subnavFaq")}</a>
          <a href="#commercial-contact">
            {t("commercialPage.subnavNext")}{" "}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </nav>
      <section className="commercial-section commercial-context">
        <div className="container commercial-two-col">
          <div>
            <p className="eyebrow">
              <span />
              {t("commercialPage.contextEyebrow")}
            </p>
            <h2>{data.contextTitle}</h2>
          </div>
          <div className="commercial-context-copy">
            <p>{data.context}</p>
            <div className="commercial-context-link">
              <Target size={20} aria-hidden="true" />
              <span>{t("commercialPage.contextLink")}</span>
            </div>
          </div>
        </div>
      </section>
      <section
        className="commercial-section commercial-solution"
        id="commercial-solution"
      >
        <div className="container">
          <div className="commercial-section-lead">
            <div>
              <p className="eyebrow">
                <span />
                {t("commercialPage.solutionEyebrow")}
              </p>
              <h2>{data.solutionTitle}</h2>
            </div>
            <p>{data.solutionText}</p>
          </div>
          <div className="commercial-goals">
            {data.goals.map((goal, i) => (
              <article key={goal.title}>
                <span className="commercial-number">0{i + 1}</span>
                <h3>{goal.title}</h3>
                <p>{goal.text}</p>
              </article>
            ))}
          </div>
          {data.slug === "academia" && (
            <div className="commercial-academy-conditions">
              <div>
                <span className="eyebrow">
                  {t("landingPage.academyConditionsEyebrow")}
                </span>
                <strong>{t("landingPage.academyPrice")}</strong>
                <p>{t("landingPage.academyInstallments")}</p>
              </div>
              <div>
                <strong>{t("landingPage.academyMonthsTitle")}</strong>
                <p>{t("landingPage.academyMonthsBody")}</p>
              </div>
              <div>
                <strong>{t("landingPage.academyFreeTitle")}</strong>
                <p>{t("landingPage.academyFreeBody")}</p>
              </div>
              <Notice>{t("landingPage.academyNotice")}</Notice>
            </div>
          )}
        </div>
      </section>
      <section
        className="commercial-section commercial-audience"
        id="commercial-audience"
      >
        <div className="container commercial-two-col">
          <div>
            <p className="eyebrow">
              <span />
              {t("commercialPage.audienceEyebrow")}
            </p>
            <h2>{t("landingPage.audienceTitle")}</h2>
            <p className="commercial-muted">{solution.audience}</p>
          </div>
          <ul className="commercial-audience-list">
            {data.audiences.map((audience, i) => (
              <li key={audience}>
                <span>0{i + 1}</span>
                <p>{audience}</p>
                <Check size={18} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        className="commercial-section commercial-how"
        id="commercial-how"
      >
        <div className="container">
          <div className="commercial-section-lead">
            <div>
              <p className="eyebrow">
                <span />
                {t("commercialPage.howEyebrow")}
              </p>
              <h2>
                {data.slug === "sonia"
                  ? t("landingPage.howTitleSonia")
                  : t("landingPage.howTitleDefault")}
              </h2>
            </div>
            <p>
              {data.slug === "sonia"
                ? t("landingPage.howLeadSonia")
                : t("landingPage.howLeadDefault")}
            </p>
          </div>
          {data.slug === "sonia" ? (
            <div className="commercial-sonia-process">
              <SoniaProcess />
            </div>
          ) : (
            <div className="commercial-flow">
              {data.flow.map((step, i) => (
                <article key={step.title}>
                  <span className="commercial-flow-number">0{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  <ArrowRight size={18} aria-hidden="true" />
                </article>
              ))}
            </div>
          )}
          <Notice>
            {data.slug === "academia"
              ? t("landingPage.noticeAcademia")
              : data.slug === "sonia"
                ? t("landingPage.noticeSonia")
                : t("landingPage.noticeDefault")}
          </Notice>
        </div>
      </section>
      <section
        className="commercial-section commercial-scope"
        id="commercial-scope"
      >
        <div className="container commercial-two-col">
          <div className="commercial-method">
            <p className="eyebrow">
              <span />
              {t("landingPage.methodologyEyebrow")}
            </p>
            <h2>{t("landingPage.methodologyTitle")}</h2>
            <p>{data.methodology}</p>
            <div className="commercial-scope-note">
              <ShieldCheck size={19} aria-hidden="true" />
              <p>{t("landingPage.methodologyNote")}</p>
            </div>
          </div>
          <div className="commercial-deliverables">
            <p className="eyebrow">
              <span />
              {t("landingPage.deliverablesEyebrow")}
            </p>
            <h3>{t("landingPage.deliverablesTitle")}</h3>
            <ul>
              {data.deliverables.map(item => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="commercial-scope-disclaimer">
              {t("landingPage.deliverablesDisclaimer")}
            </p>
          </div>
        </div>
      </section>
      <section className="commercial-section commercial-differences">
        <div className="container">
          <p className="eyebrow">
            <span />
            {t("landingPage.diffEyebrow")}
          </p>
          <h2>{t("landingPage.diffTitle")}</h2>
          <div className="commercial-difference-list">
            {data.differentiators.map((item, i) => (
              <article key={item.title}>
                <span>0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="commercial-cases">
        <div className="container">
          <Layers3 size={24} aria-hidden="true" />
          <div>
            <h2>{t("landingPage.casesTitle")}</h2>
            <p>{t("landingPage.casesBody")}</p>
          </div>
          <ButtonLink href="/conteudo?categoria=Cases" variant="outline">
            {t("landingPage.casesCta")}
          </ButtonLink>
        </div>
      </section>
      <CommercialFAQ data={data} />
      <CommercialClosing data={data} />
      <section className="commercial-section commercial-related">
        <div className="container">
          <div className="commercial-related-heading">
            <div>
              <p className="eyebrow">
                <span />
                {t("landingPage.journeyEyebrow")}
              </p>
              <h2>{t("landingPage.journeyTitle")}</h2>
            </div>
            <ButtonLink href="/servicos" variant="text">
              {t("landingPage.portfolioLink")}
            </ButtonLink>
          </div>
          <div className="commercial-related-list">
            {related.map(s => (
              <Link
                href={landingPath(s.slug)}
                key={s.slug}
                className="commercial-related-card"
              >
                {s.slug === "sonia" && (
                  <SoniaCharacter className="related-sonia-character" />
                )}
                <span>{solutionCategoryLabel(s.category)}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            ))}
          </div>
          <details className="commercial-review">
            <summary>{t("landingPage.reviewSummary")}</summary>
            <ul>
              {data.commercialNotices.map(note => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
