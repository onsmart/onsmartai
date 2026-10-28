import type { Express, Request, Response, NextFunction } from "express";

const PROD_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https://unpkg.com https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.elevenlabs.io https://api.us.elevenlabs.io https://convai.elevenlabs.io https://*.elevenlabs.io wss://*.elevenlabs.io wss://api.elevenlabs.io wss://api.us.elevenlabs.io",
  "frame-src 'self' https://*.elevenlabs.io",
  "media-src 'self' blob: https:",
].join("; ");

export function registerSecurityHeaders(app: Express) {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Permissions-Policy", "microphone=(self)");
    if (process.env.NODE_ENV === "production") {
      res.setHeader("Content-Security-Policy", PROD_CSP);
    }
    next();
  });
}
