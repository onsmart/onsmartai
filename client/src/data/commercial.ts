import { solutions } from "./site";
export type CommercialBlock = { title: string; text: string };
export type LandingData = {
  slug: string;
  eyebrow: string;
  heroTitle: string;
  lead: string;
  contextTitle: string;
  context: string;
  solutionTitle: string;
  solutionText: string;
  audiences: string[];
  goals: CommercialBlock[];
  flow: CommercialBlock[];
  methodology: string;
  deliverables: string[];
  differentiators: CommercialBlock[];
  faqs: { q: string; a: string }[];
  cta: string;
  interest:
    | "Treinamentos"
    | "Consultoria"
    | "Desenvolvimento de IA"
    | "SON.IA"
    | "Parcerias";
  metaTitle: string;
  metaDescription: string;
  commercialNotices: string[];
};
const modules = import.meta.glob<LandingData>("./landing/*.json", {
  eager: true,
  import: "default",
});
export const commercialPages: LandingData[] = Object.values(modules);
export const landingPath = (slug: string) =>
  slug === "parcerias" ? "/parcerias" : `/servicos/${slug}`;
export function getCommercial(slug: string) {
  return commercialPages.find(page => page.slug === slug);
}
export function commercialMetadata(path: string) {
  const normalized = path
    .replace("/previa/solucao/", "/servicos/")
    .replace("/previa/parcerias/programa", "/parcerias");
  const data = commercialPages.find(
    page => landingPath(page.slug) === normalized
  );
  return data
    ? { title: data.metaTitle, description: data.metaDescription }
    : undefined;
}
export function commercialWhatsapp(data: LandingData) {
  const message =
    data.slug === "parcerias"
      ? "Olá! Conheci o programa de parcerias da Onsmart.AI e gostaria de conversar sobre as modalidades disponíveis."
      : `Olá! Conheci a solução ${solutions.find(s => s.slug === data.slug)?.title || data.heroTitle} no site da Onsmart.AI e gostaria de conversar com a equipe sobre o próximo passo.`;
  return `https://wa.me/5511930683562?text=${encodeURIComponent(message)}`;
}
