/** Remove marcadores de TTS/voz e markdown cru exibido no painel de texto. */
export function formatAgentChatText(raw: string): string {
  let text = raw.trim();
  text = text.replace(/^(?:\[[a-zA-Z][a-zA-Z0-9_-]*\]\s*)+/, "");
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  return text.trim();
}
