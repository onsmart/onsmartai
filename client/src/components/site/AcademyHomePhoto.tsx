import { useCmsCopy } from "@/components/cms/CmsProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import type { StockPhoto } from "@/data/photography";
import "./academy-home-photo.css";
const modules = import.meta.glob<StockPhoto>(
  "/src/data/academy-home-photo.json",
  { eager: true, import: "default" }
);
export default function AcademyHomePhoto() {
  const { t } = useSiteCopy();
  const { image } = useCmsCopy();
  const photo = Object.values(modules)[0];
  if (!photo) return null;
  const asset = image(photo.url);
  return (
    <figure className="site-photography journey-photo academy-home-study-photo">
      <img
        src={asset.url}
        alt={asset.alt || photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
      />
      <figcaption>{t("showcase.photoCaption")}</figcaption>
    </figure>
  );
}
