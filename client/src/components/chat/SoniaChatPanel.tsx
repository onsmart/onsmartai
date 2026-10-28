import {
  ConversationProvider,
  useConversation,
  type HookOptions,
} from "@elevenlabs/react";
import { SoniaCharacter } from "@/components/site/BrandMedia";
import {
  fetchElevenLabsAgentConfig,
  type ElevenLabsAgentConfig,
} from "@/lib/elevenlabsConfigService";
import {
  ElevenLabsSignedUrlError,
  fetchElevenLabsSignedUrl,
} from "@/lib/elevenlabsSignedUrl";
import { elevenLabsLanguage } from "@/lib/elevenlabsLocale";
import { applyElevenLabsTextSessionPatch } from "@/lib/elevenlabsTextSessionPatch";

applyElevenLabsTextSessionPatch();
import { useLocale } from "@/i18n/LocaleProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Keyboard, Mic, MicOff, RotateCcw, Send, X } from "lucide-react";
import {
  soniaChatDebug,
  soniaChatError,
  soniaChatWarn,
} from "./soniaChatLog";
import { formatAgentChatText } from "./formatAgentChatText";
import { useStableVoiceStatus } from "./useStableVoiceStatus";

type ChatMode = "voice" | "text";
type MessageRole = "user" | "agent";

type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
};

type ElevenLabsMessage = {
  message?: string;
  text?: string;
  transcript?: string;
  role?: MessageRole;
  source?: "user" | "agent" | "ai";
  event_id?: number;
};

function voiceSessionOverrides(
  config: ElevenLabsAgentConfig,
  locale: ReturnType<typeof useLocale>["locale"]
) {
  const language = elevenLabsLanguage(locale);
  return {
    agent: { language },
    ...(config.voiceId ? { tts: { voiceId: config.voiceId } } : {}),
  };
}

function sessionLocationOptions(config: ElevenLabsAgentConfig) {
  return config.serverLocation
    ? { serverLocation: config.serverLocation }
    : {};
}

