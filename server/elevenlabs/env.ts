/**
 * ElevenLabs ConvAI — variáveis do servidor (mesmo conjunto do ONSMART.AI-WEBSITE).
 *
 * - ELEVENLABS_AGENT_ID: obrigatório para o widget de voz
 * - ELEVENLABS_VOICE_ID: opcional; `override-voice-id` no embed (overrides no painel ElevenLabs)
 * - ELEVENLABS_MODEL_ID: referência/documentação; o modelo TTS do agente é definido no painel ConvAI
 * - ELEVENLABS_SERVER_LOCATION: opcional (us | global | eu-residency | in-residency)
 * - ELEVENLABS_API_KEY: obrigatório para chat por texto (WebSocket) em agentes autenticados
 * - ELEVENLABS_WEBHOOK_SECRET: opcional para POST /api/elevenlabs/webhook
 */
export type ElevenLabsServerEnv = {
  agentId: string;
  apiKey: string;
  voiceId: string;
  modelId: string;
  serverLocation: string;
  webhookSecret: string;
};

export function readElevenLabsEnv(): ElevenLabsServerEnv {
  return {
    agentId: process.env.ELEVENLABS_AGENT_ID?.trim() ?? "",
    apiKey: process.env.ELEVENLABS_API_KEY?.trim() ?? "",
    voiceId: process.env.ELEVENLABS_VOICE_ID?.trim() ?? "",
    modelId: process.env.ELEVENLABS_MODEL_ID?.trim() ?? "",
    serverLocation: process.env.ELEVENLABS_SERVER_LOCATION?.trim() ?? "",
    webhookSecret: process.env.ELEVENLABS_WEBHOOK_SECRET?.trim() ?? "",
  };
}
