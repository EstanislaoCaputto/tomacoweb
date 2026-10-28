import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PUERTO = Number(process.env.PORT ?? 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

/**
 * @param {import("node:http").ServerResponse} res
 * @param {string} archivo
 * @param {number} [estado]
 */
function enviarArchivo(res, archivo, estado = 200) {
  const extension = extname(archivo).toLowerCase();
  res.writeHead(estado, {
    "Content-Type": MIME[extension] ?? "application/octet-stream",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  createReadStream(archivo).pipe(res);
}

const servidor = createServer((req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    let ruta = decodeURIComponent(url.pathname);

    if (ruta.endsWith("/")) ruta += "index.html";

    const archivo = normalize(join(RAIZ, ruta));
    if (!archivo.startsWith(RAIZ + sep) && archivo !== RAIZ) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Acceso denegado");
      return;
    }

    if (existsSync(archivo) && statSync(archivo).isFile()) {
      enviarArchivo(res, archivo);
      return;
    }

    const pagina404 = join(RAIZ, "404.html");
    if (existsSync(pagina404)) {
      enviarArchivo(res, pagina404, 404);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("No encontrado");
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Error del servidor: ${error instanceof Error ? error.message : "desconocido"}`);
  }
});

servidor.listen(PUERTO, "127.0.0.1", () => {
  console.log(`Tomacco demo: http://localhost:${PUERTO}`);
});
