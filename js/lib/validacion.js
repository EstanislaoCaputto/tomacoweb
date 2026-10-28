/**
 * Validaciones de formularios.
 * Cada función devuelve { valido, mensaje } para poder mostrarlo en la UI.
 */

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MOTIVOS_CONTACTO = Object.freeze(["pedido", "envio", "pago", "otro"]);
export const METODOS_PAGO = Object.freeze(["efectivo", "mercadopago", "coordinar"]);

function resultado(valido, mensaje = "") {
  return { valido, mensaje };
}

/**
 * @param {unknown} valor
 */
export function validarNombre(valor) {
  const texto = String(valor ?? "").trim();
  if (!texto) return resultado(false, "Contanos tu nombre.");
  if (texto.length < 2) return resultado(false, "El nombre tiene que tener al menos 2 letras.");
  if (texto.length > 80) return resultado(false, "El nombre no puede superar los 80 caracteres.");
  return resultado(true);
}

/**
 * @param {unknown} valor
 * @param {{requerido?: boolean}} [opciones]
 */
export function validarEmail(valor, opciones = {}) {
  const { requerido = true } = opciones;
  const texto = String(valor ?? "").trim();
  if (!texto) {
    return requerido ? resultado(false, "Ingresá un correo electrónico.") : resultado(true);
  }
  if (texto.length > 120) return resultado(false, "El correo es demasiado largo.");
  if (!REGEX_EMAIL.test(texto)) return resultado(false, "Revisá el formato del correo.");
  return resultado(true);
}

/**
 * Acepta números con espacios, guiones, paréntesis y prefijo +.
 * @param {unknown} valor
 * @param {{requerido?: boolean}} [opciones]
 */
export function validarTelefono(valor, opciones = {}) {
  const { requerido = true } = opciones;
  const texto = String(valor ?? "").trim();
  const digitos = texto.replace(/\D/g, "");

  if (!digitos) {
    return requerido ? resultado(false, "Ingresá un teléfono de contacto.") : resultado(true);
  }
  if (digitos.length < 8) return resultado(false, "El teléfono tiene que tener al menos 8 dígitos.");
  if (digitos.length > 15) return resultado(false, "El teléfono tiene demasiados dígitos.");
  return resultado(true);
}

/**
 * @param {unknown} valor
 */
export function validarZona(valor) {
  const texto = String(valor ?? "").trim();
  if (!texto) return resultado(false, "Indicá tu barrio o zona de entrega.");
  if (texto.length < 2) return resultado(false, "La zona es demasiado corta.");
  if (texto.length > 80) return resultado(false, "La zona no puede superar los 80 caracteres.");
  return resultado(true);
}

/**
 * @param {unknown} valor
 * @param {{requerido?: boolean, min?: number, max?: number}} [opciones]
 */
export function validarMensaje(valor, opciones = {}) {
  const { requerido = false, min = 5, max = 600 } = opciones;
  const texto = String(valor ?? "").trim();

  if (!texto) {
    return requerido ? resultado(false, "Escribí un mensaje.") : resultado(true);
  }
  if (texto.length < min) {
    return resultado(false, `El mensaje tiene que tener al menos ${min} caracteres.`);
  }
  if (texto.length > max) {
    return resultado(false, `El mensaje no puede superar los ${max} caracteres.`);
  }
  return resultado(true);
}

/**
 * @param {unknown} valor
 * @param {readonly string[]} opciones
 * @param {string} mensaje
 */
export function validarSeleccion(valor, opciones, mensaje) {
  const texto = String(valor ?? "").trim();
  if (!texto || !opciones.includes(texto)) return resultado(false, mensaje);
  return resultado(true);
}

/**
 * @param {unknown} valor
 */
export function validarAceptaEdad(valor) {
  if (valor !== true) {
    return resultado(false, "Tenés que confirmar que sos mayor de 18 años.");
  }
  return resultado(true);
}

/**
 * Validación del formulario de contacto.
 * @param {{nombre?: unknown, email?: unknown, motivo?: unknown, mensaje?: unknown}} datos
 */
export function validarContacto(datos = {}) {
  /** @type {Record<string, string>} */
  const errores = {};

  const nombre = validarNombre(datos.nombre);
  if (!nombre.valido) errores.nombre = nombre.mensaje;

  const email = validarEmail(datos.email);
  if (!email.valido) errores.email = email.mensaje;

  const motivo = validarSeleccion(
    datos.motivo,
    MOTIVOS_CONTACTO,
    "Elegí un motivo de consulta.",
  );
  if (!motivo.valido) errores.motivo = motivo.mensaje;

  const mensaje = validarMensaje(datos.mensaje, { requerido: true, min: 10, max: 500 });
  if (!mensaje.valido) errores.mensaje = mensaje.mensaje;

  return { valido: Object.keys(errores).length === 0, errores };
}

/**
 * Validación del formulario de encargos.
 * @param {{nombre?: unknown, email?: unknown, telefono?: unknown, zona?: unknown, direccion?: unknown, mensaje?: unknown, pago?: unknown, terminos?: unknown}} datos
 */
export function validarEncargo(datos = {}) {
  /** @type {Record<string, string>} */
  const errores = {};

  const nombre = validarNombre(datos.nombre);
  if (!nombre.valido) errores.nombre = nombre.mensaje;

  const email = validarEmail(datos.email);
  if (!email.valido) errores.email = email.mensaje;

  const telefono = validarTelefono(datos.telefono, { requerido: true });
  if (!telefono.valido) errores.telefono = telefono.mensaje;

  const zona = validarZona(datos.zona);
  if (!zona.valido) errores.zona = zona.mensaje;

  const direccion = String(datos.direccion ?? "").trim();
  if (direccion.length > 140) errores.direccion = "La dirección no puede superar los 140 caracteres.";

  const mensaje = validarMensaje(datos.mensaje, { requerido: false, min: 5, max: 600 });
  if (!mensaje.valido) errores.mensaje = mensaje.mensaje;

  const pago = validarSeleccion(
    datos.pago,
    METODOS_PAGO,
    "Elegí un medio de pago para coordinar.",
  );
  if (!pago.valido) errores.pago = pago.mensaje;

  const terminos = validarAceptaEdad(datos.terminos);
  if (!terminos.valido) errores.terminos = terminos.mensaje;

  return { valido: Object.keys(errores).length === 0, errores };
}
