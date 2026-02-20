import type { TokenResponse } from "./types";

/**
 * Fetch a Direct Line token from the consumer's server endpoint.
 * The server endpoint is responsible for exchanging the secret for a token.
 */
export async function fetchToken(tokenEndpoint: string): Promise<TokenResponse> {
  const res = await fetch(tokenEndpoint, { method: "POST" });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Copilot token: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Create a Direct Line instance using the botframework-webchat SDK.
 * This is a thin wrapper that fetches a token first, then calls createDirectLine.
 */
export async function createConnection(options: {
  tokenEndpoint: string;
  directLineDomain?: string;
}) {
  const { token } = await fetchToken(options.tokenEndpoint);

  // Dynamic import so the server entry point doesn't pull in webchat
  const { createDirectLine } = await import("botframework-webchat");

  return createDirectLine({
    token,
    domain: options.directLineDomain,
  });
}
