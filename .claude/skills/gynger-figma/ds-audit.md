# Brisk DS audit — repeatable procedure

Use this whenever the user asks to keep ordering/auditing the design system ("seguí con la próxima página", "ordená los tokens", "ordená los styles", "dejá el DS como corresponde"). Always follow the same steps and report in the same format, so every page ends up identical.

File: Brisk Lunte 2026 `4uHAjerTfrRgwfoBjoh2Dp`. Progress lives in `docs/brisk-ds-audit-status.md` (read it first, update it last) and open issues in `docs/brisk-ds-backlog.md`, both in the GitHub repo `hddhdhdydjv/Onboarding-gynger-` (`docs/brisk-ds-audit-status.md`, `docs/brisk-ds-backlog.md`). If the session is in another repo, attach that one (add_repo with push access), clone it, read the files there and commit your updates to it.

## Golden rules

1. **Order, don't redesign.** Move, rename, group, describe and document. Do not change visuals, variants, properties or values unless the user asks.
2. **Ask before** deleting anything, moving a component to another page, making something private, or renaming a component the user may know by name. Offer 2–3 options with a recommendation.
3. **Never rename variant properties/values or variables in place** (it breaks instances and bindings). Log it in the backlog as a *migration*.
4. Anything unused-looking: check instances in Brisk (`getInstancesAsync`) — if 0, still don't delete (it may be used in other files): move it to the Legacy frame and log it.
5. Every finding that you don't fix goes to `docs/brisk-ds-backlog.md` under Tokens / Icons / Components.
6. One page per turn: finish it, report, ask "¿Sigo con <next page>?".

## A. Components pages (one page at a time)

