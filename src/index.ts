// Provider
export { CopilotProvider, useCopilotContext, type CopilotProviderProps } from "./components/CopilotProvider";

// Hooks
export { useCopilot, type UseCopilotReturn } from "./hooks/useCopilot";
export { useCopilotActivity } from "./hooks/useCopilotActivity";

// Core utilities (for building your own components)
export { fetchToken } from "./core/connection";
export { createActivityMiddleware } from "./core/store";

// Types
export type {
  Activity,
  Attachment,
  CardAction,
  CopilotConfig,
  ConnectionStatus,
  TokenResponse,
} from "./core/types";
