import { useState } from "react";
import { safeCmsUrl } from "@shared/cms";
import { Plus, Minus } from "lucide-react";
import { useCms, useCmsCopy } from "@/components/cms/CmsProvider";
import { getCommercial, type LandingData } from "@/data/commercial";
import { useSiteContent } from "@/data/site-content";
import { useLocale } from "@/i18n/LocaleProvider";
import { resolveCmsPageDocument } from "@shared/cms-page";
import {
  getPhoto,
  photoForSolution,
  resolvePhotoUrl,
} from "@/data/photography";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { ButtonLink, Notice, SectionHeading } from "./Common";
import { SoniaCharacter } from "./BrandMedia";
import "./solution-showcase.css";

export default function SolutionShowcase() {
  const [active, setActive] = useState("consultoria-em-ia");
  const { documents } = useCms();
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const { solutions, solutionHref, solutionCategoryLabel } = useSiteContent();
  const { text: cmsText, image: cmsImage } = useCmsCopy();
  const chosen = solutions.find(s => s.slug === active)!;
  const document = resolveCmsPageDocument(
    documents,
    solutionHref(active),
    locale
  );
  const data =
    (document?.payload.fields as LandingData | undefined) ||
    getCommercial(active, locale);
  const photo =
    active === "sonia" ? undefined : getPhoto(photoForSolution(active));
  const image = photo ? cmsImage(photo.url) : undefined;
  const summary = document?.payload.summary || data?.lead || chosen.description;
  return (
    <section className="section products-section visual-products-section">
      <div className="container">
        <div className="products-heading">
          <SectionHeading
            eyebrow={t("showcase.eyebrow")}
            title={t("showcase.title")}
            text={t("showcase.text")}
            skipCmsTitle
          />
          <ButtonLink href="/servicos" variant="outline">
            {t("showcase.explorePortfolio")}
          </ButtonLink>
        </div>
        <div className="solution-showcase">
          <figure
            className={`solution-showcase-visual ${active === "sonia" ? "showcase-sonia" : ""} ${photo && photo.height > photo.width ? "showcase-portrait" : ""}`}
            id="solution-showcase-panel"
            aria-labelledby={`showcase-select-${active}`}
          >
            <div className="showcase-picture">
              {active === "sonia" ? (
                <SoniaCharacter />
              ) : image && photo ? (
                <img
                  src={resolvePhotoUrl(
                    safeCmsUrl(document?.payload.imageUrl || "") || image.url
                  )}
                  alt={document?.payload.imageAlt || image.alt || photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
            </div>
            <figcaption className="showcase-caption" aria-live="polite">
              <span className="showcase-category">
                {solutionCategoryLabel(chosen.category)}
              </span>
              <h3>{chosen.title}</h3>
              <p>{cmsText(summary)}</p>
              <span className="showcase-photo-note">
                {active === "sonia"
                  ? t("showcase.soniaCaption")
                  : t("showcase.photoCaption")}
              </span>
            </figcaption>
          </figure>
          <div className="solution-showcase-options">
            <h3>{t("showcase.findNextStep")}</h3>
            <div role="group" aria-label={t("showcase.selectSolutionA11y")}>
              {solutions.map(solution => (
                <div
                  className={`showcase-option ${active === solution.slug ? "active" : ""}`}
                  key={solution.slug}
                >
                  <button
                    type="button"
                    id={`showcase-select-${solution.slug}`}
                    onClick={() => setActive(solution.slug)}
                    aria-expanded={active === solution.slug}
                    aria-controls="solution-showcase-panel"
                  >
                    <span>
                      {solution.title}
                      <small>{solutionCategoryLabel(solution.category)}</small>
                    </span>
                    {active === solution.slug ? (
                      <Minus size={21} aria-hidden="true" />
                    ) : (
                      <Plus size={21} aria-hidden="true" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="showcase-action">
              <ButtonLink href={solutionHref(active)}>{chosen.cta}</ButtonLink>
              <p>{t("showcase.portfolioBlurb")}</p>
            </div>
          </div>
        </div>
        <Notice>{t("showcase.notice")}</Notice>
      </div>
    </section>
  );
}
