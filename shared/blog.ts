import { z } from "zod";
export const BlogPreviewSchema = z
  .object({
    slug: z.string().min(1).max(180),
    title: z.string().min(1).max(220),
    summary: z.string().max(2000),
    author: z.string().max(150),
    topic: z.string().max(80),
    imageUrl: z.string().max(2048),
    imageAlt: z.string().max(300),
    editorialStatus: z.enum(["review", "approved"]).optional(),
  })
  .strip();
export type BlogPreview = z.infer<typeof BlogPreviewSchema>;
export const BLOG_APPROVED_LABEL = "Aprovado — publicação pendente";
export function blogPreviewLabel(status: "review" | "approved") {
  return status === "approved" ? BLOG_APPROVED_LABEL : "Em revisão";
}
export const BLOG_TOPICS = [
  "Adoção de IA",
  "Governança",
  "Agentes de IA",
] as const;
export function parseBlogPreviews(value: unknown): BlogPreview[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    const p = BlogPreviewSchema.safeParse(item);
    return p.success ? [p.data] : [];
  });
}
export function normalizeBlogSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}
