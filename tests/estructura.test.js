import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PRODUCTOS } from "../js/data/productos.js";
import { PROMOS } from "../js/data/promos.js";

const RAIZ = resolve(fileURLToPath(new URL("..", import.meta.url)));

const PAGINAS = new Map([
  ["index.html", "home"],
  ["Productos.html", "productos"],
  ["Promos.html", "promos"],
  ["Encargos.html", "encargos"],
  ["Contactanos.html", "contacto"],
  ["Medios-de-pago.html", "pagos"],
  ["404.html", "404"],
]);

const IDS_CARRITO = new Set([...PRODUCTOS, ...PROMOS].map((item) => item.id));

/**
 * @param {string} archivo
 */
function leer(archivo) {
  return readFileSync(resolve(RAIZ, archivo), "utf8");
}

/**
 * @param {string} html
 */
function ids(html) {
  return [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

/**
 * @param {string} html
 * @param {string} atributo
 */
function referencias(html, atributo) {
  const regex = new RegExp(`\\s${atributo}="([^"]+)"`, "g");
  return [...html.matchAll(regex)].map((match) => match[1]);
}

/**
 * @param {string} referencia
 */
function esLocal(referencia) {
  return (
    referencia.length > 0 &&
    !referencia.startsWith("#") &&
    !referencia.startsWith("http://") &&
    !referencia.startsWith("https://") &&
    !referencia.startsWith("mailto:") &&
    !referencia.startsWith("tel:") &&
    !referencia.startsWith("data:")
  );
}

test("las 7 páginas existen y están enlazadas desde el menú", () => {
  for (const [archivo] of PAGINAS) {
    assert.equal(existsSync(resolve(RAIZ, archivo)), true, `Falta ${archivo}`);
  }

  for (const [archivo] of PAGINAS) {
    const html = leer(archivo);
    for (const destino of ["Productos.html", "Promos.html", "Encargos.html", "Medios-de-pago.html", "Contactanos.html"]) {
      assert.ok(html.includes(`href="${destino}"`), `${archivo} no enlaza a ${destino}`);
    }
  }
});

test("cada página tiene lang, title, main, footer y un solo h1", () => {
  for (const [archivo, pagina] of PAGINAS) {
    const html = leer(archivo);
    assert.match(html, /^<!doctype html>/i, `${archivo}: falta doctype`);
    assert.match(html, /<html lang="es"/, `${archivo}: falta lang="es"`);
    assert.match(html, /<title>[^<]+<\/title>/, `${archivo}: falta title`);
    assert.match(html, new RegExp(`<body data-page="${pagina}">`), `${archivo}: data-page incorrecto`);
    assert.match(html, /<main id="contenido">/, `${archivo}: falta main#contenido`);
    assert.match(html, /<footer class="site-footer">/, `${archivo}: falta footer`);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${archivo}: debe tener un solo h1`);
    assert.ok(html.includes("css/estilos.css"), `${archivo}: falta la hoja de estilos`);
    assert.ok(html.includes("js/main.js"), `${archivo}: falta el entrypoint de JS`);
  }
});

test("no hay IDs duplicados en ninguna página", () => {
  for (const [archivo] of PAGINAS) {
    const lista = ids(leer(archivo));
    const unicos = new Set(lista);
    assert.equal(unicos.size, lista.length, `${archivo}: hay IDs duplicados`);
  }
});

test("los assets y enlaces locales existen en disco", () => {
  for (const [archivo] of PAGINAS) {
    const html = leer(archivo);
    for (const atributo of ["src", "href"]) {
      for (const referencia of referencias(html, atributo)) {
        if (!esLocal(referencia)) continue;
        const ruta = referencia.split("?")[0].split("#")[0];
        assert.equal(
          existsSync(resolve(RAIZ, decodeURIComponent(ruta))),
          true,
          `${archivo}: ${atributo} roto -> ${referencia}`,
        );
      }
    }
  }
});

test("todas las imágenes tienen atributo alt", () => {
  for (const [archivo] of PAGINAS) {
    const html = leer(archivo);
    const imagenes = html.match(/<img\b[^>]*>/g) ?? [];
    for (const imagen of imagenes) {
      assert.match(imagen, /\salt="[^"]*"/, `${archivo}: imagen sin alt -> ${imagen.slice(0, 90)}`);
    }
  }
});

test("los controles accesibles apuntan a IDs existentes (salvo el carrito inyectado)", () => {
  const inyectados = new Set(["carritoPanel"]);

  for (const [archivo] of PAGINAS) {
    const html = leer(archivo);
    const disponibles = new Set([...ids(html), ...inyectados]);

    for (const atributo of ["aria-controls", "aria-labelledby", "aria-describedby", "data-bs-target"]) {
      for (const referencia of referencias(html, atributo)) {
        const limpia = referencia.replace(/^#/, "");
        for (const id of limpia.split(/\s+/).filter(Boolean)) {
          assert.equal(disponibles.has(id), true, `${archivo}: ${atributo} apunta a #${id}, que no existe`);
        }
      }
    }
  }
});

test("los botones de agregar al carrito apuntan a productos o promos reales", () => {
  for (const archivo of ["index.html", "Promos.html"]) {
    const html = leer(archivo);
    const idsBotones = referencias(html, "data-add-to-cart");
    assert.ok(idsBotones.length > 0, `${archivo}: no tiene botones de carrito`);
    for (const id of idsBotones) {
      assert.equal(IDS_CARRITO.has(id), true, `${archivo}: producto inexistente en el carrito -> ${id}`);
    }
  }
});

test("error404.html redirige a la página 404 real", () => {
  const html = leer("error404.html");
  assert.match(html, /http-equiv="refresh" content="0; url=404\.html"/);
  assert.ok(html.includes('href="404.html"'));
});
