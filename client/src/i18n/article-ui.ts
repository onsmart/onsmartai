import type { SiteLocale } from "@shared/locale";

export type ArticleUiCopy = {
  byAuthor: string;
  downloadMaterial: string;
  source: string;
  viewSource: string;
  backToContent: string;
  relatedEyebrow: string;
  relatedTitle: string;
  home: string;
  content: string;
};

export const ARTICLE_UI: Record<SiteLocale, ArticleUiCopy> = {
  "pt-BR": {
    byAuthor: "Por",
    downloadMaterial: "Acessar material",
    source: "Fonte",
    viewSource: "Consultar fonte original",
    backToContent: "Voltar para Conteúdo",
    relatedEyebrow: "Continue a leitura",
    relatedTitle: "Conteúdos relacionados",
    home: "Home",
    content: "Conteúdo",
  },
  en: {
    byAuthor: "By",
    downloadMaterial: "Access material",
    source: "Source",
    viewSource: "View original source",
    backToContent: "Back to Content",
    relatedEyebrow: "Continue reading",
    relatedTitle: "Related content",
    home: "Home",
    content: "Content",
  },
  es: {
    byAuthor: "Por",
    downloadMaterial: "Acceder al material",
    source: "Fuente",
    viewSource: "Consultar fuente original",
    backToContent: "Volver a Contenido",
    relatedEyebrow: "Continúe la lectura",
    relatedTitle: "Contenidos relacionados",
    home: "Inicio",
    content: "Contenido",
  },
};
