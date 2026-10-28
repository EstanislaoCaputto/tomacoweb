const FRASES = [
  "La cabra se comió esta página. Pasó de largo.",
  "Ni el humo encuentra este enlace.",
  "404: se armó mal el cigarrito del enlace.",
  "Esta página se fue a fumar a otro lado.",
];

/**
 * Pequeño easter egg de la 404.
 * @returns {void}
 */
export function iniciarError404() {
  const mascota = document.querySelector("[data-error-mascot]");
  const frase = document.querySelector("[data-error-quote]");
  if (!(mascota instanceof HTMLElement) || !frase) return;

  let indice = 0;
  mascota.addEventListener("click", () => {
    indice = (indice + 1) % FRASES.length;
    frase.textContent = FRASES[indice];
  });
}
