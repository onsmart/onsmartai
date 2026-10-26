import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "wouter";
import type { PublishedDocument } from "@shared/cms";
import { safeCmsUrl } from "@shared/cms";
import { apiCms } from "@/lib/cms-api";
import { useLocale } from "@/i18n/LocaleProvider";
import { cmsLocaleFallback } from "@/i18n/cms-fallback";
import type { SiteLocale } from "@shared/locale";
type State = { documents: PublishedDocument[]; ready: boolean; error: string };
const Context = createContext<State>({
  documents: [],
  ready: false,
  error: "",
});
declare global {
  interface Window {
    __CMS_DATA__?: PublishedDocument[];
  }
}
export function CmsProvider({
  children,
  initialDocuments,
}: {
  children: ReactNode;
  initialDocuments?: PublishedDocument[];
}) {
  const [state, setState] = useState<State>(() => ({
    documents:
      initialDocuments ??
      (typeof window !== "undefined" ? window.__CMS_DATA__ : undefined) ??
      [],
    ready:
      initialDocuments !== undefined ||
      (typeof window !== "undefined" && window.__CMS_DATA__ !== undefined),
    error: "",
  }));
  useEffect(() => {
    let active = true;
    function load() {
      apiCms<{ documents: PublishedDocument[] }>("/public")
        .then(result => {
          if (active)
            setState({ documents: result.documents, ready: true, error: "" });
        })
        .catch(() => {
          if (active)
            setState(current => ({
              ...current,
              error:
                "O conteúdo atualizado não pôde ser carregado. Tente novamente.",
            }));
        });
    }
    load();
    window.addEventListener("focus", load);
    return () => {
      active = false;
      window.removeEventListener("focus", load);
    };
  }, []);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export const useCms = () => useContext(Context);
export function useCmsDocument(key: string, locale?: SiteLocale) {
  const { locale: activeLocale } = useLocale();
  const resolved = locale ?? activeLocale;
  const { documents } = useCms();
  return (
    documents.find(doc => doc.key === key && doc.locale === resolved) ??
    (resolved !== "pt-BR"
      ? documents.find(doc => doc.key === key && doc.locale === "pt-BR")
      : undefined)
  );
}
function resolveCmsText(
  fields: Array<{ texts?: unknown }>,
  original: string
): string | undefined {
  for (const field of fields) {
    const items = field.texts;
    if (Array.isArray(items)) {
      const found = items.find(
        item =>
          item &&
          typeof item === "object" &&
          "original" in item &&
          (item as { original: string }).original === original &&
          typeof (item as { text?: string }).text === "string"
      );
      if (found) return (found as { text: string }).text;
    }
  }
  return undefined;
}
export function useCmsCopy() {
  const [location] = useLocation();
  const { locale } = useLocale();
  const { documents } = useCms();
  const normalize = location
    .replace("/previa/solucao/", "/servicos/")
    .replace("/previa/parcerias/programa", "/parcerias");
  const matchKey = (doc: PublishedDocument) =>
    doc.key === normalize || doc.key === "global";
  const primary = documents.filter(
    doc => matchKey(doc) && doc.locale === locale
  );
  const fallbackPt =
    locale === "pt-BR"
      ? []
      : documents.filter(doc => matchKey(doc) && doc.locale === "pt-BR");
  const primaryFields = primary.map(doc => doc.payload.fields);
  const fallbackFields = fallbackPt.map(doc => doc.payload.fields);
  const linkFields = [...primaryFields, ...fallbackFields];
  function text(original: string): string {
    const localized = resolveCmsText(primaryFields, original);
    if (localized !== undefined) {
      return locale === "pt-BR"
        ? localized
        : cmsLocaleFallback(original, localized, locale);
    }
    const fromPt = resolveCmsText(fallbackFields, original);
    const resolved = fromPt ?? original;
    return cmsLocaleFallback(original, resolved, locale);
  }
  function href(original: string): string {
    for (const field of linkFields) {
      const items = field.links;
      if (Array.isArray(items)) {
        const found = items.find(
          item =>
            item &&
            typeof item === "object" &&
            item.original === original &&
            typeof item.url === "string"
        );
        if (found) return safeCmsUrl(found.url) || safeCmsUrl(original);
      }
    }
    return safeCmsUrl(original);
  }
  function image(original: string): { url: string; alt?: string } {
    for (const field of linkFields) {
      const items = field.images;
      if (Array.isArray(items)) {
        const found = items.find(
          item =>
            item &&
            typeof item === "object" &&
            item.original === original &&
            typeof item.url === "string"
        );
        if (found)
          return {
            url: safeCmsUrl(found.url) || original,
            alt: typeof found.alt === "string" ? found.alt : undefined,
          };
      }
    }
    return { url: original };
  }
  return { text, href, image };
}
