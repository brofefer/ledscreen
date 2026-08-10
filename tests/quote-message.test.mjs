/**
 * El resumen y el mensaje de WhatsApp son lo que finalmente le llega al
 * cliente, así que conviene tenerlos fijados.
 *
 * Correr con:  npm run test:unit
 */
import assert from "node:assert/strict";
import test from "node:test";
import { quoteLines, quoteMessage, screenLabelOf, summaryRows, whatsappHref } from "../data/quoteMessage.ts";

// Espejo de `data/catalog.ts`, en el mismo orden.
const catalog = [
  { key: "jbl-vrx", label: "JBL VRX", category: "sound" },
  { key: "rcf-evox-j8", label: "RCF EVOX J8", category: "sound" },
  { key: "rcf-ax15", label: "RCF AX15", category: "sound" },
  { key: "sub-vrx", label: "SUB VRX", category: "sound" },
  { key: "par-led", label: "PAR LED", category: "lighting" },
  { key: "sharpy", label: "Sharpy", category: "lighting" },
  { key: "strobe", label: "Strobe", category: "lighting" },
];

const input = (over = {}) => ({
  screen: { type: "LED Outdoor", label: "6 × 4 m", quantity: 1 },
  counts: {},
  extras: [],
  catalog,
  ...over,
});

test("una configuración vacía deja sólo la pantalla", () => {
  assert.deepEqual(quoteLines(input()), ["Pantalla: LED Outdoor — 6 × 4 m"]);
});

test("el E-Poster informa la cantidad de tótems, en singular y plural", () => {
  assert.equal(screenLabelOf({ type: "E-Poster", label: "1 × 2 m", quantity: 1 }), "E-Poster 1×2 — 1 tótem");
  assert.equal(screenLabelOf({ type: "E-Poster", label: "1 × 2 m", quantity: 3 }), "E-Poster 1×2 — 3 tótems");
});

test("cada equipo lleva su cantidad real", () => {
  const lines = quoteLines(input({ counts: { "jbl-vrx": 2, "par-led": 3, "strobe": 2 } }));
  assert.deepEqual(lines, [
    "Pantalla: LED Outdoor — 6 × 4 m",
    "Sonido: JBL VRX × 2",
    "Iluminación: PAR LED × 3, Strobe × 2",
  ]);
});

test("una luminaria borrada baja la cantidad, no desaparece el renglón", () => {
  // Es el caso de la captura: se agregaron 4 PAR LED y se borró uno.
  const lines = quoteLines(input({ counts: { "par-led": 3 } }));
  assert.equal(lines[1], "Iluminación: PAR LED × 3");
});

test("las categorías sin nada elegido no aparecen", () => {
  const lines = quoteLines(input({ counts: { "jbl-vrx": 1 } }));
  assert.equal(lines.length, 2);
  assert.ok(!lines.some((line) => line.startsWith("Iluminación")));
  assert.ok(!lines.some((line) => line.startsWith("Servicios")));
});

test("los extras van como servicios", () => {
  const lines = quoteLines(input({ extras: ["Consola DJ", "Micrófonos"] }));
  assert.equal(lines[1], "Servicios: Consola DJ, Micrófonos");
});

test("se respeta el orden del catálogo, no el de selección", () => {
  const lines = quoteLines(input({ counts: { "sub-vrx": 1, "jbl-vrx": 1 } }));
  assert.equal(lines[1], "Sonido: JBL VRX × 1, SUB VRX × 1");
});

test("el resumen en pantalla tiene una fila por ítem, con su categoría", () => {
  const rows = summaryRows(input({ counts: { "jbl-vrx": 2, "sharpy": 4 }, extras: ["DJ"] }));
  assert.deepEqual(rows, [
    { category: "Pantalla", label: "LED Outdoor — 6 × 4 m" },
    { category: "Sonido", label: "JBL VRX × 2" },
    { category: "Iluminación", label: "Sharpy × 4" },
    { category: "Servicios", label: "DJ" },
  ]);
});

test("el contador de ítems coincide con las filas mostradas", () => {
  const rows = summaryRows(input({ counts: { "jbl-vrx": 2, "sub-vrx": 1 }, extras: ["DJ", "Generador"] }));
  assert.equal(rows.length, 5, "pantalla + 2 de sonido + 2 servicios");
});

test("el mensaje completo conserva el formato acordado", () => {
  const message = quoteMessage(input({ counts: { "jbl-vrx": 2 } }));
  assert.equal(message, [
    "Hola LedScreen! Quiero cotizar este paquete:",
    "",
    "- Pantalla: LED Outdoor — 6 × 4 m",
    "- Sonido: JBL VRX × 2",
    "",
    "¿Me pasan presupuesto? Gracias!",
  ].join("\n"));
});

test("el enlace de WhatsApp codifica saltos de línea y acentos", () => {
  const href = whatsappHref("595981123456", input());
  assert.ok(href.startsWith("https://wa.me/595981123456?text="));
  assert.ok(href.includes("%0A"), "los saltos de línea van codificados");
  assert.ok(!href.includes(" "), "no deben quedar espacios sin codificar");
  // El texto se recupera intacto del otro lado.
  const text = decodeURIComponent(href.split("?text=")[1]);
  assert.ok(text.includes("Pantalla: LED Outdoor — 6 × 4 m"));
});
