import type { VercelRequest, VercelResponse } from "@vercel/node";
import { elevenLabsEnvDiagnostics } from "./elevenlabsLib";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    res.status(200).json({
      status: "ok",
      runtime: "vercel",
      elevenlabs: elevenLabsEnvDiagnostics(),
    });
  } catch (error) {
    console.error("[api/health]", error);
    res.status(500).json({ error: "handler_failed" });
  }
}
