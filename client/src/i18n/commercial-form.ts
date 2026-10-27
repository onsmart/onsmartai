import type { SiteLocale } from "@shared/locale";

export type CommercialFormCopy = {
  successTitle: string;
  successBody: string;
  whatsappCta: string;
  sendAnother: string;
  stepProgress: string;
  step1Label: string;
  step2Label: string;
  step1Title: string;
  step2TitlePartners: string;
  step2TitleDefault: string;
  step1Intro: string;
  step2Intro: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  continue: string;
  phone: string;
  phoneTitle: string;
  phonePlaceholder: string;
  company: string;
  companyOptional: string;
  companyPlaceholder: string;
  modeLabel: string;
  modeHint: string;
  privacyPrefix: string;
  privacyLink: string;
  privacySuffix: string;
  back: string;
  submit: string;
  disclaimer: string;
  questions: Record<string, { label: string; hint: string }>;
};

const questionsPt = {
  "palestras-em-ia": {
    label: "Qual é o contexto do evento?",
    hint: "Evento, convenção ou reunião de diretoria; público e tema de interesse.",
  },
  "imersao-em-ia": {
    label: "Que desafios a equipe quer trabalhar?",
    hint: "Áreas envolvidas e processos que deseja avaliar, sem informações confidenciais.",
  },
  "capacitacao-de-lideres": {
    label: "Que decisões suas lideranças precisam conduzir?",
    hint: "Áreas, prioridades e momento de adoção de IA.",
  },
  academia: {
    label: "Qual é seu objetivo de aprendizagem?",
    hint: "IA generativa, prompts ou desenho e gestão de agentes; acesso individual ou equipe.",
  },
  "educacao-corporativa": {
    label: "Em que momento está a formação da empresa?",
    hint: "Público, maturidade e prioridades da capacitação.",
  },
  "consultoria-em-ia": {
    label: "Qual processo você gostaria de avaliar?",
    hint: "O desafio e o objetivo da empresa, sem dados sigilosos.",
  },
  "apps-e-agentes": {
    label: "O que o projeto precisa resolver?",
    hint: "Necessidade, usuários e sistemas envolvidos, sem credenciais ou arquivos privados.",
  },
  sonia: {
    label: "Que processo gostaria de conhecer na SON.IA?",
    hint: "O contexto da operação, sem enviar dados de clientes.",
  },
  parcerias: {
    label: "Conte sobre sua atuação e interesse na parceria.",
    hint: "Seu perfil, experiência e público atendido, sem dados de terceiros.",
  },
};

const pt: CommercialFormCopy = {
  successTitle: "Recebemos seu interesse.",
  successBody:
    "Nossa equipe analisará as informações e retornará em breve. Se preferir falar agora, use o WhatsApp ou escreva para {email}.",
  whatsappCta: "Conversar pelo WhatsApp",
  sendAnother: "Enviar outra mensagem",
  stepProgress: "Etapa {step} de 2",
  step1Label: "01 · Contato",
  step2Label: "02 · Contexto",
  step1Title: "Primeiro, como podemos conversar?",
  step2TitlePartners: "Vamos entender seu perfil.",
  step2TitleDefault: "Agora, o contexto do seu interesse.",
  step1Intro: "Informe seus dados de contato para iniciarmos a conversa.",
  step2Intro:
    "Compartilhe apenas informações necessárias. Não inclua dados confidenciais.",
  name: "Nome",
  namePlaceholder: "Como podemos chamar você?",
  email: "E-mail",
  emailPlaceholder: "voce@empresa.com.br",
  continue: "Continuar",
  phone: "Telefone (opcional)",
  phoneTitle: "Use de 8 a 25 caracteres com números e símbolos de telefone.",
  phonePlaceholder: "(11) 99999-9999",
  company: "Empresa ou atuação",
  companyOptional: "Empresa ou atuação (opcional)",
  companyPlaceholder: "Seu contexto profissional",
  modeLabel: "Modalidade selecionada",
  modeHint:
    "Você pode alterar a modalidade na seleção desta página antes de concluir.",
  privacyPrefix: "Li o",
  privacyLink: "política de privacidade",
  privacySuffix:
    "e autorizo o contato da Onsmart.AI conforme descrito nela.",
  back: "Voltar",
  submit: "Enviar qualificação",
  disclaimer:
    "Seus dados são usados apenas para retorno comercial conforme a política de privacidade.",
  questions: questionsPt,
};

