import { SITE, STORAGE_KEYS } from "../config.js";
import { PRODUCTOS } from "../data/productos.js";
import { PROMOS } from "../data/promos.js";
import {
  agregarItem,
  actualizarCantidad,
  calcularSubtotal,
  contarItems,
  deserializarCarrito,
  normalizarCarrito,
  quitarItem,
} from "../lib/carrito.js";
import { formatearPrecio } from "../lib/formato.js";
import { construirMensajePedido, construirUrlWhatsApp } from "../lib/whatsapp.js";
import { guardarJson, leerJson, obtenerAlmacen } from "../lib/almacenamiento.js";
import { mostrarToast } from "./toast.js";

const CATALOGO = new Map([
  ...PRODUCTOS.map((producto) => [producto.id, producto]),
  ...PROMOS.map((promo) => [promo.id, promo]),
]);

let carrito = [];
let almacen = null;

/**
 * @returns {void}
 */
function persistir() {
  if (almacen) guardarJson(almacen, STORAGE_KEYS.carrito, carrito);
}

/**
 * @returns {void}
 */
function emitirCambio() {
  document.dispatchEvent(
    new CustomEvent("tomacco:carrito", {
      detail: {
        items: [...carrito],
        total: calcularSubtotal(carrito),
        count: contarItems(carrito),
      },
    }),
  );
}

/**
 * @param {boolean} animar
 */
function actualizarBadges(animar = false) {
  const cantidad = contarItems(carrito);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(cantidad);
    badge.hidden = cantidad === 0;
    if (animar && cantidad > 0) {
      badge.classList.remove("is-bump");
      // Fuerza reflow para reiniciar la animación.
      void badge.offsetWidth;
      badge.classList.add("is-bump");
    }
  });
}

/**
 * @returns {void}
 */
function renderCarrito() {
  const lista = document.querySelector("[data-cart-list]");
  const vacio = document.querySelector("[data-cart-empty]");
  const footer = document.querySelector("[data-cart-footer]");
  const total = document.querySelector("[data-cart-total]");
  const checkout = document.querySelector("[data-cart-checkout]");
  const plantilla = document.getElementById("cartItemTemplate");

  actualizarBadges();

  if (!lista || !vacio || !footer || !total || !plantilla) return;

  lista.replaceChildren();
  const totalActual = calcularSubtotal(carrito);

  for (const item of carrito) {
    const fragmento = plantilla.content.cloneNode(true);
    const li = fragmento.querySelector(".cart-item");
    const imagen = fragmento.querySelector(".cart-item__img");
    const nombre = fragmento.querySelector(".cart-item__name");
    const precio = fragmento.querySelector(".cart-item__price");
    const cantidad = fragmento.querySelector("[data-cart-qty]");
    const botones = fragmento.querySelectorAll("[data-cart-delta]");
    const quitar = fragmento.querySelector("[data-cart-remove]");

    if (li) li.dataset.id = item.id;
    if (imagen) {
      imagen.src = item.imagen;
      imagen.alt = item.nombre;
    }
    if (nombre) nombre.textContent = item.nombre;
    if (precio) precio.textContent = `${formatearPrecio(item.precio)} c/u`;
    if (cantidad) cantidad.textContent = String(item.cantidad);

    botones.forEach((boton) => {
      const delta = Number(boton.getAttribute("data-cart-delta"));
      boton.setAttribute(
        "aria-label",
        `${delta > 0 ? "Agregar" : "Quitar"} una unidad de ${item.nombre}`,
      );
    });

    if (quitar) quitar.setAttribute("aria-label", `Quitar ${item.nombre} del carrito`);
    lista.append(fragmento);
  }

  const hayItems = carrito.length > 0;
  lista.hidden = !hayItems;
  vacio.hidden = hayItems;
  footer.hidden = !hayItems;
  total.textContent = formatearPrecio(totalActual);

  if (checkout) {
    const mensaje = construirMensajePedido({ items: carrito, total: totalActual });
    checkout.href = hayItems ? construirUrlWhatsApp(SITE.whatsapp, mensaje) : "#";
    checkout.toggleAttribute("aria-disabled", !hayItems);
  }
}

