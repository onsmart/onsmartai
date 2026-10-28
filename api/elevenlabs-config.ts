import type { VercelRequest, VercelResponse } from "@vercel/node";
import { publicElevenLabsConfig } from "./elevenlabsLib";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    if (_req.method !== "GET" && _req.method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }

    res
      .status(200)
      .setHeader("Cache-Control", "no-store")
      .json(publicElevenLabsConfig());
  } catch (error) {
    console.error("[api/elevenlabs-config]", error);
    res.status(500).json({ error: "handler_failed" });
  }
}
