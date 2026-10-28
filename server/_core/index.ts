import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
dotenv.config({ path: path.join(projectRoot, ".env") });
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerCmsRoutes } from "../cms/routes";
import { registerElevenLabsRoutes } from "../elevenlabs/routes";
import { registerSecurityHeaders } from "./securityHeaders";
import { readElevenLabsEnv } from "../elevenlabs/env";

async function startServer() {
  const app = express();
  const server = createServer(app);
  registerSecurityHeaders(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "24mb" }));
  app.use(express.urlencoded({ limit: "24mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  registerElevenLabsRoutes(app);
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });
  registerOAuthRoutes(app);
  registerCmsRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
    const { agentId, apiKey } = readElevenLabsEnv();
    if (agentId && !apiKey) {
      console.warn(
        "[SON.IA] ELEVENLABS_API_KEY ausente no .env — chat por texto precisa de signed URL. Reinicie o servidor após alterar o .env."
      );
    }
  });
}

startServer().catch(error => { console.error(error); process.exit(1); });
