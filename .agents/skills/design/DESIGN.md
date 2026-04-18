# Design System Specification

## 1. Overview & Creative North Star: "The Quiet Ledger"
This design system is built upon the philosophy of **Editorial Minimalism**. In a fintech landscape crowded with loud gradients and aggressive "gamified" interfaces, this system takes the opposite approach: it acts as a sophisticated, calm, and curated space for financial clarity.

The **Creative North Star** for this system is "The Quiet Ledger." We treat every screen like a page in a high-end architectural journal. We break the standard "dashboard" look by employing intentional asymmetry, significant breathing room (whitespace), and a high-contrast typography scale. We do not use borders to define space; we use light and tone.

## 2. Colors & Tonal Architecture
The palette is a sophisticated trio of Soft Sage (`primary`), Pale Sky Blue (`secondary`), and Warm Cream (`surface`). 

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` card sitting on a `surface` background provides all the separation the eye needs without the "clutter" of a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of heavy-weight paper.
- **Base Layer:** `surface` (#faf9f8)
- **Secondary Sectioning:** `surface-container-low` (#f4f3f2)
- **Interactive/Floating Elements:** `surface-container-lowest` (#ffffff)
- **Emphasis Containers:** `primary-container` (#94a684) for positive focus or `secondary-container` (#c5e8f6) for informational focus.

### The "Glass & Gradient" Rule
To add a "signature" feel to hero elements:
- **Glassmorphism:** Use `surface_container_lowest` at 60-80% opacity with a `24px` backdrop-blur for floating navigation or modals.
- **Signature Textures:** Apply a subtle linear gradient from `primary` (#536346) to `primary_container` (#94a684) at a 135-degree angle for main CTAs to give them a "silk-pressed" tactile quality.

## 3. Typography
The system utilizes a dual-font strategy to balance character with utility.

- **Display & Headlines (Manrope):** This is our "Editorial" voice. Manrope provides a modern, slightly geometric soul. Use `display-lg` and `headline-lg` with tight letter-spacing (-0.02em) to create authoritative, beautiful focal points.
- **Body & UI (Inter):** Inter is used for all functional data. It is chosen for its extreme legibility at small sizes, which is critical for a "compact" fintech UI.

**Hierarchy as Identity:**
- **The "Hero" Stat:** Use `display-md` for primary balances.
- **The "Budget Owner" Label:** Always use `label-md` or `label-sm` in all-caps with +0.05em tracking to denote professional hierarchy.

## 4. Elevation & Depth
In this system, we do not "drop shadows" in the traditional sense; we manipulate ambient light.

- **Tonal Layering:** Depth is achieved by "stacking." A `surface-container-lowest` card should only ever sit on a `surface-container-low` background. This 1-step tier shift creates a soft, natural lift.
- **Ambient Shadows:** When an element must float (e.g., a modal), use a shadow tinted with the `on-surface` color: `box-shadow: 0 12px 32px -4px rgba(26, 28, 28, 0.06)`. It should feel like a soft glow, not a dark smudge.
- **The "Ghost Border":** If a border is required for accessibility, use the `outline-variant` (#c5c8bd) at **15% opacity**. Anything higher is considered "noise."

## 5. Components

### Buttons
- **Primary:** Pill-shaped (`rounded-full`), `primary` (#536346) background with `on-primary` (#ffffff) text. No shadow.
- **Secondary:** `secondary_container` (#c5e8f6) background. Compact padding: `8px 16px`.
- **Tertiary/Ghost:** Text only using `primary` color, with a subtle `surface-variant` background on hover.

### Progress Bars & Budget Tracking
- **The "Quiet" Track:** Use `surface-container-highest` (#e3e2e1) for the background track.
- **The Indicator:** Use `primary` (#536346) for healthy budgets and `error` (#ba1a1a) for warnings.
- **Style:** Height should be thin (`4px` or `6px`) with `rounded-full` caps. No borders.

### Simple Charts (Sparklines)
- **Stroke:** Use a `2px` stroke width. 
- **Color:** Use `primary` for positive trends and `secondary` for neutral/historical data.
- **Grid:** Forbid vertical grid lines. Use only two horizontal lines at the "Min" and "Max" using `outline-variant` at 10% opacity.

### Input Fields & Labels
- **Compact Style:** Input fields should not have a background. Use a bottom-only "Ghost Border" or a subtle `surface-container-low` filled state with no border.
- **Warnings:** For warnings, use `on-error-container` (#93000a) text paired with the `error_container` (#ffdad6) as a soft background wash.

### Cards
- **Forbid Dividers:** Never use a line to separate content within a card. Use `body-sm` typography and vertical spacing of `16px` or `24px` to create distinct content groups.

## 6. Do's and Don'ts

### Do
- **Do** embrace asymmetry. Align your balance to the left and your "Budget Owner" chip to the far right to create editorial tension.
- **Do** use `surface-container` tiers to group related items.
- **Do** keep data compact. Use `body-md` for most numbers; only use `display` scales for the "North Star" metric of the page.

### Don't
- **Don't** use pure black (#000000). Always use `on-surface` (#1a1c1c) to maintain the soft, pastel harmony.
- **Don't** use standard Material Design elevations (heavy shadows). 
- **Don't** use icons as primary navigation without labels. In an editorial system, words carry the weight.
- **Don't** clutter. If a screen feels "full," increase the `surface` whitespace.