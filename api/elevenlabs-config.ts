import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readElevenLabsEnv } from "../server/elevenlabs/env";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  if (_req.method !== "GET" && _req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { agentId, apiKey, serverLocation, voiceId, textOnlyOverride } =
    readElevenLabsEnv();

  res
    .status(200)
    .setHeader("Cache-Control", "no-store")
    .json({
      agentId,
      configured: Boolean(agentId),
      textChatReady: Boolean(agentId && apiKey),
      textOnlySession: textOnlyOverride,
      serverLocation: serverLocation || undefined,
      voiceId: voiceId || undefined,
    });
}
