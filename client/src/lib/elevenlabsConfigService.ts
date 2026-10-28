import {
  getElevenLabsConfigStaticUrl,
  getElevenLabsConfigUrl,
} from "./apiUrls";

export type ElevenLabsAgentConfig = {
  agentId: string;
  configured: boolean;
  textChatReady?: boolean;
  textOnlySession?: boolean;
  serverLocation?: string;
  voiceId?: string;
};

let configCache: ElevenLabsAgentConfig | null = null;

async function loadConfigFrom(url: string): Promise<ElevenLabsAgentConfig> {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`elevenlabs-config-${response.status}`);
  }
  return (await response.json()) as ElevenLabsAgentConfig;
}

export async function fetchElevenLabsAgentConfig(): Promise<ElevenLabsAgentConfig> {
  if (configCache) return configCache;

  try {
    configCache = await loadConfigFrom(getElevenLabsConfigUrl());
    return configCache;
  } catch (apiError) {
    try {
      configCache = await loadConfigFrom(getElevenLabsConfigStaticUrl());
      return configCache;
    } catch {
      throw apiError;
    }
  }
}

export function clearElevenLabsConfigCache() {
  configCache = null;
}
