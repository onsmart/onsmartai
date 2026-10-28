import type { VercelRequest, VercelResponse } from "@vercel/node";
import { publicElevenLabsConfig } from "./_lib/elevenlabs";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  if (_req.method !== "GET" && _req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  res
    .status(200)
    .setHeader("Cache-Control", "no-store")
    .json(publicElevenLabsConfig());
}
