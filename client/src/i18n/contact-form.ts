import type { SiteLocale } from "@shared/locale";

/** Valores canônicos (PT) — usados na URL, no submit e no e-mail comercial. */
export const CONTACT_INTEREST_VALUES = [
  "Consultoria",
  "Treinamentos",
  "Desenvolvimento de IA",
  "SON.IA",
  "Parcerias",
  "Imprensa",
  "Outros assuntos",
] as const;

export type ContactInterestValue = (typeof CONTACT_INTEREST_VALUES)[number];

export type ContactFormCopy = {
  successBody: string;
  submitError: string;
  interestLabels: Record<ContactInterestValue, string>;
  questions: Record<
    ContactInterestValue,
    { label: string; placeholder: string }
  >;
};

const pt: ContactFormCopy = {
  successBody:
    "Obrigado pelo contato. Nossa equipe comercial retornará em breve. Se preferir resposta imediata, use o WhatsApp ou {email}.",
  submitError:
    "Não foi possível enviar agora. Tente novamente ou escreva para {email}",
  interestLabels: {
    Consultoria: "Consultoria",
    Treinamentos: "Treinamentos",
    "Desenvolvimento de IA": "Desenvolvimento de IA",
    "SON.IA": "SON.IA",
    Parcerias: "Parcerias",
    Imprensa: "Imprensa",
    "Outros assuntos": "Outros assuntos",
  },
  questions: {
    Consultoria: {
      label: "Qual processo você gostaria de melhorar?",
      placeholder: "Conte brevemente sobre o desafio da operação.",
    },
    Treinamentos: {
      label: "Para quem seria a capacitação?",
      placeholder: "Profissionais, lideranças ou uma equipe da empresa?",
    },
    "Desenvolvimento de IA": {
      label: "O que o seu projeto precisa resolver?",
      placeholder:
        "Descreva a necessidade, sem enviar informações confidenciais.",
    },
    "SON.IA": {
      label: "Em qual área você gostaria de conhecer a SON.IA?",
      placeholder: "Ex.: atendimento, vendas ou operações.",
    },
    Parcerias: {
      label: "Qual modalidade de parceria tem interesse?",
      placeholder: "Agente Digital, Revenda ou White Label.",
    },
    Imprensa: {
      label: "Qual é a pauta e o veículo?",
      placeholder: "Compartilhe o tema do seu contato.",
    },
    "Outros assuntos": {
      label: "Como podemos ajudar?",
      placeholder: "Deixe uma breve mensagem.",
    },
  },
};

const en: ContactFormCopy = {
  successBody:
    "Thank you for reaching out. Our commercial team will get back to you soon. For an immediate response, use WhatsApp or {email}.",
  submitError:
    "We could not send your message right now. Please try again or email {email}",
  interestLabels: {
    Consultoria: "Consulting",
    Treinamentos: "Training",
    "Desenvolvimento de IA": "AI development",
    "SON.IA": "SON.IA",
    Parcerias: "Partnerships",
    Imprensa: "Press",
    "Outros assuntos": "Other topics",
  },
  questions: {
    Consultoria: {
      label: "Which process would you like to improve?",
      placeholder: "Briefly describe the operational challenge.",
    },
    Treinamentos: {
      label: "Who would the training be for?",
      placeholder: "Professionals, leaders, or a company team?",
    },
    "Desenvolvimento de IA": {
      label: "What does your project need to solve?",
      placeholder:
        "Describe the need without sending confidential information.",
    },
    "SON.IA": {
      label: "In which area would you like to explore SON.IA?",
      placeholder: "E.g. customer service, sales, or operations.",
    },
    Parcerias: {
      label: "Which partnership model interests you?",
      placeholder: "Digital Agent, Reseller, or White Label.",
    },
    Imprensa: {
      label: "What is the story and outlet?",
      placeholder: "Share the topic of your inquiry.",
    },
    "Outros assuntos": {
      label: "How can we help?",
      placeholder: "Leave a short message.",
    },
  },
};

const es: ContactFormCopy = {
  successBody:
    "Gracias por contactarnos. Nuestro equipo comercial responderá pronto. Si prefiere una respuesta inmediata, use WhatsApp o {email}.",
  submitError:
    "No fue posible enviar ahora. Intente de nuevo o escriba a {email}",
  interestLabels: {
    Consultoria: "Consultoría",
    Treinamentos: "Capacitación",
    "Desenvolvimento de IA": "Desarrollo de IA",
    "SON.IA": "SON.IA",
    Parcerias: "Alianzas",
    Imprensa: "Prensa",
    "Outros assuntos": "Otros temas",
  },
  questions: {
    Consultoria: {
      label: "¿Qué proceso le gustaría mejorar?",
      placeholder: "Cuente brevemente el desafío de la operación.",
    },
    Treinamentos: {
      label: "¿Para quién sería la capacitación?",
      placeholder: "¿Profesionales, líderes o un equipo de la empresa?",
    },
    "Desenvolvimento de IA": {
      label: "¿Qué debe resolver su proyecto?",
      placeholder:
        "Describa la necesidad sin enviar información confidencial.",
    },
    "SON.IA": {
      label: "¿En qué área le gustaría conocer SON.IA?",
      placeholder: "Ej.: atención, ventas u operaciones.",
    },
    Parcerias: {
      label: "¿Qué modalidad de alianza le interesa?",
      placeholder: "Agente Digital, Revenda o White Label.",
    },
    Imprensa: {
      label: "¿Cuál es la nota y el medio?",
      placeholder: "Comparta el tema de su contacto.",
    },
    "Outros assuntos": {
      label: "¿Cómo podemos ayudar?",
      placeholder: "Deje un mensaje breve.",
    },
  },
};

export const CONTACT_FORM: Record<SiteLocale, ContactFormCopy> = {
  "pt-BR": pt,
  en,
  es,
};

export function isContactInterestValue(
  value: string
): value is ContactInterestValue {
  return (CONTACT_INTEREST_VALUES as readonly string[]).includes(value);
}
