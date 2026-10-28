import type { VercelRequest, VercelResponse } from "@vercel/node";
import ptSeed from "../server/cms-seed-data.json";
import localeSeed from "../server/cms-seed-locales.json";
import type { PublishedDocument } from "../shared/cms";

type SeedRow = {
  key: string;
  kind: PublishedDocument["kind"];
  locale: PublishedDocument["locale"];
  slug: string;
  payload: PublishedDocument["payload"];
};

function seedToPublished(rows: SeedRow[], idOffset: number): PublishedDocument[] {
  return rows.map((row, index) => ({
    id: idOffset + index + 1,
    key: row.key,
    kind: row.kind,
    locale: row.locale,
    slug: row.slug,
    payload: row.payload,
  }));
}

const publishedDocuments: PublishedDocument[] = [
  ...seedToPublished(ptSeed as SeedRow[], 0),
  ...seedToPublished(localeSeed as SeedRow[], (ptSeed as SeedRow[]).length),
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  res
    .status(200)
    .setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300")
    .json({ data: { documents: publishedDocuments } });
}
