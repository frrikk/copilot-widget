import { createTokenHandler } from "@frikkdev/copilot-widget/server";

export const POST = createTokenHandler({
  secret: process.env.COPILOT_SECRET!,
});
