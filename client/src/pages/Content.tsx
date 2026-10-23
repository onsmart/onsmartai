import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Youtube,
} from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import {
  parseBlogPreviews,
  normalizeBlogSearch,
  blogPreviewLabel,
} from "@shared/blog";
import { CMS_CATEGORIES, safeCmsUrl } from "@shared/cms";
import { ButtonLink, PageHero } from "@/components/site/Common";
import { Newsletter } from "@/components/site/Forms";
import { useCms, useCmsDocument } from "@/components/cms/CmsProvider";
import {
  formatBlogDate,
  mergeBlogEntries,
  type BlogEntry,
} from "@/lib/blog-model";
import "./inner.css";
import "./cms-public.css";
import "./blog.css";

const DEFAULT_HERO_TITLE = "IA corporativa: conhecimento que vira operação.";
const DEFAULT_HERO_SUMMARY =
  "Artigos para compreender, adotar e governar inteligência artificial nas empresas. Aprendizado prático para gestores e equipes.";
const YOUTUBE_URL = "https://www.youtube.com/@onsmartai";
const ALL_FORMATS = ["Todas", ...CMS_CATEGORIES] as const;
const LEGACY_FORMAT_ALIASES: Record<string, string> = {
  Mídia: "Onsmart na mídia",
  Materiais: "Materiais gratuitos",
};
const GRID_PAGE_SIZE = 5;

type FormatFilter = (typeof ALL_FORMATS)[number];

function formatFromSearch(search: string): FormatFilter {
  const value = new URLSearchParams(search).get("categoria") || "";
  const canonical = LEGACY_FORMAT_ALIASES[value] || value;
  return (ALL_FORMATS as readonly string[]).includes(canonical)
    ? (canonical as FormatFilter)
    : "Todas";
}

function EntryDate({ entry }: { entry: BlogEntry }) {
  if (entry.status !== "published") return null;
  const date = formatBlogDate(entry.publishedAt);
  return date ? <time dateTime={entry.publishedAt}>{date}</time> : null;
}

function EntryMeta({
  entry,
  featured = false,
}: {
  entry: BlogEntry;
  featured?: boolean;
}) {
  const date =
    entry.status === "published" ? formatBlogDate(entry.publishedAt) : "";
  const parts = [entry.author, date].filter(Boolean);
  return (
    <div className={`blog-entry-meta ${featured ? "is-featured" : ""}`}>
      {parts.length > 0 && <span>{parts.join(" · ")}</span>}
      {entry.status !== "published" && (
        <span className="blog-review-label">
          {blogPreviewLabel(entry.status)}
        </span>
      )}
    </div>
  );
}

function CoverMedia({
  entry,
  featured = false,
}: {
  entry: BlogEntry;
  featured?: boolean;
}) {
  const imageUrl = safeCmsUrl(entry.imageUrl);
  return imageUrl ? (
    <img
      src={imageUrl}
      alt={entry.imageAlt || entry.title}
      loading={featured ? "eager" : "lazy"}
    />
  ) : (
    <span className="blog-cover-fallback">{entry.topic || entry.category}</span>
  );
}

