# Vanilla HTML Example

Embeds the `<copilot-widget>` web component in a plain HTML page.
No build step required — just serve the HTML file.

## Setup

1. Build the widget package from the root: `npm run build`
2. Serve this directory with any static file server
3. Update the `token-endpoint` attribute to point to your backend

## Usage

```html
<script src="path/to/copilot-widget/dist/web-component.js"></script>
<copilot-widget token-endpoint="https://your-api.example.com/api/copilot/token"></copilot-widget>
```
