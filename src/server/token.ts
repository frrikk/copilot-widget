const DEFAULT_DIRECT_LINE_URL =
  "https://directline.botframework.com/v3/directline/tokens/generate";

export interface GenerateTokenOptions {
  /** The Direct Line secret from Copilot Studio */
  secret: string;
  /** Override the token endpoint URL (e.g. for sovereign clouds) */
  directLineUrl?: string;
}

export interface TokenResult {
  token: string;
  conversationId: string;
  expires_in: number;
}

/**
 * Exchange a Direct Line secret for a short-lived token.
 * This should ONLY be called server-side — never expose the secret to the browser.
 */
export async function generateToken(
  options: GenerateTokenOptions
): Promise<TokenResult> {
  const url = options.directLineUrl ?? DEFAULT_DIRECT_LINE_URL;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.secret}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to generate Direct Line token: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
