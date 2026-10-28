import { getElevenLabsConfigUrl } from "./apiUrls";

export type ElevenLabsAgentConfig = {
  agentId: string;
  configured: boolean;
  textChatReady?: boolean;
  textOnlySession?: boolean;
  serverLocation?: string;
  voiceId?: string;
};

let configCache: ElevenLabsAgentConfig | null = null;

export async function fetchElevenLabsAgentConfig(): Promise<ElevenLabsAgentConfig> {
  if (configCache) return configCache;

  const response = await fetch(getElevenLabsConfigUrl(), {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`elevenlabs-config-${response.status}`);
  }

  const payload = (await response.json()) as ElevenLabsAgentConfig;
  configCache = payload;
  return payload;
}

export function clearElevenLabsConfigCache() {
  configCache = null;
}
