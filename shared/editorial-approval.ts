import type { CmsDocument } from "./cms";

/** Conversation-authorized editorial record; never grants login or publish rights. */
export type EditorialApproval = {
  status: "approved";
  approvedRevision: number;
  confirmedAt: string;
  source: "explicit_user_confirmation";
};

export function hasCurrentEditorialApproval(
  document: Pick<
    CmsDocument,
    "kind" | "status" | "revision" | "draft" | "published"
  >
): boolean {
  const value = document.draft.fields.editorialApproval;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Partial<EditorialApproval>;
  return (
    document.kind === "article" &&
    document.status !== "archived" &&
    document.published === null &&
    record.status === "approved" &&
    record.source === "explicit_user_confirmation" &&
    record.approvedRevision === document.revision &&
    typeof record.confirmedAt === "string" &&
    !Number.isNaN(Date.parse(record.confirmedAt))
  );
}
