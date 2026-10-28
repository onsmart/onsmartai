import { useEffect, useRef } from "react";
import { CALENDLY_MEETING_URL } from "@shared/contact";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

const WIDGET_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

function loadCalendlyScript(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  const existing = document.querySelector(`script[src="${WIDGET_SCRIPT}"]`);
  if (existing) {
    return new Promise(resolve => {
      if (window.Calendly) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Calendly script failed to load"));
    document.head.appendChild(script);
  });
}

type Props = {
  url?: string;
  className?: string;
  minHeight?: number;
};

export default function CalendlyInline({
  url = CALENDLY_MEETING_URL,
  className = "",
  minHeight = 700,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    loadCalendlyScript()
      .then(() => {
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = "";
        window.Calendly?.initInlineWidget({
          url,
          parentElement: hostRef.current,
        });
      })
      .catch(() => {
        if (cancelled || !hostRef.current) return;
        hostRef.current.innerHTML = "";
      });

    return () => {
      cancelled = true;
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, [url]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ minHeight: `${minHeight}px`, width: "100%" }}
      aria-label="Agenda de reuniões"
    />
  );
}
