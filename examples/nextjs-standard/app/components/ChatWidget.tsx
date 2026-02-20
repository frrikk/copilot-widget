"use client";

import { useMemo } from "react";
import { useCopilotContext } from "copilot-widget";

/**
 * ChatWidget — Mode A reference implementation.
 *
 * Wraps ReactWebChat with our CopilotProvider's store middleware.
 * Copy this into your project and customize as needed.
 *
 * All WebChat-native props (styleOptions, activityMiddleware, etc.)
 * are passed straight through to <ReactWebChat>.
 */
export interface ChatWidgetProps {
  styleOptions?: Record<string, unknown>;
  activityMiddleware?: unknown;
  attachmentMiddleware?: unknown;
  [key: string]: unknown;
}

export function ChatWidget({
  styleOptions,
  activityMiddleware,
  attachmentMiddleware,
  ...rest
}: ChatWidgetProps) {
  const { directLine, storeMiddleware } = useCopilotContext();

  const store = useMemo(() => {
    try {
      const WebChat = require("botframework-webchat");
      return WebChat.createStore({}, storeMiddleware);
    } catch {
      return undefined;
    }
  }, [storeMiddleware]);

  if (!directLine || !store) {
    return null;
  }

  // By the time we render, botframework-webchat is already loaded
  const WebChat = require("botframework-webchat");
  const ReactWebChat = WebChat.default || WebChat.ReactWebChat || WebChat;

  return (
    <ReactWebChat
      directLine={directLine}
      store={store}
      styleOptions={styleOptions}
      activityMiddleware={activityMiddleware}
      attachmentMiddleware={attachmentMiddleware}
      {...rest}
    />
  );
}
