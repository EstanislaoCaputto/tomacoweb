import test from "node:test";
import assert from "node:assert/strict";

import {
  buscarProductos,
  contarPorCategoria,
  filtrarPorCategoria,
  filtrarProductos,
  obtenerDestacados,
  ordenarProductos,
} from "../js/lib/catalogo.js";

const PRODUCTOS = [
  {
    id: "cedas-ocb-canamo",
    nombre: "Sedas OCB Cáñamo",
    categoria: "cedas",
    precio: 70,
    descripcion: "Papel orgánico de cáñamo",
    badge: "Orgánico",
    contenido: "50 hojas",
    destacado: true,
  },
  {
    id: "cuatro-leguas",
    nombre: "Cuatro Leguas",
    categoria: "tabacos",
    precio: 200,
    descripcion: "Tabaco rubio clásico",
    badge: "Clásico",
    contenido: "30 g",
    destacado: true,
  },
  {
    id: "filtros-ocb-slim",
    nombre: "Filtros OCB Slim",
    categoria: "filtros",
    precio: 120,
    descripcion: "Boquillas finas de celulosa",
    badge: "Slim",
    contenido: "120 u.",
    destacado: false,
  },
  {
    id: "sedas-raw",
    nombre: "Sedas RAW",
    categoria: "cedas",
    precio: 70,
    descripcion: "Papel sin refinar",
    badge: "Sin refinar",
    contenido: "50 hojas",
    destacado: false,
  },
];

test("filtrarPorCategoria devuelve copia y respeta 'todos'", () => {
  const todos = filtrarPorCategoria(PRODUCTOS, "todos");
  const cedas = filtrarPorCategoria(PRODUCTOS, "cedas");

  assert.equal(todos.length, 4);
  assert.notEqual(todos, PRODUCTOS);
  assert.equal(cedas.length, 2);
  assert.ok(cedas.every((producto) => producto.categoria === "cedas"));
});

test("buscarProductos ignora acentos y mayúsculas", () => {
  assert.equal(buscarProductos(PRODUCTOS, "canamo").length, 1);
  assert.equal(buscarProductos(PRODUCTOS, "CÁÑAMO").length, 1);
  assert.equal(buscarProductos(PRODUCTOS, "tabaco").length, 1);
  assert.equal(buscarProductos(PRODUCTOS, "orgánico").length, 1);
  assert.equal(buscarProductos(PRODUCTOS, "no-existe").length, 0);
  assert.equal(buscarProductos(PRODUCTOS, "   ").length, 4);
});

test("ordenarProductos no muta la lista original", () => {
  const original = [...PRODUCTOS];
  const ordenados = ordenarProductos(PRODUCTOS, "precio-asc");

  assert.deepEqual(PRODUCTOS, original);
  assert.equal(ordenados[0].precio, 70);
  assert.equal(ordenados.at(-1).precio, 200);
});

test("ordenarProductos soporta precio y nombre", () => {
  assert.deepEqual(
    ordenarProductos(PRODUCTOS, "precio-desc").map((producto) => producto.precio),
    [200, 120, 70, 70],
  );
  assert.deepEqual(
    ordenarProductos(PRODUCTOS, "nombre-asc").map((producto) => producto.nombre),
    ["Cuatro Leguas", "Filtros OCB Slim", "Sedas OCB Cáñamo", "Sedas RAW"],
  );
  assert.deepEqual(
    ordenarProductos(PRODUCTOS, "relevancia").map((producto) => producto.id),
    PRODUCTOS.map((producto) => producto.id),
  );
});

test("filtrarProductos combina categoría, búsqueda y orden", () => {
  const resultado = filtrarProductos(PRODUCTOS, {
    categoria: "cedas",
    busqueda: "papel",
    orden: "nombre-asc",
  });

  assert.equal(resultado.length, 2);
  assert.deepEqual(
    resultado.map((producto) => producto.nombre),
    ["Sedas OCB Cáñamo", "Sedas RAW"],
  );
});

test("obtenerDestacados y contarPorCategoria", () => {
  assert.equal(obtenerDestacados(PRODUCTOS, 1).length, 1);
  assert.equal(obtenerDestacados(PRODUCTOS, 1)[0].id, "cedas-ocb-canamo");
  assert.equal(contarPorCategoria(PRODUCTOS, "cedas"), 2);
  assert.equal(contarPorCategoria(PRODUCTOS, "tabacos"), 1);
});
