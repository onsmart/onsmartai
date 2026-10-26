import { useState } from "react";
import { safeCmsUrl } from "@shared/cms";
import { Plus, Minus } from "lucide-react";
import { useCms, useCmsCopy } from "@/components/cms/CmsProvider";
import { solutions, solutionHref } from "@/data/site";
import { getCommercial, type LandingData } from "@/data/commercial";
import {
  getPhoto,
  photoForSolution,
  resolvePhotoUrl,
} from "@/data/photography";
import { ButtonLink, Notice, SectionHeading } from "./Common";
import { SoniaCharacter } from "./BrandMedia";
import "./solution-showcase.css";
export default function SolutionShowcase() {
  const [active, setActive] = useState("consultoria-em-ia");
  const { documents } = useCms();
  const { text: cmsText, image: cmsImage } = useCmsCopy();
  const chosen = solutions.find(s => s.slug === active)!;
  const document = documents.find(
    d => d.key === solutionHref(active) && d.locale === "pt-BR"
  );
  const data =
    (document?.payload.fields as LandingData | undefined) ||
    getCommercial(active);
  const photo =
    active === "sonia" ? undefined : getPhoto(photoForSolution(active));
  const image = photo ? cmsImage(photo.url) : undefined;
  const summary = document?.payload.summary || data?.lead || chosen.description;
  return (
    <section className="section products-section visual-products-section">
      <div className="container">
        <div className="products-heading">
          <SectionHeading
            eyebrow="Do aprendizado à operação"
            title="Produtos de IA para empresas"
            text="Programas para a sua empresa entender, adotar e governar a IA, e uma plataforma para colocar tudo em operação."
          />
          <ButtonLink href="/servicos" variant="outline">
            Explorar o portfólio
          </ButtonLink>
        </div>
        <div className="solution-showcase">
          <figure
            className={`solution-showcase-visual ${active === "sonia" ? "showcase-sonia" : ""} ${photo && photo.height > photo.width ? "showcase-portrait" : ""}`}
            id="solution-showcase-panel"
            aria-labelledby={`showcase-select-${active}`}
          >
            <div className="showcase-picture">
              {active === "sonia" ? (
                <SoniaCharacter />
              ) : image && photo ? (
                <img
                  src={resolvePhotoUrl(
                    safeCmsUrl(document?.payload.imageUrl || "") || image.url
                  )}
                  alt={document?.payload.imageAlt || image.alt || photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
            </div>
            <figcaption className="showcase-caption" aria-live="polite">
              <span className="showcase-category">{chosen.category}</span>
              <h3>{cmsText(chosen.title)}</h3>
              <p>{cmsText(summary)}</p>
              <span className="showcase-photo-note">
                {active === "sonia"
                  ? "Personagem oficial SON.IA · sem simular a interface da plataforma."
                  : "Fotografia ilustrativa · não representa a equipe ou um evento da Onsmart."}
              </span>
            </figcaption>
          </figure>
          <div className="solution-showcase-options">
            <h3>Encontre o próximo passo.</h3>
            <div role="group" aria-label="Selecionar uma solução de IA">
              {solutions.map(solution => (
                <div
                  className={`showcase-option ${active === solution.slug ? "active" : ""}`}
                  key={solution.slug}
                >
                  <button
                    type="button"
                    id={`showcase-select-${solution.slug}`}
                    onClick={() => setActive(solution.slug)}
                    aria-expanded={active === solution.slug}
                    aria-controls="solution-showcase-panel"
                  >
                    <span>
                      {cmsText(solution.title)}
                      <small>{solution.category}</small>
                    </span>
                    {active === solution.slug ? (
                      <Minus size={21} aria-hidden="true" />
                    ) : (
                      <Plus size={21} aria-hidden="true" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="showcase-action">
              <ButtonLink href={solutionHref(active)}>
                {cmsText(chosen.cta)}
              </ButtonLink>
              <p>
                Educação, serviços e plataforma para diferentes etapas da sua
                empresa.
              </p>
            </div>
          </div>
        </div>
        <Notice>
          Cada solução tem página dedicada com escopo, público e formas de
          contato com a equipe Onsmart.AI.
        </Notice>
      </div>
    </section>
  );
}
