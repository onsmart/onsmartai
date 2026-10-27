import { ArrowUpRight } from "lucide-react";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import { useLocale } from "@/i18n/LocaleProvider";
import type { SiteLocale } from "@shared/locale";
import "./home-partnerships.css";

function soniaLang(locale: SiteLocale) {
  if (locale === "en") return "en";
  if (locale === "es") return "es";
  return "pt";
}

export function homePartnershipsFor(locale: SiteLocale) {
  const lang = soniaLang(locale);
  const pt = {
    revenda: {
      name: "Revenda",
      description: "Conheça o modelo de revenda da SON.IA.",
      cta: "Seja uma revenda",
    },
    whitelabel: {
      name: "White Label",
      description: "Ofereça a plataforma sob a sua própria marca.",
      cta: "Conheça o programa",
    },
    agente: {
      name: "Agente Digital",
      description: "Conheça o modelo de parceria como Agente Digital da SON.IA.",
      cta: "Torne-se um Agente Digital",
    },
  };
  const en = {
    revenda: {
      name: "Reseller",
      description: "Learn about the SON.IA reseller model.",
      cta: "Become a reseller",
    },
    whitelabel: {
      name: "White Label",
      description: "Offer the platform under your own brand.",
      cta: "Discover the program",
    },
    agente: {
      name: "Digital Agent",
      description: "Learn about partnering as a SON.IA Digital Agent.",
      cta: "Become a Digital Agent",
    },
  };
  const es = {
    revenda: {
      name: "Revenda",
      description: "Conozca el modelo de reventa de SON.IA.",
      cta: "Sea un revendedor",
    },
    whitelabel: {
      name: "White Label",
      description: "Ofrezca la plataforma bajo su propia marca.",
      cta: "Conozca el programa",
    },
    agente: {
      name: "Agente digital",
      description: "Conozca el modelo de alianza como Agente Digital de SON.IA.",
      cta: "Conviértase en Agente Digital",
    },
  };
  const copy = locale === "en" ? en : locale === "es" ? es : pt;
  return [
    {
      ...copy.revenda,
      href: `https://sonia.onsmart.ai/revendas?lang=${lang}`,
    },
    {
      ...copy.whitelabel,
      href: `https://sonia.onsmart.ai/whitelabel?lang=${lang}`,
    },
    {
      ...copy.agente,
      href: `https://sonia.onsmart.ai/agentes-digitais?lang=${lang}`,
    },
  ];
}

export default function HomePartnerships() {
  const { text, href } = useCmsCopy();
  const { locale } = useLocale();
  const partners = homePartnershipsFor(locale);
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
          {partners.map(partner => (
            <article className="home-partnership-card" key={partner.name}>
              <h3>{partner.name}</h3>
              <p>{partner.description}</p>
              <a
                href={href(partner.href)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {partner.cta}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
