/**
 * Íconos SVG en línea. Evitamos otra dependencia externa.
 * Todos heredan el color con currentColor.
 */

const TRAZOS = Object.freeze({
  bag: '<path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  trash:
    '<path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
  arrowRight: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M9 7h8v8"/>',
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none"/>',
  facebook:
    '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v5h4v-5h3l1-4h-4V8Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  mapPin:
    '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone:
    '<path d="M6 3h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield:
    '<path d="M12 3 5 6v5c0 5 7 10 7 10s7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/>',
  cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M7 9v6M17 9v6"/>',
  flame:
    '<path d="M12 3c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1.5-.8-2.5-1.5-3.5C15 9 17 11 17 14a5 5 0 0 1-10 0c0-4 3-6 5-11Z"/>',
  leaf: '<path d="M20 4C10 4 5 9 5 16c0 2 1 4 1 4s2-6 8-9c-3 3-6 6-7 10 8 1 13-4 13-17Z"/>',
  filter: '<path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  spark:
    '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
  alert: '<path d="M12 3 2 21h20L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 8.6l6.2-.9L12 3Z"/>',
  send: '<path d="m4 12 16-8-5 16-4-6-7-2Z"/>',
});

const RELLENOS = Object.freeze({
  whatsapp:
    '<path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>',
});

/**
 * @param {string} nombre
 * @param {{size?: number, clase?: string}} [opciones]
 * @returns {string}
 */
export function icono(nombre, opciones = {}) {
  const { size = 20, clase = "icon" } = opciones;
  const relleno = RELLENOS[nombre];
  const trazo = TRAZOS[nombre];
  const contenido = relleno ?? trazo;
  if (!contenido) return "";

  const claseFinal = relleno ? `${clase} icon--fill` : clase;
  return `<svg class="${claseFinal}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${contenido}</svg>`;
}

export const ICONOS_DISPONIBLES = Object.freeze([
  ...Object.keys(TRAZOS),
  ...Object.keys(RELLENOS),
]);
