import { describe, expect, it } from "vitest";
import { cmsEmptyPayload } from "@shared/cms";
import {
  APPROVED_HOME_TITLE,
  APPROVED_MISSION,
  APPROVED_HOME_SUBTITLE,
  assertApprovedLocks,
  assertCmsCsrf,
  assertPublishable,
  CmsCsrfError,
  CmsValidationError,
  parseMediaUpload,
  parseCmsSaveRequest,
} from "./validation";

function request(headers: Record<string, string>) {
  return {
    protocol: "https",
    get(name: string) {
      return headers[name.toLowerCase()];
    },
  } as never;
}

describe("CMS backend validation", () => {
  it("accepts structured payloads and preserves the mandatory current copy", () => {
    const payload = {
      ...cmsEmptyPayload(),
      title: APPROVED_HOME_TITLE,
      summary: APPROVED_HOME_SUBTITLE,
      fields: {
        texts: [{ original: "MISSION", text: APPROVED_MISSION }],
      },
    };
    expect(parseCmsSaveRequest({ key: "/", kind: "page", locale: "pt-BR", slug: "home", payload })).toMatchObject({
      key: "/",
      locale: "pt-BR",
    });
    expect(() => assertApprovedLocks("/", { ...payload, fields: {heroTitle:"Alterado"} })).toThrow(CmsValidationError);
  });

  it("rejects unsafe rendered URLs and arbitrary HTML", () => {
    const payload = { ...cmsEmptyPayload(), title: "Página", imageUrl: "javascript:alert(1)" };
    expect(() => parseCmsSaveRequest({ key: "page", kind: "page", locale: "pt-BR", slug: "page", payload })).toThrow(
      "URL insegura",
    );
    expect(() => parseCmsSaveRequest({
      key: "page",
      kind: "page",
      locale: "pt-BR",
      slug: "page",
      payload: { ...cmsEmptyPayload(), title: "<script>alert(1)</script>" },
    })).toThrow("HTML arbitrário");
  });

  it("requires real editorial metadata before publishing an article", () => {
    expect(() => assertPublishable("article", { ...cmsEmptyPayload(), title: "Artigo" })).toThrow("autor");
    expect(() => assertPublishable("article", {
      ...cmsEmptyPayload(),
      title: "Artigo",
      author: "Autoria verificada",
      publishedAt: "2026-10-21T00:00:00.000Z",
    })).toThrow("corpo");
  });

  it("accepts only the supported upload MIME/name combinations", () => {
    expect(parseMediaUpload({ name: "manual.pdf", mime: "application/pdf", base64: "JVBERi0x", alt: "", title: "" })).toMatchObject({
      mime: "application/pdf",
    });
    expect(() => parseMediaUpload({ name: "payload.svg", mime: "image/svg+xml", base64: "PHN2Zz4=", alt: "", title: "" })).toThrow(
      "mime não permitido",
    );
    expect(() => parseMediaUpload({ name: "manual.png", mime: "application/pdf", base64: "JVBERi0x", alt: "", title: "" })).toThrow(
      "name não corresponde",
    );
  });

  it("requires the custom header and exact same-origin for browser mutations", () => {
    expect(() => assertCmsCsrf(request({ origin: "https://app.example", host: "app.example", "x-cms-request": "1" }))).not.toThrow();
    expect(() => assertCmsCsrf(request({ origin: "https://evil.example", host: "app.example", "x-cms-request": "1" }))).toThrow(CmsCsrfError);
    expect(() => assertCmsCsrf(request({ origin: "https://app.example", host: "app.example" }))).toThrow(CmsCsrfError);
    expect(() => assertCmsCsrf(request({ "x-cms-request": "1" }))).not.toThrow();
  });
});
