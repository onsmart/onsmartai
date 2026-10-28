import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  fetchConvaiSignedUrl,
  readElevenLabsEnv,
} from "./_lib/elevenlabs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { agentId, apiKey, serverLocation } = readElevenLabsEnv();
  if (!agentId) {
    res.status(404).json({ error: "agent_not_configured" });
    return;
  }
  if (!apiKey) {
    res.status(503).json({ error: "api_key_missing" });
    return;
  }

  try {
    const signedUrl = await fetchConvaiSignedUrl(
      agentId,
      apiKey,
      serverLocation
    );
    res
      .status(200)
      .setHeader("Cache-Control", "no-store")
      .json({ signedUrl });
  } catch {
    res.status(502).json({ error: "signed_url_failed" });
  }
}
