import { normalizarTexto } from "./formato.js";

/**
 * Filtra por categoría. "todos" o vacío devuelve una copia.
 * @param {Array<any>} productos
 * @param {string} categoria
 */
export function filtrarPorCategoria(productos, categoria = "todos") {
  const lista = Array.isArray(productos) ? productos : [];
  if (!categoria || categoria === "todos") return [...lista];
  return lista.filter((producto) => producto.categoria === categoria);
}

/**
 * Búsqueda simple por nombre, descripción, categoría y etiqueta.
 * @param {Array<any>} productos
 * @param {string} termino
 */
export function buscarProductos(productos, termino = "") {
  const lista = Array.isArray(productos) ? productos : [];
  const buscado = normalizarTexto(termino);
  if (!buscado) return [...lista];

  return lista.filter((producto) => {
    const texto = [
      producto.nombre,
      producto.descripcion,
      producto.categoria,
      producto.badge,
      producto.contenido,
    ]
      .filter(Boolean)
      .join(" ");
    return normalizarTexto(texto).includes(buscado);
  });
}

/**
 * Ordena sin mutar la lista original.
 * @param {Array<any>} productos
 * @param {"relevancia"|"precio-asc"|"precio-desc"|"nombre-asc"} orden
 */
export function ordenarProductos(productos, orden = "relevancia") {
  const lista = Array.isArray(productos) ? [...productos] : [];

  switch (orden) {
    case "precio-asc":
      return lista.sort((a, b) => a.precio - b.precio || a.nombre.localeCompare(b.nombre, "es"));
    case "precio-desc":
      return lista.sort((a, b) => b.precio - a.precio || a.nombre.localeCompare(b.nombre, "es"));
    case "nombre-asc":
      return lista.sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }),
      );
    default:
      return lista;
  }
}

/**
 * Pipeline completo del catálogo.
 * @param {Array<any>} productos
 * @param {{categoria?: string, busqueda?: string, orden?: string}} opciones
 */
export function filtrarProductos(productos, opciones = {}) {
  const { categoria = "todos", busqueda = "", orden = "relevancia" } = opciones;
  return ordenarProductos(
    buscarProductos(filtrarPorCategoria(productos, categoria), busqueda),
    orden,
  );
}

/**
 * @param {Array<any>} productos
 * @param {number} limite
 */
export function obtenerDestacados(productos, limite = 4) {
  const lista = Array.isArray(productos) ? productos : [];
  return lista.filter((producto) => producto.destacado).slice(0, limite);
}

/**
 * @param {Array<any>} productos
 * @param {string} categoria
 */
export function contarPorCategoria(productos, categoria) {
  return filtrarPorCategoria(productos, categoria).length;
}
