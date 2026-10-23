import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { startLogin } from "@/const";
import { CmsApiError, apiCms } from "@/lib/cms-api";
import { BLOG_APPROVED_LABEL } from "@shared/blog";
import { hasCurrentEditorialApproval } from "@shared/editorial-approval";
import {
  CMS_CATEGORIES,
  CMS_KINDS,
  CMS_LOCALES,
  CmsBlock,
  CmsDocument,
  CmsKind,
  CmsLocale,
  CmsMedia,
  CmsPayload,
  CmsRole,
  CmsStatus,
  CmsUser,
  CmsAudit,
  CmsSaveRequest,
  cmsEmptyPayload,
  kindLabels,
  safeCmsUrl,
} from "@shared/cms";
import "./admin.css";

const CREATE_KINDS: CmsKind[] = [
  "article",
  "news",
  "case",
  "video",
  "material",
  "banner",
];
const STATUS_LABELS: Record<CmsStatus, string> = {
  draft: "Rascunho",
  review: "Em revisão",
  published: "Publicado na homologação",
  archived: "Arquivado",
};
const ROLE_LABELS: Record<"admin" | "editor" | "none", string> = {
  admin: "Administrador",
  editor: "Editor",
  none: "Sem acesso CMS",
};

type AdminSection =
  | "overview"
  | "documents"
  | "editor"
  | "media"
  | "users"
  | "audit";
type AdminRoute = {
  section: AdminSection;
  id?: number;
  newKind?: CmsKind;
};
type AdminDocument = Omit<CmsDocument, "id"> & { id?: number };
type Notice = { tone: "success" | "error" | "info"; text: string };
type AuthStatus = "loading" | "login" | "pending" | "access" | "error";
type JsonPrimitive = string | number | boolean | null;
type JsonNode = JsonPrimitive | JsonNode[] | { [key: string]: JsonNode };
type FieldPath = (string | number)[];
type MediaTarget = "imageUrl" | "downloadUrl" | "sourceUrl";

function parseAdminRoute(location: string): AdminRoute {
  const path = location.split("?")[0].replace(/\/+$/, "") || "/admin";
  const segments = path.split("/").filter(Boolean);
  if (segments[0] !== "admin") return { section: "overview" };
  const section = segments[1];
  if (!section) return { section: "overview" };
  if (section === "documents") {
    if (segments[2] === "new") {
      const requested = segments[3] as CmsKind | undefined;
      return {
        section: "editor",
        newKind:
          requested && CREATE_KINDS.includes(requested) ? requested : "article",
      };
    }
    const id = Number(segments[2]);
    return Number.isFinite(id) && id > 0
      ? { section: "editor", id }
      : { section: "documents" };
  }
  if (section === "media" || section === "users" || section === "audit") {
    return { section };
  }
  return { section: "overview" };
}

function makeBlankDocument(kind: CmsKind): AdminDocument {
  return {
    key: "",
    kind,
    locale: "pt-BR",
    slug: "",
    title: "",
    status: "draft",
    draft: cmsEmptyPayload(),
    published: null,
    revision: 0,
    updatedAt: "",
    hasPublished: false,
  };
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toJsonNode(value: unknown): JsonNode {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (Array.isArray(value)) return value.map(toJsonNode);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, toJsonNode(child)])
    );
  }
  return null;
}

function blankNodeLike(value: JsonNode): JsonNode {
  if (Array.isArray(value)) return [];
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).map(key => [key, blankNodeLike(value[key])])
    );
  }
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (value === null) return null;
  return "";
}

function pathKey(path: FieldPath): string {
  return path.map(String).join(".");
}

function updateJsonAtPath(
  root: JsonNode,
  path: FieldPath,
  next: JsonNode
): JsonNode {
  if (path.length === 0) return next;
  const [head, ...tail] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    const index = Number(head);
    copy[index] = updateJsonAtPath(copy[index] ?? null, tail, next);
    return copy;
  }
  const object = root !== null && typeof root === "object" ? { ...root } : {};
  const key = String(head);
  object[key] = updateJsonAtPath(object[key] ?? null, tail, next);
  return object;
}

function removeJsonAtPath(root: JsonNode, path: FieldPath): JsonNode {
  if (path.length === 0) return root;
  const [head, ...tail] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    const index = Number(head);
    if (tail.length === 0) copy.splice(index, 1);
    else copy[index] = removeJsonAtPath(copy[index] ?? null, tail);
    return copy;
  }
  if (root === null || typeof root !== "object") return root;
  const copy = { ...root };
  const key = String(head);
  if (tail.length === 0) delete copy[key];
  else copy[key] = removeJsonAtPath(copy[key] ?? null, tail);
  return copy;
}

function humanizeLabel(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, character => character.toUpperCase());
}

function isApprovedHomeDocument(document: AdminDocument): boolean {
  return (
    document.kind === "page" &&
    (document.slug === "/" || document.key.toLowerCase().includes("home"))
  );
}

function isLockedBriefField(document: AdminDocument, path: FieldPath): boolean {
  if (!isApprovedHomeDocument(document)) return false;
  const normalized = path.map(String).join(".").toUpperCase();
  return (
    normalized === "TITLE" ||
    normalized.includes("HERO_SUBTITLE") ||
    normalized.includes("MISSION")
  );
}

function isOriginalIdentifier(path: FieldPath): boolean {
  return path.some(part => String(part).toLowerCase() === "original");
}

function treeFieldLabel(label: string, path: FieldPath): string {
  const last = String(path[path.length - 1] ?? "").toLowerCase();
  if (last === "text") return "Texto";
  if (last === "url") return "URL segura";
  if (last === "alt") return "Texto alternativo";
  if (last === "original") return "Identificador original (somente leitura)";
  return label;
}

function safeDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" });
}

function displayError(error: unknown): string {
  if (error instanceof CmsApiError) {
    if (error.status === 409) {
      return "Conflito de revisão: o conteúdo mudou no servidor. Recarregue o documento para comparar; o painel não sobrescreveu a versão mais recente.";
    }
    if (error.status === 401)
      return "Sua sessão não está autenticada. Entre novamente para continuar.";
    if (error.status === 403)
      return "Sua identidade não tem permissão para esta ação.";
    return error.message;
  }
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
}

