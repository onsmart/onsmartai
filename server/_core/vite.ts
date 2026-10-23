import express, { type Express } from "express";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Server } from "node:http";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { getPublishedDocuments } from "../cms/db";
import { cmsRouteInfo, composeCmsHtml } from "../cms-html";
export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      ...viteConfig.server,
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    },
    appType: "custom",
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    if (req.method !== "GET") {
      res.status(405).end();
      return;
    }
    if (req.originalUrl.startsWith("/api/")) {
      res.status(404).json({ error: "Endpoint não encontrado." });
      return;
    }
    try {
      const documents = await getPublishedDocuments();
      const template = await fs.promises.readFile(
        path.resolve(process.cwd(), "client/index.html"),
        "utf8"
      );
      const transformed = await vite.transformIndexHtml(
        req.originalUrl,
        template
      );
      const entry = await vite.ssrLoadModule("/src/entry-ssg.tsx");
      const info = cmsRouteInfo(req.originalUrl, documents);
      const html = composeCmsHtml(
        transformed,
        entry.render(req.originalUrl, documents),
        documents,
        info
      );
      res
        .status(info.status)
        .set({ "Content-Type": "text/html", "Cache-Control": "no-store" })
        .end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });
}
export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  app.use(express.static(distPath, { index: false }));
  let entry:
    | Promise<{ render: (path: string, documents: unknown[]) => string }>
    | undefined;
  app.use("*", async (req, res, next) => {
    if (req.method !== "GET") {
      res.status(405).end();
      return;
    }
    if (
      req.originalUrl.startsWith("/api/") ||
      req.originalUrl.startsWith("/assets/")
    ) {
      res.status(404).end();
      return;
    }
    try {
      const documents = await getPublishedDocuments();
      entry ??= import(
        pathToFileURL(path.resolve(import.meta.dirname, "ssr/entry-ssg.js"))
          .href
      );
      const renderer = await entry;
      const template = await fs.promises.readFile(
        path.join(distPath, "index.html"),
        "utf8"
      );
      const info = cmsRouteInfo(req.originalUrl, documents);
      res
        .status(info.status)
        .set({ "Content-Type": "text/html", "Cache-Control": "no-store" })
        .end(
          composeCmsHtml(
            template,
            renderer.render(req.originalUrl, documents),
            documents,
            info
          )
        );
    } catch (error) {
      next(error);
    }
  });
}
