/**
 * ============================================================
 * RECEBO MATES — Motor de página de producto (js/producto.js)
 * ============================================================
 * Lee el parámetro ?id= de la URL y rellena dinámicamente
 * todos los campos de producto.html con los datos del
 * archivo js/productos-data.js.
 *
 * Si el id no existe → redirige al catálogo.
 * ============================================================
 */

(function () {
  'use strict';

  // ── Helpers ──────────────────────────────────────────────

  /** Obtiene el parámetro ?id= de la URL actual */
  function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || '';
  }

  /** Escapa texto para uso seguro en HTML */
  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Fija text content de un elemento por id (si existe) */
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '';
  }

  /** Fija innerHTML de un elemento por id (si existe) */
  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html || '';
  }

  /** Fija atributo de un elemento por id (si existe) */
  function setAttr(id, attr, value) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, value || '');
  }

  // ── Icono SVG de imagen placeholder ──────────────────────
  const SVG_PLACEHOLDER = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <span>Foto pendiente</span>`;

  // ── Renderizar imagen principal ───────────────────────────
  function renderImgPrincipal(producto) {
    const wrap = document.getElementById('productoImgWrap');
    if (!wrap) return;

    if (producto.img) {
      wrap.innerHTML = `
        <img
          src="${esc(producto.img)}"
          alt="${esc(producto.nombre)}"
          class="product-gallery__img"
          width="600"
          height="800"
          fetchpriority="high"
          onerror="this.parentElement.innerHTML='<div class=\\'product-gallery__placeholder\\' aria-label=\\'Imagen no disponible\\'>${SVG_PLACEHOLDER.replace(/\n/g,' ')}</div>'"
        />`;
    } else {
      wrap.innerHTML = `
        <div class="product-gallery__placeholder" aria-label="Imagen del producto — pendiente">
          ${SVG_PLACEHOLDER}
        </div>`;
    }
  }

  // ── Renderizar miniaturas ─────────────────────────────────
  function renderMiniaturas(producto) {
    const wrap = document.getElementById('productoThumbs');
    if (!wrap) return;

    const imgs = [producto.img, ...(producto.imgs || [])].filter(Boolean);

    if (imgs.length <= 1) {
      wrap.innerHTML = '';
      return;
    }

    wrap.innerHTML = imgs.map((src, i) => `
      <button
        class="product-gallery__thumb${i === 0 ? ' product-gallery__thumb--active' : ''}"
        aria-label="Ver imagen ${i + 1}"
        data-src="${esc(src)}"
        type="button"
      >
        <img src="${esc(src)}" alt="${esc(producto.nombre)} — imagen ${i + 1}"
             width="80" height="80" loading="lazy" />
      </button>`).join('');

    // Interacción de miniaturas
    wrap.querySelectorAll('.product-gallery__thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        const mainImg = document.querySelector('#productoImgWrap img');
        if (mainImg) {
          mainImg.src = btn.dataset.src;
          mainImg.classList.add('product-gallery__img--fade');
          setTimeout(() => mainImg.classList.remove('product-gallery__img--fade'), 300);
        }
        wrap.querySelectorAll('.product-gallery__thumb').forEach(b => b.classList.remove('product-gallery__thumb--active'));
        btn.classList.add('product-gallery__thumb--active');
      });
    });
  }

  // ── Renderizar badge ──────────────────────────────────────
  function renderBadge(producto) {
    const wrap = document.getElementById('productoBadgeWrap');
    if (!wrap) return;

    if (producto.badge) {
      const cls = producto.badgeVariant === 'gold'
        ? 'product-badge product-badge--gold'
        : 'product-badge';
      wrap.innerHTML = `<span class="${cls}">${esc(producto.badge)}</span>`;
    } else {
      wrap.innerHTML = '';
    }
  }

  // ── Renderizar precio ─────────────────────────────────────
  function renderPrecio(producto) {
    const el = document.getElementById('productoPrecio');
    if (!el) return;

    if (producto.precio) {
      el.textContent = producto.precio;
      el.classList.remove('product-info__price-value--pending');
    } else {
      el.textContent = 'Consultá el precio';
      el.classList.add('product-info__price-value--pending');
    }
  }

  // ── Renderizar link de WhatsApp ───────────────────────────
  function renderWaLink(producto) {
    const btn = document.getElementById('productWaBtn');
    if (!btn) return;

    const url = `https://wa.me/${RECEBO_WA}?text=${producto.waMsg}`;
    btn.setAttribute('href', url);
    btn.setAttribute('aria-label', `Consultar por WhatsApp sobre ${producto.nombre}`);
  }

  // ── Renderizar productos relacionados ─────────────────────
  function renderRelacionados(producto) {
    const grid = document.getElementById('relacionadosGrid');
    if (!grid) return;

    const relacionados = getRelacionados(producto.categoria, producto.id);

    if (relacionados.length === 0) {
      grid.closest('section')?.remove();
      return;
    }

    grid.innerHTML = relacionados.map((p, i) => `
      <li class="product-related__card">
        <a href="producto.html?id=${esc(p.id)}" class="product-related__link" tabindex="-1" aria-hidden="true">
          ${p.img
            ? `<img src="${esc(p.img)}" alt="${esc(p.nombre)}"
                    class="product-related__img"
                    width="300" height="400" loading="lazy" />`
            : `<div class="product-related__img-placeholder" aria-hidden="true">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
               </div>`
          }
        </a>
        <div class="product-related__body">
          <span class="product-related__cat">${esc(p.catLabel)}</span>
          <h3 class="product-related__name">${esc(p.nombre)}</h3>
          <div class="product-related__footer">
            <span class="product-related__price">${esc(p.precio || 'Consultá precio')}</span>
            <a href="producto.html?id=${esc(p.id)}"
               class="btn btn--ghost btn--sm product-related__cta"
               id="relatedProd${i + 1}">
              Ver detalle
            </a>
          </div>
        </div>
      </li>`).join('');
  }

  // ── Actualizar SEO dinámicamente ─────────────────────────
  function updateSeo(producto) {
    document.title = `${producto.nombre} — Recebo Mates`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content',
        `${producto.desc} Compralo en Recebo Mates. Envíos a todo el país.`
      );
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', `${producto.nombre} — Recebo Mates`);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', producto.desc);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && producto.img) {
      ogImg.setAttribute('content', `https://recebomates.com.ar/${producto.img}`);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href',
        `https://recebomates.com.ar/producto.html?id=${producto.id}`
      );
    }

    // Schema.org Product
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: producto.nombre,
      description: producto.descLarga || producto.desc,
      brand: { '@type': 'Brand', name: 'Recebo Mates' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'ARS',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'Recebo Mates' }
      }
    };
    if (producto.precio) {
      const numStr = producto.precio.replace(/[^0-9]/g, '');
      if (numStr) schema.offers.price = numStr;
    }
    if (producto.img) {
      schema.image = `https://recebomates.com.ar/${producto.img}`;
    }

    let schemaEl = document.getElementById('productoSchema');
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.id = 'productoSchema';
      schemaEl.type = 'application/ld+json';
      document.head.appendChild(schemaEl);
    }
    schemaEl.textContent = JSON.stringify(schema);
  }

  // ── Renderizado principal ─────────────────────────────────
  function init() {
    const id = getIdFromUrl();

    if (!id) {
      window.location.href = 'catalogo.html';
      return;
    }

    const producto = getProductoById(id);

    if (!producto) {
      // Producto no encontrado → redirigir al catálogo
      console.warn(`[Recebo] Producto no encontrado: "${id}"`);
      window.location.href = 'catalogo.html';
      return;
    }

    // 1. Imagen principal
    renderImgPrincipal(producto);

    // 2. Miniaturas
    renderMiniaturas(producto);

    // 3. Badge
    renderBadge(producto);

    // 4. Breadcrumb
    setText('productoBreadcrumb', producto.nombre);

    // 5. Categoría (eyebrow)
    setText('productoCategoria', producto.catLabel);

    // 6. Título / h1
    setText('productoTitle', producto.nombre);

    // 7. Precio
    renderPrecio(producto);

    // 8. Descripción
    setText('productoDesc', producto.descLarga || producto.desc);

    // 9. Link de WhatsApp
    renderWaLink(producto);

    // 10. Relacionados
    renderRelacionados(producto);

    // 11. SEO
    updateSeo(producto);

    // 12. Clase body para animaciones
    document.body.classList.add('producto-cargado');
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
