import { useMemo } from "react";
import type { SiteLocale } from "@shared/locale";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  localizedSolutionCategory,
  localizedSolutionTitle,
} from "@/i18n/site";
import { getCommercial } from "./commercial";
import brandMedia from "./brand-media.json";
import type { CompanyId } from "@/components/site/CompanyLogo";
import {
  clients,
  socials,
  solutionHref,
  solutions as ptSolutions,
  type Editorial,
  type Solution,
} from "./site";

export type CompanyContent = {
  id: CompanyId;
  name: string;
  state: string;
  headline: string;
  text: string;
  website?: string;
  status: "live" | "development";
};

export type Pillar = { title: string; text: string };
export type ProcessStep = { title: string; text: string };

export type AboutMilestone = {
  marker: string;
  title: string;
  text: string;
  source: string;
  companyId?: CompanyId;
};

export type AboutAchievement = {
  id: "youtube" | "sonia-launch" | "volei";
  title: string;
  text: string;
};

const mission: Record<SiteLocale, string> = {
  "pt-BR":
    "Tornar a IA corporativa simples de adotar, confiável para operar e governável para escalar.",
  en: "Make corporate AI simple to adopt, reliable to operate, and governable to scale.",
  es: "Hacer que la IA corporativa sea simple de adoptar, confiable para operar y gobernable para escalar.",
};

const pillars: Record<SiteLocale, Pillar[]> = {
  "pt-BR": [
    {
      title: "Simples de adotar",
      text: "Começar por um processo prioritário e evoluir por etapas.",
    },
    {
      title: "Confiável para operar",
      text:
        "Conhecimento autorizado, regras, permissões e supervisão humana sustentam a operação.",
    },
    {
      title: "Governável para escalar",
      text:
        "Responsáveis, aprovações, registros e tratamento de exceções fazem parte do fluxo.",
    },
  ],
  en: [
    {
      title: "Simple to adopt",
      text: "Start with one priority process and evolve in stages.",
    },
    {
      title: "Reliable to operate",
      text:
        "Authorized knowledge, rules, permissions, and human oversight sustain operations.",
    },
    {
      title: "Governable to scale",
      text:
        "Owners, approvals, records, and exception handling are part of the flow.",
    },
  ],
  es: [
    {
      title: "Simple de adoptar",
      text: "Comenzar por un proceso prioritario y evolucionar por etapas.",
    },
    {
      title: "Confiable para operar",
      text:
        "Conocimiento autorizado, reglas, permisos y supervisión humana sostienen la operación.",
    },
    {
      title: "Gobernable para escalar",
      text:
        "Responsables, aprobaciones, registros y tratamiento de excepciones forman parte del flujo.",
    },
  ],
};

const processSteps: Record<SiteLocale, ProcessStep[]> = {
  "pt-BR": [
    {
      title: "Recebe",
      text: "Centraliza conversas e eventos vindos dos canais da operação.",
    },
    {
      title: "Compreende",
      text:
        "Consulta conhecimento autorizado e identifica contexto, intenção e dados necessários.",
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
      text:
        "Mantém rastreabilidade e encaminha exceções para a pessoa responsável.",
    },
  ],
  en: [
    {
      title: "Receives",
      text: "Centralizes conversations and events from operational channels.",
    },
    {
      title: "Understands",
      text:
        "Consults authorized knowledge and identifies context, intent, and required data.",
    },
    {
      title: "Decides",
      text: "Follows rules, permissions, and paths defined for each process.",
    },
    {
      title: "Acts",
      text: "Records, queries, updates, or triggers connected systems.",
    },
    {
      title: "Supervises",
      text: "Maintains traceability and routes exceptions to the responsible person.",
    },
  ],
  es: [
    {
      title: "Recibe",
      text: "Centraliza conversaciones y eventos de los canales de operación.",
    },
    {
      title: "Comprende",
      text:
        "Consulta conocimiento autorizado e identifica contexto, intención y datos necesarios.",
    },
    {
      title: "Decide",
      text: "Sigue reglas, permisos y caminos definidos para cada proceso.",
    },
    {
      title: "Actúa",
      text: "Registra, consulta, actualiza o acciona sistemas conectados.",
    },
    {
      title: "Supervisa",
      text:
        "Mantiene trazabilidad y deriva excepciones a la persona responsable.",
    },
  ],
};

