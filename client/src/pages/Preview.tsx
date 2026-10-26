import CmsArticle from "./CmsArticle";
import { ButtonLink } from "@/components/site/Common";
import SolutionLanding from "./SolutionLanding";
import Partners from "./Partners";
export default function Preview({
  params,
}: {
  params: { type: string; slug: string };
}) {
  const { type, slug } = params;
  if (type === "solucao") return <SolutionLanding params={{ slug }} />;
  if(type==="conteudo")return <CmsArticle params={{slug}}/>;
  if (type === "parcerias" && slug === "programa") return <Partners />;
  return <Missing />;
}
function Missing() {
  return (
    <section className="not-found">
      <div className="container">
        <p className="eyebrow">Destino não encontrado</p>
        <h1>Esta página não está disponível.</h1>
        <p>Verifique o endereço ou volte à página inicial.</p>
        <ButtonLink href="/" variant="outline">
          Voltar à Home
        </ButtonLink>
      </div>
    </section>
  );
}
