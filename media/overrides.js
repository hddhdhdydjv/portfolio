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

  function apply() { swapFooterVideo(); monochromeFooter(); }

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);

  // Re-aplicar durante la ventana de hidratación de Framer.
  var obs = new MutationObserver(apply);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); apply(); }, 10000);
})();