function BlogCard({ entry }: { entry: BlogEntry }) {
  const cover = (
    <div className="blog-card-cover">
      <CoverMedia entry={entry} />
      <span className="blog-cover-mark" aria-hidden="true">
        {entry.status === "published" ? <ArrowUpRight size={20} /> : <span />}
      </span>
    </div>
  );
  return (
    <article
      className={`blog-card ${entry.status !== "published" ? "is-review" : ""}`}
    >
      {entry.status === "published" ? (
        <Link
          href={`/conteudo/${entry.slug}`}
          className="blog-card-cover-link"
          aria-label={`Ler ${entry.title}`}
        >
          {cover}
        </Link>
      ) : (
        <div
          className="blog-card-cover-link is-disabled"
          aria-label={
            entry.status === "approved"
              ? "Publicação pendente"
              : "Aprovação pendente"
          }
        >
          {cover}
        </div>
      )}
      <div className="blog-card-body">
        <p className="blog-card-topic">{entry.topic || entry.category}</p>
        <h3>
          {entry.status === "published" ? (
            <Link href={`/conteudo/${entry.slug}`}>{entry.title}</Link>
          ) : (
            entry.title
          )}
        </h3>
        <p className="blog-card-summary">{entry.summary}</p>
        <EntryMeta entry={entry} />
        {entry.status !== "published" ? (
          <span className="blog-pending-note">
            {entry.status === "approved"
              ? "O texto completo permanece privado."
              : "Aprovação pendente"}
          </span>
        ) : (
          <Link className="blog-read-link" href={`/conteudo/${entry.slug}`}>
            Ler texto <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

function FeaturedEntry({ entry }: { entry: BlogEntry }) {
  const cover = (
    <div className="blog-featured-cover">
      <CoverMedia entry={entry} featured />
      <span className="blog-featured-cover-caption">
        {entry.status === "published"
          ? "Leitura editorial"
          : "Prévia editorial"}
      </span>
    </div>
  );
  return (
    <article
      className={`blog-featured ${entry.status !== "published" ? "is-review" : ""}`}
    >
      {entry.status === "published" ? (
        <Link
          className="blog-featured-cover-link"
          href={`/conteudo/${entry.slug}`}
          aria-label={`Ler ${entry.title}`}
        >
          {cover}
        </Link>
      ) : (
        <div
          className="blog-featured-cover-link is-disabled"
          aria-label={
            entry.status === "approved"
              ? "Publicação pendente"
              : "Aprovação pendente"
          }
        >
          {cover}
        </div>
      )}
      <div className="blog-featured-copy">
        <p className="blog-card-topic">{entry.topic || entry.category}</p>
        <h2>{entry.title}</h2>
        <p className="blog-featured-summary">{entry.summary}</p>
        <EntryMeta entry={entry} featured />
        {entry.status === "published" ? (
          <Link className="blog-read-link" href={`/conteudo/${entry.slug}`}>
            Ler texto <ArrowRight size={17} aria-hidden="true" />
          </Link>
        ) : (
          <p className="blog-pending-note">
            {entry.status === "approved"
              ? "O texto completo permanece privado até a autorização de publicação."
              : "Aprovação pendente. O texto ainda não está disponível."}
          </p>
        )}
      </div>
    </article>
  );
}

function EmptyState({
  ready,
  error,
  hasFilters,
  onReset,
}: {
  ready: boolean;
  error: string;
  hasFilters: boolean;
  onReset: () => void;
}) {
  if (!ready) {
    return (
      <div className="blog-empty-state" role="status" aria-live="polite">
        <span className="blog-empty-icon" aria-hidden="true">
          <Search size={22} />
        </span>
        <h3>Carregando o conteúdo editorial…</h3>
        <p>Consultando os snapshots públicos disponíveis no CMS.</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="blog-empty-state is-error" role="alert">
        <h3>Não foi possível atualizar o conteúdo.</h3>
        <p>{error}</p>
        <button type="button" className="blog-reset-button" onClick={onReset}>
          Limpar filtros
        </button>
      </div>
    );
  }
  return (
    <div className="blog-empty-state" role="status" aria-live="polite">
      <span className="blog-empty-icon" aria-hidden="true">
        <Search size={22} />
      </span>
      <h3>
        {hasFilters
          ? "Nenhum conteúdo corresponde a esta seleção."
          : "Ainda não há conteúdo editorial disponível."}
      </h3>
      <p>
        {hasFilters
          ? "Tente outro assunto, formato ou termo de busca."
          : "As prévias dependem de aprovação editorial e os textos publicados aparecem somente após um snapshot real do CMS."}
      </p>
      {hasFilters && (
        <button type="button" className="blog-reset-button" onClick={onReset}>
          Limpar filtros
        </button>
      )}
    </div>
  );
}

export default function Content() {
  const { documents, ready, error } = useCms();
  const pageDocument = useCmsDocument("/conteudo");
  const search = useSearch();
  const [, navigate] = useLocation();
  const [topic, setTopic] = useState("Todos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const selectedFormat = formatFromSearch(search);

  const previews = useMemo(
    () => parseBlogPreviews(pageDocument?.payload.fields.blogPreviews),
    [pageDocument]
  );
  const entries = useMemo(
    () => mergeBlogEntries(previews, documents),
    [documents, previews]
  );
  const topics = useMemo(
    () =>
      Array.from(
        new Set(entries.map(entry => entry.topic.trim()).filter(Boolean))
      ),
    [entries]
  );
  const filteredEntries = useMemo(() => {
    const normalizedQuery = normalizeBlogSearch(query.trim());
    return entries.filter(entry => {
      const matchesFormat =
        selectedFormat === "Todas" || entry.category === selectedFormat;
      const matchesTopic = topic === "Todos" || entry.topic === topic;
      const haystack = normalizeBlogSearch(
        [
          entry.title,
          entry.summary,
          entry.author,
          entry.topic,
          entry.category,
        ].join(" ")
      );
      return (
        matchesFormat &&
        matchesTopic &&
        (!normalizedQuery || haystack.includes(normalizedQuery))
      );
    });
  }, [entries, query, selectedFormat, topic]);
  const featuredSlug =
    typeof pageDocument?.payload.fields.blogFeaturedSlug === "string"
      ? pageDocument.payload.fields.blogFeaturedSlug
      : "";
  const featured =
    filteredEntries.find(entry => entry.slug === featuredSlug) ||
    filteredEntries[0];
  const gridEntries = featured
    ? filteredEntries.filter(entry => entry.slug !== featured.slug)
    : [];
  const pageCount = Math.ceil(gridEntries.length / GRID_PAGE_SIZE);
  const visibleGridEntries = gridEntries.slice(
    page * GRID_PAGE_SIZE,
    page * GRID_PAGE_SIZE + GRID_PAGE_SIZE
  );
  const publishedCount = filteredEntries.filter(
    entry => entry.status === "published"
  ).length;
  const reviewCount = filteredEntries.filter(
    entry => entry.status === "review"
  ).length;
  const approvedCount = filteredEntries.filter(
    entry => entry.status === "approved"
  ).length;
  const hasFilters =
    Boolean(query.trim()) || topic !== "Todos" || selectedFormat !== "Todas";

  useEffect(() => {
    setTopic("Todos");
    setQuery("");
    setPage(0);
  }, [search]);

  useEffect(() => {
    setPage(current => Math.min(current, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  function updateFormat(value: FormatFilter) {
    const params = new URLSearchParams(search);
    if (value === "Todas") params.delete("categoria");
    else params.set("categoria", value);
    const queryString = params.toString();
    navigate(queryString ? `/conteudo?${queryString}` : "/conteudo");
  }

  function resetFilters() {
    setTopic("Todos");
    setQuery("");
    setPage(0);
    navigate("/conteudo");
  }

  return (
    <div className="inner-page content-page blog-page">
      <PageHero
        eyebrow="Conteúdo · Blog Onsmart.AI"
        title={pageDocument?.payload.title || DEFAULT_HERO_TITLE}
        text={pageDocument?.payload.summary || DEFAULT_HERO_SUMMARY}
      >
        <div className="content-hero-actions blog-hero-actions">
          <a className="button button-primary" href="#blog-catalog">
            Explorar conteúdos <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <ButtonLink href={YOUTUBE_URL} variant="text">
            Visitar YouTube oficial
          </ButtonLink>
        </div>
      </PageHero>

      <section className="blog-catalog-section" id="blog-catalog">
        <div className="container">
          <div className="blog-catalog-heading">
            <div>
              <p className="eyebrow">
                <span />
                Conteúdo em foco
              </p>
              <h2>Conhecimento para decidir o próximo passo.</h2>
              <p className="blog-section-intro">
                Artigos publicados e prévias autorizadas, organizados por
                assunto e formato.
              </p>
            </div>
            <div className="blog-counts" aria-live="polite">
              <span>
                <strong>{publishedCount}</strong> publicados
              </span>
              {reviewCount > 0 && (
                <span>
                  <strong>{reviewCount}</strong> em revisão
                </span>
              )}
              {approvedCount > 0 && (
                <span>
                  <strong>{approvedCount}</strong> aprovados · publicação
                  pendente
                </span>
              )}
            </div>
          </div>

          <div className="blog-controls">
            <label className="blog-search-field" htmlFor="content-search">
              <span>Buscar por título, autor ou assunto</span>
              <span className="blog-search-input-wrap">
                <Search size={18} aria-hidden="true" />
                <input
                  id="content-search"
                  type="search"
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value);
                    setPage(0);
                  }}
                  placeholder="Ex.: governança, agentes, adoção"
                />
              </span>
            </label>
            <label className="blog-format-field" htmlFor="content-format">
              <span>Formato</span>
              <select
                id="content-format"
                value={selectedFormat}
                onChange={event =>
                  updateFormat(event.target.value as FormatFilter)
                }
              >
                {ALL_FORMATS.map(format => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {topics.length > 0 && (
            <div
              className="blog-topic-filter"
              role="group"
              aria-label="Filtrar por assunto"
            >
              <span className="blog-filter-label">Assuntos</span>
              <div className="blog-topic-options">
                <button
                  type="button"
                  className={topic === "Todos" ? "is-active" : ""}
                  aria-pressed={topic === "Todos"}
                  onClick={() => {
                    setTopic("Todos");
                    setPage(0);
                  }}
                >
                  Todos
                </button>
                {topics.map(value => (
                  <button
                    type="button"
                    key={value}
                    className={topic === value ? "is-active" : ""}
                    aria-pressed={topic === value}
                    onClick={() => {
                      setTopic(value);
                      setPage(0);
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && entries.length > 0 && (
            <p className="blog-data-error" role="alert">
              {error}
            </p>
          )}

          {featured ? (
            <>
              <div className="blog-featured-heading">
                <p className="eyebrow">
                  <span />
                  Em destaque
                </p>
                <span>
                  {featured.status === "published"
                    ? "Publicado"
                    : blogPreviewLabel(featured.status)}
                </span>
              </div>
              <FeaturedEntry entry={featured} />
              {visibleGridEntries.length > 0 && (
                <div className="blog-grid" aria-label="Mais conteúdos">
                  {visibleGridEntries.map(entry => (
                    <BlogCard key={entry.slug} entry={entry} />
                  ))}
                </div>
              )}
              {pageCount > 1 && (
                <nav
                  className="blog-pagination"
                  aria-label="Paginação de conteúdos"
                >
                  <button
                    type="button"
                    onClick={() => setPage(current => Math.max(0, current - 1))}
                    disabled={page === 0}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={17} aria-hidden="true" />
                  </button>
                  <span aria-live="polite">
                    Página {page + 1} de {pageCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPage(current => Math.min(pageCount - 1, current + 1))
                    }
                    disabled={page >= pageCount - 1}
                    aria-label="Próxima página"
                  >
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          ) : (
            <EmptyState
              ready={ready}
              error={error}
              hasFilters={hasFilters}
              onReset={resetFilters}
            />
          )}

          <p className="blog-accessibility-status" aria-live="polite">
            {filteredEntries.length}{" "}
            {filteredEntries.length === 1 ? "resultado" : "resultados"} nesta
            seleção.
          </p>
        </div>
      </section>

      <section className="content-youtube-section blog-youtube-section">
        <div className="container content-youtube-panel">
          <div className="content-youtube-mark" aria-hidden="true">
            <Youtube size={28} />
          </div>
          <div>
            <p className="eyebrow">
              <span />
              Canal oficial
            </p>
            <h2>Mais conversas sobre IA corporativa.</h2>
            <p>
              Assista ao canal oficial da Onsmart.AI enquanto novos conteúdos
              são preparados pela equipe.
            </p>
          </div>
          <a
            className="button button-outline"
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir YouTube <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
