export type EventProfileKey = "corporate" | "social" | "institutional" | "festival" | "free";

export type EventProfile = {
  key: EventProfileKey;
  label: string;
  description: string;
};

export const EVENT_PROFILES: EventProfile[] = [
  { key: "corporate", label: "Corporativo", description: "Presentaciones, congresos y lanzamientos." },
  { key: "social", label: "Social", description: "Bodas, cumpleaños y celebraciones." },
  { key: "institutional", label: "Institucional", description: "Actos oficiales, educativos y gubernamentales." },
  { key: "festival", label: "Festival", description: "Conciertos y producciones al aire libre." },
  { key: "free", label: "Otro evento", description: "Una producción diferente o todavía por definir." },
];

export const DEFAULT_EVENT_PROFILE: EventProfileKey = "corporate";

export const eventProfileOf = (key: EventProfileKey) => EVENT_PROFILES.find((profile) => profile.key === key) ?? EVENT_PROFILES[0];
