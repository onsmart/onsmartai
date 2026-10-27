import type { SiteLocale } from "@shared/locale";
import { LANDING_PAGE, type LandingPageCopy } from "./landing-page";
import { UI_MESSAGES, type UiMessages } from "./messages";

export type SiteCopy = UiMessages & {
  landingPage: LandingPageCopy;
  errors: {
    pageUnavailableTitle: string;
    pageUnavailableBody: string;
    backHome: string;
    notFoundEyebrow: string;
    notFoundTitle: string;
    notFoundBody: string;
    articleNotFoundTitle: string;
    articleNotFoundDescription: string;
    legalNotFoundTitle: string;
    skipToContent: string;
    adminTitle: string;
    adminDescription: string;
  };
  a11y: {
    readArticle: string;
    articleIndex: string;
    breadcrumbs: string;
    pauseVideo: string;
    playVideo: string;
    pauseCarousel: string;
    resumeCarousel: string;
    clientLogos: string;
    openSonia: string;
  };
  blog: {
    heroTitleDefault: string;
    heroSummaryDefault: string;
    allFormats: string;
    loading: string;
    loadErrorTitle: string;
    loadErrorBody: string;
    clearFilters: string;
    emptyTitle: string;
    emptyBodyFiltered: string;
    emptyBodyDefault: string;
    editorialRead: string;
    editorialPreview: string;
    reviewApproved: string;
    reviewPending: string;
    topicAdoption: string;
    topicGovernance: string;
    topicAgents: string;
    contentEyebrow: string;
    backToHub: string;
    missingLoading: string;
    missingTitle: string;
    missingBody: string;
    availableInPortuguese: string;
    searchPlaceholder: string;
    previousPage: string;
    nextPage: string;
    pageOf: string;
  };
  consent: {
    bannerLabel: string;
    bannerTitle: string;
    bannerBody: string;
    acceptAll: string;
    rejectNonEssential: string;
    personalize: string;
    dialogTitle: string;
    dialogDescription: string;
    closePreferences: string;
    essentialTitle: string;
    essentialBody: string;
    essentialTag: string;
    analyticsTitle: string;
    analyticsBody: string;
    marketingTitle: string;
    marketingBody: string;
    save: string;
    privacyLink: string;
    storageBlocked: string;
  };
  sonia: {
    title: string;
    subtitle: string;
    suggestion1Label: string;
    suggestion1Text: string;
    suggestion1Cta: string;
    suggestion2Label: string;
    suggestion2Text: string;
    suggestion2Cta: string;
    suggestion3Label: string;
    suggestion3Text: string;
    suggestion3Cta: string;
    close: string;
  };
  commercial: {
    faqEyebrow: string;
    faqTitle: string;
    faqLead: string;
    closingEyebrow: string;
    homeBreadcrumb: string;
    learnMore: string;
    partnersProgram: string;
    partnersFindMode: string;
    partnersCta: string;
    partnersStatus: string;
    partnersNotReadyTitle: string;
    partnersNotReadyBody: string;
    partnersTalkTeam: string;
    modeAgent: string;
    modeResale: string;
    modeWhiteLabel: string;
    closingTitlePartners: string;
    closingTitleDefault: string;
    closingBody: string;
    whatsappNotice: string;
    soniaHeroTagline: string;
    solutionNotFoundEyebrow: string;
    solutionNotFoundTitle: string;
    solutionNotFoundBody: string;
    exploreSolutions: string;
  };
  legal: {
    eyebrow: string;
    privacyTitle: string;
    privacyIntro: string;
    termsTitle: string;
    termsIntro: string;
    updatedAt: string;
  };
  whatsapp: {
    defaultMessage: string;
    partnersMessage: string;
    solutionMessage: string;
  };
  home: {
    heroLine1: string;
    heroLine2: string;
    heroLine3: string;
    heroSubtitle: string;
  };
  about: {
    timelineA11y: string;
    portraitCaption: string;
    soniaLaunchTitle: string;
  };
  contact: {
    flowAria: string;
    matrixLabel: string;
    branchLabel: string;
  };
  shell: {
    missionEyebrow: string;
    missionCtaExpert: string;
    missionCtaAbout: string;
    processLabel: string;
    processConceptTag: string;
    processA11y: string;
    processSupervision: string;
    heroRuleTag: string;
    heroRuleLine: string;
    editorialReadAria: string;
    editorialThumbAlt: string;
    editorialCommunity: string;
    editorialConnections: string;
    editorialPhotoPending: string;
    ecosystemChartA11y: string;
    ecosystemGroupRoot: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    text: string;
    explorePortfolio: string;
    findNextStep: string;
    selectSolutionA11y: string;
    soniaCaption: string;
    photoCaption: string;
    notice: string;
    portfolioBlurb: string;
  };
  services: {
    filterA11y: string;
    categoriesA11y: string;
    filterAll: string;
    filterEducation: string;
    filterServices: string;
    filterPlatform: string;
    portfolioEyebrow: string;
    portfolioTitle: string;
    portfolioText: string;
    exploreCategory: string;
    categoryEducationKicker: string;
    categoryEducationTitle: string;
    categoryEducationText: string;
    categoryServicesKicker: string;
    categoryServicesTitle: string;
    categoryServicesText: string;
    categoryPlatformKicker: string;
    categoryPlatformTitle: string;
    categoryPlatformText: string;
    cardAudience: string;
    notice: string;
  };
  media: {
    byAuthor: string;
    officialSource: string;
  };
  footer: {
    leadersInAI: string;
    customApps: string;
  };
  commercialPage: {
    servicesBreadcrumb: string;
    commercialStatus: string;
    visitOfficialSite: string;
    understandSolution: string;
    subnavSolution: string;
    subnavAudience: string;
    subnavHow: string;
    subnavScope: string;
    subnavFaq: string;
    subnavNext: string;
    contextEyebrow: string;
    contextLink: string;
    solutionEyebrow: string;
    audienceEyebrow: string;
    howEyebrow: string;
    scopeEyebrow: string;
    relatedEyebrow: string;
    relatedTitle: string;
    soniaBrandAlt: string;
    partnersSubnavProgram: string;
    partnersSubnavModes: string;
    partnersSubnavNext: string;
    partnersSubnavContact: string;
    partnersModesA11y: string;
    partnersContextEyebrow: string;
    partnersAudienceEyebrow: string;
    partnersAudienceTitle: string;
    partnersAudienceLead: string;
    partnersModesEyebrow: string;
    partnersModesTitle: string;
    partnersModesLead: string;
    partnersModeWhat: string;
    partnersModeAudience: string;
    partnersModeNext: string;
    partnersNextEyebrow: string;
    partnersNextTitle: string;
    partnersNextLead: string;
    partnersBookingTitle: string;
    partnersBookingBody: string;
    partnersBookingPending: string;
    partnersRelatedEyebrow: string;
    partnersRelatedTitle: string;
    partnersExplorePortfolio: string;
    partnersExploreEcosystem: string;
    partnersPendingSummary: string;
    partnersModesNotice: string;
  };
};

