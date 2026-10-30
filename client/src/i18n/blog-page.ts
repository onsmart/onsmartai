import type { SiteLocale } from "@shared/locale";

export type BlogPageCopy = {
  pageEyebrow: string;
  exploreContents: string;
  visitYoutube: string;
  focusEyebrow: string;
  focusTitle: string;
  focusIntro: string;
  publishedCount: string;
  inReview: string;
  approvedPending: string;
  searchLabel: string;
  searchPlaceholder: string;
  formatLabel: string;
  topicsLabel: string;
  allTopics: string;
  filterTopicsAria: string;
  featured: string;
  published: string;
  moreContents: string;
  paginationAria: string;
  youtubeEyebrow: string;
  youtubeTitle: string;
  youtubeBody: string;
  openYoutube: string;
  cmsLoadingDetail: string;
  noMatchTitle: string;
  noMatchBody: string;
  pendingApprovedNote: string;
  pendingReviewNote: string;
  resultsOne: string;
  resultsMany: string;
  readText: string;
  readOnLinkedIn: string;
  aiInsiderNewsletter: string;
  pubPendingAria: string;
  approvalPendingAria: string;
  pendingShort: string;
};

const ALL_TOPIC_KEY = "__all__";
export { ALL_TOPIC_KEY };

const pt: BlogPageCopy = {
  pageEyebrow: "Conteúdo · Blog Onsmart.AI",
  exploreContents: "Explorar conteúdos",
  visitYoutube: "Visitar YouTube oficial",
  focusEyebrow: "Conteúdo em foco",
  focusTitle: "Conhecimento para decidir o próximo passo.",
  focusIntro:
    "Artigos publicados e prévias autorizadas, organizados por assunto e formato.",
  publishedCount: "publicados",
  inReview: "em revisão",
  approvedPending: "aprovados · publicação pendente",
  searchLabel: "Buscar por título, autor ou assunto",
  searchPlaceholder: "Ex.: governança, agentes, adoção",
  formatLabel: "Formato",
  topicsLabel: "Assuntos",
  allTopics: "Todos",
  filterTopicsAria: "Filtrar por assunto",
  featured: "Em destaque",
  published: "Publicado",
  moreContents: "Mais conteúdos",
  paginationAria: "Paginação de conteúdos",
  youtubeEyebrow: "Canal oficial",
  youtubeTitle: "Mais conversas sobre IA corporativa.",
  youtubeBody:
    "Assista ao canal oficial da Onsmart.AI enquanto novos conteúdos são preparados pela equipe.",
  openYoutube: "Abrir YouTube",
  cmsLoadingDetail: "Consultando os snapshots públicos disponíveis no CMS.",
  noMatchTitle: "Nenhum conteúdo corresponde a esta seleção.",
  noMatchBody: "Tente outro assunto, formato ou termo de busca.",
  pendingApprovedNote:
    "O texto completo permanece privado até a autorização de publicação.",
  pendingReviewNote:
    "Aprovação pendente. O texto ainda não está disponível.",
  resultsOne: "resultado nesta seleção.",
  resultsMany: "resultados nesta seleção.",
  readText: "Ler texto",
  readOnLinkedIn: "Ler no LinkedIn",
  aiInsiderNewsletter: "Newsletter AI Insider Brazil",
  pubPendingAria: "Publicação pendente",
  approvalPendingAria: "Aprovação pendente",
  pendingShort: "Aprovação pendente",
};

const en: BlogPageCopy = {
  pageEyebrow: "Content · Onsmart.AI Blog",
  exploreContents: "Explore content",
  visitYoutube: "Visit official YouTube",
  focusEyebrow: "Featured content",
  focusTitle: "Knowledge to decide your next step.",
  focusIntro:
    "Published articles and authorized previews, organized by topic and format.",
  publishedCount: "published",
  inReview: "under review",
  approvedPending: "approved · publication pending",
  searchLabel: "Search by title, author, or topic",
  searchPlaceholder: "E.g. governance, agents, adoption",
  formatLabel: "Format",
  topicsLabel: "Topics",
  allTopics: "All",
  filterTopicsAria: "Filter by topic",
  featured: "Featured",
  published: "Published",
  moreContents: "More content",
  paginationAria: "Content pagination",
  youtubeEyebrow: "Official channel",
  youtubeTitle: "More conversations about corporate AI.",
  youtubeBody:
    "Watch the official Onsmart.AI channel while new content is prepared by the team.",
  openYoutube: "Open YouTube",
  cmsLoadingDetail: "Loading public snapshots available from the CMS.",
  noMatchTitle: "No content matches this selection.",
  noMatchBody: "Try another topic, format, or search term.",
  pendingApprovedNote:
    "The full text remains private until publication is authorized.",
  pendingReviewNote: "Approval pending. The text is not available yet.",
  resultsOne: "result in this selection.",
  resultsMany: "results in this selection.",
  readText: "Read article",
  readOnLinkedIn: "Read on LinkedIn",
  aiInsiderNewsletter: "AI Insider Brazil newsletter",
  pubPendingAria: "Publication pending",
  approvalPendingAria: "Approval pending",
  pendingShort: "Approval pending",
};

const es: BlogPageCopy = {
  pageEyebrow: "Contenido · Blog Onsmart.AI",
  exploreContents: "Explorar contenidos",
  visitYoutube: "Visitar YouTube oficial",
  focusEyebrow: "Contenido destacado",
  focusTitle: "Conocimiento para decidir el siguiente paso.",
  focusIntro:
    "Artículos publicados y vistas previas autorizadas, organizados por tema y formato.",
  publishedCount: "publicados",
  inReview: "en revisión",
  approvedPending: "aprobados · publicación pendiente",
  searchLabel: "Buscar por título, autor o tema",
  searchPlaceholder: "Ej.: gobernanza, agentes, adopción",
  formatLabel: "Formato",
  topicsLabel: "Temas",
  allTopics: "Todos",
  filterTopicsAria: "Filtrar por tema",
  featured: "Destacado",
  published: "Publicado",
  moreContents: "Más contenidos",
  paginationAria: "Paginación de contenidos",
  youtubeEyebrow: "Canal oficial",
  youtubeTitle: "Más conversas sobre IA corporativa.",
  youtubeBody:
    "Vea el canal oficial de Onsmart.AI mientras el equipo prepara nuevos contenidos.",
  openYoutube: "Abrir YouTube",
  cmsLoadingDetail: "Consultando snapshots públicos disponibles en el CMS.",
  noMatchTitle: "Ningún contenido coincide con esta selección.",
  noMatchBody: "Pruebe otro tema, formato o término de búsqueda.",
  pendingApprovedNote:
    "El texto completo permanece privado hasta la autorización de publicación.",
  pendingReviewNote:
    "Aprobación pendiente. El texto aún no está disponible.",
  resultsOne: "resultado en esta selección.",
  resultsMany: "resultados en esta selección.",
  readText: "Leer texto",
  readOnLinkedIn: "Leer en LinkedIn",
  aiInsiderNewsletter: "Newsletter AI Insider Brazil",
  pubPendingAria: "Publicación pendiente",
  approvalPendingAria: "Aprobación pendiente",
  pendingShort: "Aprobación pendiente",
};

export const BLOG_PAGE_COPY: Record<SiteLocale, BlogPageCopy> = {
  "pt-BR": pt,
  en,
  es,
};
