import type { PlacementZone } from "./placementZones";

export type EquipmentDefinition = {
  key: string;
  label: string;
  kind: "line-array" | "column" | "speaker" | "subwoofer" | "console" | "dj";
  zones: PlacementZone[];
  paired: boolean;
  modelPath: string;
  height: number;
};

export const EQUIPMENT: Record<string, EquipmentDefinition> = {
  "JBL VRX": { key: "jbl-vrx", label: "JBL VRX", kind: "line-array", zones: ["LEFT_PA", "RIGHT_PA"], paired: false, modelPath: "/models/jbl-vrx.glb", height: 2.35 },
  "RCF EVOX J8": { key: "rcf-evox-j8", label: "RCF EVOX J8", kind: "column", zones: ["LEFT_PA", "RIGHT_PA"], paired: false, modelPath: "/models/rcf-evox-j8.glb", height: 2.15 },
  "RCF AX15": { key: "rcf-ax15", label: "RCF AX15", kind: "speaker", zones: ["LEFT_PA", "RIGHT_PA"], paired: false, modelPath: "/models/rcf-ax15.glb", height: 1.75 },
  "SUB VRX": { key: "sub-vrx", label: "SUB VRX", kind: "subwoofer", zones: ["LEFT_PA", "RIGHT_PA"], paired: false, modelPath: "/models/sub-vrx.glb", height: .62 },
  "Consola DJ": { key: "dj-console", label: "Consola DJ", kind: "console", zones: ["DJ_AREA"], paired: false, modelPath: "/models/dj-console.glb", height: 1.02 },
  "DJ": { key: "dj", label: "DJ", kind: "dj", zones: ["DJ_AREA"], paired: false, modelPath: "/models/dj-person.glb", height: 1.76 },
};
