import { describe, expect, it, afterEach, beforeEach } from "vitest";
import { readElevenLabsEnv } from "./env";

describe("elevenlabs env", () => {
  const prevAgent = process.env.ELEVENLABS_AGENT_ID;
  const prevLocation = process.env.ELEVENLABS_SERVER_LOCATION;

  beforeEach(() => {
    delete process.env.ELEVENLABS_AGENT_ID;
    delete process.env.ELEVENLABS_SERVER_LOCATION;
  });

  afterEach(() => {
    process.env.ELEVENLABS_AGENT_ID = prevAgent;
    process.env.ELEVENLABS_SERVER_LOCATION = prevLocation;
  });

  it("reads agent id and server location", () => {
    process.env.ELEVENLABS_AGENT_ID = "agent_test";
    process.env.ELEVENLABS_SERVER_LOCATION = "global";
    const env = readElevenLabsEnv();
    expect(env.agentId).toBe("agent_test");
    expect(env.serverLocation).toBe("global");
  });
});
