export type ElevenLabsServerEnv = {
  agentId: string;
  apiKey: string;
  voiceId: string;
  modelId: string;
  serverLocation: string;
  webhookSecret: string;
  textOnlyOverride: boolean;
};

const SDK_SOURCE = "js_sdk";
const SDK_VERSION = "1.32.0";

export function readElevenLabsEnv(): ElevenLabsServerEnv {
  const textOnlyOverride =
    process.env.ELEVENLABS_TEXT_ONLY_OVERRIDE?.trim() === "1" ||
    process.env.ELEVENLABS_TEXT_ONLY_OVERRIDE?.trim()?.toLowerCase() ===
      "true";
  return {
    agentId: process.env.ELEVENLABS_AGENT_ID?.trim() ?? "",
    apiKey: process.env.ELEVENLABS_API_KEY?.trim() ?? "",
    voiceId: process.env.ELEVENLABS_VOICE_ID?.trim() ?? "",
    modelId: process.env.ELEVENLABS_MODEL_ID?.trim() ?? "",
    serverLocation: process.env.ELEVENLABS_SERVER_LOCATION?.trim() ?? "",
    webhookSecret: process.env.ELEVENLABS_WEBHOOK_SECRET?.trim() ?? "",
    textOnlyOverride,
  };
}

function apiOrigin(serverLocation: string): string {
  const loc = serverLocation.trim().toLowerCase();
  if (loc === "us") return "https://api.us.elevenlabs.io";
  return "https://api.elevenlabs.io";
}

function convaiQuery(agentId: string, serverLocation: string): URLSearchParams {
  const params = new URLSearchParams({
    agent_id: agentId,
    source: SDK_SOURCE,
    version: SDK_VERSION,
  });
  const environment = process.env.ELEVENLABS_ENVIRONMENT?.trim();
  if (environment) {
    params.set("environment", environment);
  }
  void serverLocation;
  return params;
}

async function readApiErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      detail?: { message?: string } | string;
      message?: string;
    };
    if (typeof payload.detail === "string") return payload.detail;
    if (payload.detail && typeof payload.detail.message === "string") {
      return payload.detail.message;
    }
    if (typeof payload.message === "string") return payload.message;
  } catch {
    /* ignore */
  }
  return `HTTP ${response.status}`;
}

export async function fetchConvaiSignedUrl(
  agentId: string,
  apiKey: string,
  serverLocation = ""
): Promise<string> {
  const origin = apiOrigin(serverLocation);
  const params = convaiQuery(agentId, serverLocation);
  const response = await fetch(
    `${origin}/v1/convai/conversation/get-signed-url?${params.toString()}`,
    {
      headers: {
        "xi-api-key": apiKey,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const detail = await readApiErrorMessage(response);
    throw new Error(`signed-url-${response.status}: ${detail}`);
  }

  const payload = (await response.json()) as { signed_url?: string };
  const signedUrl = payload.signed_url?.trim();
  if (!signedUrl) {
    throw new Error("signed-url-empty");
  }
  return signedUrl;
}

export async function fetchConvaiConversationToken(
  agentId: string,
  apiKey: string,
  serverLocation = ""
): Promise<string> {
  const origin = apiOrigin(serverLocation);
  const params = convaiQuery(agentId, serverLocation);
  const response = await fetch(
    `${origin}/v1/convai/conversation/token?${params.toString()}`,
    {
      headers: {
        "xi-api-key": apiKey,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const detail = await readApiErrorMessage(response);
    throw new Error(`conversation-token-${response.status}: ${detail}`);
  }

  const payload = (await response.json()) as { token?: string };
  const token = payload.token?.trim();
  if (!token) {
    throw new Error("conversation-token-empty");
  }
  return token;
}

export function publicElevenLabsConfig(env = readElevenLabsEnv()) {
  const { agentId, apiKey, serverLocation, voiceId, textOnlyOverride } = env;
  return {
    agentId,
    configured: Boolean(agentId),
    textChatReady: Boolean(agentId && apiKey),
    textOnlySession: textOnlyOverride,
    serverLocation: serverLocation || undefined,
    voiceId: voiceId || undefined,
  };
}

export function elevenLabsEnvDiagnostics() {
  const env = readElevenLabsEnv();
  return {
    agentIdSet: Boolean(env.agentId),
    apiKeySet: Boolean(env.apiKey),
    serverLocation: env.serverLocation || null,
    textOnlyOverride: env.textOnlyOverride,
  };
}
