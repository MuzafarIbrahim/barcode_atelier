# Design System Strategy: The Technical Atelier

### 1. Overview & Creative North Star
**Creative North Star: "The Technical Atelier"**
This design system moves away from the cluttered, "boxy" feel of traditional IDEs and toward a high-end, editorial environment for engineers and power users. The aesthetic is rooted in **Architectural Precision**—where every pixel is intentional, and the interface feels like a finely tuned instrument. 

Instead of a rigid, symmetrical grid, we employ **Intentional Asymmetry**. Primary workspaces occupy expansive, airy zones, while utility panels are tucked into high-density, tonal sidebars. We break the "template" look by layering surfaces rather than boxing them in, creating a UI that feels less like software and more like a custom-built workstation.

### 2. Colors & Surface Logic
The palette is built on a foundation of neutral grays (`surface` to `surface-dim`) to minimize cognitive load, punctuated by `primary` (#0c56d0) and `tertiary` (#006d4a) for technical accents.

*   **The "No-Line" Rule:** To achieve a premium look, 1px solid borders are strictly prohibited for structural sectioning. Separation between the sidebar, editor, and inspector must be achieved through background shifts. For example, use `surface-container-high` for navigation and `surface-container-lowest` for the primary workspace.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers. 
    *   **Level 0 (Base):** `surface`
    *   **Level 1 (Panels):** `surface-container-low` 
    *   **Level 2 (Active Components):** `surface-container-highest` 
*   **The "Glass & Gradient" Rule:** Floating command palettes or modal overlays must use Glassmorphism. Utilize `surface-container-lowest` at 85% opacity with a 12px backdrop blur. For primary actions, use a subtle vertical gradient from `primary` (#0c56d0) to `primary_dim` (#004aba) to give buttons a "milled" metallic feel.
*   **Signature Textures:** Incorporate a subtle noise texture (1-2% opacity) over `surface-container` tiers to mimic high-end hardware finishes and prevent "flat-panel fatigue."

### 3. Typography: The Precision Scale
We pair the utilitarian clarity of **Inter** with the technical character of **Space Grotesk**.

*   **Editorial Headers:** Use `headline-sm` (Inter) for view titles, but style them with `medium` weights and slightly tighter letter-spacing for an authoritative, "locked-in" look.
*   **The Data Layer:** All metadata, labels, and status indicators must use `label-md` or `label-sm` (**Space Grotesk**). This font's geometric construction provides the "programming-style" aesthetic the user requested without the readability issues of a true monospace font.
*   **Hierarchy via Scale:** Use extreme contrast. A `display-sm` header for a dashboard "State of Play" creates a focal point that makes the surrounding high-density data fields (`body-sm`) feel organized rather than cramped.

### 4. Elevation & Depth
Depth is conveyed through **Tonal Layering**, mimicking the way light hits different planes of a physical object.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a "lift" through color contrast alone.
*   **Ambient Shadows:** For floating elements (like tooltips or dropdowns), use a shadow tinted with `inverse_surface` (#0b0f10) at 6% opacity. The blur should be high (16px to 24px) to create an ambient glow rather than a harsh drop shadow.
*   **The "Ghost Border" Fallback:** If a border is required for extreme accessibility needs, use the `outline_variant` token at 15% opacity. It should be "felt" rather than "seen."
*   **Interactive Depth:** On hover, instead of a shadow, slightly shift the background from `surface-container-low` to `surface-container-high`. The "lift" should feel technical, like a button being depressed on a high-end console.

### 5. Components

*   **Buttons:**
    *   *Primary:* Gradient-filled (Primary to Primary Dim), `md` (0.375rem) roundedness.
    *   *Secondary:* `surface-container-highest` background with `on_surface` text. No border.
    *   *Tertiary (Ghost):* No background; `on_surface_variant` text that shifts to `primary` on hover.
*   **Input Fields:**
    *   Use `surface-container-highest` for the field body. 
    *   The label should be `label-sm` (Space Grotesk) in `on_surface_variant`, positioned strictly above the field—never floating inside. 
    *   Active state: A 2px bottom-only border in `primary`.
*   **Panels & Cards:** 
    *   Forbid divider lines. Use 24px or 32px of vertical white space to separate content blocks.
    *   Use `surface-container-low` for secondary panels (e.g., File Tree) and `surface-container-lowest` for primary work areas.
*   **Chips (Tags):**
    *   Small, `sm` (0.125rem) rounded corners. Use `tertiary_container` for success/stable states and `secondary_container` for neutral/pending states.
*   **Status Indicators:**
    *   Instead of large icons, use 8px "LED-style" circles using the `tertiary` (green) or `error` (red) tokens.

### 6. Do's and Don'ts

*   **DO:** Use **Tabular Figures** (tnum) for all data fields to ensure columns of numbers align perfectly—essential for the IDE feel.
*   **DO:** Prioritize whitespace over lines. If the UI feels "messy," increase the padding rather than adding a border.
*   **DON'T:** Use the `full` (9999px) rounding scale for buttons. It looks too "consumer/mobile." Stick to `md` (0.375rem) or `sm` (0.125rem) to maintain a professional, precision-tool vibe.
*   **DON'T:** Use pure black (#000000) for text. Always use `on_surface` (#2a3439) to maintain the "Technical Atelier" tonal balance.
*   **DO:** Use `tertiary` (Green) for "positive" technical actions (Deploy, Run, Commit) and `primary` (Blue) for "navigation/system" actions. This creates a clear mental model for the user.