Order: the page list under `Components ↓` from top to bottom (see status file for what's done).

1. **Inspect** the page: every top-level node → type, name, variants/properties, description, instances count, bounds. Screenshot ambiguous items.
2. **Classify** each node:
   - *Current* public component → stays in the main frame.
   - *Old* version (Archive sections, "Legacy", duplicates superseded by Onboarding/Agent versions) → `<Page> — Legacy` frame, renamed `Legacy / <Name>`.
   - *Building-block part* used only to compose another component → private: `.<Family> / <Part>`.
   - *Misplaced* (belongs to another family: logos on Card, timeline step in Data Viz, save status in Badge) → propose the right page; move only after OK.
   - *Loose / stray* (detached copies, test frames, reference rectangles) → keep as `… — reference` next to its family or move to Legacy; never delete without OK.
3. **Ask** the open questions in one batch (AskUserQuestion), with recommendations.
4. **Rename** with the naming rules:
   - Singular, Sentence/Title case, English: `Banner`, `File item`, `Avatar bill type`.
   - Group families with `/`: `Charts/Pie`, `Finance/Header`, `Dashboard/Header`, `.Dropdown/medium`.
   - Domain components that collide with generic ones get a domain prefix (`Finance/Input`, not `Input`).
   - Prefix related components with the family word so they sort together (`Avatar`, `Avatar label group`, `Avatar bill type`).
5. **Describe** every public component set without a description: what it is, when to use it, its options (`Size: …`, `State: …`), optional parts. Keep existing descriptions unless the user asks to rewrite. Add keywords for alternative names (`Keywords: backdrop, modal overlay, scrim`).
6. **Consistency pass** with siblings: if a sibling family got a size/style (XSmall 28/32px, `Style=Boxed|Underlined`), add it here too (only when the user agreed to the consistency rule) and expose nested bases with `isExposedInstance`.
7. **Document the page** (see reference.md → "Brisk doc frame"):
   - White frame (radius 24) named like the page, Doc header instance (Section title `Components`, Page title, Heading, one-line Supporting text), `Components` area with the sets laid out in rows (80px margin, 120–160px gaps), keeping the original relative layout when it was meaningful.
   - Legacy frame below with its own Doc header (`<Page> — Legacy`, "Previous version… Kept for existing screens.").
   - Page background `#333333`. Add `(New)` to the page name only if the page received new components.
8. **Verify**: screenshot the frame, check no overlaps (resizing sets can push into neighbours — re-flow rows), variant counts unchanged.
9. **Log**: backlog entries + update the status file (page → done, what moved where).
10. **Report** in the standard format (below) and ask to continue.

## B. Tokens (variables)

Run when the user asks for tokens, or after finishing all component pages.

1. **Inventory**: collections, modes, variables per collection, `scopes`, `hiddenFromPublishing`, `codeSyntax`, aliases. Known collections: `Color` (semantic, mode Buyer), `_Primitives`, `Space`, `Data`, `Text`, `Gynger brand`, `Migrated legacy tokens`.
2. **Primitives**
   - Live only in the primitives collection, grouped `Primitives/<Hue>/<step>` (Gray, Blue, Green, Red, Orange, Purple, Pink, Pure, Transparents, Solid transparents).
   - Hidden from publishing and `scopes = []`, so designers pick semantics.
   - Steps ordered 50 → 900; report gaps or one-off values (e.g. `Pure/Night`, `Pure/Gray-white`) as candidates to merge.
3. **Semantics**
   - Always alias a primitive (no raw values). Naming `<Role>/<Variant>/<Strength>`: `Surfaces/*`, `Content/*`, `Text/*`, `Strokes/*`, `Accent/*`, `Semantic/Error|Success|Warning/*`.
   - Correct scopes: fills `FRAME_FILL, SHAPE_FILL`; text `TEXT_FILL`; borders `STROKE_COLOR`; spacing `GAP`/padding; radius `CORNER_RADIUS`.
   - Report missing roles found while working (overlay, solid success, neutral overlays) instead of creating them silently; create them only when the user approves, aliasing existing primitives.
4. **Usage audit**: scan component sets for paints/effects bound to `Primitives/*` or with raw colors. For each, list the semantic equivalent (resolve aliases and compare values). Fix bindings only with OK; never change the resolved color while doing it (if no semantic matches exactly, log it).
5. **Legacy collections** (`Migrated legacy tokens`, duplicated names like two `Spacing/Space-12`, `Gynger brand/Text/Primary` vs `Color/Text/Primary`): map each to its canonical token and propose a migration; don't delete while bound anywhere.
6. Contrast: when a semantic is used for text/icons on a surface, compute contrast (≥ 4.5:1 text, ≥ 3:1 UI) and note failures.

## C. Styles

1. **Inventory** text, effect, paint and grid styles with usage (count nodes using each style in Brisk).
2. **Text styles canonical set**: `Desktop/H1–H5`, `Desktop/Body L|M|S/Regular|Medium|Semibold`, `Mobile/H1–H5`, `Mobile/Body L|M|S/Regular|Medium`. Everything else (`Component/UI n`, `Body Secondary/*`, `Migrated/*`, `Desktop/M`, `Desktop/XS`…) is non-canonical:
   - map each to its canonical equivalent by size/weight/line-height;
   - propose replacing it in components (only with OK), then mark the old one deprecated (`[Deprecated] …` prefix or a `Deprecated/` group) instead of deleting while it has usages.
3. **Effect styles**: group by purpose (`Shadow/Subtle|Small|Medium|Large`, `Blur/Background`); detect raw effects in components that match an existing style and propose binding them.
4. Mobile gap: components used on mobile still carry Desktop text styles inside; the fix is a Device/Mobile variant or a typography mode — log, don't patch components ad hoc.

## Standard report (always this shape, in Spanish)

```
**<Página>** — lista ✅
- Estructura: <frames creados: principal / Legacy>, fondo #333333, (New) sí/no.
- Renombres: tabla Antes | Ahora (| Visible/Privada).
- Movidos: <qué fue a qué página>.
- Descripciones: <cuáles agregué>; no toqué <cuáles>.
- Sin tocar: variantes y propiedades.
- Backlog: <ítems nuevos>.
- Necesita de vos: publicar la librería / decisión pendiente.
¿Sigo con <próxima página>?
```
