import test from "node:test";
import assert from "node:assert/strict";

import {
  formatearPrecio,
  normalizarTexto,
  pluralizar,
  truncar,
} from "../js/lib/formato.js";

test("formatearPrecio arma pesos con separador de miles", () => {
  assert.equal(formatearPrecio(0), "$0");
  assert.equal(formatearPrecio(200), "$200");
  assert.equal(formatearPrecio(1200), "$1.200");
  assert.equal(formatearPrecio("550"), "$550");
});

test("formatearPrecio redondea y tolera valores inválidos", () => {
  assert.equal(formatearPrecio(199.6), "$200");
  assert.equal(formatearPrecio(-50), "-$50");
  assert.equal(formatearPrecio("no-es-un-numero"), "$0");
  assert.equal(formatearPrecio(null), "$0");
});

test("normalizarTexto quita acentos y pasa a minúsculas", () => {
  assert.equal(normalizarTexto("Van Häasen"), "van haasen");
  assert.equal(normalizarTexto("CÁÑAMO Orgánico"), "canamo organico");
  assert.equal(normalizarTexto("  Filtros  "), "filtros");
  assert.equal(normalizarTexto(null), "");
});

test("pluralizar elige singular o plural", () => {
  assert.equal(pluralizar(1, "producto", "productos"), "producto");
  assert.equal(pluralizar(0, "producto", "productos"), "productos");
  assert.equal(pluralizar(3, "ítem", "ítems"), "ítems");
});

test("truncar respeta el máximo y agrega elipsis", () => {
  assert.equal(truncar("hola", 10), "hola");
  assert.equal(truncar("hola mundo", 5), "hola…");
  assert.equal(truncar("", 5), "");
});
