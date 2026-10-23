import brandMedia from "./brand-media.json";
export const whatsappMessage =
  "Olá! Conheci a Onsmart.AI pelo site e gostaria de conversar com um especialista sobre soluções de inteligência artificial para minha empresa.";
export const WHATSAPP = `https://wa.me/5511930683562?text=${encodeURIComponent(whatsappMessage)}`;
export const MISSION =
  "Tornar a IA corporativa simples de adotar, confiável para operar e governável para escalar.";
export const HERO_TITLE =
  "IA corporativa sem mistério: entenda, implante na sua empresa e veja o valor na operação.";
export const HERO_SUBTITLE =
  "Educação, consultoria e o Ecossistema SON.IA para a sua empresa adotar IA de forma simples, confiável e governável.";
export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/onsmart.ai/" },
  { label: "LinkedIn", href: "https://br.linkedin.com/company/onsmartai" },
  { label: "YouTube", href: "https://www.youtube.com/@onsmartai" },
  { label: "Facebook", href: "https://www.facebook.com/onsmart2017/" },
];
export type Solution = {
  slug: string;
  title: string;
  category: "Educação" | "Serviços" | "Plataforma";
  description: string;
  audience: string;
  detail: string;
  cta: string;
};
export const solutions: Solution[] = [
  {
    slug: "palestras-em-ia",
    title: "Palestras em IA",
    category: "Educação",
    description:
      "O que a IA já resolve nas empresas, com demonstrações ao vivo de agentes em operação na SON.IA.",
    audience: "Eventos, convenções e reuniões de diretoria.",
    detail:
      "Conteúdo para aproximar líderes e equipes das possibilidades reais da inteligência artificial no ambiente corporativo.",
    cta: "Saiba mais",
  },
  {
    slug: "imersao-em-ia",
    title: "Imersão em IA",
    category: "Educação",
    description:
      "Uma jornada intensiva para sair com casos de uso priorizados e um plano de implantação claro.",
    audience:
      "Equipes que precisam transformar interesse em um próximo passo estruturado.",
    detail:
      "Conecta os desafios da equipe ao que a plataforma SON.IA já executa, com foco na adoção e na operação.",
    cta: "Saiba mais",
  },
  {
    slug: "capacitacao-de-lideres",
    title: "Capacitação de Líderes em IA",
    category: "Educação",
    description:
      "Estratégia, priorização, business case, riscos e governança para quem vai patrocinar a IA na empresa.",
    audience: "Diretores e gestores.",
    detail:
      "O objetivo é que cada líder desenvolva o roadmap de IA da sua área e conduza decisões com mais clareza.",
    cta: "Saiba mais",
  },
  {
    slug: "academia",
    title: "Academia Onsmart.AI",
    category: "Educação",
    description:
      "Cursos gravados em três níveis: da IA generativa e engenharia de prompt ao desenho e à gestão de agentes.",
    audience: "Profissionais, gestores e empresas. Sem exigir programação.",
    detail:
      "Licença individual ou por colaborador, com 12 meses de acesso. Comece pelo curso introdutório gratuito.",
    cta: "Conhecer cursos",
  },
  {
    slug: "educacao-corporativa",
    title: "Educação Corporativa em IA",
    category: "Educação",
    description:
      "Programa anual de formação, com trilhas por nível de maturidade e acompanhamento contínuo da adoção.",
    audience: "Empresas que querem desenvolver competências de forma contínua.",
    detail:
      "Uma jornada de aprendizagem conectada ao estágio da empresa e à adoção de IA no trabalho.",
    cta: "Saiba mais",
  },
  {
    slug: "consultoria-em-ia",
    title: "Consultoria em IA",
    category: "Serviços",
    description:
      "Mapeamento de processos, priorização de casos de uso e desenho da arquitetura de IA da operação.",
    audience: "Empresas que querem estruturar a adoção de IA com governança.",
    detail:
      "Da estratégia à implementação, considerando os objetivos empresariais e a realidade dos processos.",
    cta: "Conhecer consultoria",
  },
  {
    slug: "apps-e-agentes",
    title: "Desenvolvimento de Apps e Agentes de IA",
    category: "Serviços",
    description:
      "Aplicativos, agentes e plataformas de IA desenvolvidos sob medida para demandas específicas da empresa.",
    audience: "Empresas com requisitos próprios de tecnologia e operação.",
    detail:
      "Projetos customizados, independentes da plataforma SON.IA, do levantamento de requisitos à entrega.",
    cta: "Saiba mais",
  },
  {
    slug: "sonia",
    title: "SON.IA — Plataforma de IA Operacional",
    category: "Plataforma",
    description:
      "Conecta conversas, agentes, sistemas e processos para transformar interações contínuas em ações de negócio governadas.",
    audience:
      "Empresas que querem conectar inteligência artificial à operação.",
    detail:
      "Tudo o que você aprende nos nossos programas, você coloca em operação aqui.",
    cta: "Conhecer a SON.IA",
  },
];
export const solutionHref = (slug: string) => `/servicos/${slug}`;
export const clients = [
  "Nestlé",
  "Coca-Cola",
  "Colgate-Palmolive",
  "Globo",
  "Fresenius Kabi",
  "Clarios",
  "Tronox",
  "Sotreq CAT",
  "Nissin",
  "Softys",
  "Holambra",
  "DB Diagnóstico",
  "Radix",
  "Metagal",
  "Radil Alimentos",
  "CSI Cargo",
  "Bravo Serviços Logísticos",
  "GrupoSC",
  "Consistec e Celer",
  "Avivar",
  "NTK",
  "P.S.C.A.",
];
export const processSteps = [
  {
    title: "Recebe",
    text: "Centraliza conversas e eventos vindos dos canais da operação.",
  },
  {
    title: "Compreende",
    text: "Consulta conhecimento autorizado e identifica contexto, intenção e dados necessários.",
  },
  {
    title: "Decide",
    text: "Segue regras, permissões e caminhos definidos para cada processo.",
  },
  {
    title: "Age",
    text: "Registra, consulta, atualiza ou aciona sistemas conectados.",
  },
  {
    title: "Supervisiona",
    text: "Mantém rastreabilidade e encaminha exceções para a pessoa responsável.",
  },
];
export const pillars = [
  {
    title: "Simples de adotar",
    text: "Começar por um processo prioritário e evoluir por etapas.",
  },
  {
    title: "Confiável para operar",
    text: "Conhecimento autorizado, regras, permissões e supervisão humana sustentam a operação.",
  },
  {
    title: "Governável para escalar",
    text: "Responsáveis, aprovações, registros e tratamento de exceções fazem parte do fluxo.",
  },
];
export const companies = [
  {
    id: "tech",
    name: "Onsmart Tech",
    state: "Conteúdo institucional em validação",
    text: "A apresentação oficial desta empresa será incorporada após validação dos materiais do Grupo Onsmart.",
  },
  {
    id: "ai",
    name: "Onsmart.AI",
    state: "Educação, serviços e plataforma de IA",
    text: "Educação, consultoria, desenvolvimento personalizado e o Ecossistema SON.IA para empresas adotarem inteligência artificial com governança.",
  },
  {
    id: "growth",
    name: "Onsmart.AI Growth Lab",
    state: "Conteúdo institucional em validação",
    text: "As soluções e os diferenciais serão apresentados com base nos materiais oficiais da empresa.",
  },
  {
    id: "robotics",
    name: "Onsmart.AI Robotics",
    state: "Em breve",
    text: "Em breve.",
  },
];
export type Editorial = {
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  source?: string;
  state: string;
  image?: string;
};
export const editorial: Editorial[] = [
  {
    slug: "lancamento-sonia",
    type: "Notícias",
    title: "SON.IA: da conversa à operação",
    excerpt:
      "O lançamento da plataforma reúne inteligência artificial, processos e ações governadas no ambiente empresarial.",
    source: "https://lnkd.in/p/dcygKB2R",
    state: "Fonte oficial • data editorial pendente",
    image: brandMedia.sonia.url,
  },
  {
    slug: "esporte-e-inclusao",
    type: "Onsmart na mídia",
    title: "Esporte, inclusão e comunidade",
    excerpt:
      "A Onsmart apoia a equipe de Vôlei Adaptado de Paulínia. Conheça o registro oficial sobre a participação da equipe.",
    source: "https://lnkd.in/p/dxKtuzUq",
    state: "Fonte oficial • data editorial pendente",
    image: brandMedia.volei.url,
  },
  {
    slug: "ricardo-na-confraria",
    type: "Onsmart na mídia",
    title: "Conhecimento que se constrói em boas conversas",
    excerpt:
      "Ricardo Palomar na Confraria: empreendedorismo, gestão e liderança. Pauta fornecida para revisão institucional.",
    state: "Pauta em validação • não publicada",
    image: brandMedia.confraria.url,
  },
  {
    slug: "video-sonia",
    type: "Vídeos",
    title: "Conheça o lançamento da SON.IA",
    excerpt:
      "Assista ao vídeo de lançamento da plataforma no canal oficial da Onsmart.AI.",
    source: "https://www.youtube.com/watch?v=UNXZ-t2ibqw",
    state: "Vídeo no canal oficial",
    image: brandMedia.sonia.url,
  },
];
export const metadata: Record<string, { title: string; description: string }> =
  {
    "/": {
      title: "Onsmart.AI | IA corporativa sem mistério",
      description: HERO_SUBTITLE,
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
        "Explore artigos sobre adoção, governança e agentes de IA para empresas. Conhecimento claro para decisões e operações mais responsáveis.",
    },
    "/contato": {
      title: "Fale com a Onsmart.AI | Inteligência Artificial",
      description:
        "Converse com a Onsmart.AI sobre educação, consultoria e o próximo passo da IA na sua empresa.",
    },
  };
