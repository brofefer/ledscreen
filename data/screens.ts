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
  /** La medida se ajusta a mano en vez de salir de la lista del catálogo. */
  custom: boolean;
};

export type ScreenSize = { width: number; height: number };

/** Medidas que la empresa arma habitualmente. Es lo que ofrece el desplegable. */
export const SCREEN_PRESETS: ScreenSize[] = [
  { width: 3, height: 2 },
  { width: 4, height: 2 },
  { width: 4, height: 2.5 },
  { width: 4, height: 3 },
  { width: 5, height: 3 },
  { width: 6, height: 3 },
  { width: 6, height: 4 },
  { width: 7, height: 4 },
  { width: 8, height: 5 },
  { width: 10, height: 4 },
  { width: 10, height: 5 },
  { width: 12, height: 6 },
];

/** La primera pantalla es la principal; las que se agregan después, laterales. */
export const DEFAULT_MAIN: ScreenSize = { width: 6, height: 4 };
export const DEFAULT_SIDE: ScreenSize = { width: 3, height: 2 };

export const sizeKey = (size: ScreenSize) => `${size.width}x${size.height}`;
export const isPreset = (size: ScreenSize) => SCREEN_PRESETS.some((preset) => preset.width === size.width && preset.height === size.height);

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

export function addScreen(list: ScreenItem[], kind: ScreenKind, size?: ScreenSize) {
  if (list.length >= MAX_SCREENS) return list;
  const measures = kind === "E-Poster"
    ? EPOSTER_SIZE
    : (size ?? (list.length === 0 ? DEFAULT_MAIN : DEFAULT_SIDE));
  return [...list, { id: freeId(list), kind, width: measures.width, height: measures.height, slot: freeSlot(list), custom: false }];
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
    if (patch.kind === "E-Poster") return { ...next, ...EPOSTER_SIZE, custom: false };
    if (patch.kind && item.kind === "E-Poster") return { ...next, ...DEFAULT_MAIN, custom: false };
    return next;
  });
}

/** Elegir una medida del desplegable sale del modo personalizado. */
export function setScreenSize(list: ScreenItem[], id: string, size: ScreenSize) {
  return list.map((item) => (item.id === id ? { ...item, ...size, custom: false } : item));
}

/** Al pasar a personalizada se conserva la medida actual como punto de partida. */
export function setScreenCustom(list: ScreenItem[], id: string, custom: boolean) {
  return list.map((item) => (item.id === id ? { ...item, custom } : item));
}

export const clampToStep = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(value / SIZE_STEP) * SIZE_STEP));

/**
 * Ajusta una medida respetando el paso de gabinete y los topes. Sólo aplica
 * en modo personalizado: una pantalla tomada del catálogo no puede terminar
 * con una medida que no está en la lista.
 */
export function resizeScreen(list: ScreenItem[], id: string, axis: "width" | "height", delta: number) {
  return list.map((item) => {
    if (item.id !== id || item.kind === "E-Poster" || !item.custom) return item;
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
