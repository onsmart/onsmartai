import { getElevenLabsConversationTokenUrl } from "./apiUrls";

export class ElevenLabsConversationTokenError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function fetchElevenLabsConversationToken(): Promise<string> {
  const response = await fetch(getElevenLabsConversationTokenUrl(), {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new ElevenLabsConversationTokenError(
      response.status,
      `conversation-token-${response.status}`
    );
  }

  const payload = (await response.json()) as { conversationToken?: string };
  const conversationToken = payload.conversationToken?.trim();
  if (!conversationToken) {
    throw new ElevenLabsConversationTokenError(502, "conversation-token-empty");
  }
  return conversationToken;
}
