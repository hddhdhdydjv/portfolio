---
name: gynger-figma
description: How to work in Gynger's Figma files (Brisk Lunte 2026 design system, Design File, DEV File) with Claude Code. Use for any Figma task at Gynger — building or editing screens, flows, side cases, mobile versions, connectors, and for auditing/reorganizing the Brisk design system (component pages, primitive and semantic tokens, text and effect styles, documentation, legacy). Always build from the design system and leave the file easy for any agent to read.
---

# Gynger × Figma

Working rules that came out of real sessions on Gynger's files. Load the official `figma-use` skill before any `use_figma` call (and `figma-generate-design` for screens, `figma-generate-library` for DS components). This skill adds the Gynger-specific rules on top.

## 1. Files and where things live

| File | Key | What it is |
|---|---|---|
| Brisk Lunte 2026 | `4uHAjerTfrRgwfoBjoh2Dp` | Design system (library). Components, variables, text styles. |
| Design File | `6EpEx6moqAkRdP8CSxuQXl` | Product flows. Pages: Designs (explorations), Vendor Onboarding, Credit Aplication, Compute financing. |
| DEV File | `Irq43SSUbZTJkh0DbxIQTx` | Handoff copy of the flows for engineering. |

- Changes in Brisk reach the other files only after the user **publishes the library**. When a screen needs a new DS variant, add it in Brisk, tell the user to publish, then use it.
- Open DS improvements are tracked in `docs/brisk-ds-backlog.md` and audit progress in `docs/brisk-ds-audit-status.md`, both in the GitHub repo `hddhdhdydjv/Onboarding-gynger-` (`docs/brisk-ds-audit-status.md`, `docs/brisk-ds-backlog.md`). If the session is in another repo, attach that one (add_repo with push access), clone it, read the files there and commit your updates to it. Add every DS issue you notice to the backlog instead of fixing it unasked. When the user asks "what can we improve in the DS", start from that file.

## 2. Working with the user

- Reply in **Spanish**. Everything written inside Figma (names, notes, copy, descriptions) is in **English**.
- **Never change copy** unless asked. If new copy is unavoidable (an empty description, a placeholder message), say exactly what you wrote so the user can change it.
- **Only do what was asked.** Don't modify existing components, delete nodes, or "improve" things outside the request. Reordering a file means moving, not editing.
- **Ask before deleting or when there are two reasonable paths.** Give options with a recommendation. If the user says "no sé", pick the non-destructive option and log it in the backlog.
- **Don't undo the user's manual edits.** Read the current state before changing anything they may have touched.
- If the user asks to revert, restore the exact previous state (clone from the source/exploration if needed), don't approximate.
- When you finish, report what changed, what you didn't touch, and anything that needs the user (publish, decision). Give node links when asked: `https://www.figma.com/design/<fileKey>/<name>?node-id=<id with - instead of :>`.

## 3. Always use the design system

1. Find the component before drawing anything: inspect existing screens first, then search Brisk pages (Button, Text Field, Navigation, Progress, Modal…).
2. Use instances and set **component properties** (`setProperties`), not detached copies. Detach only if the user agrees and nothing else works; say so.
3. Bind colors, radii and spacing to **variables**. Prefer **semantic tokens** (`Surfaces/*`, `Content/*`, `Text/*`, `Strokes/*`, `Semantic/Error|Success|Warning/*`, `Accent/*`) over `Primitives/*`. Use a primitive only when no semantic exists, and log it in the backlog.
4. Text always uses a **text style**. Desktop screens use `Desktop/*`; **mobile screens use `Mobile/*`** on every text layer, including text inside instances (override the style). Mapping: `Desktop/Hn → Mobile/Hn`, `Desktop/Body X/Regular|Medium → Mobile/Body X/same`, Semibold → Medium. Never restyle tiny icon labels (e.g. the 7px "PDF" in File type icon).
5. If the DS lacks something, build it from DS pieces (instances + variables + styles) and log the gap. Example: no Bottom sheet → Backdrop instance + panel bound to `Surfaces/Base`, top radius `radius-24`, grabber, Icon button close.
6. Reuse what the user already approved: when something looked right in one screen (e.g. the Chat Header with gradient, blur and icon shadow), copy that exact instance (`clone()`), don't recreate it from the main component — instances carry overrides the main component doesn't have.

## 4. Make Figma easy for any agent to read

- **Names describe content and position in the flow.** Screens: `Onboarding / <flow> / <NN> <Step> — <State>` (e.g. `03 Quote — Confirm details`, `13.2 Review & sign — Empty (no quote)`). Mobile versions add `— Mobile`. No duplicate names; no `Frame 2147…` on things you create.
- **Numbering follows the flow.** Main path `01, 02, 03`; branches `02b`; sub-steps `05.1, 05.2`. Renumber when you remove a screen.
- **Sections per step** (`3.1 Quote`, `3.2 Company profile`…) with a Title bar and a stage-label card on the left: *Flow steps* + *Notes*. Keep notes true to the screens (update them when the flow changes).
- **Side cases / edge cases** go inside the step's section, under the main row: a light Title (`Size=Smallest, Dark=Off`) "Side case · …", a small note card ("When it happens / what the user does / Full flow: link to exploration"), then the screens. Keep explorations untouched in Designs; copy screens into the flow.
- **Component descriptions** say what it is, when to use it and its options. Add one when it's missing; don't rewrite existing ones unless asked.
- **Layer names** of things you build: semantic (`Top bar`, `Agent sheet`, `Bottom actions`, `Progress`), never default names.

