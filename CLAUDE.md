# Portfolio — Alejandro Arab

## Stack
HTML + CSS vanilla, sin frameworks ni build tools. Sin TypeScript, sin React.

## Proyecto
- **Ruta**: `/Users/alejandroarab/Documents/alejandro-arab/`
- **Servidor**: Live Server puerto 5500 (ID: `f919da7b-98d6-407a-8a7a-f7736e43a7b8`) — usar `mcp__Claude_Preview__preview_start` con name "Live Server (npx)"
- **Figma file key**: `Z7NPMYSLT4oPu1usXYGCBv`

## Archivos principales
| Archivo | Descripción |
|---|---|
| `index.html` | Página principal — todo el CSS está inline en `<style>` |
| `tokens.css` | Design tokens (colores, fuentes) |
| `sidebar.js` | Sidebar de navegación |
| `translate.js` | i18n EN/ES |
| `projects.js` | Datos de proyectos |
| `contact.html` | Página de contacto |
| `projects.html` | Página de proyectos |

## Assets
```
assets/
  about-visuals/         — Sección "About" — composited visuals por idioma (440×615, 440×523)
    en/
      visual.png         — Row 1 "Who I Am" (foto + stickies integrados) ✓ SUBIDO
      row2.png           — Row 2 "Beyond Professional" (3 polaroids integrados) — PENDIENTE SUBIR
    es/
      visual.png         — Row 1 — VERSION ESPAÑOL
      row2.png           — Row 2 — VERSION ESPAÑOL
  sticky-assets/
    sticky-note-xl.svg   — sticky amarillo (Availability) — footer contact

## Workflow: cambiar idioma sección About
1. Row 1 EN: `assets/about-visuals/en/visual.png` ✓ LISTO
2. Row 1 ES: Usuario sube a `assets/about-visuals/es/visual.png` → cambiar en HTML línea ~1003
3. Row 2 EN: Usuario sube a `assets/about-visuals/en/row2.png` (440×523px, 3 polaroids integrados)
4. Row 2 ES: Usuario sube a `assets/about-visuals/es/row2.png`
5. Para cambiar idioma: editar HTML `en/` → `es/` en ambas líneas (row1 y row2)
```

## Design tokens (tokens.css)
- `--bg` → fondo oscuro `#16160f`
- `--text` → crema `#c8c49a`
- `--muted` → `#8c8a6a`
- `--amber` → `#d4900e`
- `--border` → `#2d2d21`
- `--font` → `'Departure Mono', monospace`

## Secciones de index.html
| ID | Descripción |
|---|---|
| `#hero` | Hero con typewriter |
| `#about` | Who I Am — 2 rows con polaroids y stickies |
| `#experience` | Work history |
| `#services` | What I do |
| `#contact` | Let's build + sticky XL + social links |

## Layout contact section (Figma node 168-152511)
- `display:flex; gap:88px` — dos columnas
- Left: `flex:1` — heading only
- Right: `width:455px` — sticky SVG + links con `gap:40px`
- SVGs de sticky tienen rotación ya aplicada — NO agregar CSS rotate adicional
- Breakpoint mobile `max-width:1024px`: `flex-direction:column`

## Clases CSS clave
- `.about-sticky.about-sticky-blue` → sticky M (left:2.5%, top:55.1%, width:54.5%)
- `.about-sticky.about-sticky-peach` → sticky S (left:45.7%, top:66.7%, width:46.8%)
- `.about-polaroid` → polaroid principal row 1
- `.about-pol-1/2/3` → 3 polaroids row 2
- `.contact-sticky-img` → sticky XL contact
- `.contact-right` → flex col, gap:40px, width:455px

## i18n
Las claves de traducción están en `translate.js`. Atributos: `data-i18n="key"` para texto, `data-i18n-html="key"` para HTML con tags.

## Tipografía
- Títulos de sección: `clamp(59px, 8vw, 117px)`, line-height:0.9, letter-spacing:-0.03em, uppercase
- Nav/body: 15px, letter-spacing:0.04em
- Muted/sub: 17px

## Convenciones de trabajo
- Editar CSS directamente en el `<style>` de index.html (no hay archivos CSS separados por sección)
- No re-leer archivos que ya están en contexto
- Verificar con una sola ronda de JS measurements, no múltiples screenshots
- Servidor ya corriendo → no reiniciar a menos que sea necesario

## Sistema de espaciado
- **Todos los espaciados son múltiplos de 8px** (8, 16, 24, 32, 48, 56, 64, 88, 184, 208, etc.)
- Base unit desktop para padding seccional: **48px** (antes era 44, migrado)
- Mobile padding seccional: **16px** (texto e imágenes)
- Gap estándar sidebar↔hoja al abrir: **24px**

## Breakpoints responsive
| Breakpoint | Rango | Comportamiento |
|---|---|---|
| Desktop | >1024px | Layout completo con ambas columnas perforadas |
| Tablet | 769–1024px | `.notebook-paper { margin: 24px 24px 0 24px }` — ambas columnas visibles |
| Mobile | ≤768px | `.notebook-paper { margin: 24px 0 0 0 }` — col izq pegada al borde, col der oculta |

## Layout mobile del notebook (works/*.html)
- `.notebook-paper` mobile: `margin: 24px 0 0 0` — pegada al borde izq, hoja sobresale por la derecha (overflow hidden)
- `.notebook-col--right { display: none }` en mobile — solo la col izq con agujeros visible
- Al abrir sidebar (`body.sidebar-push`): `.notebook-paper { margin-left: 24px }` + el `translateX(260px)` del body → hoja queda a 24px del borde derecho del sidebar
- Transition: `margin-left 0.35s cubic-bezier(0.16,1,0.3,1)` coincide con el del sidebar
- `.notebook-inner .project-hero { padding-top: 184px }` en ≤1024px (espacio entre nav y [num/total])
- `.notebook-inner { padding-left: 66px }` — conserva espacio para la columna perforada izq

## Archivos /works/ HTML
- 10 proyectos reales: brikka, carla, fan-raise, kordiis, off-the-grid, rockmap, thinknube-ai, tickit, tickit-clubes, whasi
- `project.html` es plantilla genérica (sin notebook)
- `hasi.html` está vacío (0 bytes)
