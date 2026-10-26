import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { CmsProvider } from "./components/cms/CmsProvider";
import { LocaleProvider } from "./i18n/LocaleProvider";
import { TrpcProvider } from "./lib/TrpcProvider";
import "./index.css";
import "./round-theme.css";
const root = document.getElementById("root")!;
if (root.hasChildNodes())
  hydrateRoot(
    root,
    <TrpcProvider>
      <LocaleProvider>
        <CmsProvider>
          <App />
        </CmsProvider>
      </LocaleProvider>
    </TrpcProvider>
  );
else
  createRoot(root).render(
    <TrpcProvider>
      <LocaleProvider>
        <CmsProvider>
          <App />
        </CmsProvider>
      </LocaleProvider>
    </TrpcProvider>
  );
