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
import { parseBlogPreviews, normalizeBlogSearch } from "@shared/blog";
import { CMS_CATEGORIES, safeCmsUrl } from "@shared/cms";
import { ButtonLink, PageHero } from "@/components/site/Common";
import { Newsletter } from "@/components/site/Forms";
import { useCms, useCmsDocument } from "@/components/cms/CmsProvider";
import {
  formatBlogDate,
  mergeBlogEntries,
  type BlogEntry,
} from "@/lib/blog-model";
import { useLocale } from "@/i18n/LocaleProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import {
  ALL_TOPIC_KEY,
  BLOG_PAGE_COPY,
} from "@/i18n/blog-page";
import {
  blogCategoryLabel,
  blogPreviewStatusLabel,
} from "@/i18n/site-copy";
import "./inner.css";
import "./cms-public.css";
import "./blog.css";

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
  const { locale } = useLocale();
  if (entry.status !== "published") return null;
  const date = formatBlogDate(entry.publishedAt, locale);
  return date ? <time dateTime={entry.publishedAt}>{date}</time> : null;
}

function EntryMeta({
  entry,
  featured = false,
}: {
  entry: BlogEntry;
  featured?: boolean;
}) {
  const { locale } = useLocale();
  const date =
    entry.status === "published"
      ? formatBlogDate(entry.publishedAt, locale)
      : "";
  const parts = [entry.author, date].filter(Boolean);
  return (
    <div className={`blog-entry-meta ${featured ? "is-featured" : ""}`}>
      {parts.length > 0 && <span>{parts.join(" · ")}</span>}
      {entry.status !== "published" && (
        <span className="blog-review-label">
          {blogPreviewStatusLabel(entry.status, locale)}
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
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const page = BLOG_PAGE_COPY[locale];
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
          aria-label={t("a11y.readArticle", { title: entry.title })}
        >
          {cover}
        </Link>
      ) : (
        <div
          className="blog-card-cover-link is-disabled"
          aria-label={
            entry.status === "approved"
              ? page.pubPendingAria
              : page.approvalPendingAria
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
              ? page.pendingApprovedNote
              : page.pendingShort}
          </span>
        ) : (
          <Link className="blog-read-link" href={`/conteudo/${entry.slug}`}>
            {page.readText} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

function FeaturedEntry({ entry }: { entry: BlogEntry }) {
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const page = BLOG_PAGE_COPY[locale];
  const cover = (
    <div className="blog-featured-cover">
      <CoverMedia entry={entry} featured />
      <span className="blog-featured-cover-caption">
        {entry.status === "published"
          ? t("blog.editorialRead")
          : t("blog.editorialPreview")}
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
          aria-label={t("a11y.readArticle", { title: entry.title })}
        >
          {cover}
        </Link>
      ) : (
        <div
          className="blog-featured-cover-link is-disabled"
          aria-label={
            entry.status === "approved"
              ? page.pubPendingAria
              : page.approvalPendingAria
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
            {page.readText} <ArrowRight size={17} aria-hidden="true" />
          </Link>
        ) : (
          <p className="blog-pending-note">
            {entry.status === "approved"
              ? page.pendingApprovedNote
              : page.pendingReviewNote}
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
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const page = BLOG_PAGE_COPY[locale];
  if (!ready) {
    return (
      <div className="blog-empty-state" role="status" aria-live="polite">
        <span className="blog-empty-icon" aria-hidden="true">
          <Search size={22} />
        </span>
        <h3>{t("blog.loading")}</h3>
        <p>{page.cmsLoadingDetail}</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="blog-empty-state is-error" role="alert">
        <h3>{t("blog.loadErrorTitle")}</h3>
        <p>{error}</p>
        <button type="button" className="blog-reset-button" onClick={onReset}>
          {t("blog.clearFilters")}
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
        {hasFilters ? page.noMatchTitle : t("blog.emptyTitle")}
      </h3>
      <p>
        {hasFilters ? page.noMatchBody : t("blog.emptyBodyDefault")}
      </p>
      {hasFilters && (
        <button type="button" className="blog-reset-button" onClick={onReset}>
          {t("blog.clearFilters")}
        </button>
      )}
    </div>
  );
}

export default function Content() {
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const blogCopy = BLOG_PAGE_COPY[locale];
  const { documents, ready, error } = useCms();
  const pageDocument = useCmsDocument("/conteudo");
  const search = useSearch();
  const [, navigate] = useLocation();
  const [topic, setTopic] = useState(ALL_TOPIC_KEY);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const selectedFormat = formatFromSearch(search);

  const previews = useMemo(
    () => parseBlogPreviews(pageDocument?.payload.fields.blogPreviews),
    [pageDocument]
  );
  const entries = useMemo(
    () => mergeBlogEntries(previews, documents, locale),
    [documents, previews, locale]
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
      const matchesTopic = topic === ALL_TOPIC_KEY || entry.topic === topic;
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
    Boolean(query.trim()) ||
    topic !== ALL_TOPIC_KEY ||
    selectedFormat !== "Todas";

  useEffect(() => {
    setTopic(ALL_TOPIC_KEY);
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
    setTopic(ALL_TOPIC_KEY);
    setQuery("");
    setPage(0);
    navigate("/conteudo");
  }

  return (
    <div className="inner-page content-page blog-page">
      <PageHero
        eyebrow={blogCopy.pageEyebrow}
        title={pageDocument?.payload.title || t("blog.heroTitleDefault")}
        text={pageDocument?.payload.summary || t("blog.heroSummaryDefault")}
      >
        <div className="content-hero-actions blog-hero-actions">
          <a className="button button-primary" href="#blog-catalog">
            {blogCopy.exploreContents}{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <ButtonLink href={YOUTUBE_URL} variant="text">
            {blogCopy.visitYoutube}
          </ButtonLink>
        </div>
      </PageHero>

      <section className="blog-catalog-section" id="blog-catalog">
        <div className="container">
          <div className="blog-catalog-heading">
            <div>
              <p className="eyebrow">
                <span />
                {blogCopy.focusEyebrow}
              </p>
              <h2>{blogCopy.focusTitle}</h2>
              <p className="blog-section-intro">{blogCopy.focusIntro}</p>
            </div>
            <div className="blog-counts" aria-live="polite">
              <span>
                <strong>{publishedCount}</strong> {blogCopy.publishedCount}
              </span>
              {reviewCount > 0 && (
                <span>
                  <strong>{reviewCount}</strong> {blogCopy.inReview}
                </span>
              )}
              {approvedCount > 0 && (
                <span>
                  <strong>{approvedCount}</strong> {blogCopy.approvedPending}
                </span>
              )}
            </div>
          </div>

          <div className="blog-controls">
            <label className="blog-search-field" htmlFor="content-search">
              <span>{blogCopy.searchLabel}</span>
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
                  placeholder={blogCopy.searchPlaceholder}
                />
              </span>
            </label>
            <label className="blog-format-field" htmlFor="content-format">
              <span>{blogCopy.formatLabel}</span>
              <select
                id="content-format"
                value={selectedFormat}
                onChange={event =>
                  updateFormat(event.target.value as FormatFilter)
                }
              >
                {ALL_FORMATS.map(format => (
                  <option key={format} value={format}>
                    {blogCategoryLabel(format, locale)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {topics.length > 0 && (
            <div
              className="blog-topic-filter"
              role="group"
              aria-label={blogCopy.filterTopicsAria}
            >
              <span className="blog-filter-label">{blogCopy.topicsLabel}</span>
              <div className="blog-topic-options">
                <button
                  type="button"
                  className={topic === ALL_TOPIC_KEY ? "is-active" : ""}
                  aria-pressed={topic === ALL_TOPIC_KEY}
                  onClick={() => {
                    setTopic(ALL_TOPIC_KEY);
                    setPage(0);
                  }}
                >
                  {blogCopy.allTopics}
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
                  {blogCopy.featured}
                </p>
                <span>
                  {featured.status === "published"
                    ? blogCopy.published
                    : blogPreviewStatusLabel(featured.status, locale)}
                </span>
              </div>
              <FeaturedEntry entry={featured} />
              {visibleGridEntries.length > 0 && (
                <div className="blog-grid" aria-label={blogCopy.moreContents}>
                  {visibleGridEntries.map(entry => (
                    <BlogCard key={entry.slug} entry={entry} />
                  ))}
                </div>
              )}
              {pageCount > 1 && (
                <nav
                  className="blog-pagination"
                  aria-label={blogCopy.paginationAria}
                >
                  <button
                    type="button"
                    onClick={() => setPage(current => Math.max(0, current - 1))}
                    disabled={page === 0}
                    aria-label={t("blog.previousPage")}
                  >
                    <ChevronLeft size={17} aria-hidden="true" />
                  </button>
                  <span aria-live="polite">
                    {t("blog.pageOf", {
                      current: String(page + 1),
                      total: String(pageCount),
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPage(current => Math.min(pageCount - 1, current + 1))
                    }
                    disabled={page >= pageCount - 1}
                    aria-label={t("blog.nextPage")}
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
            {filteredEntries.length === 1
              ? blogCopy.resultsOne
              : blogCopy.resultsMany}
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
              {blogCopy.youtubeEyebrow}
            </p>
            <h2>{blogCopy.youtubeTitle}</h2>
            <p>{blogCopy.youtubeBody}</p>
          </div>
          <a
            className="button button-outline"
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {blogCopy.openYoutube}{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
