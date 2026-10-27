import type { ReactNode } from "react";
import { ButtonLink, PageHero } from "@/components/site/Common";
import { PrivacyPolicyEn } from "@/i18n/legal/privacy.en";
import { PrivacyPolicyEs } from "@/i18n/legal/privacy.es";
import { PrivacyPolicyPt } from "@/i18n/legal/privacy.pt-BR";
import { TermsOfUseEn } from "@/i18n/legal/terms.en";
import { TermsOfUseEs } from "@/i18n/legal/terms.es";
import { TermsOfUsePt } from "@/i18n/legal/terms.pt-BR";
import { useLocale } from "@/i18n/LocaleProvider";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import type { SiteLocale } from "@shared/locale";

function privacyForLocale(locale: SiteLocale) {
  switch (locale) {
    case "en":
      return <PrivacyPolicyEn />;
    case "es":
      return <PrivacyPolicyEs />;
    default:
      return <PrivacyPolicyPt />;
  }
}

function termsForLocale(locale: SiteLocale) {
  switch (locale) {
    case "en":
      return <TermsOfUseEn />;
    case "es":
      return <TermsOfUseEs />;
    default:
      return <TermsOfUsePt />;
  }
}

export default function Legal({ params }: { params: { slug: string } }) {
  const { locale } = useLocale();
  const { t } = useSiteCopy();

  const pages: Record<
    string,
    { title: string; intro: string; body: ReactNode }
  > = {
    privacidade: {
      title: t("legal.privacyTitle"),
      intro: t("legal.privacyIntro"),
      body: privacyForLocale(locale),
    },
    termos: {
      title: t("legal.termsTitle"),
      intro: t("legal.termsIntro"),
      body: termsForLocale(locale),
    },
  };

  const page = pages[params.slug];
  if (!page) {
    return (
      <section className="not-found">
        <div className="container">
          <p className="eyebrow">{t("errors.notFoundEyebrow")}</p>
          <h1>{t("errors.legalNotFoundTitle")}</h1>
          <ButtonLink href="/" variant="outline">
            {t("errors.backHome")}
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={t("legal.eyebrow")}
        title={page.title}
        text={page.intro}
      />
      <section className="section">
        <div className="container preview-section legal-copy">{page.body}</div>
      </section>
    </>
  );
}
