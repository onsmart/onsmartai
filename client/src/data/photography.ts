export type PhotoKey =
  | "workshop"
  | "strategy"
  | "learning"
  | "development"
  | "event";
export type StockPhoto = {
  url: string;
  name: string;
  alt: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  sourceUrl: string;
  licenseUrl: string;
  credit: string;
  localFile: string;
};
const modules = import.meta.glob<Record<PhotoKey, StockPhoto>>(
  "./photography.json",
  { eager: true, import: "default" }
);
export const stockPhotos = Object.values(modules)[0];
export function getPhoto(key: PhotoKey) {
  if (key === "event")
    return {
      url: "/assets/hero-poster.webp",
      name: "hero-poster.webp",
      alt: "Público em evento empresarial, em fotografia ilustrativa licenciada.",
      width: 1280,
      height: 720,
      size: 0,
      mime: "image/webp",
      sourceUrl:
        "https://mixkit.co/free-stock-video/audience-raise-hands-at-business-conference-13192/",
      licenseUrl: "https://mixkit.co/license/#videoFree",
      credit: "Mixkit",
      localFile: "client/public/assets/hero-poster.webp",
    };
  return stockPhotos?.[key];
}
export function photoForSolution(slug: string): PhotoKey {
  if (slug === "palestras-em-ia") return "event";
  if (slug === "academia") return "learning";
  if (slug === "apps-e-agentes") return "development";
  if (slug === "consultoria-em-ia" || slug === "capacitacao-de-lideres")
    return "strategy";
  return "workshop";
}

export function resolvePhotoUrl(url: string): string {
  const retired: Record<string, PhotoKey> = {
    "/manus-storage/learning_c2b208b7.webp": "learning",
    "/manus-storage/workshop_c77775c5.webp": "workshop",
  };
  const key = retired[url.split("?")[0]];
  return key ? getPhoto(key)?.url || url : url;
}
