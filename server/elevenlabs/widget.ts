import type { Request } from "express";
import { readElevenLabsEnv } from "./env";

export type ElevenLabsWidgetPayload = {
  widgetHtml: string;
  isConfigured: boolean;
  config: {
    hasVoiceSupport: boolean;
    language?: string;
    autoStart?: boolean;
    showUI?: boolean;
    voiceOverride?: boolean;
    serverLocation?: string;
  };
  message?: string;
};

const AGENT_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const VOICE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const SERVER_LOCATION_PATTERN = /^(us|global|eu-residency|in-residency)$/;

export function resolveElevenLabsLanguage(locale: string | undefined): string {
  if (locale === "en") return "en";
  if (locale === "es") return "es";
  return "pt-BR";
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildElevenLabsWidgetPayload(
  locale: string | undefined
): ElevenLabsWidgetPayload {
  const { agentId, voiceId, serverLocation } = readElevenLabsEnv();
  const language = resolveElevenLabsLanguage(locale);

  if (!agentId || !AGENT_ID_PATTERN.test(agentId)) {
    return {
      widgetHtml: "",
      isConfigured: false,
      config: { hasVoiceSupport: false },
      message:
        "ElevenLabs não configurado. Chat funcionará apenas em modo texto.",
    };
  }

  const safeId = escapeHtmlAttr(agentId);
  const attrs = [
    `agent-id="${safeId}"`,
    `auto-start="false"`,
    `show-ui="false"`,
    `language="${language}"`,
    'style="width: 100%; height: 100%;"',
  ];

  if (voiceId && VOICE_ID_PATTERN.test(voiceId)) {
    attrs.push(`override-voice-id="${escapeHtmlAttr(voiceId)}"`);
  }

  if (serverLocation && SERVER_LOCATION_PATTERN.test(serverLocation)) {
    attrs.push(`server-location="${escapeHtmlAttr(serverLocation)}"`);
  }

  const widgetHtml = `<elevenlabs-convai ${attrs.join(" ")}></elevenlabs-convai>`;

  return {
    widgetHtml,
    isConfigured: true,
    config: {
      hasVoiceSupport: true,
      language,
      autoStart: false,
      showUI: false,
      voiceOverride: Boolean(voiceId && VOICE_ID_PATTERN.test(voiceId)),
      serverLocation: serverLocation || undefined,
    },
  };
}

export function localeFromRequest(req: Request): string | undefined {
  const query = req.query.locale;
  if (typeof query === "string" && query.length > 0) return query;
  const accept = req.headers["accept-language"];
  if (typeof accept === "string") {
    if (accept.includes("es")) return "es";
    if (accept.includes("en")) return "en";
  }
  return "pt-BR";
}

export function isAllowedCorsOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  const allowed = process.env.ALLOWED_ORIGINS?.split(",")
    .map(s => s.trim())
    .filter(Boolean);
  if (!allowed?.length) return true;
  return allowed.some(entry => origin === entry || origin.endsWith(entry));
}
