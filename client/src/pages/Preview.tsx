import CmsArticle from "./CmsArticle";
import { ButtonLink } from "@/components/site/Common";
import SolutionLanding from "./SolutionLanding";
import Partners from "./Partners";
import { useSiteCopy } from "@/i18n/useSiteCopy";

export default function Preview({
  params,
}: {
  params: { type: string; slug: string };
}) {
  const { type, slug } = params;
  if (type === "solucao") return <SolutionLanding params={{ slug }} />;
  if (type === "conteudo") return <CmsArticle params={{ slug }} />;
  if (type === "parcerias" && slug === "programa") return <Partners />;
  return <Missing />;
}
function Missing() {
  const { t } = useSiteCopy();
  return (
    <section className="not-found">
      <div className="container">
        <p className="eyebrow">{t("errors.notFoundEyebrow")}</p>
        <h1>{t("errors.pageUnavailableTitle")}</h1>
        <p>{t("errors.pageUnavailableBody")}</p>
        <ButtonLink href="/" variant="outline">
          {t("errors.backHome")}
        </ButtonLink>
      </div>
    </section>
  );
}
