# Copilot Widget Template

A fork-and-customize template for integrating [Microsoft Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/) into React and web apps.

Provides connection management, hooks, server-side token helpers, a web component, and **reference UI implementations** you copy into your project and own.

## Getting Started

### 1. Fork & Clone

Click **"Use this template"** (or fork) on GitHub, then:

```bash
git clone https://github.com/YOUR_ORG/YOUR_REPO.git
cd YOUR_REPO
npm install
```

### 2. Rename the Package (optional)

Update `name` in `package.json` to match your org:

```json
{
  "name": "@your-org/copilot-widget"
}
```

### 3. Configure Environment

Copy the example env file and fill in your Direct Line secret from Copilot Studio:

```bash
cp .env.example .env.local
```

### 4. Build & Develop

```bash
npm run build      # Production build
npm run dev        # Watch mode (rebuilds on changes)
npm run typecheck  # Type check
```

## Project Structure

```
src/
├── components/       # CopilotProvider — core React context
├── core/             # Connection, store middleware, types
├── hooks/            # useCopilot, useCopilotActivity
├── server/           # Token endpoint helpers (Next.js, Express)
├── theme/            # Default CSS custom properties
└── web-component/    # <copilot-widget> custom element

examples/
├── nextjs-standard/  # Next.js + ChatWidget (default WebChat UI)
├── nextjs-composer/  # Next.js + CopilotComposer (fully custom UI)
├── react-vite/       # Vite + React + ChatWidget
└── vanilla-html/     # Plain HTML + <copilot-widget> web component
```

## What's Included

### Exports

| Export | What it provides |
| --- | --- |
| `copilot-widget` | `CopilotProvider`, `useCopilot`, `useCopilotActivity`, `useCopilotContext`, core types |
| `copilot-widget/server` | `createTokenHandler` (Next.js), `createTokenMiddleware` (Express), `generateToken` |
| `copilot-widget/web-component` | `<copilot-widget>` custom element (batteries-included, for non-React pages) |

### Reference Components (you own these)

- **`ChatWidget`** — thin wrapper around `<ReactWebChat>` (~30 lines)
- **`CopilotComposer`** — thin wrapper around `<Composer>` (~30 lines)

These live in the `examples/` directory as templates. Copy the one you need into your project and customize freely.

## Usage

### 1. Server: Token Endpoint

**Next.js App Router** (`app/api/copilot/token/route.ts`):

```ts
import { createTokenHandler } from "copilot-widget/server";
export const POST = createTokenHandler({ secret: process.env.COPILOT_SECRET! });
```

**Express:**

```ts
import { createTokenMiddleware } from "copilot-widget/server";
app.post("/api/copilot/token", createTokenMiddleware({ secret: process.env.COPILOT_SECRET! }));
```

### 2. Client: Pick a Template

#### Mode A — Standard WebChat UI

Copy `examples/nextjs-standard/app/components/ChatWidget.tsx` into your project, then:

```tsx
import { CopilotProvider } from "copilot-widget";
import { ChatWidget } from "./components/ChatWidget"; // your copy

function App() {
  return (
    <CopilotProvider tokenEndpoint="/api/copilot/token">
      <ChatWidget
        styleOptions={{
          bubbleBackground: "#f0f0f0",
          bubbleFromUserBackground: "#00543e",
        }}
        activityMiddleware={myActivityMiddleware}
      />
    </CopilotProvider>
  );
}
```

#### Mode B — Custom UI (Composer)

Copy `examples/nextjs-composer/app/components/CopilotComposer.tsx` into your project, then build your own UI using WebChat hooks:

```tsx
import { CopilotProvider, useCopilot } from "copilot-widget";
import { CopilotComposer } from "./components/CopilotComposer"; // your copy
import { hooks } from "botframework-webchat";

const { useActivities, useSendMessage, useConnectivityStatus } = hooks;

function App() {
  return (
    <CopilotProvider tokenEndpoint="/api/copilot/token">
      <CopilotComposer>
        <MyCustomChatUI />
      </CopilotComposer>
    </CopilotProvider>
  );
}

function MyCustomChatUI() {
  const [activities] = useActivities();
  const sendMessage = useSendMessage();
  const { sendEvent } = useCopilot();
  // Build your UI with any component library
}
```

## Hooks

### `useCopilot()`

```tsx
const { sendEvent, postActivity, status, directLine } = useCopilot();

sendEvent("user:selectedProduct", { productId: "123" });
postActivity({ type: "event", name: "custom", value: { ... } });
```

### `useCopilotActivity(type, name, callback)`

```tsx
useCopilotActivity("event", "order:confirmed", (activity) => {
  router.push(`/orders/${activity.value.orderId}`);
});

// Match all messages (pass undefined for name)
useCopilotActivity("message", undefined, (activity) => {
  console.log("Bot said:", activity.text);
});
```

### `useCopilotContext()`

Low-level access to the DirectLine instance, store middleware, and connection status. Use this when building your own ChatWidget or CopilotComposer.

## Activity Events

**Receiving** — via `onActivity` prop or `useCopilotActivity` hook:

```tsx
<CopilotProvider
  tokenEndpoint="/api/copilot/token"
  onActivity={(activity) => {
    if (activity.type === "event" && activity.name === "order:confirmed") {
      // handle it
    }
  }}
>
```

**Sending** — via `useCopilot()`:

```tsx
const { sendEvent, postActivity } = useCopilot();
sendEvent("user:greeting", { locale: "nb-NO" });
```

## Web Component

For non-React pages:

```html
<script type="module" src="./dist/web-component.js"></script>
<copilot-widget token-endpoint="/api/copilot/token"></copilot-widget>
```

Theme via CSS custom properties:

```css
copilot-widget {
  --copilot-primary: #00543e;
  --copilot-bg: #ffffff;
  --copilot-font: "Inter", sans-serif;
  --copilot-radius: 8px;
}
```

## Examples

Each example is a standalone runnable project. **Copy the one closest to your setup** as a starting point.

| Directory | What it demonstrates |
| --- | --- |
| `examples/nextjs-standard/` | Next.js + ChatWidget (default WebChat UI with styleOptions) |
| `examples/nextjs-composer/` | Next.js + CopilotComposer (fully custom UI with WebChat hooks) |
| `examples/react-vite/` | Vite + React + ChatWidget |
| `examples/vanilla-html/` | Plain HTML + `<copilot-widget>` web component |

To run an example:

```bash
cd examples/nextjs-standard  # (or whichever example)
npm install
cp ../../.env.example .env.local
npm run dev
```

## License

MIT
