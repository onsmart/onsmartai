import { describe, it, expect } from "vitest";
import {
  parseBlogPreviews,
  normalizeBlogSearch,
  type BlogPreview,
  blogPreviewLabel,
} from "../shared/blog";
import { mergeBlogEntries, formatBlogDate } from "../client/src/lib/blog-model";
import { cmsEmptyPayload, type PublishedDocument } from "../shared/cms";
const preview: BlogPreview = {
  slug: "artigo-de-teste",
  title: "Governança de IA",
  summary: "Resumo de teste",
  author: "Redação Onsmart.AI",
  topic: "Governança",
  imageUrl: "/assets/test.webp",
  imageAlt: "Imagem de teste",
};
function published(locale: "pt-BR" | "en" = "pt-BR"): PublishedDocument {
  return {
    id: 1,
    key: "article:artigo-de-teste",
    kind: "article",
    locale,
    slug: preview.slug,
    payload: {
      ...cmsEmptyPayload(),
      title: "Título aprovado de teste",
      author: "Autor de teste",
      publishedAt: "2026-01-01",
      fields: { topic: "Governança" },
    },
  };
}
describe("blog public previews", () => {
  it("ignores private or unapproved fields in a preview DTO", () => {
    const [p] = parseBlogPreviews([
      {
        ...preview,
        blocks: [{ text: "corpo privado" }],
        publishedAt: "2020-01-01",
        draft: { secret: true },
      },
    ]);
    expect(Object.keys(p).sort()).toEqual(Object.keys(preview).sort());
    expect(p).not.toHaveProperty("blocks");
    expect(parseBlogPreviews([{ slug: "incompleto" }])).toEqual([]);
  });
  it("does not expose blocks or a false date for review entries", () => {
    const [entry] = mergeBlogEntries([preview], []);
    expect(entry.status).toBe("review");
    expect(entry).not.toHaveProperty("document");
    expect(entry).not.toHaveProperty("publishedAt");
    expect(entry).not.toHaveProperty("blocks");
  });
  it("keeps approved previews private and does not mark them published", () => {
    const [approved] = parseBlogPreviews([
      {
        ...preview,
        editorialStatus: "approved",
        blocks: [{ text: "privado" }],
        editorialApproval: { actor: "privado" },
        publishedAt: "data indevida",
      },
    ]);
    expect(approved.editorialStatus).toBe("approved");
    expect(approved).not.toHaveProperty("editorialApproval");
    const [entry] = mergeBlogEntries([approved], []);
    expect(entry.status).toBe("approved");
    expect(entry).not.toHaveProperty("document");
    expect(entry).not.toHaveProperty("publishedAt");
    expect(entry).not.toHaveProperty("blocks");
    expect(blogPreviewLabel("approved")).toBe("Aprovado — publicação pendente");
    expect(blogPreviewLabel("review")).toBe("Em revisão");
  });
  it("lets a real published snapshot supersede an approved preview only once", () => {
    const entries = mergeBlogEntries(
      [{ ...preview, editorialStatus: "approved" }],
      [published()]
    );
    expect(entries).toHaveLength(1);
    expect(entries[0].status).toBe("published");
    expect(
      parseBlogPreviews([{ ...preview, editorialStatus: "published" }])
    ).toEqual([]);
  });
  it("replaces a same-slug preview with a published snapshot only once", () => {
    const entries = mergeBlogEntries(
      [preview, preview],
      [published(), published()]
    );
    expect(entries).toHaveLength(1);
    expect(entries[0].status).toBe("published");
    expect(entries[0].title).toBe("Título aprovado de teste");
  });
  it("does not accept other-locale snapshots as Portuguese blog publications", () => {
    const [entry] = mergeBlogEntries([preview], [published("en")], "pt-BR");
    expect(entry.status).toBe("review");
  });
  it("accepts locale-matched published snapshots", () => {
    const [entry] = mergeBlogEntries([preview], [published("en")], "en");
    expect(entry.status).toBe("published");
  });
  it("does not resurrect removed previews without a published document", () => {
    expect(mergeBlogEntries([], [])).toEqual([]);
  });
  it("normalizes accent-insensitive searches and only formats valid actual dates", () => {
    expect(normalizeBlogSearch("Governança ADOÇÃO")).toBe("governanca adocao");
    expect(formatBlogDate("")).toBe("");
    expect(formatBlogDate("inválida")).toBe("");
  });
});
