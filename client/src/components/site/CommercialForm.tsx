import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { commercialWhatsapp, type LandingData } from "@/data/commercial";
import { MARKETING_EMAIL } from "@shared/contact";
const contextQuestions: Record<string, { label: string; hint: string }> = {
  "palestras-em-ia": {
    label: "Qual é o contexto do evento?",
    hint: "Evento, convenção ou reunião de diretoria; público e tema de interesse.",
  },
  "imersao-em-ia": {
    label: "Que desafios a equipe quer trabalhar?",
    hint: "Áreas envolvidas e processos que deseja avaliar, sem informações confidenciais.",
  },
  "capacitacao-de-lideres": {
    label: "Que decisões suas lideranças precisam conduzir?",
    hint: "Áreas, prioridades e momento de adoção de IA.",
  },
  academia: {
    label: "Qual é seu objetivo de aprendizagem?",
    hint: "IA generativa, prompts ou desenho e gestão de agentes; acesso individual ou equipe.",
  },
  "educacao-corporativa": {
    label: "Em que momento está a formação da empresa?",
    hint: "Público, maturidade e prioridades da capacitação.",
  },
  "consultoria-em-ia": {
    label: "Qual processo você gostaria de avaliar?",
    hint: "O desafio e o objetivo da empresa, sem dados sigilosos.",
  },
  "apps-e-agentes": {
    label: "O que o projeto precisa resolver?",
    hint: "Necessidade, usuários e sistemas envolvidos, sem credenciais ou arquivos privados.",
  },
  sonia: {
    label: "Que processo gostaria de conhecer na SON.IA?",
    hint: "O contexto da operação, sem enviar dados de clientes.",
  },
  parcerias: {
    label: "Conte sobre sua atuação e interesse na parceria.",
    hint: "Seu perfil, experiência e público atendido, sem dados de terceiros.",
  },
};
export default function CommercialForm({
  data,
  selectedMode,
}: {
  data: LandingData;
  selectedMode?: string;
}) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const question =
    contextQuestions[data.slug] || contextQuestions["consultoria-em-ia"];
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
          <h3>Recebemos seu interesse.</h3>
          <p>
            Nossa equipe analisará as informações e retornará em breve. Se
            preferir falar agora, use o WhatsApp ou escreva para{" "}
            {MARKETING_EMAIL}.
          </p>
          <a
            className="button button-primary"
            href={commercialWhatsapp(data)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conversar pelo WhatsApp <ArrowRight size={16} aria-hidden="true" />
          </a>
          <button className="commercial-reset" type="button" onClick={reset}>
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <>
          <div
            className="commercial-form-progress"
            aria-label={`Etapa ${step} de 2`}
          >
            <span className={step === 1 ? "active" : ""}>01 · Contato</span>
            <span className={step === 2 ? "active" : ""}>02 · Contexto</span>
          </div>
          <h3 tabIndex={-1} ref={headingRef}>
            {step === 1
              ? "Primeiro, como podemos conversar?"
              : data.slug === "parcerias"
                ? "Vamos entender seu perfil."
                : "Agora, o contexto do seu interesse."}
          </h3>
          <p className="commercial-form-intro">
            {step === 1
              ? "Informe seus dados de contato para iniciarmos a conversa."
              : "Compartilhe apenas informações necessárias. Não inclua dados confidenciais."}
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
                Nome
                <input
                  data-first-step
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Como podemos chamar você?"
                />
              </label>
              <label>
                E-mail
                <input
                  data-first-step
                  name="email"
                  type="email"
                  required
                  maxLength={180}
                  autoComplete="email"
                  placeholder="voce@empresa.com.br"
                />
              </label>
              <button
                type="button"
                className="button button-primary"
                onClick={advance}
              >
                Continuar <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            <div hidden={step !== 2} className="commercial-step">
              <div className="form-row">
                <label>
                  Telefone (opcional)
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={25}
                    pattern="[0-9+() .-]{8,25}"
                    title="Use de 8 a 25 caracteres com números e símbolos de telefone."
                    placeholder="(11) 99999-9999"
                  />
                </label>
                <label>
                  {data.slug === "academia"
                    ? "Empresa ou atuação (opcional)"
                    : "Empresa ou atuação"}
                  <input
                    name="company"
                    required={step === 2 && data.slug !== "academia"}
                    minLength={2}
                    maxLength={120}
                    autoComplete="organization"
                    placeholder="Seu contexto profissional"
                  />
                </label>
              </div>
              {data.slug === "parcerias" && (
                <div className="commercial-mode-confirm">
                  <span>Modalidade selecionada</span>
                  <strong>{selectedMode || "Agente Digital"}</strong>
                  <input
                    type="hidden"
                    name="modality"
                    value={selectedMode || "Agente Digital"}
                  />
                  <p>
                    Você pode alterar a modalidade na seleção desta página antes
                    de concluir.
                  </p>
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
                  Li o{" "}
                  <Link href="/legal/privacidade">
                    política de privacidade
                  </Link>{" "}
                  e autorizo o contato da Onsmart.AI conforme descrito nela.
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
                  Voltar
                </button>
                <button type="submit" className="button button-primary">
                  Demonstrar qualificação{" "}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
            <input type="hidden" name="interest" value={data.interest} />
            <input type="hidden" name="solution" value={data.slug} />
          </form>
          <p className="commercial-form-disclaimer">
            <ShieldCheck size={14} aria-hidden="true" />
            Sem CRM, cadastro ou armazenamento de dados pessoais nesta fase.
          </p>
        </>
      )}
    </div>
  );
}
