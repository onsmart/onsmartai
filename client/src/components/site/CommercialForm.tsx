import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { commercialWhatsapp, type LandingData } from "@/data/commercial";
import { MARKETING_EMAIL } from "@shared/contact";
import { useLocale } from "@/i18n/LocaleProvider";
import { COMMERCIAL_FORM } from "@/i18n/commercial-form";
import { useSiteCopy } from "@/i18n/useSiteCopy";

export default function CommercialForm({
  data,
  selectedMode,
}: {
  data: LandingData;
  selectedMode?: string;
}) {
  const { locale } = useLocale();
  const { t } = useSiteCopy();
  const copy = COMMERCIAL_FORM[locale];
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const question =
    copy.questions[data.slug] || copy.questions["consultoria-em-ia"];
  const defaultMode = t("commercial.modeAgent");
  function advance() {
    const inputs = Array.from(
      formRef.current?.querySelectorAll<HTMLInputElement>(
        "[data-first-step]"
      ) || []
    );
    if (inputs.every(input => input.reportValidity())) {
      setStep(2);
      requestAnimationFrame(() => headingRef.current?.focus());
    }
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 1) {
      advance();
      return;
    }
    e.currentTarget.reset();
    setDone(true);
    requestAnimationFrame(() => feedbackRef.current?.focus());
  }
  function reset() {
    setDone(false);
    setStep(1);
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  return (
    <div className="commercial-form-panel">
      {done ? (
        <div
          className="commercial-feedback"
          role="status"
          tabIndex={-1}
          ref={feedbackRef}
        >
          <CheckCircle2 size={32} aria-hidden="true" />
          <h3>{copy.successTitle}</h3>
          <p>
            {copy.successBody.replace("{email}", MARKETING_EMAIL)}
          </p>
          <a
            className="button button-primary"
            href={commercialWhatsapp(data, locale)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.whatsappCta} <ArrowRight size={16} aria-hidden="true" />
          </a>
          <button className="commercial-reset" type="button" onClick={reset}>
            {copy.sendAnother}
          </button>
        </div>
      ) : (
        <>
          <div
            className="commercial-form-progress"
            aria-label={copy.stepProgress.replace("{step}", String(step))}
          >
            <span className={step === 1 ? "active" : ""}>
              {copy.step1Label}
            </span>
            <span className={step === 2 ? "active" : ""}>
              {copy.step2Label}
            </span>
          </div>
          <h3 tabIndex={-1} ref={headingRef}>
            {step === 1
              ? copy.step1Title
              : data.slug === "parcerias"
                ? copy.step2TitlePartners
                : copy.step2TitleDefault}
          </h3>
          <p className="commercial-form-intro">
            {step === 1 ? copy.step1Intro : copy.step2Intro}
          </p>
          <form ref={formRef} onSubmit={submit} className="commercial-form">
            <div
              hidden={step !== 1}
              className="commercial-step"
              onKeyDown={event => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  advance();
                }
              }}
            >
              <label>
                {copy.name}
                <input
                  data-first-step
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  placeholder={copy.namePlaceholder}
                />
              </label>
              <label>
                {copy.email}
                <input
                  data-first-step
                  name="email"
                  type="email"
                  required
                  maxLength={180}
                  autoComplete="email"
                  placeholder={copy.emailPlaceholder}
                />
              </label>
              <button
                type="button"
                className="button button-primary"
                onClick={advance}
              >
                {copy.continue}{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            <div hidden={step !== 2} className="commercial-step">
              <div className="form-row">
                <label>
                  {copy.phone}
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={25}
                    pattern="[0-9+() .-]{8,25}"
                    title={copy.phoneTitle}
                    placeholder={copy.phonePlaceholder}
                  />
                </label>
                <label>
                  {data.slug === "academia"
                    ? copy.companyOptional
                    : copy.company}
                  <input
                    name="company"
                    required={step === 2 && data.slug !== "academia"}
                    minLength={2}
                    maxLength={120}
                    autoComplete="organization"
                    placeholder={copy.companyPlaceholder}
                  />
                </label>
              </div>
              {data.slug === "parcerias" && (
                <div className="commercial-mode-confirm">
                  <span>{copy.modeLabel}</span>
                  <strong>{selectedMode || defaultMode}</strong>
                  <input
                    type="hidden"
                    name="modality"
                    value={selectedMode || defaultMode}
                  />
                  <p>{copy.modeHint}</p>
                </div>
              )}
              <label>
                {question.label}
                <textarea
                  name="context"
                  rows={3}
                  maxLength={1000}
                  placeholder={question.hint}
                />
              </label>
              <label className="checkbox-label">
                <input name="consent" type="checkbox" required={step === 2} />
                <span>
                  {copy.privacyPrefix}{" "}
                  <Link href="/legal/privacidade">{copy.privacyLink}</Link>{" "}
                  {copy.privacySuffix}
                </span>
              </label>
              <div className="commercial-form-actions">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => {
                    setStep(1);
                    requestAnimationFrame(() => headingRef.current?.focus());
                  }}
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  {copy.back}
                </button>
                <button type="submit" className="button button-primary">
                  {copy.submit}{" "}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
            <input type="hidden" name="interest" value={data.interest} />
            <input type="hidden" name="solution" value={data.slug} />
          </form>
          <p className="commercial-form-disclaimer">
            <ShieldCheck size={14} aria-hidden="true" />
            {copy.disclaimer}
          </p>
        </>
      )}
    </div>
  );
}
