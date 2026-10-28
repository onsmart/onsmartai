type VercelLikeResponse = {
  status: (code: number) => VercelLikeResponse;
  json: (body: unknown) => void;
};

export default function handler(
  _req: unknown,
  res: VercelLikeResponse
) {
  res.status(200).json({
    status: "ok",
    runtime: "vercel",
    elevenlabs: {
      agentIdSet: Boolean(process.env.ELEVENLABS_AGENT_ID?.trim()),
      apiKeySet: Boolean(process.env.ELEVENLABS_API_KEY?.trim()),
    },
  });
}