const companies: Record<SiteLocale, CompanyContent[]> = {
  "pt-BR": [
    {
      id: "tech",
      name: "Onsmart Tech",
      state: "Onsmart Tech",
      headline: "Tecnologia e operação desde 2014.",
      text:
        "Marco histórico do Grupo Onsmart em tecnologia e serviços corporativos. A Onsmart Tech sustenta a base técnica e operacional do ecossistema.",
      website: "https://onsmart.com.br",
      status: "live",
    },
    {
      id: "ai",
      name: "Onsmart.AI",
      state: "Educação, serviços e plataforma de IA",
      headline: "Educação, consultoria e plataforma de IA.",
      text:
        "Educação, consultoria, desenvolvimento sob medida e o Ecossistema SON.IA para empresas adotarem inteligência artificial com governança e resultado na operação.",
      website: "https://onsmart.ai",
      status: "live",
    },
    {
      id: "growth",
      name: "Onsmart.AI Growth Lab",
      state: "Onsmart.AI Growth Lab",
      headline: "Crescimento e novos negócios.",
      text:
        "Acelera experimentação, parcerias e oportunidades com IA no mercado corporativo, conectando estratégia comercial à entrega do grupo.",
      website: "https://growthlab.onsmart.ai",
      status: "live",
    },
    {
      id: "robotics",
      name: "Onsmart.AI Robotics",
      state: "Em desenvolvimento",
      headline: "Robótica e automação inteligente.",
      text:
        "Frente do Grupo Onsmart dedicada à robótica e à automação inteligente. Site e soluções serão divulgados quando estiverem disponíveis.",
      status: "development",
    },
  ],
  en: [
    {
      id: "tech",
      name: "Onsmart Tech",
      state: "Onsmart Tech",
      headline: "Technology and operations since 2014.",
      text:
        "A historic milestone for Grupo Onsmart in corporate technology and services. Onsmart Tech supports the ecosystem's technical and operational foundation.",
      website: "https://onsmart.com.br",
      status: "live",
    },
    {
      id: "ai",
      name: "Onsmart.AI",
      state: "Education, services, and AI platform",
      headline: "Education, consulting, and AI platform.",
      text:
        "Education, consulting, custom development, and the SON.IA Ecosystem so companies can adopt artificial intelligence with governance and operational results.",
      website: "https://onsmart.ai",
      status: "live",
    },
    {
      id: "growth",
      name: "Onsmart.AI Growth Lab",
      state: "Onsmart.AI Growth Lab",
      headline: "Growth and new business.",
      text:
        "Accelerates experimentation, partnerships, and AI opportunities in the corporate market, connecting commercial strategy to group delivery.",
      website: "https://growthlab.onsmart.ai",
      status: "live",
    },
    {
      id: "robotics",
      name: "Onsmart.AI Robotics",
      state: "In development",
      headline: "Robotics and intelligent automation.",
      text:
        "A Grupo Onsmart front focused on robotics and intelligent automation. Website and solutions will be announced when available.",
      status: "development",
    },
  ],
  es: [
    {
      id: "tech",
      name: "Onsmart Tech",
      state: "Onsmart Tech",
      headline: "Tecnología y operación desde 2014.",
      text:
        "Hito histórico del Grupo Onsmart en tecnología y servicios corporativos. Onsmart Tech sostiene la base técnica y operacional del ecosistema.",
      website: "https://onsmart.com.br",
      status: "live",
    },
    {
      id: "ai",
      name: "Onsmart.AI",
      state: "Educación, servicios y plataforma de IA",
      headline: "Educación, consultoría y plataforma de IA.",
      text:
        "Educación, consultoría, desarrollo a medida y el Ecosistema SON.IA para que las empresas adopten inteligencia artificial con gobernanza y resultados en la operación.",
      website: "https://onsmart.ai",
      status: "live",
    },
    {
      id: "growth",
      name: "Onsmart.AI Growth Lab",
      state: "Onsmart.AI Growth Lab",
      headline: "Crecimiento y nuevos negocios.",
      text:
        "Acelera experimentación, alianzas y oportunidades con IA en el mercado corporativo, conectando la estrategia comercial con la entrega del grupo.",
      website: "https://growthlab.onsmart.ai",
      status: "live",
    },
    {
      id: "robotics",
      name: "Onsmart.AI Robotics",
      state: "En desarrollo",
      headline: "Robótica y automatización inteligente.",
      text:
        "Frente del Grupo Onsmart dedicada a la robótica y la automatización inteligente. El sitio y las soluciones se anunciarán cuando estén disponibles.",
      status: "development",
    },
  ],
};

