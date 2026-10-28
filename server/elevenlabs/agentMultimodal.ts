function elevenLabsApiOrigin(serverLocation = ""): string {
  return serverLocation.trim().toLowerCase() === "us"
    ? "https://api.us.elevenlabs.io"
    : "https://api.elevenlabs.io";
}

export type AgentVoiceHints = {
  textOnly: boolean | null;
  speculativeTurn: boolean | null;
};

/**
 * ConvAI agents with `conversation.text_only: true` reject WebRTC voice sessions
 * (LiveKit connects, then "Server error: Unknown error").
 * Text chat uses runtime `textOnly: true` when override is allowed in Security.
 */
export async function fetchAgentVoiceHints(
  agentId: string,
  apiKey: string,
  serverLocation = ""
): Promise<AgentVoiceHints | null> {
  try {
    const response = await fetch(
      `${elevenLabsApiOrigin(serverLocation)}/v1/convai/agents/${agentId}`,
      { headers: { "xi-api-key": apiKey, Accept: "application/json" } }
    );
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      conversation_config?: {
        conversation?: { text_only?: boolean };
        turn?: { speculative_turn?: boolean };
      };
    };
    return {
      textOnly: payload.conversation_config?.conversation?.text_only ?? null,
      speculativeTurn:
        payload.conversation_config?.turn?.speculative_turn ?? null,
    };
  } catch {
    return null;
  }
}

/** @deprecated use fetchAgentVoiceHints */
export async function fetchAgentTextOnlyFlag(
  agentId: string,
  apiKey: string,
  serverLocation = ""
): Promise<boolean | null> {
  const hints = await fetchAgentVoiceHints(agentId, apiKey, serverLocation);
  return hints?.textOnly ?? null;
}

export function logAgentVoiceHints(hints: AgentVoiceHints | null): void {
  if (!hints) return;
  if (hints.textOnly === true) {
    console.warn(
      "[SON.IA] O agente ElevenLabs está em text_only=true (ex.: “Ativar modo via chat”). " +
        "A aba Voz falha até conversation.text_only=false no agente e override de text_only liberado em Segurança para o chat."
    );
  }
  if (hints.speculativeTurn === true) {
    console.warn(
      "[SON.IA] O agente está com turn.speculative_turn=true. Com first_message configurada, a voz pode repetir a saudação — desative “Turno especulativo” no painel ElevenLabs (Conversa → Turno)."
    );
  }
}

export function logAgentTextOnlyWarning(textOnly: boolean | null): void {
  logAgentVoiceHints({ textOnly, speculativeTurn: null });
}
