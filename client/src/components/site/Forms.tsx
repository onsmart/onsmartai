import { useCmsCopy } from "@/components/cms/CmsProvider";
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
              <h3>{cmsText("Demonstração concluída.")}</h3>
              <p>
                {cmsText(
                  "Os campos foram validados. Nenhum dado foi enviado ou armazenado. A integração com o CRM será configurada na Fase 4."
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
                  <a href={cmsHref("/previa/legal/privacidade")}>
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
                  "Formulário demonstrativo. Não envia dados nem inscreve em uma lista."
                )}
              </Notice>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
const interests = [
  "Consultoria",
  "Treinamentos",
  "Desenvolvimento de IA",
  "SON.IA",
  "Parcerias",
  "Imprensa",
  "Outros assuntos",
];
const questions: Record<string, { label: string; placeholder: string }> = {
  Consultoria: {
    label: "Qual processo você gostaria de melhorar?",
    placeholder: "Conte brevemente sobre o desafio da operação.",
  },
  Treinamentos: {
    label: "Para quem seria a capacitação?",
    placeholder: "Profissionais, lideranças ou uma equipe da empresa?",
  },
  "Desenvolvimento de IA": {
    label: "O que o seu projeto precisa resolver?",
    placeholder:
      "Descreva a necessidade, sem enviar informações confidenciais.",
  },
  "SON.IA": {
    label: "Em qual área você gostaria de conhecer a SON.IA?",
    placeholder: "Ex.: atendimento, vendas ou operações.",
  },
  Parcerias: {
    label: "Qual modalidade de parceria tem interesse?",
    placeholder: "Agente Digital, Revenda ou White Label.",
  },
  Imprensa: {
    label: "Qual é a pauta e o veículo?",
    placeholder: "Compartilhe o tema do seu contato.",
  },
  "Outros assuntos": {
    label: "Como podemos ajudar?",
    placeholder: "Deixe uma breve mensagem.",
  },
};
export function ContactForm({
  initialInterest = "",
}: {
  initialInterest?: string;
}) {
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

  const [interest, setInterest] = useState(initialInterest);
  const [done, setDone] = useState(false);
  const question = questions[interest];
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
    e.currentTarget.reset();
    setInterest("");
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
          <h3>{cmsText("Fluxo demonstrativo concluído.")}</h3>
          <p>
            {cmsText(
              "Seu formulário foi validado, mas nenhum dado foi enviado ou armazenado. Para falar com a equipe agora, utilize o WhatsApp ou o e-mail comercial."
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
              onChange={e => setInterest(e.target.value)}
              required
            >
              <option value="">
                {cmsText("Selecione o que faz sentido para você")}
              </option>
              {interests.map(i => (
                <option key={i}>{i}</option>
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
                placeholder={question.placeholder}
              />
            </label>
          )}
          <label className="checkbox-label">
            <input type="checkbox" required />
            <span>
              {cmsText("Li o")}{" "}
              <a href={cmsHref("/previa/legal/privacidade")}>
                {cmsText("rascunho de privacidade")}
              </a>
              {cmsText(
                " e entendo que este formulário é apenas uma demonstração."
              )}
            </span>
          </label>
          <button className="button button-primary" type="submit">
            {cmsText("Demonstrar envio")}
            <ArrowUpRight size={17} />
          </button>
          <Notice>
            {cmsText("Protótipo: não há envio para a equipe comercial ou CRM.")}
          </Notice>
        </form>
      )}
    </div>
  );
}
