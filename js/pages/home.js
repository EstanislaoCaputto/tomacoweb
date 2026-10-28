import { PRODUCTOS } from "../data/productos.js";
import { contarPorCategoria, obtenerDestacados } from "../lib/catalogo.js";
import { htmlTarjetaProducto } from "../ui/productCard.js";

/**
 * Home: renderiza los destacados y completa los contadores de categorías.
 * @returns {void}
 */
export function iniciarHome() {
  const grid = document.querySelector("[data-featured-grid]");

  if (grid) {
    const destacados = obtenerDestacados(PRODUCTOS, 4);
    grid.innerHTML = destacados
      .map((producto) => htmlTarjetaProducto(producto, { columnas: "col-6 col-lg-3" }))
      .join("");
  }

  document.querySelectorAll("[data-category-count]").forEach((elemento) => {
    const categoria = elemento.getAttribute("data-category-count");
    if (!categoria) return;
    const cantidad = contarPorCategoria(PRODUCTOS, categoria);
    elemento.textContent = `${cantidad} ${cantidad === 1 ? "producto" : "productos"}`;
  });
}
