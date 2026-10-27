import { Link, useLocation } from "wouter";
import { safeCmsUrl, type CmsBlock } from "@shared/cms";
import { useCms } from "./CmsProvider";
import { useLocale } from "@/i18n/LocaleProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
export function CmsBlocks({ blocks }: { blocks: CmsBlock[] }) {
  return (
    <div className="cms-prose">
      {blocks.map((block, index) =>
        block.type === "heading" ? (
          <h2 key={index}>{block.text}</h2>
        ) : block.type === "list" ? (
          <ul key={index}>
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : block.type === "quote" ? (
          <blockquote key={index}>{block.text}</blockquote>
        ) : block.type === "link" ? (
          safeCmsUrl(block.href) ? (
            <p key={index}>
              <a href={safeCmsUrl(block.href)}>{block.text}</a>
            </p>
          ) : (
            <p key={index}>{block.text}</p>
          )
        ) : (
          <p key={index}>{block.text}</p>
        )
      )}
    </div>
  );
}
export function CmsBanners() {
  const [location] = useLocation();
  const { documents } = useCms();
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  if (location.startsWith("/admin")) return null;
  const banners = documents.filter(
    doc =>
      doc.kind === "banner" &&
      (doc.locale === locale || (locale !== "pt-BR" && doc.locale === "pt-BR")) &&
      doc.payload.bannerTargets.includes(location)
  );
  return (
    <>
      {banners.map(doc => (
        <aside className="cms-banner" key={doc.id}>
          <div className="container">
            <div>
              <strong>{doc.payload.title}</strong>
              <p>{doc.payload.summary}</p>
            </div>
            {safeCmsUrl(doc.payload.sourceUrl) && (
              <Link
                href={safeCmsUrl(doc.payload.sourceUrl)}
                className="button button-outline"
              >
                {String(doc.payload.fields.cta || t("commercial.learnMore"))}
              </Link>
            )}
          </div>
        </aside>
      ))}
    </>
  );
}
