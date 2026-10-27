import { SoniaCharacter } from "./BrandMedia";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, MessageSquare, X } from "lucide-react";
import { Link } from "wouter";
import { translatePath, useSiteCopy } from "@/i18n/useSiteCopy";
import { useLocale } from "@/i18n/LocaleProvider";

export default function SoniaDemo() {
  const { t } = useSiteCopy();
  const { locale } = useLocale();
  const whatsapp = `https://wa.me/5511930683562?text=${encodeURIComponent(
    translatePath(locale, "whatsapp.defaultMessage")
  )}`;
  const suggestions = [
    {
      label: t("sonia.suggestion1Label"),
      text: t("sonia.suggestion1Text"),
      href: "/servicos",
      cta: t("sonia.suggestion1Cta"),
    },
    {
      label: t("sonia.suggestion2Label"),
      text: t("sonia.suggestion2Text"),
      href: "/servicos/sonia",
      cta: t("sonia.suggestion2Cta"),
    },
    {
      label: t("sonia.suggestion3Label"),
      text: t("sonia.suggestion3Text"),
      href: whatsapp,
      cta: t("sonia.suggestion3Cta"),
    },
  ];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="sonia-floating"
        aria-label={t("a11y.openSonia")}
      >
        <SoniaCharacter decorative className="floating-sonia-character" />
        <span>{t("sonia.title")}</span>
        <span className="floating-dot" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay sonia-overlay" />
        <Dialog.Content className="sonia-dialog">
          <Dialog.Close
            className="dialog-close"
            aria-label={t("sonia.close")}
          >
            <X size={22} />
          </Dialog.Close>
          <div className="sonia-dialog-header">
            <SoniaCharacter decorative />
            <div>
              <Dialog.Title>{t("sonia.title")}</Dialog.Title>
              <Dialog.Description>{t("sonia.subtitle")}</Dialog.Description>
            </div>
          </div>
          <div className="sonia-suggestions">
            {suggestions.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={selected === index ? "is-active" : ""}
                onClick={() => setSelected(index)}
              >
                <MessageSquare size={16} aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div className="sonia-response">
              <p>{suggestions[selected].text}</p>
              {suggestions[selected].href.startsWith("http") ? (
                <a
                  className="button button-primary"
                  href={suggestions[selected].href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {suggestions[selected].cta}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ) : (
                <Link
                  className="button button-primary"
                  href={suggestions[selected].href}
                  onClick={() => setOpen(false)}
                >
                  {suggestions[selected].cta}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
