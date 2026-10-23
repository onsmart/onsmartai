import { CompanyLogo } from "./CompanyLogo";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { solutions, solutionHref, socials, WHATSAPP } from "@/data/site";
export default function Footer({
  onPreferences,
}: {
  onPreferences: () => void;
}) {
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
                  {s.title.replace(" em IA", "")}
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
                      ? "Apps e Agentes de IA"
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
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              {cmsText("+55 (11) 93068-3562")}
              <ArrowUpRight size={15} />
            </a>
            <a href={cmsHref("mailto:marketing@onsmart.ai")}>
              {cmsText("marketing@onsmart.ai")}
            </a>
            <div className="footer-address">
              <p className="footer-address-validation">
                {cmsText(
                  "Endereços fornecidos no briefing · validação pendente."
                )}
              </p>
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
            <Link href={cmsHref("/previa/legal/privacidade")}>
              {cmsText("Privacidade")}
            </Link>
            <Link href={cmsHref("/previa/legal/cookies")}>
              {cmsText("Cookies")}
            </Link>
            <button onClick={onPreferences}>
              {cmsText("Preferências de cookies")}
            </button>
            <Link href={cmsHref("/previa/legal/termos")}>
              {cmsText("Termos de uso")}
            </Link>
          </div>
        </div>
        <p className="footer-prototype">
          {cmsText(
            "Ambiente de homologação · Não publicado · Conteúdos e materiais sinalizados aguardam validação antes de publicação. Privacidade:"
          )}{" "}
          <a href={cmsHref("mailto:juridico@onsmart.ai")}>
            {cmsText("juridico@onsmart.ai")}
          </a>
        </p>
      </div>
    </footer>
  );
}
