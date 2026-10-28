/**
 * @param {unknown} texto
 * @returns {string}
 */
export function escaparHtml(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * @param {string} selector
 * @param {ParentNode} [raiz]
 * @returns {HTMLElement|null}
 */
export function buscar(selector, raiz = document) {
  const elemento = raiz.querySelector(selector);
  return elemento instanceof HTMLElement ? elemento : null;
}
