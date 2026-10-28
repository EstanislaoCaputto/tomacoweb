/**
 * Promos y combos de la demo.
 * Se agregan al mismo carrito que los productos sueltos.
 */

export const PROMOS = Object.freeze([
  {
    id: "combo-las-hojas",
    nombre: "Combo Las Hojas × 3",
    categoria: "promos",
    precio: 550,
    precioAnterior: 600,
    imagen: "img/promo2.jpeg",
    descripcion: "Tres paquetes de Las Hojas para tener tabaco para rato.",
    detalle:
      "Tres paquetes de Las Hojas de 30 g. El combo queda $50 más barato que comprando las unidades por separado.",
    incluye: ["3 × Las Hojas 30 g", "Ahorrás $50"],
    badge: "Ahorrás $50",
    destacado: true,
  },
  {
    id: "combo-van-haasen",
    nombre: "Combo Van Häasen × 2",
    categoria: "promos",
    precio: 520,
    precioAnterior: 600,
    imagen: "img/promo3.jpeg",
    descripcion: "Dos Van Häasen para elegir entre natural y nativo.",
    detalle:
      "Dos paquetes de Van Häasen de 30 g, combinables entre Natural y Nativo. Ahorrás $80 respecto de comprarlos sueltos.",
    incluye: ["2 × Van Häasen 30 g", "Natural o Nativo", "Ahorrás $80"],
    badge: "Ahorrás $80",
    destacado: true,
  },
  {
    id: "combo-armado",
    nombre: "Combo Armado",
    categoria: "promos",
    precio: 380,
    precioAnterior: 430,
    imagen: "img/promo1.jpeg",
    descripcion: "Tabaco, sedas y filtros: todo lo necesario para arrancar.",
    detalle:
      "Un combo de iniciación con Cuatro Leguas, Sedas OCB y Filtros OCB Regulares. Ahorrás $50 frente a comprar cada cosa por separado.",
    incluye: ["1 × Cuatro Leguas 30 g", "1 × Sedas OCB", "1 × Filtros OCB Regulares", "Ahorrás $50"],
    badge: "Combo iniciación",
    destacado: false,
  },
]);

export function obtenerPromo(id) {
  return PROMOS.find((promo) => promo.id === id) ?? null;
}

export function ahorroPromo(promo) {
  if (!promo?.precioAnterior || promo.precioAnterior <= promo.precio) return 0;
  return promo.precioAnterior - promo.precio;
}
