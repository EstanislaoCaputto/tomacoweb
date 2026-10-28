import { CATEGORIAS, PRODUCTOS, nombreCategoria, obtenerProducto } from "../data/productos.js";
import { filtrarProductos } from "../lib/catalogo.js";
import { formatearPrecio, pluralizar } from "../lib/formato.js";
import { htmlTarjetaProducto } from "../ui/productCard.js";
import { mostrarError } from "../ui/toast.js";

const CATEGORIAS_VALIDAS = new Set(["todos", ...CATEGORIAS.map((categoria) => categoria.id)]);
const ORDENES_VALIDOS = new Set(["relevancia", "precio-asc", "precio-desc", "nombre-asc"]);

/**
 * @param {URLSearchParams} params
 */
function estadoDesdeUrl(params) {
  const categoria = params.get("categoria") ?? "todos";
  const orden = params.get("orden") ?? "relevancia";

  return {
    categoria: CATEGORIAS_VALIDAS.has(categoria) ? categoria : "todos",
    busqueda: (params.get("buscar") ?? "").slice(0, 80),
    orden: ORDENES_VALIDOS.has(orden) ? orden : "relevancia",
  };
}

/**
 * @param {number} cantidad
 * @param {{categoria: string, busqueda: string}} estado
 */
function textoResultados(cantidad, estado) {
  if (estado.busqueda) {
    const palabra = pluralizar(cantidad, "resultado", "resultados");
    return `${cantidad} ${palabra} para “${estado.busqueda}”`;
  }
  if (estado.categoria !== "todos") {
    return `${cantidad} ${pluralizar(cantidad, "producto", "productos")} en ${nombreCategoria(estado.categoria)}`;
  }
  return `${cantidad} ${pluralizar(cantidad, "producto", "productos")} disponibles`;
}

/**
 * @returns {void}
 */
