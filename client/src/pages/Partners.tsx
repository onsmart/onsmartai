import SitePhotography from "@/components/site/SitePhotography";
import { useCmsDocument } from "@/components/cms/CmsProvider";
import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  ArrowRight,
  Network,
  UserRound,
  Building2,
  Layers3,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";
import { getCommercial, type LandingData } from "@/data/commercial";
import { ButtonLink, Notice } from "@/components/site/Common";
import { CommercialFAQ, CommercialClosing } from "./SolutionLanding";
import "./commercial.css";
const modes = [
  { name: "Agente Digital", icon: UserRound },
  { name: "Revenda", icon: Building2 },
  { name: "White Label", icon: Layers3 },
];
export default function Partners() {
  const [active, setActive] = useState(0);
  const published = useCmsDocument("/parcerias");
  const data = published
    ? (published.payload.fields as LandingData)
    : getCommercial("parcerias");
  if (!data)
    return (
      <section className="not-found">
        <div className="container">
          <h1>Programa de Parcerias</h1>
          <p>A página está sendo preparada para revisão.</p>
          <ButtonLink href="/contato?interesse=Parcerias">
            Falar com a equipe
          </ButtonLink>
        </div>
      </section>
    );
  const selected = modes[active];
  return (
    <div className="commercial-page partners-page">
      <section className="commercial-hero">
        <div className="container">
          <nav
            className="commercial-breadcrumb"
            aria-label="Caminho de navegação"
          >
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Parcerias</span>
          </nav>
          <div className="commercial-hero-layout">
            <div className="commercial-hero-copy">
              <p className="eyebrow">
                <span />
                Programa de Parcerias
              </p>
              <h1>{data.heroTitle}</h1>
              <p className="commercial-lead">{data.lead}</p>
              <div className="commercial-hero-actions">
                <a className="button button-primary" href="#partner-modes">
                  Encontrar minha modalidade
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a href="#commercial-contact" className="commercial-secondary">
                  Quero ser parceiro
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
              <p className="commercial-status">
                Homologação · modalidades e condições sujeitas a validação.
              </p>
            </div>
            <SitePhotography
              photoKey="strategy"
              className="commercial-hero-visual"
              eager
              overrideUrl={published?.payload.imageUrl}
              overrideAlt={published?.payload.imageAlt}
            />
          </div>
        </div>
      </section>
      <nav className="commercial-subnav" aria-label="Seções do programa">
        <div className="container">
          <a href="#partner-context">O programa</a>
          <a href="#partner-modes">Modalidades</a>
          <a href="#partner-next">Próximos passos</a>
          <a href="#commercial-faq">FAQ</a>
          <a href="#commercial-contact">
            Quero ser parceiro
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </nav>
      <section
        className="commercial-section commercial-context"
        id="partner-context"
      >
        <div className="container commercial-two-col">
          <div>
            <p className="eyebrow">
              <span />
              Conexões empresariais
            </p>
            <h2>{data.contextTitle}</h2>
          </div>
          <div className="commercial-context-copy">
            <p>{data.context}</p>
            <p className="commercial-muted">{data.solutionText}</p>
          </div>
        </div>
      </section>
      <section className="commercial-section partner-audience">
        <div className="container">
          <div className="commercial-section-lead">
            <div>
              <p className="eyebrow">
                <span />
                Para quem
              </p>
              <h2>Seu conhecimento e sua atuação têm contexto.</h2>
            </div>
            <p>
              O público do programa inclui empreendedores, agências de
              marketing, prestadores de serviços, gestores e empresas
              interessadas em comercializar soluções de IA.
            </p>
          </div>
          <div className="partner-profile-labels">
            <span>Empreendedores</span>
            <span>Agências de marketing</span>
            <span>Prestadores de serviços</span>
            <span>Gestores</span>
            <span>Empresas</span>
          </div>
        </div>
      </section>
      <section className="commercial-section partner-modes" id="partner-modes">
        <div className="container">
          <p className="eyebrow">
            <span />
            Escolha seu interesse
          </p>
          <h2>Três modalidades. Uma conversa para definir o caminho.</h2>
          <p className="commercial-muted">
            Selecione a modalidade que deseja conhecer. A seleção orienta a
            demonstração de qualificação, não implica adesão ou elegibilidade.
          </p>
          <div
            className="partner-mode-controls"
            role="group"
            aria-label="Modalidades de parceria"
          >
            {modes.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.name}
                  type="button"
                  aria-pressed={active === i}
                  aria-controls="partner-mode-panel"
                  onClick={() => setActive(i)}
                >
                  <span>0{i + 1}</span>
                  <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                  <strong>{mode.name}</strong>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <div
            className="partner-mode-panel"
            id="partner-mode-panel"
            aria-live="polite"
          >
            <div className="partner-selected-heading">
              <span className="eyebrow">Sua modalidade de interesse</span>
              <h3>{selected.name}</h3>
              <p>
                Você escolheu conhecer a modalidade {selected.name}. A
                apresentação oficial da atuação, dos requisitos e das condições
                ainda depende de materiais confirmados pela Onsmart.AI.
              </p>
              <a href="#commercial-contact" className="button button-primary">
                Conversar sobre {selected.name}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
            <dl className="partner-mode-details">
              <div>
                <dt>Público indicado</dt>
                <dd>
                  O programa contempla os perfis apresentados acima. A indicação
                  específica para {selected.name} precisa de avaliação da
                  equipe.
                </dd>
              </div>
              <div>
                <dt>Oportunidade de atuação</dt>
                <dd>
                  Converse sobre seu interesse em comercializar soluções de IA.
                  O papel desta modalidade não foi detalhado nos materiais
                  recebidos.
                </dd>
              </div>
              <div>
                <dt>Benefícios e funcionamento</dt>
                <dd>
                  Não há benefícios comerciais ou condições operacionais
                  confirmados para apresentação. Materiais oficiais pendentes.
                </dd>
              </div>
              <div>
                <dt>Próximo passo</dt>
                <dd>
                  Conhecer as condições oficiais com o setor responsável e
                  avaliar a adequação ao seu perfil antes de qualquer adesão.
                </dd>
              </div>
            </dl>
          </div>
          <Notice>
            Não foram presumidos percentuais, ganhos, exclusividade, direitos de
            marca, licenciamento ou condições de White Label.
          </Notice>
        </div>
      </section>
      <section className="commercial-section partner-next" id="partner-next">
        <div className="container">
          <div className="commercial-section-lead">
            <div>
              <p className="eyebrow">
                <span />
                Próximos passos
              </p>
              <h2>Entender antes de assumir um compromisso.</h2>
            </div>
            <p>
              Fluxo editorial para orientar o primeiro contato. Não substitui os
              critérios de avaliação nem as condições oficiais do programa.
            </p>
          </div>
          <div className="commercial-goals">
            <article>
              <span className="commercial-number">01</span>
              <h3>Escolha seu interesse</h3>
              <p>
                Selecione Agente Digital, Revenda ou White Label para indicar a
                modalidade que deseja conhecer.
              </p>
            </article>
            <article>
              <span className="commercial-number">02</span>
              <h3>Apresente seu contexto</h3>
              <p>
                Explique sua atuação, experiência e público ao conversar com a
                equipe, sem incluir dados de terceiros.
              </p>
            </article>
            <article>
              <span className="commercial-number">03</span>
              <h3>Confirme as condições</h3>
              <p>
                Solicite os materiais e requisitos oficiais antes de definir
                qualquer próximo passo comercial.
              </p>
            </article>
          </div>
          <div className="partner-conditions-note">
            <ShieldCheck size={22} aria-hidden="true" />
            <p>
              Comissões, contratos, responsabilidades, benefícios e
              funcionamento serão definidos nos materiais oficiais. Nenhuma
              receita ou contratação é garantida.
            </p>
          </div>
        </div>
      </section>
      <section className="partner-booking">
        <div className="container">
          <CalendarClock size={28} aria-hidden="true" />
          <div>
            <h2>Uma conversa com o setor responsável.</h2>
            <p>
              O espaço de agendamento está preparado. O link oficial será
              configurado na etapa de integrações, quando disponibilizado.
            </p>
          </div>
          <span>Agendamento pendente</span>
        </div>
      </section>
      <CommercialFAQ data={data} />
      <CommercialClosing data={data} selectedMode={selected.name} />
      <section className="commercial-section commercial-related">
        <div className="container">
          <p className="eyebrow">
            <span />
            Conheça a Onsmart.AI
          </p>
          <h2>Explore as soluções antes de conversar.</h2>
          <div className="partner-related-actions">
            <ButtonLink href="/servicos" variant="outline">
              Explorar o portfólio
            </ButtonLink>
            <ButtonLink href="/ecossistema" variant="text">
              Conhecer o ecossistema
            </ButtonLink>
          </div>
          <details className="commercial-review">
            <summary>Informações pendentes do programa</summary>
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
