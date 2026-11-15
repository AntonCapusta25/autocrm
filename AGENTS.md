# Project Design Directives & Guidelines (AutoFlow Studio)

This repository strictly enforces the principles codified in the installed Claude Design Skills:
- `frontend-design` (Anthropic Official)
- `theme-factory` (Anthropic Official)
- `ui-ux-pro-max`
- `design-taste-impeccable`
- `accessibility-wcag`

## Core Rules to Follow on Every UI / Frontend Task

### 1. Distinctive Art Direction (No "AI Slop")
- Ground all designs in the subject matter: AutoFlow Studio is an executive, high-performance CRM and workflow automation engine.
- Avoid generic AI tells:
  - Do NOT accent single words randomly in titles with different colors or italicization.
  - Do NOT slice pages into identical rounded boxes with identical padding and shadows.
  - Do NOT clutter headings with arbitrary all-caps eyebrow labels.
  - Do NOT use numbered markers (`01`, `02`) unless representing a literal sequential step.

### 2. Palette & Token Governance
- Stick to the defined brand system:
  - Base: High-contrast Dark Charcoal / Obsidian (`#0A0C10`, `#11141C`, `#171B26`)
  - Borders: Crisp, subtle 1px dividers (`#1E2433`, `#2E364D`)
  - Text: Clear hierarchy (`#F9FAFB` for primary, `#94A3B8` for secondary, `#64748B` for meta)
  - Accent: Restrained lilac luminance (`#A78BFA` / `#C4B5FD` with soft 12%–18% glow for key CTAs and active states)
  - Semantic Status: Emerald for Won/Completed, Soft Coral for Overdue/Lost, Amber for Due Today/Qualified, Sky Blue for Contacted/Info.

### 3. Spatial Rhythm & Layout Hierarchy
- Use a disciplined 4px / 8px spatial grid for all margins, paddings, and gap distances.
- Adhere to the Nested Radius Formula: `R_inner = max(0, R_outer - Padding)`.
- Use progressive disclosure: show top-level summary metrics and lists on the dashboard; provide deep timeline logs, custom fields, and task details in dedicated slide-out drawers or focused modals.

### 4. Interactive Polish & Micro-Interactions
- Keep response times under 150ms with cubic-bezier easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Provide immediate tactile feedback for every user action (optimistic state updates, checkbox checkmarks, drag highlights, toast alerts).

### 5. Accessibility & Copywriting
- Target WCAG 2.1 AA/AAA contrast ratios for all text against dark surfaces.
- Never strip focus outlines without providing visible focus-visible indicators.
- Write in active voice from the user's perspective: "Save changes", "Create contact", "Export CSV", "Post note".
