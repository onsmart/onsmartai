import { Link } from "wouter";
import { MARKETING_EMAIL } from "@shared/contact";

const updatedAt = "October 26, 2025";

export function TermsOfUseEn() {
  return (
    <>
      <p className="legal-updated">Last updated: {updatedAt}</p>
      <h2>1. Acceptance</h2>
      <p>
        By accessing and using the Onsmart.AI website, you agree to these Terms
        of Use. If you do not agree, please stop browsing the site.
      </p>
      <h2>2. Scope</h2>
      <p>
        The site provides institutional and commercial information about
        education, consulting, development of artificial intelligence solutions,
        and the SON.IA platform. Content is for informational purposes; definitive
        contractual terms appear in specific proposals and contracts.
      </p>
      <h2>3. Permitted use</h2>
      <p>You must use the site lawfully and must not:</p>
      <ul>
        <li>
          attempt to breach security, overload infrastructure, or access
          restricted areas;
        </li>
        <li>
          reproduce protected materials without authorization, except limited
          personal, non-commercial use;
        </li>
        <li>
          submit unlawful, offensive content or content that violates third-party
          rights through forms or contact channels.
        </li>
      </ul>
      <h2>4. Intellectual property</h2>
      <p>
        Trademarks, logos, text, images, videos, layout, and other site content
        belong to Onsmart.AI, the Onsmart Group, or licensors and are protected
        by applicable law. Unauthorized use may constitute infringement.
      </p>
      <h2>5. Forms and communications</h2>
      <p>
        By submitting forms, you declare that the information is accurate and
        authorize Onsmart.AI to contact you in accordance with the{" "}
        <Link href="/legal/privacidade">Privacy Policy</Link>. Official channels
        include commercial WhatsApp (+55 11 93068-3562) and{" "}
        <a href={`mailto:${MARKETING_EMAIL}`}>{MARKETING_EMAIL}</a>.
      </p>
      <h2>6. Limitation of liability</h2>
      <p>
        We make reasonable efforts to keep information up to date but do not
        guarantee that the site is error-free or uninterrupted. Business
        decisions should rely on due diligence and formal proposals. Onsmart.AI is
        not liable for indirect damages arising from use of the site, to the
        extent permitted by law.
      </p>
      <h2>7. Third-party links</h2>
      <p>
        External links are provided for convenience. Onsmart.AI does not endorse
        or assume responsibility for content or practices on third-party sites.
      </p>
      <h2>8. Changes to these terms</h2>
      <p>
        We may revise these Terms at any time. Continued use after changes are
        published constitutes acknowledgment of the current version.
      </p>
      <h2>9. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by the laws of the Federative Republic of
        Brazil. The courts of São Paulo/SP are chosen as venue, except where
        mandatory consumer protection rules provide otherwise.
      </p>
      <h2>10. Contact</h2>
      <p>
        Questions about these Terms:{" "}
        <a href="mailto:juridico@onsmart.ai">juridico@onsmart.ai</a>
      </p>
    </>
  );
}
