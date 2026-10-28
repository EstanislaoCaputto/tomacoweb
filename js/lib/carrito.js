/**
 * Carrito como estructura de datos pura.
 * Ninguna función toca el DOM ni localStorage: así se puede testear fácil.
 */

export const MAX_CANTIDAD = 99;
export const MAX_ITEMS = 50;

/**
 * Normaliza un ítem del carrito. Devuelve null si no es usable.
 * @param {unknown} item
 * @returns {{id: string, nombre: string, precio: number, cantidad: number, imagen: string, categoria: string}|null}
 */
export function normalizarItem(item) {
  if (!item || typeof item !== "object") return null;

  const id = String(item.id ?? "").trim();
  const nombre = String(item.nombre ?? "").trim();
  const precio = Number(item.precio);
  const cantidadNumero = Number(item.cantidad);
  const cantidad = Number.isFinite(cantidadNumero)
    ? Math.min(MAX_CANTIDAD, Math.max(1, Math.trunc(cantidadNumero)))
    : 1;

  if (!id || !nombre || !Number.isFinite(precio) || precio < 0) return null;

  return {
    id,
    nombre,
    precio,
    cantidad,
    imagen: typeof item.imagen === "string" ? item.imagen : "",
    categoria: typeof item.categoria === "string" ? item.categoria : "",
  };
}

/**
 * Sanea una lista completa y fusiona los ítems repetidos.
 * @param {unknown} items
 * @returns {Array<{id: string, nombre: string, precio: number, cantidad: number, imagen: string, categoria: string}>}
 */
export function normalizarCarrito(items) {
  if (!Array.isArray(items)) return [];

  /** @type {Map<string, ReturnType<typeof normalizarItem>>} */
  const porId = new Map();

  for (const crudo of items) {
    const item = normalizarItem(crudo);
    if (!item) continue;

    const existente = porId.get(item.id);
    if (existente) {
      existente.cantidad = Math.min(MAX_CANTIDAD, existente.cantidad + item.cantidad);
      continue;
    }

    if (porId.size >= MAX_ITEMS) break;
    porId.set(item.id, item);
  }

  return [...porId.values()];
}

/**
 * Agrega un producto o combo. Si ya existe, suma cantidades.
 * @param {unknown} carrito
 * @param {unknown} item
 * @param {number} [cantidad]
 */
export function agregarItem(carrito, item, cantidad) {
  const base = normalizarCarrito(carrito);
  const cantidadSolicitada = cantidad === undefined ? item?.cantidad : cantidad;
  const cantidadNumero = Number(cantidadSolicitada);
  const cantidadAgregada = Number.isFinite(cantidadNumero)
    ? Math.min(MAX_CANTIDAD, Math.max(1, Math.trunc(cantidadNumero)))
    : 1;

  const nuevo = normalizarItem({ ...item, cantidad: cantidadAgregada });
  if (!nuevo) return base;

  const indice = base.findIndex((existente) => existente.id === nuevo.id);

  if (indice >= 0) {
    const actual = base[indice];
    base[indice] = {
      ...actual,
      cantidad: Math.min(MAX_CANTIDAD, actual.cantidad + nuevo.cantidad),
    };
    return base;
  }

  if (base.length >= MAX_ITEMS) return base;
  return [...base, nuevo];
}

/**
 * Quita un ítem por id.
 * @param {unknown} carrito
 * @param {string} id
 */
export function quitarItem(carrito, id) {
  const idBuscado = String(id ?? "");
  return normalizarCarrito(carrito).filter((item) => item.id !== idBuscado);
}

/**
 * Fija la cantidad de un ítem. Si la cantidad es 0 o menor, lo elimina.
 * @param {unknown} carrito
 * @param {string} id
 * @param {number} cantidad
 */
export function actualizarCantidad(carrito, id, cantidad) {
  const base = normalizarCarrito(carrito);
  const indice = base.findIndex((item) => item.id === String(id ?? ""));
  if (indice < 0) return base;

  const numero = Number(cantidad);
  if (!Number.isFinite(numero)) return base;

  const nuevaCantidad = Math.trunc(numero);
  if (nuevaCantidad <= 0) {
    return base.filter((item) => item.id !== String(id ?? ""));
  }

  base[indice] = {
    ...base[indice],
    cantidad: Math.min(MAX_CANTIDAD, nuevaCantidad),
  };
  return base;
}

/**
 * Suma todas las cantidades del carrito.
 * @param {unknown} carrito
 */
export function contarItems(carrito) {
  return normalizarCarrito(carrito).reduce((total, item) => total + item.cantidad, 0);
}

/**
 * Subtotal del carrito, sin envío.
 * @param {unknown} carrito
 */
export function calcularSubtotal(carrito) {
  return normalizarCarrito(carrito).reduce(
    (total, item) => total + item.precio * item.cantidad,
    0,
  );
}

/**
 * @param {unknown} carrito
 */
export function estaVacio(carrito) {
  return normalizarCarrito(carrito).length === 0;
}

/**
 * Serializa el carrito de forma segura.
 * @param {unknown} carrito
 */
export function serializarCarrito(carrito) {
  return JSON.stringify(normalizarCarrito(carrito));
}

/**
 * Deserializa el carrito sin romper la app si el JSON está mal.
 * @param {unknown} texto
 */
export function deserializarCarrito(texto) {
  if (typeof texto !== "string" || texto.trim() === "") return [];
  try {
    return normalizarCarrito(JSON.parse(texto));
  } catch {
    return [];
  }
}
