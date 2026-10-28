import {
  Conversation,
  TextConversation,
  VoiceConversation,
  WebRTCConnection,
  type PartialOptions,
} from "@elevenlabs/client";

let applied = false;
let useTextOnlyOnSignedWebsocket = false;

type WebRtcAudioAdapter = {
  audioElements: HTMLAudioElement[];
  attachRemoteTrack: (
    track: unknown,
    outputDeviceId: string | null
  ) => Promise<void>;
  __soniaDedupePatched?: boolean;
};

type WebRtcConnectionWithAdapter = {
  audioAdapter: WebRtcAudioAdapter | null;
  setupRoomEventListeners: () => void;
};

/**
 * LiveKit can subscribe to more than one agent audio track during startup
 * (e.g. speculative turn + first_message). Each subscription adds a hidden
 * <audio> element — same greeting plays twice. Keep only the latest track.
 */
function patchWebRtcAgentAudioDedupe(): void {
  if (typeof document === "undefined") return;

  const connectionProto = WebRTCConnection.prototype as unknown as WebRtcConnectionWithAdapter;
  const originalSetup = connectionProto.setupRoomEventListeners;
  connectionProto.setupRoomEventListeners = function (this: WebRtcConnectionWithAdapter) {
    originalSetup.call(this);
    const adapter = this.audioAdapter;
    if (!adapter || adapter.__soniaDedupePatched) return;
    adapter.__soniaDedupePatched = true;
    const originalAttach = adapter.attachRemoteTrack.bind(adapter);
    adapter.attachRemoteTrack = async (
      track: unknown,
      outputDeviceId: string | null
    ) => {
      for (const element of adapter.audioElements) {
        element.pause();
        element.remove();
      }
      adapter.audioElements.length = 0;
      return originalAttach(track, outputDeviceId);
    };
  };
}

type BaseConversationStatic = {
  getFullOptions: (partialOptions: PartialOptions) => PartialOptions;
};

const BaseConversation = Object.getPrototypeOf(
  VoiceConversation.prototype
).constructor as BaseConversationStatic;

/**
 * When false (default), strips `textOnly` so the SDK does not send a blocked
 * `text_only` override (ElevenLabs close 1008). When true, keeps `textOnly`
 * — requires ELEVENLABS_TEXT_ONLY_OVERRIDE=1 and allowing that override in the agent dashboard.
 */
export function setElevenLabsTextOnlySession(enabled: boolean): void {
  useTextOnlyOnSignedWebsocket = enabled;
}

/**
 * SDK `getFullOptions` always sets `overrides.conversation.text_only` from
 * `textOnly`. For voice (false) that override makes the agent reject the
 * session when chat/text_only rules differ — omit it for voice sessions.
 */
function patchGetFullOptionsForVoice(): void {
  const original = BaseConversation.getFullOptions.bind(BaseConversation);
  BaseConversation.getFullOptions = (partialOptions: PartialOptions) => {
    const full = original(partialOptions) as PartialOptions & {
      overrides?: {
        conversation?: { textOnly?: boolean; [key: string]: unknown };
        [key: string]: unknown;
      };
    };
    if (full.textOnly === false && full.overrides?.conversation) {
      const { textOnly: _omit, ...rest } = full.overrides.conversation;
      if (Object.keys(rest).length === 0) {
        delete full.overrides.conversation;
        if (Object.keys(full.overrides).length === 0) {
          delete full.overrides;
        }
      } else {
        full.overrides.conversation = rest;
      }
    }
    return full;
  };
}

/**
 * ElevenLabs client copies `textOnly: true` into `conversation_config_override.text_only`.
 * Many agents disallow that override in the dashboard (close 1008). Text websocket
 * sessions work without sending `text_only` when using TextConversation directly.
 */
export function applyElevenLabsTextSessionPatch(): void {
  if (applied) return;
  applied = true;
  patchGetFullOptionsForVoice();
  patchWebRtcAgentAudioDedupe();

  const originalStart = Conversation.startSession.bind(Conversation);
  Conversation.startSession = (async (options) => {
    const signedTextWebSocket =
      options.textOnly === true &&
      options.connectionType === "websocket" &&
      Boolean(options.signedUrl);

    if (signedTextWebSocket && useTextOnlyOnSignedWebsocket) {
      return TextConversation.startSession(
        options as Parameters<typeof TextConversation.startSession>[0]
      );
    }

    if (signedTextWebSocket) {
      const { textOnly: _omit, ...rest } = options;
      return TextConversation.startSession(
        rest as Parameters<typeof TextConversation.startSession>[0]
      );
    }

    return originalStart(options);
  }) as typeof Conversation.startSession;
}