const editorial: Record<SiteLocale, Editorial[]> = {
  "pt-BR": [
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
  ],
  en: [
    {
      slug: "lancamento-sonia",
      type: "News",
      title: "SON.IA: from conversation to operations",
      excerpt:
        "The platform launch brings together artificial intelligence, processes, and governed actions in the business environment.",
      source: "https://lnkd.in/p/dcygKB2R",
      state: "Official source • editorial date pending",
      image: brandMedia.sonia.url,
    },
    {
      slug: "esporte-e-inclusao",
      type: "Onsmart in the media",
      title: "Sport, inclusion, and community",
      excerpt:
        "Onsmart supports the Paulínia adaptive volleyball team. See the official record of the team's participation.",
      source: "https://lnkd.in/p/dxKtuzUq",
      state: "Official source • editorial date pending",
      image: brandMedia.volei.url,
    },
    {
      slug: "ricardo-na-confraria",
      type: "Onsmart in the media",
      title: "Knowledge built through good conversations",
      excerpt:
        "Ricardo Palomar on Confraria: entrepreneurship, management, and leadership. Story provided for institutional review.",
      state: "Story under validation • not published",
      image: brandMedia.confraria.url,
    },
    {
      slug: "video-sonia",
      type: "Videos",
      title: "Discover the SON.IA launch",
      excerpt: "Watch the platform launch video on the official Onsmart.AI channel.",
      source: "https://www.youtube.com/watch?v=UNXZ-t2ibqw",
      state: "Video on the official channel",
      image: brandMedia.sonia.url,
    },
  ],
  es: [
    {
      slug: "lancamento-sonia",
      type: "Noticias",
      title: "SON.IA: de la conversación a la operación",
      excerpt:
        "El lanzamiento de la plataforma reúne inteligencia artificial, procesos y acciones gobernadas en el entorno empresarial.",
      source: "https://lnkd.in/p/dcygKB2R",
      state: "Fuente oficial • fecha editorial pendiente",
      image: brandMedia.sonia.url,
    },
    {
      slug: "esporte-e-inclusao",
      type: "Onsmart en los medios",
      title: "Deporte, inclusión y comunidad",
      excerpt:
        "Onsmart apoya al equipo de Vóley Adaptado de Paulínia. Conozca el registro oficial sobre la participación del equipo.",
      source: "https://lnkd.in/p/dxKtuzUq",
      state: "Fuente oficial • fecha editorial pendiente",
      image: brandMedia.volei.url,
    },
    {
      slug: "ricardo-na-confraria",
      type: "Onsmart en los medios",
      title: "Conocimiento que se construye en buenas conversaciones",
      excerpt:
        "Ricardo Palomar en Confraria: emprendimiento, gestión y liderazgo. Nota proporcionada para revisión institucional.",
      state: "Nota en validación • no publicada",
      image: brandMedia.confraria.url,
    },
    {
      slug: "video-sonia",
      type: "Videos",
      title: "Conozca el lanzamiento de SON.IA",
      excerpt:
        "Vea el video de lanzamiento de la plataforma en el canal oficial de Onsmart.AI.",
      source: "https://www.youtube.com/watch?v=UNXZ-t2ibqw",
      state: "Video en el canal oficial",
      image: brandMedia.sonia.url,
    },
  ],
};