function StatusPill({ status }: { status: CmsStatus }) {
  return (
    <span className={`admin-status admin-status-${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function LoadingPanel({
  label = "Carregando dados reais do CMS…",
}: {
  label?: string;
}) {
  return (
    <div className="admin-loading" role="status">
      <span className="admin-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="admin-panel admin-error-panel" role="alert">
      <strong>Não foi possível carregar esta área</strong>
      <p>{message}</p>
      {onRetry ? (
        <button className="admin-button admin-button-outline" onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

function NoticeBanner({
  notice,
  onClose,
}: {
  notice: Notice;
  onClose: () => void;
}) {
  return (
    <div
      className={`admin-notice admin-notice-${notice.tone}`}
      role={notice.tone === "error" ? "alert" : "status"}
    >
      <span>{notice.text}</span>
      <button type="button" aria-label="Fechar aviso" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

function AuthGate({
  status,
  user,
  error,
  onLogin,
  onRetry,
}: {
  status: AuthStatus;
  user: CmsUser | null;
  error: string | null;
  onLogin: () => Promise<void>;
  onRetry: () => void;
}) {
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLogin = async () => {
    setLoginBusy(true);
    setLoginError(null);
    try {
      await onLogin();
    } catch (loginFailure) {
      setLoginError(displayError(loginFailure));
    } finally {
      setLoginBusy(false);
    }
  };

  const copyOpenId = async () => {
    if (
      !user?.openId ||
      typeof navigator === "undefined" ||
      !navigator.clipboard
    )
      return;
    try {
      await navigator.clipboard.writeText(user.openId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch (copyError) {
      setLoginError(displayError(copyError));
    }
  };

  if (status === "loading")
    return (
      <div className="admin-auth-state">
        <LoadingPanel label="Verificando sua identidade…" />
      </div>
    );
  if (status === "error") {
    return (
      <div className="admin-auth-state">
        <div className="admin-auth-card">
          <span className="admin-kicker">CMS · conexão</span>
          <h1>Não foi possível verificar o acesso</h1>
          <p>{error || "O serviço não respondeu como esperado."}</p>
          <button
            className="admin-button admin-button-primary"
            onClick={onRetry}
          >
            Tentar novamente
          </button>
          <Link className="admin-back-link" href="/">
            Voltar ao site
          </Link>
        </div>
      </div>
    );
  }
  if (status === "login") {
    return (
      <div className="admin-auth-state">
        <div className="admin-auth-card">
          <span className="admin-kicker">Área restrita · CMS</span>
          <h1>Entre para continuar</h1>
          <p>
            O painel usa a sessão real da aplicação. Nenhum conteúdo, usuário ou
            permissão é criado no navegador.
          </p>
          {loginError ? (
            <div className="admin-inline-error" role="alert">
              {loginError}
            </div>
          ) : null}
          <button
            className="admin-button admin-button-primary"
            disabled={loginBusy}
            onClick={handleLogin}
          >
            {loginBusy ? "Abrindo login…" : "Entrar com minha conta"}
          </button>
          <Link className="admin-back-link" href="/">
            Voltar ao site
          </Link>
        </div>
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="admin-auth-state">
        <div className="admin-auth-card admin-auth-card-pending">
          <span className="admin-kicker">Identidade confirmada</span>
          <h1>Aguardando autorização do CMS</h1>
          <p>
            Esta conta está autenticada, mas ainda não recebeu o papel{" "}
            <strong>admin</strong> ou <strong>editor</strong>. Solicite a
            autorização ao responsável pelo projeto.
          </p>
          <div className="admin-identity-card">
            <div>
              <span>Nome verificado</span>
              <strong>{user?.name || "Nome não informado"}</strong>
            </div>
            <div>
              <span>OpenID para solicitar acesso</span>
              <strong>{user?.openId || "—"}</strong>
            </div>
            {user?.openId ? (
              <button
                className="admin-button admin-button-outline"
                onClick={copyOpenId}
              >
                {copied ? "OpenID copiado" : "Copiar OpenID"}
              </button>
            ) : null}
          </div>
          {loginError ? (
            <div className="admin-inline-error" role="alert">
              {loginError}
            </div>
          ) : null}
          <button
            className="admin-button admin-button-outline"
            disabled={loginBusy}
            onClick={handleLogin}
          >
            Verificar outra vez
          </button>
          <Link className="admin-back-link" href="/">
            Voltar ao site
          </Link>
        </div>
      </div>
    );
  }
  return null;
}

function FieldText({
  label,
  value,
  onChange,
  multiline = false,
  disabled = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          disabled={disabled}
          onChange={event => onChange(event.target.value)}
        />
      ) : (
        <input
          value={value}
          disabled={disabled}
          onChange={event => onChange(event.target.value)}
        />
      )}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function FieldTree({
  label,
  value,
  path,
  depth,
  document,
  onChange,
}: {
  label: string;
  value: unknown;
  path: FieldPath;
  depth: number;
  document: AdminDocument;
  onChange: (path: FieldPath, value: JsonNode) => void;
}) {
  const node = toJsonNode(value);
  const original = isOriginalIdentifier(path);
  const locked = isLockedBriefField(document, path) || original;
  const lockMessage = original
    ? "Identificador original do mapeamento; preserve a estrutura recebida."
    : "Campo aprovado no briefing; bloqueado para edição nesta fase.";
  const visibleLabel = treeFieldLabel(label, path);
  if (Array.isArray(node)) {
    return (
      <details className="admin-tree-node admin-tree-array" open={depth < 2}>
        <summary>
          <span>{visibleLabel}</span>
          <code>{node.length} item(ns)</code>
          <button
            type="button"
            className="admin-tree-action"
            onClick={event => {
              event.preventDefault();
              onChange(path, [...node, node[0] ? cloneJson(node[0]) : ""]);
            }}
          >
            Adicionar item
          </button>
        </summary>
        <div className="admin-tree-children">
          {node.map((child, index) => (
            <div className="admin-tree-item" key={`${pathKey(path)}-${index}`}>
              <FieldTree
                label={`Item ${index + 1}`}
                value={child}
                path={[...path, index]}
                depth={depth + 1}
                document={document}
                onChange={onChange}
              />
              <div className="admin-tree-item-actions">
                <button
                  type="button"
                  className="admin-link-button"
                  disabled={locked}
                  onClick={() => onChange([...path, index], cloneJson(child))}
                >
                  Duplicar
                </button>
                <button
                  type="button"
                  className="admin-link-button admin-danger-link"
                  disabled={locked}
                  onClick={() =>
                    onChange(path, removeJsonAtPath(node, [index]))
                  }
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
          {node.length === 0 ? (
            <p className="admin-muted">
              Array vazio. Adicione o primeiro item para preservar a estrutura.
            </p>
          ) : null}
        </div>
      </details>
    );
  }
  if (node !== null && typeof node === "object") {
    return (
      <details className="admin-tree-node admin-tree-object" open={depth < 2}>
        <summary>
          <span>{visibleLabel}</span>
          <code>{Object.keys(node).length} campo(s)</code>
          <button
            type="button"
            className="admin-tree-action"
            disabled={locked}
            onClick={event => {
              event.preventDefault();
              const base = "novoCampo";
              let next = base;
              let count = 2;
              while (Object.prototype.hasOwnProperty.call(node, next))
                next = `${base}${count++}`;
              onChange(path, { ...node, [next]: "" });
            }}
          >
            Adicionar campo
          </button>
        </summary>
        <div className="admin-tree-children">
          {Object.entries(node).map(([key, child]) => (
            <FieldTree
              key={`${pathKey(path)}-${key}`}
              label={humanizeLabel(key)}
              value={child}
              path={[...path, key]}
              depth={depth + 1}
              document={document}
              onChange={onChange}
            />
          ))}
          {Object.keys(node).length === 0 ? (
            <p className="admin-muted">
              Objeto vazio. Adicione um campo para começar.
            </p>
          ) : null}
        </div>
      </details>
    );
  }
  if (typeof node === "boolean") {
    return (
      <label
        className={`admin-primitive admin-primitive-check ${locked ? "is-locked" : ""}`}
      >
        <input
          type="checkbox"
          checked={node}
          disabled={locked}
          onChange={event => onChange(path, event.target.checked)}
        />
        <span>{visibleLabel}</span>
        <code>booleano</code>
        {locked ? <small>{lockMessage}</small> : null}
      </label>
    );
  }
  if (typeof node === "number") {
    return (
      <label className={`admin-primitive ${locked ? "is-locked" : ""}`}>
        <span>{visibleLabel}</span>
        <code>número</code>
        <input
          type="number"
          value={node}
          disabled={locked}
          onChange={event => onChange(path, Number(event.target.value) || 0)}
        />
        {locked ? <small>{lockMessage}</small> : null}
      </label>
    );
  }
  if (node === null) {
    return (
      <label className={`admin-primitive ${locked ? "is-locked" : ""}`}>
        <span>{visibleLabel}</span>
        <code>null</code>
        <select
          disabled={locked}
          value="null"
          onChange={event => {
            if (event.target.value === "string") onChange(path, "");
            if (event.target.value === "number") onChange(path, 0);
            if (event.target.value === "boolean") onChange(path, false);
          }}
        >
          <option value="null">null</option>
          <option value="string">Converter para texto</option>
          <option value="number">Converter para número</option>
          <option value="boolean">Converter para booleano</option>
        </select>
        {locked ? <small>{lockMessage}</small> : null}
      </label>
    );
  }
  return (
    <label
      className={`admin-primitive admin-primitive-string ${locked ? "is-locked" : ""}`}
    >
      <span>{visibleLabel}</span>
      <code>texto</code>
      <textarea
        rows={node.length > 100 ? 5 : 3}
        value={node}
        disabled={locked}
        onChange={event => onChange(path, event.target.value)}
      />
      {locked ? <small>{lockMessage}</small> : null}
    </label>
  );
}

function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: CmsBlock[];
  onChange: (blocks: CmsBlock[]) => void;
}) {
  const update = (index: number, patch: Partial<CmsBlock>) => {
    onChange(
      blocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, ...patch } : block
      )
    );
  };
  return (
    <section className="admin-editor-section">
      <div className="admin-section-title-row">
        <div>
          <span className="admin-kicker">Conteúdo estruturado</span>
          <h2>Blocos</h2>
        </div>
        <button
          type="button"
          className="admin-button admin-button-outline"
          onClick={() =>
            onChange([
              ...blocks,
              { type: "paragraph", text: "", items: [], href: "" },
            ])
          }
        >
          Adicionar bloco
        </button>
      </div>
      <p className="admin-help">
        Use texto, títulos, listas, citações e links seguros. O editor não
        aceita HTML bruto.
      </p>
      <div className="admin-block-list">
        {blocks.map((block, index) => (
          <fieldset className="admin-block" key={`block-${index}`}>
            <legend>Bloco {index + 1}</legend>
            <div className="admin-block-toolbar">
              <select
                value={block.type}
                onChange={event =>
                  update(index, {
                    type: event.target.value as CmsBlock["type"],
                  })
                }
              >
                <option value="paragraph">Parágrafo</option>
                <option value="heading">Título</option>
                <option value="list">Lista</option>
                <option value="quote">Citação</option>
                <option value="link">Link</option>
              </select>
              <button
                type="button"
                className="admin-link-button admin-danger-link"
                onClick={() =>
                  onChange(
                    blocks.filter((_, blockIndex) => blockIndex !== index)
                  )
                }
              >
                Remover
              </button>
            </div>
            {block.type === "list" ? (
              <div className="admin-list-items">
                {block.items.map((item, itemIndex) => (
                  <div className="admin-list-item" key={`item-${itemIndex}`}>
                    <input
                      value={item}
                      onChange={event =>
                        update(index, {
                          items: block.items.map((current, currentIndex) =>
                            currentIndex === itemIndex
                              ? event.target.value
                              : current
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      className="admin-link-button admin-danger-link"
                      onClick={() =>
                        update(index, {
                          items: block.items.filter(
                            (_, currentIndex) => currentIndex !== itemIndex
                          ),
                        })
                      }
                    >
                      Remover
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="admin-link-button"
                  onClick={() => update(index, { items: [...block.items, ""] })}
                >
                  Adicionar item
                </button>
              </div>
            ) : (
              <textarea
                rows={block.type === "heading" ? 2 : 5}
                placeholder={
                  block.type === "link" ? "Texto do link" : "Texto do bloco"
                }
                value={block.text}
                onChange={event => update(index, { text: event.target.value })}
              />
            )}
            {block.type === "link" ? (
              <label className="admin-field">
                <span>Destino seguro</span>
                <input
                  value={block.href}
                  onChange={event =>
                    update(index, { href: event.target.value })
                  }
                  placeholder="https://… ou /rota"
                />
                <small>
                  {block.href && !safeCmsUrl(block.href)
                    ? "A API validará o destino; javascript: e data: não são permitidos."
                    : "Aceita http(s), mailto, tel ou rota interna."}
                </small>
              </label>
            ) : null}
          </fieldset>
        ))}
        {blocks.length === 0 ? (
          <div className="admin-empty admin-empty-compact">
            Nenhum bloco estruturado. O documento pode ser salvo vazio e
            completado depois.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function MediaPicker({
  target,
  onClose,
  onSelect,
}: {
  target: MediaTarget;
  onClose: () => void;
  onSelect: (media: CmsMedia) => void;
}) {
  const [items, setItems] = useState<CmsMedia[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    apiCms<CmsMedia[]>("/media?includeHidden=1")
      .then(result => {
        if (active) {
          setItems(result);
          setStatus("ready");
        }
      })
      .catch(reason => {
        if (active) {
          setError(displayError(reason));
          setStatus("error");
        }
      });
    return () => {
      active = false;
    };
  }, []);
  const filtered = items.filter(item =>
    target === "imageUrl"
      ? item.mime.startsWith("image/")
      : item.mime === "application/pdf" || !item.mime.startsWith("image/")
  );
  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-picker-title"
      >
        <div className="admin-section-title-row">
          <div>
            <span className="admin-kicker">Biblioteca real</span>
            <h2 id="media-picker-title">
              Selecionar {target === "imageUrl" ? "imagem" : "arquivo"}
            </h2>
          </div>
          <button
            type="button"
            className="admin-icon-button"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        {status === "loading" ? (
          <LoadingPanel label="Carregando mídia…" />
        ) : status === "error" ? (
          <ErrorPanel message={error || "Erro ao carregar mídia."} />
        ) : (
          <div className="admin-picker-grid">
            {filtered.map(media => (
              <button
                type="button"
                className="admin-picker-item"
                key={media.id}
                onClick={() => onSelect(media)}
              >
                {media.mime.startsWith("image/") ? (
                  <img src={media.url} alt={media.alt || media.name} />
                ) : (
                  <span className="admin-file-icon">PDF</span>
                )}
                <strong>{media.name}</strong>
                <small>
                  {media.hidden ? "Oculta da indexação" : media.mime}
                </small>
              </button>
            ))}
            {filtered.length === 0 ? (
              <div className="admin-empty admin-empty-compact">
                Nenhum arquivo compatível foi retornado pela API.
              </div>
            ) : null}
          </div>
        )}
        <p className="admin-help">
          Arquivos públicos não devem conter dados confidenciais. A seleção
          apenas preenche a URL do campo; o servidor continua validando a
          publicação.
        </p>
      </section>
    </div>
  );
}

function DocumentEditor({
  initialDocument,
  currentUser,
  busy,
  onSave,
  onAction,
  onCloneLocale,
  onBack,
  onDirtyChange,
}: {
  initialDocument: AdminDocument;
  currentUser: CmsUser;
  busy: boolean;
  onSave: (document: AdminDocument) => Promise<AdminDocument>;
  onAction: (
    document: AdminDocument,
    action: "review" | "draft" | "publish" | "unpublish" | "archive"
  ) => Promise<AdminDocument>;
  onCloneLocale: (
    document: AdminDocument,
    locale: CmsLocale
  ) => Promise<AdminDocument>;
  onBack: () => void;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const [document, setDocument] = useState<AdminDocument>(() => ({
    ...initialDocument,
    draft: cloneJson(initialDocument.draft),
  }));
  const [dirty, setDirty] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<MediaTarget | null>(null);
  const [cloneLocale, setCloneLocale] = useState<CmsLocale | "">("");
  useEffect(() => {
    setDocument({
      ...initialDocument,
      draft: cloneJson(initialDocument.draft),
    });
    setDirty(false);
  }, [initialDocument.id, initialDocument.revision, initialDocument.key]);
  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  const payload = document.draft;
  const isNew = document.id === undefined;
  const homeLocked = isApprovedHomeDocument(document);
  const publishReady = Boolean(payload.title.trim() && document.slug.trim());
  const setDraft = (next: CmsPayload) => {
    setDocument(current => ({ ...current, draft: next, title: next.title }));
    setDirty(true);
  };
  const patchPayload = (patch: Partial<CmsPayload>) =>
    setDraft({ ...payload, ...patch });
  const setField = (path: FieldPath, value: JsonNode) => {
    const next = updateJsonAtPath(toJsonNode(payload.fields), path, value);
    setDraft({
      ...payload,
      fields: (next && typeof next === "object" && !Array.isArray(next)
        ? next
        : {}) as Record<string, unknown>,
    });
  };
  const handleSave = async () => {
    const saved = await onSave({
      ...document,
      draft: cloneJson(payload),
      title: payload.title,
    });
    setDocument({ ...saved, draft: cloneJson(saved.draft) });
    setDirty(false);
  };
  const handleAction = async (
    action: "review" | "draft" | "publish" | "unpublish" | "archive"
  ) => {
    const updated = await onAction(
      { ...document, draft: cloneJson(payload) },
      action
    );
    setDocument({ ...updated, draft: cloneJson(updated.draft) });
    setDirty(false);
  };
  const chooseMedia = (media: CmsMedia) => {
    if (!mediaTarget) return;
    patchPayload({
      [mediaTarget]: media.url,
      ...(mediaTarget === "imageUrl" && !payload.imageAlt
        ? { imageAlt: media.alt || media.name }
        : {}),
    });
    setMediaTarget(null);
  };
  const availableLocales = CMS_LOCALES.filter(
    locale => locale !== document.locale
  );

  return (
    <div className="admin-editor">
      {mediaTarget ? (
        <MediaPicker
          target={mediaTarget}
          onClose={() => setMediaTarget(null)}
          onSelect={chooseMedia}
        />
      ) : null}
      <div className="admin-editor-topbar">
        <button type="button" className="admin-back-button" onClick={onBack}>
          ← Documentos
        </button>
        <div className="admin-editor-heading">
          <span className="admin-kicker">
            {isNew ? "Novo conteúdo" : "Edição estruturada"}
          </span>
          <h1>{payload.title || "Documento sem título"}</h1>
        </div>
        <div className="admin-editor-status">
          {isNew ? (
            <span className="admin-status admin-status-draft">
              Novo rascunho
            </span>
          ) : (
            <StatusPill status={document.status} />
          )}
          <span className="admin-revision">
            {isNew ? "Ainda não salvo" : `Revisão ${document.revision}`}
          </span>
          {hasCurrentEditorialApproval(document) && (
            <span
              className="admin-status admin-status-review"
              title="Aprovação editorial desta revisão; não autoriza publicar nem altera acessos."
            >
              {BLOG_APPROVED_LABEL}
            </span>
          )}
        </div>
      </div>
      <div className="admin-editor-layout">
        <div className="admin-editor-main">
          <section className="admin-editor-section">
            <div className="admin-section-title-row">
              <div>
                <span className="admin-kicker">Identificação</span>
                <h2>Conteúdo principal</h2>
              </div>
              <span className="admin-required-note">* obrigatório</span>
            </div>
            <div className="admin-form-grid admin-form-grid-two">
              <FieldText
                label="Título *"
                value={payload.title}
                disabled={homeLocked}
                onChange={value => patchPayload({ title: value })}
                hint={
                  homeLocked
                    ? "Campo aprovado no briefing; bloqueado para edição nesta fase."
                    : "Título editorial, sem HTML."
                }
              />
              <label className="admin-field">
                <span>Tipo</span>
                <select
                  value={document.kind}
                  disabled={!isNew}
                  onChange={event => {
                    const kind = event.target.value as CmsKind;
                    setDocument(current => ({ ...current, kind }));
                    setDirty(true);
                  }}
                >
                  {(isNew ? CREATE_KINDS : [document.kind]).map(kind => (
                    <option value={kind} key={kind}>
                      {kindLabels[kind]}
                    </option>
                  ))}
                </select>
                {!isNew ? (
                  <small>
                    O tipo de um documento existente não é alterado neste fluxo.
                  </small>
                ) : (
                  <small>
                    Novos registros ficam limitados aos formatos editoriais
                    aprovados.
                  </small>
                )}
              </label>
              <label className="admin-field">
                <span>Locale</span>
                <select
                  value={document.locale}
                  disabled={!isNew}
                  onChange={event => {
                    setDocument(current => ({
                      ...current,
                      locale: event.target.value as CmsLocale,
                    }));
                    setDirty(true);
                  }}
                >
                  {CMS_LOCALES.map(locale => (
                    <option value={locale} key={locale}>
                      {locale}
                    </option>
                  ))}
                </select>
                {!isNew ? (
                  <small>
                    Para outra língua, clone a variante e revise a tradução
                    humana.
                  </small>
                ) : null}
              </label>
              <FieldText
                label="Slug *"
                value={document.slug}
                onChange={value => {
                  setDocument(current => ({ ...current, slug: value }));
                  setDirty(true);
                }}
                hint="Use apenas uma rota que o backend aceite."
              />
              <FieldText
                label="Chave editorial"
                value={document.key}
                onChange={value => {
                  setDocument(current => ({ ...current, key: value }));
                  setDirty(true);
                }}
                hint="A mesma chave conecta variantes de locale."
              />
              <FieldText
                label="Resumo"
                value={payload.summary}
                multiline
                onChange={value => patchPayload({ summary: value })}
              />
              <FieldText
                label="Autor"
                value={payload.author}
                onChange={value => patchPayload({ author: value })}
              />
              <FieldText
                label="Data de publicação"
                value={payload.publishedAt}
                onChange={value => patchPayload({ publishedAt: value })}
                hint="Data textual conforme o contrato; a API valida o formato."
              />
            </div>
          </section>
          <section className="admin-editor-section">
            <div className="admin-section-title-row">
              <div>
                <span className="admin-kicker">Descoberta</span>
                <h2>SEO e mídia</h2>
              </div>
              <span className="admin-help-inline">
                URLs são checadas também no servidor.
              </span>
            </div>
            <div className="admin-form-grid admin-form-grid-two">
              <FieldText
                label="Título SEO"
                value={payload.seoTitle}
                onChange={value => patchPayload({ seoTitle: value })}
              />
              <FieldText
                label="Descrição SEO"
                value={payload.seoDescription}
                multiline
                onChange={value => patchPayload({ seoDescription: value })}
              />
              <label className="admin-field">
                <span>Categoria</span>
                <select
                  value={payload.category}
                  onChange={event =>
                    patchPayload({ category: event.target.value })
                  }
                >
                  {CMS_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <div className="admin-field">
                <span>Imagem principal</span>
                <div className="admin-input-action">
                  <input
                    value={payload.imageUrl}
                    onChange={event =>
                      patchPayload({ imageUrl: event.target.value })
                    }
                    placeholder="https://… ou /rota"
                  />
                  <button
                    type="button"
                    className="admin-button admin-button-small"
                    onClick={() => setMediaTarget("imageUrl")}
                  >
                    Biblioteca
                  </button>
                </div>
                <small>
                  {payload.imageUrl && !safeCmsUrl(payload.imageUrl)
                    ? "URL ainda não passou na validação visual; javascript: e data: são rejeitados."
                    : "Imagem JPEG, PNG ou WebP da biblioteca ou URL permitida."}
                </small>
              </div>
              <FieldText
                label="Texto alternativo da imagem"
                value={payload.imageAlt}
                onChange={value => patchPayload({ imageAlt: value })}
                hint="Obrigatório quando houver imagem."
              />
              <div className="admin-field">
                <span>Fonte</span>
                <div className="admin-input-action">
                  <input
                    value={payload.sourceUrl}
                    onChange={event =>
                      patchPayload({ sourceUrl: event.target.value })
                    }
                    placeholder="https://… ou /rota"
                  />
                  <button
                    type="button"
                    className="admin-button admin-button-small"
                    onClick={() => setMediaTarget("sourceUrl")}
                  >
                    Biblioteca
                  </button>
                </div>
              </div>
              <div className="admin-field">
                <span>Download</span>
                <div className="admin-input-action">
                  <input
                    value={payload.downloadUrl}
                    onChange={event =>
                      patchPayload({ downloadUrl: event.target.value })
                    }
                    placeholder="https://… ou /rota"
                  />
                  <button
                    type="button"
                    className="admin-button admin-button-small"
                    onClick={() => setMediaTarget("downloadUrl")}
                  >
                    Biblioteca
                  </button>
                </div>
              </div>
              <FieldText
                label="Slugs relacionados"
                value={payload.relatedSlugs.join(", ")}
                onChange={value =>
                  patchPayload({
                    relatedSlugs: value
                      .split(",")
                      .map(item => item.trim())
                      .filter(Boolean),
                  })
                }
                hint="Separe cada slug por vírgula (máximo 10)."
              />
            </div>
          </section>
          {document.kind === "banner" ? (
            <section className="admin-editor-section">
              <div className="admin-section-title-row">
                <div>
                  <span className="admin-kicker">Distribuição</span>
                  <h2>Rotas do banner</h2>
                </div>
              </div>
              <FieldText
                label="Targets"
                value={payload.bannerTargets.join(", ")}
                multiline
                onChange={value =>
                  patchPayload({
                    bannerTargets: value
                      .split(",")
                      .map(item => item.trim())
                      .filter(Boolean),
                  })
                }
                hint="Informe as rotas separadas por vírgula; a API limita a 30 targets."
              />
            </section>
          ) : null}
          <BlockEditor
            blocks={payload.blocks}
            onChange={blocks => patchPayload({ blocks })}
          />
          <section className="admin-editor-section">
            <div className="admin-section-title-row">
              <div>
                <span className="admin-kicker">Campos do conteúdo</span>
                <h2>Estrutura original</h2>
              </div>
            </div>
            <p className="admin-help">
              Todos os campos JSON recebidos permanecem disponíveis. Objetos e
              arrays podem ser editados sem trocar o formato; identificadores{" "}
              <code>original</code> ficam somente para leitura.
            </p>
            <div className="admin-field-tree">
              <FieldTree
                label="Campos"
                value={payload.fields}
                path={[]}
                depth={0}
                document={document}
                onChange={setField}
              />
            </div>
          </section>
          <section className="admin-editor-section admin-editor-note-section">
            <span className="admin-kicker">Nota editorial</span>
            <h2>Snapshot seguro</h2>
            <p>
              O rascunho é salvo separado do snapshot publicado. Alterações não
              publicadas permanecem pendentes e não aparecem no site. Variantes
              de idioma são apenas cópias para revisão humana — nenhuma tradução
              automática é gerada aqui.
            </p>
            {homeLocked ? (
              <p className="admin-locked-note">
                <strong>Campos aprovados bloqueados:</strong> título,
                HERO_SUBTITLE e MISSION desta Home não podem ser alterados sem
                nova aprovação.
              </p>
            ) : null}
          </section>
        </div>
        <aside className="admin-editor-sidebar">
          <div className="admin-panel admin-sticky-actions">
            <div className="admin-section-title-row">
              <div>
                <span className="admin-kicker">Ações</span>
                <h2>Fluxo editorial</h2>
              </div>
            </div>
            <button
              type="button"
              className="admin-button admin-button-primary admin-full-button"
              disabled={busy || (homeLocked && !payload.title)}
              onClick={handleSave}
            >
              {busy ? "Salvando…" : "Salvar rascunho"}
            </button>
            {currentUser.role === "editor" ? (
              <>
                <button
                  type="button"
                  className="admin-button admin-button-outline admin-full-button"
                  disabled={busy || isNew}
                  onClick={() => handleAction("review")}
                >
                  Enviar para revisão
                </button>
                {!isNew && document.status !== "draft" ? (
                  <button
                    type="button"
                    className="admin-button admin-button-quiet admin-full-button"
                    disabled={busy}
                    onClick={() => handleAction("draft")}
                  >
                    Retornar a rascunho
                  </button>
                ) : null}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="admin-button admin-button-homologation admin-full-button"
                  disabled={busy || isNew || !publishReady}
                  onClick={() => handleAction("publish")}
                >
                  Publicar na homologação
                </button>
                {!publishReady && !isNew ? (
                  <small className="admin-action-hint">
                    Preencha título e slug para publicar esta variante completa.
                  </small>
                ) : null}
                {!isNew && document.hasPublished ? (
                  <button
                    type="button"
                    className="admin-button admin-button-outline admin-full-button"
                    disabled={busy}
                    onClick={() => handleAction("unpublish")}
                  >
                    Retirar da homologação
                  </button>
                ) : null}
                {!isNew && document.status !== "archived" ? (
                  <button
                    type="button"
                    className="admin-link-button admin-danger-link admin-full-button"
                    disabled={busy}
                    onClick={() => handleAction("archive")}
                  >
                    Arquivar documento
                  </button>
                ) : null}
              </>
            )}
            {cloneLocale ? (
              <button
                type="button"
                className="admin-button admin-button-outline admin-full-button"
                disabled={busy || isNew}
                onClick={async () => {
                  await onCloneLocale(document, cloneLocale);
                  setCloneLocale("");
                }}
              >
                Criar variante {cloneLocale}
              </button>
            ) : null}
            {!isNew ? (
              <div className="admin-clone-locale">
                <label className="admin-field">
                  <span>Clonar para outro locale</span>
                  <select
                    value={cloneLocale}
                    disabled={busy}
                    onChange={event =>
                      setCloneLocale(event.target.value as CmsLocale | "")
                    }
                  >
                    <option value="">Escolha um locale</option>
                    {availableLocales.map(locale => (
                      <option value={locale} key={locale}>
                        {locale}
                      </option>
                    ))}
                  </select>
                  <small>
                    O payload é copiado para revisão humana; não há tradução
                    automática.
                  </small>
                </label>
              </div>
            ) : null}
            <button
              type="button"
              className="admin-back-link admin-back-link-button"
              disabled={busy}
              onClick={onBack}
            >
              Cancelar e voltar
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DocumentsList({
  documents,
  onOpen,
  onCreate,
}: {
  documents: CmsDocument[];
  onOpen: (id: number) => void;
  onCreate: (kind: CmsKind) => void;
}) {
  const [kind, setKind] = useState<CmsKind | "all">("all");
  const [locale, setLocale] = useState<CmsLocale | "all">("all");
  const [status, setStatus] = useState<CmsStatus | "all">("all");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return documents.filter(document => {
      const matchesKind = kind === "all" || document.kind === kind;
      const matchesLocale = locale === "all" || document.locale === locale;
      const matchesStatus = status === "all" || document.status === status;
      const matchesSearch =
        !query ||
        [document.title, document.slug, document.key].some(value =>
          value.toLowerCase().includes(query)
        );
      return matchesKind && matchesLocale && matchesStatus && matchesSearch;
    });
  }, [documents, kind, locale, status, search]);
  return (
    <div className="admin-content-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">CMS · conteúdo</span>
          <h1>Documentos</h1>
          <p>
            Conteúdo editorial real retornado pelo backend. Rascunhos não
            alteram o snapshot publicado.
          </p>
        </div>
        <div className="admin-create-actions">
          {CREATE_KINDS.map(createKind => (
            <button
              type="button"
              className="admin-button admin-button-outline"
              key={createKind}
              onClick={() => onCreate(createKind)}
            >
              + {kindLabels[createKind]}
            </button>
          ))}
        </div>
      </div>
      <div className="admin-filter-bar">
        <label>
          <span>Buscar</span>
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Título, slug ou chave"
          />
        </label>
        <label>
          <span>Tipo</span>
          <select
            value={kind}
            onChange={event => setKind(event.target.value as CmsKind | "all")}
          >
            <option value="all">Todos os tipos</option>
            {CMS_KINDS.map(item => (
              <option value={item} key={item}>
                {kindLabels[item]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Locale</span>
          <select
            value={locale}
            onChange={event =>
              setLocale(event.target.value as CmsLocale | "all")
            }
          >
            <option value="all">Todos</option>
            {CMS_LOCALES.map(item => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select
            value={status}
            onChange={event =>
              setStatus(event.target.value as CmsStatus | "all")
            }
          >
            <option value="all">Todos</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option value={key} key={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="admin-totals">
        <div>
          <span>Total filtrado</span>
          <strong>{filtered.length}</strong>
        </div>
        <div>
          <span>Rascunhos</span>
          <strong>
            {filtered.filter(item => item.status === "draft").length}
          </strong>
        </div>
        <div>
          <span>Em revisão</span>
          <strong>
            {filtered.filter(item => item.status === "review").length}
          </strong>
        </div>
        <div>
          <span>Homologação</span>
          <strong>
            {filtered.filter(item => item.status === "published").length}
          </strong>
        </div>
      </div>
      <div className="admin-panel admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Tipo</th>
              <th>Locale</th>
              <th>Status</th>
              <th>Atualizado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map(document => (
              <tr key={document.id}>
                <td>
                  <strong>{document.title || "Sem título"}</strong>
                  <small>
                    {document.slug || "Sem slug"} ·{" "}
                    {document.key || "Sem chave"}
                  </small>
                </td>
                <td>{kindLabels[document.kind]}</td>
                <td>{document.locale}</td>
                <td>
                  <StatusPill status={document.status} />
                  {hasCurrentEditorialApproval(document) && (
                    <small>{BLOG_APPROVED_LABEL}</small>
                  )}
                </td>
                <td>{safeDate(document.updatedAt)}</td>
                <td>
                  <button
                    type="button"
                    className="admin-link-button"
                    onClick={() => onOpen(document.id)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div className="admin-empty">
            Nenhum documento corresponde aos filtros. O painel não cria exemplos
            fictícios.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Overview({
  documents,
  onOpenDocuments,
  onCreate,
}: {
  documents: CmsDocument[];
  onOpenDocuments: () => void;
  onCreate: (kind: CmsKind) => void;
}) {
  const byKind = CMS_KINDS.map(kind => ({
    kind,
    count: documents.filter(document => document.kind === kind).length,
  })).filter(item => item.count > 0);
  return (
    <div className="admin-content-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">CMS · visão geral</span>
          <h1>Editorial sem atalhos</h1>
          <p>
            Acompanhe o estado dos documentos, preserve snapshots publicados e
            envie conteúdo para revisão.
          </p>
        </div>
        <button
          type="button"
          className="admin-button admin-button-primary"
          onClick={onOpenDocuments}
        >
          Abrir documentos
        </button>
      </div>
      <div className="admin-overview-grid">
        <div className="admin-overview-card admin-overview-card-accent">
          <span>Documentos retornados</span>
          <strong>{documents.length}</strong>
          <p>Somente registros autorizados pela API.</p>
        </div>
        <div className="admin-overview-card">
          <span>Rascunhos</span>
          <strong>
            {documents.filter(document => document.status === "draft").length}
          </strong>
          <p>Podem continuar pendentes sem tocar no site.</p>
        </div>
        <div className="admin-overview-card">
          <span>Em revisão</span>
          <strong>
            {documents.filter(document => document.status === "review").length}
          </strong>
          <p>Fluxo de editor para revisão administrativa.</p>
        </div>
        <div className="admin-overview-card">
          <span>Homologação</span>
          <strong>
            {
              documents.filter(document => document.status === "published")
                .length
            }
          </strong>
          <p>Publicação limitada ao ambiente de homologação.</p>
        </div>
      </div>
      <div className="admin-two-column">
        <section className="admin-panel">
          <div className="admin-section-title-row">
            <div>
              <span className="admin-kicker">Distribuição</span>
              <h2>Tipos presentes</h2>
            </div>
          </div>
          {byKind.length ? (
            <div className="admin-kind-list">
              {byKind.map(item => (
                <div key={item.kind}>
                  <span>{kindLabels[item.kind]}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty admin-empty-compact">
              A API não retornou documentos neste momento.
            </div>
          )}
        </section>
        <section className="admin-panel">
          <div className="admin-section-title-row">
            <div>
              <span className="admin-kicker">Criação</span>
              <h2>Novo conteúdo</h2>
            </div>
          </div>
          <p className="admin-help">
            O CMS permite criar apenas formatos editoriais aprovados. Páginas
            institucionais e landings existentes são editadas pelo registro
            recebido, não são criadas como páginas arbitrárias.
          </p>
          <div className="admin-create-grid">
            {CREATE_KINDS.map(kind => (
              <button
                type="button"
                className="admin-quick-create"
                key={kind}
                onClick={() => onCreate(kind)}
              >
                <span>+</span>
                {kindLabels[kind]}
              </button>
            ))}
          </div>
        </section>
      </div>
      <div className="admin-panel admin-safety-callout">
        <strong>Snapshot seguro</strong>
        <p>
          Salvar rascunho não substitui o conteúdo publicado. O botão de
          publicação é deliberadamente limitado a{" "}
          <em>Publicar na homologação</em>; não há lançamento direto no site
          público nesta etapa.
        </p>
      </div>
    </div>
  );
}

function MediaRow({
  media,
  onSaved,
}: {
  media: CmsMedia;
  onSaved: (media: CmsMedia) => void;
}) {
  const [alt, setAlt] = useState(media.alt);
  const [title, setTitle] = useState(media.title);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const save = async (hidden?: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const updated = await apiCms<CmsMedia>(`/media/${media.id}`, "POST", {
        alt,
        title,
        ...(hidden === undefined ? {} : { hidden }),
      });
      onSaved(updated);
    } catch (reason) {
      setError(displayError(reason));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="admin-media-row">
      <div className="admin-media-preview">
        {media.mime.startsWith("image/") ? (
          <img src={media.url} alt={media.alt || media.name} />
        ) : (
          <span className="admin-file-icon">PDF</span>
        )}
      </div>
      <div className="admin-media-data">
        <strong>{media.name}</strong>
        <small>
          {media.mime} · {(media.size / 1024 / 1024).toFixed(2)} MB ·{" "}
          {safeDate(media.createdAt)}
        </small>
        <div className="admin-form-grid admin-form-grid-two">
          <label className="admin-field">
            <span>Texto alternativo *</span>
            <input value={alt} onChange={event => setAlt(event.target.value)} />
          </label>
          <label className="admin-field">
            <span>Título *</span>
            <input
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </label>
        </div>
        {error ? <div className="admin-inline-error">{error}</div> : null}
        <div className="admin-media-actions">
          <button
            type="button"
            className="admin-button admin-button-outline admin-button-small"
            disabled={busy || !alt.trim() || !title.trim()}
            onClick={() => save()}
          >
            {busy ? "Salvando…" : "Salvar metadados"}
          </button>
          <button
            type="button"
            className="admin-link-button"
            disabled={busy}
            onClick={() => save(!media.hidden)}
          >
            {media.hidden ? "Tornar visível na indexação" : "Ocultar indexação"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MediaLibrary() {
  const [items, setItems] = useState<CmsMedia[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      setItems(await apiCms<CmsMedia[]>("/media?includeHidden=1"));
      setStatus("ready");
    } catch (reason) {
      setError(displayError(reason));
      setStatus("error");
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const chooseFile = (candidate: File | null) => {
    setUploadMessage(null);
    setFile(candidate);
    if (candidate && !name) setName(candidate.name);
    if (!candidate) return;
    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
      candidate.type
    );
    const isPdf = candidate.type === "application/pdf";
    const max = isPdf ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    if ((!isImage && !isPdf) || candidate.size > max)
      setUploadMessage(
        isImage || isPdf
          ? `Arquivo acima do limite de ${isPdf ? "15 MB" : "5 MB"}.`
          : "Tipo não permitido. Use JPEG, PNG, WebP ou PDF; SVG não é aceito."
      );
  };
  const upload = async () => {
    if (!file || !name.trim() || !alt.trim() || !title.trim()) {
      setUploadMessage("Nome, texto alternativo e título são obrigatórios.");
      return;
    }
    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
      file.type
    );
    const isPdf = file.type === "application/pdf";
    const max = isPdf ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    if ((!isImage && !isPdf) || file.size > max) {
      setUploadMessage("Validação de tipo ou tamanho falhou antes do envio.");
      return;
    }
    setUploadBusy(true);
    setUploadMessage(null);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result || "");
          resolve(result.includes(",") ? result.split(",", 2)[1] : result);
        };
        reader.onerror = () =>
          reject(new Error("Não foi possível ler o arquivo local."));
        reader.readAsDataURL(file);
      });
      const created = await apiCms<CmsMedia>("/media/upload", "POST", {
        name: name.trim(),
        mime: file.type,
        base64,
        alt: alt.trim(),
        title: title.trim(),
      });
      setItems(current => [created, ...current]);
      setFile(null);
      setName("");
      setAlt("");
      setTitle("");
      setUploadMessage("Arquivo enviado pela API e adicionado à biblioteca.");
    } catch (reason) {
      setUploadMessage(displayError(reason));
    } finally {
      setUploadBusy(false);
    }
  };
  return (
    <div className="admin-content-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">CMS · arquivos</span>
          <h1>Biblioteca de mídia</h1>
          <p>
            Arquivos retornados e persistidos pelo endpoint CMS. Não envie dados
            confidenciais para arquivos públicos.
          </p>
        </div>
        <button
          type="button"
          className="admin-button admin-button-outline"
          onClick={() => void load()}
        >
          Atualizar lista
        </button>
      </div>
      <section className="admin-panel admin-upload-panel">
        <div className="admin-section-title-row">
          <div>
            <span className="admin-kicker">Upload validado</span>
            <h2>Novo arquivo</h2>
          </div>
        </div>
        <div className="admin-upload-grid">
          <label className="admin-file-input">
            <span>Arquivo *</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={event => chooseFile(event.target.files?.[0] || null)}
            />
            <small>
              JPEG, PNG, WebP até 5 MB; PDF até 15 MB. SVG não é permitido.
            </small>
          </label>
          <FieldText label="Nome *" value={name} onChange={setName} />
          <FieldText
            label="Texto alternativo *"
            value={alt}
            onChange={setAlt}
          />
          <FieldText label="Título *" value={title} onChange={setTitle} />
          <button
            type="button"
            className="admin-button admin-button-primary"
            disabled={uploadBusy || !file}
            onClick={() => void upload()}
          >
            {uploadBusy ? "Enviando…" : "Enviar arquivo"}
          </button>
        </div>
        {uploadMessage ? (
          <div className="admin-inline-message" role="status">
            {uploadMessage}
          </div>
        ) : null}
      </section>
      {status === "loading" ? (
        <LoadingPanel label="Carregando biblioteca…" />
      ) : status === "error" ? (
        <ErrorPanel
          message={error || "Erro ao carregar mídia."}
          onRetry={() => void load()}
        />
      ) : (
        <section className="admin-panel">
          <div className="admin-section-title-row">
            <div>
              <span className="admin-kicker">Índice real</span>
              <h2>{items.length} arquivo(s)</h2>
            </div>
          </div>
          <div className="admin-media-list">
            {items.map(media => (
              <MediaRow
                key={media.id}
                media={media}
                onSaved={updated =>
                  setItems(current =>
                    current.map(item =>
                      item.id === updated.id ? updated : item
                    )
                  )
                }
              />
            ))}
            {items.length === 0 ? (
              <div className="admin-empty">
                Nenhuma mídia foi retornada pela API.
              </div>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

function UsersList({ currentUser }: { currentUser: CmsUser }) {
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [busyOpenId, setBusyOpenId] = useState<string | null>(null);
  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setUsers(await apiCms<CmsUser[]>("/users"));
      setStatus("ready");
    } catch (reason) {
      setError(displayError(reason));
      setStatus("error");
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const grant = async (user: CmsUser, role: CmsRole | null) => {
    if (user.isOwner || user.id === currentUser.id) return;
    setBusyOpenId(user.openId);
    setError(null);
    try {
      const updated = await apiCms<CmsUser>("/users/access", "POST", {
        openId: user.openId,
        role,
      });
      setUsers(current =>
        current.map(item => (item.id === updated.id ? updated : item))
      );
    } catch (reason) {
      setError(displayError(reason));
    } finally {
      setBusyOpenId(null);
    }
  };
  return (
    <div className="admin-content-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">CMS · governança</span>
          <h1>Usuários autorizados</h1>
          <p>
            Identidades reais já reconhecidas pelo backend. A autorização não
            cria contas públicas.
          </p>
        </div>
        <button
          type="button"
          className="admin-button admin-button-outline"
          onClick={() => void load()}
        >
          Atualizar lista
        </button>
      </div>
      <div className="admin-panel admin-governance-note">
        <strong>Proteções do servidor</strong>
        <p>
          O owner e o administrador atual não podem ser removidos pela
          interface. A API também impede a perda do último administrador; o
          painel não tenta contornar essas regras.
        </p>
      </div>
      {error ? (
        <div className="admin-inline-error" role="alert">
          {error}
        </div>
      ) : null}
      {status === "loading" ? (
        <LoadingPanel label="Carregando identidades reais…" />
      ) : status === "error" ? (
        <ErrorPanel
          message={error || "Erro ao carregar usuários."}
          onRetry={() => void load()}
        />
      ) : (
        <div className="admin-panel admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Identidade</th>
                <th>OpenID</th>
                <th>Acesso CMS</th>
                <th>Proteção</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const protectedUser =
                  user.isOwner || user.id === currentUser.id;
                return (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name || "Nome não informado"}</strong>
                      <small>{user.email || "E-mail não informado"}</small>
                    </td>
                    <td>
                      <code>{user.openId}</code>
                    </td>
                    <td>
                      <select
                        value={user.role || "none"}
                        disabled={protectedUser || busyOpenId === user.openId}
                        onChange={event =>
                          void grant(
                            user,
                            event.target.value === "none"
                              ? null
                              : (event.target.value as CmsRole)
                          )
                        }
                      >
                        <option value="none">{ROLE_LABELS.none}</option>
                        <option value="editor">{ROLE_LABELS.editor}</option>
                        <option value="admin">{ROLE_LABELS.admin}</option>
                      </select>
                    </td>
                    <td>
                      {user.isOwner
                        ? "Owner protegido"
                        : user.id === currentUser.id
                          ? "Sua sessão atual"
                          : "Gerenciável"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 ? (
            <div className="admin-empty">
              Nenhuma identidade foi retornada pela API.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function AuditList() {
  const [items, setItems] = useState<CmsAudit[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setItems(await apiCms<CmsAudit[]>("/audit"));
      setStatus("ready");
    } catch (reason) {
      setError(displayError(reason));
      setStatus("error");
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <div className="admin-content-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">CMS · rastreabilidade</span>
          <h1>Auditoria</h1>
          <p>
            Eventos reais registrados pelo backend para ações editoriais e de
            acesso.
          </p>
        </div>
        <button
          type="button"
          className="admin-button admin-button-outline"
          onClick={() => void load()}
        >
          Atualizar auditoria
        </button>
      </div>
      {status === "loading" ? (
        <LoadingPanel label="Carregando auditoria…" />
      ) : status === "error" ? (
        <ErrorPanel
          message={error || "Erro ao carregar auditoria."}
          onRetry={() => void load()}
        />
      ) : (
        <div className="admin-panel admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Quando</th>
                <th>Ação</th>
                <th>Ator</th>
                <th>Documento</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{safeDate(item.createdAt)}</td>
                  <td>
                    <strong>{item.action}</strong>
                  </td>
                  <td>{item.actor}</td>
                  <td>{item.documentId ?? "—"}</td>
                  <td>{item.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? (
            <div className="admin-empty">
              Nenhum evento foi retornado pela API.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function AdminShell({
  user,
  route,
  documents,
  activeDocument,
  detailLoading,
  pageError,
  busy,
  notice,
  onCloseNotice,
  onNavigate,
  onOpenDocument,
  onCreate,
  onSave,
  onAction,
  onCloneLocale,
  onBackFromEditor,
  onRefreshDocuments,
}: {
  user: CmsUser;
  route: AdminRoute;
  documents: CmsDocument[];
  activeDocument: AdminDocument | null;
  detailLoading: boolean;
  pageError: string | null;
  busy: boolean;
  notice: Notice | null;
  onCloseNotice: () => void;
  onNavigate: (path: string, dirty?: boolean) => void;
  onOpenDocument: (id: number) => void;
  onCreate: (kind: CmsKind) => void;
  onSave: (document: AdminDocument) => Promise<AdminDocument>;
  onAction: (
    document: AdminDocument,
    action: "review" | "draft" | "publish" | "unpublish" | "archive"
  ) => Promise<AdminDocument>;
  onCloneLocale: (
    document: AdminDocument,
    locale: CmsLocale
  ) => Promise<AdminDocument>;
  onBackFromEditor: () => void;
  onRefreshDocuments: () => void;
}) {
  const [editorDirty, setEditorDirty] = useState(false);
  const navigateSafely = (path: string) =>
    onNavigate(path, editorDirty && route.section === "editor");
  const navItems = [
    { label: "Visão geral", path: "/admin" },
    { label: "Documentos", path: "/admin/documents" },
    { label: "Mídia", path: "/admin/media" },
    { label: "Auditoria", path: "/admin/audit" },
    ...(user.role === "admin"
      ? [{ label: "Usuários", path: "/admin/users" }]
      : []),
  ];
  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-brand-mark">O</span>
          <div>
            <strong>Onsmart.AI</strong>
            <span>CMS editorial</span>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Navegação do CMS">
          {navItems.map(item => (
            <button
              type="button"
              key={item.path}
              className={
                route.section === parseAdminRoute(item.path).section
                  ? "is-active"
                  : ""
              }
              onClick={() => navigateSafely(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-user">
          <span>{user.name || user.openId}</span>
          <small>{ROLE_LABELS[user.role || "none"]}</small>
        </div>
        <Link className="admin-site-link" href="/">
          Voltar ao site ↗
        </Link>
      </header>
      {notice ? <NoticeBanner notice={notice} onClose={onCloseNotice} /> : null}
      <main className="admin-main">
        {pageError && route.section !== "editor" ? (
          <ErrorPanel message={pageError} onRetry={onRefreshDocuments} />
        ) : null}
        {route.section === "overview" ? (
          <Overview
            documents={documents}
            onOpenDocuments={() => navigateSafely("/admin/documents")}
            onCreate={onCreate}
          />
        ) : null}
        {route.section === "documents" ? (
          <DocumentsList
            documents={documents}
            onOpen={onOpenDocument}
            onCreate={onCreate}
          />
        ) : null}
        {route.section === "media" ? <MediaLibrary /> : null}
        {route.section === "users" && user.role === "admin" ? (
          <UsersList currentUser={user} />
        ) : null}
        {route.section === "audit" ? <AuditList /> : null}
        {route.section === "users" && user.role !== "admin" ? (
          <ErrorPanel
            message="A gestão de usuários é exclusiva de administradores CMS."
            onRetry={() => navigateSafely("/admin")}
          />
        ) : null}
        {route.section === "editor" ? (
          detailLoading || !activeDocument ? (
            <LoadingPanel label="Carregando documento…" />
          ) : (
            <DocumentEditor
              initialDocument={activeDocument}
              currentUser={user}
              busy={busy}
              onSave={onSave}
              onAction={onAction}
              onCloneLocale={onCloneLocale}
              onBack={() => navigateSafely("/admin/documents")}
              onDirtyChange={setEditorDirty}
            />
          )
        ) : null}
      </main>
      <footer className="admin-footer">
        <span>CMS em homologação · dados e permissões vêm da API real</span>
        <Link href="/">Onsmart.AI</Link>
      </footer>
    </div>
  );
}

export default function Admin() {
  const [location, navigate] = useLocation();
  const route = useMemo(() => parseAdminRoute(location), [location]);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [authUser, setAuthUser] = useState<CmsUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<CmsDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<AdminDocument | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const loadMe = useCallback(async () => {
    setAuthStatus("loading");
    setAuthError(null);
    try {
      const user = await apiCms<CmsUser | null>("/me");
      setAuthUser(user);
      setAuthStatus(!user ? "login" : user.role ? "access" : "pending");
    } catch (reason) {
      setAuthStatus("error");
      setAuthError(displayError(reason));
    }
  }, []);
  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  const loadDocuments = useCallback(async () => {
    setPageError(null);
    try {
      setDocuments(await apiCms<CmsDocument[]>("/documents"));
    } catch (reason) {
      setPageError(displayError(reason));
    }
  }, []);
  useEffect(() => {
    if (authStatus === "access") void loadDocuments();
  }, [authStatus, loadDocuments]);

  useEffect(() => {
    if (authStatus !== "access" || route.section !== "editor") return;
    if (route.newKind) {
      setActiveDocument(makeBlankDocument(route.newKind));
      setDetailLoading(false);
      return;
    }
    if (!route.id) {
      navigate("/admin/documents");
      return;
    }
    let alive = true;
    setActiveDocument(null);
    setDetailLoading(true);
    setPageError(null);
    apiCms<CmsDocument>(`/documents/${route.id}`)
      .then(document => {
        if (alive) setActiveDocument(document);
      })
      .catch(reason => {
        if (alive) setPageError(displayError(reason));
      })
      .finally(() => {
        if (alive) setDetailLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [authStatus, route.section, route.id, route.newKind, navigate]);

  const handleLogin = async () => {
    startLogin();
  };
  const safeNavigate = (path: string, dirty = false) => {
    if (
      dirty &&
      typeof window !== "undefined" &&
      !window.confirm("Há alterações não salvas. Sair sem salvar?")
    )
      return;
    navigate(path);
  };
  const updateDocumentList = (document: CmsDocument) =>
    setDocuments(current => {
      const exists = current.some(item => item.id === document.id);
      return exists
        ? current.map(item => (item.id === document.id ? document : item))
        : [document, ...current];
    });
  const handleSave = async (
    document: AdminDocument
  ): Promise<AdminDocument> => {
    setBusy(true);
    setPageError(null);
    try {
      const body: CmsSaveRequest = {
        ...(document.id === undefined
          ? {}
          : { id: document.id, revision: document.revision }),
        key: document.key,
        kind: document.kind,
        locale: document.locale,
        slug: document.slug,
        payload: document.draft,
      };
      const saved = await apiCms<CmsDocument>("/documents", "POST", body);
      updateDocumentList(saved);
      setActiveDocument(saved);
      setNotice({
        tone: "success",
        text: "Rascunho salvo pela API. O snapshot publicado permanece intacto.",
      });
      return saved;
    } catch (reason) {
      setNotice({ tone: "error", text: displayError(reason) });
      throw reason;
    } finally {
      setBusy(false);
    }
  };
  const handleAction = async (
    document: AdminDocument,
    action: "review" | "draft" | "publish" | "unpublish" | "archive"
  ): Promise<AdminDocument> => {
    if (document.id === undefined)
      throw new Error("Salve o documento antes de executar esta ação.");
    setBusy(true);
    setPageError(null);
    try {
      const updated = await apiCms<CmsDocument>(
        `/documents/${document.id}/action`,
        "POST",
        { revision: document.revision, action }
      );
      updateDocumentList(updated);
      setActiveDocument(updated);
      setNotice({
        tone: "success",
        text:
          action === "publish"
            ? "Conteúdo publicado na homologação. O site público não foi lançado."
            : "Ação editorial concluída pela API.",
      });
      return updated;
    } catch (reason) {
      setNotice({ tone: "error", text: displayError(reason) });
      throw reason;
    } finally {
      setBusy(false);
    }
  };
  const handleCloneLocale = async (
    document: AdminDocument,
    locale: CmsLocale
  ): Promise<AdminDocument> => {
    setBusy(true);
    setPageError(null);
    try {
      const created = await apiCms<CmsDocument>("/documents", "POST", {
        key: document.key,
        kind: document.kind,
        locale,
        slug: document.slug,
        payload: cloneJson(document.draft),
      });
      updateDocumentList(created);
      setNotice({
        tone: "success",
        text: `Variante ${locale} criada como cópia para revisão humana.`,
      });
      navigate(`/admin/documents/${created.id}`);
      return created;
    } catch (reason) {
      setNotice({ tone: "error", text: displayError(reason) });
      throw reason;
    } finally {
      setBusy(false);
    }
  };

  if (authStatus !== "access" || !authUser)
    return (
      <AuthGate
        status={authStatus}
        user={authUser}
        error={authError}
        onLogin={handleLogin}
        onRetry={() => void loadMe()}
      />
    );
  return (
    <AdminShell
      user={authUser}
      route={route}
      documents={documents}
      activeDocument={activeDocument}
      detailLoading={detailLoading}
      pageError={pageError}
      busy={busy}
      notice={notice}
      onCloseNotice={() => setNotice(null)}
      onNavigate={safeNavigate}
      onOpenDocument={id => safeNavigate(`/admin/documents/${id}`)}
      onCreate={kind => safeNavigate(`/admin/documents/new/${kind}`)}
      onSave={handleSave}
      onAction={handleAction}
      onCloneLocale={handleCloneLocale}
      onBackFromEditor={() => safeNavigate("/admin/documents")}
      onRefreshDocuments={() => void loadDocuments()}
    />
  );
}
