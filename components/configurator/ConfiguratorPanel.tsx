import { catalogOf } from "../../data/catalog";
import {
  MAX_SCREENS, SCREEN_PRESETS, SIZE_LIMITS,
  formatMeters, screenSizeLabel, sizeKey,
  type ScreenItem, type ScreenKind, type ScreenSize,
} from "../../data/screens";
import { useState } from "react";
import { EVENT_PROFILES, type EventProfileKey } from "../../data/eventProfiles";
import { useTranslate } from "../LanguageContext";

type Props = {
  config: { screens: ScreenItem[]; counts: Record<string, number>; extras: string[]; eventProfile: EventProfileKey };
  actions: {
    addScreen: (kind: ScreenKind) => void;
    removeScreen: (id: string) => void;
    setScreenKind: (id: string, kind: ScreenKind) => void;
    setScreenSize: (id: string, size: ScreenSize) => void;
    setScreenCustom: (id: string, custom: boolean) => void;
    resizeScreen: (id: string, axis: "width" | "height", delta: number) => void;
    changeUnits: (key: string, delta: number) => void;
    toggleGroup: (key: string) => void;
    toggleExtra: (value: string) => void;
    setEventProfile: (profile: EventProfileKey) => void;
  };
};

const CUSTOM = "custom";

const TYPES: Array<{ value: ScreenKind; label: string; description: string }> = [
  { value: "LED Outdoor", label: "LED Outdoor", description: "Eventos grandes y al aire libre. Resiste lluvia, máxima calidad." },
  { value: "LED Indoor", label: "LED Indoor", description: "Eventos más chicos y bajo techo." },
  { value: "E-Poster", label: "E-Poster 1×2", description: "Tótem vertical para accesos y stands." },
];
const EXTRAS = ["Consola DJ", "DJ", "Escenario", "Generador", "Micrófonos"];

function SizeStepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (delta: number) => void }) {
  const tx = useTranslate();
  return <div className="size-stepper">
    <span>{tx(label)}</span>
    <div>
      <button aria-label={`${tx("Quitar")} ${tx(label).toLowerCase()}`} disabled={value <= min} onClick={() => onChange(-1)}>−</button>
      <strong>{formatMeters(value)} m</strong>
      <button aria-label={`${tx("Agregar")} ${tx(label).toLowerCase()}`} disabled={value >= max} onClick={() => onChange(1)}>+</button>
    </div>
  </div>;
}

function ScreenCard({ screen, index, canRemove, actions }: { screen: ScreenItem; index: number; canRemove: boolean; actions: Props["actions"] }) {
  const tx = useTranslate();
  const type = TYPES.find((option) => option.value === screen.kind);
  return <div className="screen-card">
    <div className="screen-card-head">
      <strong>{tx("Pantalla")} {index + 1}</strong>
      {canRemove && <button className="screen-card-remove" onClick={() => actions.removeScreen(screen.id)}>{tx("Eliminar")}</button>}
    </div>
    <div className="chips">{TYPES.map((option) => (
      <button key={option.value} className={screen.kind === option.value ? "chip active" : "chip"} aria-pressed={screen.kind === option.value} title={tx(option.description)} onClick={() => actions.setScreenKind(screen.id, option.value)}>{option.label}</button>
    ))}</div>
    <p className="screen-card-hint">{type ? tx(type.description) : ""}</p>
    {screen.kind === "E-Poster"
      ? <p className="screen-card-fixed">{tx("Medida fija de 1 × 2 m.")}</p>
      : <div className="screen-size">
        <label>
          <span>{tx("Medida")}</span>
          <select
            value={screen.custom ? CUSTOM : sizeKey(screen)}
            onChange={(event) => {
              if (event.target.value === CUSTOM) { actions.setScreenCustom(screen.id, true); return; }
              const preset = SCREEN_PRESETS.find((option) => sizeKey(option) === event.target.value);
              if (preset) actions.setScreenSize(screen.id, preset);
            }}
          >
            {SCREEN_PRESETS.map((preset) => <option key={sizeKey(preset)} value={sizeKey(preset)}>{screenSizeLabel(preset)}</option>)}
            {/* Una medida a medida no está en la lista: se muestra igual para no perderla. */}
            {screen.custom && <option value={CUSTOM}>{tx("Personalizada")} — {screenSizeLabel(screen)}</option>}
            {!screen.custom && <option value={CUSTOM}>{tx("Personalizada")}…</option>}
          </select>
        </label>
        {screen.custom && <div className="size-steppers">
          <SizeStepper label="Ancho" value={screen.width} min={SIZE_LIMITS.minWidth} max={SIZE_LIMITS.maxWidth} onChange={(delta) => actions.resizeScreen(screen.id, "width", delta)} />
          <SizeStepper label="Alto" value={screen.height} min={SIZE_LIMITS.minHeight} max={SIZE_LIMITS.maxHeight} onChange={(delta) => actions.resizeScreen(screen.id, "height", delta)} />
        </div>}
      </div>}
  </div>;
}

