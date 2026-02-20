import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CopilotProvider } from "copilot-widget";
import { ChatWidget } from "./components/ChatWidget";

function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid #eee" }}>
        <h1 style={{ margin: 0, fontSize: "1.25rem" }}>
          Copilot Widget — React Vite
        </h1>
      </header>

      <main style={{ flex: 1 }}>
        <CopilotProvider tokenEndpoint="/api/copilot/token">
          <ChatWidget />
        </CopilotProvider>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
