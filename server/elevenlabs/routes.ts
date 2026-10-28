import type { Express, Request, Response } from "express";
import { readElevenLabsEnv } from "./env";
import { fetchConvaiSignedUrl } from "./signedUrl";
import {
  buildElevenLabsWidgetPayload,
  isAllowedCorsOrigin,
  localeFromRequest,
} from "./widget";

function setCors(req: Request, res: Response) {
  const origin = req.headers.origin;
  if (origin && isAllowedCorsOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept-Language");
}

export function registerElevenLabsRoutes(app: Express) {
  const handler = (req: Request, res: Response) => {
    setCors(req, res);
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    const locale = localeFromRequest(req);
    const payload = buildElevenLabsWidgetPayload(locale);
    res.status(200).json(payload);
  };

  app.get("/api/elevenlabs-config", (_req, res) => {
    const { agentId, apiKey, serverLocation, voiceId } = readElevenLabsEnv();
    res
      .status(200)
      .set("Cache-Control", "no-store")
      .json({
        agentId,
        configured: Boolean(agentId),
        textChatReady: Boolean(agentId && apiKey),
        serverLocation: serverLocation || undefined,
        voiceId: voiceId || undefined,
      });
  });

  app.get("/api/elevenlabs-signed-url", async (_req, res) => {
    const { agentId, apiKey, serverLocation } = readElevenLabsEnv();
    if (!agentId) {
      res.status(404).json({ error: "agent_not_configured" });
      return;
    }
    if (!apiKey) {
      console.warn(
        "[SON.IA] GET /api/elevenlabs-signed-url: ELEVENLABS_API_KEY ausente — reinicie o servidor após editar o .env."
      );
      res.status(503).json({ error: "api_key_missing" });
      return;
    }
    try {
      const signedUrl = await fetchConvaiSignedUrl(
        agentId,
        apiKey,
        serverLocation
      );
      res.status(200).set("Cache-Control", "no-store").json({ signedUrl });
    } catch {
      res.status(502).json({ error: "signed_url_failed" });
    }
  });

  app.get("/api/elevenlabs-widget", handler);
  app.get("/api/elevenlabs/widget", handler);
  app.options("/api/elevenlabs-widget", handler);
  app.options("/api/elevenlabs/widget", handler);

  app.post("/api/elevenlabs/webhook", (req, res) => {
    const { webhookSecret: secret } = readElevenLabsEnv();
    if (secret) {
      const headerSecret = String(req.headers["x-webhook-secret"] ?? "").trim();
      const signature = String(req.headers["x-elevenlabs-signature"] ?? "").trim();
      const bearer = String(req.headers.authorization ?? "")
        .replace(/^Bearer\s+/i, "")
        .trim();
      const authorized =
        headerSecret === secret ||
        signature === secret ||
        bearer === secret;
      if (!authorized) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
    }
    res.status(200).json({ received: true, ok: true });
  });
}
