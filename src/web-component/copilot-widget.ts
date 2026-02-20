import React, { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { fetchToken } from "../core/connection";
import { createActivityMiddleware } from "../core/store";

/**
 * `<copilot-widget>` — Custom element that embeds a Copilot Studio chat widget.
 *
 * This is the "batteries-included" entry point for non-React consumers.
 * It bundles its own minimal ReactWebChat rendering.
 *
 * Attributes:
 * - `token-endpoint` (required) — URL of your server-side token endpoint
 * - `direct-line-domain` — Override for sovereign clouds
 *
 * Theming via CSS custom properties on the host element:
 * ```css
 * copilot-widget {
 *   --copilot-primary: #00543e;
 *   --copilot-bg: #ffffff;
 *   --copilot-font: 'Inter', sans-serif;
 *   --copilot-radius: 8px;
 * }
 * ```
 */
class CopilotWidgetElement extends HTMLElement {
  private root: Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  static get observedAttributes() {
    return ["token-endpoint", "direct-line-domain"];
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        font-family: var(--copilot-font, system-ui, -apple-system, sans-serif);
      }
      .copilot-widget-root {
        width: 100%;
        height: 100%;
        background: var(--copilot-bg, #ffffff);
        border-radius: var(--copilot-radius, 8px);
        overflow: hidden;
      }
    `;
    shadow.appendChild(style);

    this.mountPoint = document.createElement("div");
    this.mountPoint.className = "copilot-widget-root";
    shadow.appendChild(this.mountPoint);

    this.root = createRoot(this.mountPoint);
    this.initWebChat();
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }

  attributeChangedCallback() {
    this.initWebChat();
  }

  private async initWebChat() {
    if (!this.root) return;

    const tokenEndpoint = this.getAttribute("token-endpoint");
    if (!tokenEndpoint) {
      console.warn("<copilot-widget>: token-endpoint attribute is required");
      return;
    }

    const directLineDomain =
      this.getAttribute("direct-line-domain") ?? undefined;

    try {
      const { token } = await fetchToken(tokenEndpoint);
      const WebChat = await import("botframework-webchat");

      const directLine = WebChat.createDirectLine({ token, domain: directLineDomain });
      const store = WebChat.createStore({}, createActivityMiddleware());

      // Map CSS custom properties to WebChat styleOptions
      const computedStyle = getComputedStyle(this);
      const primaryColor = computedStyle.getPropertyValue("--copilot-primary").trim();
      const styleOptions: Record<string, unknown> = {};
      if (primaryColor) {
        styleOptions.accent = primaryColor;
      }

      // WebChat's default export is the ReactWebChat component
      const ReactWebChat = (WebChat as Record<string, unknown>).default ?? WebChat;
      this.root.render(
        createElement(ReactWebChat as React.ComponentType<Record<string, unknown>>, { directLine, store, styleOptions })
      );
    } catch (err) {
      console.error("<copilot-widget>: Failed to initialize", err);
    }
  }
}

// Register the custom element
export function register(tagName = "copilot-widget") {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, CopilotWidgetElement);
  }
}

// Auto-register on import
register();
