import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchToken } from "../core/connection";
import { createActivityMiddleware } from "../core/store";
import { emitActivity } from "../hooks/useCopilotActivity";
import type { Activity, ConnectionStatus, CopilotConfig } from "../core/types";

// ---------- context shape ----------

interface CopilotContextValue {
  /** The DirectLine instance (null until connected) */
  directLine: unknown | null;
  /** The WebChat store middleware for activity interception */
  storeMiddleware: ReturnType<typeof createActivityMiddleware>;
  /** Connection status */
  status: ConnectionStatus;
  /** Send a named event to Copilot Studio */
  sendEvent: (name: string, value?: unknown) => void;
  /** Send any arbitrary activity */
  postActivity: (activity: Partial<Activity>) => void;
  /** Subscribe to all incoming activities */
  onActivity?: (activity: Activity) => void;
}

const CopilotContext = createContext<CopilotContextValue | null>(null);

// ---------- provider ----------

export interface CopilotProviderProps extends CopilotConfig {
  children: ReactNode;
}

export function CopilotProvider({
  tokenEndpoint,
  directLineDomain,
  onActivity,
  children,
}: CopilotProviderProps) {
  const [directLine, setDirectLine] = useState<unknown | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("uninitialized");
  const directLineRef = useRef<unknown>(null);
  const onActivityRef = useRef(onActivity);
  onActivityRef.current = onActivity;

  // Activity interception middleware — stable reference, delegates to latest onActivity
  // Also emits to the global listener set so useCopilotActivity hooks receive events
  const storeMiddleware = useMemo(
    () =>
      createActivityMiddleware((activity) => {
        onActivityRef.current?.(activity);
        emitActivity(activity);
      }),
    []
  );

  // Connect on mount
  useEffect(() => {
    let cancelled = false;

    async function connect() {
      setStatus("connecting");
      try {
        const { token } = await fetchToken(tokenEndpoint);
        if (cancelled) return;

        const { createDirectLine } = await import("botframework-webchat");
        if (cancelled) return;

        const dl = createDirectLine({ token, domain: directLineDomain });
        directLineRef.current = dl;
        setDirectLine(dl);
        setStatus("connected");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    connect();
    return () => {
      cancelled = true;
    };
  }, [tokenEndpoint, directLineDomain]);

  // Send a named event
  const sendEvent = useCallback(
    (name: string, value?: unknown) => {
      const dl = directLineRef.current as {
        postActivity: (activity: Record<string, unknown>) => { subscribe: () => void };
      } | null;
      if (!dl) return;

      dl.postActivity({
        type: "event",
        name,
        value,
        from: { role: "user" },
      }).subscribe();
    },
    []
  );

  // Send any arbitrary activity
  const postActivity = useCallback(
    (activity: Partial<Activity>) => {
      const dl = directLineRef.current as {
        postActivity: (activity: Record<string, unknown>) => { subscribe: () => void };
      } | null;
      if (!dl) return;

      dl.postActivity({
        from: { role: "user" },
        ...activity,
      } as Record<string, unknown>).subscribe();
    },
    []
  );

  const value = useMemo<CopilotContextValue>(
    () => ({ directLine, storeMiddleware, status, sendEvent, postActivity, onActivity }),
    [directLine, storeMiddleware, status, sendEvent, postActivity, onActivity]
  );

  return (
    <CopilotContext.Provider value={value}>{children}</CopilotContext.Provider>
  );
}

// ---------- context hook ----------

export function useCopilotContext(): CopilotContextValue {
  const ctx = useContext(CopilotContext);
  if (!ctx) {
    throw new Error("useCopilotContext must be used within a <CopilotProvider>");
  }
  return ctx;
}
