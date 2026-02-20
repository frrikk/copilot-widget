import { generateToken, type GenerateTokenOptions } from "./token";

/**
 * Create a Next.js App Router route handler for the token endpoint.
 *
 * Usage in `app/api/copilot/token/route.ts`:
 * ```ts
 * import { createTokenHandler } from '@tieto/copilot-widget/server';
 * export const POST = createTokenHandler({ secret: process.env.COPILOT_SECRET! });
 * ```
 */
export function createTokenHandler(options: GenerateTokenOptions) {
  return async function handler(): Promise<Response> {
    try {
      const result = await generateToken(options);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Token generation failed";
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}

/**
 * Create an Express-compatible middleware for the token endpoint.
 *
 * Usage:
 * ```ts
 * import { createTokenMiddleware } from '@tieto/copilot-widget/server';
 * app.post('/api/copilot/token', createTokenMiddleware({ secret: process.env.COPILOT_SECRET! }));
 * ```
 */
export function createTokenMiddleware(options: GenerateTokenOptions) {
  return async function middleware(
    _req: unknown,
    res: {
      status: (code: number) => { json: (body: unknown) => void };
      json: (body: unknown) => void;
    }
  ): Promise<void> {
    try {
      const result = await generateToken(options);
      res.json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Token generation failed";
      res.status(500).json({ error: message });
    }
  };
}
