import type { SiteLocale } from "@shared/locale";
import media from "./brand-media.json";
export type MediaPreview = {
  id: string;
  title: string;
  author: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  sourceUrl: string;
  state: string;
};

const previews: Record<SiteLocale, MediaPreview[]> = {
  "pt-BR": [
    {
      id: "ricardo-na-confraria",
      title: "Ricardo Palomar na Confraria com Thiago Nigro e Bruno Perini",
      author: "Redação Onsmart.AI",
      summary:
        "Empreendedorismo, gestão e liderança em uma conversa com Ricardo Palomar na Confraria. O registro reúne conhecimento e troca de experiências para o ambiente empresarial.",
      imageUrl: media.confraria.url,
      imageAlt: media.confraria.alt,
      sourceUrl: "",
      state: "Onsmart na mídia",
    },
    {
      id: "lancamento-sonia",
      title: "SON.IA: da conversa à operação",
      author: "Redação Onsmart.AI",
      summary:
        "Conheça a proposta da plataforma que conecta conversas, agentes, sistemas e processos, com regras e supervisão humana para apoiar a operação das empresas.",
      imageUrl: media.sonia.url,
      imageAlt: media.sonia.alt,
      sourceUrl: "https://lnkd.in/p/dcygKB2R",
      state: "Plataforma SON.IA",
    },
    {
      id: "esporte-e-inclusao",
      title: "Esporte, inclusão e comunidade: apoio ao vôlei adaptado",
      author: "Redação Onsmart.AI",
      summary:
        "A Onsmart.AI apoia a equipe de Vôlei Adaptado de Paulínia. Um registro sobre participação na comunidade e a importância do esporte, sem atribuir placares ou datas não confirmados.",
      imageUrl: media.volei.url,
      imageAlt: media.volei.alt,
      sourceUrl: "https://lnkd.in/p/dxKtuzUq",
      state: "Comunidade",
    },
  ],
  en: [
    {
      id: "ricardo-na-confraria",
      title: "Ricardo Palomar on Confraria with Thiago Nigro and Bruno Perini",
      author: "Onsmart.AI Editorial",
      summary:
        "Entrepreneurship, management, and leadership in a conversation with Ricardo Palomar on Confraria. The record brings together knowledge and experience sharing for the business environment.",
      imageUrl: media.confraria.url,
      imageAlt: media.confraria.alt,
      sourceUrl: "",
      state: "Onsmart in the media",
    },
    {
      id: "lancamento-sonia",
      title: "SON.IA: from conversation to operations",
      author: "Onsmart.AI Editorial",
      summary:
        "Discover the platform that connects conversations, agents, systems, and processes, with rules and human oversight to support business operations.",
      imageUrl: media.sonia.url,
      imageAlt: media.sonia.alt,
      sourceUrl: "https://lnkd.in/p/dcygKB2R",
      state: "SON.IA platform",
    },
    {
      id: "esporte-e-inclusao",
      title: "Sport, inclusion, and community: support for adaptive volleyball",
      author: "Onsmart.AI Editorial",
      summary:
        "Onsmart.AI supports the Paulínia adaptive volleyball team. A record of community participation and the importance of sport, without attributing unconfirmed scores or dates.",
      imageUrl: media.volei.url,
      imageAlt: media.volei.alt,
      sourceUrl: "https://lnkd.in/p/dxKtuzUq",
      state: "Community",
    },
  ],
  es: [
    {
      id: "ricardo-na-confraria",
      title:
        "Ricardo Palomar en Confraria con Thiago Nigro y Bruno Perini",
      author: "Redacción Onsmart.AI",
      summary:
        "Emprendimiento, gestión y liderazgo en una conversación con Ricardo Palomar en Confraria. El registro reúne conocimiento e intercambio de experiencias para el entorno empresarial.",
      imageUrl: media.confraria.url,
      imageAlt: media.confraria.alt,
      sourceUrl: "",
      state: "Onsmart en los medios",
    },
    {
      id: "lancamento-sonia",
      title: "SON.IA: de la conversación a la operación",
      author: "Redacción Onsmart.AI",
      summary:
        "Conozca la propuesta de la plataforma que conecta conversaciones, agentes, sistemas y procesos, con reglas y supervisión humana para apoyar la operación de las empresas.",
      imageUrl: media.sonia.url,
      imageAlt: media.sonia.alt,
      sourceUrl: "https://lnkd.in/p/dcygKB2R",
      state: "Plataforma SON.IA",
    },
    {
      id: "esporte-e-inclusao",
      title: "Deporte, inclusión y comunidad: apoyo al vóley adaptado",
      author: "Redacción Onsmart.AI",
      summary:
        "Onsmart.AI apoya al equipo de Vóley Adaptado de Paulínia. Un registro sobre participación en la comunidad y la importancia del deporte, sin atribuir marcadores o fechas no confirmados.",
      imageUrl: media.volei.url,
      imageAlt: media.volei.alt,
      sourceUrl: "https://lnkd.in/p/dxKtuzUq",
      state: "Comunidad",
    },
  ],
};

export function getApprovedMediaPreviews(locale: SiteLocale): MediaPreview[] {
  return previews[locale];
}

/** @deprecated Use getApprovedMediaPreviews(locale) */
export const approvedMediaPreviews = previews["pt-BR"];
