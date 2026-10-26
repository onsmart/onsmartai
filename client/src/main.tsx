import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { CmsProvider } from "./components/cms/CmsProvider";
import { TrpcProvider } from "./lib/TrpcProvider";
import "./index.css";
import "./round-theme.css";
const root = document.getElementById("root")!;
if (root.hasChildNodes())
  hydrateRoot(
    root,
    <TrpcProvider>
      <CmsProvider>
        <App />
      </CmsProvider>
    </TrpcProvider>
  );
else
  createRoot(root).render(
    <TrpcProvider>
      <CmsProvider>
        <App />
      </CmsProvider>
    </TrpcProvider>
  );
