/* Overrides post-hidratación para el sitio Framer.
   Framer reconstruye el DOM al cargar, así que estos cambios se aplican
   después y se re-aplican ante cambios del DOM (MutationObserver). */
(function () {
  var BEACH = '/media/beach-sunset.webp';

  function swapFooterVideo() {
    document.querySelectorAll('video').forEach(function (v) {
      var s = v.currentSrc || v.getAttribute('src') || '';
      if (s.indexOf('BImdSqnu') === -1) return; // solo el video del footer
      var img = document.createElement('img');
      img.src = BEACH;
      img.alt = 'Beach at sunset';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.setAttribute('data-override', 'beach');
      img.style.cssText = (v.getAttribute('style') || '')
        .replace(/object-fit:\s*fill/i, 'object-fit:cover');
      if (!/object-fit/i.test(img.style.cssText)) img.style.objectFit = 'cover';
      if (!/width/i.test(img.style.cssText)) { img.style.width = '100%'; img.style.height = '100%'; }
      v.replaceWith(img);
    });
  }

  // Footer monocromático: busca la tarjeta "Let's get in touch" y la pasa a
  // escala de grises (atardecer + gato + textos), para que todo el footer
  // comparta el mismo estilo.
  function monochromeFooter() {
    var nodes = document.querySelectorAll('div, section, footer');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.dataset && el.dataset.mono === '1') continue;
      var txt = (el.textContent || '');
      if (txt.indexOf("Let's get in touch") === -1 && txt.indexOf('Let’s get in touch') === -1) continue;
      var r = el.getBoundingClientRect();
      // La tarjeta del footer: contenedor acotado (no toda la página).
      if (r.height > 120 && r.height < 700) {
        el.style.filter = 'grayscale(1)';
        el.dataset.mono = '1';
      }
    }
  }

  // Marquee de fotos del About: pasar de auto-scroll (Framer Motion) a manual.
  // Congela la animación (transform:none via CSS !important gana a los estilos
  // inline que setea Framer) y hace el contenedor arrastrable / scrolleable.
  var mqStyleInjected = false;
  function injectMqStyle() {
    if (mqStyleInjected) return;
    mqStyleInjected = true;
    var s = document.createElement('style');
    s.textContent =
      '.mq-manual-track{transform:none !important;animation:none !important;}' +
      '.mq-manual-wrap{overflow-x:auto !important;overflow-y:hidden;cursor:grab;' +
      'scrollbar-width:none;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity;}' +
      '.mq-manual-wrap::-webkit-scrollbar{display:none;}' +
      '.mq-manual-wrap.mq-drag{cursor:grabbing;}';
    document.head.appendChild(s);
  }
  function enableDrag(wrap) {
    var down = false, startX = 0, startL = 0;
    wrap.addEventListener('pointerdown', function (e) {
      down = true; startX = e.pageX; startL = wrap.scrollLeft; wrap.classList.add('mq-drag');
    });
    window.addEventListener('pointerup', function () { down = false; wrap.classList.remove('mq-drag'); });
    window.addEventListener('pointermove', function (e) {
      if (!down) return; wrap.scrollLeft = startL - (e.pageX - startX);
    });
  }
  function manualMarquee() {
    if (!/\/about/.test(location.pathname)) return; // solo el About
    var divs = document.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
      var el = divs[i];
      if (el.dataset.manualMq) continue;
      if (el.querySelectorAll('img').length < 4) continue; // marquee duplica fotos
      var st = el.getAttribute('style') || '';
      var cs = getComputedStyle(el);
      var isTrack = /translateX|translate3d/.test(st) && /transform/.test(cs.willChange);
      if (!isTrack) continue;
      el.dataset.manualMq = '1';
      el.classList.add('mq-manual-track');
      injectMqStyle();
      var wrap = el.parentElement;
      if (wrap) { wrap.classList.add('mq-manual-wrap'); enableDrag(wrap); }
    }
  }

  function apply() { swapFooterVideo(); monochromeFooter(); manualMarquee(); }

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);

  // Re-aplicar durante la ventana de hidratación de Framer.
  var obs = new MutationObserver(apply);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); apply(); }, 10000);
})();
