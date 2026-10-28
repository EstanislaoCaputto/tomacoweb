let contador = 0;

/**
 * @param {unknown} texto
 */
function escapar(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Muestra un toast con Bootstrap si está disponible.
 * @param {{titulo?: string, mensaje?: string, tipo?: "success"|"error"}} opciones
 */
export function mostrarToast(opciones = {}) {
  const { titulo = "Listo", mensaje = "", tipo = "success" } = opciones;
  const contenedor = document.getElementById("toastContainer");
  if (!contenedor) return;

  contador += 1;
  const toast = document.createElement("div");
  toast.className = `toast site-toast${tipo === "error" ? " site-toast--error" : ""}`;
  toast.id = `toastTomacco${contador}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="toast-header">
      <span class="site-toast__dot"></span>
      <strong class="me-auto">${escapar(titulo)}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>
    <div class="toast-body">${escapar(mensaje)}</div>
  `;

  contenedor.append(toast);

  const BootstrapToast = window.bootstrap?.Toast;
  if (BootstrapToast) {
    const instancia = new BootstrapToast(toast, { delay: 3400, autohide: true });
    toast.addEventListener("hidden.bs.toast", () => toast.remove());
    instancia.show();
    return;
  }

  toast.classList.add("show");
  window.setTimeout(() => toast.remove(), 3400);
}

/**
 * Un toast de error con el mismo estilo.
 * @param {string} titulo
 * @param {string} mensaje
 */
export function mostrarError(titulo, mensaje) {
  mostrarToast({ titulo, mensaje, tipo: "error" });
}
