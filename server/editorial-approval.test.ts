import { describe, it, expect } from "vitest";
import { hasCurrentEditorialApproval } from "../shared/editorial-approval";
import { cmsEmptyPayload, type CmsDocument } from "../shared/cms";
const approvedDocument: Pick<
  CmsDocument,
  "kind" | "status" | "revision" | "draft" | "published"
> = {
  kind: "article",
  status: "draft",
  revision: 2,
  published: null,
  draft: {
    ...cmsEmptyPayload(),
    fields: {
      editorialApproval: {
        status: "approved",
        source: "explicit_user_confirmation",
        approvedRevision: 2,
        confirmedAt: "2026-10-23T16:55:50-03:00",
      },
    },
  },
};
describe("editorial approval record", () => {
  it("recognizes the current editorial approval without changing publication status", () => {
    expect(hasCurrentEditorialApproval(approvedDocument)).toBe(true);
    expect(approvedDocument.status).toBe("draft");
    expect(approvedDocument.published).toBe(null);
  });
  it("does not carry an approval forward to a new revision", () => {
    expect(
      hasCurrentEditorialApproval({ ...approvedDocument, revision: 3 })
    ).toBe(false);
  });
  it("does not show a pending-publication badge for published, archived, or unapproved documents", () => {
    expect(
      hasCurrentEditorialApproval({
        ...approvedDocument,
        published: cmsEmptyPayload(),
        status: "published",
      })
    ).toBe(false);
    expect(
      hasCurrentEditorialApproval({ ...approvedDocument, status: "archived" })
    ).toBe(false);
    expect(
      hasCurrentEditorialApproval({
        ...approvedDocument,
        draft: cmsEmptyPayload(),
      })
    ).toBe(false);
  });
});
