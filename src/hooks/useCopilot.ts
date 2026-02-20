import { useCopilotContext } from "../components/CopilotProvider";
import type { Activity, ConnectionStatus } from "../core/types";

export interface UseCopilotReturn {
  /** Connection status */
  status: ConnectionStatus;
  /** Send a named event to Copilot Studio */
  sendEvent: (name: string, value?: unknown) => void;
  /** Send any arbitrary activity to Copilot Studio */
  postActivity: (activity: Partial<Activity>) => void;
  /** The raw DirectLine instance (escape hatch) */
  directLine: unknown | null;
}

/**
 * Main consumer hook — provides send capabilities and connection status.
 *
 * Works in both Mode A (ChatWidget) and Mode B (CopilotComposer).
 *
 * ```tsx
 * const { sendEvent, postActivity, status } = useCopilot();
 * sendEvent('user:selectedProduct', { productId: '123' });
 * ```
 */
export function useCopilot(): UseCopilotReturn {
  const { status, sendEvent, postActivity, directLine } = useCopilotContext();

  return {
    status,
    sendEvent,
    postActivity,
    directLine,
  };
}
