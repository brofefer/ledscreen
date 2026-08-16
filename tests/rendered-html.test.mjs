import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renderiza la página real de LedScreen", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();

  assert.match(html, /<title>LedScreen · Pantallas LED y soluciones técnicas para eventos<\/title>/);
  assert.match(html, /Convertimos/);
  assert.match(html, /Armá tu escenario/);
  assert.match(html, /Configurá tu evento en 3D/);
  assert.match(html, /Visualizá el montaje a escala y envialo por WhatsApp/);
  assert.match(html, /Cotizar por WhatsApp/);
  assert.match(html, /Globos Espejados/);
  assert.match(html, /Pines/);
  assert.match(html, /\+595 981 416316/);
  assert.match(html, /ledscreen@gmail\.com/);
  assert.match(html, /Todo el país/);
  assert.match(html, /https:\/\/wa\.me\/595981416316/);
  assert.match(html, /https:\/\/www\.instagram\.com\/ledscreenpy\//);
  assert.match(html, /https:\/\/www\.facebook\.com\/leds\.screen/);
  assert.match(html, /TikTok próximamente/);
  assert.match(html, />Cotizador<\/a>/);
  assert.doesNotMatch(html, />Cotizá<\/a>|>Cotizar<\/a>/);
  assert.match(html, /name="name"/);
  assert.match(html, /name="eventType"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|codex-preview/);
  assert.doesNotMatch(html, /quote-cta|Abrir cotizador/);
  assert.ok(html.indexOf('id="pantallas"') < html.indexOf('id="cotizador"'));
  assert.ok(html.indexOf('id="cotizador"') < html.indexOf('id="eventos"'));
});

test("renderiza un solo visor WebGL", async () => {
  const response = await render();
  const html = await response.text();
  assert.equal((html.match(/class="scene-shell"/g) ?? []).length, 1);
  assert.equal((html.match(/<canvas style="display:block"><\/canvas>/g) ?? []).length, 1);
  assert.equal((html.match(/class="config-scene"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /mobile-scene|desktop-scene/);
});
