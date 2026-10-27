import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";

type ConsentValue = {
  version: 1;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
};
export default function Consent({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useSiteCopy();
  const { href: cmsHref } = useCmsCopy();
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const parsed = JSON.parse(
        localStorage.getItem("onsmart-consent-v1") || "null"
      );
      if (
        parsed?.version === 1 &&
        typeof parsed.analytics === "boolean" &&
        typeof parsed.marketing === "boolean"
      )
        setConsent(parsed);
    } catch {
      /* Preferências opcionais quando o navegador bloqueia storage. */
    }
    setLoaded(true);
  }, []);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);
  const [storageNotice, setStorageNotice] = useState("");
  useEffect(() => {
    if (open) {
      setAnalytics(consent?.analytics ?? false);
      setMarketing(consent?.marketing ?? false);
    }
  }, [open, consent]);
  function save(a: boolean, m: boolean) {
    const value: ConsentValue = {
      version: 1,
      essential: true,
      analytics: a,
      marketing: m,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("onsmart-consent-v1", JSON.stringify(value));
    } catch {
      setStorageNotice(t("consent.storageBlocked"));
    }
    setConsent(value);
    setAnalytics(a);
    setMarketing(m);
    onOpenChange(false);
  }
  return (
    <>
      {loaded && !consent && !open && (
        <aside className="cookie-banner" aria-label={t("consent.bannerLabel")}>
          <div className="cookie-heading">
            <ShieldCheck size={18} />
            <strong>{t("consent.bannerTitle")}</strong>
          </div>
          <p>{t("consent.bannerBody")}</p>
          <div className="cookie-actions">
            <button onClick={() => save(true, true)} className="cookie-accept">
              {t("consent.acceptAll")}
            </button>
            <button onClick={() => save(false, false)}>
              {t("consent.rejectNonEssential")}
            </button>
            <button
              onClick={() => onOpenChange(true)}
              className="cookie-personalize"
            >
              <SlidersHorizontal size={12} />
              {t("consent.personalize")}
            </button>
          </div>
        </aside>
      )}
      {storageNotice && (
        <p className="storage-notice" role="status">
          {storageNotice}
        </p>
      )}
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="preferences-dialog">
            <Dialog.Title>{t("consent.dialogTitle")}</Dialog.Title>
            <Dialog.Description>{t("consent.dialogDescription")}</Dialog.Description>
            <Dialog.Close
              className="dialog-close"
              aria-label={t("consent.closePreferences")}
            >
              <X size={21} />
            </Dialog.Close>
            <div className="cookie-category">
              <div>
                <strong>{t("consent.essentialTitle")}</strong>
                <p>{t("consent.essentialBody")}</p>
              </div>
              <span className="tiny-tag">{t("consent.essentialTag")}</span>
            </div>
            <label className="cookie-category">
              <div>
                <strong>{t("consent.analyticsTitle")}</strong>
                <p>{t("consent.analyticsBody")}</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={e => setAnalytics(e.target.checked)}
              />
            </label>
            <label className="cookie-category">
              <div>
                <strong>{t("consent.marketingTitle")}</strong>
                <p>{t("consent.marketingBody")}</p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={e => setMarketing(e.target.checked)}
              />
            </label>
            <div className="preferences-actions">
              <button
                className="button button-primary"
                onClick={() => save(analytics, marketing)}
              >
                {t("consent.save")}
              </button>
              <button
                className="button button-outline"
                onClick={() => save(false, false)}
              >
                {t("consent.rejectNonEssential")}
              </button>
              <button
                className="button button-text"
                onClick={() => save(true, true)}
              >
                {t("consent.acceptAll")}
              </button>
            </div>
            <Link
              href={`${cmsHref("/legal/privacidade")}#cookies`}
              onClick={() => onOpenChange(false)}
              className="legal-link"
            >
              {t("consent.privacyLink")}
            </Link>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
