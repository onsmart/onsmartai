import { Conversation, TextConversation } from "@elevenlabs/react";

let applied = false;

/**
 * ElevenLabs client copies `textOnly: true` into `conversation_config_override.text_only`.
 * Many agents disallow that override in the dashboard (close 1008). Text websocket
 * sessions work without sending `text_only` when using TextConversation directly.
 */
export function applyElevenLabsTextSessionPatch(): void {
  if (applied) return;
  applied = true;

  const originalStart = Conversation.startSession.bind(Conversation);
  Conversation.startSession = (async (options) => {
    const signedTextWebSocket =
      options.textOnly === true &&
      options.connectionType === "websocket" &&
      Boolean(options.signedUrl);

    if (signedTextWebSocket) {
      const { textOnly: _omit, ...rest } = options;
      return TextConversation.startSession(
        rest as Parameters<typeof TextConversation.startSession>[0]
      );
    }

    return originalStart(options);
  }) as typeof Conversation.startSession;
}
