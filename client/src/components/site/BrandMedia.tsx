import media from "@/data/brand-media.json";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import "./brand-media.css";
export function SoniaCharacter({
  className = "",
  decorative = false,
}: {
  className?: string;
  decorative?: boolean;
}) {
  const { image } = useCmsCopy();
  const asset = image(media.sonia.url);
  const isFloating = className.includes("floating-sonia-character");
  const src = asset.url || media.sonia.url;
  return (
    <img
      className={`sonia-character ${className}`}
      src={src}
      alt={decorative ? "" : asset.alt || media.sonia.alt}
      width={media.sonia.width}
      height={media.sonia.height}
      loading={isFloating ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
export function SoniaPresentation({ className = "" }: { className?: string }) {
  const { t } = useSiteCopy();
  return (
    <figure className={`sonia-presentation sonia-static ${className}`}>
      <SoniaCharacter />
      <figcaption>{t("showcase.soniaCaption")}</figcaption>
    </figure>
  );
}
export function RicardoPortrait() {
  const { image } = useCmsCopy();
  const asset = image(media.ricardo.url);
  return (
    <img
      src={asset.url}
      alt={asset.alt || media.ricardo.alt}
      width={media.ricardo.width}
      height={media.ricardo.height}
      loading="lazy"
      decoding="async"
    />
  );
}
