import { useMemo } from "react";
import type { SiteLocale } from "@shared/locale";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  localizedSolutionCategory,
  localizedSolutionTitle,
} from "@/i18n/site";
import { getCommercial } from "./commercial";
import brandMedia from "./brand-media.json";
import {
  clients,
  socials,
  solutionHref,
  solutions as ptSolutions,
  type Editorial,
  type Solution,
} from "./site";

export type CompanyContent = {
  id: string;
  name: string;
  state: string;
  text: string;
};

export type Pillar = { title: string; text: string };
export type ProcessStep = { title: string; text: string };

export type AboutMilestone = {
  marker: string;
  title: string;
  text: string;
  source: string;
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
      state: "Conteúdo institucional em validação",
      text:
        "A apresentação oficial desta empresa será incorporada após validação dos materiais do Grupo Onsmart.",
    },
    {
      id: "ai",
      name: "Onsmart.AI",
      state: "Educação, serviços e plataforma de IA",
      text:
        "Educação, consultoria, desenvolvimento personalizado e o Ecossistema SON.IA para empresas adotarem inteligência artificial com governança.",
    },
    {
      id: "growth",
      name: "Onsmart.AI Growth Lab",
      state: "Conteúdo institucional em validação",
      text:
        "As soluções e os diferenciais serão apresentados com base nos materiais oficiais da empresa.",
    },
    {
      id: "robotics",
      name: "Onsmart.AI Robotics",
      state: "Em breve",
      text: "Em breve.",
    },
  ],
  en: [
    {
      id: "tech",
      name: "Onsmart Tech",
      state: "Institutional content under validation",
      text:
        "The official presentation of this company will be added after Grupo Onsmart materials are validated.",
    },
    {
      id: "ai",
      name: "Onsmart.AI",
      state: "Education, services, and AI platform",
      text:
        "Education, consulting, custom development, and the SON.IA Ecosystem so companies can adopt artificial intelligence with governance.",
    },
    {
      id: "growth",
      name: "Onsmart.AI Growth Lab",
      state: "Institutional content under validation",
      text:
        "Solutions and differentiators will be presented based on the company's official materials.",
    },
    {
      id: "robotics",
      name: "Onsmart.AI Robotics",
      state: "Coming soon",
      text: "Coming soon.",
    },
  ],
  es: [
    {
      id: "tech",
      name: "Onsmart Tech",
      state: "Contenido institucional en validación",
      text:
        "La presentación oficial de esta empresa se incorporará tras validar los materiales del Grupo Onsmart.",
    },
    {
      id: "ai",
      name: "Onsmart.AI",
      state: "Educación, servicios y plataforma de IA",
      text:
        "Educación, consultoría, desarrollo personalizado y el Ecosistema SON.IA para que las empresas adopten inteligencia artificial con gobernanza.",
    },
    {
      id: "growth",
      name: "Onsmart.AI Growth Lab",
      state: "Contenido institucional en validación",
      text:
        "Las soluciones y los diferenciales se presentarán según los materiales oficiales de la empresa.",
    },
    {
      id: "robotics",
      name: "Onsmart.AI Robotics",
      state: "Próximamente",
      text: "Próximamente.",
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
        "O registro público da Onsmart Tech indica 2014 como marco de origem empresarial. A relação formal entre essa cronologia e o Grupo Onsmart ainda aguarda validação interna.",
      source: "Fonte empresarial • confirmação institucional pendente",
    },
    {
      marker: "Próximo marco",
      title: "Cronologia preparada para receber fontes oficiais",
      text:
        "Outros capítulos da trajetória serão publicados somente depois da revisão documental do grupo.",
      source: "Sem data preenchida nesta fase",
    },
    {
      marker: "Estado atual",
      title: "Educação, consultoria e operação de IA",
      text:
        "A Onsmart.AI apresenta jornadas de educação, serviços e plataforma para empresas que desejam adotar inteligência artificial com governança.",
      source: "Posicionamento do briefing • sem cronologia adicional",
    },
  ],
  en: [
    {
      marker: "2014",
      title: "Onsmart Tech business milestone",
      text:
        "Public records list 2014 as Onsmart Tech's business origin milestone. The formal link between this timeline and Grupo Onsmart is still pending internal validation.",
      source: "Business source • institutional confirmation pending",
    },
    {
      marker: "Next milestone",
      title: "Timeline ready for official sources",
      text:
        "Additional chapters of the journey will be published only after the group's document review.",
      source: "No date filled in at this stage",
    },
    {
      marker: "Current state",
      title: "Education, consulting, and AI operations",
      text:
        "Onsmart.AI offers education, services, and platform journeys for companies that want to adopt artificial intelligence with governance.",
      source: "Briefing positioning • no additional timeline",
    },
  ],
  es: [
    {
      marker: "2014",
      title: "Hito empresarial de Onsmart Tech",
      text:
        "El registro público de Onsmart Tech indica 2014 como hito de origen empresarial. La relación formal entre esta cronología y el Grupo Onsmart aún aguarda validación interna.",
      source: "Fuente empresarial • confirmación institucional pendiente",
    },
    {
      marker: "Próximo hito",
      title: "Cronología preparada para recibir fuentes oficiales",
      text:
        "Otros capítulos de la trayectoria se publicarán solo después de la revisión documental del grupo.",
      source: "Sin fecha completada en esta fase",
    },
    {
      marker: "Estado actual",
      title: "Educación, consultoría y operación de IA",
      text:
        "Onsmart.AI presenta recorridos de educación, servicios y plataforma para empresas que desean adoptar inteligencia artificial con gobernanza.",
      source: "Posicionamiento del briefing • sin cronología adicional",
    },
  ],
};

