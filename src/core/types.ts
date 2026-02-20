/** Direct Line Activity — the universal message/event envelope */
export interface Activity {
  type: "message" | "event" | "typing" | "conversationUpdate" | string;
  name?: string;
  value?: unknown;
  text?: string;
  from: { id: string; name?: string; role: "bot" | "user" | "channel" };
  id?: string;
  timestamp?: string;
  channelData?: Record<string, unknown>;
  attachments?: Attachment[];
  suggestedActions?: { actions: CardAction[] };
  [key: string]: unknown;
}

export interface Attachment {
  contentType: string;
  contentUrl?: string;
  content?: unknown;
  name?: string;
  thumbnailUrl?: string;
}

export interface CardAction {
  type: string;
  title: string;
  value: unknown;
  image?: string;
}

/** Configuration for the Copilot connection */
export interface CopilotConfig {
  /** URL of your server-side token endpoint */
  tokenEndpoint: string;
  /** Optional: Direct Line domain override (e.g. for sovereign clouds) */
  directLineDomain?: string;
  /** Called for every incoming activity from Copilot Studio */
  onActivity?: (activity: Activity) => void;
}

/** Connection status exposed to consumers */
export type ConnectionStatus =
  | "uninitialized"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "ended"
  | "error";

/** Token response from the server endpoint */
export interface TokenResponse {
  token: string;
  conversationId?: string;
  expires_in?: number;
}