## 5. Flow connectors (the rule we use)

- Vectors, stroke 6, round join. First vertex `strokeCap: CIRCLE_FILLED`, last `ARROW_LINES`, middle vertices `cornerRadius` 48 (or half the shorter segment).
- **Start on the element that triggers the step** (button, option, ✎, menu item, composer), end on the left edge of the target screen.
- Colors: **green** main path / continue / exit · **orange** side case or alternative · **red** destructive or negative (Delete, Disconnect, Declined, "Something's not right").
- Name every arrow `↳ <action>` (`↳ Yes, I have a quote`).
- **No tangles:** 400px between screens (step 1840 for 1440 frames); branches drop to a line below; jumps to other sections use a **green exit pill** (`→ 3.2 Company profile`, `↺ 02 Quote — Upload`) instead of long arrows. Order L-shaped routes so verticals never cross horizontals (the lower start bends closer to its source).
- In handoff files, put a node **hyperlink** on the pill subtitle so it jumps to the target section.

## 6. Design system audit and page format (Brisk)

**To keep ordering the DS (pages, tokens, styles), follow `ds-audit.md` step by step and report with its standard format.** Read `docs/brisk-ds-audit-status.md` first to know which page is next, and update it when you finish. Summary of the result every page must have:

Each Components page:
- One white frame (radius 24, `Pure/White`) with a **Doc header** instance (dark banner `Accent/Primary/Dark`, breadcrumb "Components › Page", heading, one-line description) and a `Components` area with the sets in a tidy grid. Page canvas background `#333333`.
- Current vs old: a second frame `<Page> — Legacy` below, components renamed `Legacy / …` (keep them published unless told otherwise).
- Building-block parts are **private** (`.` prefix, e.g. `.Virtual card / Number`); only the composed component is public.
- Names: singular, Title/Sentence case, grouped with `/` by family (`Charts/Pie`, `Finance/Header`, `Agent Tag`). Pages with new components get `(New)` in the page name.
- Never rename properties or variant values on existing components (breaks instances) — log it as a migration in the backlog.
- Consistency across sizes: when a control gets a size or style (XSmall 28/32px, Underlined), add it to its siblings too (Input → Dropdown → Text field) and expose nested bases (`isExposedInstance`).

## 7. Mobile (375 × 812)

- Start from the desktop screen (`clone()`), then: hide desktop-only columns, 16px side margins, components to FILL width.
- **Top bar in one line:** back · agent icon · title, with the Chat Header's gradient + background blur on a full-width `Top bar` wrapper; content scrolls **behind** it (don't clip the conversation under an opaque bar).
- Agent entry point: icon top-right → opens the agent in a **bottom sheet**. Step navigation: Progress Bar + "Step N of M" → steps bottom sheet.
- Primary action sticky at the bottom with a white fade.
- Apply `Mobile/*` text styles to all text (section 3.4).

## 8. Accessibility checks we apply

- Text contrast ≥ 4.5:1, icons/UI ≥ 3:1 — compute it, don't guess. Light tinted backgrounds on white (~1.1:1) don't define a control; use solid fills or a border.
- Icon-only buttons: ≥ 24px target (we use 28 with a 16px icon), a Focus state (2px ring), and an accessible name noted in the description.
- Cancel ≠ destructive: cancel is Neutral; red only for delete-type actions. Don't rely on red/green alone.

## 9. Plugin API gotchas we hit

- **Switch page once per call**, fan out pages in parallel calls; content pages: `await figma.setCurrentPageAsync(page)`.
- **Load fonts** of every text you touch (including clones, before `textAutoResize`/`characters`/`setTextStyleIdAsync`).
- Errors roll back the whole call — re-read the canvas only if `safeToRetryWithoutCanvasRead` is false.
- `componentProperties`/text search on a node **cloned in the same call** can come back empty; anchor from the source node's offsets instead, or do it in the next call.
- Instances of renamed components keep working; text search by layer name can miss when the library renamed a component — prefer node IDs from inspection.
- A frame showing `x=0` but rendering off-frame is **mirrored** (`rotation -180`, `relativeTransform [[-1,…]]`): reset `relativeTransform`.
- Paints bound to variables may render black if the base color is a placeholder: set the paint's base color to the variable's resolved value, then bind.
- Spread drop shadows didn't render in screenshots: build focus rings as an absolute rectangle with a stroke.
- Swapped icons (INSTANCE_SWAP) keep their own color: set the icon vector fill (bound to a token) after swapping.
- After `combineAsVariants` or adding variants, lay them out in a grid and resize the set; keep the set inside the page's `Components` area.
- Moving nodes between pages: `targetPage.appendChild(node)` works; place it clear of existing nodes.
- Validate with one screenshot per composed screen; fix, then one more. Check overlaps between sections after resizing.

## Files in this skill

- `ds-audit.md` — repeatable procedure to audit and order Brisk: component pages, tokens, styles, and the standard report.
- `reference.md` — reusable code (arrows, anchors, exit pills, doc frame, mobile text-style mapping) and Brisk keys.
- Shared docs (single source, in `hddhdhdydjv/Onboarding-gynger-`): `docs/brisk-ds-audit-status.md` (progress), `docs/brisk-ds-backlog.md` (open DS issues).
