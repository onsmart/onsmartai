import { getElevenLabsSignedUrlUrl } from "./apiUrls";

export class ElevenLabsSignedUrlError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function fetchElevenLabsSignedUrl(): Promise<string> {
  const response = await fetch(getElevenLabsSignedUrlUrl(), {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new ElevenLabsSignedUrlError(
      response.status,
      `signed-url-${response.status}`
    );
  }

  const payload = (await response.json()) as { signedUrl?: string };
  const signedUrl = payload.signedUrl?.trim();
  if (!signedUrl) {
    throw new ElevenLabsSignedUrlError(502, "signed-url-empty");
  }
  return signedUrl;
}
