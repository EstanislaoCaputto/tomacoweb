/**
 * Selector de medios de pago con detalle dinámico.
 * @returns {void}
 */
export function iniciarPagos() {
  const botones = [...document.querySelectorAll("[data-payment-method]")];
  const paneles = [...document.querySelectorAll("[data-payment-panel]")];
  if (botones.length === 0) return;

  /**
   * @param {string} metodo
   */
  function activar(metodo) {
    botones.forEach((boton) => {
      const activo = boton.getAttribute("data-payment-method") === metodo;
      boton.classList.toggle("is-active", activo);
      boton.setAttribute("aria-pressed", String(activo));
    });

    paneles.forEach((panel) => {
      panel.hidden = panel.getAttribute("data-payment-panel") !== metodo;
    });
  }

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const metodo = boton.getAttribute("data-payment-method");
      if (!metodo) return;
      activar(metodo);
      window.history.replaceState(null, "", `#${metodo}`);
    });
  });

  const hash = window.location.hash.replace("#", "");
  const metodos = botones
    .map((boton) => boton.getAttribute("data-payment-method"))
    .filter((metodo) => Boolean(metodo));
  activar(metodos.includes(hash) ? hash : metodos[0]);
}
