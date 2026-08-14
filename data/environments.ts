/**
 * Ambientes del escenario 3D.
 *
 * La escena arrancaba siempre en penumbra con niebla cerrada, y eso la hacía
 * leer como discoteca aunque no hubiera ni una luminaria puesta. Cada ambiente
 * cambia fondo, niebla, luces, piso y tarima en conjunto: con tocar sólo el
 * color de fondo no alcanzaba.
 *
 * Es una decisión de presentación, no entra en el presupuesto.
 */

export type EnvironmentKey = "salon" | "outdoor" | "party";

export type SceneEnvironment = {
  key: EnvironmentKey;
  label: string;
  /** Texto corto para la barra del visor. */
  hint: string;
  background: string;
  fog: { color: string; near: number; far: number };
  hemisphere: { sky: string; ground: string; intensity: number };
  sun: { color: string; intensity: number; position: [number, number, number] };
  /** Relleno frontal para que los equipos no queden en silueta. */
  fill: { color: string; intensity: number };
  ground: { color: string; roughness: number };
  stage: { color: string; roughness: number };
  /** Sombra de contacto bajo los objetos. */
  contactShadow: number;
  /** Salón cerrado: se dibujan paredes y techo. */
  room: boolean;
  /** Exterior: se dibuja la cúpula de cielo. */
  sky: boolean;
};

export const ENVIRONMENTS: SceneEnvironment[] = [
  {
    key: "salon",
    label: "Salón de actos",
    hint: "Bajo techo, luz pareja",
    background: "#8a8378",
    fog: { color: "#8a8378", near: 26, far: 72 },
    hemisphere: { sky: "#f2ede4", ground: "#3a3730", intensity: 1 },
    sun: { color: "#fff6e8", intensity: 1.35, position: [4, 10, 6] },
    fill: { color: "#e8e4dc", intensity: 0.45 },
    ground: { color: "#33313b", roughness: 0.92 },
    stage: { color: "#2b2a31", roughness: 0.78 },
    contactShadow: 0.42,
    room: true,
    sky: false,
  },
  {
    key: "outdoor",
    label: "Aire libre",
    hint: "Exterior, luz de día",
    background: "#9cc7e6",
    fog: { color: "#b3cfe2", near: 42, far: 115 },
    hemisphere: { sky: "#bfe0ff", ground: "#4a4a42", intensity: 1.45 },
    sun: { color: "#fff8ec", intensity: 2.6, position: [8, 14, 6] },
    fill: { color: "#dceaf6", intensity: 0.3 },
    ground: { color: "#45484d", roughness: 0.95 },
    stage: { color: "#2f323a", roughness: 0.8 },
    contactShadow: 0.6,
    room: false,
    sky: true,
  },
  {
    key: "party",
    label: "Fiesta",
    hint: "Nocturno, para lucir luces",
    background: "#090c12",
    fog: { color: "#090c12", near: 17, far: 34 },
    hemisphere: { sky: "#d8f3ff", ground: "#11131a", intensity: 0.85 },
    sun: { color: "#ffffff", intensity: 2.1, position: [5, 10, 7] },
    fill: { color: "#9fd8ff", intensity: 0.15 },
    ground: { color: "#0f1218", roughness: 0.88 },
    stage: { color: "#20232b", roughness: 0.72 },
    contactShadow: 0.55,
    room: false,
    sky: false,
  },
];

export const DEFAULT_ENVIRONMENT: EnvironmentKey = "salon";

const BY_KEY = new Map(ENVIRONMENTS.map((environment) => [environment.key, environment]));

export const environmentOf = (key: EnvironmentKey) => BY_KEY.get(key) ?? BY_KEY.get(DEFAULT_ENVIRONMENT)!;
