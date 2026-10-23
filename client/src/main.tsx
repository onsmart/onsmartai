import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { CmsProvider } from "./components/cms/CmsProvider";
import "./index.css";
import "./round-theme.css";
const root = document.getElementById("root")!;
if (root.hasChildNodes())
  hydrateRoot(
    root,
    <CmsProvider>
      <App />
    </CmsProvider>
  );
else
  createRoot(root).render(
    <CmsProvider>
      <App />
    </CmsProvider>
  );
