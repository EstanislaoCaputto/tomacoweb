import { calcularSubtotal, normalizarCarrito } from "./carrito.js";
import { formatearPrecio } from "./formato.js";

const ETIQUETAS_PAGO = Object.freeze({
  efectivo: "Efectivo",
  mercadopago: "Mercado Pago",
  coordinar: "A coordinar",
});

const ETIQUETAS_MOTIVO = Object.freeze({
  pedido: "Pedido",
  envio: "Envío",
  pago: "Medios de pago",
  otro: "Otra consulta",
});

/**
 * Deja solo los dígitos de un teléfono.
 * @param {unknown} valor
 */
export function soloDigitos(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

/**
 * Construye una URL de WhatsApp con el mensaje escapado.
 * @param {unknown} numero
 * @param {unknown} mensaje
 */
export function construirUrlWhatsApp(numero, mensaje) {
  const telefono = soloDigitos(numero);
  if (!telefono) return "#";
  const texto = String(mensaje ?? "").slice(0, 3500);
  return `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;
}

/**
 * Mensaje de pedido para enviar por WhatsApp.
 * @param {{items?: unknown, total?: number, cliente?: Record<string, unknown>, nota?: string, pago?: string}} opciones
 */
export function construirMensajePedido(opciones = {}) {
  const items = normalizarCarrito(opciones.items);
  const total = Number.isFinite(Number(opciones.total))
    ? Number(opciones.total)
    : calcularSubtotal(items);
  const cliente = opciones.cliente ?? {};
  const lineas = ["¡Hola Tomacco! Quiero hacer un encargo:", ""];

  if (items.length > 0) {
    lineas.push("*Pedido*");
    for (const item of items) {
      lineas.push(
        `• ${item.cantidad} × ${item.nombre} — ${formatearPrecio(item.precio * item.cantidad)}`,
      );
    }
    lineas.push("", `*Total: ${formatearPrecio(total)}*`, "");
  } else {
    lineas.push("Todavía no armé el carrito, pero quiero hacer una consulta.", "");
  }

  const datos = [];
  if (String(cliente.nombre ?? "").trim()) datos.push(`Nombre: ${String(cliente.nombre).trim()}`);
  if (String(cliente.email ?? "").trim()) datos.push(`Correo: ${String(cliente.email).trim()}`);
  if (String(cliente.telefono ?? "").trim()) {
    datos.push(`Teléfono: ${String(cliente.telefono).trim()}`);
  }
  if (String(cliente.zona ?? "").trim()) datos.push(`Zona: ${String(cliente.zona).trim()}`);
  if (String(cliente.direccion ?? "").trim()) {
    datos.push(`Dirección: ${String(cliente.direccion).trim()}`);
  }
  if (opciones.pago) datos.push(`Pago: ${ETIQUETAS_PAGO[opciones.pago] ?? opciones.pago}`);

  if (datos.length > 0) {
    lineas.push("*Datos de contacto*", ...datos, "");
  }

  const nota = String(opciones.nota ?? "").trim();
  if (nota) {
    lineas.push("*Nota*", nota, "");
  }

  lineas.push("Enviado desde la web de Tomacco.");
  return lineas.join("\n");
}

/**
 * Mensaje de contacto general.
 * @param {{nombre?: string, email?: string, motivo?: string, mensaje?: string}} datos
 */
export function construirMensajeContacto(datos = {}) {
  const lineas = ["¡Hola Tomacco! Les escribo desde la web.", ""];
  if (datos.nombre) lineas.push(`*Nombre:* ${String(datos.nombre).trim()}`);
  if (datos.email) lineas.push(`*Correo:* ${String(datos.email).trim()}`);
  if (datos.motivo) {
    lineas.push(`*Motivo:* ${ETIQUETAS_MOTIVO[datos.motivo] ?? datos.motivo}`);
  }
  lineas.push("", "*Consulta:*", String(datos.mensaje ?? "").trim(), "");
  lineas.push("Enviado desde la web de Tomacco.");
  return lineas.join("\n");
}
