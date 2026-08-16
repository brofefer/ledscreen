import assert from "node:assert/strict";
import test from "node:test";
import { contactMessage, contactWhatsappHref } from "../data/contactMessage.ts";

const request = { name: "Ana", eventType: "Boda", date: "2026-12-05", message: "Salón para 300 personas" };

test("el formulario genera un mensaje completo", () => {
  assert.equal(contactMessage(request), [
    "Hola LedScreen! Quiero solicitar información para un evento:",
    "",
    "Nombre: Ana",
    "Tipo de evento: Boda",
    "Fecha: 2026-12-05",
    "Mensaje: Salón para 300 personas",
  ].join("\n"));
});

test("el formulario abre el WhatsApp comercial y codifica el contenido", () => {
  const href = contactWhatsappHref("595981416316", request);
  assert.ok(href.startsWith("https://wa.me/595981416316?text="));
  assert.match(decodeURIComponent(href), /Nombre: Ana/);
});