const aboutMilestones: Record<SiteLocale, AboutMilestone[]> = {
  "pt-BR": [
    {
      marker: "2014",
      title: "Marco empresarial da Onsmart Tech",
      text:
        "O registro público da Onsmart Tech indica 2014 como marco de origem empresarial no Grupo Onsmart.",
      source: "Onsmart Tech",
      companyId: "tech",
    },
    {
      marker: "2025",
      title: "Site institucional Onsmart.AI",
      text:
        "Lançamento do site onsmart.ai como vitrine de educação, consultoria, serviços e da plataforma SON.IA para empresas que adotam IA com governança.",
      source: "onsmart.ai",
      companyId: "ai",
    },
    {
      marker: "2025",
      title: "Onsmart.AI Growth Lab",
      text:
        "Entrada do Growth Lab na linha do tempo do grupo, ampliando a atuação em crescimento e experimentação com soluções de IA para o mercado.",
      source: "Onsmart.AI Growth Lab",
      companyId: "growth",
    },
  ],
  en: [
    {
      marker: "2014",
      title: "Onsmart Tech business milestone",
      text:
        "Public records list 2014 as Onsmart Tech's business origin milestone within Grupo Onsmart.",
      source: "Onsmart Tech",
      companyId: "tech",
    },
    {
      marker: "2025",
      title: "Onsmart.AI institutional website",
      text:
        "Launch of onsmart.ai as the hub for education, consulting, services, and the SON.IA platform for companies adopting AI with governance.",
      source: "onsmart.ai",
      companyId: "ai",
    },
    {
      marker: "2025",
      title: "Onsmart.AI Growth Lab",
      text:
        "Growth Lab joins the group timeline, expanding work on growth and experimentation with AI solutions for the market.",
      source: "Onsmart.AI Growth Lab",
      companyId: "growth",
    },
  ],
  es: [
    {
      marker: "2014",
      title: "Hito empresarial de Onsmart Tech",
      text:
        "El registro público de Onsmart Tech indica 2014 como hito de origen empresarial en el Grupo Onsmart.",
      source: "Onsmart Tech",
      companyId: "tech",
    },
    {
      marker: "2025",
      title: "Sitio institucional Onsmart.AI",
      text:
        "Lanzamiento del sitio onsmart.ai como vitrina de educación, consultoría, servicios y la plataforma SON.IA para empresas que adoptan IA con gobernanza.",
      source: "onsmart.ai",
      companyId: "ai",
    },
    {
      marker: "2025",
      title: "Onsmart.AI Growth Lab",
      text:
        "Incorporación del Growth Lab en la línea de tiempo del grupo, ampliando la actuación en crecimiento y experimentación con soluciones de IA para el mercado.",
      source: "Onsmart.AI Growth Lab",
      companyId: "growth",
    },
  ],
};

