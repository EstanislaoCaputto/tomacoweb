import test from "node:test";
import assert from "node:assert/strict";

import {
  construirMensajeContacto,
  construirMensajePedido,
  construirUrlWhatsApp,
  soloDigitos,
} from "../js/lib/whatsapp.js";

const ITEMS = [
  { id: "cuatro-leguas", nombre: "Cuatro Leguas", precio: 200, cantidad: 2 },
  { id: "cedas-ocb", nombre: "Sedas OCB", precio: 80, cantidad: 1 },
];

test("soloDigitos limpia cualquier formato", () => {
  assert.equal(soloDigitos("+54 9 351 636-8448"), "5493516368448");
  assert.equal(soloDigitos(""), "");
  assert.equal(soloDigitos(null), "");
});

test("construirUrlWhatsApp escapa el mensaje y usa wa.me", () => {
  const url = construirUrlWhatsApp("54 351 636 8448", "Hola & chau\nsegunda línea");
  assert.ok(url.startsWith("https://wa.me/543516368448?text="));
  assert.ok(url.includes(encodeURIComponent("Hola & chau\nsegunda línea")));
});

test("construirUrlWhatsApp devuelve # sin teléfono", () => {
  assert.equal(construirUrlWhatsApp("", "Hola"), "#");
});

test("construirMensajePedido incluye ítems, total y datos", () => {
  const mensaje = construirMensajePedido({
    items: ITEMS,
    total: 480,
    cliente: {
      nombre: "Estanislao",
      email: "hola@tomacco.com",
      telefono: "3516368448",
      zona: "Centro",
      direccion: "Av. Siempre Viva 123",
    },
    nota: "Tocar timbre.",
    pago: "efectivo",
  });

  assert.ok(mensaje.includes("• 2 × Cuatro Leguas — $400"));
  assert.ok(mensaje.includes("• 1 × Sedas OCB — $80"));
  assert.ok(mensaje.includes("*Total: $480*"));
  assert.ok(mensaje.includes("Nombre: Estanislao"));
  assert.ok(mensaje.includes("Pago: Efectivo"));
  assert.ok(mensaje.includes("Tocar timbre."));
  assert.ok(mensaje.includes("Enviado desde la web de Tomacco."));
});

test("construirMensajePedido calcula el total si no se lo pasa", () => {
  const mensaje = construirMensajePedido({ items: ITEMS });
  assert.ok(mensaje.includes("*Total: $480*"));
});

test("construirMensajePedido contempla carrito vacío", () => {
  const mensaje = construirMensajePedido({ items: [], cliente: { nombre: "Ana" } });
  assert.ok(mensaje.includes("Todavía no armé el carrito"));
  assert.ok(mensaje.includes("Nombre: Ana"));
});

test("construirMensajeContacto traduce el motivo", () => {
  const mensaje = construirMensajeContacto({
    nombre: "Ana",
    email: "ana@tomacco.com",
    motivo: "envio",
    mensaje: "¿Llegan a Villa Allende?",
  });

  assert.ok(mensaje.includes("*Nombre:* Ana"));
  assert.ok(mensaje.includes("*Motivo:* Envío"));
  assert.ok(mensaje.includes("¿Llegan a Villa Allende?"));
});
