/**
 * Generates en/es CMS seed records from pt-BR seed + translation maps.
 * Run: pnpm tsx scripts/generate-cms-locale-seed.ts
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CmsPayload } from "../shared/cms";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

type SeedRecord = {
  key: string;
  kind: string;
  locale: string;
  slug: string;
  status?: string;
  payload: CmsPayload;
};

type LandingData = Record<string, unknown>;

const CATEGORY_EN: Record<string, string> = {
  Blog: "Blog",
  Notícias: "News",
  "Onsmart na mídia": "Onsmart in the media",
  Cases: "Case studies",
  Vídeos: "Videos",
  "E-books": "E-books",
  Playbooks: "Playbooks",
  "Materiais gratuitos": "Free resources",
};

const CATEGORY_ES: Record<string, string> = {
  Blog: "Blog",
  Notícias: "Noticias",
  "Onsmart na mídia": "Onsmart en los medios",
  Cases: "Casos",
  Vídeos: "Videos",
  "E-books": "E-books",
  Playbooks: "Playbooks",
  "Materiais gratuitos": "Materiales gratuitos",
};

const INTEREST_EN: Record<string, string> = {
  Treinamentos: "Training",
  Consultoria: "Consulting",
  "Desenvolvimento de IA": "AI development",
  "SON.IA": "SON.IA",
  Parcerias: "Partnerships",
};

const INTEREST_ES: Record<string, string> = {
  Treinamentos: "Capacitación",
  Consultoria: "Consultoría",
  "Desenvolvimento de IA": "Desarrollo de IA",
  "SON.IA": "SON.IA",
  Parcerias: "Alianzas",
};

const AUTHOR_EN = "Onsmart.AI Editorial";
const AUTHOR_ES = "Redacción Onsmart.AI";

function walkPair(pt: unknown, tr: unknown, map: Record<string, string>) {
  if (typeof pt === "string" && typeof tr === "string") {
    if (pt.trim() && pt !== tr) map[pt] = tr;
    return;
  }
  if (Array.isArray(pt) && Array.isArray(tr)) {
    for (let i = 0; i < pt.length; i++) walkPair(pt[i], tr[i], map);
    return;
  }
  if (pt && tr && typeof pt === "object" && typeof tr === "object") {
    for (const k of Object.keys(pt as object)) {
      if (k in (tr as object))
        walkPair(
          (pt as Record<string, unknown>)[k],
          (tr as Record<string, unknown>)[k],
          map
        );
    }
  }
}

async function loadLandingMaps() {
  const mapEn: Record<string, string> = {};
  const mapEs: Record<string, string> = {};
  const landDir = path.join(root, "client/src/data/landing");
  const files = (await fs.readdir(landDir)).filter(f => f.endsWith(".json"));
  for (const f of files) {
    const pt = JSON.parse(
      await fs.readFile(path.join(landDir, f), "utf8")
    ) as LandingData;
    const en = JSON.parse(
      await fs.readFile(path.join(landDir, "en", f), "utf8")
    ) as LandingData;
    const es = JSON.parse(
      await fs.readFile(path.join(landDir, "es", f), "utf8")
    ) as LandingData;
    walkPair(pt, en, mapEn);
    walkPair(pt, es, mapEs);
  }
  return { mapEn, mapEs };
}

async function loadArticleOverrides() {
  const file = path.join(root, "server/cms-article-locales.json");
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as Record<
      string,
      { en?: CmsPayload; es?: CmsPayload }
    >;
  } catch {
    return {};
  }
}

function shouldSkipTranslation(s: string): boolean {
  const t = s.trim();
  if (!t || t.length < 2) return true;
  if (/^https?:\/\//i.test(t)) return true;
  if (/^\/[^\s]*$/.test(t) && !t.includes(" ")) return true;
  if (/\.(webp|png|jpg|jpeg|gif|svg)$/i.test(t)) return true;
  if (t === "onsmart" || t === ".AI" || t === "Blog") return true;
  if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(t) && t.length < 48 && !t.includes(" "))
    return true;
  if (/^[\d\s.,:;%+\-()]+$/.test(t)) return true;
  return false;
}

function translateValue(
  value: unknown,
  locale: "en" | "es",
  map: Record<string, string>,
  pathKey: string
): unknown {
  if (typeof value === "string") {
    if (pathKey.endsWith(".original")) return value;
    if (shouldSkipTranslation(value)) return value;
    if (pathKey.endsWith(".interest") && locale === "en")
      return INTEREST_EN[value] ?? map[value] ?? value;
    if (pathKey.endsWith(".interest") && locale === "es")
      return INTEREST_ES[value] ?? map[value] ?? value;
    if (pathKey === "category" && locale === "en")
      return CATEGORY_EN[value] ?? map[value] ?? value;
    if (pathKey === "category" && locale === "es")
      return CATEGORY_ES[value] ?? map[value] ?? value;
    if (pathKey === "author" && value === "Redação Onsmart.AI")
      return locale === "en" ? AUTHOR_EN : AUTHOR_ES;
    const hit = map[value];
    if (hit) return hit;
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item, i) =>
      translateValue(item, locale, map, `${pathKey}[${i}]`)
    );
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === "texts" && Array.isArray(v)) {
        out[k] = v.map((entry: { original?: string; text?: string }) => {
          if (!entry || typeof entry !== "object") return entry;
          const original = entry.original ?? "";
          const text = entry.text ?? original;
          const translated = shouldSkipTranslation(text)
            ? text
            : map[text] ?? map[original] ?? text;
          return { original, text: translated };
        });
        continue;
      }
      out[k] = translateValue(v, locale, map, pathKey ? `${pathKey}.${k}` : k);
    }
    return out;
  }
  return value;
}

function landingSlugFromRecord(record: SeedRecord): string | null {
  if (record.kind !== "landing") return null;
  const fields = record.payload.fields as { slug?: string };
  return fields.slug ?? record.slug;
}

async function loadLandingPayloadFields(
  slug: string,
  locale: "en" | "es"
): Promise<Record<string, unknown> | null> {
  const file =
    slug === "parcerias"
      ? "parcerias.json"
      : `${slug}.json`;
  const p = path.join(root, "client/src/data/landing", locale, file);
  try {
    const data = JSON.parse(await fs.readFile(p, "utf8")) as LandingData;
    const { slug: _s, metaTitle, metaDescription, ...fields } = data;
    return fields as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function loadLandingMeta(
  slug: string,
  locale: "en" | "es"
): Promise<{ metaTitle: string; metaDescription: string } | null> {
  const file =
    slug === "parcerias" ? "parcerias.json" : `${slug}.json`;
  const p = path.join(root, "client/src/data/landing", locale, file);
  try {
    const data = JSON.parse(await fs.readFile(p, "utf8")) as LandingData;
    return {
      metaTitle: String(data.metaTitle ?? ""),
      metaDescription: String(data.metaDescription ?? ""),
    };
  } catch {
    return null;
  }
}

function mergePageMeta(
  record: SeedRecord,
  locale: "en" | "es",
  map: Record<string, string>
) {
  const metaPath = record.key.startsWith("article:")
    ? null
    : record.key === "global"
      ? null
      : record.key;
  if (!metaPath) return;
  // site-metadata is TS; duplicate minimal SEO map inline from known page keys
  const seoEn: Record<string, { title: string; description: string }> = {
    "/": {
      title: "Onsmart.AI | Corporate AI without the mystery",
      description:
        "Education, consulting, and the SON.IA Ecosystem so your company can adopt AI simply, reliably, and with governance.",
    },
    "/quem-somos": {
      title: "About us | Onsmart.AI and Grupo Onsmart",
      description:
        "Discover the mission, leadership, and ecosystem of Onsmart.AI.",
    },
    "/servicos": {
      title: "Education, consulting, and AI solutions | Onsmart.AI",
      description:
        "From strategy to operations: education, consulting, custom AI development, and the SON.IA platform.",
    },
    "/ecossistema": {
      title: "Ecosystem | Grupo Onsmart",
      description:
        "Meet Grupo Onsmart companies and their connection to Onsmart.AI.",
    },
    "/conteudo": {
      title: "Onsmart.AI Blog | Corporate AI content",
      description:
        "Articles on adoption, governance, and AI agents for businesses.",
    },
    "/contato": {
      title: "Contact Onsmart.AI | Artificial intelligence",
      description:
        "Talk to Onsmart.AI about education, consulting, and the next step for AI in your company.",
    },
  };
  const seoEs: Record<string, { title: string; description: string }> = {
    "/": {
      title: "Onsmart.AI | IA corporativa sin misterio",
      description:
        "Educación, consultoría y el Ecosistema SON.IA para que su empresa adopte IA de forma simple, confiable y gobernable.",
    },
    "/quem-somos": {
      title: "Quiénes somos | Onsmart.AI y Grupo Onsmart",
      description:
        "Conozca la misión, el liderazgo y el ecosistema de Onsmart.AI.",
    },
    "/servicos": {
      title: "Educación, consultoría y soluciones de IA | Onsmart.AI",
      description:
        "De la estrategia a la operación: educación, consultoría, desarrollo de IA y plataforma SON.IA.",
    },
    "/ecossistema": {
      title: "Ecosistema | Grupo Onsmart",
      description:
        "Conozca las empresas del Grupo Onsmart y su conexión con Onsmart.AI.",
    },
    "/conteudo": {
      title: "Blog Onsmart.AI | Contenido sobre IA corporativa",
      description:
        "Artículos sobre adopción, gobernanza y agentes de IA para empresas.",
    },
    "/contato": {
      title: "Contacte a Onsmart.AI | Inteligencia artificial",
      description:
        "Hable con Onsmart.AI sobre educación, consultoría y el siguiente paso de la IA en su empresa.",
    },
  };
  const seo = locale === "en" ? seoEn[metaPath] : seoEs[metaPath];
  if (!seo) return;
  map[record.payload.title] = seo.title;
  if (record.payload.seoTitle) map[record.payload.seoTitle] = seo.title;
  if (record.payload.seoDescription)
    map[record.payload.seoDescription] = seo.description;
  if (record.payload.summary) map[record.payload.summary] = seo.description;
}

async function buildLocaleRecord(
  pt: SeedRecord,
  locale: "en" | "es",
  map: Record<string, string>,
  articleOverrides: Record<string, { en?: CmsPayload; es?: CmsPayload }>
): Promise<SeedRecord> {
  mergePageMeta(pt, locale, map);

  const slug = pt.slug;
  let payload = JSON.parse(JSON.stringify(pt.payload)) as CmsPayload;

  if (pt.kind === "landing") {
    const landSlug = landingSlugFromRecord(pt);
    if (landSlug) {
      const fields = await loadLandingPayloadFields(landSlug, locale);
      const meta = await loadLandingMeta(landSlug, locale);
      if (fields) {
        payload.fields = fields;
        if (meta) {
          payload.title = meta.metaTitle.replace(/\s*\|\s*Onsmart\.AI.*$/i, "").trim() || payload.title;
          payload.seoTitle = meta.metaTitle;
          payload.seoDescription = meta.metaDescription;
          payload.summary = meta.metaDescription;
          map[payload.title] = payload.title;
        }
        const heroTitle = String(fields.heroTitle ?? "");
        if (heroTitle) {
          payload.title = heroTitle;
          map[pt.payload.title] = heroTitle;
        }
        const lead = String(fields.lead ?? "");
        if (lead) payload.summary = lead;
      }
    }
  }

  if (pt.kind === "article") {
    const override = articleOverrides[slug]?.[locale];
    if (override) {
      payload = { ...payload, ...override };
    }
  }

  payload = translateValue(payload, locale, map, "") as CmsPayload;

  return {
    key: pt.key,
    kind: pt.kind,
    locale,
    slug: pt.slug,
    status: pt.status ?? "published",
    payload,
  };
}

async function main() {
  const seedPath = path.join(root, "server/cms-seed-data.json");
  const ptRecords = JSON.parse(await fs.readFile(seedPath, "utf8")) as SeedRecord[];
  const enFb = JSON.parse(
    await fs.readFile(path.join(root, "client/src/i18n/cms-fallback.en.json"), "utf8")
  ) as Record<string, string>;
  const esFb = JSON.parse(
    await fs.readFile(path.join(root, "client/src/i18n/cms-fallback.es.json"), "utf8")
  );
  const extraPath = path.join(root, "server/cms-extra-translations.json");
  let extra: { en?: Record<string, string>; es?: Record<string, string> } = {};
  try {
    extra = JSON.parse(await fs.readFile(extraPath, "utf8"));
  } catch {
    /* optional */
  }
  const articlePath = path.join(root, "server/cms-article-translations.json");
  let articleMaps: { en?: Record<string, string>; es?: Record<string, string> } =
    {};
  try {
    articleMaps = JSON.parse(await fs.readFile(articlePath, "utf8"));
  } catch {
    /* optional */
  }

  const { mapEn: landEn, mapEs: landEs } = await loadLandingMaps();
  const mapEn = {
    ...enFb,
    ...landEn,
    ...(articleMaps.en ?? {}),
    ...(extra.en ?? {}),
  };
  const mapEs = {
    ...esFb,
    ...landEs,
    ...(articleMaps.es ?? {}),
    ...(extra.es ?? {}),
  };
  const articleOverrides = await loadArticleOverrides();

  const localeRecords: SeedRecord[] = [];
  for (const pt of ptRecords) {
    if (pt.locale !== "pt-BR") continue;
    localeRecords.push(await buildLocaleRecord(pt, "en", mapEn, articleOverrides));
    localeRecords.push(await buildLocaleRecord(pt, "es", mapEs, articleOverrides));
  }

  const outPath = path.join(root, "server/cms-seed-locales.json");
  await fs.writeFile(outPath, JSON.stringify(localeRecords, null, 2), "utf8");

  console.log(
    `Wrote ${localeRecords.length} locale records to server/cms-seed-locales.json`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
