import { useEffect, useRef } from "react";
import type { Activity } from "../core/types";

// ---------- internal event emitter for activity subscriptions ----------

type ActivityListener = (activity: Activity) => void;
const listeners = new Set<ActivityListener>();

/** @internal Register a listener. Returns unsubscribe function. */
export function addActivityListener(listener: ActivityListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** @internal Called by CopilotProvider's store middleware for every incoming activity */
export function emitActivity(activity: Activity): void {
  listeners.forEach((listener) => listener(activity));
}

/**
 * Convenience hook to subscribe to specific activity types and/or names
 * from Copilot Studio.
 *
 * Works in both Mode A (ChatWidget) and Mode B (CopilotComposer).
 *
 * ```tsx
 * // Listen for a specific event from Copilot Studio
 * useCopilotActivity('event', 'order:confirmed', (activity) => {
 *   router.push(`/orders/${activity.value.orderId}`);
 * });
 *
 * // Listen for all messages (pass undefined for name to match all)
 * useCopilotActivity('message', undefined, (activity) => {
 *   console.log('Bot said:', activity.text);
 * });
 * ```
 */
export function useCopilotActivity(
  type: Activity["type"],
  name: string | undefined,
  callback: (activity: Activity) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return addActivityListener((activity) => {
      if (activity.type !== type) return;
      if (name !== undefined && activity.name !== name) return;
      callbackRef.current(activity);
    });
  }, [type, name]);
}
