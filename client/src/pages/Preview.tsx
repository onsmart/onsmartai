import CmsArticle from "./CmsArticle";
import { Link } from "wouter";
import { ButtonLink, Notice, PageHero } from "@/components/site/Common";
import { editorial, solutions, WHATSAPP } from "@/data/site";
import SolutionLanding from "./SolutionLanding";
import Partners from "./Partners";
export default function Preview({
  params,
}: {
  params: { type: string; slug: string };
}) {
  const { type, slug } = params;
  if (type === "legal") {
    const titles: Record<string, string> = {
      privacidade: "Política de privacidade",
      cookies: "Política de cookies",
      termos: "Termos de uso",
    };
    if (!titles[slug]) return <Missing />;
    return (
      <>
        <PageHero
          eyebrow="Rascunho para revisão jurídica"
          title={titles[slug]}
          text="Este conteúdo é uma estrutura preliminar do protótipo. Não substitui a política definitiva nem a revisão do responsável legal."
        />
        <section className="section">
          <div className="container preview-section legal-copy">
            <div className="preview-label">
              Documento não aprovado para publicação. A operação definitiva, os
              fornecedores, prazos e bases legais serão confirmados antes do
              lançamento.
            </div>
            <h2>Escopo deste protótipo</h2>
            <p>
              As Fases 1 e 2 apresentam páginas e interações demonstrativas. Os
              formulários validam os campos no navegador, mas não enviam nem
              armazenam as informações pessoais preenchidas. A demonstração
              visual SON.IA não recebe mensagens nem realiza atendimento por IA.
            </p>
            <h2>Preferências locais</h2>
            <p>
              A escolha de consentimento pode ser armazenada no navegador sob a
              chave “onsmart-consent-v1”, com categorias selecionadas e data da
              escolha. É possível reabrir as preferências pelo rodapé. As
              integrações de analytics e marketing do site não estão instaladas
              nesta fase. A infraestrutura de hospedagem pode manter registros
              técnicos próprios.
            </p>
            <h2>Canais externos</h2>
            <p>
              Links para WhatsApp, redes sociais e outros sites abrem serviços
              externos. O visitante decide se deseja acessar esses canais, que
              possuem suas próprias políticas.
            </p>
            <h2>Responsável pela revisão</h2>
            <p>
              As informações do controlador, finalidades, bases legais, direitos
              dos titulares, retenção, segurança e eventuais transferências
              internacionais deverão ser definidos pelo responsável jurídico
              conforme a operação real.
            </p>
            <p>
              Canal de privacidade informado:{" "}
              <a className="preview-source" href="mailto:juridico@onsmart.ai">
                juridico@onsmart.ai
              </a>
              .
            </p>
            <ButtonLink href="/" variant="outline">
              Voltar para a Home
            </ButtonLink>
          </div>
        </section>
      </>
    );
  }
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
        <h1>Esta prévia não está disponível.</h1>
        <p>
          Escolha uma das seis páginas principais para continuar a navegação.
        </p>
        <ButtonLink href="/" variant="outline">
          Voltar à Home
        </ButtonLink>
      </div>
    </section>
  );
}
