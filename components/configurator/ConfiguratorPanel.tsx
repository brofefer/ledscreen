import { catalogOf } from "../../data/catalog";
import { MAX_SCREENS, SIZE_LIMITS, formatMeters, type ScreenItem, type ScreenKind } from "../../data/screens";
import { useState } from "react";

type Props = {
  config: { screens: ScreenItem[]; counts: Record<string, number>; extras: string[] };
  actions: {
    addScreen: (kind: ScreenKind) => void;
    removeScreen: (id: string) => void;
    setScreenKind: (id: string, kind: ScreenKind) => void;
    resizeScreen: (id: string, axis: "width" | "height", delta: number) => void;
    changeUnits: (key: string, delta: number) => void;
    toggleGroup: (key: string) => void;
    toggleExtra: (value: string) => void;
  };
};

const TYPES: Array<{ value: ScreenKind; label: string; description: string }> = [
  { value: "LED Outdoor", label: "LED Outdoor", description: "Eventos grandes y al aire libre. Resiste lluvia, máxima calidad." },
  { value: "LED Indoor", label: "LED Indoor", description: "Eventos más chicos y bajo techo." },
  { value: "E-Poster", label: "E-Poster 1×2", description: "Tótem vertical para accesos y stands." },
];
const EXTRAS = ["Consola DJ", "DJ", "Escenario", "Generador", "Micrófonos"];

function SizeStepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (delta: number) => void }) {
  return <div className="size-stepper">
    <span>{label}</span>
    <div>
      <button aria-label={`Reducir ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(-1)}>−</button>
      <strong>{formatMeters(value)} m</strong>
      <button aria-label={`Aumentar ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(1)}>+</button>
    </div>
  </div>;
}

function ScreenCard({ screen, index, canRemove, actions }: { screen: ScreenItem; index: number; canRemove: boolean; actions: Props["actions"] }) {
  const type = TYPES.find((option) => option.value === screen.kind);
  return <div className="screen-card">
    <div className="screen-card-head">
      <strong>Pantalla {index + 1}</strong>
      {canRemove && <button className="screen-card-remove" onClick={() => actions.removeScreen(screen.id)}>Eliminar</button>}
    </div>
    <div className="chips">{TYPES.map((option) => (
      <button key={option.value} className={screen.kind === option.value ? "chip active" : "chip"} aria-pressed={screen.kind === option.value} title={option.description} onClick={() => actions.setScreenKind(screen.id, option.value)}>{option.label}</button>
    ))}</div>
    <p className="screen-card-hint">{type?.description}</p>
    {screen.kind === "E-Poster"
      ? <p className="screen-card-fixed">Medida fija de 1 × 2 m.</p>
      : <div className="size-steppers">
        <SizeStepper label="Ancho" value={screen.width} min={SIZE_LIMITS.minWidth} max={SIZE_LIMITS.maxWidth} onChange={(delta) => actions.resizeScreen(screen.id, "width", delta)} />
        <SizeStepper label="Alto" value={screen.height} min={SIZE_LIMITS.minHeight} max={SIZE_LIMITS.maxHeight} onChange={(delta) => actions.resizeScreen(screen.id, "height", delta)} />
      </div>}
  </div>;
}

export default function ConfiguratorPanel({ config, actions }: Props) {
  const [category, setCategory] = useState<"screen" | "sound" | "lighting" | "extras">("screen");
  const sound = catalogOf("sound");
  const lighting = catalogOf("lighting");
  const full = config.screens.length >= MAX_SCREENS;
  return <div className="config-panel">
    <div className="eyebrow">CONFIGURACIÓN</div>
    <h2>Armá tu escenario</h2>
    <p>Elegí pantallas, sonido e iluminación y visualizá cómo podría verse tu montaje.</p>
    <div className="mobile-category-tabs" role="tablist">{[["screen", "Pantallas"], ["sound", "Sonido"], ["lighting", "Luces"], ["extras", "Extras"]].map(([key, label]) => <button role="tab" aria-selected={category === key} className={category === key ? "active" : ""} key={key} onClick={() => setCategory(key as typeof category)}>{label}</button>)}</div>

    <div className={`config-group mobile-pane ${category === "screen" ? "mobile-active" : ""}`}>
      <h3>Pantallas <small>{config.screens.length} de {MAX_SCREENS}</small></h3>
      <div className="screen-list">
        {config.screens.map((screen, index) => <ScreenCard key={screen.id} screen={screen} index={index} canRemove={config.screens.length > 1} actions={actions} />)}
      </div>
      <div className="add-screen">
        <span>Agregar</span>
        <div className="chips">{TYPES.map((option) => (
          <button key={option.value} className="chip" disabled={full} onClick={() => actions.addScreen(option.value)}>+ {option.label}</button>
        ))}</div>
        {full && <small>Llegaste al máximo de {MAX_SCREENS} pantallas.</small>}
      </div>
    </div>

    <div className={`config-group mobile-pane ${category === "sound" ? "mobile-active" : ""}`}><h3>Sonido <small>Cantidad por unidad</small></h3><div className="quantity-list">{sound.map((entry) => {
      const quantity = config.counts[entry.key] ?? 0;
      return <div className={quantity > 0 ? "quantity-item active" : "quantity-item"} key={entry.key}><span>{entry.label}</span><div><button aria-label={`Quitar ${entry.label}`} disabled={quantity === 0} onClick={() => actions.changeUnits(entry.key, -1)}>−</button><strong>{quantity}</strong><button aria-label={`Agregar ${entry.label}`} disabled={quantity >= entry.maxUnits} onClick={() => actions.changeUnits(entry.key, 1)}>+</button></div></div>;
    })}</div></div>

    <div className={`config-group mobile-pane ${category === "lighting" ? "mobile-active" : ""}`}><h3>Iluminación</h3><div className="chips">{lighting.map((entry) => {
      const on = (config.counts[entry.key] ?? 0) > 0;
      return <button key={entry.key} className={on ? "chip active" : "chip"} aria-pressed={on} onClick={() => actions.toggleGroup(entry.key)}>{entry.label}</button>;
    })}</div></div>

    <div className={`config-group mobile-pane ${category === "extras" ? "mobile-active" : ""}`}><h3>DJ y extras</h3><div className="chips">{EXTRAS.map((item) => <button key={item} className={config.extras.includes(item) ? "chip active" : "chip"} aria-pressed={config.extras.includes(item)} onClick={() => actions.toggleExtra(item)}>{item}</button>)}</div></div>
  </div>;
}
