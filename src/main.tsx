import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { iniciarClarity } from "./lib/clarity";
import "./styles/index.css";

iniciarClarity((import.meta as any).env?.VITE_CLARITY_PROJECT_ID);

createRoot(document.getElementById("root")!).render(<App />);
