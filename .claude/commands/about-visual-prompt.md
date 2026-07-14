# About Section Visual Column — Resize & Replace Prompt

**Use this prompt in future sessions to resize about section images without token waste.**

---

## Task: Resize About Visual Images

**Target dimensions:** 176×246px (exactly 50% of original 352×492px)  
**Figma reference:** Node 168-152376  
**Image locations:**
- `/Users/alejandroarab/Documents/alejandro-arab/assets/about-visuals/en/visual.png`
- `/Users/alejandroarab/Documents/alejandro-arab/assets/about-visuals/en/row2.png`

### Instructions:
1. **Resize images using macOS `sips` command to 176×246px** — maintain source quality, no compression
   ```bash
   sips -z 246 176 "path/to/image.png" --out "path/to/image.png"
   ```

2. **Update CSS aspect-ratio** in `index.html` `<style>` block:
   ```css
   /* Find this: */
   .about-col-visual-row1,
   .about-col-visual-row2 {
     aspect-ratio: XXX / YYY;  /* current value */
     ...
   }
   
   /* Replace with: */
   .about-col-visual-row1,
   .about-col-visual-row2 {
     aspect-ratio: 176 / 246;  /* new value */
     ...
   }
   ```

3. **Verify in browser** — check that visual columns are proportionally smaller and images display without cropping (use `object-fit: contain`)

### Key Constraints:
- ✓ Image quality must NOT be reduced (use native OS resize tools only)
- ✓ Proportions must match Figma exactly (176:246 = 8:9.93)
- ✓ Both images must be identical dimensions
- ✓ CSS aspect-ratio must reflect new dimensions

### Files that may need updates:
- `index.html` — CSS only (aspect-ratio in `.about-col-visual-row1`, `.about-col-visual-row2`)
- Image files — `/assets/about-visuals/en/visual.png`, `/assets/about-visuals/en/row2.png`

---

**Status:** ✓ Completed as of 2026-04-16  
**Current dimensions:** 176×246px  
**Next size change:** If needed, maintain aspect-ratio 176:246 and update CSS accordingly