/**
 * @param {string} id
 * @param {number} [cantidad]
 */
export function agregarAlCarrito(id, cantidad = 1) {
  const producto = CATALOGO.get(String(id));
  if (!producto) {
    mostrarToast({
      titulo: "No encontramos ese producto",
      mensaje: "Probá de nuevo desde el catálogo.",
      tipo: "error",
    });
    return false;
  }

  carrito = agregarItem(
    carrito,
    {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
    },
    cantidad,
  );

  persistir();
  renderCarrito();
  emitirCambio();

  mostrarToast({
    titulo: "Agregado al carrito",
    mensaje: `${producto.nombre} · ${formatearPrecio(producto.precio)}`,
  });
  return true;
}

/**
 * @returns {Array<object>}
 */
export function obtenerCarritoActual() {
  return [...carrito];
}

/**
 * @returns {void}
 */
export function iniciarCarrito() {
  almacen = obtenerAlmacen();
  const guardado = leerJson(almacen, STORAGE_KEYS.carrito, []);
  carrito = normalizarCarrito(guardado);
  renderCarrito();
  emitirCambio();

  document.addEventListener("click", (evento) => {
    const objetivo = /** @type {HTMLElement} */ (evento.target);
    if (!(objetivo instanceof Element)) return;

    const agregar = objetivo.closest("[data-add-to-cart]");
    if (agregar) {
      evento.preventDefault();
      const id = agregar.getAttribute("data-add-to-cart");
      const cantidad = Number(agregar.getAttribute("data-cantidad") ?? 1);
      const etiqueta = agregar.querySelector(".add-btn__label");

      if (id && agregarAlCarrito(id, Number.isFinite(cantidad) ? cantidad : 1) && etiqueta) {
        if (!agregar.hasAttribute("data-label-original")) {
          agregar.setAttribute("data-label-original", etiqueta.textContent ?? "Agregar");
        }
        etiqueta.textContent = "Agregado";
        agregar.classList.add("is-added");
        const boton = /** @type {HTMLElement} */ (agregar);
        window.clearTimeout(Number(boton.dataset.timerAgregado));
        boton.dataset.timerAgregado = String(
          window.setTimeout(() => {
            etiqueta.textContent = agregar.getAttribute("data-label-original") ?? "Agregar";
            agregar.classList.remove("is-added");
          }, 1400),
        );
      }
      return;
    }

    const delta = objetivo.closest("[data-cart-delta]");
    if (delta) {
      const item = delta.closest("[data-cart-item], .cart-item");
      const id = item?.getAttribute("data-id");
      if (id) {
        const actual = carrito.find((producto) => producto.id === id);
        const cambio = Number(delta.getAttribute("data-cart-delta"));
        if (actual && Number.isFinite(cambio)) {
          carrito = actualizarCantidad(carrito, id, actual.cantidad + cambio);
          persistir();
          renderCarrito();
          emitirCambio();
          actualizarBadges(true);
        }
      }
      return;
    }

    const quitar = objetivo.closest("[data-cart-remove]");
    if (quitar) {
      const item = quitar.closest(".cart-item");
      const id = item?.getAttribute("data-id");
      if (id) {
        carrito = quitarItem(carrito, id);
        persistir();
        renderCarrito();
        emitirCambio();
        actualizarBadges(true);
        mostrarToast({ titulo: "Producto quitado", mensaje: "Tu carrito se actualizó." });
      }
      return;
    }

    const vaciar = objetivo.closest("[data-cart-clear]");
    if (vaciar) {
      carrito = [];
      persistir();
      renderCarrito();
      emitirCambio();
      actualizarBadges(true);
      mostrarToast({ titulo: "Carrito vacío", mensaje: "Podés empezar de nuevo cuando quieras." });
    }
  });

  window.addEventListener("storage", (evento) => {
    if (evento.key !== STORAGE_KEYS.carrito) return;
    carrito = deserializarCarrito(evento.newValue ?? "[]");
    renderCarrito();
    emitirCambio();
  });
}
