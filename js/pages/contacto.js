import { SITE } from "../config.js";
import {
  MOTIVOS_CONTACTO,
  validarContacto,
  validarEmail,
  validarMensaje,
  validarNombre,
  validarSeleccion,
} from "../lib/validacion.js";
import { construirMensajeContacto, construirUrlWhatsApp } from "../lib/whatsapp.js";
import { mostrarToast } from "../ui/toast.js";

/**
 * @returns {void}
 */
export function iniciarContacto() {
  const form = document.querySelector("[data-contacto-form]");
  if (!(form instanceof HTMLFormElement)) return;

  const exito = document.querySelector("[data-contacto-success]");
  const contador = document.querySelector("[data-contacto-counter]");
  const mensajeInput = form.querySelector('[name="mensaje"]');

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
    ["nombre", "email", "motivo", "mensaje"].forEach((nombre) => marcarError(nombre, ""));
  }

  /**
   * @param {string} nombre
   */
  function validarCampo(nombre) {
    const valor = campo(nombre)?.value ?? "";
    switch (nombre) {
      case "nombre":
        return validarNombre(valor);
      case "email":
        return validarEmail(valor);
      case "motivo":
        return validarSeleccion(valor, MOTIVOS_CONTACTO, "Elegí un motivo de consulta.");
      case "mensaje":
        return validarMensaje(valor, { requerido: true, min: 10, max: 500 });
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
  }

  function actualizarContador() {
    if (!(mensajeInput instanceof HTMLTextAreaElement) || !contador) return;
    contador.textContent = `${mensajeInput.value.length}/500`;
  }

  actualizarContador();

  form.addEventListener("focusout", (evento) => {
    const control = evento.target;
    if (
      control instanceof HTMLInputElement ||
      control instanceof HTMLTextAreaElement ||
      control instanceof HTMLSelectElement
    ) {
      if (control.name) validarYMarcar(control.name);
    }
  });

  form.addEventListener("input", (evento) => {
    const control = evento.target;
    if (!(control instanceof HTMLInputElement) && !(control instanceof HTMLTextAreaElement)) return;
    if (control.getAttribute("aria-invalid") === "true" && control.name) {
      validarYMarcar(control.name);
    }
    actualizarContador();
  });

  form.addEventListener("change", (evento) => {
    const control = evento.target;
    if (control instanceof HTMLSelectElement && control.name) validarYMarcar(control.name);
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const datos = {
      nombre: campo("nombre")?.value ?? "",
      email: campo("email")?.value ?? "",
      motivo: campo("motivo")?.value ?? "",
      mensaje: campo("mensaje")?.value ?? "",
    };

    const validacion = validarContacto(datos);
    limpiarErrores();
    Object.entries(validacion.errores).forEach(([nombre, mensaje]) => marcarError(nombre, mensaje));

    if (!validacion.valido) {
      const primero = form.querySelector(".is-invalid");
      if (primero instanceof HTMLElement) primero.focus();
      mostrarToast({
        titulo: "Revisá tu consulta",
        mensaje: "Faltan datos o hay algo mal en el formulario.",
        tipo: "error",
      });
      return;
    }

    const mensaje = construirMensajeContacto(datos);
    const url = construirUrlWhatsApp(SITE.whatsapp, mensaje);

    if (exito instanceof HTMLElement) {
      const enlace = exito.querySelector("[data-success-link]");
      if (enlace instanceof HTMLAnchorElement) enlace.href = url;
      exito.hidden = false;
      exito.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    window.open(url, "_blank", "noopener,noreferrer");
    mostrarToast({
      titulo: "Consulta preparada",
      mensaje: "Abrimos WhatsApp con tu mensaje. Si no se abrió, usá el botón del panel verde.",
    });
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      limpiarErrores();
      actualizarContador();
      if (exito instanceof HTMLElement) exito.hidden = true;
    }, 0);
  });

  document.querySelectorAll("[data-contacto-reset]").forEach((boton) => {
    boton.addEventListener("click", () => {
      form.reset();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
