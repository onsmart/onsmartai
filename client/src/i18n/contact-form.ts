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

export type ContactFormUiCopy = {
  panelTitle: string;
  successTitle: string;
  backToForm: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phoneTitle: string;
  phonePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  interestLabel: string;
  interestPlaceholder: string;
  privacyPrefix: string;
  privacyLink: string;
  privacySuffix: string;
  submitting: string;
  submit: string;
  footerNotice: string;
};

export type ContactFormCopy = {
  ui: ContactFormUiCopy;
  successBody: string;
  submitError: string;
  interestLabels: Record<ContactInterestValue, string>;
  questions: Record<
    ContactInterestValue,
    { label: string; placeholder: string }
  >;
};

const uiPt: ContactFormUiCopy = {
  panelTitle: "Conte sobre o seu próximo passo",
  successTitle: "Mensagem recebida.",
  backToForm: "Voltar ao formulário",
  nameLabel: "Nome completo",
  namePlaceholder: "Seu nome",
  emailLabel: "E-mail corporativo",
  emailPlaceholder: "voce@empresa.com.br",
  phoneLabel: "Telefone",
  phoneTitle:
    "Informe de 8 a 25 caracteres, usando números e símbolos de telefone.",
  phonePlaceholder: "(11) 99999-9999",
  companyLabel: "Empresa",
  companyPlaceholder: "Nome da empresa",
  interestLabel: "Assunto de interesse",
  interestPlaceholder: "Selecione o que faz sentido para você",
  privacyPrefix: "Li o",
  privacyLink: "política de privacidade",
  privacySuffix:
    " e autorizo o contato da Onsmart.AI conforme descrito nela.",
  submitting: "Enviando…",
  submit: "Enviar mensagem",
  footerNotice:
    "Suas informações serão usadas apenas para retorno comercial, conforme a política de privacidade.",
};

const uiEn: ContactFormUiCopy = {
  panelTitle: "Tell us about your next step",
  successTitle: "Message received.",
  backToForm: "Back to the form",
  nameLabel: "Full name",
  namePlaceholder: "Your name",
  emailLabel: "Work email",
  emailPlaceholder: "you@company.com",
  phoneLabel: "Phone",
  phoneTitle: "Use 8 to 25 characters with numbers and phone symbols.",
  phonePlaceholder: "+1 (555) 000-0000",
  companyLabel: "Company",
  companyPlaceholder: "Company name",
  interestLabel: "Topic of interest",
  interestPlaceholder: "Select what fits your situation",
  privacyPrefix: "I have read the",
  privacyLink: "privacy policy",
  privacySuffix:
    " and authorize Onsmart.AI to contact me as described therein.",
  submitting: "Sending…",
  submit: "Send message",
  footerNotice:
    "Your information will be used only for commercial follow-up, as described in the privacy policy.",
};

const uiEs: ContactFormUiCopy = {
  panelTitle: "Cuéntenos su siguiente paso",
  successTitle: "Mensaje recibido.",
  backToForm: "Volver al formulario",
  nameLabel: "Nombre completo",
  namePlaceholder: "Su nombre",
  emailLabel: "Correo corporativo",
  emailPlaceholder: "usted@empresa.com",
  phoneLabel: "Teléfono",
  phoneTitle:
    "Use de 8 a 25 caracteres con números y símbolos de teléfono.",
  phonePlaceholder: "(11) 99999-9999",
  companyLabel: "Empresa",
  companyPlaceholder: "Nombre de la empresa",
  interestLabel: "Asunto de interés",
  interestPlaceholder: "Seleccione lo que tenga sentido para usted",
  privacyPrefix: "He leído la",
  privacyLink: "política de privacidad",
  privacySuffix:
    " y autorizo el contacto de Onsmart.AI según lo descrito en ella.",
  submitting: "Enviando…",
  submit: "Enviar mensaje",
  footerNotice:
    "Su información se usará solo para seguimiento comercial, conforme a la política de privacidad.",
};

const pt: ContactFormCopy = {
  ui: uiPt,
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
  ui: uiEn,
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
  ui: uiEs,
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
