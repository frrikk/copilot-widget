# @tieto/copilot-widget

Minimal core for integrating Copilot Studio into React and web apps. Provides connection management, hooks, server-side token helpers, and a web component — but **not** opinionated UI components.

UI components live in the [examples/](#examples) as reference implementations you copy into your project and own.

## Installation

```bash
npm install @tieto/copilot-widget botframework-webchat
```

## What's in the package

| Export | What it provides |
| --- | --- |
| `@tieto/copilot-widget` | `CopilotProvider`, `useCopilot`, `useCopilotActivity`, `useCopilotContext`, core types |
| `@tieto/copilot-widget/server` | `createTokenHandler` (Next.js), `createTokenMiddleware` (Express), `generateToken` |
| `@tieto/copilot-widget/web-component` | `<copilot-widget>` custom element (batteries-included, for non-React pages) |

## What's NOT in the package (you own this)

- `ChatWidget` — thin wrapper around `<ReactWebChat>` (~30 lines)
- `CopilotComposer` — thin wrapper around `<Composer>` (~30 lines)

These live in the examples as templates. Copy the one you need into your project and customize freely.

## Quick Start

### 1. Server: Token Endpoint

**Next.js App Router** (`app/api/copilot/token/route.ts`):

```ts
import { createTokenHandler } from "@tieto/copilot-widget/server";
export const POST = createTokenHandler({ secret: process.env.COPILOT_SECRET! });
```

**Express:**

```ts
import { createTokenMiddleware } from "@tieto/copilot-widget/server";
app.post("/api/copilot/token", createTokenMiddleware({ secret: process.env.COPILOT_SECRET! }));
```

### 2. Client: Pick a Template

#### Mode A — Standard WebChat UI

Copy `examples/nextjs-standard/app/components/ChatWidget.tsx` into your project, then:

```tsx
import { CopilotProvider } from "@tieto/copilot-widget";
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
import { CopilotProvider, useCopilot } from "@tieto/copilot-widget";
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
<script type="module" src="@tieto/copilot-widget/dist/web-component.js"></script>
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

## Development

```bash
npm install
npm run dev        # Watch mode
npm run build      # Production build
npm run typecheck  # Type check
```

## License

MIT