const aboutAchievements: Record<SiteLocale, AboutAchievement[]> = {
  "pt-BR": [
    {
      id: "youtube",
      title: "Canal da Onsmart.AI",
      text:
        "Aproximadamente 103 mil inscritos no canal oficial do YouTube. A formulação “100 mil em 18 meses” segue pendente de comprovação documental.",
    },
    {
      id: "sonia-launch",
      title: "Lançamento da SON.IA",
      text:
        "A plataforma foi apresentada em publicação oficial. A data editorial e os detalhes de lançamento permanecem pendentes.",
    },
    {
      id: "volei",
      title: "Vôlei Adaptado de Paulínia",
      text:
        "Apoio registrado em fonte oficial à equipe de Vôlei Adaptado de Paulínia.",
    },
  ],
  en: [
    {
      id: "youtube",
      title: "Onsmart.AI channel",
      text:
        "Approximately 103K subscribers on the official YouTube channel. The “100K in 18 months” claim remains pending documentary verification.",
    },
    {
      id: "sonia-launch",
      title: "SON.IA launch",
      text:
        "The platform was presented in an official publication. The editorial date and launch details remain pending.",
    },
    {
      id: "volei",
      title: "Paulínia adaptive volleyball team",
      text:
        "Support recorded from an official source for the Paulínia adaptive volleyball team.",
    },
  ],
  es: [
    {
      id: "youtube",
      title: "Canal de Onsmart.AI",
      text:
        "Aproximadamente 103 mil suscriptores en el canal oficial de YouTube. La formulación «100 mil en 18 meses» sigue pendiente de comprobación documental.",
    },
    {
      id: "sonia-launch",
      title: "Lanzamiento de SON.IA",
      text:
        "La plataforma fue presentada en una publicación oficial. La fecha editorial y los detalles de lanzamiento permanecen pendientes.",
    },
    {
      id: "volei",
      title: "Vóley Adaptado de Paulínia",
      text:
        "Apoyo registrado en fuente oficial al equipo de Vóley Adaptado de Paulínia.",
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
