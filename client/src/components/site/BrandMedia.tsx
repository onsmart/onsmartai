import media from "@/data/brand-media.json";
import { useCmsCopy } from "@/components/cms/CmsProvider";
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
  return (
    <img
      className={`sonia-character ${className}`}
      src={
        className.includes("floating-sonia-character") &&
        asset.url === media.sonia.url
          ? media.sonia.thumbnailUrl
          : asset.url
      }
      alt={decorative ? "" : asset.alt || media.sonia.alt}
      width={media.sonia.width}
      height={media.sonia.height}
      loading="lazy"
      decoding="async"
    />
  );
}
export function SoniaPresentation({ className = "" }: { className?: string }) {
  return (
    <figure className={`sonia-presentation sonia-static ${className}`}>
      <SoniaCharacter />
      <figcaption>
        Personagem SON.IA · não é uma captura da interface do produto.
      </figcaption>
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
