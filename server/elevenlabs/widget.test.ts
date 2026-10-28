import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { buildElevenLabsWidgetPayload, resolveElevenLabsLanguage } from "./widget";

describe("elevenlabs widget", () => {
  const prev = process.env.ELEVENLABS_AGENT_ID;

  afterEach(() => {
    process.env.ELEVENLABS_AGENT_ID = prev;
  });

  beforeEach(() => {
    delete process.env.ELEVENLABS_AGENT_ID;
  });

  it("returns degraded payload without agent id", () => {
    const payload = buildElevenLabsWidgetPayload("pt-BR");
    expect(payload.isConfigured).toBe(false);
    expect(payload.widgetHtml).toBe("");
    expect(payload.config.hasVoiceSupport).toBe(false);
  });

  it("builds widget html with agent id", () => {
    process.env.ELEVENLABS_AGENT_ID = "agent_test_123";
    const payload = buildElevenLabsWidgetPayload("en");
    expect(payload.isConfigured).toBe(true);
    expect(payload.widgetHtml).toContain('agent-id="agent_test_123"');
    expect(payload.widgetHtml).toContain('language="en"');
    expect(payload.widgetHtml).toContain('show-ui="false"');
    expect(payload.config.hasVoiceSupport).toBe(true);
  });

  it("adds override-voice-id when ELEVENLABS_VOICE_ID is set", () => {
    process.env.ELEVENLABS_AGENT_ID = "agent_test_123";
    process.env.ELEVENLABS_VOICE_ID = "33B4UnXyTNbgLmdEDh5P";
    const payload = buildElevenLabsWidgetPayload("pt-BR");
    expect(payload.widgetHtml).toContain(
      'override-voice-id="33B4UnXyTNbgLmdEDh5P"'
    );
    expect(payload.config.voiceOverride).toBe(true);
    delete process.env.ELEVENLABS_VOICE_ID;
  });

  it("maps locales", () => {
    expect(resolveElevenLabsLanguage("pt-BR")).toBe("pt-BR");
    expect(resolveElevenLabsLanguage("en")).toBe("en");
    expect(resolveElevenLabsLanguage("es")).toBe("es");
  });
});
