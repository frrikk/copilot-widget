import type { Activity } from "./types";

/**
 * Action types dispatched by Direct Line in the WebChat Redux store.
 */
const INCOMING_ACTIVITY = "DIRECT_LINE/INCOMING_ACTIVITY";

interface IncomingActivityAction {
  type: typeof INCOMING_ACTIVITY;
  payload: { activity: Activity };
}

type StoreAction = IncomingActivityAction | { type: string; [key: string]: unknown };

/**
 * Create a WebChat Redux store with middleware that intercepts all incoming
 * activities and surfaces them via the `onActivity` callback.
 *
 * This is the core of the event system — every message, event, typing indicator,
 * and conversation update from Copilot Studio flows through here.
 */
export function createCopilotStore(options: {
  onActivity?: (activity: Activity) => void;
}) {
  // Dynamic import would complicate the sync store creation.
  // Instead, we return the middleware enhancer and let the component call createStore.
  return {
    middleware: createActivityMiddleware(options.onActivity),
  };
}

/**
 * Redux middleware that intercepts incoming activities.
 */
export function createActivityMiddleware(
  onActivity?: (activity: Activity) => void
) {
  return () =>
    (next: (action: StoreAction) => unknown) =>
    (action: StoreAction) => {
      if (action.type === INCOMING_ACTIVITY) {
        const activity = (action as IncomingActivityAction).payload.activity;
        onActivity?.(activity);
      }
      return next(action);
    };
}
