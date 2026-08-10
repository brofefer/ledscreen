/**
 * El resumen y el mensaje de WhatsApp son lo que finalmente le llega al
 * cliente, así que conviene tenerlos fijados.
 *
 * Correr con:  npm run test:unit
 */
import assert from "node:assert/strict";
import test from "node:test";
import { groupedScreens, quoteLines, quoteMessage, screenLabelOf, summaryRows, whatsappHref } from "../data/quoteMessage.ts";

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

const outdoor = { kind: "LED Outdoor", width: 6, height: 4 };
const totem = { kind: "E-Poster", width: 1, height: 2 };

const input = (over = {}) => ({ screens: [outdoor], counts: {}, extras: [], catalog, ...over });

test("una configuración mínima deja sólo la pantalla", () => {
  assert.deepEqual(quoteLines(input()), ["Pantalla: LED Outdoor — 6 × 4 m"]);
});

test("el tótem se nombra por su tipo, sin repetir la medida", () => {
  assert.equal(screenLabelOf(totem), "E-Poster 1×2");
});

test("la medida usa coma decimal", () => {
  assert.equal(screenLabelOf({ kind: "LED Indoor", width: 4, height: 2.5 }), "LED Indoor — 4 × 2,5 m");
});

test("con varias pantallas el renglón pasa a plural", () => {
  const lines = quoteLines(input({ screens: [outdoor, { kind: "LED Indoor", width: 3, height: 2 }] }));
  assert.equal(lines[0], "Pantallas: LED Outdoor — 6 × 4 m, LED Indoor — 3 × 2 m");
});

test("las pantallas idénticas se agrupan en vez de repetirse", () => {
  assert.deepEqual(groupedScreens([totem, totem, totem]), ["E-Poster 1×2 × 3"]);
});

test("agrupar distingue medidas distintas del mismo tipo", () => {
  const screens = [outdoor, outdoor, { kind: "LED Outdoor", width: 3, height: 2 }];
  assert.deepEqual(groupedScreens(screens), ["LED Outdoor — 6 × 4 m × 2", "LED Outdoor — 3 × 2 m"]);
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
  const rows = summaryRows(input({ screens: [outdoor, totem, totem], counts: { "jbl-vrx": 2 }, extras: ["DJ"] }));
  assert.deepEqual(rows, [
    { category: "Pantalla", label: "LED Outdoor — 6 × 4 m" },
    { category: "Pantalla", label: "E-Poster 1×2 × 2" },
    { category: "Sonido", label: "JBL VRX × 2" },
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
  const text = decodeURIComponent(href.split("?text=")[1]);
  assert.ok(text.includes("Pantalla: LED Outdoor — 6 × 4 m"));
});
