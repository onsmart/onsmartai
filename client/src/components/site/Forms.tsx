import { useCmsCopy } from "@/components/cms/CmsProvider";
import {
  CONTACT_FORM,
  CONTACT_INTEREST_VALUES,
  isContactInterestValue,
  type ContactInterestValue,
} from "@/i18n/contact-form";
import { useLocale } from "@/i18n/LocaleProvider";
import { trpc } from "@/lib/trpc";
import { MARKETING_EMAIL } from "@shared/contact";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
import { Notice } from "./Common";

export function Newsletter() {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

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
            {cmsText("Conhecimento para decidir")}
          </p>
          <h2>
            {cmsText("Aprenda IA corporativa")}
            <br />
            {cmsText("antes de decidir")}
          </h2>
          <p>
            {cmsText(
              "Receba conteúdos sobre inteligência artificial aplicada aos negócios, tendências e estratégias de implementação."
            )}
          </p>
        </div>
        <div>
          {done ? (
            <div className="form-feedback" role="status">
              <CheckCircle2 size={25} />
              <h3>{cmsText("Inscrição registrada.")}</h3>
              <p>
                {cmsText(
                  "Obrigado pelo interesse. Em breve você receberá novidades sobre IA corporativa no e-mail informado."
                )}
              </p>
              <button
                className="button button-outline"
                onClick={() => setDone(false)}
              >
                {cmsText("Voltar ao formulário")}
              </button>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={submit}>
              <div className="form-row">
                <label>
                  {cmsText("Nome")}
                  <input
                    name="name"
                    autoComplete="given-name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder={cmsText("Como podemos chamar você?")}
                  />
                </label>
                <label>
                  {cmsText("E-mail")}
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={180}
                    placeholder={cmsText("seuemail@empresa.com.br")}
                  />
                </label>
              </div>
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>
                  {cmsText("Concordo em receber conteúdos da Onsmart.AI.")}{" "}
                  <a href={cmsHref("/legal/privacidade")}>
                    {cmsText("Conheça a política de privacidade.")}
                  </a>
                </span>
              </label>
              <button className="button button-primary" type="submit">
                {cmsText("Quero receber conteúdos")}
                <ArrowUpRight size={17} />
              </button>
              <Notice>
                {cmsText(
                  "Você pode cancelar a inscrição a qualquer momento, conforme a política de privacidade."
                )}
              </Notice>
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
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

  const resolvedInitial = isContactInterestValue(initialInterest)
    ? initialInterest
    : "";
  const [interest, setInterest] = useState<ContactInterestValue | "">(
    resolvedInitial
  );
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const submitLead = trpc.contact.submit.useMutation();
  const question =
    interest ? formCopy.questions[interest] : undefined;
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
      setError(
        formCopy.submitError.replace("{email}", MARKETING_EMAIL)
      );
    }
  }
  return (
    <div className="contact-form-panel">
      <div className="form-panel-top">
        <Mail size={21} />
        <span>{cmsText("Conte sobre o seu próximo passo")}</span>
      </div>
      {done ? (
        <div className="form-feedback" role="status">
          <CheckCircle2 size={28} />
          <h3>{cmsText("Mensagem recebida.")}</h3>
          <p>
            {formCopy.successBody.replace("{email}", MARKETING_EMAIL)}
          </p>
          <button
            className="button button-outline"
            onClick={() => setDone(false)}
          >
            {cmsText("Voltar ao formulário")}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="contact-form">
          <div className="form-row">
            <label>
              {cmsText("Nome completo")}
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder={cmsText("Seu nome")}
              />
            </label>
            <label>
              {cmsText("E-mail corporativo")}
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={180}
                placeholder={cmsText("voce@empresa.com.br")}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              {cmsText("Telefone")}
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                minLength={8}
                maxLength={25}
                pattern="[0-9+() .-]{8,25}"
                title={cmsText(
                  "Informe de 8 a 25 caracteres, usando números e símbolos de telefone."
                )}
                placeholder={cmsText("(11) 99999-9999")}
              />
            </label>
            <label>
              {cmsText("Empresa")}
              <input
                name="company"
                autoComplete="organization"
                required
                minLength={2}
                maxLength={120}
                placeholder={cmsText("Nome da empresa")}
              />
            </label>
          </div>
          <label>
            {cmsText("Assunto de interesse")}
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
                {cmsText("Selecione o que faz sentido para você")}
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
              {cmsText("Li o")}{" "}
              <a href={cmsHref("/legal/privacidade")}>
                {cmsText("política de privacidade")}
              </a>
              {cmsText(
                " e autorizo o contato da Onsmart.AI conforme descrito nela."
              )}
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
            {submitLead.isPending
              ? cmsText("Enviando…")
              : cmsText("Enviar mensagem")}
            <ArrowUpRight size={17} />
          </button>
          <Notice>
            {cmsText(
              "Suas informações serão usadas apenas para retorno comercial, conforme a política de privacidade."
            )}
          </Notice>
        </form>
      )}
    </div>
  );
}
