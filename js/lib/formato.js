/**
 * Helpers de formato. Funciones puras para poder testearlas sin DOM.
 */

const FORMATEADOR_NUMERO = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
});

/**
 * Devuelve un precio en pesos con separador de miles.
 * @param {number|string} valor
 * @returns {string}
 */
export function formatearPrecio(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return "$0";
  const redondeado = Math.round(Math.abs(numero));
  const signo = numero < 0 ? "-" : "";
  return `${signo}$${FORMATEADOR_NUMERO.format(redondeado)}`;
}

/**
 * Normaliza texto para búsquedas: minúsculas y sin acentos.
 * @param {unknown} texto
 * @returns {string}
 */
export function normalizarTexto(texto) {
  if (texto === null || texto === undefined) return "";
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Pluraliza de forma simple, sin depender de librerías.
 * @param {number} cantidad
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function pluralizar(cantidad, singular, plural) {
  return Number(cantidad) === 1 ? singular : plural;
}

/**
 * Recorta un texto a una cantidad máxima de caracteres.
 * @param {unknown} texto
 * @param {number} maximo
 * @returns {string}
 */
export function truncar(texto, maximo = 120) {
  const limpio = String(texto ?? "").trim();
  if (limpio.length <= maximo) return limpio;
  return `${limpio.slice(0, Math.max(0, maximo - 1)).trimEnd()}…`;
}
