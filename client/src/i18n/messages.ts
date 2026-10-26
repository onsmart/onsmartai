import type { SiteLocale } from "@shared/locale";

export type UiMessages = {
  nav: {
    home: string;
    about: string;
    services: string;
    ecosystem: string;
    content: string;
    contact: string;
    closeNav: string;
    openNav: string;
    mainNav: string;
    openSection: string;
    closeSection: string;
    language: string;
    selected: string;
  };
  mega: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    allSolutions: string;
    note: string;
    groupOnsmart: string;
    comingSoon: string;
  };
  categories: {
    education: string;
    services: string;
    platform: string;
  };
  contentMenu: {
    blog: string;
    materials: string;
    youtube: string;
    media: string;
    cases: string;
  };
  cms: {
    loadError: string;
  };
  solutions: Record<
    string,
    { title: string; category: "education" | "services" | "platform" }
  >;
};

const pt: UiMessages = {
  nav: {
    home: "Home",
    about: "Quem Somos",
    services: "Serviços",
    ecosystem: "Ecossistema",
    content: "Conteúdo",
    contact: "Contato",
    closeNav: "Fechar navegação",
    openNav: "Abrir navegação",
    mainNav: "Navegação principal",
    openSection: "Abrir",
    closeSection: "Fechar",
    language: "Idioma",
    selected: "Selecionado",
  },
  mega: {
    eyebrow: "Do aprendizado à operação",
    titleLine1: "Qual é o próximo passo",
    titleLine2: "da sua empresa?",
    allSolutions: "Conhecer todas as soluções",
    note: "Educação, serviços e plataforma para cada etapa da jornada com IA.",
    groupOnsmart: "Grupo Onsmart",
    comingSoon: "Em breve",
  },
  categories: {
    education: "Educação",
    services: "Serviços",
    platform: "Plataforma",
  },
  contentMenu: {
    blog: "Blog",
    materials: "Materiais gratuitos",
    youtube: "YouTube",
    media: "Onsmart na mídia",
    cases: "Cases",
  },
  cms: {
    loadError:
      "O conteúdo atualizado não pôde ser carregado. Tente novamente.",
  },
  solutions: {
    "palestras-em-ia": { title: "Palestras em IA", category: "education" },
    "imersao-em-ia": { title: "Imersão em IA", category: "education" },
    "capacitacao-de-lideres": {
      title: "Capacitação de Líderes em IA",
      category: "education",
    },
    academia: { title: "Academia Onsmart.AI", category: "education" },
    "educacao-corporativa": {
      title: "Educação Corporativa em IA",
      category: "education",
    },
    "consultoria-em-ia": { title: "Consultoria em IA", category: "services" },
    "apps-e-agentes": {
      title: "Desenvolvimento de Apps e Agentes de IA",
      category: "services",
    },
    sonia: { title: "SON.IA — Plataforma de IA Operacional", category: "platform" },
  },
};

const en: UiMessages = {
  nav: {
    home: "Home",
    about: "About us",
    services: "Services",
    ecosystem: "Ecosystem",
    content: "Content",
    contact: "Contact",
    closeNav: "Close navigation",
    openNav: "Open navigation",
    mainNav: "Main navigation",
    openSection: "Open",
    closeSection: "Close",
    language: "Language",
    selected: "Selected",
  },
  mega: {
    eyebrow: "From learning to operations",
    titleLine1: "What is the next step",
    titleLine2: "for your company?",
    allSolutions: "See all solutions",
    note: "Education, services, and platform for every stage of your AI journey.",
    groupOnsmart: "Onsmart Group",
    comingSoon: "Coming soon",
  },
  categories: {
    education: "Education",
    services: "Services",
    platform: "Platform",
  },
  contentMenu: {
    blog: "Blog",
    materials: "Free resources",
    youtube: "YouTube",
    media: "Onsmart in the media",
    cases: "Case studies",
  },
  cms: {
    loadError: "Updated content could not be loaded. Please try again.",
  },
  solutions: {
    "palestras-em-ia": { title: "AI keynotes", category: "education" },
    "imersao-em-ia": { title: "AI immersion", category: "education" },
    "capacitacao-de-lideres": {
      title: "AI leadership training",
      category: "education",
    },
    academia: { title: "Onsmart.AI Academy", category: "education" },
    "educacao-corporativa": {
      title: "Corporate AI education",
      category: "education",
    },
    "consultoria-em-ia": { title: "AI consulting", category: "services" },
    "apps-e-agentes": {
      title: "Custom AI apps and agents",
      category: "services",
    },
    sonia: { title: "SON.IA — Operational AI platform", category: "platform" },
  },
};

const es: UiMessages = {
  nav: {
    home: "Inicio",
    about: "Quiénes somos",
    services: "Servicios",
    ecosystem: "Ecosistema",
    content: "Contenido",
    contact: "Contacto",
    closeNav: "Cerrar navegación",
    openNav: "Abrir navegación",
    mainNav: "Navegación principal",
    openSection: "Abrir",
    closeSection: "Cerrar",
    language: "Idioma",
    selected: "Seleccionado",
  },
  mega: {
    eyebrow: "Del aprendizaje a la operación",
    titleLine1: "Cuál es el siguiente paso",
    titleLine2: "de su empresa",
    allSolutions: "Conocer todas las soluciones",
    note: "Educación, servicios y plataforma para cada etapa del recorrido con IA.",
    groupOnsmart: "Grupo Onsmart",
    comingSoon: "Próximamente",
  },
  categories: {
    education: "Educación",
    services: "Servicios",
    platform: "Plataforma",
  },
  contentMenu: {
    blog: "Blog",
    materials: "Materiales gratuitos",
    youtube: "YouTube",
    media: "Onsmart en los medios",
    cases: "Casos",
  },
  cms: {
    loadError:
      "No se pudo cargar el contenido actualizado. Inténtelo de nuevo.",
  },
  solutions: {
    "palestras-em-ia": { title: "Charlas sobre IA", category: "education" },
    "imersao-em-ia": { title: "Inmersión en IA", category: "education" },
    "capacitacao-de-lideres": {
      title: "Capacitación de líderes en IA",
      category: "education",
    },
    academia: { title: "Academia Onsmart.AI", category: "education" },
    "educacao-corporativa": {
      title: "Educación corporativa en IA",
      category: "education",
    },
    "consultoria-em-ia": { title: "Consultoría en IA", category: "services" },
    "apps-e-agentes": {
      title: "Apps y agentes de IA a medida",
      category: "services",
    },
    sonia: {
      title: "SON.IA — Plataforma de IA operacional",
      category: "platform",
    },
  },
};

export const UI_MESSAGES: Record<SiteLocale, UiMessages> = {
  "pt-BR": pt,
  en,
  es,
};

export function categoryKeyFromPt(
  category: "Educação" | "Serviços" | "Plataforma"
): keyof UiMessages["categories"] {
  if (category === "Educação") return "education";
  if (category === "Serviços") return "services";
  return "platform";
}
