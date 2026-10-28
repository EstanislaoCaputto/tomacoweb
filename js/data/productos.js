/**
 * Catálogo de productos.
 * Los precios y nombres son los que ya tenía la demo original.
 */

export const CATEGORIAS = Object.freeze([
  {
    id: "tabacos",
    nombre: "Tabacos",
    descripcion: "Rubios para armar, de corte clásico y blends intensos.",
    icono: "flame",
  },
  {
    id: "cedas",
    nombre: "Cedas",
    descripcion: "Papel de arroz, cáñamo y clásicos sin refinar.",
    icono: "leaf",
  },
  {
    id: "filtros",
    nombre: "Filtros",
    descripcion: "Boquillas de celulosa, slim y con goma.",
    icono: "filter",
  },
]);

export const PRODUCTOS = Object.freeze([
  {
    id: "cuatro-leguas",
    nombre: "Cuatro Leguas",
    categoria: "tabacos",
    precio: 200,
    imagen: "img/4-leguas.jpg",
    descripcion: "Tabaco rubio de corte original para armar. Un clásico de todos los días.",
    detalle:
      "Paquete de 30 g con corte original y humedad equilibrada. Aroma intenso, ideal para quien busca un tabaco parejo y sin sorpresas.",
    contenido: "30 g",
    badge: "Clásico",
    destacado: true,
  },
  {
    id: "arlequin",
    nombre: "Arlequín",
    categoria: "tabacos",
    precio: 250,
    imagen: "img/arlequin.jpg",
    descripcion: "Mezcla de tabacos rubios de aroma intenso y final largo.",
    detalle:
      "Blend de tabacos rubios seleccionados, con una intensidad marcada y un aroma que se siente desde la primera calada. Paquete de 30 g.",
    contenido: "30 g",
    badge: "Intenso",
    destacado: false,
  },
  {
    id: "las-hojas",
    nombre: "Las Hojas",
    categoria: "tabacos",
    precio: 180,
    imagen: "img/Las-hoja.jpg",
    descripcion: "Tabaco rubio seleccionado, suave y parejo para todos los días.",
    detalle:
      "Tabaco rubio de sabor suave y combustión pareja. Una opción accesible para armar sin complicaciones. Paquete de 30 g.",
    contenido: "30 g",
    badge: "Suave",
    destacado: true,
  },
  {
    id: "van-haasen",
    nombre: "Van Häasen",
    categoria: "tabacos",
    precio: 300,
    imagen: "img/van-hasen.jpg",
    descripcion: "Blend natural de tabaco rubio, equilibrado y aromático.",
    detalle:
      "Van Häasen Middle Blend: tabaco natural de cuerda equilibrada, pensado para quienes disfrutan un blend más refinado. Paquete de 30 g.",
    contenido: "30 g",
    badge: "Premium",
    destacado: true,
  },
  {
    id: "cedas-ocb",
    nombre: "Sedas OCB",
    categoria: "cedas",
    precio: 80,
    imagen: "img/cedas-ocb.jpg",
    descripcion: "Papel de arroz ultraligero, tamaño 1 1/4. 50 hojas.",
    detalle:
      "El clásico papel de arroz de OCB: fino, de combustión lenta y con un sabor neutro que no tapa el tabaco. 50 hojas por librillo.",
    contenido: "50 hojas",
    badge: "Imprescindible",
    destacado: false,
  },
  {
    id: "cedas-ocb-canamo",
    nombre: "Sedas OCB Cáñamo",
    categoria: "cedas",
    precio: 70,
    imagen: "img/cedas-ocb-canamo.png",
    descripcion: "Papel de cáñamo orgánico, 1 1/4. 50 hojas.",
    detalle:
      "Papel de cáñamo orgánico de OCB, más texturado y con una combustión muy pareja. Tamaño 1 1/4, 50 hojas.",
    contenido: "50 hojas",
    badge: "Orgánico",
    destacado: true,
  },
  {
    id: "sedas-raw",
    nombre: "Sedas RAW",
    categoria: "cedas",
    precio: 70,
    imagen: "img/sedas-raw.jpg",
    descripcion: "Papel sin refinar, combustión lenta y textura natural.",
    detalle:
      "RAW apuesta a un papel sin blanquear y sin refinar, con la textura natural que muchos buscan. Tamaño 1 1/4, 50 hojas.",
    contenido: "50 hojas",
    badge: "Sin refinar",
    destacado: false,
  },
  {
    id: "sedas-stamps-negras",
    nombre: "Sedas Stamps Negras",
    categoria: "cedas",
    precio: 50,
    imagen: "img/sedas-stamps-negras.jpg",
    descripcion: "Papel de 1 1/4 con liña. 50 hojas.",
    detalle:
      "Librillo Stamps de papel fino con liña marcada, práctico para armar rápido. Tamaño 1 1/4, 50 hojas.",
    contenido: "50 hojas",
    badge: "Económico",
    destacado: false,
  },
  {
    id: "filtros-ocb-regulares",
    nombre: "Filtros OCB Regulares",
    categoria: "filtros",
    precio: 150,
    imagen: "img/filtros-ocb-regulares.jpg",
    descripcion: "Boquillas de celulosa tamaño regular. 120 unidades.",
    detalle:
      "Filtros de celulosa OCB de tamaño regular, biodegradables y con la dureza justa para sostener el armado. 120 unidades.",
    contenido: "120 u.",
    badge: "Rinde más",
    destacado: false,
  },
  {
    id: "filtros-ocb-slim",
    nombre: "Filtros OCB Slim",
    categoria: "filtros",
    precio: 120,
    imagen: "img/filtros-ocb-slim.jpg",
    descripcion: "Boquillas finas de celulosa. 120 unidades.",
    detalle:
      "Filtros slim de OCB para armados más finos y una calada más ajustada. Celulosa biodegradable, 120 unidades.",
    contenido: "120 u.",
    badge: "Slim",
    destacado: true,
  },
  {
    id: "filtros-stamps-engomados",
    nombre: "Filtros Stamps Engomados",
    categoria: "filtros",
    precio: 120,
    imagen: "img/filtros-stamps-engomados.jpg",
    descripcion: "Filtros de 15 mm con goma. 120 + 30 unidades.",
    detalle:
      "Filtros Stamps de 15 mm con borde engomado para un armado más prolijo. Pack de 120 + 30 unidades.",
    contenido: "150 u.",
    badge: "Con goma",
    destacado: false,
  },
  {
    id: "filtros-stamps-slim",
    nombre: "Filtros Stamps Slim",
    categoria: "filtros",
    precio: 100,
    imagen: "img/filtros-stamps-slim.jpg",
    descripcion: "Filtros finos de 15 mm. 120 unidades.",
    detalle:
      "Boquillas Stamps slim de 15 mm, firmes y parejas. Una opción económica para el día a día. 120 unidades.",
    contenido: "120 u.",
    badge: "Económico",
    destacado: false,
  },
]);

export const CATEGORIA_POR_ID = Object.freeze(
  Object.fromEntries(CATEGORIAS.map((categoria) => [categoria.id, categoria])),
);

export function obtenerProducto(id) {
  return PRODUCTOS.find((producto) => producto.id === id) ?? null;
}

export function nombreCategoria(id) {
  return CATEGORIA_POR_ID[id]?.nombre ?? "Productos";
}
