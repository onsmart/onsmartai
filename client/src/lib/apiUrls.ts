export function getElevenLabsWidgetUrl(locale?: string): string {
  const base = "/api/elevenlabs-widget";
  if (!locale) return base;
  return `${base}?locale=${encodeURIComponent(locale)}`;
}

export function getElevenLabsConfigUrl(): string {
  return "/api/elevenlabs-config";
}

export function getElevenLabsSignedUrlUrl(): string {
  return "/api/elevenlabs-signed-url";
}

export function getElevenLabsConversationTokenUrl(): string {
  return "/api/elevenlabs-conversation-token";
}
