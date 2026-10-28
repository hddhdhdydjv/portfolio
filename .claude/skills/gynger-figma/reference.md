# gynger-figma — reusable snippets

Paste into `use_figma` scripts. All assume `sec` is the section (or frame) that holds the screens and that coordinates are relative to it.

## Connector arrow (our rule)

```js
const C = {green:{r:0.42,g:0.85,b:0.45}, orange:{r:0.98,g:0.62,b:0.22}, red:{r:0.93,g:0.33,b:0.33}};
async function draw(pts, color, name) {
  const minX = Math.min(...pts.map(p=>p.x)), minY = Math.min(...pts.map(p=>p.y));
  const verts = pts.map((p,i)=>{ let cr = 0; if (i>0 && i<pts.length-1) {
      const a = Math.hypot(p.x-pts[i-1].x,p.y-pts[i-1].y), b = Math.hypot(pts[i+1].x-p.x,pts[i+1].y-p.y);
      cr = Math.min(48, a/2, b/2); }
    return {x:p.x-minX, y:p.y-minY, strokeCap: i===0?'CIRCLE_FILLED':(i===pts.length-1?'ARROW_LINES':'NONE'), cornerRadius:cr, strokeJoin:'ROUND'}; });
  const segs = []; for (let i=0;i<pts.length-1;i++) segs.push({start:i,end:i+1,tangentStart:{x:0,y:0},tangentEnd:{x:0,y:0}});
  const v = figma.createVector(); sec.appendChild(v);
  await v.setVectorNetworkAsync({vertices:verts, segments:segs, regions:[]});
  v.fills = []; v.strokes = [{type:'SOLID', color:C[color]}]; v.strokeWeight = 6; v.strokeJoin = 'ROUND';
  v.x = minX; v.y = minY; v.name = '↳ ' + name; return v;
}
// L-route: straight if same y, otherwise bend in the gap before the target
const path = (p1, p2, mx) => Math.abs(p1.y-p2.y) < 1 ? [p1,p2] : [p1,{x:mx,y:p1.y},{x:mx,y:p2.y},p2];
```

## Anchor on the triggering element

```js
const SB = () => sec.absoluteBoundingBox;
const rel = b => ({x:b.x-SB().x, y:b.y-SB().y, w:b.width, h:b.height});
const visible = (n, f) => { for (let p=n; p && p.id!==f.id; p=p.parent) if (p.visible===false) return false; return true; };
async function at(frameId, label, pick='first') {          // a visible text label
  const f = await figma.getNodeByIdAsync(frameId);
  const ts = f.findAllWithCriteria({types:['TEXT']}).filter(t=>t.characters.trim()===label && visible(t,f))
    .sort((a,b)=>a.absoluteBoundingBox.y-b.absoluteBoundingBox.y);
  const t = pick==='last' ? ts[ts.length-1] : ts[0];
  const b = rel(t.absoluteBoundingBox); return {x:b.x+b.w+16, y:b.y+b.h/2};
}
async function atInst(frameId, re) {                        // an instance (composer, Edit, Save…)
  const f = await figma.getNodeByIdAsync(frameId);
  const n = f.findAll(n=>n.type==='INSTANCE' && re.test(n.name) && visible(n,f))[0];
  const b = rel(n.absoluteBoundingBox); return {x:b.x+b.w+8, y:b.y+b.h/2};
}
const target = (f, y) => ({x:f.x, y:Math.min(Math.max(y, f.y+60), f.y+f.height-60)});
```

## Exit pill

Clone an existing exit pill (Design File: `56:30161`) and change its two texts: title `→ 3.2 Company profile`, subtitle `Starts the credit application`. Arrow from the CTA straight to `pill.x`, pill centred on the CTA's y. In DEV, add `subtitle.hyperlink = {type:'NODE', value: targetSection.id}`.

## Brisk doc frame for a Components page

