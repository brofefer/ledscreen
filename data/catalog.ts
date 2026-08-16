/**
 * Catálogo de equipos que se pueden sumar al escenario.
 *
 * El configurador guarda instancias con id propio y estable, no contadores.
 * Eso es lo que permite borrar la unidad que el visitante eligió y no la
 * última, y que las posiciones guardadas no se corran al eliminar una.
 */

import type { ItemSpec } from "./sceneItems";

export type ItemCategory = "sound" | "lighting";

export type CatalogEntry = {
  key: string;
  label: string;
  category: ItemCategory;
  /** Unidades que agrega el control de una sola vez. */
  defaultUnits: number;
  /** Tope de unidades que la escena sabe ubicar. */
  maxUnits: number;
};

export const CATALOG: CatalogEntry[] = [
  { key: "jbl-vrx", label: "JBL VRX", category: "sound", defaultUnits: 1, maxUnits: 8 },
  { key: "rcf-evox-j8", label: "RCF EVOX J8", category: "sound", defaultUnits: 1, maxUnits: 8 },
  { key: "rcf-ax15", label: "RCF AX15", category: "sound", defaultUnits: 1, maxUnits: 8 },
  { key: "sub-vrx", label: "SUB VRX", category: "sound", defaultUnits: 1, maxUnits: 8 },
  // Las luminarias tienen posiciones fijas sobre el truss o en el piso, así que
  // el tope coincide con la cantidad de ubicaciones que la escena tiene previstas.
  { key: "par-led", label: "PAR LED", category: "lighting", defaultUnits: 4, maxUnits: 4 },
  { key: "sharpy", label: "Sharpy", category: "lighting", defaultUnits: 4, maxUnits: 4 },
  { key: "strobe", label: "Strobe", category: "lighting", defaultUnits: 2, maxUnits: 2 },
  { key: "mirror-ball", label: "Globos Espejados", category: "lighting", defaultUnits: 3, maxUnits: 3 },
  { key: "pinspot", label: "Pines", category: "lighting", defaultUnits: 4, maxUnits: 4 },
];

const BY_KEY = new Map(CATALOG.map((entry) => [entry.key, entry]));

export const catalogEntry = (key: string) => BY_KEY.get(key);
export const catalogOf = (category: ItemCategory) => CATALOG.filter((entry) => entry.category === category);

/**
 * Serie dentro de la cual se reparten las ubicaciones por defecto.
 * El audio se alterna izquierda/derecha entre todas sus unidades, así que
 * comparte serie; cada tipo de luminaria tiene su propia fila de posiciones.
 */
export const placementGroup = (key: string) => (catalogEntry(key)?.category === "sound" ? "sound" : key);

/** Lo que las operaciones de `sceneItems` necesitan saber de una clave. */
export function itemSpec(key: string): ItemSpec | undefined {
  const entry = catalogEntry(key);
  if (!entry) return undefined;
  return { key: entry.key, group: placementGroup(key), defaultUnits: entry.defaultUnits, maxUnits: entry.maxUnits };
}
