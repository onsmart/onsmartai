import { useCmsCopy } from "@/components/cms/CmsProvider";
import {
  CONTACT_FORM,
  CONTACT_INTEREST_VALUES,
  isContactInterestValue,
  type ContactInterestValue,
} from "@/i18n/contact-form";
import { useLocale } from "@/i18n/LocaleProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { trpc } from "@/lib/trpc";
import { MARKETING_EMAIL } from "@shared/contact";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
import { Notice } from "./Common";

export function Newsletter() {
  const { t } = useSiteCopy();
  const { href: cmsHref } = useCmsCopy();
  const [done, setDone] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
    e.currentTarget.reset();
  }
  return (
    <section className="newsletter-section">
      <div className="container newsletter-layout">
        <div>
          <p className="eyebrow">
            <span />
            {t("newsletter.eyebrow")}
          </p>
          <h2>
            {t("newsletter.titleLine1")}
            <br />
            {t("newsletter.titleLine2")}
          </h2>
          <p>{t("newsletter.lead")}</p>
        </div>
        <div>
          {done ? (
            <div className="form-feedback" role="status">
              <CheckCircle2 size={25} />
              <h3>{t("newsletter.successTitle")}</h3>
              <p>{t("newsletter.successBody")}</p>
              <button
                className="button button-outline"
                onClick={() => setDone(false)}
              >
                {t("newsletter.backToForm")}
              </button>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={submit}>
              <div className="form-row">
                <label>
                  {t("newsletter.nameLabel")}
                  <input
                    name="name"
                    autoComplete="given-name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder={t("newsletter.namePlaceholder")}
                  />
                </label>
                <label>
                  {t("newsletter.emailLabel")}
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={180}
                    placeholder={t("newsletter.emailPlaceholder")}
                  />
                </label>
              </div>
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>
                  {t("newsletter.consentPrefix")}{" "}
                  <a href={cmsHref("/legal/privacidade")}>
                    {t("newsletter.privacyLink")}
                  </a>
                </span>
              </label>
              <button className="button button-primary" type="submit">
                {t("newsletter.submit")}
                <ArrowUpRight size={17} />
              </button>
              <Notice>{t("newsletter.notice")}</Notice>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function ContactForm({
  initialInterest = "",
}: {
  initialInterest?: string;
}) {
  const { locale } = useLocale();
  const formCopy = CONTACT_FORM[locale];
  const { href: cmsHref } = useCmsCopy();
  const ui = formCopy.ui;

  const resolvedInitial = isContactInterestValue(initialInterest)
    ? initialInterest
    : "";
  const [interest, setInterest] = useState<ContactInterestValue | "">(
    resolvedInitial
  );
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const submitLead = trpc.contact.submit.useMutation();
  const question = interest ? formCopy.questions[interest] : undefined;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await submitLead.mutateAsync({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        company: String(data.get("company") ?? ""),
        interest: (() => {
          const raw = String(data.get("interest") ?? interest);
          return isContactInterestValue(raw)
            ? formCopy.interestLabels[raw]
            : raw;
        })(),
        message: String(data.get("message") ?? "") || undefined,
      });
      setDone(true);
      form.reset();
      setInterest("");
    } catch {
      setError(formCopy.submitError.replace("{email}", MARKETING_EMAIL));
    }
  }
  return (
    <div className="contact-form-panel">
      <div className="form-panel-top">
        <Mail size={21} />
        <span>{ui.panelTitle}</span>
      </div>
      {done ? (
        <div className="form-feedback" role="status">
          <CheckCircle2 size={28} />
          <h3>{ui.successTitle}</h3>
          <p>{formCopy.successBody.replace("{email}", MARKETING_EMAIL)}</p>
          <button
            className="button button-outline"
            onClick={() => setDone(false)}
          >
            {ui.backToForm}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="contact-form">
          <div className="form-row">
            <label>
              {ui.nameLabel}
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder={ui.namePlaceholder}
              />
            </label>
            <label>
              {ui.emailLabel}
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={180}
                placeholder={ui.emailPlaceholder}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              {ui.phoneLabel}
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                minLength={8}
                maxLength={25}
                pattern="[0-9+() .-]{8,25}"
                title={ui.phoneTitle}
                placeholder={ui.phonePlaceholder}
              />
            </label>
            <label>
              {ui.companyLabel}
              <input
                name="company"
                autoComplete="organization"
                required
                minLength={2}
                maxLength={120}
                placeholder={ui.companyPlaceholder}
              />
            </label>
          </div>
          <label>
            {ui.interestLabel}
            <select
              name="interest"
              value={interest}
              onChange={e => {
                const value = e.target.value;
                setInterest(isContactInterestValue(value) ? value : "");
              }}
              required
            >
              <option value="">
                {ui.interestPlaceholder}
              </option>
              {CONTACT_INTEREST_VALUES.map(value => (
                <option key={value} value={value}>
                  {formCopy.interestLabels[value]}
                </option>
              ))}
            </select>
          </label>
          {question && (
            <label>
              {question.label}
              <textarea
                name="message"
                rows={3}
                maxLength={1000}
                required
                placeholder={question.placeholder}
              />
            </label>
          )}
          <label className="checkbox-label">
            <input type="checkbox" required />
            <span>
              {ui.privacyPrefix}{" "}
              <a href={cmsHref("/legal/privacidade")}>{ui.privacyLink}</a>
              {ui.privacySuffix}
            </span>
          </label>
          {error && (
            <p className="form-submit-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button button-primary"
            type="submit"
            disabled={submitLead.isPending}
          >
            {submitLead.isPending ? ui.submitting : ui.submit}
            <ArrowUpRight size={17} />
          </button>
          <Notice>{ui.footerNotice}</Notice>
        </form>
      )}
    </div>
  );
}
