/**
 * Lista de pantallas del escenario.
 *
 * Antes había una sola pantalla, con el E-Poster como caso especial que
 * llevaba su propia cantidad. Ahora cada pantalla es una instancia con su
 * tipo y su medida, y un tótem es simplemente una pantalla de 1 × 2 m: los
 * tres tótems del cliente son tres instancias, no un contador aparte.
 *
 * Módulo puro, sin dependencias (ver `tests/screens.test.mjs`).
 */

export type ScreenKind = "LED Outdoor" | "LED Indoor" | "E-Poster";

export type ScreenItem = {
  /** Estable durante toda la vida de la instancia. */
  id: string;
  kind: ScreenKind;
  width: number;
  height: number;
  /** Orden de colocación: 0 al centro, y de ahí alternando a los costados. */
  slot: number;
};

/** Más pantallas que esto no entran en cuadro ni se leen bien en el presupuesto. */
export const MAX_SCREENS = 6;

/** El tótem tiene medida fija. */
export const EPOSTER_SIZE = { width: 1, height: 2 };

/** Separación entre pantallas contiguas, en metros. */
export const SCREEN_GAP = 0.6;

/** Las pantallas LED se arman con gabinetes, así que la medida va de a pasos. */
export const SIZE_STEP = 0.5;
export const SIZE_LIMITS = { minWidth: 1, maxWidth: 12, minHeight: 1, maxHeight: 6 };

export const formatMeters = (value: number) => String(value).replace(".", ",");
export const screenSizeLabel = (screen: { width: number; height: number }) =>
  `${formatMeters(screen.width)} × ${formatMeters(screen.height)} m`;

function freeId(list: ScreenItem[]) {
  const used = new Set(list.map((item) => item.id));
  let n = 1;
  while (used.has(`screen-${n}`)) n += 1;
  return `screen-${n}`;
}

function freeSlot(list: ScreenItem[]) {
  const used = new Set(list.map((item) => item.slot));
  let slot = 0;
  while (used.has(slot)) slot += 1;
  return slot;
}

export function addScreen(list: ScreenItem[], kind: ScreenKind, size?: { width: number; height: number }) {
  if (list.length >= MAX_SCREENS) return list;
  const measures = kind === "E-Poster" ? EPOSTER_SIZE : (size ?? { width: 6, height: 4 });
  return [...list, { id: freeId(list), kind, width: measures.width, height: measures.height, slot: freeSlot(list) }];
}

/** Nunca deja el escenario sin ninguna pantalla. */
export function removeScreen(list: ScreenItem[], id: string) {
  if (list.length <= 1) return list;
  return list.filter((item) => item.id !== id);
}

export function updateScreen(list: ScreenItem[], id: string, patch: Partial<Pick<ScreenItem, "kind" | "width" | "height">>) {
  return list.map((item) => {
    if (item.id !== id) return item;
    const next = { ...item, ...patch };
    // Cambiar a tótem impone la medida fija; salir de tótem recupera una medida usable.
    if (patch.kind === "E-Poster") return { ...next, ...EPOSTER_SIZE };
    if (patch.kind && item.kind === "E-Poster") return { ...next, width: 6, height: 4 };
    return next;
  });
}

export const clampToStep = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(value / SIZE_STEP) * SIZE_STEP));

/** Ajusta una medida respetando el paso de gabinete y los topes. */
export function resizeScreen(list: ScreenItem[], id: string, axis: "width" | "height", delta: number) {
  return list.map((item) => {
    if (item.id !== id || item.kind === "E-Poster") return item;
    const limits = axis === "width"
      ? [SIZE_LIMITS.minWidth, SIZE_LIMITS.maxWidth]
      : [SIZE_LIMITS.minHeight, SIZE_LIMITS.maxHeight];
    return { ...item, [axis]: clampToStep(item[axis] + delta * SIZE_STEP, limits[0], limits[1]) };
  });
}

/**
 * Disposición por defecto: la primera al centro y las siguientes alternando
 * izquierda y derecha, sin superponerse. Es el punto de partida; después cada
 * pantalla se puede mover a mano en la escena.
 */
export function layoutScreens(list: ScreenItem[], gap = SCREEN_GAP) {
  const ordered = [...list].sort((a, b) => a.slot - b.slot);
  if (!ordered.length) return [] as Array<{ item: ScreenItem; x: number }>;
  const placed = [{ item: ordered[0], x: 0 }];
  let leftEdge = -ordered[0].width / 2;
  let rightEdge = ordered[0].width / 2;
  ordered.slice(1).forEach((item, index) => {
    if (index % 2 === 0) {
      const x = leftEdge - gap - item.width / 2;
      leftEdge = x - item.width / 2;
      placed.push({ item, x });
    } else {
      const x = rightEdge + gap + item.width / 2;
      rightEdge = x + item.width / 2;
      placed.push({ item, x });
    }
  });
  return placed;
}

/** Ancho total que ocupan las pantallas. Es lo que dimensiona tarima, truss y cámara. */
export function stageSpanOf(list: ScreenItem[], gap = SCREEN_GAP) {
  const placed = layoutScreens(list, gap);
  if (!placed.length) return 0;
  const left = Math.min(...placed.map(({ item, x }) => x - item.width / 2));
  const right = Math.max(...placed.map(({ item, x }) => x + item.width / 2));
  return right - left;
}

/** Alto de la pantalla más alta: define dónde va el truss. */
export const tallestOf = (list: ScreenItem[]) => list.reduce((tallest, item) => Math.max(tallest, item.height), 0);
