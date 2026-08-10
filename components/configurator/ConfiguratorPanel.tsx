import { catalogOf } from "../../data/catalog";
import { SCREEN_SIZES } from "../../data/screenSizes";
import type { ScreenType } from "../../hooks/useConfigurator";
import { useState } from "react";

type Props = {
  config: { screen: { type: ScreenType; quantity: number }; counts: Record<string, number>; extras: string[] };
  sizeIndex: number;
  eposterQuantity: number;
  actions: {
    setScreenType: (value: ScreenType) => void;
    setSizeIndex: (value: number) => void;
    setEposterQuantity: (value: number) => void;
    changeUnits: (key: string, delta: number) => void;
    toggleGroup: (key: string) => void;
    toggleExtra: (value: string) => void;
  };
};

const TYPES: Array<{ value: ScreenType; label: string; description: string }> = [
  { value: "LED Outdoor", label: "LED Outdoor", description: "Eventos grandes y al aire libre. Resiste lluvia, máxima calidad." },
  { value: "LED Indoor", label: "LED Indoor", description: "Eventos más chicos y bajo techo." },
  { value: "E-Poster", label: "E-Poster 1×2", description: "Tótem vertical para accesos y stands." },
];
const EXTRAS = ["Consola DJ", "DJ", "Escenario", "Generador", "Micrófonos"];

export default function ConfiguratorPanel({ config, sizeIndex, eposterQuantity, actions }: Props) {
  const [category, setCategory] = useState<"screen" | "sound" | "lighting" | "extras">("screen");
  const sound = catalogOf("sound");
  const lighting = catalogOf("lighting");
  return <div className="config-panel">
    <div className="eyebrow">CONFIGURACIÓN</div>
    <h2>Armá tu escenario</h2>
    <p>Elegí pantalla, sonido e iluminación y visualizá cómo podría verse tu montaje.</p>
    <div className="mobile-category-tabs" role="tablist">{[["screen", "Pantalla"], ["sound", "Sonido"], ["lighting", "Luces"], ["extras", "Extras"]].map(([key, label]) => <button role="tab" aria-selected={category === key} className={category === key ? "active" : ""} key={key} onClick={() => setCategory(key as typeof category)}>{label}</button>)}</div>
    <div className={`config-group mobile-pane ${category === "screen" ? "mobile-active" : ""}`}><h3>Pantalla</h3><div className="screen-type-cards">{TYPES.map((type) => <button key={type.value} className={config.screen.type === type.value ? "screen-type-card active" : "screen-type-card"} aria-pressed={config.screen.type === type.value} onClick={() => actions.setScreenType(type.value)}><strong>{type.label}</strong><span>{type.description}</span></button>)}</div></div>
    {config.screen.type !== "E-Poster" ? <div className={`config-group mobile-pane ${category === "screen" ? "mobile-active" : ""}`}><h3>Medida (m)</h3><div className="chips measures">{SCREEN_SIZES.map((size, index) => <button key={size.label} className={sizeIndex === index ? "chip active" : "chip"} aria-pressed={sizeIndex === index} onClick={() => actions.setSizeIndex(index)}>{size.label}</button>)}</div></div> : <div className={`config-group mobile-pane ${category === "screen" ? "mobile-active" : ""}`}><h3>Medida del tótem</h3><div className="chips"><button className="chip active" aria-pressed={true}>1 × 2 m</button></div><h3 className="eposter-quantity-title">Cantidad de tótems</h3><div className="chips">{[1, 2, 3, 4].map((quantity) => <button key={quantity} className={eposterQuantity === quantity ? "chip active" : "chip"} aria-pressed={eposterQuantity === quantity} onClick={() => actions.setEposterQuantity(quantity)}>{quantity} {quantity === 1 ? "tótem" : "tótems"}</button>)}</div></div>}
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