const extraPt = {
  errors: {
    pageUnavailableTitle: "Página não disponível.",
    pageUnavailableBody: "Esta página não está disponível no momento.",
    backHome: "Voltar à Home",
    notFoundEyebrow: "404 · Página não encontrada",
    notFoundTitle: "Vamos encontrar o seu próximo passo?",
    notFoundBody: "Verifique o endereço ou volte à página inicial.",
    articleNotFoundTitle: "Página não encontrada | Onsmart.AI",
    articleNotFoundDescription:
      "Esta página não está disponível no site Onsmart.AI.",
    legalNotFoundTitle: "Documento não encontrado",
    skipToContent: "Ir para o conteúdo",
    adminTitle: "CMS Onsmart.AI | Administração",
    adminDescription: "Painel administrativo protegido da Onsmart.AI.",
  },
  a11y: {
    readArticle: "Ler {title}",
    articleIndex: "Índice do artigo",
    breadcrumbs: "Caminho de navegação",
    pauseVideo: "Pausar vídeo de fundo",
    playVideo: "Reproduzir vídeo de fundo",
    pauseCarousel: "Pausar carrossel de clientes",
    resumeCarousel: "Retomar carrossel de clientes",
    clientLogos: "Logotipos de clientes Onsmart.AI",
    openSonia: "Abrir assistente SON.IA",
  },
  blog: {
    heroTitleDefault: "IA corporativa: conhecimento que vira operação.",
    heroSummaryDefault:
      "Artigos para compreender, adotar e governar inteligência artificial nas empresas.",
    allFormats: "Todas",
    loading: "Carregando o conteúdo editorial…",
    loadErrorTitle: "Não foi possível atualizar o conteúdo.",
    loadErrorBody: "Tente novamente em instantes.",
    clearFilters: "Limpar filtros",
    emptyTitle: "Nenhum resultado encontrado",
    emptyBodyFiltered: "Ajuste os filtros ou a busca para ver mais conteúdos.",
    emptyBodyDefault:
      "Ainda não há conteúdo editorial disponível. As prévias dependem de aprovação editorial.",
    editorialRead: "Leitura editorial",
    editorialPreview: "Prévia editorial",
    reviewApproved: "Aprovado — publicação pendente",
    reviewPending: "Em revisão",
    topicAdoption: "Adoção de IA",
    topicGovernance: "Governança",
    topicAgents: "Agentes de IA",
    contentEyebrow: "Conteúdo",
    backToHub: "Voltar à central",
    missingLoading: "Carregando conteúdo…",
    missingTitle: "Conteúdo não disponível.",
    missingBody:
      "Este conteúdo não está publicado ou não está disponível nesta URL.",
    availableInPortuguese: "Disponível apenas em português",
    searchPlaceholder: "Buscar por tema, título ou autor",
    previousPage: "Página anterior",
    nextPage: "Próxima página",
    pageOf: "Página {current} de {total}",
  },
  consent: {
    bannerLabel: "Preferências de privacidade",
    bannerTitle: "Sua privacidade importa.",
    bannerBody:
      "Usamos cookies essenciais e, com a sua autorização, cookies de análise e marketing. Você pode alterar suas preferências a qualquer momento.",
    acceptAll: "Aceitar todos",
    rejectNonEssential: "Rejeitar não essenciais",
    personalize: "Personalizar",
    dialogTitle: "Preferências de cookies",
    dialogDescription:
      "Você decide quais categorias autorizar. Cookies essenciais permanecem ativos para o funcionamento do site.",
    closePreferences: "Fechar preferências",
    essentialTitle: "Essenciais",
    essentialBody: "Armazenam apenas a sua escolha de consentimento.",
    essentialTag: "Sempre ativos",
    analyticsTitle: "Analytics",
    analyticsBody: "Ajudam a entender como o site é utilizado e a melhorá-lo.",
    marketingTitle: "Marketing",
    marketingBody: "Permitem personalizar comunicações e medir campanhas.",
    save: "Salvar preferências",
    privacyLink: "Saiba mais na política de privacidade",
    storageBlocked:
      "Seu navegador não permitiu salvar as preferências. Sua escolha vale apenas nesta visita.",
  },
  sonia: {
    title: "SON.IA",
    subtitle: "Assistente de orientação",
    suggestion1Label: "Por onde minha empresa começa?",
    suggestion1Text:
      "Você pode começar pela capacitação ou pelo mapeamento de um processo prioritário.",
    suggestion1Cta: "Explorar as soluções",
    suggestion2Label: "O que é a SON.IA?",
    suggestion2Text:
      "A SON.IA é a plataforma de IA operacional que conecta conversas, agentes, sistemas e processos.",
    suggestion2Cta: "Conhecer a plataforma",
    suggestion3Label: "Quero falar com um especialista",
    suggestion3Text:
      "O atendimento comercial está disponível pelo WhatsApp oficial da Onsmart.AI.",
    suggestion3Cta: "Abrir WhatsApp comercial",
    close: "Fechar assistente",
  },
  commercial: {
    faqEyebrow: "Dúvidas frequentes",
    faqTitle: "Clareza antes do próximo passo.",
    faqLead:
      "Respostas objetivas sobre escopo, formato e próximos passos com a equipe comercial.",
    closingEyebrow: "Seu próximo passo",
    homeBreadcrumb: "Home",
    learnMore: "Saiba mais",
    partnersProgram: "Programa de Parcerias",
    partnersFindMode: "Encontrar minha modalidade",
    partnersCta: "Quero ser parceiro",
    partnersStatus:
      "Modalidades e condições são definidas em conversa com a equipe Onsmart.AI.",
    partnersNotReadyTitle: "Programa de Parcerias",
    partnersNotReadyBody: "A página está sendo preparada para revisão.",
    partnersTalkTeam: "Falar com a equipe",
    modeAgent: "Agente Digital",
    modeResale: "Revenda",
    modeWhiteLabel: "White Label",
    closingTitlePartners: "Uma conversa para entender a parceria.",
    closingTitleDefault: "Vamos conectar esta solução ao seu contexto?",
    closingBody:
      "Escolha o contato direto com a equipe ou preencha o formulário de qualificação. A proposta comercial depende de entender seu interesse e as necessidades da sua operação.",
    whatsappNotice:
      "O WhatsApp abre em nova janela. O formulário envia seu interesse à equipe comercial da Onsmart.AI.",
    soniaHeroTagline: "Conversas. Agentes. Sistemas. Processos.",
    solutionNotFoundEyebrow: "Solução não encontrada",
    solutionNotFoundTitle: "Vamos encontrar o caminho adequado?",
    solutionNotFoundBody:
      "Consulte o portfólio de educação, serviços e plataforma.",
    exploreSolutions: "Explorar soluções",
  },
  legal: {
    eyebrow: "Documento legal",
    privacyTitle: "Política de privacidade",
    privacyIntro:
      "Como a Onsmart.AI trata dados pessoais no site, em formulários e preferências de cookies, em conformidade com a LGPD.",
    termsTitle: "Termos de uso",
    termsIntro:
      "Condições para navegação e uso dos conteúdos e serviços apresentados no site da Onsmart.AI.",
    updatedAt: "Última atualização: {date}",
  },
  whatsapp: {
    defaultMessage:
      "Olá! Conheci a Onsmart.AI pelo site e gostaria de conversar com um especialista sobre soluções de inteligência artificial para minha empresa.",
    partnersMessage:
      "Olá! Conheci o programa de parcerias da Onsmart.AI e gostaria de conversar sobre as modalidades disponíveis.",
    solutionMessage:
      "Olá! Conheci a solução {solution} no site da Onsmart.AI e gostaria de conversar com a equipe sobre o próximo passo.",
  },
  home: {
    heroLine1: "IA corporativa",
    heroLine2: "sem mistério:",
    heroLine3:
      "entenda, implante na sua empresa e veja o valor na operação.",
    heroSubtitle:
      "Educação, consultoria e o Ecossistema SON.IA para a sua empresa adotar IA de forma simples, confiável e governável.",
  },
  about: {
    timelineA11y: "Linha do tempo institucional",
    portraitCaption: "Ricardo Palomar · fotografia fornecida para esta página.",
    soniaLaunchTitle: "Lançamento da SON.IA",
  },
  contact: {
    flowAria: "Como funciona o contato",
    matrixLabel: "Matriz",
    branchLabel: "Filial",
  },
  shell: {
    missionEyebrow: "Nossa missão",
    missionCtaExpert: "Falar com especialista",
    missionCtaAbout: "Conheça nossa história",
    processLabel: "Fluxo operacional",
    processConceptTag: "Diagrama conceitual",
    processA11y: "Etapas do processo SON.IA",
    processSupervision:
      "Regras, permissões e supervisão humana em todo o fluxo.",
    heroRuleTag: "ONSMART.AI",
    heroRuleLine: "Conhecimento. Estratégia. Operação.",
    editorialReadAria: "Ler: {title}",
    editorialThumbAlt: "Miniatura do vídeo oficial de lançamento da SON.IA",
    editorialCommunity: "COMUNIDADE",
    editorialConnections: "CONEXÕES",
    editorialPhotoPending: "Fotografia oficial pendente",
    ecosystemChartA11y: "Diagrama do Grupo Onsmart",
    ecosystemGroupRoot: "Grupo Onsmart",
  },
  showcase: {
    eyebrow: "Do aprendizado à operação",
    title: "Produtos de IA para empresas",
    text:
      "Programas para a sua empresa entender, adotar e governar a IA, e uma plataforma para colocar tudo em operação.",
    explorePortfolio: "Explorar o portfólio",
    findNextStep: "Encontre o próximo passo.",
    selectSolutionA11y: "Selecionar uma solução de IA",
    soniaCaption:
      "Personagem oficial SON.IA · sem simular a interface da plataforma.",
    photoCaption:
      "Fotografia ilustrativa · não representa a equipe ou um evento da Onsmart.",
    notice:
      "Cada solução tem página dedicada com escopo, público e formas de contato com a equipe Onsmart.AI.",
    portfolioBlurb:
      "Educação, serviços e plataforma para diferentes etapas da sua empresa.",
  },
  services: {
    filterA11y: "Filtro de soluções",
    categoriesA11y: "Categorias do portfólio",
    filterAll: "Todas",
    filterEducation: "Educação",
    filterServices: "Serviços",
    filterPlatform: "Plataforma",
    portfolioEyebrow: "Portfólio",
    portfolioTitle: "Encontre o próximo passo da sua empresa.",
    portfolioText:
      "Navegue por educação, serviços e plataforma. Cada solução tem página dedicada com escopo, público e formas de contato.",
    exploreCategory: "Explorar categoria",
    categoryEducationKicker: "01 / Educação",
    categoryEducationTitle: "Aprender para decidir melhor.",
    categoryEducationText:
      "Jornadas para aproximar pessoas, lideranças e empresas das possibilidades reais da IA corporativa.",
    categoryServicesKicker: "02 / Serviços",
    categoryServicesTitle: "Estruturar a mudança na operação.",
    categoryServicesText:
      "Consultoria e desenvolvimento para transformar desafios empresariais em caminhos de implementação.",
    categoryPlatformKicker: "03 / Plataforma",
    categoryPlatformTitle: "Conectar inteligência a processos governados.",
    categoryPlatformText:
      "A SON.IA reúne conversas, agentes, sistemas e processos em uma plataforma de IA operacional.",
    cardAudience: "Público",
    notice:
      "Condições comerciais, disponibilidade e escopo são definidos em proposta com a equipe Onsmart.AI.",
  },
  media: {
    byAuthor: "Por",
    officialSource: "Ver fonte oficial",
  },
  footer: {
    leadersInAI: "Capacitação de Líderes em IA",
    customApps: "Desenvolvimento de Apps e Agentes de IA",
  },
  commercialPage: {
    servicesBreadcrumb: "Serviços",
    commercialStatus:
      "Condições comerciais definidas em proposta com a equipe Onsmart.AI.",
    visitOfficialSite: "Visitar o site oficial",
    understandSolution: "Entender a solução",
    subnavSolution: "A solução",
    subnavAudience: "Para quem",
    subnavHow: "Como funciona",
    subnavScope: "Escopo",
    subnavFaq: "FAQ",
    subnavNext: "Próximo passo",
    contextEyebrow: "O contexto",
    contextLink: "Comece pelo objetivo, não pela ferramenta.",
    solutionEyebrow: "A solução",
    audienceEyebrow: "Para quem",
    howEyebrow: "Como funciona",
    scopeEyebrow: "Escopo e entregas",
    relatedEyebrow: "Continue explorando",
    relatedTitle: "Outras soluções do portfólio",
    soniaBrandAlt: "Marca oficial SON.IA",
    partnersSubnavProgram: "O programa",
    partnersSubnavModes: "Modalidades",
    partnersSubnavNext: "Próximos passos",
    partnersSubnavContact: "Quero ser parceiro",
    partnersModesA11y: "Modalidades de parceria",
    partnersContextEyebrow: "Conexões empresariais",
    partnersAudienceEyebrow: "Para quem",
    partnersAudienceTitle: "Seu conhecimento e sua atuação têm contexto.",
    partnersAudienceLead:
      "O público do programa inclui empreendedores, agências de marketing, prestadores de serviços, gestores e empresas interessadas em comercializar soluções de IA.",
    partnersModesEyebrow: "Escolha seu interesse",
    partnersModesTitle: "Três modalidades. Uma conversa para definir o caminho.",
    partnersModesLead:
      "Selecione a modalidade que deseja conhecer. A seleção orienta o formulário de contato e não implica adesão ou elegibilidade.",
    partnersModeWhat: "O que é",
    partnersModeAudience: "Para quem",
    partnersModeNext: "Próximo passo",
    partnersNextEyebrow: "Próximos passos",
    partnersNextTitle: "Entender antes de assumir um compromisso.",
    partnersNextLead:
      "Fluxo editorial para orientar o primeiro contato. Não substitui os critérios de avaliação nem as condições oficiais do programa.",
    partnersBookingTitle: "Uma conversa com o setor responsável.",
    partnersBookingBody:
      "O espaço de agendamento está preparado. O link oficial será configurado na etapa de integrações, quando disponibilizado.",
    partnersBookingPending: "Agendamento pendente",
    partnersRelatedEyebrow: "Conheça a Onsmart.AI",
    partnersRelatedTitle: "Explore as soluções antes de conversar.",
    partnersExplorePortfolio: "Explorar o portfólio",
    partnersExploreEcosystem: "Conhecer o ecossistema",
    partnersPendingSummary: "Informações pendentes do programa",
    partnersModesNotice:
      "Não foram presumidos percentuais, ganhos, exclusividade, direitos de marca, licenciamento ou condições de White Label.",
  },
};

