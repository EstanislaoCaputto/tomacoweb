/**
 * Aviso para quien abre los HTML con doble clic.
 * Los módulos ES no funcionan bajo file://, así que este script clásico
 * se encarga de explicar cómo levantar el servidor local.
 */
(function () {
  if (window.location.protocol !== "file:") return;

  function mostrarAviso() {
    if (document.querySelector(".file-warning")) return;

    var aviso = document.createElement("div");
    aviso.className = "file-warning";
    aviso.innerHTML =
      "Estás abriendo la demo con <code>file://</code>. Para que funcionen el carrito y los módulos, ejecutá <code>npm run dev</code> y entrá a " +
      '<a href="http://localhost:4173">http://localhost:4173</a>.';

    document.body.insertBefore(aviso, document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mostrarAviso);
  } else {
    mostrarAviso();
  }
})();