export function iniciarProductos() {
  const grid = document.querySelector("[data-product-grid]");
  if (!(grid instanceof HTMLElement)) return;

  const buscador = document.querySelector("[data-search-input]");
  const limpiarBusqueda = document.querySelector("[data-search-clear]");
  const ordenador = document.querySelector("[data-sort]");
  const contador = document.querySelector("[data-results-count]");
  const vacio = document.querySelector("[data-empty]");
  const limpiarTodo = document.querySelector("[data-empty-clear]");
  const chips = [...document.querySelectorAll("[data-filter]")];
  const modalElemento = document.getElementById("productoModal");

  const params = new URLSearchParams(window.location.search);
  const estado = estadoDesdeUrl(params);
  let temporizadorBusqueda = 0;

  if (buscador instanceof HTMLInputElement) buscador.value = estado.busqueda;
  if (ordenador instanceof HTMLSelectElement) ordenador.value = estado.orden;

  /**
   * @param {string} productoId
   */
  function abrirModal(productoId) {
    const producto = obtenerProducto(productoId);
    if (!producto || !(modalElemento instanceof HTMLElement)) return;

    const imagen = modalElemento.querySelector("[data-modal-image]");
    const categoria = modalElemento.querySelector("[data-modal-category]");
    const nombre = modalElemento.querySelector("[data-modal-name]");
    const descripcion = modalElemento.querySelector("[data-modal-desc]");
    const detalle = modalElemento.querySelector("[data-modal-detail]");
    const contenido = modalElemento.querySelector("[data-modal-content]");
    const precio = modalElemento.querySelector("[data-modal-price]");
    const agregar = modalElemento.querySelector("[data-modal-add]");

    if (imagen instanceof HTMLImageElement) {
      imagen.src = producto.imagen;
      imagen.alt = producto.nombre;
    }
    if (categoria) categoria.textContent = nombreCategoria(producto.categoria);
    if (nombre) nombre.textContent = producto.nombre;
    if (descripcion) descripcion.textContent = producto.descripcion;
    if (detalle) detalle.textContent = producto.detalle;
    if (contenido) {
      contenido.textContent = [producto.contenido, nombreCategoria(producto.categoria)]
        .filter(Boolean)
        .join(" · ");
    }
    if (precio) precio.textContent = formatearPrecio(producto.precio);
    if (agregar instanceof HTMLElement) {
      agregar.setAttribute("data-add-to-cart", producto.id);
      agregar.setAttribute("aria-label", `Agregar ${producto.nombre} al carrito`);
    }

    const Modal = window.bootstrap?.Modal;
    if (!Modal) {
      mostrarError("No pudimos abrir el detalle", "Recargá la página e intentá de nuevo.");
      return;
    }
    Modal.getOrCreateInstance(modalElemento).show();
  }

  function renderizar() {
    const resultados = filtrarProductos(PRODUCTOS, estado);

    grid.innerHTML = resultados
      .map((producto) => htmlTarjetaProducto(producto))
      .join("");

    if (contador) {
      contador.textContent = textoResultados(resultados.length, estado);
    }
    if (vacio instanceof HTMLElement) {
      vacio.hidden = resultados.length > 0;
    }
    grid.hidden = resultados.length === 0;

    chips.forEach((chip) => {
      const activo = chip.getAttribute("data-filter") === estado.categoria;
      chip.classList.toggle("is-active", activo);
      chip.setAttribute("aria-pressed", String(activo));
    });

    if (limpiarBusqueda instanceof HTMLElement) {
      limpiarBusqueda.hidden = estado.busqueda.length === 0;
    }
  }

  function actualizarUrl() {
    const nuevos = new URLSearchParams();
    if (estado.categoria !== "todos") nuevos.set("categoria", estado.categoria);
    if (estado.busqueda) nuevos.set("buscar", estado.busqueda);
    if (estado.orden !== "relevancia") nuevos.set("orden", estado.orden);
    const query = nuevos.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      estado.categoria = chip.getAttribute("data-filter") ?? "todos";
      renderizar();
      actualizarUrl();
    });
  });

  if (buscador instanceof HTMLInputElement) {
    buscador.addEventListener("input", () => {
      window.clearTimeout(temporizadorBusqueda);
      temporizadorBusqueda = window.setTimeout(() => {
        estado.busqueda = buscador.value.trim().slice(0, 80);
        renderizar();
        actualizarUrl();
      }, 160);
    });

    buscador.addEventListener("keydown", (evento) => {
      if (evento.key !== "Escape") return;
      buscador.value = "";
      estado.busqueda = "";
      renderizar();
      actualizarUrl();
    });
  }

  limpiarBusqueda?.addEventListener("click", () => {
    if (buscador instanceof HTMLInputElement) {
      buscador.value = "";
      buscador.focus();
    }
    estado.busqueda = "";
    renderizar();
    actualizarUrl();
  });

  ordenador?.addEventListener("change", () => {
    if (!(ordenador instanceof HTMLSelectElement)) return;
    estado.orden = ORDENES_VALIDOS.has(ordenador.value) ? ordenador.value : "relevancia";
    renderizar();
    actualizarUrl();
  });

  limpiarTodo?.addEventListener("click", () => {
    estado.categoria = "todos";
    estado.busqueda = "";
    estado.orden = "relevancia";
    if (buscador instanceof HTMLInputElement) buscador.value = "";
    if (ordenador instanceof HTMLSelectElement) ordenador.value = "relevancia";
    renderizar();
    actualizarUrl();
  });

  grid.addEventListener("click", (evento) => {
    const objetivo = evento.target;
    if (!(objetivo instanceof Element)) return;
    const rapido = objetivo.closest(".product-card__quick");
    if (!rapido) return;

    const tarjeta = rapido.closest("[data-product-id]");
    const id = tarjeta?.getAttribute("data-product-id");
    if (!id) return;

    evento.preventDefault();
    abrirModal(id);
  });

  renderizar();

  const productoInicial = params.get("producto");
  if (productoInicial) {
    window.setTimeout(() => abrirModal(productoInicial), 120);
  }
}
