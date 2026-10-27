import SitePhotography from "@/components/site/SitePhotography";
import { useCmsDocument } from "@/components/cms/CmsProvider";
import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  ArrowRight,
  Network,
  UserRound,
  Building2,
  Layers3,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";
import { getCommercial, type LandingData } from "@/data/commercial";
import { useLocale } from "@/i18n/LocaleProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { ButtonLink, Notice } from "@/components/site/Common";
import { CommercialFAQ, CommercialClosing } from "./SolutionLanding";
import "./commercial.css";
const modeIcons = [UserRound, Building2, Layers3];
export default function Partners() {
  const [active, setActive] = useState(0);
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const modes = [
    { name: t("commercial.modeAgent"), icon: modeIcons[0] },
    { name: t("commercial.modeResale"), icon: modeIcons[1] },
    { name: t("commercial.modeWhiteLabel"), icon: modeIcons[2] },
  ];
  const published = useCmsDocument("/parcerias", locale);
  const data = published
    ? (published.payload.fields as LandingData)
    : getCommercial("parcerias", locale);
  if (!data)
    return (
      <section className="not-found">
        <div className="container">
          <h1>{t("commercial.partnersNotReadyTitle")}</h1>
          <p>{t("commercial.partnersNotReadyBody")}</p>
          <ButtonLink href="/contato?interesse=Parcerias">
            {t("commercial.partnersTalkTeam")}
          </ButtonLink>
        </div>
      </section>
    );
  const selected = modes[active];
  const goal = data.goals[active];
  const differentiator = data.differentiators[active];
  return (
    <div className="commercial-page partners-page">
      <section className="commercial-hero">
        <div className="container">
          <nav
            className="commercial-breadcrumb"
            aria-label={t("a11y.breadcrumbs")}
          >
            <Link href="/">{t("commercial.homeBreadcrumb")}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t("commercial.partnersProgram")}</span>
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
                <a className="button button-primary" href="#partner-modes">
                  {t("commercial.partnersFindMode")}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a href="#commercial-contact" className="commercial-secondary">
                  {t("commercial.partnersCta")}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
              <p className="commercial-status">{t("commercial.partnersStatus")}</p>
            </div>
            <SitePhotography
              photoKey="strategy"
              className="commercial-hero-visual"
              eager
              overrideUrl={published?.payload.imageUrl}
              overrideAlt={published?.payload.imageAlt}
            />
          </div>
        </div>
      </section>
      <nav
        className="commercial-subnav"
        aria-label={t("commercialPage.partnersSubnavProgram")}
      >
        <div className="container">
          <a href="#partner-context">
            {t("commercialPage.partnersSubnavProgram")}
          </a>
          <a href="#partner-modes">{t("commercialPage.partnersSubnavModes")}</a>
          <a href="#partner-next">{t("commercialPage.partnersSubnavNext")}</a>
          <a href="#commercial-faq">{t("commercialPage.subnavFaq")}</a>
          <a href="#commercial-contact">
            {t("commercialPage.partnersSubnavContact")}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </nav>
      <section
        className="commercial-section commercial-context"
        id="partner-context"
      >
        <div className="container commercial-two-col">
          <div>
            <p className="eyebrow">
              <span />
              {t("commercialPage.partnersContextEyebrow")}
            </p>
            <h2>{data.contextTitle}</h2>
          </div>
          <div className="commercial-context-copy">
            <p>{data.context}</p>
            <p className="commercial-muted">{data.solutionText}</p>
          </div>
        </div>
      </section>
      <section className="commercial-section partner-audience">
        <div className="container">
          <div className="commercial-section-lead">
            <div>
              <p className="eyebrow">
                <span />
                {t("commercialPage.partnersAudienceEyebrow")}
              </p>
              <h2>{t("commercialPage.partnersAudienceTitle")}</h2>
            </div>
            <p>{t("commercialPage.partnersAudienceLead")}</p>
          </div>
          <div className="partner-profile-labels">
            {data.audiences.map(audience => (
              <span key={audience}>{audience}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="commercial-section partner-modes" id="partner-modes">
        <div className="container">
          <p className="eyebrow">
            <span />
            {t("commercialPage.partnersModesEyebrow")}
          </p>
          <h2>{t("commercialPage.partnersModesTitle")}</h2>
          <p className="commercial-muted">
            {t("commercialPage.partnersModesLead")}
          </p>
          <div
            className="partner-mode-controls"
            role="group"
            aria-label={t("commercialPage.partnersModesA11y")}
          >
            {modes.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.name}
                  type="button"
                  aria-pressed={active === i}
                  aria-controls="partner-mode-panel"
                  onClick={() => setActive(i)}
                >
                  <span>0{i + 1}</span>
                  <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                  <strong>{mode.name}</strong>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <div
            className="partner-mode-panel"
            id="partner-mode-panel"
            aria-live="polite"
          >
            <div className="partner-selected-heading">
              <span className="eyebrow">
                {t("landingPage.partnerModePanelTitle")}
              </span>
              <h3>{selected.name}</h3>
              <p>{goal?.text ?? t("landingPage.partnerModePanelLead")}</p>
              <a href="#commercial-contact" className="button button-primary">
                {t("commercial.partnersCta")}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            {differentiator && (
              <dl className="partner-mode-details">
                <div>
                  <dt>{differentiator.title}</dt>
                  <dd>{differentiator.text}</dd>
                </div>
              </dl>
            )}
          </div>
          <Notice>{t("commercialPage.partnersModesNotice")}</Notice>
        </div>
      </section>
      <section className="commercial-section partner-next" id="partner-next">
        <div className="container">
          <div className="commercial-section-lead">
            <div>
              <p className="eyebrow">
                <span />
                {t("commercialPage.partnersNextEyebrow")}
              </p>
              <h2>{t("commercialPage.partnersNextTitle")}</h2>
            </div>
            <p>{t("commercialPage.partnersNextLead")}</p>
          </div>
          <div className="commercial-goals">
            {data.flow.map((step, i) => (
              <article key={step.title}>
                <span className="commercial-number">
                  0{i + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className="partner-conditions-note">
            <ShieldCheck size={22} aria-hidden="true" />
            <p>{data.methodology}</p>
          </div>
        </div>
      </section>
      <section className="partner-booking">
        <div className="container">
          <CalendarClock size={28} aria-hidden="true" />
          <div>
            <h2>{t("commercialPage.partnersBookingTitle")}</h2>
            <p>{t("commercialPage.partnersBookingBody")}</p>
          </div>
          <span>{t("commercialPage.partnersBookingPending")}</span>
        </div>
      </section>
      <CommercialFAQ data={data} />
      <CommercialClosing data={data} selectedMode={selected.name} />
      <section className="commercial-section commercial-related">
        <div className="container">
          <p className="eyebrow">
            <span />
            {t("commercialPage.partnersRelatedEyebrow")}
          </p>
          <h2>{t("commercialPage.partnersRelatedTitle")}</h2>
          <div className="partner-related-actions">
            <ButtonLink href="/servicos" variant="outline">
              {t("commercialPage.partnersExplorePortfolio")}
            </ButtonLink>
            <ButtonLink href="/ecossistema" variant="text">
              {t("commercialPage.partnersExploreEcosystem")}
            </ButtonLink>
          </div>
          <details className="commercial-review">
            <summary>{t("commercialPage.partnersPendingSummary")}</summary>
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
