import { mostrarToast } from "./toast.js";

/**
 * Marca el link activo comparando rutas, tolerando mayúsculas y la raíz.
 * @returns {void}
 */
function marcarNavegacionActiva() {
  const rutaActual = (() => {
    let ruta = window.location.pathname.split("/").pop() ?? "";
    if (!ruta) ruta = "index.html";
    try {
      return decodeURIComponent(ruta).toLowerCase();
    } catch {
      return ruta.toLowerCase();
    }
  })();

  document.querySelectorAll(".site-menu a[href]").forEach((enlace) => {
    const href = enlace.getAttribute("href") ?? "";
    const ruta = href.split("?")[0].split("#")[0].split("/").pop()?.toLowerCase() ?? "";
    const esActiva = ruta === rutaActual || (rutaActual === "" && ruta === "index.html");
    enlace.classList.toggle("is-active", esActiva);
    if (esActiva) {
      enlace.setAttribute("aria-current", "page");
    } else {
      enlace.removeAttribute("aria-current");
    }
  });
}

/**
 * Cierra el menú móvil al elegir un link.
 * @returns {void}
 */
function cerrarMenuAlNavegar() {
  const menu = document.getElementById("navPrincipal");
  if (!menu) return;

  menu.addEventListener("click", (evento) => {
    const objetivo = evento.target;
    if (!(objetivo instanceof Element)) return;
    if (!objetivo.closest(".nav-link")) return;
    if (!menu.classList.contains("show")) return;

    const Collapse = window.bootstrap?.Collapse;
    if (Collapse) {
      Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    }
  });
}

/**
 * Sombra sutil del header y botón de volver arriba.
 * @returns {void}
 */
function prepararScroll() {
  const header = document.querySelector(".site-header");
  const boton = document.querySelector("[data-back-to-top]");
  let pendiente = false;

  const actualizar = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 8);
    boton?.classList.toggle("is-visible", y > 520);
    pendiente = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(actualizar);
    },
    { passive: true },
  );

  actualizar();

  boton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * Revela elementos al entrar en pantalla.
 * @returns {void}
 */
function prepararRevelado() {
  const elementos = document.querySelectorAll("[data-reveal]");
  if (elementos.length === 0) return;

  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducido || !("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("is-visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add("is-visible");
        observador.unobserve(entrada.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}

/**
 * Respeta reduce-motion también en el carousel.
 * @returns {void}
 */
function prepararCarousel() {
  const carousel = document.querySelector(".carousel[data-bs-ride='carousel']");
  if (!carousel) return;
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const Carousel = window.bootstrap?.Carousel;
  if (Carousel) {
    Carousel.getOrCreateInstance(carousel).pause();
  }
}

/**
 * @returns {void}
 */
export function iniciarComunes() {
  marcarNavegacionActiva();
  cerrarMenuAlNavegar();
  prepararScroll();
  prepararRevelado();
  prepararCarousel();

  document.querySelectorAll("[data-year]").forEach((elemento) => {
    elemento.textContent = String(new Date().getFullYear());
  });

  // Los enlaces externos se abren en otra pestaña de forma segura.
  document.querySelectorAll('a[href^="http"]').forEach((enlace) => {
    if (enlace.hostname === window.location.hostname) return;
    enlace.setAttribute("target", "_blank");
    enlace.setAttribute("rel", "noopener noreferrer");
  });

  // Si el usuario llega desde un enlace roto, avisamos una sola vez.
  const estado = new URLSearchParams(window.location.search).get("estado");
  if (estado === "carrito-vacio") {
    mostrarToast({
      titulo: "Tu carrito está vacío",
      mensaje: "Agregá algún producto antes de pasar al checkout.",
      tipo: "error",
    });
  }
}
