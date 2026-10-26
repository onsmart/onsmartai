import SitePhotography from "@/components/site/SitePhotography";
import { photoForSolution } from "@/data/photography";
import {
  SoniaPresentation,
  SoniaCharacter,
} from "@/components/site/BrandMedia";
import { useCmsDocument } from "@/components/cms/CmsProvider";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  BookOpen,
  Workflow,
  ShieldCheck,
  Target,
  Layers3,
  Check,
} from "lucide-react";
import {
  getCommercial,
  commercialWhatsapp,
  landingPath,
  type LandingData,
} from "@/data/commercial";
import { MARKETING_EMAIL } from "@shared/contact";
import { solutions } from "@/data/site";
import { ButtonLink, Notice, SoniaProcess } from "@/components/site/Common";
import CommercialForm from "@/components/site/CommercialForm";
import "./commercial.css";

export function CommercialFAQ({ data }: { data: LandingData }) {
  return (
    <section className="commercial-section commercial-faq" id="commercial-faq">
      <div className="container commercial-two-col">
        <div>
          <p className="eyebrow">
            <span />
            Dúvidas frequentes
          </p>
          <h2>Clareza antes do próximo passo.</h2>
          <p className="commercial-muted">
            Respostas objetivas sobre escopo, formato e próximos passos com a
            equipe comercial.
          </p>
        </div>
        <div className="commercial-faq-list">
          {data.faqs.map((faq, index) => (
            <details key={faq.q} open={index === 0}>
              <summary>
                {faq.q}
                <Plus size={18} aria-hidden="true" />
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
export function CommercialClosing({
  data,
  selectedMode,
}: {
  data: LandingData;
  selectedMode?: string;
}) {
  return (
    <section
      className="commercial-section commercial-contact-section"
      id="commercial-contact"
    >
      <div className="container commercial-contact-layout">
        <div className="commercial-contact-copy">
          <p className="eyebrow">
            <span />
            Seu próximo passo
          </p>
          <h2>
            {data.slug === "parcerias"
              ? "Uma conversa para entender a parceria."
              : "Vamos conectar esta solução ao seu contexto?"}
          </h2>
          <p>
            Escolha o contato direto com a equipe ou preencha o formulário de
            qualificação. A proposta comercial depende de entender seu interesse
            e as necessidades da sua operação.
          </p>
          <a
            className="button button-primary"
            href={commercialWhatsapp(data)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.slug === "parcerias" ? "Quero ser parceiro" : data.cta}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a className="commercial-email" href={`mailto:${MARKETING_EMAIL}`}>
            {MARKETING_EMAIL}
          </a>
          <Notice>
            O WhatsApp abre em nova janela. O formulário envia seu interesse à
            equipe comercial da Onsmart.AI.
          </Notice>
        </div>
        <CommercialForm
          key={data.slug}
          data={data}
          selectedMode={selectedMode}
        />
      </div>
    </section>
  );
}
function HeroVisual({ data }: { data: LandingData }) {
  const publishedPhoto = useCmsDocument(landingPath(data.slug));
  if (data.slug === "sonia")
    return (
      <div className="commercial-hero-visual commercial-visual-platform has-sonia-media">
        <img
          src="/assets/sonia-logo.png"
          width="230"
          height="82"
          alt="Marca oficial SON.IA"
        />
        <p>Conversas. Agentes. Sistemas. Processos.</p>
        <SoniaPresentation />
      </div>
    );
  return (
    <SitePhotography
      photoKey={photoForSolution(data.slug)}
      className="commercial-hero-visual"
      eager
      overrideUrl={publishedPhoto?.payload.imageUrl}
      overrideAlt={publishedPhoto?.payload.imageAlt}
    />
  );
}

export default function SolutionLanding({
  params,
}: {
  params: { slug: string };
}) {
  const published = useCmsDocument(`/servicos/${params.slug}`);
  const data = published
    ? (published.payload.fields as LandingData)
    : getCommercial(params.slug);
  if (!data || params.slug === "parcerias")
    return (
      <section className="not-found">
        <div className="container">
          <p className="eyebrow">Solução não encontrada</p>
          <h1>Vamos encontrar o caminho adequado?</h1>
          <p>Consulte o portfólio de educação, serviços e plataforma.</p>
          <ButtonLink href="/servicos">Explorar soluções</ButtonLink>
        </div>
      </section>
    );
  const solution = solutions.find(s => s.slug === params.slug)!;
  const related = solutions
    .filter(s => s.slug !== data.slug)
    .sort(
      (a, b) =>
        Number(b.category === solution.category) -
        Number(a.category === solution.category)
    )
    .slice(0, 3);
  return (
    <div
      className={`commercial-page commercial-${solution.category === "Educação" ? "education" : solution.category === "Serviços" ? "service" : "platform"}`}
    >
      <section className="commercial-hero">
        <div className="container">
          <nav
            className="commercial-breadcrumb"
            aria-label="Caminho de navegação"
          >
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/servicos">Serviços</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{solution.title}</span>
          </nav>
          <div className="commercial-hero-layout">
            <div className="commercial-hero-copy">
              <p className="eyebrow">
                <span />
                {data.eyebrow}
              </p>
              <h1>{data.heroTitle}</h1>
              <p className="commercial-lead">{data.lead}</p>
              <div className="commercial-hero-actions">
                <a className="button button-primary" href="#commercial-contact">
                  {data.cta}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                {data.slug === "sonia" ? (
                  <a
                    href="https://sonia.onsmart.ai/"
                    className="commercial-secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visitar o site oficial
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <a
                    href="#commercial-solution"
                    className="commercial-secondary"
                  >
                    Entender a solução
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
              <p className="commercial-status">
                Condições comerciais definidas em proposta com a equipe
                Onsmart.AI.
              </p>
            </div>
            <HeroVisual data={data} />
          </div>
        </div>
      </section>
      <nav className="commercial-subnav" aria-label="Seções da solução">
        <div className="container">
          <a href="#commercial-solution">A solução</a>
          <a href="#commercial-audience">Para quem</a>
          <a href="#commercial-how">Como funciona</a>
          <a href="#commercial-scope">Escopo</a>
          <a href="#commercial-faq">FAQ</a>
          <a href="#commercial-contact">
            Próximo passo <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </nav>
      <section className="commercial-section commercial-context">
        <div className="container commercial-two-col">
          <div>
            <p className="eyebrow">
              <span />O contexto
            </p>
            <h2>{data.contextTitle}</h2>
          </div>
          <div className="commercial-context-copy">
            <p>{data.context}</p>
            <div className="commercial-context-link">
              <Target size={20} aria-hidden="true" />
              <span>Comece pelo objetivo, não pela ferramenta.</span>
            </div>
          </div>
        </div>
      </section>
      <section
        className="commercial-section commercial-solution"
        id="commercial-solution"
      >
        <div className="container">
          <div className="commercial-section-lead">
            <div>
              <p className="eyebrow">
                <span />A solução
              </p>
              <h2>{data.solutionTitle}</h2>
            </div>
            <p>{data.solutionText}</p>
          </div>
          <div className="commercial-goals">
            {data.goals.map((goal, i) => (
              <article key={goal.title}>
                <span className="commercial-number">0{i + 1}</span>
                <h3>{goal.title}</h3>
                <p>{goal.text}</p>
              </article>
            ))}
          </div>
          {data.slug === "academia" && (
            <div className="commercial-academy-conditions">
              <div>
                <span className="eyebrow">
                  Condições comerciais
                </span>
                <strong>A partir de R$ 349</strong>
                <p>ou 12x de R$ 29,08</p>
              </div>
              <div>
                <strong>12 meses</strong>
                <p>Acesso individual ou por colaborador.</p>
              </div>
              <div>
                <strong>Curso introdutório gratuito</strong>
                <p>Consulte a equipe sobre disponibilidade atual.</p>
              </div>
              <Notice>
                Valores e condições de pagamento são confirmados com a equipe
                comercial antes da contratação.
              </Notice>
            </div>
          )}
        </div>
      </section>
      <section
        className="commercial-section commercial-audience"
        id="commercial-audience"
      >
        <div className="container commercial-two-col">
          <div>
            <p className="eyebrow">
              <span />
              Para quem é
            </p>
            <h2>Uma solução conectada ao seu momento.</h2>
            <p className="commercial-muted">{solution.audience}</p>
          </div>
          <ul className="commercial-audience-list">
            {data.audiences.map((audience, i) => (
              <li key={audience}>
                <span>0{i + 1}</span>
                <p>{audience}</p>
                <Check size={18} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        className="commercial-section commercial-how"
        id="commercial-how"
      >
        <div className="container">
          <div className="commercial-section-lead">
            <div>
              <p className="eyebrow">
                <span />
                Como funciona
              </p>
              <h2>
                {data.slug === "sonia"
                  ? "Da conversa à ação, com supervisão."
                  : "Conheça os focos desta jornada."}
              </h2>
            </div>
            <p>
              {data.slug === "sonia"
                ? "Visão das etapas da operação na SON.IA: da conversa à ação, com supervisão humana."
                : "Visão geral das etapas desta solução. Formato, sequência e contratação são definidos na proposta comercial."}
            </p>
          </div>
          {data.slug === "sonia" ? (
            <div className="commercial-sonia-process">
              <SoniaProcess />
            </div>
          ) : (
            <div className="commercial-flow">
              {data.flow.map((step, i) => (
                <article key={step.title}>
                  <span className="commercial-flow-number">0{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  <ArrowRight size={18} aria-hidden="true" />
                </article>
              ))}
            </div>
          )}
          <Notice>
            {data.slug === "academia"
              ? "Trilhas e níveis podem variar conforme o plano contratado."
              : data.slug === "sonia"
                ? "Ilustração do fluxo operacional; detalhes técnicos na proposta e implantação."
                : "Referência das etapas típicas; cronograma e metodologia são acordados na proposta."}
          </Notice>
        </div>
      </section>
      <section
        className="commercial-section commercial-scope"
        id="commercial-scope"
      >
        <div className="container commercial-two-col">
          <div className="commercial-method">
            <p className="eyebrow">
              <span />
              Metodologia e contratação
            </p>
            <h2>O escopo vem antes da execução.</h2>
            <p>{data.methodology}</p>
            <div className="commercial-scope-note">
              <ShieldCheck size={19} aria-hidden="true" />
              <p>
                Método, responsabilidades e condições definitivas serão
                confirmados pela Onsmart.AI na proposta.
              </p>
            </div>
          </div>
          <div className="commercial-deliverables">
            <p className="eyebrow">
              <span />
              Entregáveis e escopo
            </p>
            <h3>O que alinhar na proposta</h3>
            <ul>
              {data.deliverables.map(item => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="commercial-scope-disclaimer">
              Entregáveis e escopo definitivos são confirmados na proposta
              comercial com a Onsmart.AI.
            </p>
          </div>
        </div>
      </section>
      <section className="commercial-section commercial-differences">
        <div className="container">
          <p className="eyebrow">
            <span />O que orienta esta solução
          </p>
          <h2>Clareza sobre o que faz diferença.</h2>
          <div className="commercial-difference-list">
            {data.differentiators.map((item, i) => (
              <article key={item.title}>
                <span>0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="commercial-cases">
        <div className="container">
          <Layers3 size={24} aria-hidden="true" />
          <div>
            <h2>Cases desta solução</h2>
            <p>
              Não há case específico autorizado para apresentação nesta landing
              page. Resultados e depoimentos serão incluídos somente com
              material validado.
            </p>
          </div>
          <ButtonLink href="/conteudo?categoria=Cases" variant="outline">
            Explorar a central
          </ButtonLink>
        </div>
      </section>
      <CommercialFAQ data={data} />
      <CommercialClosing data={data} />
      <section className="commercial-section commercial-related">
        <div className="container">
          <div className="commercial-related-heading">
            <div>
              <p className="eyebrow">
                <span />
                Continue sua jornada
              </p>
              <h2>Outros caminhos para a adoção de IA.</h2>
            </div>
            <ButtonLink href="/servicos" variant="text">
              Todo o portfólio
            </ButtonLink>
          </div>
          <div className="commercial-related-list">
            {related.map(s => (
              <Link
                href={landingPath(s.slug)}
                key={s.slug}
                className="commercial-related-card"
              >
                {s.slug === "sonia" && (
                  <SoniaCharacter className="related-sonia-character" />
                )}
                <span>{s.category}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            ))}
          </div>
          <details className="commercial-review">
            <summary>Informações comerciais complementares</summary>
            <ul>
              {data.commercialNotices.map(note => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