const en: CommercialFormCopy = {
  successTitle: "We received your interest.",
  successBody:
    "Our team will review the information and get back to you soon. To talk now, use WhatsApp or email {email}.",
  whatsappCta: "Chat on WhatsApp",
  sendAnother: "Send another message",
  stepProgress: "Step {step} of 2",
  step1Label: "01 · Contact",
  step2Label: "02 · Context",
  step1Title: "First, how can we reach you?",
  step2TitlePartners: "Let's understand your profile.",
  step2TitleDefault: "Now, the context of your interest.",
  step1Intro: "Share your contact details so we can start the conversation.",
  step2Intro:
    "Share only what is necessary. Do not include confidential data.",
  name: "Name",
  namePlaceholder: "What should we call you?",
  email: "Email",
  emailPlaceholder: "you@company.com",
  continue: "Continue",
  phone: "Phone (optional)",
  phoneTitle: "Use 8 to 25 characters with numbers and phone symbols.",
  phonePlaceholder: "+1 (555) 000-0000",
  company: "Company or role",
  companyOptional: "Company or role (optional)",
  companyPlaceholder: "Your professional context",
  modeLabel: "Selected model",
  modeHint: "You can change the model on this page before submitting.",
  privacyPrefix: "I have read the",
  privacyLink: "privacy policy",
  privacySuffix:
    "and authorize Onsmart.AI to contact me as described therein.",
  back: "Back",
  submit: "Submit qualification",
  disclaimer:
    "Your data is used only for commercial follow-up under our privacy policy.",
  questions: {
    "palestras-em-ia": {
      label: "What is the event context?",
      hint: "Event, convention, or board meeting; audience and topics of interest.",
    },
    "imersao-em-ia": {
      label: "What challenges should the team work on?",
      hint: "Areas and processes to assess, without confidential information.",
    },
    "capacitacao-de-lideres": {
      label: "What decisions must your leaders drive?",
      hint: "Areas, priorities, and stage of AI adoption.",
    },
    academia: {
      label: "What is your learning goal?",
      hint: "Generative AI, prompts, or agent design and management; individual or team access.",
    },
    "educacao-corporativa": {
      label: "Where is your company's training journey?",
      hint: "Audience, maturity, and training priorities.",
    },
    "consultoria-em-ia": {
      label: "Which process would you like to assess?",
      hint: "The challenge and business goal, without sensitive data.",
    },
    "apps-e-agentes": {
      label: "What must the project solve?",
      hint: "Need, users, and systems involved, without credentials or private files.",
    },
    sonia: {
      label: "Which process would you like to explore on SON.IA?",
      hint: "Operational context, without sending customer data.",
    },
    parcerias: {
      label: "Tell us about your work and partnership interest.",
      hint: "Your profile, experience, and audience served, without third-party data.",
    },
  },
};

const es: CommercialFormCopy = {
  successTitle: "Recibimos su interés.",
  successBody:
    "Nuestro equipo revisará la información y responderá pronto. Si prefiere hablar ahora, use WhatsApp o escriba a {email}.",
  whatsappCta: "Hablar por WhatsApp",
  sendAnother: "Enviar otro mensaje",
  stepProgress: "Paso {step} de 2",
  step1Label: "01 · Contacto",
  step2Label: "02 · Contexto",
  step1Title: "Primero, ¿cómo podemos contactarlo?",
  step2TitlePartners: "Entendamos su perfil.",
  step2TitleDefault: "Ahora, el contexto de su interés.",
  step1Intro: "Indique sus datos de contacto para iniciar la conversación.",
  step2Intro:
    "Comparta solo la información necesaria. No incluya datos confidenciales.",
  name: "Nombre",
  namePlaceholder: "¿Cómo podemos llamarlo?",
  email: "Correo electrónico",
  emailPlaceholder: "usted@empresa.com",
  continue: "Continuar",
  phone: "Teléfono (opcional)",
  phoneTitle: "Use de 8 a 25 caracteres con números y símbolos de teléfono.",
  phonePlaceholder: "(11) 99999-9999",
  company: "Empresa o actividad",
  companyOptional: "Empresa o actividad (opcional)",
  companyPlaceholder: "Su contexto profesional",
  modeLabel: "Modalidad seleccionada",
  modeHint:
    "Puede cambiar la modalidad en esta página antes de enviar.",
  privacyPrefix: "He leído la",
  privacyLink: "política de privacidad",
  privacySuffix:
    "y autorizo el contacto de Onsmart.AI según lo descrito en ella.",
  back: "Volver",
  submit: "Enviar calificación",
  disclaimer:
    "Sus datos se usan solo para seguimiento comercial según la política de privacidad.",
  questions: {
    "palestras-em-ia": {
      label: "¿Cuál es el contexto del evento?",
      hint: "Evento, convención o reunión de directorio; público y tema de interés.",
    },
    "imersao-em-ia": {
      label: "¿Qué desafíos quiere trabajar el equipo?",
      hint: "Áreas y procesos a evaluar, sin información confidencial.",
    },
    "capacitacao-de-lideres": {
      label: "¿Qué decisiones deben conducir sus líderes?",
      hint: "Áreas, prioridades y momento de adopción de IA.",
    },
    academia: {
      label: "¿Cuál es su objetivo de aprendizaje?",
      hint: "IA generativa, prompts o diseño y gestión de agentes; acceso individual o equipo.",
    },
    "educacao-corporativa": {
      label: "¿En qué momento está la formación de la empresa?",
      hint: "Público, madurez y prioridades de capacitación.",
    },
    "consultoria-em-ia": {
      label: "¿Qué proceso le gustaría evaluar?",
      hint: "El desafío y el objetivo empresarial, sin datos sensibles.",
    },
    "apps-e-agentes": {
      label: "¿Qué debe resolver el proyecto?",
      hint: "Necesidad, usuarios y sistemas involucrados, sin credenciales ni archivos privados.",
    },
    sonia: {
      label: "¿Qué proceso le gustaría conocer en SON.IA?",
      hint: "Contexto operativo, sin enviar datos de clientes.",
    },
    parcerias: {
      label: "Cuéntenos su actuación e interés en la alianza.",
      hint: "Su perfil, experiencia y público atendido, sin datos de terceros.",
    },
  },
};

export const COMMERCIAL_FORM: Record<SiteLocale, CommercialFormCopy> = {
  "pt-BR": pt,
  en,
  es,
};
