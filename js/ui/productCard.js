import { nombreCategoria } from "../data/productos.js";
import { formatearPrecio } from "../lib/formato.js";
import { escaparHtml } from "../lib/dom.js";
import { icono } from "./iconos.js";

/**
 * HTML de una card de producto, reutilizable en la home y en el catálogo.
 * @param {object} producto
 * @param {{columnas?: string, mostrarDetalle?: boolean}} [opciones]
 * @returns {string}
 */
export function htmlTarjetaProducto(producto, opciones = {}) {
  const {
    columnas = "col-12 col-sm-6 col-lg-4",
    mostrarDetalle = true,
  } = opciones;

  const nombre = escaparHtml(producto.nombre);
  const href = `Productos.html?producto=${encodeURIComponent(producto.id)}`;
  const badge = producto.badge
    ? `<span class="product-card__badge">${escaparHtml(producto.badge)}</span>`
    : "";
  const contenido = producto.contenido
    ? `<span>${escaparHtml(producto.contenido)}</span>`
    : "";
  const quick = mostrarDetalle
    ? `<a class="product-card__quick" href="${href}" aria-label="Ver detalle de ${nombre}">${icono("arrowUpRight", { size: 18 })}</a>`
    : "";

  return `
    <div class="${columnas}" data-product-column>
      <article class="product-card" data-product-id="${escaparHtml(producto.id)}">
        <div class="product-card__media">
          ${badge}
          <img src="${producto.imagen}" alt="${nombre}" width="600" height="600" loading="lazy">
          ${quick}
        </div>
        <div class="product-card__body">
          <div class="product-card__meta">
            <span>${escaparHtml(nombreCategoria(producto.categoria))}</span>
            ${contenido}
          </div>
          <h3 class="product-card__title">
            <a href="${href}">${nombre}</a>
          </h3>
          <p class="product-card__desc">${escaparHtml(producto.descripcion)}</p>
          <div class="product-card__footer">
            <span class="price">${formatearPrecio(producto.precio)}</span>
            <button
              class="add-btn"
              type="button"
              data-add-to-cart="${escaparHtml(producto.id)}"
              data-cantidad="1"
              aria-label="Agregar ${nombre} al carrito"
            >
              ${icono("plus", { size: 16 })}
              <span class="add-btn__label">Agregar</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  `;
}
