/* Solo en la rama claude/design-process-page.
   Framer reconstruye el nav al hidratar, asi que aca, despues de la hidratacion:
   1) cambiamos el link "Email me" del nav superior por "Process" (a /process),
   2) movemos "Process" antes de "About".
   El footer "Email me" (boton de contacto) se mantiene intacto. */
(function () {
  function retext() {
    document.querySelectorAll('a').forEach(function (a) {
      if (a.dataset.navProc) return;
      if ((a.textContent || '').trim() !== 'Email me') return;
      if (a.getBoundingClientRect().top > 220) return; // solo el nav de arriba
      (a.querySelector('p') || a).textContent = 'Process';
      a.setAttribute('href', '/process');
      a.dataset.navProc = '1';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/process';
      }, true);
    });
  }

  // Mueve el item "Process" antes del item "About" dentro del mismo nav.
  function moveBefore(proc, about) {
    var pa = proc;
    for (var i = 0; i < 6 && pa; i++) {
      var aa = about;
      for (var j = 0; j < 6 && aa; j++) {
        if (pa.parentNode && pa.parentNode === aa.parentNode) {
          if (pa === aa) return true;
          // solo mover si Process viene DESPUES de About (evita loop)
          if (aa.compareDocumentPosition(pa) & Node.DOCUMENT_POSITION_FOLLOWING) {
            pa.parentNode.insertBefore(pa, aa);
          }
          return true;
        }
        aa = aa.parentElement;
      }
      pa = pa.parentElement;
    }
    return false;
  }

  function reorder() {
    var top = function (a) { return a.getBoundingClientRect().top < 220; };
    var procs = [].filter.call(document.querySelectorAll('a'), function (a) {
      return (a.textContent || '').trim() === 'Process' && top(a);
    });
    var abouts = [].filter.call(document.querySelectorAll('a'), function (a) {
      return (a.textContent || '').trim() === 'About' && top(a);
    });
    procs.forEach(function (proc) {
      for (var i = 0; i < abouts.length; i++) {
        if (moveBefore(proc, abouts[i])) break;
      }
    });
  }

  function apply() { retext(); reorder(); }

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);

  var obs = new MutationObserver(apply);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); apply(); }, 10000);
})();
