"use client";

import { CopilotProvider } from "@frikkdev/copilot-widget";
import { ChatWidget } from "./components/ChatWidget";

export default function Home() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid #eee" }}>
        <h1 style={{ margin: 0, fontSize: "1.25rem" }}>
          Copilot Widget — Standard Mode
        </h1>
      </header>

      <main style={{ flex: 1, display: "flex" }}>
        <CopilotProvider
          tokenEndpoint="/api/copilot/token"
          onActivity={(activity) => {
            // Example: log all incoming activities
            console.log("[Activity]", activity.type, activity);
          }}
        >
          <ChatWidget
            styleOptions={{
              // Customize the WebChat UI
              bubbleBackground: "#f5f5f5",
              bubbleFromUserBackground: "#00543e",
              bubbleFromUserTextColor: "#ffffff",
              sendBoxBackground: "#fafafa",
              hideUploadButton: true,
            }}
          />
        </CopilotProvider>
      </main>
    </div>
  );
}
