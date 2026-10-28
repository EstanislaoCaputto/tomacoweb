/**
 * Inyecta las piezas compartidas que dependen de JavaScript:
 * panel del carrito, toasts, botón de volver arriba y plantilla de ítem.
 */
import { icono } from "./iconos.js";

const MARCA_CARRITO = "data-tomacco-cart";

/**
 * @returns {void}
 */
export function montarShell() {
  if (document.querySelector("[data-tomacco-shell]")) return;

  const contenedor = document.createElement("div");
  contenedor.setAttribute("data-tomacco-shell", "");
  contenedor.innerHTML = `
    <div class="offcanvas offcanvas-end cart-panel" tabindex="-1" id="carritoPanel" aria-labelledby="carritoPanelLabel" ${MARCA_CARRITO}>
      <div class="offcanvas-header">
        <div>
          <p class="eyebrow mb-1">Tu pedido</p>
          <h2 class="offcanvas-title" id="carritoPanelLabel">Carrito</h2>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar carrito"></button>
      </div>
      <div class="offcanvas-body">
        <div class="cart-empty" data-cart-empty>
          <span class="cart-empty__icon">${icono("bag", { size: 26 })}</span>
          <div>
            <p class="mb-1"><strong>Tu carrito está vacío.</strong></p>
            <p class="mb-3">Sumá tabacos, cedas o filtros y armá tu pedido.</p>
            <a class="btn btn-amber btn-sm" href="Productos.html">Ver productos</a>
          </div>
        </div>
        <ul class="cart-list" data-cart-list aria-label="Productos en el carrito"></ul>
      </div>
      <div class="cart-footer" data-cart-footer hidden>
        <div class="cart-total">
          <span>Total</span>
          <strong data-cart-total>$0</strong>
        </div>
        <p class="cart-note">El envío se coordina por WhatsApp según tu zona.</p>
        <a class="btn btn-amber w-100" data-cart-checkout href="#" target="_blank" rel="noopener">
          Finalizar por WhatsApp ${icono("arrowRight", { size: 18 })}
        </a>
        <button class="btn btn-link w-100 mt-2" type="button" data-cart-clear>Vaciar carrito</button>
      </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3" id="toastContainer" aria-live="polite" aria-atomic="true"></div>

    <button class="back-to-top" type="button" data-back-to-top aria-label="Volver arriba">
      ${icono("arrowUp", { size: 20 })}
    </button>

    <template id="cartItemTemplate">
      <li class="cart-item">
        <img class="cart-item__img" alt="" width="66" height="66" loading="lazy">
        <div class="cart-item__body">
          <p class="cart-item__name"></p>
          <p class="cart-item__price"></p>
          <div class="qty" role="group" aria-label="Cantidad">
            <button type="button" data-cart-delta="-1" aria-label="Quitar una unidad">${icono("minus", { size: 14 })}</button>
            <output data-cart-qty></output>
            <button type="button" data-cart-delta="1" aria-label="Agregar una unidad">${icono("plus", { size: 14 })}</button>
          </div>
        </div>
        <button class="cart-item__remove" type="button" data-cart-remove aria-label="Quitar del carrito">${icono("trash", { size: 17 })}</button>
      </li>
    </template>
  `;

  document.body.append(contenedor);
}
