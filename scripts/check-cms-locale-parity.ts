import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function leaves(obj: unknown, prefix = "", out: { path: string; value: string }[] = []) {
  if (typeof obj === "string") out.push({ path: prefix, value: obj });
  else if (Array.isArray(obj))
    obj.forEach((v, i) => leaves(v, `${prefix}[${i}]`, out));
  else if (obj && typeof obj === "object")
    for (const k of Object.keys(obj))
      leaves((obj as Record<string, unknown>)[k], prefix ? `${prefix}.${k}` : k, out);
  return out;
}

function skip(s: string) {
  const t = s.trim();
  if (!t) return true;
  if (/^https?:\/\//i.test(t)) return true;
  if (/^\/[^\s]*$/.test(t) && !t.includes(" ")) return true;
  if (/\.(webp|png|jpg|jpeg|gif|svg)$/i.test(t)) return true;
  if (t === "onsmart" || t === ".AI" || t === "Blog" || t === "SON.IA") return true;
  if (t.includes("@") || t.startsWith("mailto:")) return true;
  if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(t) && !t.includes(" ")) return true;
  return false;
}

function looksPortuguese(s: string) {
  return /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(s) ||
    /\b(não|para|com|uma|sua|você|empresa|conteúdo|serviços|equipe|também)\b/i.test(s);
}

const pt = JSON.parse(
  fs.readFileSync(path.join(root, "server/cms-seed-data.json"), "utf8")
) as { key: string; payload: unknown }[];
const loc = JSON.parse(
  fs.readFileSync(path.join(root, "server/cms-seed-locales.json"), "utf8")
) as { key: string; locale: string; payload: unknown }[];

const issues: string[] = [];
const uniquePt = new Set<string>();
for (const p of pt) {
  for (const locale of ["en", "es"] as const) {
    const tr = loc.find(x => x.key === p.key && x.locale === locale);
    if (!tr) continue;
    const lp = leaves(p.payload);
    const lt = leaves(tr.payload);
    for (let i = 0; i < lp.length; i++) {
      const a = lp[i];
      const b = lt[i];
      if (!b || a.path !== b.path) continue;
      if (skip(a.value)) continue;
      if (a.path.endsWith(".original")) continue;
      if (a.path.endsWith(".slug") || a.path.endsWith("FeaturedSlug")) continue;
      if (a.value === b.value && looksPortuguese(a.value)) {
        uniquePt.add(a.value);
        issues.push(`${locale} ${p.key} ${a.path}: ${a.value.slice(0, 100)}`);
      }
    }
  }
}

console.log(`Portuguese leftovers in en/es payloads: ${issues.length}`);
for (const line of issues.slice(0, 40)) console.log(line);

if (process.argv.includes("--export")) {
  const out = path.join(root, "server/cms-extra-translations.json");
  let existing: { en?: Record<string, string>; es?: Record<string, string> } = {};
  try {
    existing = JSON.parse(fs.readFileSync(out, "utf8")) as {
      en?: Record<string, string>;
      es?: Record<string, string>;
    };
  } catch {
    /* new file */
  }
  const en = { ...(existing.en ?? {}) };
  const es = { ...(existing.es ?? {}) };
  for (const s of uniquePt) {
    if (!en[s]) en[s] = "";
    if (!es[s]) es[s] = "";
  }
  fs.writeFileSync(out, JSON.stringify({ en, es }, null, 2));
  console.log(
    `Exported ${uniquePt.size} keys to server/cms-extra-translations.json (fill empty values)`
  );
}
