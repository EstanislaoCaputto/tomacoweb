import test from "node:test";
import assert from "node:assert/strict";

import {
  MAX_CANTIDAD,
  actualizarCantidad,
  agregarItem,
  calcularSubtotal,
  contarItems,
  deserializarCarrito,
  estaVacio,
  normalizarCarrito,
  normalizarItem,
  quitarItem,
  serializarCarrito,
} from "../js/lib/carrito.js";

const PRODUCTO = {
  id: "cuatro-leguas",
  nombre: "Cuatro Leguas",
  precio: 200,
  imagen: "img/4-leguas.jpg",
  categoria: "tabacos",
};

test("normalizarItem acepta un ítem válido y completa campos", () => {
  assert.deepEqual(normalizarItem({ ...PRODUCTO, cantidad: 2 }), {
    ...PRODUCTO,
    cantidad: 2,
  });
});

test("normalizarItem rechaza ítems sin id, nombre o precio", () => {
  assert.equal(normalizarItem(null), null);
  assert.equal(normalizarItem({}), null);
  assert.equal(normalizarItem({ id: "x", nombre: "", precio: 10 }), null);
  assert.equal(normalizarItem({ id: "x", nombre: "X", precio: -1 }), null);
  assert.equal(normalizarItem({ id: "x", nombre: "X", precio: "abc" }), null);
});

test("normalizarItem ajusta cantidades fuera de rango", () => {
  assert.equal(normalizarItem({ ...PRODUCTO, cantidad: 0 })?.cantidad, 1);
  assert.equal(normalizarItem({ ...PRODUCTO, cantidad: -5 })?.cantidad, 1);
  assert.equal(normalizarItem({ ...PRODUCTO, cantidad: 1000 })?.cantidad, MAX_CANTIDAD);
  assert.equal(normalizarItem({ ...PRODUCTO, cantidad: 2.9 })?.cantidad, 2);
});

test("normalizarCarrito sanea, descarta y fusiona duplicados", () => {
  const carrito = normalizarCarrito([
    { ...PRODUCTO, cantidad: 1 },
    { ...PRODUCTO, cantidad: 2 },
    { id: "roto" },
    null,
  ]);

  assert.equal(carrito.length, 1);
  assert.equal(carrito[0].cantidad, 3);
});

test("normalizarCarrito devuelve [] si no recibe un array", () => {
  assert.deepEqual(normalizarCarrito(null), []);
  assert.deepEqual(normalizarCarrito({ id: "x" }), []);
});

test("agregarItem agrega sin mutar el carrito original", () => {
  const original = [];
  const resultado = agregarItem(original, PRODUCTO, 2);

  assert.equal(original.length, 0);
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].cantidad, 2);
});

test("agregarItem suma cantidades cuando el producto ya existe", () => {
  const primero = agregarItem([], PRODUCTO, 1);
  const segundo = agregarItem(primero, PRODUCTO, 2);

  assert.equal(segundo.length, 1);
  assert.equal(segundo[0].cantidad, 3);
});

test("agregarItem usa la cantidad del ítem si no se pasa cantidad", () => {
  const resultado = agregarItem([], { ...PRODUCTO, cantidad: 4 });
  assert.equal(resultado[0].cantidad, 4);
});

test("agregarItem no supera el máximo por ítem", () => {
  const carrito = agregarItem([], PRODUCTO, MAX_CANTIDAD);
  const resultado = agregarItem(carrito, PRODUCTO, 10);
  assert.equal(resultado[0].cantidad, MAX_CANTIDAD);
});

test("quitarItem elimina por id y deja el resto intacto", () => {
  const carrito = agregarItem(agregarItem([], PRODUCTO, 1), {
    id: "sedas-ocb",
    nombre: "Sedas OCB",
    precio: 80,
  });
  const resultado = quitarItem(carrito, PRODUCTO.id);

  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].id, "sedas-ocb");
});

test("actualizarCantidad fija, quita y recorta valores", () => {
  const carrito = agregarItem([], PRODUCTO, 2);

  assert.equal(actualizarCantidad(carrito, PRODUCTO.id, 5)[0].cantidad, 5);
  assert.equal(actualizarCantidad(carrito, PRODUCTO.id, 0).length, 0);
  assert.equal(actualizarCantidad(carrito, PRODUCTO.id, -2).length, 0);
  assert.equal(actualizarCantidad(carrito, PRODUCTO.id, 500)[0].cantidad, MAX_CANTIDAD);
  assert.equal(actualizarCantidad(carrito, "no-existe", 2).length, 1);
});

test("contarItems y calcularSubtotal suman bien", () => {
  const carrito = agregarItem(
    agregarItem([], PRODUCTO, 2),
    { id: "sedas-ocb", nombre: "Sedas OCB", precio: 80 },
    3,
  );

  assert.equal(contarItems(carrito), 5);
  assert.equal(calcularSubtotal(carrito), 640);
  assert.equal(estaVacio(carrito), false);
  assert.equal(estaVacio([]), true);
});

test("serializar y deserializar conservan el carrito", () => {
  const carrito = agregarItem([], PRODUCTO, 2);
  const texto = serializarCarrito(carrito);
  assert.deepEqual(deserializarCarrito(texto), carrito);
});

test("deserializarCarrito tolera JSON roto o formatos raros", () => {
  assert.deepEqual(deserializarCarrito("{no-es-json"), []);
  assert.deepEqual(deserializarCarrito("null"), []);
  assert.deepEqual(deserializarCarrito(""), []);
  assert.deepEqual(deserializarCarrito(undefined), []);
});
