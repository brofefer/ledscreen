/**
 * Operaciones puras sobre la lista de instancias del escenario.
 *
 * Se mantienen fuera del hook a propósito: son la lógica donde vivían los
 * errores de borrado, así que conviene poder probarlas sin montar React
 * (ver `tests/scene-items.test.mjs`). El módulo no importa nada: recibe la
 * especificación del ítem y cada instancia carga su propio grupo, así que
 * no necesita consultar el catálogo.
 *
 * Todas devuelven una lista nueva y son idempotentes, porque corren dentro
 * del updater de setState, que React puede invocar dos veces en desarrollo.
 */

export type SceneItem = {
  /** Estable durante toda la vida de la instancia: es lo que permite borrar la que se eligió. */
  id: string;
  /** Clave del catálogo. */
  key: string;
  /** Hueco de colocación por defecto; no se corre al borrar otra unidad. */
  slot: number;
  /** Serie de huecos que comparte. El audio comparte una sola; cada luminaria la suya. */
  group: string;
};

export type ItemSpec = {
  key: string;
  group: string;
  /** Unidades que agrega el control de una sola vez. */
  defaultUnits: number;
  /** Tope de unidades que la escena sabe ubicar. */
  maxUnits: number;
};

/** Menor id libre para esa clave. Reutiliza huecos para no crecer sin límite. */
export function freeId(list: SceneItem[], key: string) {
  const used = new Set(list.filter((item) => item.key === key).map((item) => item.id));
  let n = 1;
  while (used.has(`${key}-${n}`)) n += 1;
  return `${key}-${n}`;
}

/** Menor hueco de colocación libre dentro de la serie. */
export function freeSlot(list: SceneItem[], group: string) {
  const used = new Set(list.filter((item) => item.group === group).map((item) => item.slot));
  let slot = 0;
  while (used.has(slot)) slot += 1;
  return slot;
}

export function addUnits(list: SceneItem[], spec: ItemSpec, units: number) {
  const next = [...list];
  for (let added = 0; added < units; added += 1) {
    if (next.filter((item) => item.key === spec.key).length >= spec.maxUnits) break;
    next.push({ id: freeId(next, spec.key), key: spec.key, slot: freeSlot(next, spec.group), group: spec.group });
  }
  return next;
}

/** Borra exactamente esa instancia. Las demás conservan id y hueco. */
export function removeUnit(list: SceneItem[], id: string) {
  return list.filter((item) => item.id !== id);
}

export function removeGroup(list: SceneItem[], key: string) {
  return list.filter((item) => item.key !== key);
}

/** Suma unidades, o quita las últimas, desde los controles del panel. */
export function changeUnits(list: SceneItem[], spec: ItemSpec, delta: number) {
  if (delta > 0) return addUnits(list, spec, delta);
  const matching = list.filter((item) => item.key === spec.key);
  const dropping = new Set(matching.slice(Math.max(0, matching.length + delta)).map((item) => item.id));
  return list.filter((item) => !dropping.has(item.id));
}

/** Enciende el grupo completo con su cantidad por defecto, o lo apaga entero. */
export function toggleGroup(list: SceneItem[], spec: ItemSpec) {
  if (list.some((item) => item.key === spec.key)) return removeGroup(list, spec.key);
  return addUnits(list, spec, spec.defaultUnits);
}

export function countsOf(list: SceneItem[]) {
  const totals: Record<string, number> = {};
  for (const item of list) totals[item.key] = (totals[item.key] ?? 0) + 1;
  return totals;
}
