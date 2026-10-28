import { ConversationProvider } from "@elevenlabs/react";
import { SoniaCharacter } from "@/components/site/BrandMedia";
import { useState } from "react";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { SoniaChatPanelInner } from "./SoniaChatPanel";
import "./sonia-chat.css";

export default function SoniaChat() {
  const { t } = useSiteCopy();
  const [open, setOpen] = useState(false);

  return (
    <ConversationProvider>
      {!open && (
        <button
          type="button"
          className="sonia-chat-launcher"
          aria-label={t("a11y.openSonia")}
          aria-expanded={false}
          onClick={() => setOpen(true)}
        >
          <SoniaCharacter decorative className="sonia-chat-launcher-avatar" />
          <span className="sonia-chat-launcher-label">{t("sonia.title")}</span>
          <span className="sonia-chat-online" aria-hidden="true" />
        </button>
      )}

      {open ? (
        <SoniaChatPanelInner onClose={() => setOpen(false)} />
      ) : null}
    </ConversationProvider>
  );
}
