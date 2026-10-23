import { ArrowLeft, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Link } from "wouter";
import { useCms } from "@/components/cms/CmsProvider";
import { safeCmsUrl, type CmsBlock, type PublishedDocument } from "@shared/cms";
import {
  BLOG_CONTENT_KINDS,
  formatBlogDate,
  isPublishedBlogDocument,
  publishedDocumentToBlogEntry,
} from "@/lib/blog-model";
import "./cms-public.css";
import "./blog.css";

function CmsContentCover({ document }: { document: PublishedDocument }) {
  const imageUrl = safeCmsUrl(document.payload.imageUrl);
  return (
    <div className="cms-content-cover">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={document.payload.imageAlt || document.payload.title}
          loading="lazy"
        />
      ) : (
        <span>{document.payload.category}</span>
      )}
      <ArrowUpRight size={21} aria-hidden="true" />
    </div>
  );
}

export function CmsContentCard({ document }: { document: PublishedDocument }) {
  if (!isPublishedBlogDocument(document)) return null;
  const data = document.payload;
  const date = formatBlogDate(data.publishedAt);
  const entry = publishedDocumentToBlogEntry(document);
  return (
    <article className="cms-content-card">
      <Link
        href={`/conteudo/${document.slug}`}
        className="cms-content-cover-link"
        aria-label={`Ler ${data.title}`}
      >
        <CmsContentCover document={document} />
      </Link>
      <div>
        <span className="eyebrow">{entry.topic || data.category}</span>
        <h3>
          <Link href={`/conteudo/${document.slug}`}>{data.title}</Link>
        </h3>
        <p>{data.summary}</p>
        {(data.author || date) && (
          <span className="cms-article-meta">
            {[data.author, date].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>
    </article>
  );
}

function headingId(index: number) {
  return `cms-heading-${index}`;
}

function CmsArticleBlocks({ blocks }: { blocks: CmsBlock[] }) {
  return (
    <div className="cms-prose blog-prose">
      {blocks.map((block, index) => {
        const key = `cms-block-${index}`;
        if (block.type === "heading") {
          return (
            <h2 id={headingId(index)} key={key}>
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "quote") {
          return <blockquote key={key}>{block.text}</blockquote>;
        }
        if (block.type === "link") {
          const href = safeCmsUrl(block.href);
          return href ? (
            <p key={key}>
              <a href={href}>{block.text}</a>
            </p>
          ) : (
            <p key={key}>{block.text}</p>
          );
        }
        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}

function ArticleIndex({ blocks }: { blocks: CmsBlock[] }) {
  const headings = blocks
    .map((block, index) => ({ block, index }))
    .filter(item => item.block.type === "heading" && item.block.text.trim());
  if (headings.length < 2) return null;
  return (
    <nav className="blog-article-index" aria-label="Índice do artigo">
      <p>Índice</p>
      <ol>
        {headings.map(({ block, index }) => (
          <li key={headingId(index)}>
            <a href={`#${headingId(index)}`}>{block.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function MissingArticle({ ready, error }: { ready: boolean; error: string }) {
  return (
    <section className="blog-article-missing">
      <div className="container">
        <p className="eyebrow">
          <span />
          Conteúdo
        </p>
        <h1>{ready ? "Conteúdo não disponível." : "Carregando conteúdo…"}</h1>
        <p>
          {error ||
            "Este conteúdo não está publicado ou não está disponível nesta URL."}
        </p>
        <Link href="/conteudo" className="button button-outline">
          <ArrowLeft size={16} aria-hidden="true" /> Voltar à central
        </Link>
      </div>
    </section>
  );
}

export default function CmsArticle({ params }: { params: { slug: string } }) {
  const { documents, ready, error } = useCms();
  const document = documents.find(
    candidate =>
      candidate.slug === params.slug &&
      candidate.locale === "pt-BR" &&
      BLOG_CONTENT_KINDS.includes(
        candidate.kind as (typeof BLOG_CONTENT_KINDS)[number]
      )
  );

  if (!document || !isPublishedBlogDocument(document)) {
    return <MissingArticle ready={ready} error={error} />;
  }

  const data = document.payload;
  const publishedDate = formatBlogDate(data.publishedAt);
  const related = data.relatedSlugs.flatMap(slug => {
    const candidate = documents.find(item => item.slug === slug);
    return candidate &&
      candidate.slug !== document.slug &&
      isPublishedBlogDocument(candidate)
      ? [candidate]
      : [];
  });
  const imageUrl = safeCmsUrl(data.imageUrl);
  const sourceUrl = safeCmsUrl(data.sourceUrl);
  const downloadUrl = safeCmsUrl(data.downloadUrl);

  return (
    <article className="blog-article">
      <header className="blog-article-header">
        <div className="container">
          <nav className="blog-breadcrumbs" aria-label="Caminho de navegação">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/conteudo">Conteúdo</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{data.category}</span>
          </nav>
          <p className="eyebrow">
            <span />
            {data.category}
          </p>
          <h1>{data.title}</h1>
          {data.summary && (
            <p className="blog-article-summary">{data.summary}</p>
          )}
          {(data.author || publishedDate) && (
            <div className="blog-article-meta">
              {data.author && <span>Por {data.author}</span>}
              {publishedDate && (
                <time dateTime={data.publishedAt}>{publishedDate}</time>
              )}
            </div>
          )}
          {imageUrl && (
            <img
              className="blog-article-image"
              src={imageUrl}
              alt={data.imageAlt || data.title}
            />
          )}
        </div>
      </header>

      <div className="container blog-article-layout">
        <aside className="blog-article-aside">
          <ArticleIndex blocks={data.blocks} />
        </aside>
        <div className="blog-article-body">
          <CmsArticleBlocks blocks={data.blocks} />
          {downloadUrl && (
            <a
              className="button button-primary"
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Acessar material <Download size={17} aria-hidden="true" />
            </a>
          )}
          {sourceUrl && (
            <p className="blog-source-link">
              <span>Fonte</span>{" "}
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                Consultar fonte original{" "}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </p>
          )}
          <Link href="/conteudo" className="button button-text blog-back-link">
            <ArrowLeft size={16} aria-hidden="true" /> Voltar para Conteúdo
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section
          className="blog-related-section"
          aria-labelledby="related-content-title"
        >
          <div className="container">
            <p className="eyebrow">
              <span />
              Continue a leitura
            </p>
            <h2 id="related-content-title">Conteúdos relacionados</h2>
            <div className="blog-related-grid">
              {related.map(relatedDocument => (
                <CmsContentCard
                  key={relatedDocument.id}
                  document={relatedDocument}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
