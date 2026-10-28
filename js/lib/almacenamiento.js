/**
 * Acceso seguro a localStorage.
 * Si el navegador lo bloquea (modo privado, file://, etc.) la app no se rompe.
 */

/**
 * @returns {Storage|null}
 */
export function obtenerAlmacen() {
  if (typeof window === "undefined") return null;
  try {
    const almacen = window.localStorage;
    const prueba = "__tomacco_test__";
    almacen.setItem(prueba, "1");
    almacen.removeItem(prueba);
    return almacen;
  } catch {
    return null;
  }
}

/**
 * @param {Storage|null|undefined} almacen
 * @param {string} clave
 * @param {unknown} valorPorDefecto
 */
export function leerJson(almacen, clave, valorPorDefecto = null) {
  if (!almacen || typeof almacen.getItem !== "function") return valorPorDefecto;
  try {
    const crudo = almacen.getItem(clave);
    if (!crudo) return valorPorDefecto;
    return JSON.parse(crudo);
  } catch {
    return valorPorDefecto;
  }
}

/**
 * @param {Storage|null|undefined} almacen
 * @param {string} clave
 * @param {unknown} valor
 */
export function guardarJson(almacen, clave, valor) {
  if (!almacen || typeof almacen.setItem !== "function") return false;
  try {
    almacen.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {Storage|null|undefined} almacen
 * @param {string} clave
 */
export function borrarClave(almacen, clave) {
  if (!almacen || typeof almacen.removeItem !== "function") return false;
  try {
    almacen.removeItem(clave);
    return true;
  } catch {
    return false;
  }
}
