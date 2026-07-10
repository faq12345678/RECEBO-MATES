/**
 * RECEBO MATES — Core JavaScript
 * ─────────────────────────────────────────────────────────────
 * Funciones compartidas por todas las páginas:
 *   · Comportamiento del nav al hacer scroll
 *   · Menú mobile (apertura / cierre / accesibilidad)
 *   · Marcado del link activo según la página actual
 *   · Scroll suave para links de ancla
 *   · Año dinámico en el footer
 */

(function () {
  'use strict';

  /* ─── Referencias DOM ──────────────────────────────────── */
  const nav        = document.getElementById('siteNav');
  const burger     = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const footerYear = document.getElementById('footerYear');

  /* ─── Año en el footer ─────────────────────────────────── */
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ─── Scroll del nav ───────────────────────────────────── */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (nav) {
          nav.classList.toggle('scrolled', window.scrollY > 50);
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  if (nav) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Estado inicial en caso de que la página ya esté scrolleada
  }

  /* ─── Link activo ──────────────────────────────────────── */
  function marcarLinkActivo() {
    // Obtener el nombre del archivo actual de la URL
    const pathParts  = window.location.pathname.split('/');
    const archivo    = pathParts[pathParts.length - 1] || 'index.html';

    // Desktop
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkArchivo = link.getAttribute('href').split('/').pop();
      const esActivo = linkArchivo === archivo ||
                       (archivo === '' && linkArchivo === 'index.html');
      link.classList.toggle('nav-link--active', esActivo);
      if (esActivo) link.setAttribute('aria-current', 'page');
    });

    // Mobile
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
      const linkArchivo = link.getAttribute('href').split('/').pop();
      const esActivo = linkArchivo === archivo ||
                       (archivo === '' && linkArchivo === 'index.html');
      link.classList.toggle('mobile-nav__link--active', esActivo);
      if (esActivo) link.setAttribute('aria-current', 'page');
    });
  }

  marcarLinkActivo();

  /* ─── Menú mobile ──────────────────────────────────────── */
  let menuAbierto = false;

  function abrirMenu() {
    menuAbierto = true;
    document.body.classList.add('menu-open');

    if (burger) {
      burger.classList.add('burger--open');
      burger.setAttribute('aria-expanded', 'true');
    }
    if (mobileMenu) {
      mobileMenu.classList.add('mobile-menu--open');
      mobileMenu.removeAttribute('aria-hidden');
    }
    if (nav) {
      nav.classList.add('nav-menu-open');
    }

    // Mover foco al primer link del menú
    const primerLink = mobileMenu && mobileMenu.querySelector('.mobile-nav__link');
    if (primerLink) {
      setTimeout(() => primerLink.focus(), 60);
    }
  }

  function cerrarMenu() {
    menuAbierto = false;
    document.body.classList.remove('menu-open');

    if (burger) {
      burger.classList.remove('burger--open');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus(); // Devolver foco al botón
    }
    if (mobileMenu) {
      mobileMenu.classList.remove('mobile-menu--open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
    if (nav) {
      nav.classList.remove('nav-menu-open');
    }
  }

  function alternarMenu() {
    menuAbierto ? cerrarMenu() : abrirMenu();
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', alternarMenu);

    // Cerrar al hacer click en un link del menú
    mobileMenu.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', cerrarMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuAbierto) cerrarMenu();
    });

    // Focus trap dentro del menú mobile
    mobileMenu.addEventListener('keydown', (e) => {
      if (!menuAbierto || e.key !== 'Tab') return;

      const focusables = mobileMenu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const primero = focusables[0];
      const ultimo  = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        }
      } else {
        if (document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    });
  }

  // Cerrar menú si se redimensiona a pantalla desktop
  window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
    if (e.matches && menuAbierto) cerrarMenu();
  });

  /* ─── Scroll suave para links de ancla ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;

      const destino = document.querySelector(id);
      if (!destino) return;

      e.preventDefault();

      const altoNav   = nav ? nav.offsetHeight : 72;
      const offsetTop = destino.getBoundingClientRect().top + window.scrollY - altoNav - 16;

      window.scrollTo({ top: offsetTop, behavior: 'smooth' });

      if (menuAbierto) cerrarMenu();
    });
  });

})();
