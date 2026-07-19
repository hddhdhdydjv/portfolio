/* Solo en la rama claude/design-process-page.
   Framer reconstruye el nav al hidratar, así que acá, despues de la hidratacion,
   cambiamos el link "Email me" del nav superior por "Process" (a /process).
   El footer "Email me" (boton de contacto) se mantiene intacto. */
(function () {
  function apply() {
    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.dataset.navProc) continue;
      if ((a.textContent || '').trim() !== 'Email me') continue;
      var r = a.getBoundingClientRect();
      if (r.top > 220) continue; // solo el nav de arriba, no el boton del footer
      var label = a.querySelector('p') || a;
      label.textContent = 'Process';
      a.setAttribute('href', '/process');
      a.dataset.navProc = '1';
      // Navegacion real (evita que el router SPA de Framer intercepte el click)
      a.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/process';
      }, true);
    }
  }

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);

  var obs = new MutationObserver(apply);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); apply(); }, 10000);
})();
