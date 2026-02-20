"use client";

import { useState, useCallback, type FormEvent } from "react";
import {
  CopilotProvider,
  useCopilot,
  useCopilotActivity,
  type Activity,
} from "@tieto/copilot-widget";
import { CopilotComposer } from "./components/CopilotComposer";

// Import WebChat hooks — available inside CopilotComposer
import { hooks } from "botframework-webchat";
const { useActivities, useSendMessage, useConnectivityStatus } = hooks;

export default function Home() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid #eee" }}>
        <h1 style={{ margin: 0, fontSize: "1.25rem" }}>
          Copilot Widget — Composer Mode (Custom UI)
        </h1>
      </header>

      <CopilotProvider tokenEndpoint="/api/copilot/token">
        <CopilotComposer>
          <CustomChatUI />
        </CopilotComposer>
      </CopilotProvider>
    </div>
  );
}

/**
 * Fully custom chat UI — uses WebChat hooks for data,
 * your own components for rendering.
 */
function CustomChatUI() {
  const [input, setInput] = useState("");

  // WebChat native hooks
  const [activities] = useActivities();
  const sendMessage = useSendMessage();
  const [connectivityStatus] = useConnectivityStatus();

  // Our convenience hooks
  const { sendEvent } = useCopilot();

  // Listen for specific events from Copilot Studio
  useCopilotActivity("event", "order:confirmed", (activity: Activity) => {
    console.log("Order confirmed!", activity.value);
  });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      sendMessage(input.trim());
      setInput("");
    },
    [input, sendMessage]
  );

  // Filter to only show message activities
  const messages = activities.filter(
    (a: Activity) => a.type === "message" && a.text
  );

  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: 640,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Connection status */}
      <div
        style={{
          padding: "0.5rem 1rem",
          fontSize: "0.75rem",
          color: connectivityStatus === "connected" ? "#16a34a" : "#ea580c",
        }}
      >
        {connectivityStatus === "connected"
          ? "● Connected"
          : `○ ${connectivityStatus}`}
      </div>

      {/* Messages — your own components here */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {messages.map((activity: Activity, i: number) => (
          <div
            key={activity.id ?? i}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 12,
              maxWidth: "80%",
              alignSelf:
                activity.from.role === "user" ? "flex-end" : "flex-start",
              background:
                activity.from.role === "user" ? "#00543e" : "#f0f0f0",
              color: activity.from.role === "user" ? "#fff" : "#1a1a1a",
            }}
          >
            {activity.text}
          </div>
        ))}
      </div>

      {/* Input — your own component here */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "0.5rem",
          padding: "1rem",
          borderTop: "1px solid #eee",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: 8,
            border: "none",
            background: "#00543e",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Send
        </button>
      </form>

      {/* Example: button to send a custom event */}
      <div style={{ padding: "0 1rem 1rem", textAlign: "center" }}>
        <button
          onClick={() => sendEvent("user:greeting", { locale: "nb-NO" })}
          style={{
            fontSize: "0.75rem",
            color: "#666",
            background: "none",
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: "0.35rem 0.75rem",
            cursor: "pointer",
          }}
        >
          Send greeting event →
        </button>
      </div>
    </main>
  );
}
