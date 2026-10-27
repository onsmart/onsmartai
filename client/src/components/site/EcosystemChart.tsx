import { useSiteContent } from "@/data/site-content";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { CompanyLogo, type CompanyId } from "./CompanyLogo";
import "./ecosystem-chart.css";

export default function EcosystemChart() {
  const { companies } = useSiteContent();
  const { t } = useSiteCopy();
  return (
    <nav
      className="ecosystem-chart"
      aria-label={t("shell.ecosystemChartA11y")}
    >
      <div className="ecosystem-chart-root">{t("shell.ecosystemGroupRoot")}</div>
      <div className="ecosystem-chart-branches">
        {companies.map(company => (
          <a
            key={company.id}
            className={`ecosystem-chart-card ecosystem-chart-card-${company.id}`}
            href={`#${company.id}`}
            aria-label={company.name}
          >
            <CompanyLogo id={company.id as CompanyId} />
          </a>
        ))}
      </div>
    </nav>
  );
}
