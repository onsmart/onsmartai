import type { PublishedDocument } from "@shared/cms";
import ptCmsSeed from "../cms-seed-data.json";
import localeCmsSeed from "../cms-seed-locales.json";
import { assertPublishable } from "./validation";
import { getPublishedDocuments } from "./db";
import { aiInsiderPublishedDocuments } from "./ai-insider-documents";

type CmsSeedRow = {
  key: string;
  kind: PublishedDocument["kind"];
  locale: PublishedDocument["locale"];
  slug: string;
  payload: PublishedDocument["payload"];
};

function documentKey(doc: Pick<PublishedDocument, "key" | "locale">): string {
  return `${doc.locale}\0${doc.key}`;
}

function mapSeedRows(rows: CmsSeedRow[], idOffset: number): PublishedDocument[] {
  return rows.map((row, index) => ({
    id: idOffset + index + 1,
    key: row.key,
    kind: row.kind,
    locale: row.locale,
    slug: row.slug,
    payload: row.payload,
  }));
}

export function publishedDocumentsFromSeed(): PublishedDocument[] {
  const pt = ptCmsSeed as CmsSeedRow[];
  const locales = localeCmsSeed as CmsSeedRow[];
  const seed = [...mapSeedRows(pt, 0), ...mapSeedRows(locales, pt.length)];
  return [...seed, ...aiInsiderPublishedDocuments(seed.length)];
}

export function filterPublishableDocuments(
  documents: PublishedDocument[]
): PublishedDocument[] {
  return documents.filter(document => {
    try {
      assertPublishable(document.kind, document.payload);
      return true;
    } catch {
      return false;
    }
  });
}

/** Seed fills gaps; database snapshots win on the same locale + route key. */
export function mergePublishedDocuments(
  fromDb: PublishedDocument[],
  fromSeed: PublishedDocument[],
  options?: { landingSeedOverridesDb?: boolean }
): PublishedDocument[] {
  const landingSeedOverridesDb = options?.landingSeedOverridesDb ?? false;
  const merged = new Map<string, PublishedDocument>();
  for (const doc of fromSeed) merged.set(documentKey(doc), doc);
  for (const doc of fromDb) {
    const key = documentKey(doc);
    if (
      landingSeedOverridesDb &&
      doc.kind === "landing" &&
      merged.get(key)?.kind === "landing"
    ) {
      continue;
    }
    merged.set(key, doc);
  }
  return [...merged.values()];
}

/** LinkedIn newsletter snapshots are syndicated from seed when absent in the DB. */
export function mergeAiInsiderSyndication(
  documents: PublishedDocument[]
): PublishedDocument[] {
  const merged = new Map<string, PublishedDocument>();
  for (const doc of documents) merged.set(documentKey(doc), doc);
  const syndicated = filterPublishableDocuments(
    aiInsiderPublishedDocuments(documents.length + 500)
  );
  for (const doc of syndicated) {
    if (!merged.has(documentKey(doc))) merged.set(documentKey(doc), doc);
  }
  return [...merged.values()];
}

export async function resolvePublicCmsDocuments(): Promise<PublishedDocument[]> {
  const seed = filterPublishableDocuments(publishedDocumentsFromSeed());

  if (process.env.NODE_ENV !== "development") {
    const fromDb = filterPublishableDocuments(await getPublishedDocuments());
    return mergeAiInsiderSyndication(fromDb);
  }

  let fromDb: PublishedDocument[] = [];
  try {
    fromDb = filterPublishableDocuments(await getPublishedDocuments());
  } catch (error) {
    console.warn(
      "[CMS] Banco indisponível em development; usando snapshot de seed para páginas públicas.",
      error instanceof Error ? error.message : error
    );
  }

  return mergeAiInsiderSyndication(
    mergePublishedDocuments(fromDb, seed, { landingSeedOverridesDb: true })
  );
}

export { buildCmsPublicJson } from "./cms-public-json";
