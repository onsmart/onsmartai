import { SoniaCharacter } from "@/components/site/BrandMedia";
import { useState } from "react";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import SoniaChatPanel from "./SoniaChatPanel";
import "./sonia-chat.css";

export default function SoniaChat() {
  const { t } = useSiteCopy();
  const [open, setOpen] = useState(false);

  return (
    <>
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

      {open ? <SoniaChatPanel onClose={() => setOpen(false)} /> : null}
    </>
  );
}