const extraEn: typeof extraPt = {
  errors: {
    pageUnavailableTitle: "Page unavailable.",
    pageUnavailableBody: "This page is not available at the moment.",
    backHome: "Back to Home",
    notFoundEyebrow: "404 · Page not found",
    notFoundTitle: "Let's find your next step?",
    notFoundBody: "Check the address or return to the home page.",
    articleNotFoundTitle: "Page not found | Onsmart.AI",
    articleNotFoundDescription: "This page is not available on the Onsmart.AI site.",
    legalNotFoundTitle: "Document not found",
    skipToContent: "Skip to content",
    adminTitle: "Onsmart.AI CMS | Administration",
    adminDescription: "Protected Onsmart.AI administration panel.",
  },
  a11y: {
    readArticle: "Read {title}",
    articleIndex: "Article index",
    breadcrumbs: "Breadcrumb",
    pauseVideo: "Pause background video",
    playVideo: "Play background video",
    pauseCarousel: "Pause client carousel",
    resumeCarousel: "Resume client carousel",
    clientLogos: "Onsmart.AI client logos",
    openSonia: "Open SON.IA assistant",
  },
  blog: {
    heroTitleDefault: "Corporate AI: knowledge that becomes operations.",
    heroSummaryDefault:
      "Articles to understand, adopt, and govern artificial intelligence in business.",
    allFormats: "All",
    loading: "Loading editorial content…",
    loadErrorTitle: "Could not refresh content.",
    loadErrorBody: "Please try again shortly.",
    clearFilters: "Clear filters",
    emptyTitle: "No results found",
    emptyBodyFiltered: "Adjust filters or search to see more content.",
    emptyBodyDefault:
      "No editorial content is available yet. Previews depend on editorial approval.",
    editorialRead: "Editorial read",
    editorialPreview: "Editorial preview",
    reviewApproved: "Approved — publication pending",
    reviewPending: "Under review",
    topicAdoption: "AI adoption",
    topicGovernance: "Governance",
    topicAgents: "AI agents",
    contentEyebrow: "Content",
    backToHub: "Back to content hub",
    missingLoading: "Loading content…",
    missingTitle: "Content unavailable.",
    missingBody: "This content is not published or not available at this URL.",
    availableInPortuguese: "Available in Portuguese only",
    searchPlaceholder: "Search by topic, title, or author",
    previousPage: "Previous page",
    nextPage: "Next page",
    pageOf: "Page {current} of {total}",
  },
  consent: {
    bannerLabel: "Privacy preferences",
    bannerTitle: "Your privacy matters.",
    bannerBody:
      "We use essential cookies and, with your consent, analytics and marketing cookies. You can change your preferences at any time.",
    acceptAll: "Accept all",
    rejectNonEssential: "Reject non-essential",
    personalize: "Customize",
    dialogTitle: "Cookie preferences",
    dialogDescription:
      "You choose which categories to allow. Essential cookies remain active for the site to work.",
    closePreferences: "Close preferences",
    essentialTitle: "Essential",
    essentialBody: "Store only your consent choice.",
    essentialTag: "Always on",
    analyticsTitle: "Analytics",
    analyticsBody: "Help us understand how the site is used and improve it.",
    marketingTitle: "Marketing",
    marketingBody: "Allow personalized communications and campaign measurement.",
    save: "Save preferences",
    privacyLink: "Learn more in the privacy policy",
    storageBlocked:
      "Your browser could not save preferences. Your choice applies only to this visit.",
  },
  sonia: {
    title: "SON.IA",
    subtitle: "Guidance assistant",
    suggestion1Label: "Where should my company start?",
    suggestion1Text:
      "You can start with training or mapping a priority process. Education, consulting, and development are available in our portfolio.",
    suggestion1Cta: "Explore solutions",
    suggestion2Label: "What is SON.IA?",
    suggestion2Text:
      "SON.IA is the operational AI platform that connects conversations, agents, systems, and processes with governance.",
    suggestion2Cta: "Discover the platform",
    suggestion3Label: "I want to talk to a specialist",
    suggestion3Text:
      "Commercial support is available through Onsmart.AI's official WhatsApp.",
    suggestion3Cta: "Open commercial WhatsApp",
    close: "Close assistant",
  },
  commercial: {
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Clarity before the next step.",
    faqLead:
      "Straight answers about scope, format, and next steps with the commercial team.",
    closingEyebrow: "Your next step",
    homeBreadcrumb: "Home",
    learnMore: "Learn more",
    partnersProgram: "Partnership program",
    partnersFindMode: "Find my model",
    partnersCta: "Become a partner",
    partnersStatus:
      "Models and terms are defined in conversation with the Onsmart.AI team.",
    partnersNotReadyTitle: "Partnership program",
    partnersNotReadyBody: "This page is being prepared for review.",
    partnersTalkTeam: "Talk to the team",
    modeAgent: "Digital Agent",
    modeResale: "Reseller",
    modeWhiteLabel: "White Label",
    closingTitlePartners: "A conversation to understand the partnership.",
    closingTitleDefault: "Shall we connect this solution to your context?",
    closingBody:
      "Choose direct contact with the team or complete the qualification form. A commercial proposal depends on understanding your interest and operational needs.",
    whatsappNotice:
      "WhatsApp opens in a new window. The form sends your interest to the Onsmart.AI commercial team.",
    soniaHeroTagline: "Conversations. Agents. Systems. Processes.",
    solutionNotFoundEyebrow: "Solution not found",
    solutionNotFoundTitle: "Let's find the right path?",
    solutionNotFoundBody:
      "Browse our education, services, and platform portfolio.",
    exploreSolutions: "Explore solutions",
  },
  legal: {
    eyebrow: "Legal document",
    privacyTitle: "Privacy policy",
    privacyIntro:
      "How Onsmart.AI handles personal data on the site, forms, and cookie preferences.",
    termsTitle: "Terms of use",
    termsIntro:
      "Conditions for browsing and using content and services on the Onsmart.AI site.",
    updatedAt: "Last updated: {date}",
  },
  whatsapp: {
    defaultMessage:
      "Hello! I found Onsmart.AI on the website and would like to speak with a specialist about AI solutions for my company.",
    partnersMessage:
      "Hello! I learned about the Onsmart.AI partnership program and would like to discuss available models.",
    solutionMessage:
      "Hello! I learned about {solution} on the Onsmart.AI website and would like to discuss the next step with your team.",
  },
  home: {
    heroLine1: "Corporate AI",
    heroLine2: "without the mystery:",
    heroLine3:
      "understand it, deploy it in your company, and see value in operations.",
    heroSubtitle:
      "Education, consulting, and the SON.IA Ecosystem so your company can adopt AI in a simple, reliable, and governable way.",
  },
  about: {
    timelineA11y: "Institutional timeline",
    portraitCaption: "Ricardo Palomar · photography provided for this page.",
    soniaLaunchTitle: "SON.IA launch",
  },
  contact: {
    flowAria: "How contact works",
    matrixLabel: "Head office",
    branchLabel: "Branch",
  },
  shell: {
    missionEyebrow: "Our mission",
    missionCtaExpert: "Talk to an expert",
    missionCtaAbout: "Discover our story",
    processLabel: "Operational flow",
    processConceptTag: "Conceptual diagram",
    processA11y: "SON.IA process steps",
    processSupervision: "Rules, permissions, and human oversight throughout the flow.",
    heroRuleTag: "ONSMART.AI",
    heroRuleLine: "Knowledge. Strategy. Operations.",
    editorialReadAria: "Read: {title}",
    editorialThumbAlt: "Thumbnail of the official SON.IA launch video",
    editorialCommunity: "COMMUNITY",
    editorialConnections: "CONNECTIONS",
    editorialPhotoPending: "Official photography pending",
    ecosystemChartA11y: "Grupo Onsmart diagram",
    ecosystemGroupRoot: "Grupo Onsmart",
  },
  showcase: {
    eyebrow: "From learning to operations",
    title: "AI products for businesses",
    text:
      "Programs to help your company understand, adopt, and govern AI, plus a platform to put it all into operation.",
    explorePortfolio: "Explore the portfolio",
    findNextStep: "Find your next step.",
    selectSolutionA11y: "Select an AI solution",
    soniaCaption:
      "Official SON.IA character · not a simulation of the platform interface.",
    photoCaption:
      "Illustrative photography · does not represent the team or an Onsmart event.",
    notice:
      "Each solution has a dedicated page with scope, audience, and ways to contact the Onsmart.AI team.",
    portfolioBlurb:
      "Education, services, and platform for different stages of your company's journey.",
  },
  services: {
    filterA11y: "Solution filter",
    categoriesA11y: "Portfolio categories",
    filterAll: "All",
    filterEducation: "Education",
    filterServices: "Services",
    filterPlatform: "Platform",
    portfolioEyebrow: "Portfolio",
    portfolioTitle: "Find your company's next step.",
    portfolioText:
      "Browse education, services, and platform. Each solution has a dedicated page with scope, audience, and contact options.",
    exploreCategory: "Explore category",
    categoryEducationKicker: "01 / Education",
    categoryEducationTitle: "Learn to decide better.",
    categoryEducationText:
      "Journeys that bring people, leaders, and companies closer to the real possibilities of corporate AI.",
    categoryServicesKicker: "02 / Services",
    categoryServicesTitle: "Structure change in operations.",
    categoryServicesText:
      "Consulting and development to turn business challenges into implementation paths.",
    categoryPlatformKicker: "03 / Platform",
    categoryPlatformTitle: "Connect intelligence to governed processes.",
    categoryPlatformText:
      "SON.IA brings together conversations, agents, systems, and processes on an operational AI platform.",
    cardAudience: "Audience",
    notice:
      "Commercial terms, availability, and scope are defined in a proposal with the Onsmart.AI team.",
  },
  media: {
    byAuthor: "By",
    officialSource: "View official source",
  },
  footer: {
    leadersInAI: "AI leadership training",
    customApps: "Custom AI apps and agents",
  },
  commercialPage: {
    servicesBreadcrumb: "Services",
    commercialStatus:
      "Commercial terms are defined in a proposal with the Onsmart.AI team.",
    visitOfficialSite: "Visit the official site",
    understandSolution: "Understand the solution",
    subnavSolution: "The solution",
    subnavAudience: "Who it's for",
    subnavHow: "How it works",
    subnavScope: "Scope",
    subnavFaq: "FAQ",
    subnavNext: "Next step",
    contextEyebrow: "Context",
    contextLink: "Start with the goal, not the tool.",
    solutionEyebrow: "The solution",
    audienceEyebrow: "Who it's for",
    howEyebrow: "How it works",
    scopeEyebrow: "Scope and deliverables",
    relatedEyebrow: "Keep exploring",
    relatedTitle: "Other portfolio solutions",
    soniaBrandAlt: "Official SON.IA brand",
    partnersSubnavProgram: "The program",
    partnersSubnavModes: "Models",
    partnersSubnavNext: "Next steps",
    partnersSubnavContact: "Become a partner",
    partnersModesA11y: "Partnership models",
    partnersContextEyebrow: "Business connections",
    partnersAudienceEyebrow: "Who it's for",
    partnersAudienceTitle: "Your expertise and work have context.",
    partnersAudienceLead:
      "The program audience includes entrepreneurs, marketing agencies, service providers, managers, and companies interested in commercializing AI solutions.",
    partnersModesEyebrow: "Choose your interest",
    partnersModesTitle: "Three models. One conversation to define the path.",
    partnersModesLead:
      "Select the model you want to learn about. Your choice guides the contact form and does not imply enrollment or eligibility.",
    partnersModeWhat: "What it is",
    partnersModeAudience: "Who it's for",
    partnersModeNext: "Next step",
    partnersNextEyebrow: "Next steps",
    partnersNextTitle: "Understand before making a commitment.",
    partnersNextLead:
      "Editorial flow to guide first contact. It does not replace evaluation criteria or official program terms.",
    partnersBookingTitle: "A conversation with the responsible team.",
    partnersBookingBody:
      "The scheduling area is ready. The official link will be configured in the integrations phase when available.",
    partnersBookingPending: "Scheduling pending",
    partnersRelatedEyebrow: "Discover Onsmart.AI",
    partnersRelatedTitle: "Explore solutions before you talk.",
    partnersExplorePortfolio: "Explore the portfolio",
    partnersExploreEcosystem: "Discover the ecosystem",
    partnersPendingSummary: "Pending program information",
    partnersModesNotice:
      "No percentages, earnings, exclusivity, brand rights, licensing, or White Label terms are assumed.",
  },
};

