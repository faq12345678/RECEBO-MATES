/**
 * RECEBO MATES — Scroll Animations
 * ─────────────────────────────────────────────────────────────
 * IntersectionObserver para revelar elementos al entrar
 * al viewport. Respeta la preferencia del sistema de
 * movimiento reducido (prefers-reduced-motion).
 *
 * Clases que observa:
 *   .reveal  → Cada elemento se anima individualmente
 *   .stagger → Los hijos se animan en secuencia
 *
 * API pública: window.ReceboAnimations.refresh()
 *   Útil para re-observar elementos añadidos dinámicamente
 *   (ej: cuando se cargan nuevos productos en el catálogo).
 */

(function () {
  'use strict';

  /* Respetar preferencia de animación reducida */
  const prefiereMenosMovimiento = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefiereMenosMovimiento) {
    /* Activar todos los elementos inmediatamente */
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal--active');
    });
    document.querySelectorAll('.stagger').forEach(el => {
      el.classList.add('stagger--active');
    });

    /* Exponer API de todas formas (no-op) */
    window.ReceboAnimations = { refresh: () => {} };
    return;
  }

  /* ─── Opciones del observer ────────────────────────────── */
  const opcionesBase = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.08,
  };

  const opcionesStagger = {
    ...opcionesBase,
    rootMargin: '0px 0px -60px 0px',
  };

  /* ─── Observer para .reveal ────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--active');
        revealObserver.unobserve(entry.target); // Solo se anima una vez
      }
    });
  }, opcionesBase);

  /* ─── Observer para .stagger ───────────────────────────── */
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('stagger--active');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, opcionesStagger);

  /* ─── Inicialización ───────────────────────────────────── */
  function init() {
    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });
    document.querySelectorAll('.stagger').forEach(el => {
      staggerObserver.observe(el);
    });
  }

  /* Inicializar después del primer paint para evitar flash */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => requestAnimationFrame(init));
    });
  } else {
    requestAnimationFrame(() => requestAnimationFrame(init));
  }

  /* ─── API pública ──────────────────────────────────────── */
  window.ReceboAnimations = {
    /**
     * Re-observar elementos .reveal y .stagger que todavía
     * no están activos. Llamar después de cargar contenido
     * dinámicamente (catálogo, filtros, etc.).
     */
    refresh() {
      document.querySelectorAll('.reveal:not(.reveal--active)').forEach(el => {
        revealObserver.observe(el);
      });
      document.querySelectorAll('.stagger:not(.stagger--active)').forEach(el => {
        staggerObserver.observe(el);
      });
    },
  };

})();
