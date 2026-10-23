import { useCmsCopy } from "@/components/cms/CmsProvider";
import { safeCmsUrl } from "@shared/cms";
import { getPhoto, resolvePhotoUrl, type PhotoKey } from "@/data/photography";
import "./site-photography.css";
export default function SitePhotography({
  photoKey,
  className = "",
  eager = false,
  overrideUrl,
  overrideAlt,
}: {
  photoKey: PhotoKey;
  className?: string;
  eager?: boolean;
  overrideUrl?: string;
  overrideAlt?: string;
}) {
  const { image } = useCmsCopy();
  const photo = getPhoto(photoKey);
  if (!photo) return null;
  const asset = image(photo.url);
  const url = (overrideUrl && safeCmsUrl(overrideUrl)) || asset.url;
  return (
    <figure
      className={`site-photography ${photo.height > photo.width ? "photo-portrait" : ""} ${className}`}
    >
      <img
        src={resolvePhotoUrl(url)}
        alt={overrideAlt || asset.alt || photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      <figcaption>
        Fotografia ilustrativa · não representa a equipe ou um evento da
        Onsmart.
      </figcaption>
    </figure>
  );
}
