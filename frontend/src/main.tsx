import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme
const saved = localStorage.getItem("oceanguard-theme") || "dark";
document.documentElement.classList.add(saved);

createRoot(document.getElementById("root")!).render(<App />);
