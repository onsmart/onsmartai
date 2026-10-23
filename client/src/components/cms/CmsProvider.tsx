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
export function useCmsDocument(key: string) {
  return useCms().documents.find(
    doc => doc.key === key && doc.locale === "pt-BR"
  );
}
export function useCmsCopy() {
  const [location] = useLocation();
  const { documents } = useCms();
  const normalize = location
    .replace("/previa/solucao/", "/servicos/")
    .replace("/previa/parcerias/programa", "/parcerias");
  const scopes = documents.filter(
    doc =>
      (doc.key === normalize || doc.key === "global") && doc.locale === "pt-BR"
  );
  const fields = scopes.map(doc => doc.payload.fields);
  function text(original: string): string {
    for (const field of fields) {
      const items = field.texts;
      if (Array.isArray(items)) {
        const found = items.find(
          item =>
            item &&
            typeof item === "object" &&
            item.original === original &&
            typeof item.text === "string"
        );
        if (found) return found.text;
      }
    }
    return original;
  }
  function href(original: string): string {
    for (const field of fields) {
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
    for (const field of fields) {
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
