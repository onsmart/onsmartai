import logos from "@/data/company-logos.json";
import { useCmsCopy } from "@/components/cms/CmsProvider";
import "./identity.css";
export type CompanyId = keyof typeof logos;
export function CompanyLogo({
  id,
  className = "",
  decorative = false,
}: {
  id: CompanyId;
  className?: string;
  decorative?: boolean;
}) {
  const { image } = useCmsCopy();
  const logo = logos[id];
  const asset = image(logo.url);
  return (
    <img
      className={`company-logo company-logo-${id} ${className}`}
      src={asset.url}
      alt={decorative ? "" : logo.name}
      width={logo.width}
      height={logo.height}
      loading={className.includes("primary") ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
