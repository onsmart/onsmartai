/**
 * Static CMS public.json for Vite build / dev middleware.
 * No @shared imports — safe to load from vite.config.ts before aliases exist.
 */
import ptCmsSeed from "../cms-seed-data.json";
import localeCmsSeed from "../cms-seed-locales.json";

type CmsSeedRow = {
  key: string;
  kind: string;
  locale: string;
  slug: string;
  payload: unknown;
};

function mapSeedRows(rows: CmsSeedRow[], idOffset: number) {
  return rows.map((row, index) => ({
    id: idOffset + index + 1,
    key: row.key,
    kind: row.kind,
    locale: row.locale,
    slug: row.slug,
    payload: row.payload,
  }));
}

export function buildCmsPublicJson(): string {
  const pt = ptCmsSeed as CmsSeedRow[];
  const locales = localeCmsSeed as CmsSeedRow[];
  const documents = [...mapSeedRows(pt, 0), ...mapSeedRows(locales, pt.length)];
  return JSON.stringify({ data: { documents } });
}
