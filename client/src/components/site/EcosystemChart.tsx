import { companies } from "@/data/site";
import { CompanyLogo, type CompanyId } from "./CompanyLogo";
import "./ecosystem-chart.css";
export default function EcosystemChart() {
  return (
    <nav className="ecosystem-chart" aria-label="Empresas do Grupo Onsmart">
      <div className="ecosystem-chart-root">Grupo Onsmart</div>
      <div className="ecosystem-chart-branches">
        {companies.map(company => (
          <a
            key={company.id}
            className={`ecosystem-chart-card ecosystem-chart-card-${company.id}`}
            href={`#${company.id}`}
            aria-label={`Conhecer ${company.name}`}
          >
            <CompanyLogo id={company.id as CompanyId} />
          </a>
        ))}
      </div>
    </nav>
  );
}
