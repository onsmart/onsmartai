type VercelLikeRequest = {
  method?: string;
  url?: string;
  query?: Record<string, string | string[] | undefined>;
};

type VercelLikeResponse = {
  status: (code: number) => VercelLikeResponse;
  setHeader: (name: string, value: string) => VercelLikeResponse;
  json: (body: unknown) => void;
};

const SDK_SOURCE = "js_sdk";
const SDK_VERSION = "1.32.0";

function readElevenLabsEnv() {
  const textOnlyOverride =
    process.env.ELEVENLABS_TEXT_ONLY_OVERRIDE?.trim() === "1" ||
    process.env.ELEVENLABS_TEXT_ONLY_OVERRIDE?.trim()?.toLowerCase() ===
      "true";
  return {
    agentId: process.env.ELEVENLABS_AGENT_ID?.trim() ?? "",
    apiKey: process.env.ELEVENLABS_API_KEY?.trim() ?? "",
    voiceId: process.env.ELEVENLABS_VOICE_ID?.trim() ?? "",
    serverLocation: process.env.ELEVENLABS_SERVER_LOCATION?.trim() ?? "",
    textOnlyOverride,
  };
}

function apiOrigin(serverLocation: string): string {
  const loc = serverLocation.trim().toLowerCase();
  if (loc === "us") return "https://api.us.elevenlabs.io";
  return "https://api.elevenlabs.io";
}

function convaiQuery(agentId: string): URLSearchParams {
  const params = new URLSearchParams({
    agent_id: agentId,
    source: SDK_SOURCE,
    version: SDK_VERSION,
  });
  const environment = process.env.ELEVENLABS_ENVIRONMENT?.trim();
  if (environment) params.set("environment", environment);
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

async function fetchConvaiSignedUrl(
  agentId: string,
  apiKey: string,
  serverLocation: string
): Promise<string> {
  const origin = apiOrigin(serverLocation);
  const response = await fetch(
    `${origin}/v1/convai/conversation/get-signed-url?${convaiQuery(agentId).toString()}`,
    {
      headers: { "xi-api-key": apiKey, Accept: "application/json" },
    }
  );
  if (!response.ok) {
    throw new Error(
      `signed-url-${response.status}: ${await readApiErrorMessage(response)}`
    );
  }
  const payload = (await response.json()) as { signed_url?: string };
  const signedUrl = payload.signed_url?.trim();
  if (!signedUrl) throw new Error("signed-url-empty");
  return signedUrl;
}

async function fetchConvaiConversationToken(
  agentId: string,
  apiKey: string,
  serverLocation: string
): Promise<string> {
  const origin = apiOrigin(serverLocation);
  const response = await fetch(
    `${origin}/v1/convai/conversation/token?${convaiQuery(agentId).toString()}`,
    {
      headers: { "xi-api-key": apiKey, Accept: "application/json" },
    }
  );
  if (!response.ok) {
    throw new Error(
      `conversation-token-${response.status}: ${await readApiErrorMessage(response)}`
    );
  }
  const payload = (await response.json()) as { token?: string };
  const token = payload.token?.trim();
  if (!token) throw new Error("conversation-token-empty");
  return token;
}

function resolveAction(req: VercelLikeRequest): string {
  const queryAction = req.query?.action;
  if (typeof queryAction === "string" && queryAction) return queryAction;
  const url = req.url ?? "";
  if (url.includes("signed-url")) return "signed-url";
  if (url.includes("conversation-token")) return "conversation-token";
  if (url.includes("elevenlabs-config")) return "config";
  return "";
}

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse
) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const action = resolveAction(req);
  const env = readElevenLabsEnv();

  try {
    if (action === "config") {
      res
        .status(200)
        .setHeader("Cache-Control", "no-store")
        .json({
          agentId: env.agentId,
          configured: Boolean(env.agentId),
          textChatReady: Boolean(env.agentId && env.apiKey),
          textOnlySession: env.textOnlyOverride,
          serverLocation: env.serverLocation || undefined,
          voiceId: env.voiceId || undefined,
        });
      return;
    }

    if (!env.agentId) {
      res.status(404).json({ error: "agent_not_configured" });
      return;
    }
    if (!env.apiKey) {
      res.status(503).json({ error: "api_key_missing" });
      return;
    }

    if (action === "signed-url") {
      const signedUrl = await fetchConvaiSignedUrl(
        env.agentId,
        env.apiKey,
        env.serverLocation
      );
      res
        .status(200)
        .setHeader("Cache-Control", "no-store")
        .json({ signedUrl });
      return;
    }

    if (action === "conversation-token") {
      const conversationToken = await fetchConvaiConversationToken(
        env.agentId,
        env.apiKey,
        env.serverLocation
      );
      res
        .status(200)
        .setHeader("Cache-Control", "no-store")
        .json({ conversationToken });
      return;
    }

    res.status(404).json({ error: "unknown_action", action });
  } catch (error) {
    console.error(`[api/elevenlabs:${action}]`, error);
    const message = error instanceof Error ? error.message : String(error);
    if (action === "signed-url") {
      res.status(502).json({ error: "signed_url_failed", message });
      return;
    }
    if (action === "conversation-token") {
      res.status(502).json({ error: "conversation_token_failed", message });
      return;
    }
    res.status(500).json({ error: "handler_failed", message });
  }
}
