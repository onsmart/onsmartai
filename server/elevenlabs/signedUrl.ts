function apiOrigin(serverLocation: string): string {
  const loc = serverLocation.trim().toLowerCase();
  if (loc === "us") return "https://api.us.elevenlabs.io";
  return "https://api.elevenlabs.io";
}

export async function fetchConvaiSignedUrl(
  agentId: string,
  apiKey: string,
  serverLocation = ""
): Promise<string> {
  const origin = apiOrigin(serverLocation);
  const params = new URLSearchParams({
    agent_id: agentId,
    source: "js_sdk",
    version: "1.32.0",
  });
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
    throw new Error(`signed-url-${response.status}`);
  }

  const payload = (await response.json()) as { signed_url?: string };
  const signedUrl = payload.signed_url?.trim();
  if (!signedUrl) {
    throw new Error("signed-url-empty");
  }
  return signedUrl;
}
