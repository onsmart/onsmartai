import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import { MARKETING_EMAIL } from "../../shared/contact";

export type ContactLead = {
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  message?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailContent(lead: ContactLead) {
  const text = [
    "Novo contato pelo site Onsmart.AI",
    "",
    `Nome: ${lead.name}`,
    `E-mail: ${lead.email}`,
    `Telefone: ${lead.phone}`,
    `Empresa: ${lead.company}`,
    `Assunto: ${lead.interest}`,
    lead.message ? `Mensagem:\n${lead.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <h2>Novo contato — site Onsmart.AI</h2>
    <p><strong>Nome:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Telefone:</strong> ${escapeHtml(lead.phone)}</p>
    <p><strong>Empresa:</strong> ${escapeHtml(lead.company)}</p>
    <p><strong>Assunto:</strong> ${escapeHtml(lead.interest)}</p>
    ${
      lead.message
        ? `<p><strong>Mensagem:</strong><br/>${escapeHtml(lead.message).replace(/\n/g, "<br/>")}</p>`
        : ""
    }
  `;

  return {
    subject: `[Site] Contato: ${lead.interest} — ${lead.company}`,
    text,
    html,
  };
}

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASSWORD?.trim()
  );
}

function resolveFromAddress(): string {
  const from =
    process.env.SENDGRID_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    `Onsmart.AI Site <${MARKETING_EMAIL}>`;
  return from;
}

function resolveToAddress(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || MARKETING_EMAIL;
}

function readSendGridApiKey(): string {
  const apiKey = process.env.SENDGRID_API_KEY?.trim() ?? "";
  if (!apiKey) return "";
  if (/[<>\s]/.test(apiKey)) {
    throw new Error(
      "SENDGRID_API_KEY inválida: remova espaços ou caracteres extras (ex.: >) e cole a key completa do painel SendGrid."
    );
  }
  if (!apiKey.startsWith("SG.")) {
    throw new Error(
      "SENDGRID_API_KEY deve começar com SG. (crie uma API Key em SendGrid → Settings → API Keys)."
    );
  }
  return apiKey;
}

function sendGridApiConfigured(): boolean {
  try {
    return Boolean(readSendGridApiKey());
  } catch {
    return Boolean(process.env.SENDGRID_API_KEY?.trim());
  }
}

async function sendViaSendGridApi(
  lead: ContactLead,
  content: ReturnType<typeof buildEmailContent>
): Promise<void> {
  sgMail.setApiKey(readSendGridApiKey());
  try {
    await sgMail.send({
      to: resolveToAddress(),
      from: resolveFromAddress(),
      replyTo: lead.email,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
  } catch (error: unknown) {
    const body =
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "body" in error.response
        ? error.response.body
        : undefined;
    console.error("[Contact] SendGrid error:", body ?? error);
    throw error;
  }
}

async function sendViaSmtp(
  lead: ContactLead,
  content: ReturnType<typeof buildEmailContent>
): Promise<void> {
  const port = Number(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!.trim(),
    port: Number.isFinite(port) ? port : 587,
    secure,
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass: process.env.SMTP_PASSWORD!.trim(),
    },
  });

  await transporter.sendMail({
    from: resolveFromAddress(),
    to: resolveToAddress(),
    replyTo: lead.email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}

export async function sendContactLeadEmail(lead: ContactLead): Promise<void> {
  const content = buildEmailContent(lead);

  if (sendGridApiConfigured()) {
    await sendViaSendGridApi(lead, content);
    return;
  }

  if (smtpConfigured()) {
    await sendViaSmtp(lead, content);
    return;
  }

  throw new Error(
    "E-mail não configurado. Defina SENDGRID_API_KEY (recomendado) ou SMTP_HOST, SMTP_USER e SMTP_PASSWORD no .env."
  );
}
