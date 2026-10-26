import type { SiteLocale } from "@shared/locale";
import { UI_MESSAGES } from "./messages";
import type { Solution } from "@/data/site";

export function localizedSolutionTitle(
  slug: string,
  fallback: string,
  locale: SiteLocale
): string {
  const entry = UI_MESSAGES[locale]?.solutions[slug];
  return entry?.title ?? fallback;
}

export function localizedSolutionCategory(
  category: Solution["category"],
  locale: SiteLocale
): string {
  const ui = UI_MESSAGES[locale] ?? UI_MESSAGES["pt-BR"];
  if (category === "Educação") return ui.categories.education;
  if (category === "Serviços") return ui.categories.services;
  return ui.categories.platform;
}
