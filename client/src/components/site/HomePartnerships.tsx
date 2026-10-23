import { ArrowUpRight } from "lucide-react";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import "./home-partnerships.css";
export const homePartnerships = [
  {
    name: "Revenda",
    description: "Conheça o modelo de revenda da SON.IA.",
    cta: "Seja uma revenda",
    href: "https://sonia.onsmart.ai/revendas?lang=pt",
  },
  {
    name: "White Label",
    description: "Ofereça a plataforma sob a sua própria marca.",
    cta: "Conheça o programa",
    href: "https://sonia.onsmart.ai/whitelabel?lang=pt",
  },
  {
    name: "Agente Digital",
    description: "Conheça o modelo de parceria como Agente Digital da SON.IA.",
    cta: "Torne-se um Agente Digital",
    href: "https://sonia.onsmart.ai/agentes-digitais?lang=pt",
  },
];
export default function HomePartnerships() {
  const { text, href } = useCmsCopy();
  return (
    <section
      className="section home-partnerships"
      id="parcerias-sonia"
      aria-labelledby="home-partnerships-title"
    >
      <div className="container">
        <p className="eyebrow">
          <span />
          {text("Parcerias")}
        </p>
        <h2 id="home-partnerships-title">
          {text("Leve a SON.IA para os seus clientes")}
        </h2>
        <p className="home-partnerships-lead">
          {text(
            "Três modelos de parceria para levar a SON.IA aos seus clientes"
          )}
        </p>
        <div className="home-partnerships-grid">
          {homePartnerships.map(partner => (
            <article className="home-partnership-card" key={partner.name}>
              <h3>{text(partner.name)}</h3>
              <p>{text(partner.description)}</p>
              <a
                href={href(partner.href)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text(partner.cta)}
                <ArrowUpRight size={17} aria-hidden="true" />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
