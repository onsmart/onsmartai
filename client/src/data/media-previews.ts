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
export const approvedMediaPreviews: MediaPreview[] = [
  {
    id: "ricardo-na-confraria",
    title: "Ricardo Palomar na Confraria com Thiago Nigro e Bruno Perini",
    author: "Redação Onsmart.AI",
    summary:
      "Empreendedorismo, gestão e liderança em uma conversa com Ricardo Palomar na Confraria. O registro reúne conhecimento e troca de experiências para o ambiente empresarial.",
    imageUrl: media.confraria.url,
    imageAlt: media.confraria.alt,
    sourceUrl: "",
    state: "Conteúdo em revisão",
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
    state: "Conteúdo em revisão",
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
    state: "Conteúdo em revisão",
  },
];