const aboutAchievements: Record<SiteLocale, AboutAchievement[]> = {
  "pt-BR": [
    {
      id: "youtube",
      title: "Canal da Onsmart.AI",
      text:
        "Mais de 100 mil inscritos no canal oficial no YouTube, com conteúdo sobre IA aplicada a negócios, gestão e transformação digital.",
    },
    {
      id: "sonia-launch",
      title: "Lançamento da SON.IA",
      text:
        "SON.IA é a plataforma operacional agêntica da Onsmart.AI — conversas, agentes, sistemas e processos com governança para a operação do dia a dia.",
    },
    {
      id: "volei",
      title: "Vôlei Adaptado de Paulínia",
      text:
        "Apoio à equipe de Vôlei Adaptado de Paulínia, reforçando o compromisso da empresa com inclusão e participação na comunidade.",
    },
  ],
  en: [
    {
      id: "youtube",
      title: "Onsmart.AI channel",
      text:
        "Over 100K subscribers on the official YouTube channel, with content on applied AI, management, and digital transformation.",
    },
    {
      id: "sonia-launch",
      title: "SON.IA launch",
      text:
        "SON.IA is Onsmart.AI’s agentic operations platform — conversations, agents, systems, and processes with governance for day-to-day operations.",
    },
    {
      id: "volei",
      title: "Paulínia adaptive volleyball team",
      text:
        "Support for the Paulínia adaptive volleyball team, reflecting the company’s commitment to inclusion and community engagement.",
    },
  ],
  es: [
    {
      id: "youtube",
      title: "Canal de Onsmart.AI",
      text:
        "Más de 100 mil suscriptores en el canal oficial de YouTube, con contenido sobre IA aplicada a negocios, gestión y transformación digital.",
    },
    {
      id: "sonia-launch",
      title: "Lanzamiento de SON.IA",
      text:
        "SON.IA es la plataforma operacional agéntica de Onsmart.AI: conversaciones, agentes, sistemas y procesos con gobernanza para la operación diaria.",
    },
    {
      id: "volei",
      title: "Vóley Adaptado de Paulínia",
      text:
        "Apoyo al equipo de Vóley Adaptado de Paulínia, reforzando el compromiso de la empresa con la inclusión y la comunidad.",
    },
  ],
};

function localizedSolution(s: Solution, locale: SiteLocale): Solution {
  const commercial = getCommercial(s.slug, locale);
  const cta =
    commercial?.cta ??
    (locale === "en"
      ? s.cta === "Saiba mais"
        ? "Learn more"
        : s.cta === "Conhecer cursos"
          ? "View courses"
          : s.cta === "Conhecer consultoria"
            ? "Explore consulting"
            : s.cta === "Conhecer a SON.IA"
              ? "Discover SON.IA"
              : s.cta
      : locale === "es"
        ? s.cta === "Saiba mais"
          ? "Saber más"
          : s.cta === "Conhecer cursos"
            ? "Ver cursos"
            : s.cta === "Conhecer consultoria"
              ? "Conocer consultoría"
              : s.cta === "Conhecer a SON.IA"
                ? "Conocer SON.IA"
                : s.cta
        : s.cta);
  return {
    ...s,
    title: localizedSolutionTitle(s.slug, s.title, locale),
    description: commercial?.lead ?? s.description,
    audience: commercial?.audiences?.[0] ?? s.audience,
    detail: commercial?.solutionText ?? s.detail,
    cta,
  };
}

export type SiteContent = {
  locale: SiteLocale;
  mission: string;
  pillars: Pillar[];
  processSteps: ProcessStep[];
  companies: CompanyContent[];
  editorial: Editorial[];
  solutions: Solution[];
  clients: string[];
  socials: typeof socials;
  solutionHref: (slug: string) => string;
  solutionCategoryLabel: (category: Solution["category"]) => string;
  aboutMilestones: AboutMilestone[];
  aboutAchievements: AboutAchievement[];
};

export function getSiteContent(locale: SiteLocale): SiteContent {
  return {
    locale,
    mission: mission[locale],
    pillars: pillars[locale],
    processSteps: processSteps[locale],
    companies: companies[locale],
    editorial: editorial[locale],
    solutions: ptSolutions.map(s => localizedSolution(s, locale)),
    clients,
    socials,
    solutionHref,
    solutionCategoryLabel: category =>
      localizedSolutionCategory(category, locale),
    aboutMilestones: aboutMilestones[locale],
    aboutAchievements: aboutAchievements[locale],
  };
}

export function useSiteContent(): SiteContent {
  const { locale } = useLocale();
  return useMemo(() => getSiteContent(locale), [locale]);
}
