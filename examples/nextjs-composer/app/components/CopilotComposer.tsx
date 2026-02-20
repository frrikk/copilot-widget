"use client";

import { useMemo, type ReactNode } from "react";
import { useCopilotContext } from "@frikkdev/copilot-widget";

/**
 * CopilotComposer — Mode B reference implementation.
 *
 * Wraps WebChat's <Composer> without <BasicWebChat>, giving children
 * access to all WebChat hooks while rendering zero default UI.
 * Copy this into your project and customize as needed.
 */
export interface CopilotComposerProps {
  children: ReactNode;
  styleOptions?: Record<string, unknown>;
}

export function CopilotComposer({
  children,
  styleOptions,
}: CopilotComposerProps) {
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

  try {
    const WebChat = require("botframework-webchat");
    const Composer = WebChat.Components?.Composer ?? WebChat.Composer;
    if (!Composer) return <>{children}</>;

    return (
      <Composer directLine={directLine} store={store} styleOptions={styleOptions}>
        {children}
      </Composer>
    );
  } catch {
    return <>{children}</>;
  }
}
