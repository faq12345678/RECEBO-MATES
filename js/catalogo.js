/**
 * ============================================================
 * RECEBO MATES — Catálogo JS (js/catalogo.js)
 * ============================================================
 * Funcionalidades:
 *   · Filtro de productos por categoría (data-category)
 *   · Scroll suave hasta la primera tarjeta visible tras filtrar
 *   · Animación de aparición de tarjetas al filtrar
 *   · Contador de resultados visible actualizado en tiempo real
 *   · Estado vacío cuando no hay productos en la categoría
 *   · aria-pressed en botones de filtro (accesibilidad)
 *   · Filtro aplicado desde URL: catalogo.html?cat=mate
 * ============================================================
 */

(function () {
  'use strict';

  /* ── Referencias DOM ────────────────────────────────────── */
  var filterBtns  = document.querySelectorAll('[data-filter]');
  var productos   = document.querySelectorAll('[data-category]');
  var countEl     = document.getElementById('catalogCount');
  var emptyState  = document.getElementById('catalogEmpty');
  var grid        = document.getElementById('catalogGrid');

  /* ── Filtro activo ──────────────────────────────────────── */
  var filtroActual = 'todos';

  /**
   * Aplica el filtro de categoría y actualiza la UI.
   * @param {string} filtro - 'todos' o nombre de categoría
   * @param {boolean} [scroll=false] - si debe scrollear al grid
   */
  function aplicarFiltro(filtro, scroll) {
    filtroActual = filtro;

    /* ── Actualizar botones ── */
    filterBtns.forEach(function (btn) {
      var activo = btn.dataset.filter === filtro;
      btn.classList.toggle('filter-btn--active', activo);
      btn.setAttribute('aria-pressed', String(activo));
    });

    /* ── Mostrar/ocultar tarjetas con animación ── */
    var visible = 0;
    var primerVisible = null;

    productos.forEach(function (card) {
      var coincide = filtro === 'todos' || card.dataset.category === filtro;

      if (coincide) {
        card.removeAttribute('hidden');
        card.classList.remove('catalog-card--oculta');
        visible++;
        if (!primerVisible) primerVisible = card;
      } else {
        card.setAttribute('hidden', '');
        card.classList.add('catalog-card--oculta');
      }
    });

    /* ── Actualizar contador ── */
    if (countEl) {
      if (filtro === 'todos') {
        countEl.textContent = visible + ' productos';
      } else {
        var label = filtro.charAt(0).toUpperCase() + filtro.slice(1) + 's';
        countEl.textContent = visible + ' ' + (visible === 1 ? filtro : label);
      }
    }

    /* ── Estado vacío ── */
    if (emptyState) {
      emptyState.hidden = visible > 0;
    }

    /* ── Scroll suave al grid si se pidió ── */
    if (scroll && grid) {
      var navHeight = document.getElementById('siteNav')
        ? document.getElementById('siteNav').offsetHeight
        : 64;
      var toolbar = document.querySelector('.catalog-toolbar');
      var offsetTop = toolbar
        ? toolbar.getBoundingClientRect().top + window.scrollY - navHeight - 16
        : grid.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
      });
    }
  }

  /* ── Listeners en botones de filtro ──────────────────────  */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      /* Scroll solo cuando el filtro cambia */
      var scrollNeeded = btn.dataset.filter !== filtroActual;
      aplicarFiltro(btn.dataset.filter, scrollNeeded);
    });
  });

  /* ── Leer filtro inicial desde URL (?cat=mate) ───────────  */
  function getFiltroUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get('cat') || 'todos';
    } catch (e) {
      return 'todos';
    }
  }

  /* ── Inicializar ─────────────────────────────────────────  */
  var filtroInicial = getFiltroUrl();

  // Si hay un filtro en la URL (venimos de otra página), aplicar Y hacer scroll
  var tieneParamCat = (function() {
    try { return !!new URLSearchParams(window.location.search).get('cat'); }
    catch(e) { return false; }
  })();

  aplicarFiltro(filtroInicial, tieneParamCat);

  /* ── Actualizar URL al cambiar filtro (sin recargar) ─────  */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      try {
        var url = new URL(window.location.href);
        if (btn.dataset.filter === 'todos') {
          url.searchParams.delete('cat');
        } else {
          url.searchParams.set('cat', btn.dataset.filter);
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) { /* silently ignore en browsers sin URL API */ }
    });
  });

  /* ── Lazy loading fallback (para HEIC en browsers viejos) ─  */
  if ('IntersectionObserver' in window) {
    var imgObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            imgObs.unobserve(img);
          }
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(function (img) {
      imgObs.observe(img);
    });
  }

  /* ── Error handler para imágenes rotas ───────────────────  */
  document.querySelectorAll('.catalog-card__img').forEach(function (img) {
    img.addEventListener('error', function () {
      /* Si la imagen falla, mostrar un fondo con el inicial del producto */
      var card  = img.closest('.catalog-card');
      var wrap  = img.closest('.catalog-card__img-wrap');
      var name  = card ? card.querySelector('.catalog-card__name') : null;
      if (!wrap) return;

      img.style.display = 'none';

      var placeholder = document.createElement('div');
      placeholder.className = 'catalog-card__img-fallback';
      placeholder.setAttribute('aria-hidden', 'true');
      placeholder.innerHTML =
        '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
        '<circle cx="8.5" cy="8.5" r="1.5"/>' +
        '<polyline points="21 15 16 10 5 21"/>' +
        '</svg>' +
        '<span>' + (name ? name.textContent.substring(0, 20) : 'Foto') + '</span>';
      wrap.appendChild(placeholder);
    });
  });

})();
