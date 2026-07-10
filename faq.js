/**
 * RECEBO MATES — FAQ Accordion
 * Maneja la apertura/cierre de preguntas con aria-expanded.
 * Cierra los demás items al abrir uno nuevo (comportamiento acordeón).
 */
(function () {
  'use strict';

  const preguntas = document.querySelectorAll('.faq-question');

  preguntas.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const estaAbierto  = btn.getAttribute('aria-expanded') === 'true';
      const respuestaId  = btn.getAttribute('aria-controls');
      const respuesta    = document.getElementById(respuestaId);

      /* Cerrar todos los demás */
      preguntas.forEach(function (otro) {
        if (otro !== btn) {
          otro.setAttribute('aria-expanded', 'false');
          const otroId = otro.getAttribute('aria-controls');
          const otraResp = document.getElementById(otroId);
          if (otraResp) otraResp.hidden = true;
        }
      });

      /* Toggle del actual */
      btn.setAttribute('aria-expanded', String(!estaAbierto));
      if (respuesta) respuesta.hidden = estaAbierto;
    });
  });

})();
