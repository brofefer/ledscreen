/**
 * Geometría de cada equipo dentro de la escena, indexada por la clave del
 * catálogo (ver `data/catalog.ts`). Antes estaba indexada por etiqueta, lo que
 * obligaba a mapear etiqueta -> clave en varios puntos y era la fuente de los
 * errores al borrar instancias.
 */
export type EquipmentDefinition = {
  key: string;
  label: string;
  kind: "line-array" | "column" | "speaker" | "subwoofer" | "console" | "dj";
  /** Ruta del GLB para cuando se reemplacen los placeholders geométricos. */
  modelPath: string;
  /** Altura física en metros. */
  height: number;
};

export const EQUIPMENT: Record<string, EquipmentDefinition> = {
  "jbl-vrx": { key: "jbl-vrx", label: "JBL VRX", kind: "line-array", modelPath: "/models/jbl-vrx.glb", height: 2.35 },
  "rcf-evox-j8": { key: "rcf-evox-j8", label: "RCF EVOX J8", kind: "column", modelPath: "/models/rcf-evox-j8.glb", height: 2.15 },
  "rcf-ax15": { key: "rcf-ax15", label: "RCF AX15", kind: "speaker", modelPath: "/models/rcf-ax15.glb", height: 1.75 },
  "sub-vrx": { key: "sub-vrx", label: "SUB VRX", kind: "subwoofer", modelPath: "/models/sub-vrx.glb", height: .62 },
  "dj-console": { key: "dj-console", label: "Consola DJ", kind: "console", modelPath: "/models/dj-console.glb", height: 1.02 },
  "dj": { key: "dj", label: "DJ", kind: "dj", modelPath: "/models/dj-person.glb", height: 1.76 },
};
