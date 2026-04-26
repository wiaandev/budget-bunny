# The Quiet Ledger: Design System & Product Specification

## 1. Project Vision
"The Quiet Ledger" is a minimalist fintech suite focused on **Editorial Minimalism** and financial intentionality. It is built around the **50/20/15/15 Rule** (50% Needs, 20% Investments, 15% Wants, 15% Emergency Fund) to provide users with a clear, calm, and structured way to manage their wealth.

## 2. Design System: Sage & Ledger
- **Core Philosophy:** "The Quiet Ledger" — Clarity over clutter, intentionality over noise.
- **Typography:** Manrope (Clean, modern sans-serif) for high legibility and an editorial feel.
- **Color Palette:**
  - Primary Sage: `#94A684`
  - Deep Sage (Accents): `#536346`
  - Background: `#FAF9F8` (Off-white/Stone)
  - Surface: White / Soft Grays
- **Shape & Form:** `ROUND_FOUR` (Slightly rounded corners) for a professional yet approachable feel.
- **Visual Style:** Flat design with subtle tonal shifts, no heavy shadows, and generous whitespace.

## 3. Core Features & Logic
- **50/20/15/15 Allocation:** Every expense and budget item must be categorized into one of these buckets.
- **The "Leftover" Mechanism:** Real-time tracking of remaining funds after specific items are paid (checkbox-driven logic).
- **Debt Snowball Integration:** Debt items are tracked with interest rates; payments made in the budget automatically reduce the principal in the tracker.
- **Collaborative Budgeting:** Clear ownership indicators with invitation systems for shared financial management.
- **Contingency Planning:** "Oh-Crap" funds for unforeseen expenses and "What-If" scenarios for financial forecasting (salary increases, debt payoff).

## 4. Screen Inventory & Descriptions

### [SCREEN_6] Dashboard
The central hub. Displays the 50/20/15/15 status bars, the "Available to Allocate" total, and recent movements. Features proactive warnings if categories exceed limits.

### [SCREEN_9] Monthly Budget Planner
Detailed planning view. Includes sections for Income Streams, the "Oh-Crap" fund, "What-If" scenarios, and a future projection curve. Features a "Finalize Ledger" primary action.

### [SCREEN_2] Debt & Snowball Tracker
Specialized view for liabilities. Lists accounts (Credit Cards, Loans) with interest rates and "Critical Rate" warnings. Visualizes "Snowball Velocity" and interest avoided through extra payments.

### [SCREEN_10] Goals & Emergency Fund
Focuses on long-term savings. Tracks the Emergency Fund against a 6-month target and displays "Active Ambitions" (travel, hobbies) with progress bars.

### [SCREEN_4] Transaction History
A clean, editorial-style list of all movements. Categorized by budget bucket with a top-level balance summary and "Spending Velocity" insights.

### [SCREEN_7] New Budget & Collaborators
The onboarding/setup flow. Allows users to "Reuse Last Month" or "Start Fresh," and manage budget contributors with clear owner tagging.

### [SCREEN_11] Add Budget Item
A focused modal for new entries. Captures name, amount, category, and "Recurring" status. Automatically links debt-related entries to the Debt Tracker.

## 5. Technical Requirements for LLM Implementation
- **Data Binding:** Synchronize the category totals across the Dashboard and Budget Planner.
- **State Management:** Toggling a "Paid" checkbox in the budget should immediately update the "Leftover" balance in the TopNavBar.
- **Conditional Styling:** Apply warning colors (red/amber) when category allocations exceed the 50/20/15/15 thresholds.
- **Component Architecture:** Reuse shared `TopAppBar`, `SideNavBar`, and `BottomNavBar` for structural consistency.