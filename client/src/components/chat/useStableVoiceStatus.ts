import { useEffect, useRef, useState } from "react";

export type StableVoiceStatus = "idle" | "speaking" | "listening";

const SPEAKING_HOLD_MS = 550;

/**
 * Evita flicker na UI quando o SDK alterna isSpeaking/isListening a cada frame de VAD.
 */
export function useStableVoiceStatus(
  active: boolean,
  isSpeaking: boolean,
  isListening: boolean
): StableVoiceStatus {
  const [stable, setStable] = useState<StableVoiceStatus>("idle");
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakingRef = useRef(isSpeaking);

  speakingRef.current = isSpeaking;

  useEffect(() => {
    if (!active) {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
      setStable("idle");
      return;
    }

    if (isSpeaking) {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
      setStable("speaking");
      return;
    }

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      holdTimerRef.current = null;
      if (speakingRef.current) return;
      setStable(isListening ? "listening" : "listening");
    }, SPEAKING_HOLD_MS);

    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, [active, isSpeaking, isListening]);

  return stable;
}
