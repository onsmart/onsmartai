import { useCmsCopy } from "@/components/cms/CmsProvider";
import { safeCmsUrl } from "@shared/cms";
import {
  getPhoto,
  getPhotoAlt,
  resolvePhotoUrl,
  type PhotoKey,
} from "@/data/photography";
import { useLocale } from "@/i18n/LocaleProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
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
  const { locale } = useLocale();
  const { t } = useSiteCopy();
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
        alt={
          overrideAlt || asset.alt || getPhotoAlt(photoKey, locale) || photo.alt
        }
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      <figcaption>{t("showcase.photoCaption")}</figcaption>
    </figure>
  );
}
