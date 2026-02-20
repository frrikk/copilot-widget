import { useMemo } from "react";
import { useCopilotContext } from "copilot-widget";

/**
 * ChatWidget — Mode A reference implementation.
 * Copy this into your project and customize as needed.
 */
export function ChatWidget({
  styleOptions,
  ...rest
}: {
  styleOptions?: Record<string, unknown>;
  [key: string]: unknown;
}) {
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

  const WebChat = require("botframework-webchat");
  const ReactWebChat = WebChat.default || WebChat.ReactWebChat || WebChat;

  return <ReactWebChat directLine={directLine} store={store} styleOptions={styleOptions} {...rest} />;
}
