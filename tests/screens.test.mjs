/**
 * Lista de pantallas: alta, baja, medidas y disposición por defecto.
 *
 * Correr con:  npm run test:unit
 */
import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_MAIN, DEFAULT_SIDE, EPOSTER_SIZE, MAX_SCREENS, SCREEN_GAP,
  addScreen, isPreset, layoutScreens, removeScreen, resizeScreen, screenSizeLabel,
  setScreenCustom, setScreenSize, stageSpanOf, tallestOf, updateScreen,
} from "../data/screens.ts";

const base = () => addScreen([], "LED Outdoor", { width: 6, height: 4 });
const xs = (list) => layoutScreens(list).map(({ x }) => Number(x.toFixed(3)));

test("la primera pantalla queda centrada", () => {
  assert.deepEqual(xs(base()), [0]);
});

test("las siguientes se alternan a los costados sin superponerse", () => {
  let list = base();                                        // 6 m al centro
  list = addScreen(list, "LED Indoor", { width: 3, height: 2 });
  list = addScreen(list, "LED Indoor", { width: 3, height: 2 });
  // centro ocupa [-3, 3]; la 2ª va a la izquierda, la 3ª a la derecha
  assert.deepEqual(xs(list), [0, -(3 + SCREEN_GAP + 1.5), 3 + SCREEN_GAP + 1.5]);
});

test("ninguna pantalla se solapa con la anterior", () => {
  let list = base();
  for (let i = 0; i < 4; i += 1) list = addScreen(list, "LED Indoor", { width: 4, height: 3 });
  const placed = layoutScreens(list).sort((a, b) => a.x - b.x);
  for (let i = 1; i < placed.length; i += 1) {
    const previousRight = placed[i - 1].x + placed[i - 1].item.width / 2;
    const currentLeft = placed[i].x - placed[i].item.width / 2;
    assert.ok(currentLeft >= previousRight - 1e-9, `se solapan ${placed[i - 1].item.id} y ${placed[i].item.id}`);
  }
});

test("el ancho total refleja pantallas y separaciones", () => {
  let list = base();                                        // 6
  list = addScreen(list, "LED Indoor", { width: 4, height: 3 });   // + gap + 4
  assert.equal(Number(stageSpanOf(list).toFixed(3)), 6 + SCREEN_GAP + 4);
});

test("una sola pantalla ocupa exactamente su ancho", () => {
  assert.equal(stageSpanOf(base()), 6);
});

test("hay un tope de pantallas", () => {
  let list = base();
  for (let i = 0; i < 20; i += 1) list = addScreen(list, "LED Indoor");
  assert.equal(list.length, MAX_SCREENS);
});

test("no se puede quedar sin ninguna pantalla", () => {
  const list = base();
  assert.deepEqual(removeScreen(list, list[0].id), list, "la última no se borra");
});

test("borrar quita esa pantalla y las demás conservan su lugar", () => {
  let list = base();
  list = addScreen(list, "LED Indoor", { width: 3, height: 2 });
  list = addScreen(list, "LED Indoor", { width: 3, height: 2 });
  const slots = list.map((item) => item.slot);
  assert.deepEqual(slots, [0, 1, 2]);
  const after = removeScreen(list, list[1].id);
  assert.deepEqual(after.map((item) => item.id), [list[0].id, list[2].id]);
  assert.deepEqual(after.map((item) => item.slot), [0, 2], "la tercera no se corre al hueco de la segunda");
});

test("una pantalla nueva reutiliza el hueco liberado", () => {
  let list = base();
  list = addScreen(list, "LED Indoor");
  list = addScreen(list, "LED Indoor");
  list = removeScreen(list, list[1].id);
  const after = addScreen(list, "LED Indoor");
  assert.equal(after[after.length - 1].slot, 1);
});

test("pasar a tótem impone la medida fija", () => {
  const list = updateScreen(base(), "screen-1", { kind: "E-Poster" });
  assert.equal(list[0].width, EPOSTER_SIZE.width);
  assert.equal(list[0].height, EPOSTER_SIZE.height);
});

test("salir de tótem recupera una medida usable", () => {
  let list = addScreen([], "E-Poster");
  list = updateScreen(list, list[0].id, { kind: "LED Indoor" });
  assert.equal(list[0].width, 6);
  assert.equal(list[0].height, 4);
});

