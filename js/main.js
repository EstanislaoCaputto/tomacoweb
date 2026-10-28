import { iniciarCarrito } from "./ui/carritoUI.js";
import { iniciarComunes } from "./ui/comunes.js";
import { montarShell } from "./ui/shell.js";
import { iniciarContacto } from "./pages/contacto.js";
import { iniciarEncargos } from "./pages/encargos.js";
import { iniciarError404 } from "./pages/error404.js";
import { iniciarHome } from "./pages/home.js";
import { iniciarPagos } from "./pages/pagos.js";
import { iniciarProductos } from "./pages/productos.js";

const PAGINAS = {
  home: iniciarHome,
  productos: iniciarProductos,
  encargos: iniciarEncargos,
  contacto: iniciarContacto,
  pagos: iniciarPagos,
  "404": iniciarError404,
};

/**
 * Punto de entrada de la demo.
 * @returns {void}
 */
function iniciar() {
  montarShell();
  iniciarCarrito();

  const pagina = document.body.dataset.page ?? "";
  const inicializarPagina = PAGINAS[pagina];
  if (inicializarPagina) inicializarPagina();

  iniciarComunes();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar, { once: true });
} else {
  iniciar();
}