const extraEs: typeof extraPt = {
  errors: {
    pageUnavailableTitle: "Página no disponible.",
    pageUnavailableBody: "Esta página no está disponible en este momento.",
    backHome: "Volver al inicio",
    notFoundEyebrow: "404 · Página no encontrada",
    notFoundTitle: "¿Encontremos su siguiente paso?",
    notFoundBody: "Verifique la dirección o vuelva a la página inicial.",
    articleNotFoundTitle: "Página no encontrada | Onsmart.AI",
    articleNotFoundDescription:
      "Esta página no está disponible en el sitio Onsmart.AI.",
    legalNotFoundTitle: "Documento no encontrado",
    skipToContent: "Ir al contenido",
    adminTitle: "CMS Onsmart.AI | Administración",
    adminDescription: "Panel administrativo protegido de Onsmart.AI.",
  },
  a11y: {
    readArticle: "Leer {title}",
    articleIndex: "Índice del artículo",
    breadcrumbs: "Ruta de navegación",
    pauseVideo: "Pausar video de fondo",
    playVideo: "Reproducir video de fondo",
    pauseCarousel: "Pausar carrusel de clientes",
    resumeCarousel: "Reanudar carrusel de clientes",
    clientLogos: "Logotipos de clientes Onsmart.AI",
    openSonia: "Abrir asistente SON.IA",
  },
  blog: {
    heroTitleDefault: "IA corporativa: conocimiento que se convierte en operación.",
    heroSummaryDefault:
      "Artículos para comprender, adoptar y gobernar la inteligencia artificial en las empresas.",
    allFormats: "Todas",
    loading: "Cargando contenido editorial…",
    loadErrorTitle: "No se pudo actualizar el contenido.",
    loadErrorBody: "Inténtelo de nuevo en unos instantes.",
    clearFilters: "Limpiar filtros",
    emptyTitle: "No se encontraron resultados",
    emptyBodyFiltered: "Ajuste los filtros o la búsqueda para ver más contenido.",
    emptyBodyDefault:
      "Aún no hay contenido editorial disponible. Las vistas previas dependen de la aprobación editorial.",
    editorialRead: "Lectura editorial",
    editorialPreview: "Vista previa editorial",
    reviewApproved: "Aprobado — publicación pendiente",
    reviewPending: "En revisión",
    topicAdoption: "Adopción de IA",
    topicGovernance: "Gobernanza",
    topicAgents: "Agentes de IA",
    contentEyebrow: "Contenido",
    backToHub: "Volver al hub de contenido",
    missingLoading: "Cargando contenido…",
    missingTitle: "Contenido no disponible.",
    missingBody:
      "Este contenido no está publicado o no está disponible en esta URL.",
    availableInPortuguese: "Disponible solo en portugués",
    searchPlaceholder: "Buscar por tema, título o autor",
    previousPage: "Página anterior",
    nextPage: "Página siguiente",
    pageOf: "Página {current} de {total}",
  },
  consent: {
    bannerLabel: "Preferencias de privacidad",
    bannerTitle: "Su privacidad importa.",
    bannerBody:
      "Usamos cookies esenciales y, con su autorización, cookies de análisis y marketing. Puede cambiar sus preferencias en cualquier momento.",
    acceptAll: "Aceptar todas",
    rejectNonEssential: "Rechazar no esenciales",
    personalize: "Personalizar",
    dialogTitle: "Preferencias de cookies",
    dialogDescription:
      "Usted decide qué categorías autorizar. Las cookies esenciales permanecen activas para el funcionamiento del sitio.",
    closePreferences: "Cerrar preferencias",
    essentialTitle: "Esenciales",
    essentialBody: "Almacenan solo su elección de consentimiento.",
    essentialTag: "Siempre activas",
    analyticsTitle: "Analytics",
    analyticsBody: "Ayudan a entender cómo se utiliza el sitio y mejorarlo.",
    marketingTitle: "Marketing",
    marketingBody: "Permiten personalizar comunicaciones y medir campañas.",
    save: "Guardar preferencias",
    privacyLink: "Más información en la política de privacidad",
    storageBlocked:
      "Su navegador no permitió guardar las preferencias. Su elección vale solo para esta visita.",
  },
  sonia: {
    title: "SON.IA",
    subtitle: "Asistente de orientación",
    suggestion1Label: "¿Por dónde empieza mi empresa?",
    suggestion1Text:
      "Puede comenzar por la capacitación o el mapeo de un proceso prioritario.",
    suggestion1Cta: "Explorar soluciones",
    suggestion2Label: "¿Qué es SON.IA?",
    suggestion2Text:
      "SON.IA es la plataforma de IA operacional que conecta conversaciones, agentes, sistemas y procesos.",
    suggestion2Cta: "Conocer la plataforma",
    suggestion3Label: "Quiero hablar con un especialista",
    suggestion3Text:
      "La atención comercial está disponible por el WhatsApp oficial de Onsmart.AI.",
    suggestion3Cta: "Abrir WhatsApp comercial",
    close: "Cerrar asistente",
  },
  commercial: {
    faqEyebrow: "Preguntas frecuentes",
    faqTitle: "Claridad antes del siguiente paso.",
    faqLead:
      "Respuestas objetivas sobre alcance, formato y próximos pasos con el equipo comercial.",
    closingEyebrow: "Su siguiente paso",
    homeBreadcrumb: "Inicio",
    learnMore: "Saber más",
    partnersProgram: "Programa de alianzas",
    partnersFindMode: "Encontrar mi modalidad",
    partnersCta: "Quiero ser socio",
    partnersStatus:
      "Las modalidades y condiciones se definen en conversación con el equipo Onsmart.AI.",
    partnersNotReadyTitle: "Programa de alianzas",
    partnersNotReadyBody: "La página se está preparando para revisión.",
    partnersTalkTeam: "Hablar con el equipo",
    modeAgent: "Agente digital",
    modeResale: "Revenda",
    modeWhiteLabel: "White Label",
    closingTitlePartners: "Una conversación para entender la alianza.",
    closingTitleDefault: "¿Conectamos esta solución a su contexto?",
    closingBody:
      "Elija contacto directo con el equipo o complete el formulario de calificación. La propuesta comercial depende de entender su interés y las necesidades de su operación.",
    whatsappNotice:
      "WhatsApp se abre en una nueva ventana. El formulario envía su interés al equipo comercial de Onsmart.AI.",
    soniaHeroTagline: "Conversaciones. Agentes. Sistemas. Procesos.",
    solutionNotFoundEyebrow: "Solución no encontrada",
    solutionNotFoundTitle: "¿Encontremos el camino adecuado?",
    solutionNotFoundBody:
      "Consulte el portafolio de educación, servicios y plataforma.",
    exploreSolutions: "Explorar soluciones",
  },
  legal: {
    eyebrow: "Documento legal",
    privacyTitle: "Política de privacidad",
    privacyIntro:
      "Cómo Onsmart.AI trata datos personales en el sitio, formularios y preferencias de cookies.",
    termsTitle: "Términos de uso",
    termsIntro:
      "Condiciones para navegar y usar los contenidos y servicios del sitio Onsmart.AI.",
    updatedAt: "Última actualización: {date}",
  },
  whatsapp: {
    defaultMessage:
      "¡Hola! Conocí Onsmart.AI en el sitio y me gustaría hablar con un especialista sobre soluciones de IA para mi empresa.",
    partnersMessage:
      "¡Hola! Conocí el programa de alianzas de Onsmart.AI y me gustaría hablar sobre las modalidades disponibles.",
    solutionMessage:
      "¡Hola! Conocí la solución {solution} en el sitio de Onsmart.AI y me gustaría hablar con el equipo sobre el siguiente paso.",
  },
  home: {
    heroLine1: "IA corporativa",
    heroLine2: "sin misterio:",
    heroLine3:
      "comprenda, implante en su empresa y vea el valor en la operación.",
    heroSubtitle:
      "Educación, consultoría y el Ecosistema SON.IA para que su empresa adopte IA de forma simple, confiable y gobernable.",
  },
  about: {
    timelineA11y: "Línea de tiempo institucional",
    portraitCaption:
      "Ricardo Palomar · fotografía proporcionada para esta página.",
    soniaLaunchTitle: "Lanzamiento de SON.IA",
  },
  contact: {
    flowAria: "Cómo funciona el contacto",
    matrixLabel: "Matriz",
    branchLabel: "Sucursal",
  },
  shell: {
    missionEyebrow: "Nuestra misión",
    missionCtaExpert: "Hablar con un especialista",
    missionCtaAbout: "Conozca nuestra historia",
    processLabel: "Flujo operacional",
    processConceptTag: "Diagrama conceptual",
    processA11y: "Etapas del proceso SON.IA",
    processSupervision:
      "Reglas, permisos y supervisión humana en todo el flujo.",
    heroRuleTag: "ONSMART.AI",
    heroRuleLine: "Conocimiento. Estrategia. Operación.",
    editorialReadAria: "Leer: {title}",
    editorialThumbAlt: "Miniatura del video oficial de lanzamiento de SON.IA",
    editorialCommunity: "COMUNIDAD",
    editorialConnections: "CONEXIONES",
    editorialPhotoPending: "Fotografía oficial pendiente",
    ecosystemChartA11y: "Diagrama del Grupo Onsmart",
    ecosystemGroupRoot: "Grupo Onsmart",
  },
  showcase: {
    eyebrow: "Del aprendizaje a la operación",
    title: "Productos de IA para empresas",
    text:
      "Programas para que su empresa comprenda, adopte y gobierne la IA, y una plataforma para ponerlo todo en operación.",
    explorePortfolio: "Explorar el portafolio",
    findNextStep: "Encuentre su siguiente paso.",
    selectSolutionA11y: "Seleccionar una solución de IA",
    soniaCaption:
      "Personaje oficial SON.IA · sin simular la interfaz de la plataforma.",
    photoCaption:
      "Fotografía ilustrativa · no representa al equipo ni un evento de Onsmart.",
    notice:
      "Cada solución tiene página dedicada con alcance, público y formas de contacto con el equipo Onsmart.AI.",
    portfolioBlurb:
      "Educación, servicios y plataforma para distintas etapas de su empresa.",
  },
  services: {
    filterA11y: "Filtro de soluciones",
    categoriesA11y: "Categorías del portafolio",
    filterAll: "Todas",
    filterEducation: "Educación",
    filterServices: "Servicios",
    filterPlatform: "Plataforma",
    portfolioEyebrow: "Portafolio",
    portfolioTitle: "Encuentre el siguiente paso de su empresa.",
    portfolioText:
      "Navegue por educación, servicios y plataforma. Cada solución tiene página dedicada con alcance, público y contacto.",
    exploreCategory: "Explorar categoría",
    categoryEducationKicker: "01 / Educación",
    categoryEducationTitle: "Aprender para decidir mejor.",
    categoryEducationText:
      "Recorridos que acercan a personas, líderes y empresas a las posibilidades reales de la IA corporativa.",
    categoryServicesKicker: "02 / Servicios",
    categoryServicesTitle: "Estructurar el cambio en la operación.",
    categoryServicesText:
      "Consultoría y desarrollo para transformar desafíos empresariales en caminos de implementación.",
    categoryPlatformKicker: "03 / Plataforma",
    categoryPlatformTitle: "Conectar inteligencia a procesos gobernados.",
    categoryPlatformText:
      "SON.IA reúne conversaciones, agentes, sistemas y procesos en una plataforma de IA operacional.",
    cardAudience: "Público",
    notice:
      "Condiciones comerciales, disponibilidad y alcance se definen en propuesta con el equipo Onsmart.AI.",
  },
  media: {
    byAuthor: "Por",
    officialSource: "Ver fuente oficial",
  },
  footer: {
    leadersInAI: "Capacitación de líderes en IA",
    customApps: "Apps y agentes de IA a medida",
  },
  commercialPage: {
    servicesBreadcrumb: "Servicios",
    commercialStatus:
      "Las condiciones comerciales se definen en propuesta con el equipo Onsmart.AI.",
    visitOfficialSite: "Visitar el sitio oficial",
    understandSolution: "Entender la solución",
    subnavSolution: "La solución",
    subnavAudience: "Para quién",
    subnavHow: "Cómo funciona",
    subnavScope: "Alcance",
    subnavFaq: "FAQ",
    subnavNext: "Siguiente paso",
    contextEyebrow: "El contexto",
    contextLink: "Comience por el objetivo, no por la herramienta.",
    solutionEyebrow: "La solución",
    audienceEyebrow: "Para quién",
    howEyebrow: "Cómo funciona",
    scopeEyebrow: "Alcance y entregables",
    relatedEyebrow: "Siga explorando",
    relatedTitle: "Otras soluciones del portafolio",
    soniaBrandAlt: "Marca oficial SON.IA",
    partnersSubnavProgram: "El programa",
    partnersSubnavModes: "Modalidades",
    partnersSubnavNext: "Próximos pasos",
    partnersSubnavContact: "Quiero ser socio",
    partnersModesA11y: "Modalidades de alianza",
    partnersContextEyebrow: "Conexiones empresariales",
    partnersAudienceEyebrow: "Para quién",
    partnersAudienceTitle: "Su conocimiento y su actuación tienen contexto.",
    partnersAudienceLead:
      "El público del programa incluye emprendedores, agencias de marketing, prestadores de servicios, gestores y empresas interesadas en comercializar soluciones de IA.",
    partnersModesEyebrow: "Elija su interés",
    partnersModesTitle: "Tres modalidades. Una conversación para definir el camino.",
    partnersModesLead:
      "Seleccione la modalidad que desea conocer. La selección orienta el formulario de contacto y no implica adhesión ni elegibilidad.",
    partnersModeWhat: "Qué es",
    partnersModeAudience: "Para quién",
    partnersModeNext: "Siguiente paso",
    partnersNextEyebrow: "Próximos pasos",
    partnersNextTitle: "Entender antes de asumir un compromiso.",
    partnersNextLead:
      "Flujo editorial para orientar el primer contacto. No sustituye los criterios de evaluación ni las condiciones oficiales del programa.",
    partnersBookingTitle: "Una conversación con el área responsable.",
    partnersBookingBody:
      "El espacio de agendamiento está preparado. El enlace oficial se configurará en la etapa de integraciones, cuando esté disponible.",
    partnersBookingPending: "Agendamiento pendiente",
    partnersRelatedEyebrow: "Conozca Onsmart.AI",
    partnersRelatedTitle: "Explore las soluciones antes de conversar.",
    partnersExplorePortfolio: "Explorar el portafolio",
    partnersExploreEcosystem: "Conocer el ecosistema",
    partnersPendingSummary: "Información pendiente del programa",
    partnersModesNotice:
      "No se presumen porcentajes, ganancias, exclusividad, derechos de marca, licencias ni condiciones de White Label.",
  },
};