test("varios tótems son varias pantallas, no un contador", () => {
  let list = addScreen([], "E-Poster");
  list = addScreen(list, "E-Poster");
  list = addScreen(list, "E-Poster");
  assert.equal(list.length, 3);
  assert.equal(stageSpanOf(list), 3 * 1 + 2 * SCREEN_GAP);
});

test("la medida se mueve de a medio metro", () => {
  const list = resizeScreen(setScreenCustom(base(), "screen-1", true), "screen-1", "width", 1);
  assert.equal(list[0].width, 6.5);
});

test("la medida respeta los topes", () => {
  let list = setScreenCustom(addScreen([], "LED Outdoor", { width: 12, height: 6 }), "screen-1", true);
  list = resizeScreen(list, list[0].id, "width", 1);
  assert.equal(list[0].width, 12, "no pasa de 12 m de ancho");
  list = resizeScreen(list, list[0].id, "height", 1);
  assert.equal(list[0].height, 6, "no pasa de 6 m de alto");
  list = resizeScreen(list, list[0].id, "width", -100);
  assert.equal(list[0].width, 1, "no baja de 1 m");
});

test("el tótem no se puede redimensionar", () => {
  const list = resizeScreen(setScreenCustom(addScreen([], "E-Poster"), "screen-1", true), "screen-1", "width", 4);
  assert.equal(list[0].width, EPOSTER_SIZE.width);
});

test("la etiqueta usa coma decimal", () => {
  assert.equal(screenSizeLabel({ width: 4, height: 2.5 }), "4 × 2,5 m");
});

test("el truss se cuelga sobre la pantalla más alta", () => {
  let list = addScreen([], "LED Indoor", { width: 3, height: 2 });
  list = addScreen(list, "LED Outdoor", { width: 8, height: 5 });
  assert.equal(tallestOf(list), 5);
});

/* ---- desplegable de medidas + "Personalizada" ---- */

test("la primera pantalla arranca en la medida principal y las siguientes como laterales", () => {
  let list = addScreen([], "LED Outdoor");
  assert.deepEqual({ w: list[0].width, h: list[0].height }, { w: 6, h: 4 }, "principal 6 × 4");
  list = addScreen(list, "LED Outdoor");
  assert.deepEqual({ w: list[1].width, h: list[1].height }, { w: 3, h: 2 }, "lateral 3 × 2");
  list = addScreen(list, "LED Outdoor");
  assert.deepEqual({ w: list[2].width, h: list[2].height }, { w: 3, h: 2 });
});

test("todas las medidas por defecto están en el desplegable", () => {
  assert.ok(isPreset(DEFAULT_MAIN));
  assert.ok(isPreset(DEFAULT_SIDE));
});

test("las pantallas nuevas no arrancan en modo personalizado", () => {
  assert.equal(addScreen([], "LED Outdoor")[0].custom, false);
});

test("elegir una medida de la lista sale del modo personalizado", () => {
  let list = setScreenCustom(base(), "screen-1", true);
  list = resizeScreen(list, "screen-1", "width", 1);       // 6,5 m: fuera del catálogo
  assert.equal(list[0].custom, true);
  list = setScreenSize(list, "screen-1", { width: 8, height: 5 });
  assert.equal(list[0].custom, false);
  assert.deepEqual({ w: list[0].width, h: list[0].height }, { w: 8, h: 5 });
});

test("pasar a personalizada conserva la medida como punto de partida", () => {
  const list = setScreenCustom(addScreen([], "LED Outdoor", { width: 8, height: 5 }), "screen-1", true);
  assert.deepEqual({ w: list[0].width, h: list[0].height }, { w: 8, h: 5 });
});

test("sólo se puede redimensionar en modo personalizado", () => {
  // El panel oculta los steppers, pero la regla vive en el modelo.
  const fixed = resizeScreen(base(), "screen-1", "width", 1);
  assert.equal(fixed[0].width, 6, "sin modo personalizado la medida no se mueve");
});

test("cambiar de tipo vuelve a una medida del catálogo", () => {
  let list = setScreenCustom(base(), "screen-1", true);
  list = resizeScreen(list, "screen-1", "width", 1);
  list = updateScreen(list, "screen-1", { kind: "E-Poster" });
  assert.equal(list[0].custom, false);
  list = updateScreen(list, "screen-1", { kind: "LED Indoor" });
  assert.equal(list[0].custom, false);
  assert.ok(isPreset(list[0]), "queda en una medida ofrecible");
});
