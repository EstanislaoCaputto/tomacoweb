import { SITE, STORAGE_KEYS } from "../config.js";
import { calcularSubtotal, contarItems } from "../lib/carrito.js";
import { borrarClave, guardarJson, leerJson, obtenerAlmacen } from "../lib/almacenamiento.js";
import { formatearPrecio, pluralizar } from "../lib/formato.js";
import {
  METODOS_PAGO,
  validarAceptaEdad,
  validarEmail,
  validarEncargo,
  validarMensaje,
  validarNombre,
  validarSeleccion,
  validarTelefono,
  validarZona,
} from "../lib/validacion.js";
import { construirMensajePedido, construirUrlWhatsApp } from "../lib/whatsapp.js";
import { obtenerCarritoActual } from "../ui/carritoUI.js";
import { mostrarToast } from "../ui/toast.js";

const CAMPOS_BORRADOR = ["nombre", "email", "telefono", "zona", "direccion", "mensaje", "pago"];

/**
 * @returns {void}
 */
export function iniciarEncargos() {
  const form = document.querySelector("[data-encargo-form]");
  if (!(form instanceof HTMLFormElement)) return;

  const almacen = obtenerAlmacen();
  const exito = document.querySelector("[data-encargo-success]");
  const estadoBorrador = document.querySelector("[data-draft-status]");
  const listaResumen = document.querySelector("[data-order-summary-list]");
  const totalResumen = document.querySelector("[data-order-summary-total]");
  const vacioResumen = document.querySelector("[data-order-summary-empty]");
  const contadorResumen = document.querySelector("[data-order-summary-count]");
  const mensajeInput = form.querySelector('[name="mensaje"]');
  const contadorMensaje = document.querySelector("[data-encargo-counter]");
  let temporizadorBorrador = 0;
  let pedidoEnviado = false;

  /**
   * @param {string} nombre
   * @returns {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|null}
   */
  function campo(nombre) {
    const elemento = form.elements.namedItem(nombre);
    if (
      elemento instanceof HTMLInputElement ||
      elemento instanceof HTMLTextAreaElement ||
      elemento instanceof HTMLSelectElement
    ) {
      return elemento;
    }
    return null;
  }

  /**
   * @returns {Record<string, unknown>}
   */
  function leerFormulario() {
    const terminos = campo("terminos");
    return {
      nombre: campo("nombre")?.value ?? "",
      email: campo("email")?.value ?? "",
      telefono: campo("telefono")?.value ?? "",
      zona: campo("zona")?.value ?? "",
      direccion: campo("direccion")?.value ?? "",
      mensaje: campo("mensaje")?.value ?? "",
      pago: campo("pago")?.value ?? "",
      terminos: terminos instanceof HTMLInputElement ? terminos.checked : false,
    };
  }

  /**
   * @param {string} nombre
   * @param {string} mensaje
   */
  function marcarError(nombre, mensaje) {
    const control = campo(nombre);
    const error = form.querySelector(`[data-error-for="${nombre}"]`);
    if (control) {
      control.classList.toggle("is-invalid", Boolean(mensaje));
      control.setAttribute("aria-invalid", mensaje ? "true" : "false");
    }
    if (error) error.textContent = mensaje;
  }

  function limpiarErrores() {
    CAMPOS_BORRADOR.concat(["terminos"]).forEach((nombre) => marcarError(nombre, ""));
  }

  /**
   * @param {string} nombre
   * @returns {{valido: boolean, mensaje: string}}
   */
  function validarCampo(nombre) {
    const control = campo(nombre);
    const valor = control instanceof HTMLInputElement && control.type === "checkbox"
      ? control.checked
      : control?.value ?? "";

    switch (nombre) {
      case "nombre":
        return validarNombre(valor);
      case "email":
        return validarEmail(valor);
      case "telefono":
        return validarTelefono(valor, { requerido: true });
      case "zona":
        return validarZona(valor);
      case "mensaje":
        return validarMensaje(valor, { requerido: false, min: 5, max: 600 });
      case "pago":
        return validarSeleccion(valor, METODOS_PAGO, "Elegí un medio de pago.");
      case "terminos":
        return validarAceptaEdad(valor === true);
      case "direccion":
        return String(valor).trim().length > 140
          ? { valido: false, mensaje: "La dirección no puede superar los 140 caracteres." }
          : { valido: true, mensaje: "" };
      default:
        return { valido: true, mensaje: "" };
    }
  }

  /**
   * @param {string} nombre
   */
  function validarYMarcar(nombre) {
    const resultado = validarCampo(nombre);
    marcarError(nombre, resultado.valido ? "" : resultado.mensaje);
    return resultado.valido;
  }

  /**
   * @returns {void}
   */
  function actualizarContadorMensaje() {
    if (!(mensajeInput instanceof HTMLTextAreaElement) || !contadorMensaje) return;
    contadorMensaje.textContent = `${mensajeInput.value.length}/600`;
  }

  /**
   * @returns {void}
   */
  function guardarBorradorAhora() {
    if (!almacen || pedidoEnviado) return;
    const datos = leerFormulario();
    const borrador = Object.fromEntries(
      CAMPOS_BORRADOR.map((nombre) => [nombre, String(datos[nombre] ?? "")]),
    );
    guardarJson(almacen, STORAGE_KEYS.borradorEncargo, borrador);
    if (estadoBorrador) {
      estadoBorrador.textContent = "Borrador guardado en este dispositivo";
      estadoBorrador.classList.add("is-saved");
      window.setTimeout(() => estadoBorrador.classList.remove("is-saved"), 1600);
    }
  }

  /**
   * @returns {void}
   */
  function guardarBorrador() {
    window.clearTimeout(temporizadorBorrador);
    temporizadorBorrador = window.setTimeout(guardarBorradorAhora, 420);
  }

  function restaurarBorrador() {
    const borrador = leerJson(almacen, STORAGE_KEYS.borradorEncargo, null);
    if (!borrador || typeof borrador !== "object") return;

    CAMPOS_BORRADOR.forEach((nombre) => {
      const control = campo(nombre);
      const valor = borrador[nombre];
      if (control && typeof valor === "string") control.value = valor;
    });

    if (estadoBorrador) estadoBorrador.textContent = "Recuperamos tu último borrador";
  }

  /**
   * @returns {void}
   */
  function renderResumen() {
    const items = obtenerCarritoActual();
    const total = calcularSubtotal(items);
    const cantidad = contarItems(items);

    if (totalResumen) totalResumen.textContent = formatearPrecio(total);
    if (contadorResumen) {
      contadorResumen.textContent = `${cantidad} ${pluralizar(cantidad, "ítem", "ítems")}`;
    }
    if (!listaResumen) return;

    listaResumen.replaceChildren();
    listaResumen.hidden = items.length === 0;
    if (vacioResumen) vacioResumen.hidden = items.length > 0;

    for (const item of items) {
      const fila = document.createElement("li");
      fila.className = "summary-item";

      const imagen = document.createElement("img");
      imagen.src = item.imagen;
      imagen.alt = item.nombre;
      imagen.width = 46;
      imagen.height = 46;
      imagen.loading = "lazy";

      const cuerpo = document.createElement("div");
      const nombre = document.createElement("p");
      nombre.className = "summary-item__name";
      nombre.textContent = item.nombre;
      const detalle = document.createElement("p");
      detalle.className = "summary-item__qty";
      detalle.textContent = `${item.cantidad} × ${formatearPrecio(item.precio)}`;
      cuerpo.append(nombre, detalle);

      const precio = document.createElement("span");
      precio.className = "summary-item__price";
      precio.textContent = formatearPrecio(item.precio * item.cantidad);

      fila.append(imagen, cuerpo, precio);
      listaResumen.append(fila);
    }
  }

  restaurarBorrador();
  actualizarContadorMensaje();
  renderResumen();

  document.addEventListener("tomacco:carrito", renderResumen);

  form.addEventListener("focusout", (evento) => {
    const control = evento.target;
    if (!(control instanceof HTMLInputElement) && !(control instanceof HTMLTextAreaElement) && !(control instanceof HTMLSelectElement)) {
      return;
    }
    const nombre = control.name;
    if (!CAMPOS_BORRADOR.includes(nombre) && nombre !== "terminos") return;
    validarYMarcar(nombre);
  });

  form.addEventListener("input", (evento) => {
    const control = evento.target;
    if (!(control instanceof HTMLInputElement) && !(control instanceof HTMLTextAreaElement)) return;

    pedidoEnviado = false;
    if (control.getAttribute("aria-invalid") === "true" && control.name) {
      validarYMarcar(control.name);
    }
    guardarBorrador();
    actualizarContadorMensaje();
  });

  form.addEventListener("change", (evento) => {
    const control = evento.target;
    if (!(control instanceof HTMLInputElement) && !(control instanceof HTMLSelectElement)) return;
    if (control.name) validarYMarcar(control.name);
    guardarBorrador();
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const datos = leerFormulario();
    const validacion = validarEncargo(datos);
    limpiarErrores();
    Object.entries(validacion.errores).forEach(([nombre, mensaje]) => marcarError(nombre, mensaje));

    if (!validacion.valido) {
      const primero = form.querySelector(".is-invalid");
      if (primero instanceof HTMLElement) primero.focus();
      mostrarToast({
        titulo: "Faltan datos",
        mensaje: "Revisá los campos marcados para poder armar el pedido.",
        tipo: "error",
      });
      return;
    }

    const items = obtenerCarritoActual();
    const total = calcularSubtotal(items);
    const mensaje = construirMensajePedido({
      items,
      total,
      cliente: {
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        zona: datos.zona,
        direccion: datos.direccion,
      },
      nota: String(datos.mensaje ?? ""),
      pago: String(datos.pago ?? ""),
    });
    const url = construirUrlWhatsApp(SITE.whatsapp, mensaje);
    pedidoEnviado = true;

    if (almacen) {
      guardarJson(almacen, STORAGE_KEYS.ultimoPedido, {
        fecha: new Date().toISOString(),
        items,
        total,
        cliente: {
          nombre: datos.nombre,
          email: datos.email,
          telefono: datos.telefono,
          zona: datos.zona,
        },
      });
      borrarClave(almacen, STORAGE_KEYS.borradorEncargo);
    }

    if (exito instanceof HTMLElement) {
      const enlace = exito.querySelector("[data-success-link]");
      if (enlace instanceof HTMLAnchorElement) enlace.href = url;
      exito.hidden = false;
      exito.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (estadoBorrador) estadoBorrador.textContent = "Pedido preparado para enviar";

    window.open(url, "_blank", "noopener,noreferrer");
    mostrarToast({
      titulo: "Pedido preparado",
      mensaje: "Abrimos WhatsApp con el resumen. Si no se abrió, usá el botón del panel verde.",
    });
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      pedidoEnviado = false;
      limpiarErrores();
      if (almacen) borrarClave(almacen, STORAGE_KEYS.borradorEncargo);
      if (exito instanceof HTMLElement) exito.hidden = true;
      if (estadoBorrador) estadoBorrador.textContent = "";
      actualizarContadorMensaje();
    }, 0);
  });

  document.querySelectorAll("[data-encargo-reset]").forEach((boton) => {
    boton.addEventListener("click", () => {
      form.reset();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  window.addEventListener("pagehide", guardarBorradorAhora);
}
