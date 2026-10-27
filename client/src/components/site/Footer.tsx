import { CompanyLogo } from "./CompanyLogo";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { useSiteContent } from "@/data/site-content";
import { useWhatsappLink } from "@/i18n/site";
import { MARKETING_EMAIL } from "@shared/contact";
import { useSiteCopy } from "@/i18n/useSiteCopy";
export default function Footer({
  onPreferences,
}: {
  onPreferences: () => void;
}) {
  const whatsapp = useWhatsappLink();
  const { t } = useSiteCopy();
  const { solutions, solutionHref, socials } = useSiteContent();
  const { text: cmsText, href: cmsHref, image: cmsImage } = useCmsCopy();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link className="footer-brand logo-surface" href={cmsHref("/")}>
            <CompanyLogo id="ai" className="primary-logo" />
          </Link>
          <p>
            {cmsText("IA corporativa sem mistério.")}
            <br />
            <span>{cmsText("Uma empresa do Grupo Onsmart.")}</span>
          </p>
          <div className="footer-socials">
            {socials.map(s => (
              <a
                href={s.href}
                key={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-columns">
          <div>
            <h2>{cmsText("Educação")}</h2>
            {solutions
              .filter(s => s.category === "Educação")
              .map(s => (
                <Link href={solutionHref(s.slug)} key={s.slug}>
                  {s.slug === "capacitacao-de-lideres"
                    ? t("footer.leadersInAI")
                    : s.title}
                </Link>
              ))}
          </div>
          <div>
            <h2>{cmsText("Serviços e plataforma")}</h2>
            {solutions
              .filter(s => s.category !== "Educação")
              .map(s => (
                <Link href={solutionHref(s.slug)} key={s.slug}>
                  {s.slug === "sonia"
                    ? "SON.IA"
                    : s.slug === "apps-e-agentes"
                      ? t("footer.customApps")
                      : s.title}
                </Link>
              ))}
            <Link href={cmsHref("/parcerias")}>{cmsText("Parcerias")}</Link>
            <Link href={cmsHref("/quem-somos")}>{cmsText("Quem Somos")}</Link>
          </div>
          <div>
            <h2>{cmsText("Conteúdo")}</h2>
            <Link href={cmsHref("/conteudo?categoria=Blog")}>
              {cmsText("Blog")}
            </Link>
            <Link href={cmsHref("/conteudo?categoria=Materiais%20gratuitos")}>
              {cmsText("Materiais gratuitos")}
            </Link>
            <a
              href={cmsHref("https://www.youtube.com/@onsmartai")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cmsText("YouTube")}
            </a>
            <Link
              href={cmsHref("/conteudo?categoria=Onsmart%20na%20m%C3%ADdia")}
            >
              {cmsText("Onsmart na mídia")}
            </Link>
            <Link href={cmsHref("/conteudo?categoria=Cases")}>
              {cmsText("Cases")}
            </Link>
          </div>
          <div>
            <h2>{cmsText("Vamos conversar")}</h2>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer">
              {cmsText("+55 (11) 93068-3562")}
              <ArrowUpRight size={15} />
            </a>
            <a href={`mailto:${MARKETING_EMAIL}`}>
              {MARKETING_EMAIL}
            </a>
            <div className="footer-address">
              <strong>{cmsText("São Paulo · Matriz")}</strong>
              <p>
                {cmsText("Rua Arizona, 1349, Conj. 1B")}
                <br />
                {cmsText("Cidade Monções, São Paulo/SP.")}
              </p>
              <strong>{cmsText("Curitiba · Filial")}</strong>
              <p>
                {cmsText("Rua Comendador Araújo, 499, Cj. 1003")}
                <br />
                {cmsText("Centro, Curitiba/PR.")}
              </p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            {cmsText("© ")}
            {new Date().getFullYear()}
            {cmsText(" Onsmart.AI. Todos os direitos reservados.")}
          </p>
          <div>
            <Link href={cmsHref("/legal/privacidade")}>
              {cmsText("Privacidade")}
            </Link>
            <button onClick={onPreferences}>
              {cmsText("Preferências de cookies")}
            </button>
            <Link href={cmsHref("/legal/termos")}>
              {cmsText("Termos de uso")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