function merge(locale: SiteLocale): SiteCopy {
  const base = UI_MESSAGES[locale];
  const extra =
    locale === "en" ? extraEn : locale === "es" ? extraEs : extraPt;
  return { ...base, ...extra, landingPage: LANDING_PAGE[locale] };
}

export const SITE_COPY: Record<SiteLocale, SiteCopy> = {
  "pt-BR": merge("pt-BR"),
  en: merge("en"),
  es: merge("es"),
};

/** CMS category labels (canonical PT keys in URLs). */
export const BLOG_CATEGORY_LABEL: Record<
  SiteLocale,
  Record<string, string>
> = {
  "pt-BR": {
    Todas: "Todas",
    Blog: "Blog",
    Notícias: "Notícias",
    "Onsmart na mídia": "Onsmart na mídia",
    Cases: "Cases",
    Vídeos: "Vídeos",
    "E-books": "E-books",
    Playbooks: "Playbooks",
    "Materiais gratuitos": "Materiais gratuitos",
  },
  en: {
    Todas: "All",
    Blog: "Blog",
    Notícias: "News",
    "Onsmart na mídia": "Onsmart in the media",
    Cases: "Case studies",
    Vídeos: "Videos",
    "E-books": "E-books",
    Playbooks: "Playbooks",
    "Materiais gratuitos": "Free resources",
  },
  es: {
    Todas: "Todas",
    Blog: "Blog",
    Notícias: "Noticias",
    "Onsmart na mídia": "Onsmart en los medios",
    Cases: "Casos",
    Vídeos: "Videos",
    "E-books": "E-books",
    Playbooks: "Playbooks",
    "Materiais gratuitos": "Materiales gratuitos",
  },
};

export function blogCategoryLabel(
  canonical: string,
  locale: SiteLocale
): string {
  return BLOG_CATEGORY_LABEL[locale][canonical] ?? canonical;
}

export function blogPreviewStatusLabel(
  status: "review" | "approved",
  locale: SiteLocale
): string {
  const copy = SITE_COPY[locale].blog;
  return status === "approved" ? copy.reviewApproved : copy.reviewPending;
}
