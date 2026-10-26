import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
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
      setStorageNotice(
        "Seu navegador não permitiu salvar as preferências. Sua escolha vale apenas nesta visita."
      );
    }
    setConsent(value);
    setAnalytics(a);
    setMarketing(m);
    onOpenChange(false);
  }
  return (
    <>
      {loaded && !consent && !open && (
        <aside
          className="cookie-banner"
          aria-label="Preferências de privacidade"
        >
          <div className="cookie-heading">
            <ShieldCheck size={18} />
            <strong>Sua privacidade importa.</strong>
          </div>
          <p>
            Usamos cookies essenciais e, com a sua autorização, cookies de
            análise e marketing. Você pode alterar suas preferências a qualquer
            momento.
          </p>
          <div className="cookie-actions">
            <button onClick={() => save(true, true)} className="cookie-accept">
              Aceitar todos
            </button>
            <button onClick={() => save(false, false)}>
              Rejeitar não essenciais
            </button>
            <button
              onClick={() => onOpenChange(true)}
              className="cookie-personalize"
            >
              <SlidersHorizontal size={12} />
              Personalizar
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
            <Dialog.Title>Preferências de cookies</Dialog.Title>
            <Dialog.Description>
              Você decide quais categorias autorizar. Cookies essenciais
              permanecem ativos para o funcionamento do site.
            </Dialog.Description>
            <Dialog.Close
              className="dialog-close"
              aria-label="Fechar preferências"
            >
              <X size={21} />
            </Dialog.Close>
            <div className="cookie-category">
              <div>
                <strong>Essenciais</strong>
                <p>Armazenam apenas a sua escolha de consentimento.</p>
              </div>
              <span className="tiny-tag">Sempre ativos</span>
            </div>
            <label className="cookie-category">
              <div>
                <strong>Analytics</strong>
                <p>Ajudam a entender como o site é utilizado e a melhorá-lo.</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={e => setAnalytics(e.target.checked)}
              />
            </label>
            <label className="cookie-category">
              <div>
                <strong>Marketing</strong>
                <p>
                  Permitem personalizar comunicações e medir campanhas.
                </p>
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
                Salvar preferências
              </button>
              <button
                className="button button-outline"
                onClick={() => save(false, false)}
              >
                Rejeitar não essenciais
              </button>
              <button
                className="button button-text"
                onClick={() => save(true, true)}
              >
                Aceitar todos
              </button>
            </div>
            <Link
              href="/legal/privacidade#cookies"
              onClick={() => onOpenChange(false)}
              className="legal-link"
            >
              Saiba mais na política de privacidade
            </Link>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
