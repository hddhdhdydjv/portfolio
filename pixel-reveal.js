// ── PIXEL REVEAL ─────────────────────────────────────────────────────────────
//  Efecto modo "both": scroll → resolución media, hover → resolución completa.
//  Se auto-aplica a: .proj-img-ph, .card-cover, .cover-img, .img-frame
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  'use strict';

  // Add border-radius styles for canvases that replace <img> tags
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .proj-img-ph canvas, .img-frame canvas { border-radius: 2px; }
    .card-cover canvas, .cover-img canvas  { border-radius: 4px; }
  `;
  document.head.appendChild(styleEl);

  class PixelReveal {
    constructor(wrap) {
      if (wrap._pr) return;
      wrap._pr = this;

      const imgEl = wrap.querySelector('img');
      if (!imgEl) return;
      const src = imgEl.getAttribute('src');
      if (!src) return;

      this.startPx   = 24;
      this.currentPx = this.startPx;
      this.targetPx  = this.startPx;
      this.raf       = null;
      this.scrollDone = false;

      // Create canvas and insert next to img (img stays hidden while loading)
      this.canvas = document.createElement('canvas');
      this.canvas.style.cssText = 'width:100%;display:block;image-rendering:pixelated;image-rendering:crisp-edges;';
      this.ctx = this.canvas.getContext('2d');
      imgEl.style.display = 'none';
      imgEl.after(this.canvas);

      const image = new Image();
      image.onload = () => {
        this.W = image.naturalWidth;
        this.H = image.naturalHeight;
        if (!this.W || !this.H) { this._restore(imgEl); return; }
        this.canvas.width  = this.W;
        this.canvas.height = this.H;
        this.source = image;
        imgEl.remove();
        this.render();
        this.bind();
      };
      image.onerror = () => this._restore(imgEl);
      image.src = src;
    }

    _restore(imgEl) {
      imgEl.style.display = '';
      if (this.canvas) this.canvas.remove();
    }

    render() {
      const { ctx, source, W, H } = this;
      const ps = Math.max(1, this.currentPx);

      if (ps <= 1) {
        this.canvas.style.imageRendering = 'auto';
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(source, 0, 0, W, H);
        return;
      }

      this.canvas.style.imageRendering = 'pixelated';
      ctx.imageSmoothingEnabled = false;
      const sw = Math.ceil(W / ps);
      const sh = Math.ceil(H / ps);
      const tmp = document.createElement('canvas');
      tmp.width = sw; tmp.height = sh;
      const tc = tmp.getContext('2d');
      tc.imageSmoothingEnabled = false;
      tc.drawImage(source, 0, 0, sw, sh);
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(tmp, 0, 0, W, H);
    }

    step() {
      const diff = this.targetPx - this.currentPx;
      if (Math.abs(diff) < 0.22) {
        this.currentPx = this.targetPx;
        this.render();
        this.raf = null;
        return;
      }
      this.currentPx += diff * 0.14;
      this.render();
      this.raf = setTimeout(() => { this.raf = null; this.step(); }, 28);
    }

    animateTo(target) {
      this.targetPx = target;
      if (!this.raf) this.step();
    }

    forceToTarget(target) {
      if (this.raf) { clearTimeout(this.raf); this.raf = null; }
      this.targetPx = target;
      this.step();
    }

    bind() {
      const mid = Math.max(2, Math.floor(this.startPx / 2.5)); // ~3px on scroll

      // Scroll trigger → medium resolution
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          this.scrollDone = true;
          setTimeout(() => this.animateTo(mid), 80);
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(this.canvas);

      // Hover → full resolution, leave → back to medium
      this.canvas.addEventListener('mouseenter', () => {
        if (!this.scrollDone) return;
        this.forceToTarget(1);
      });
      this.canvas.addEventListener('mouseleave', () => {
        if (!this.scrollDone) return;
        this.forceToTarget(mid);
      });
    }
  }

  const SEL = '.proj-img-ph, .card-cover, .cover-img, .img-frame';

  function init(root) {
    (root || document).querySelectorAll(SEL).forEach(el => {
      if (!el._pr) new PixelReveal(el);
    });
  }

  window.PixelReveal     = PixelReveal;
  window.initPixelReveal = init;

  // Initial scan
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Watch for dynamically rendered elements (projects.html, works/*.html)
  new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches && node.matches(SEL) && !node._pr) new PixelReveal(node);
        if (node.querySelectorAll) {
          node.querySelectorAll(SEL).forEach(el => {
            if (!el._pr) new PixelReveal(el);
          });
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

})();
