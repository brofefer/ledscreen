/**
 * Regresión de los dos errores de borrado del cotizador.
 *
 * Correr con:  node --test --experimental-strip-types tests/scene-items.test.mjs
 */
import assert from "node:assert/strict";
import test from "node:test";
import {
  addUnits, changeUnits, countsOf, removeUnit, toggleGroup,
} from "../data/sceneItems.ts";

// Espejo de lo que `data/catalog.ts` entrega para estas claves.
const SPEC = {
  "jbl-vrx": { key: "jbl-vrx", group: "sound", defaultUnits: 1, maxUnits: 8 },
  "sub-vrx": { key: "sub-vrx", group: "sound", defaultUnits: 1, maxUnits: 8 },
  "sharpy": { key: "sharpy", group: "sharpy", defaultUnits: 4, maxUnits: 4 },
  "strobe": { key: "strobe", group: "strobe", defaultUnits: 2, maxUnits: 2 },
};

const ids = (list) => list.map((item) => item.id);
const slots = (list) => list.map((item) => item.slot);

test("agregar unidades genera ids propios y huecos consecutivos", () => {
  const list = addUnits([], SPEC["jbl-vrx"], 3);
  assert.deepEqual(ids(list), ["jbl-vrx-1", "jbl-vrx-2", "jbl-vrx-3"]);
  assert.deepEqual(slots(list), [0, 1, 2]);
});

test("BUG 1: borrar la unidad del medio quita esa, no la última", () => {
  const list = addUnits([], SPEC["jbl-vrx"], 3);
  const after = removeUnit(list, "jbl-vrx-2");
  // Antes desaparecía jbl-vrx-3, porque el id se derivaba de la posición.
  assert.deepEqual(ids(after), ["jbl-vrx-1", "jbl-vrx-3"]);
  assert.equal(countsOf(after)["jbl-vrx"], 2);
});

test("BUG 1: las unidades que quedan conservan su hueco de colocación", () => {
  const list = addUnits([], SPEC["jbl-vrx"], 3);
  const after = removeUnit(list, "jbl-vrx-2");
  // jbl-vrx-3 sigue en el hueco 2: no se corre al lugar de la que se borró.
  assert.deepEqual(slots(after), [0, 2]);
});

test("una unidad nueva reutiliza el hueco que quedó libre", () => {
  const list = removeUnit(addUnits([], SPEC["jbl-vrx"], 3), "jbl-vrx-2");
  const after = addUnits(list, SPEC["jbl-vrx"], 1);
  const added = after.find((item) => !ids(list).includes(item.id));
  assert.equal(added.slot, 1, "debería ocupar el hueco liberado, no el 3");
});

test("el audio comparte huecos entre tipos, para alternar izquierda/derecha", () => {
  let list = addUnits([], SPEC["jbl-vrx"], 2);
  list = addUnits(list, SPEC["sub-vrx"], 1);
  assert.deepEqual(slots(list), [0, 1, 2]);
});

test("cada tipo de luminaria lleva su propia serie de huecos", () => {
  let list = addUnits([], SPEC["sharpy"], 2);
  list = addUnits(list, SPEC["strobe"], 2);
  assert.deepEqual(list.filter((i) => i.key === "sharpy").map((i) => i.slot), [0, 1]);
  assert.deepEqual(list.filter((i) => i.key === "strobe").map((i) => i.slot), [0, 1]);
});

test("BUG 2: borrar una luminaria no apaga el grupo entero", () => {
  const list = toggleGroup([], SPEC["sharpy"]);
  assert.equal(list.length, 4, "el chip enciende las 4 posiciones previstas");
  const after = removeUnit(list, "sharpy-2");
  // Antes esto vaciaba las 4, porque el borrado hacía toggle de la categoría.
  assert.equal(countsOf(after)["sharpy"], 3);
  assert.deepEqual(ids(after), ["sharpy-1", "sharpy-3", "sharpy-4"]);
});

test("apagar el chip sí quita el grupo completo", () => {
  const list = toggleGroup([], SPEC["sharpy"]);
  assert.deepEqual(toggleGroup(list, SPEC["sharpy"]), []);
});

test("volver a encender el chip repone el grupo tras borrados individuales", () => {
  let list = toggleGroup([], SPEC["sharpy"]);
  list = removeUnit(list, "sharpy-1");
  list = toggleGroup(list, SPEC["sharpy"]);   // sigue habiendo 3 -> apaga
  assert.equal(list.length, 0);
  list = toggleGroup(list, SPEC["sharpy"]);   // enciende de nuevo
  assert.equal(list.length, 4);
});

test("el stepper respeta el tope del catálogo", () => {
  const list = addUnits([], SPEC["jbl-vrx"], 99);
  assert.equal(list.length, 8);
});

test("el stepper en negativo quita las últimas unidades", () => {
  const list = changeUnits(addUnits([], SPEC["jbl-vrx"], 3), SPEC["jbl-vrx"], -2);
  assert.deepEqual(ids(list), ["jbl-vrx-1"]);
});

test("restar más de lo que hay no deja cantidades negativas", () => {
  const list = changeUnits(addUnits([], SPEC["jbl-vrx"], 2), SPEC["jbl-vrx"], -5);
  assert.deepEqual(list, []);
});

test("borrar por id no toca las otras categorías", () => {
  let list = addUnits([], SPEC["jbl-vrx"], 2);
  list = toggleGroup(list, SPEC["sharpy"]);
  const after = removeUnit(list, "jbl-vrx-1");
  assert.equal(countsOf(after)["sharpy"], 4);
  assert.equal(countsOf(after)["jbl-vrx"], 1);
});

test("las operaciones son idempotentes: repetirlas no duplica", () => {
  // React puede llamar dos veces al updater de setState en desarrollo.
  const base = addUnits([], SPEC["jbl-vrx"], 1);
  assert.deepEqual(addUnits(base, SPEC["jbl-vrx"], 1), addUnits(base, SPEC["jbl-vrx"], 1));
  assert.deepEqual(removeUnit(base, "jbl-vrx-1"), removeUnit(base, "jbl-vrx-1"));
});

test("un tope de cero no agrega nada", () => {
  assert.deepEqual(addUnits([], { key: "x", group: "x", defaultUnits: 1, maxUnits: 0 }, 3), []);
});