function SoniaChatPanelInner({ onClose }: { onClose: () => void }) {
  const { t } = useSiteCopy();
  const { locale } = useLocale();
  const listRef = useRef<HTMLDivElement>(null);
  const pendingTextRef = useRef<string | null>(null);
  const agentStreamIdRef = useRef<string | null>(null);
  const agentStreamBufferRef = useRef("");

  const [config, setConfig] = useState<ElevenLabsAgentConfig | null>(null);
  const [mode, setMode] = useState<ChatMode>("text");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isStartingVoice, setIsStartingVoice] = useState(false);
  const [isStartingText, setIsStartingText] = useState(false);
  const textSessionLockRef = useRef(false);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const awaitingReplyRef = useRef(false);
  const [isAwaitingAgentReply, setIsAwaitingAgentReply] = useState(false);
  const [hasBegunTextChat, setHasBegunTextChat] = useState(false);
  awaitingReplyRef.current = isAwaitingAgentReply;
  const hasBegunTextChatRef = useRef(false);
  hasBegunTextChatRef.current = hasBegunTextChat;
  const localWelcomeShownRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  const normalizeAgentText = useCallback(
    (role: MessageRole, text: string) =>
      role === "agent" ? formatAgentChatText(text) : text.trim(),
    []
  );

  const appendMessage = useCallback(
    (role: MessageRole, text: string, eventId?: number) => {
      const trimmed = normalizeAgentText(role, text);
      if (!trimmed) return;
      setMessages((current) => {
        const last = current[current.length - 1];
        if (last?.role === role && last.text === trimmed) return current;
        const next = [
          ...current,
          {
            id: `${role}-${eventId ?? Date.now()}-${current.length}`,
            role,
            text: trimmed,
          },
        ];
        messagesRef.current = next;
        return next;
      });
    },
    [normalizeAgentText]
  );

  const userMessageInThread = useCallback(
    () => messagesRef.current.some((message) => message.role === "user"),
    []
  );

  const shouldIgnorePreUserAgentMessage = useCallback(() => {
    if (userMessageInThread()) return false;
    return messagesRef.current.some((message) => message.role === "agent");
  }, [userMessageInThread]);

  const upsertStreamingAgentMessage = useCallback((text: string) => {
    const trimmed = formatAgentChatText(text);
    if (!trimmed) return;
    const streamId =
      agentStreamIdRef.current ?? `agent-stream-${Date.now()}`;
    agentStreamIdRef.current = streamId;
    setMessages((current) => {
      const index = current.findIndex((m) => m.id === streamId);
      if (index >= 0) {
        const next = [...current];
        next[index] = { ...next[index], text: trimmed };
        return next;
      }
      return [...current, { id: streamId, role: "agent", text: trimmed }];
    });
  }, []);

  const finalizeAgentStream = useCallback(() => {
    agentStreamIdRef.current = null;
    agentStreamBufferRef.current = "";
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      setIsStartingVoice(false);
      if (
        modeRef.current !== "text" ||
        !hasBegunTextChatRef.current ||
        localWelcomeShownRef.current
      ) {
        return;
      }
      localWelcomeShownRef.current = true;
      appendMessage("agent", t("sonia.welcomeMessage"));
    },
    onDisconnect: (details) => {
      soniaChatDebug("Sessão ElevenLabs encerrada.", details);
      const reason = details?.reason;
      if (
        awaitingReplyRef.current &&
        modeRef.current === "text" &&
        reason !== "user"
      ) {
        soniaChatWarn(
          "Sessão de texto encerrada antes da resposta do agente.",
          details
        );
      }
      pendingTextRef.current = null;
      setIsStartingVoice(false);
      setIsStartingText(false);
      setIsAwaitingAgentReply(false);
    },
    onError: (message) => {
      pendingTextRef.current = null;
      setIsStartingVoice(false);
      setIsAwaitingAgentReply(false);
      soniaChatError(message?.trim() || "Falha na conversa com a SON.IA.");
    },
    onMessage: (payload: ElevenLabsMessage) => {
      const raw =
        payload.message ?? payload.text ?? payload.transcript ?? "";
      if (!raw.trim()) return;
      const role: MessageRole =
        payload.role ??
        (payload.source === "user" ? "user" : "agent");
      if (role === "agent" && shouldIgnorePreUserAgentMessage()) {
        return;
      }
      finalizeAgentStream();
      setIsAwaitingAgentReply(false);
      appendMessage(role, raw, payload.event_id);
    },
    onDebug: (event) => {
      const record = event as { type?: string };
      if (record.type === "error" || record.type === "invalid_event") {
        soniaChatError("ElevenLabs reportou erro na sessão.", event);
      } else {
        soniaChatDebug("Evento ElevenLabs.", event);
      }
    },
    onAgentChatResponsePart: (part) => {
      if (!userMessageInThread()) return;
      const chunk = part.text ?? "";
      const partType = String(part.type ?? "").toLowerCase();
      if (partType === "start") {
        setIsAwaitingAgentReply(false);
        agentStreamBufferRef.current = "";
        agentStreamIdRef.current = `agent-stream-${Date.now()}`;
        return;
      }
      if (partType === "delta") {
        agentStreamBufferRef.current += chunk;
        upsertStreamingAgentMessage(agentStreamBufferRef.current);
        return;
      }
      if (partType === "stop") {
        if (chunk) {
          agentStreamBufferRef.current += chunk;
        }
        upsertStreamingAgentMessage(agentStreamBufferRef.current);
        finalizeAgentStream();
        setIsAwaitingAgentReply(false);
      }
    },
  });

  const sentPendingIdRef = useRef<string | null>(null);

  const flushPendingUserText = useCallback(() => {
    if (modeRef.current !== "text") return;
    const pending = pendingTextRef.current;
    if (!pending) return;
    if (sentPendingIdRef.current === pending) return;
    sentPendingIdRef.current = pending;
    pendingTextRef.current = null;
    setIsAwaitingAgentReply(true);
    try {
      conversation.sendUserMessage(pending);
      soniaChatDebug("Mensagem de texto enviada à sessão ElevenLabs.");
    } catch (error) {
      sentPendingIdRef.current = null;
      pendingTextRef.current = pending;
      setIsAwaitingAgentReply(false);
      soniaChatError("Não foi possível enviar a mensagem de texto.", error);
    }
  }, [conversation]);

  const status = conversation.status;
  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const isPendingConnection =
    isConnecting || isStartingVoice || isStartingText;
  const canEndSession = isConnected || isPendingConnection;

  const voiceActive = isConnected && mode === "voice";
  const stableVoice = useStableVoiceStatus(
    voiceActive,
    conversation.isSpeaking,
    conversation.isListening
  );

  useEffect(() => {
    let active = true;
    void fetchElevenLabsAgentConfig()
      .then((next) => {
        if (!active) return;
        setConfig(next);
        if (next.configured && next.textChatReady === false) {
          soniaChatWarn(t("sonia.textChatAuthRequired"));
        }
      })
      .catch((error) => {
        if (active) {
          soniaChatError("Não foi possível carregar /api/elevenlabs-config.", error);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, mode]);

  useEffect(() => {
    if (!isConnected || mode !== "text") return;
    flushPendingUserText();
  }, [isConnected, mode, flushPendingUserText]);

  useEffect(() => {
    return () => {
      if (import.meta.hot) {
        return;
      }
      conversation.endSession();
    };
  }, [conversation]);

  const endSession = useCallback(() => {
    conversation.endSession();
    setIsStartingVoice(false);
  }, [conversation]);

  const resetTextChatFlow = useCallback(() => {
    setHasBegunTextChat(false);
    hasBegunTextChatRef.current = false;
    localWelcomeShownRef.current = false;
  }, []);

  const restartConversation = () => {
    endSession();
    pendingTextRef.current = null;
    sentPendingIdRef.current = null;
    finalizeAgentStream();
    resetTextChatFlow();
    messagesRef.current = [];
    setMessages([]);
    setDraft("");
  };

  const selectMode = (next: ChatMode) => {
    if (next === mode) return;
    if (isConnected || isConnecting) endSession();
    pendingTextRef.current = null;
    setMode(next);
    resetTextChatFlow();
    messagesRef.current = [];
    setMessages([]);
    setDraft("");
  };

  const beginTextChat = async () => {
    if (!config?.configured || hasBegunTextChat || isPendingConnection) return;
    setHasBegunTextChat(true);
    hasBegunTextChatRef.current = true;
    const ok = await startTextSession();
    if (!ok) {
      resetTextChatFlow();
    }
  };

  const startTextSession = async (): Promise<boolean> => {
    if (!config?.agentId) return false;
    if (isConnected) {
      flushPendingUserText();
      return true;
    }
    if (isConnecting || isStartingText) return true;
    if (textSessionLockRef.current) return true;

    textSessionLockRef.current = true;
    setIsStartingText(true);
    try {
      const signedUrl = await fetchElevenLabsSignedUrl();
      conversation.startSession({
        signedUrl,
        connectionType: "websocket",
        textOnly: true,
      });
      return true;
    } catch (error) {
      pendingTextRef.current = null;
      setIsAwaitingAgentReply(false);
      if (
        error instanceof ElevenLabsSignedUrlError &&
        error.status === 503
      ) {
        soniaChatError(t("sonia.textChatAuthRequired"));
      } else {
        soniaChatError(t("sonia.voiceUnavailableNetwork"), error);
      }
      return false;
    } finally {
      textSessionLockRef.current = false;
      setIsStartingText(false);
    }
  };

  const startVoice = async () => {
    if (!config?.agentId) return;
    if (isConnected || isConnecting || isStartingVoice) return;

    setIsStartingVoice(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(t("sonia.micError"));
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const voiceOptions: HookOptions = {
        agentId: config.agentId,
        connectionType: "webrtc",
        textOnly: false,
        ...sessionLocationOptions(config),
        overrides: voiceSessionOverrides(config, locale),
      };
      conversation.startSession(voiceOptions);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("sonia.micError");
      window.alert(message);
      setIsStartingVoice(false);
    }
  };

  const toggleSession = () => {
    if (canEndSession) {
      endSession();
      return;
    }
    if (mode === "voice") {
      void startVoice();
    } else {
      void startTextSession();
    }
  };

  const sendUserText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !hasBegunTextChat) return;

      appendMessage("user", trimmed);
      setIsAwaitingAgentReply(true);

      if (!isConnected) {
        if (isPendingConnection) return;
        pendingTextRef.current = trimmed;
        void startTextSession();
        return;
      }

      try {
        conversation.sendUserMessage(trimmed);
        soniaChatDebug("Mensagem de texto enviada à sessão ElevenLabs.");
      } catch (error) {
        setIsAwaitingAgentReply(false);
        soniaChatError("Não foi possível enviar a mensagem de texto.", error);
      }
    },
    [
      appendMessage,
      conversation,
      hasBegunTextChat,
      isConnected,
      isPendingConnection,
      startTextSession,
    ]
  );

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    sendUserText(trimmed);
    setDraft("");
  };

  const voiceStatusDetail =
    stableVoice === "speaking"
      ? t("sonia.speaking")
      : stableVoice === "listening"
        ? t("sonia.listening")
        : null;

  const statusLabel = isPendingConnection
    ? t("sonia.connecting")
    : voiceActive
      ? voiceStatusDetail ?? t("sonia.voiceInCall")
      : isConnected && mode === "text"
        ? t("sonia.textConnectedHelp")
        : isConnected
          ? t("sonia.statusReady")
          : t("sonia.statusReady");

  return (
    <div
      className="sonia-chat-panel"
      role="dialog"
      aria-label={t("sonia.title")}
    >
      <header className="sonia-chat-header">
        <div className="sonia-chat-header-main">
          <SoniaCharacter decorative className="sonia-chat-avatar" />
          <div className="sonia-chat-header-text">
            <h2>{t("sonia.title")}</h2>
            <p className="sonia-chat-status">{statusLabel}</p>
          </div>
          <span className="sonia-chat-online sonia-chat-online--header" />
        </div>
        <div className="sonia-chat-header-actions">
          <button
            type="button"
            className="sonia-chat-icon-btn"
            aria-label={t("sonia.restart")}
            title={t("sonia.restart")}
            onClick={restartConversation}
            disabled={isConnecting || isStartingVoice}
          >
            <RotateCcw size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="sonia-chat-icon-btn"
            aria-label={t("sonia.close")}
            onClick={() => {
              endSession();
              onClose();
            }}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="sonia-chat-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "voice"}
          className={`sonia-chat-tab ${mode === "voice" ? "is-active" : ""}`}
          onClick={() => selectMode("voice")}
        >
          <Mic size={16} aria-hidden="true" />
          {t("sonia.voiceTab")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "text"}
          className={`sonia-chat-tab ${mode === "text" ? "is-active" : ""}`}
          onClick={() => selectMode("text")}
        >
          <Keyboard size={16} aria-hidden="true" />
          {t("sonia.chatTab")}
        </button>
      </div>

      <div className="sonia-chat-body">
        {mode === "voice" ? (
          <div className="sonia-voice-pane">
            <div className="sonia-voice-pane-center">
              <div
                className={`sonia-voice-mic-ring ${
                  voiceActive && !conversation.isMuted
                    ? stableVoice === "speaking"
                      ? "is-speaking"
                      : "is-listening"
                    : ""
                }`}
              >
                {conversation.isMuted ? (
                  <MicOff size={48} aria-hidden="true" />
                ) : (
                  <Mic size={48} aria-hidden="true" />
                )}
              </div>
              <h3 className="sonia-voice-title">
                {isConnecting || isStartingVoice
                  ? t("sonia.connecting")
                  : voiceActive
                    ? t("sonia.voiceInCall")
                    : t("sonia.audioTitle")}
              </h3>
              <p className="sonia-voice-help">
                {voiceActive
                  ? voiceStatusDetail ?? t("sonia.audioConnectedHelp")
                  : t("sonia.audioStartHelp")}
              </p>
            </div>
            <div className="sonia-voice-actions">
              {isConnected ? (
                <button
                  type="button"
                  className="sonia-chat-secondary-btn"
                  onClick={() => conversation.setMuted(!conversation.isMuted)}
                >
                  {conversation.isMuted ? (
                    <>
                      <Mic size={16} aria-hidden="true" />
                      {t("sonia.unmute")}
                    </>
                  ) : (
                    <>
                      <MicOff size={16} aria-hidden="true" />
                      {t("sonia.mute")}
                    </>
                  )}
                </button>
              ) : null}
              <button
                type="button"
                className={`sonia-chat-primary-btn ${canEndSession ? "is-end" : ""}`}
                onClick={toggleSession}
                disabled={!config?.configured && !canEndSession}
              >
                {canEndSession
                  ? t("sonia.endConversation")
                  : t("sonia.startConversation")}
              </button>
            </div>
          </div>
        ) : (
          <div className="sonia-text-pane">
            <div ref={listRef} className="sonia-message-list">
              {!hasBegunTextChat ? (
                <div className="sonia-message-empty sonia-begin-chat">
                  <p className="sonia-text-hint">{t("sonia.textBeginIntro")}</p>
                  <button
                    type="button"
                    className="sonia-chat-primary-btn sonia-begin-chat-btn"
                    onClick={() => void beginTextChat()}
                    disabled={!config?.configured || isPendingConnection}
                  >
                    {isPendingConnection
                      ? t("sonia.connecting")
                      : t("sonia.startConversation")}
                  </button>
                </div>
              ) : messages.length === 0 && isPendingConnection ? (
                <p className="sonia-typing" role="status">
                  {t("sonia.connecting")}
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`sonia-message-row ${message.role === "user" ? "is-user" : "is-agent"}`}
                  >
                    <div className="sonia-message-bubble">{message.text}</div>
                  </div>
                ))
              )}
              {hasBegunTextChat && isAwaitingAgentReply ? (
                <p className="sonia-typing" role="status">{t("sonia.typing")}</p>
              ) : null}
            </div>
            <form className="sonia-input-row" onSubmit={sendMessage}>
              <input
                type="text"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (isConnected) conversation.sendUserActivity();
                }}
                placeholder={t("sonia.inputPlaceholder")}
                aria-label={t("sonia.inputPlaceholder")}
                disabled={
                  !config?.configured ||
                  !hasBegunTextChat ||
                  isPendingConnection
                }
              />
              <button
                type="submit"
                className="sonia-send-btn"
                aria-label={t("sonia.send")}
                disabled={
                  !hasBegunTextChat ||
                  !draft.trim() ||
                  !config?.configured ||
                  isPendingConnection
                }
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SoniaChatPanel({ onClose }: { onClose: () => void }) {
  return (
    <ConversationProvider>
      <SoniaChatPanelInner onClose={onClose} />
    </ConversationProvider>
  );
}