export default function ConfiguratorPanel({ config, actions }: Props) {
  const tx = useTranslate();
  const [category, setCategory] = useState<"screen" | "sound" | "lighting" | "extras">("screen");
  const sound = catalogOf("sound");
  const lighting = catalogOf("lighting");
  const full = config.screens.length >= MAX_SCREENS;
  return <div className="config-panel">
    <div className="event-profile-picker">
      <span>{tx("¿Qué tipo de evento estás preparando?")}</span>
      <div>{EVENT_PROFILES.map((profile) => <button key={profile.key} className={config.eventProfile === profile.key ? "active" : ""} aria-pressed={config.eventProfile === profile.key} title={tx(profile.description)} onClick={() => actions.setEventProfile(profile.key)}>{tx(profile.label)}</button>)}</div>
      <small>{tx(EVENT_PROFILES.find((profile) => profile.key === config.eventProfile)?.description ?? "")} {tx("Se incluirá en tu solicitud de presupuesto.")}</small>
    </div>
    <div className="mobile-category-tabs" role="tablist">{[["screen", "Pantallas"], ["sound", "Sonido"], ["lighting", "Luces"], ["extras", "Extras"]].map(([key, label]) => <button role="tab" aria-selected={category === key} className={category === key ? "active" : ""} key={key} onClick={() => setCategory(key as typeof category)}>{tx(label)}</button>)}</div>

    <div className={`config-group mobile-pane ${category === "screen" ? "mobile-active" : ""}`}>
      <h3>{tx("Pantallas")} <small>{config.screens.length} / {MAX_SCREENS}</small></h3>
      <div className="screen-list">
        {config.screens.map((screen, index) => <ScreenCard key={screen.id} screen={screen} index={index} canRemove={config.screens.length > 1} actions={actions} />)}
      </div>
      <div className="add-screen">
        <span>{tx("Agregar")}</span>
        <div className="chips">{TYPES.map((option) => (
          <button key={option.value} className="chip" disabled={full} onClick={() => actions.addScreen(option.value)}>+ {option.label}</button>
        ))}</div>
        {full && <small>{MAX_SCREENS} {tx("Pantallas")}</small>}
      </div>
    </div>

    <div className={`config-group mobile-pane ${category === "sound" ? "mobile-active" : ""}`}><h3>{tx("Sonido")} <small>{tx("Cantidad por unidad")}</small></h3><div className="quantity-list">{sound.map((entry) => {
      const quantity = config.counts[entry.key] ?? 0;
      return <div className={quantity > 0 ? "quantity-item active" : "quantity-item"} key={entry.key}><span>{tx(entry.label)}</span><div><button aria-label={`${tx("Quitar")} ${tx(entry.label)}`} disabled={quantity === 0} onClick={() => actions.changeUnits(entry.key, -1)}>−</button><strong>{quantity}</strong><button aria-label={`${tx("Agregar")} ${tx(entry.label)}`} disabled={quantity >= entry.maxUnits} onClick={() => actions.changeUnits(entry.key, 1)}>+</button></div></div>;
    })}</div></div>

    <div className={`config-group mobile-pane ${category === "lighting" ? "mobile-active" : ""}`}><h3>{tx("Iluminación")}</h3><div className="chips">{lighting.map((entry) => {
      const on = (config.counts[entry.key] ?? 0) > 0;
      return <button key={entry.key} className={on ? "chip active" : "chip"} aria-pressed={on} onClick={() => actions.toggleGroup(entry.key)}>{tx(entry.label)}</button>;
    })}</div><p className="lighting-reference-note">{tx("La cantidad de equipos se determinará al preparar el presupuesto. La cantidad visualizada en el escenario es solo de referencia.")}</p></div>

    <div className={`config-group mobile-pane ${category === "extras" ? "mobile-active" : ""}`}><h3>{tx("DJ y extras")}</h3><div className="chips">{EXTRAS.map((item) => <button key={item} className={config.extras.includes(item) ? "chip active" : "chip"} aria-pressed={config.extras.includes(item)} onClick={() => actions.toggleExtra(item)}>{tx(item)}</button>)}</div></div>
  </div>;
}
