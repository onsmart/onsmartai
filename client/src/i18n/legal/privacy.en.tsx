import { MARKETING_EMAIL } from "@shared/contact";

const updatedAt = "October 26, 2025";

export function PrivacyPolicyEn() {
  return (
    <>
      <p className="legal-updated">Last updated: {updatedAt}</p>
      <h2>1. Who we are</h2>
      <p>
        This Privacy Policy describes how <strong>Onsmart.AI</strong>, a company
        of the Onsmart Group, processes personal data on the{" "}
        <strong>onsmart.ai</strong> website and related channels. Addresses: Rua
        Arizona, 1349, Suite 1B, Cidade Monções, São Paulo/SP, Brazil; Rua
        Comendador Araújo, 499, Suite 1003, Centro, Curitiba/PR, Brazil.
      </p>
      <h2>2. Data we may process</h2>
      <ul>
        <li>
          <strong>Browsing:</strong> IP address, browser type, pages visited,
          date and time of access, and similar technical data generated through
          use of the site.
        </li>
        <li>
          <strong>Contact and marketing:</strong> name, email, phone number,
          company, subject, and message when you complete forms or request
          content.
        </li>
        <li>
          <strong>Cookie preferences:</strong> accepted categories and the date
          of your choice, stored locally in your browser.
        </li>
        <li>
          <strong>CMS and administration:</strong> authentication data of
          authorized users in the administrative panel, where applicable.
        </li>
      </ul>
      <h2>3. Purposes and legal bases</h2>
      <p>We process personal data to:</p>
      <ul>
        <li>
          respond to commercial and support requests (performance of preliminary
          procedures or consent);
        </li>
        <li>
          send content and communications about corporate AI when you authorize
          us to do so (consent);
        </li>
        <li>
          operate, protect, and improve the site, including usage metrics when
          analytics cookies are accepted (legitimate interest or consent,
          depending on the category);
        </li>
        <li>
          comply with legal obligations and exercise rights in judicial or
          administrative proceedings (legal obligation or legitimate interest).
        </li>
      </ul>
      <h2 id="cookies">4. Cookies and similar technologies</h2>
      <p>
        We use essential cookies for the site to function and, with your
        authorization, analytics and marketing cookies. You can manage your
        preferences through the cookie banner or the{" "}
        <strong>Cookie preferences</strong> link in the footer. The local key{" "}
        <code>onsmart-consent-v1</code> records your choice in the browser.
      </p>
      <h2>5. Sharing</h2>
      <p>
        We may share data with hosting providers, analytics tools, CRM,
        communication, and storage services, always within the purposes of this
        policy and subject to confidentiality and security obligations. We do
        not sell personal data.
      </p>
      <h2>6. Retention</h2>
      <p>
        We retain data for as long as necessary for the purposes described, to
        comply with legal obligations or exercise rights, applying minimization
        criteria and periodic review.
      </p>
      <h2>7. Your rights (LGPD)</h2>
      <p>
        You may request confirmation of processing, access, correction,
        anonymization, portability, deletion, information about sharing,
        withdrawal of consent, and review of automated decisions, under Brazil’s
        General Personal Data Protection Law (Law No. 13.709/2018). To exercise
        your rights, email{" "}
        <a href="mailto:juridico@onsmart.ai">juridico@onsmart.ai</a>.
      </p>
      <h2>8. Security</h2>
      <p>
        We adopt technical and organizational measures appropriate to the nature
        of the data processed. No digital environment is entirely risk-free; in
        the event of a relevant incident, we will take the measures required by
        law.
      </p>
      <h2>9. External links</h2>
      <p>
        The site may contain links to WhatsApp, social networks, YouTube, and
        third-party websites with their own policies. Onsmart.AI does not control
        data processing in those environments.
      </p>
      <h2>10. Changes</h2>
      <p>
        This policy may be updated. The date of the last revision will be shown
        at the top of the page. Material changes may be communicated through the
        site.
      </p>
      <h2>11. Contact</h2>
      <p>
        Data protection officer / privacy channel:{" "}
        <a href="mailto:juridico@onsmart.ai">juridico@onsmart.ai</a>
        <br />
        Commercial contact:{" "}
        <a href={`mailto:${MARKETING_EMAIL}`}>{MARKETING_EMAIL}</a>
      </p>
    </>
  );
}
