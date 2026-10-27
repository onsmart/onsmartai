import type { SiteLocale } from "@shared/locale";
import { localizedSolutionTitle } from "@/i18n/site";
import { translatePath } from "@/i18n/useSiteCopy";
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

const ptModules = import.meta.glob<LandingData>("./landing/*.json", {
  eager: true,
  import: "default",
});
const enModules = import.meta.glob<LandingData>("./landing/en/*.json", {
  eager: true,
  import: "default",
});
const esModules = import.meta.glob<LandingData>("./landing/es/*.json", {
  eager: true,
  import: "default",
});

function commercialPagesFor(locale: SiteLocale): LandingData[] {
  if (locale === "en") return Object.values(enModules);
  if (locale === "es") return Object.values(esModules);
  return Object.values(ptModules);
}

export const commercialPages: LandingData[] = commercialPagesFor("pt-BR");

export const landingPath = (slug: string) =>
  slug === "parcerias" ? "/parcerias" : `/servicos/${slug}`;

export function getCommercial(slug: string, locale: SiteLocale = "pt-BR") {
  const page = commercialPagesFor(locale).find(p => p.slug === slug);
  if (page) return page;
  if (locale !== "pt-BR") return getCommercial(slug, "pt-BR");
  return undefined;
}

export function commercialMetadata(path: string, locale: SiteLocale = "pt-BR") {
  const normalized = path
    .replace("/previa/solucao/", "/servicos/")
    .replace("/previa/parcerias/programa", "/parcerias");
  const data = commercialPagesFor(locale).find(
    page => landingPath(page.slug) === normalized
  );
  const resolved = data ?? (locale !== "pt-BR" ? commercialPagesFor("pt-BR").find(
    page => landingPath(page.slug) === normalized
  ) : undefined);
  return resolved
    ? { title: resolved.metaTitle, description: resolved.metaDescription }
    : undefined;
}

export function commercialWhatsapp(data: LandingData, locale: SiteLocale = "pt-BR") {
  const message =
    data.slug === "parcerias"
      ? translatePath(locale, "whatsapp.partnersMessage")
      : translatePath(locale, "whatsapp.solutionMessage", {
          solution:
            localizedSolutionTitle(
              data.slug,
              solutions.find(s => s.slug === data.slug)?.title || data.heroTitle,
              locale
            ),
        });
  return `https://wa.me/5511930683562?text=${encodeURIComponent(message)}`;
}
