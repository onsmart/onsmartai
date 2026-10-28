import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  fetchConvaiConversationToken,
  readElevenLabsEnv,
} from "./elevenlabsLib";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
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

    const conversationToken = await fetchConvaiConversationToken(
      agentId,
      apiKey,
      serverLocation
    );
    res
      .status(200)
      .setHeader("Cache-Control", "no-store")
      .json({ conversationToken });
  } catch (error) {
    console.error("[api/elevenlabs-conversation-token]", error);
    res.status(502).json({
      error: "conversation_token_failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
