import { MARKETING_EMAIL } from "@shared/contact";

const updatedAt = "26 de octubre de 2025";

export function PrivacyPolicyEs() {
  return (
    <>
      <p className="legal-updated">Última actualización: {updatedAt}</p>
      <h2>1. Quiénes somos</h2>
      <p>
        Esta Política de Privacidad describe cómo <strong>Onsmart.AI</strong>,
        empresa del Grupo Onsmart, trata datos personales en el sitio{" "}
        <strong>onsmart.ai</strong> y canales asociados. Direcciones: Rua
        Arizona, 1349, Conj. 1B, Cidade Monções, São Paulo/SP, Brasil; Rua
        Comendador Araújo, 499, Cj. 1003, Centro, Curitiba/PR, Brasil.
      </p>
      <h2>2. Datos que podemos tratar</h2>
      <ul>
        <li>
          <strong>Navegación:</strong> dirección IP, tipo de navegador, páginas
          visitadas, fecha y hora de acceso y datos técnicos similares generados
          por el uso del sitio.
        </li>
        <li>
          <strong>Contacto y marketing:</strong> nombre, correo electrónico,
          teléfono, empresa, asunto y mensaje cuando completa formularios o
          solicita contenidos.
        </li>
        <li>
          <strong>Preferencias de cookies:</strong> categorías aceptadas y fecha
          de la elección, almacenadas localmente en el navegador.
        </li>
        <li>
          <strong>CMS y administración:</strong> datos de autenticación de
          usuarios autorizados en el panel administrativo, cuando corresponda.
        </li>
      </ul>
      <h2>3. Finalidades y bases legales</h2>
      <p>Tratamos datos personales para:</p>
      <ul>
        <li>
          responder solicitudes comerciales y de soporte (ejecución de
          procedimientos preliminares o consentimiento);
        </li>
        <li>
          enviar contenidos y comunicaciones sobre IA corporativa, cuando usted
          lo autorice (consentimiento);
        </li>
        <li>
          operar, proteger y mejorar el sitio, incluidas métricas de uso cuando
          se acepten cookies de análisis (interés legítimo o consentimiento,
          según la categoría);
        </li>
        <li>
          cumplir obligaciones legales y ejercer derechos en procesos judiciales
          o administrativos (obligación legal o interés legítimo).
        </li>
      </ul>
      <h2 id="cookies">4. Cookies y tecnologías similares</h2>
      <p>
        Utilizamos cookies esenciales para el funcionamiento del sitio y, con su
        autorización, cookies de análisis y marketing. Puede gestionar sus
        preferencias mediante el banner de cookies o el enlace{" "}
        <strong>Preferencias de cookies</strong> en el pie de página. La clave
        local <code>onsmart-consent-v1</code> registra su elección en el
        navegador.
      </p>
      <h2>5. Compartición</h2>
      <p>
        Podemos compartir datos con proveedores de alojamiento, herramientas de
        análisis, CRM, comunicación y almacenamiento, siempre dentro de las
        finalidades de esta política y con obligaciones de confidencialidad y
        seguridad. No vendemos datos personales.
      </p>
      <h2>6. Conservación</h2>
      <p>
        Conservamos los datos el tiempo necesario para las finalidades
        descritas, el cumplimiento de obligaciones legales o el ejercicio de
        derechos, observando criterios de minimización y revisión periódica.
      </p>
      <h2>7. Sus derechos (LGPD)</h2>
      <p>
        Puede solicitar confirmación de tratamiento, acceso, corrección,
        anonimización, portabilidad, eliminación, información sobre
        comparticiones, revocación del consentimiento y revisión de decisiones
        automatizadas, conforme a la Ley General de Protección de Datos Personales
        de Brasil (Ley n.º 13.709/2018). Para ejercer sus derechos, escriba a{" "}
        <a href="mailto:juridico@onsmart.ai">juridico@onsmart.ai</a>.
      </p>
      <h2>8. Seguridad</h2>
      <p>
        Adoptamos medidas técnicas y organizacionales acordes con la naturaleza
        de los datos tratados. Ningún entorno digital está totalmente libre de
        riesgos; en caso de un incidente relevante, adoptaremos las medidas
        previstas en la ley.
      </p>
      <h2>9. Enlaces externos</h2>
      <p>
        El sitio puede contener enlaces a WhatsApp, redes sociales, YouTube y
        sitios de terceros, con políticas propias. Onsmart.AI no controla el
        tratamiento de datos en esos entornos.
      </p>
      <h2>10. Cambios</h2>
      <p>
        Esta política puede actualizarse. La fecha de la última revisión se
        indicará en la parte superior de la página. Los cambios relevantes
        podrán comunicarse a través del sitio.
      </p>
      <h2>11. Contacto</h2>
      <p>
        Encargado / canal de privacidad:{" "}
        <a href="mailto:juridico@onsmart.ai">juridico@onsmart.ai</a>
        <br />
        Contacto comercial:{" "}
        <a href={`mailto:${MARKETING_EMAIL}`}>{MARKETING_EMAIL}</a>
      </p>
    </>
  );
}
