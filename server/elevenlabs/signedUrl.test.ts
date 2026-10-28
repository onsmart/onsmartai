import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchConvaiSignedUrl } from "./signedUrl";

describe("fetchConvaiSignedUrl", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns signed_url from ElevenLabs API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          signed_url: "wss://api.elevenlabs.io/v1/convai/conversation?agent_id=agent_test&token=abc",
        }),
      })
    );

    const url = await fetchConvaiSignedUrl("agent_test", "key_test");
    expect(url).toContain("wss://");
  });
});
