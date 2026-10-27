import type { SiteLocale } from "@shared/locale";

export type PageMeta = { title: string; description: string };

const pt: Record<string, PageMeta> = {
  "/": {
    title: "Onsmart.AI | IA corporativa sem mistério",
    description:
      "Educação, consultoria e o Ecossistema SON.IA para a sua empresa adotar IA de forma simples, confiável e governável.",
  },
  "/quem-somos": {
    title: "Quem Somos | Onsmart.AI e Grupo Onsmart",
    description:
      "Conheça a missão, a liderança e o ecossistema da Onsmart.AI.",
  },
  "/servicos": {
    title: "Educação, Consultoria e Soluções de IA | Onsmart.AI",
    description:
      "Da estratégia à operação: educação, consultoria, desenvolvimento de IA e plataforma SON.IA.",
  },
  "/ecossistema": {
    title: "Ecossistema | Grupo Onsmart",
    description:
      "Conheça as empresas do Grupo Onsmart e sua conexão com a Onsmart.AI.",
  },
  "/conteudo": {
    title: "Blog Onsmart.AI | Conteúdo sobre IA corporativa",
    description:
      "Explore artigos sobre adoção, governança e agentes de IA para empresas.",
  },
  "/contato": {
    title: "Fale com a Onsmart.AI | Inteligência Artificial",
    description:
      "Converse com a Onsmart.AI sobre educação, consultoria e o próximo passo da IA na sua empresa.",
  },
  "/legal/privacidade": {
    title: "Política de Privacidade | Onsmart.AI",
    description:
      "Como a Onsmart.AI trata dados pessoais, cookies e formulários, em conformidade com a LGPD.",
  },
  "/legal/termos": {
    title: "Termos de Uso | Onsmart.AI",
    description:
      "Condições de uso do site institucional e comercial da Onsmart.AI.",
  },
};

const en: Record<string, PageMeta> = {
  "/": {
    title: "Onsmart.AI | Corporate AI without the mystery",
    description:
      "Education, consulting, and the SON.IA Ecosystem so your company can adopt AI simply, reliably, and with governance.",
  },
  "/quem-somos": {
    title: "About us | Onsmart.AI and Grupo Onsmart",
    description:
      "Discover the mission, leadership, and ecosystem of Onsmart.AI.",
  },
  "/servicos": {
    title: "Education, consulting, and AI solutions | Onsmart.AI",
    description:
      "From strategy to operations: education, consulting, custom AI development, and the SON.IA platform.",
  },
  "/ecossistema": {
    title: "Ecosystem | Grupo Onsmart",
    description:
      "Meet Grupo Onsmart companies and their connection to Onsmart.AI.",
  },
  "/conteudo": {
    title: "Onsmart.AI Blog | Corporate AI content",
    description:
      "Articles on adoption, governance, and AI agents for businesses.",
  },
  "/contato": {
    title: "Contact Onsmart.AI | Artificial intelligence",
    description:
      "Talk to Onsmart.AI about education, consulting, and the next step for AI in your company.",
  },
  "/legal/privacidade": {
    title: "Privacy Policy | Onsmart.AI",
    description:
      "How Onsmart.AI handles personal data, cookies, and forms.",
  },
  "/legal/termos": {
    title: "Terms of Use | Onsmart.AI",
    description: "Terms for using the Onsmart.AI institutional and commercial site.",
  },
};

const es: Record<string, PageMeta> = {
  "/": {
    title: "Onsmart.AI | IA corporativa sin misterio",
    description:
      "Educación, consultoría y el Ecosistema SON.IA para que su empresa adopte IA de forma simple, confiable y gobernada.",
  },
  "/quem-somos": {
    title: "Quiénes somos | Onsmart.AI y Grupo Onsmart",
    description:
      "Conozca la misión, el liderazgo y el ecosistema de Onsmart.AI.",
  },
  "/servicos": {
    title: "Educación, consultoría y soluciones de IA | Onsmart.AI",
    description:
      "De la estrategia a la operación: educación, consultoría, desarrollo de IA y plataforma SON.IA.",
  },
  "/ecossistema": {
    title: "Ecosistema | Grupo Onsmart",
    description:
      "Conozca las empresas del Grupo Onsmart y su conexión con Onsmart.AI.",
  },
  "/conteudo": {
    title: "Blog Onsmart.AI | Contenido sobre IA corporativa",
    description:
      "Artículos sobre adopción, gobernanza y agentes de IA para empresas.",
  },
  "/contato": {
    title: "Contacto Onsmart.AI | Inteligencia artificial",
    description:
      "Hable con Onsmart.AI sobre educación, consultoría y el siguiente paso de la IA en su empresa.",
  },
  "/legal/privacidade": {
    title: "Política de privacidad | Onsmart.AI",
    description:
      "Cómo Onsmart.AI trata datos personales, cookies y formularios.",
  },
  "/legal/termos": {
    title: "Términos de uso | Onsmart.AI",
    description:
      "Condiciones de uso del sitio institucional y comercial de Onsmart.AI.",
  },
};

export const SITE_METADATA: Record<SiteLocale, Record<string, PageMeta>> = {
  "pt-BR": pt,
  en,
  es,
};

export function siteMetadata(
  path: string,
  locale: SiteLocale
): PageMeta | undefined {
  return SITE_METADATA[locale][path] ?? SITE_METADATA["pt-BR"][path];
}

export function defaultSiteMeta(locale: SiteLocale): PageMeta {
  if (locale === "en")
    return {
      title: "Onsmart.AI",
      description:
        "Corporate AI without the mystery: education, services, and platform for companies.",
    };
  if (locale === "es")
    return {
      title: "Onsmart.AI",
      description:
        "IA corporativa sin misterio: educación, servicios y plataforma para empresas.",
    };
  return {
    title: "Onsmart.AI",
    description:
      "IA corporativa sem mistério: educação, serviços e plataforma para empresas.",
  };
}
