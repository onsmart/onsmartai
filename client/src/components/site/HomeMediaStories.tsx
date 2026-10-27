import { useCmsDocument } from "@/components/cms/CmsProvider";
import { useLocale } from "@/i18n/LocaleProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { safeCmsUrl } from "@shared/cms";
import {
  getApprovedMediaPreviews,
  type MediaPreview,
} from "@/data/media-previews";
import { ArrowUpRight } from "lucide-react";
import "./home-media.css";
function validPreview(value: unknown): value is MediaPreview {
  return (
    !!value &&
    typeof value === "object" &&
    [
      "id",
      "title",
      "author",
      "summary",
      "imageUrl",
      "imageAlt",
      "sourceUrl",
      "state",
    ].every(key => typeof (value as Record<string, unknown>)[key] === "string")
  );
}
export default function HomeMediaStories() {
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const home = useCmsDocument("/", locale);
  const items = Array.isArray(home?.payload.fields.homeMediaPreviews)
    ? home.payload.fields.homeMediaPreviews.filter(validPreview)
    : getApprovedMediaPreviews(locale);
  return (
    <div className="home-media-grid">
      {items.slice(0, 3).map(item => (
        <article
          className={`home-media-card home-media-card-${item.id}`}
          key={item.id}
        >
          <figure className="home-media-cover">
            <img
              src={safeCmsUrl(item.imageUrl)}
              alt={item.imageAlt}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="home-media-copy">
            <h3>{item.title}</h3>
            <p className="home-media-byline">
              {t("media.byAuthor")} <strong>{item.author}</strong>
            </p>
            <p className="home-media-summary">{item.summary}</p>
            <div className="home-media-card-foot">
              <span className="media-review-label">{item.state}</span>
              {safeCmsUrl(item.sourceUrl) && (
                <a
                  href={safeCmsUrl(item.sourceUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("media.officialSource")}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
