import { Link } from "wouter";
import { MARKETING_EMAIL } from "@shared/contact";

const updatedAt = "26 de octubre de 2025";

export function TermsOfUseEs() {
  return (
    <>
      <p className="legal-updated">Última actualización: {updatedAt}</p>
      <h2>1. Aceptación</h2>
      <p>
        Al acceder y utilizar el sitio de Onsmart.AI, usted acepta estos
        Términos de Uso. Si no está de acuerdo, interrumpa la navegación.
      </p>
      <h2>2. Objeto</h2>
      <p>
        El sitio presenta información institucional y comercial sobre educación,
        consultoría, desarrollo de soluciones de inteligencia artificial y la
        plataforma SON.IA. Los contenidos tienen carácter informativo; las
        condiciones contractuales definitivas constan en propuestas y contratos
        específicos.
      </p>
      <h2>3. Uso permitido</h2>
      <p>Debe utilizar el sitio de forma lícita, sin:</p>
      <ul>
        <li>
          intentar vulnerar la seguridad, sobrecargar la infraestructura o
          acceder a áreas restringidas;
        </li>
        <li>
          reproducir materiales protegidos sin autorización, salvo uso personal
          y no comercial limitado;
        </li>
        <li>
          insertar contenido ilícito, ofensivo o que viole derechos de terceros
          en formularios o canales de contacto.
        </li>
      </ul>
      <h2>4. Propiedad intelectual</h2>
      <p>
        Marcas, logotipos, textos, imágenes, videos, diseño y demás contenidos
        del sitio pertenecen a Onsmart.AI, al Grupo Onsmart o a licenciantes, y
        están protegidos por la legislación aplicable. El uso no autorizado puede
        constituir infracción de derechos.
      </p>
      <h2>5. Formularios y comunicaciones</h2>
      <p>
        Al enviar formularios, usted declara que la información es veraz y
        autoriza el contacto de Onsmart.AI conforme a la{" "}
        <Link href="/legal/privacidade">Política de Privacidad</Link>. Los
        canales oficiales incluyen WhatsApp comercial (+55 11 93068-3562) y{" "}
        <a href={`mailto:${MARKETING_EMAIL}`}>{MARKETING_EMAIL}</a>.
      </p>
      <h2>6. Limitación de responsabilidad</h2>
      <p>
        Realizamos esfuerzos razonables para mantener la información actualizada,
        pero no garantizamos la ausencia de errores o interrupciones. Las
        decisiones de negocio deben considerar la debida diligencia y propuestas
        formales. Onsmart.AI no se responsabiliza por daños indirectos derivados
        del uso del sitio, en la medida permitida por la ley.
      </p>
      <h2>7. Enlaces de terceros</h2>
      <p>
        Los enlaces externos se ofrecen por conveniencia. Onsmart.AI no avala ni
        responde por contenidos o prácticas de sitios de terceros.
      </p>
      <h2>8. Cambios en los términos</h2>
      <p>
        Podemos revisar estos Términos en cualquier momento. El uso continuado
        tras la publicación de cambios implica conocimiento de la versión
        vigente.
      </p>
      <h2>9. Ley y foro</h2>
      <p>
        Estos Términos se rigen por las leyes de la República Federativa del
        Brasil. Se elige el foro de la Comarca de São Paulo/SP, salvo disposición
        legal en contrario aplicable al consumidor.
      </p>
      <h2>10. Contacto</h2>
      <p>
        Dudas sobre estos Términos:{" "}
        <a href="mailto:juridico@onsmart.ai">juridico@onsmart.ai</a>
      </p>
    </>
  );
}
