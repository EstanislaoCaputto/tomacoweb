import test from "node:test";
import assert from "node:assert/strict";

import {
  borrarClave,
  guardarJson,
  leerJson,
  obtenerAlmacen,
} from "../js/lib/almacenamiento.js";

function crearAlmacenFalso() {
  const datos = new Map();
  return {
    getItem: (clave) => (datos.has(clave) ? datos.get(clave) : null),
    setItem: (clave, valor) => datos.set(clave, String(valor)),
    removeItem: (clave) => datos.delete(clave),
    datos,
  };
}

test("guardarJson y leerJson hacen round-trip", () => {
  const almacen = crearAlmacenFalso();
  assert.equal(guardarJson(almacen, "carrito", [{ id: "x", cantidad: 2 }]), true);
  assert.deepEqual(leerJson(almacen, "carrito", []), [{ id: "x", cantidad: 2 }]);
});

test("leerJson devuelve el fallback si falta la clave o el JSON es inválido", () => {
  const almacen = crearAlmacenFalso();
  assert.deepEqual(leerJson(almacen, "no-existe", []), []);
  almacen.setItem("roto", "{no-json");
  assert.deepEqual(leerJson(almacen, "roto", ["fallback"]), ["fallback"]);
});

test("borrarClave elimina el valor", () => {
  const almacen = crearAlmacenFalso();
  guardarJson(almacen, "clave", { a: 1 });
  assert.equal(borrarClave(almacen, "clave"), true);
  assert.deepEqual(leerJson(almacen, "clave", null), null);
});

test("las funciones toleran un almacén nulo", () => {
  assert.equal(guardarJson(null, "clave", 1), false);
  assert.equal(borrarClave(null, "clave"), false);
  assert.equal(leerJson(null, "clave", "default"), "default");
});

test("obtenerAlmacen no rompe fuera del navegador", () => {
  assert.equal(obtenerAlmacen(), null);
});
