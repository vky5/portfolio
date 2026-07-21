import type { ComponentType } from "react";

/*
 * Registry of interactive blog widgets. A post authors one as a fenced code
 * block whose language is the key here (e.g. ```authflow), which Tiptap stores
 * as <code class="language-authflow"> — the same channel Mermaid rides, so it
 * survives the editor round-trip. Each entry is a dynamic import so the widget
 * ships only to posts that use it.
 *
 * Keys must be lowercase letters only (Tiptap's code-fence input rule captures
 * /^```([a-z]+)/), and must not collide with real code languages or "mermaid".
 */

export type WidgetProps = Record<string, unknown>;
export type WidgetModule = { default: ComponentType<WidgetProps> };

export const widgetRegistry: Record<string, () => Promise<WidgetModule>> = {
  authflow: () => import("./AuthFlowDiagram"),
};
