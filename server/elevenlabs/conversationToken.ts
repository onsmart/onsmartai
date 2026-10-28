function apiOrigin(serverLocation: string): string {
  const loc = serverLocation.trim().toLowerCase();
  if (loc === "us") return "https://api.us.elevenlabs.io";
  return "https://api.elevenlabs.io";
}

export async function fetchConvaiConversationToken(
  agentId: string,
  apiKey: string,
  serverLocation = ""
): Promise<string> {
  const origin = apiOrigin(serverLocation);
  const params = new URLSearchParams({ agent_id: agentId });
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
    throw new Error(`conversation-token-${response.status}`);
  }

  const payload = (await response.json()) as { token?: string };
  const token = payload.token?.trim();
  if (!token) {
    throw new Error("conversation-token-empty");
  }
  return token;
}
