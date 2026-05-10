import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// HelmetProvider is already inside App.tsx — no need to wrap here
createRoot(document.getElementById("root")!).render(
    <App />
);
