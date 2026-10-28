import test from "node:test";
import assert from "node:assert/strict";

import {
  validarAceptaEdad,
  validarContacto,
  validarEmail,
  validarEncargo,
  validarMensaje,
  validarNombre,
  validarSeleccion,
  validarTelefono,
  validarZona,
} from "../js/lib/validacion.js";

test("validarNombre exige entre 2 y 80 caracteres", () => {
  assert.equal(validarNombre("Estanislao").valido, true);
  assert.equal(validarNombre("A").valido, false);
  assert.equal(validarNombre("").valido, false);
  assert.equal(validarNombre("   ").valido, false);
  assert.equal(validarNombre("x".repeat(81)).valido, false);
});

test("validarEmail detecta formatos válidos e inválidos", () => {
  assert.equal(validarEmail("hola@tomacco.com").valido, true);
  assert.equal(validarEmail("hola+pedido@tomacco.com.ar").valido, true);
  assert.equal(validarEmail("hola@tomacco").valido, false);
  assert.equal(validarEmail("hola tomacco.com").valido, false);
  assert.equal(validarEmail("").valido, false);
  assert.equal(validarEmail("", { requerido: false }).valido, true);
});

test("validarTelefono acepta formatos argentinos y descarta cortos", () => {
  assert.equal(validarTelefono("351 636-8448").valido, true);
  assert.equal(validarTelefono("+54 9 351 636 8448").valido, true);
  assert.equal(validarTelefono("123").valido, false);
  assert.equal(validarTelefono("").valido, false);
  assert.equal(validarTelefono("", { requerido: false }).valido, true);
});

test("validarZona y validarMensaje respetan mínimos y máximos", () => {
  assert.equal(validarZona("Centro").valido, true);
  assert.equal(validarZona("").valido, false);
  assert.equal(validarMensaje("").valido, true);
  assert.equal(validarMensaje("", { requerido: true }).valido, false);
  assert.equal(validarMensaje("corto", { min: 10 }).valido, false);
  assert.equal(validarMensaje("x".repeat(601)).valido, false);
});

test("validarSeleccion y validarAceptaEdad", () => {
  assert.equal(validarSeleccion("efectivo", ["efectivo", "mercadopago"], "Elegí").valido, true);
  assert.equal(validarSeleccion("bitcoin", ["efectivo"], "Elegí").valido, false);
  assert.equal(validarAceptaEdad(true).valido, true);
  assert.equal(validarAceptaEdad(false).valido, false);
});

test("validarContacto devuelve todos los errores juntos", () => {
  const invalido = validarContacto({
    nombre: "",
    email: "mal",
    motivo: "",
    mensaje: "corto",
  });

  assert.equal(invalido.valido, false);
  assert.deepEqual(Object.keys(invalido.errores).sort(), [
    "email",
    "mensaje",
    "motivo",
    "nombre",
  ]);

  const valido = validarContacto({
    nombre: "Estanislao",
    email: "hola@tomacco.com",
    motivo: "envio",
    mensaje: "¿Hacen envíos al centro de Córdoba?",
  });

  assert.equal(valido.valido, true);
  assert.deepEqual(valido.errores, {});
});

test("validarEncargo valida datos, pago y mayoría de edad", () => {
  const base = {
    nombre: "Estanislao",
    email: "hola@tomacco.com",
    telefono: "3516368448",
    zona: "Centro",
    direccion: "Av. Siempre Viva 123",
    mensaje: "Tocar timbre dos veces.",
    pago: "efectivo",
    terminos: true,
  };

  assert.equal(validarEncargo(base).valido, true);

  const sinTerminos = validarEncargo({ ...base, terminos: false });
  assert.equal(sinTerminos.valido, false);
  assert.ok(sinTerminos.errores.terminos);

  const pagoInvalido = validarEncargo({ ...base, pago: "bitcoin" });
  assert.equal(pagoInvalido.valido, false);
  assert.ok(pagoInvalido.errores.pago);

  const telefonoCorto = validarEncargo({ ...base, telefono: "123" });
  assert.equal(telefonoCorto.valido, false);
  assert.ok(telefonoCorto.errores.telefono);
});