```js
const header = await figma.getNodeByIdAsync('7021:2744');           // Doc header (Brisk)
for (const t of header.findAllWithCriteria({types:['TEXT']})) for (const s of t.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(s.fontName);
const key = n => Object.keys(header.componentPropertyDefinitions).find(k=>k.startsWith(n+'#'));
const white = await figma.variables.getVariableByIdAsync('VariableID:2582:1603');
const wrap = figma.createAutoLayout('VERTICAL', {name: PAGE, itemSpacing:0}); page.appendChild(wrap);
wrap.fills = [figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:1,g:1,b:1}},'color',white)];
wrap.cornerRadius = 24; wrap.clipsContent = true; wrap.counterAxisSizingMode = 'FIXED'; wrap.resize(W, wrap.height);
const h = header.createInstance(); wrap.appendChild(h); h.layoutSizingHorizontal = 'FILL';
h.setProperties({[key('Section title')]:'Components',[key('Page title')]:PAGE,[key('Heading')]:PAGE,[key('Supporting text')]:DESC});
const area = figma.createFrame(); area.name = 'Components'; area.fills = []; wrap.appendChild(area);
area.resize(W, H); area.layoutSizingHorizontal = 'FILL';     // then append the sets with x/y = 80 + relative offset
page.backgrounds = [{type:'SOLID', color:{r:0.2,g:0.2,b:0.2}}];  // #333333
```

## Mobile text styles (Brisk keys)

```js
const K = {'Mobile/H1':'6010e382af371f3ed21ae7f793455e3036fbb3e6','Mobile/H2':'c71e18c0e56a892762f2aebac2393982259b3002',
 'Mobile/H3':'f6d00c87078fd2d3a8574aad6b43428a9198cae9','Mobile/H4':'5dc192a5dfc246b3b56f0d8e054dd1252fcfb697',
 'Mobile/H5':'0f931e895e6e3943eee766bd120a640fb865ea41','Mobile/Body L/Regular':'4dab83a02808e0938559fa87eaef81afe61153b5',
 'Mobile/Body L/Medium':'b5a9c6671568f661ca09a3966564b9836b055f9b','Mobile/Body M/Regular':'4cd643ebfc2a286f503dc9d2a12d14c1c770bfc2',
 'Mobile/Body M/Medium':'d078d87a02de61b8710e8e6016d5e02bf29bef5d','Mobile/Body S/Regular':'b21c4bc066daa108c3a90087e8a56c1357257f1e',
 'Mobile/Body S/Medium':'890f348794095e809fe6d9ec1fe7c048e7d5485d'};
// Desktop/Hn → Mobile/Hn; Desktop/Body X/Regular|Medium → same; Semibold → Medium.
// Unstyled/component styles: by size (≥34 H1, ≥26 H2, ≥21 H3, ≥19 H4, ≥17 H5, ≥15 Body L, ≥13 Body M, else Body S) and weight.
// Skip text under 10px (icon labels). Import with figma.importStyleByKeyAsync(key), then t.setTextStyleIdAsync(style.id).
```

## Useful Brisk keys

| Asset | Key / ID |
|---|---|
| Backdrop (component) | `1fee9601c16aa27a89a00794619a0a553ba751ea` |
| Icon button (set) | `c2d7bb30c39b46ae048b590bf66e7abfd1c3993b` · icon `cancel` `95041b12b820934f21da72ad0300c0d06e52fc20` |
| Mobile navbar (set) | `ada6cabc2f409d1ca86cb2e75428e258bcef844e` |
| Progress Bar (set) | `2d9f3af5d9538113c788339353c719e63b4b9135` |
| Navigation button (set) | `b13fadb916cdb3d2e5687140810411deafcdaee9` |
| Surfaces/Base · Strokes/Cold/Medium · Content/Subtle | `a2f9989a7e2297afd894f19f7cdb2f8f9dd650d9` · `607f7fae9b5f2e475aa8fa6b708983c5e9ca8c18` · `1b953161fa752831dd33277737005383f33e7980` |
| radius-24 · Space-16 · Space-24 | `728422165f65a7383b03804c4187e3c5920f1113` · `7f507a4a08a25757e69209df9a70e14a75c57edc` · `d53123601dc33d7d5db0041b4fa10edec1800d5e` |

Keys can change if a component is rebuilt; if an import fails, look the asset up again in Brisk.
