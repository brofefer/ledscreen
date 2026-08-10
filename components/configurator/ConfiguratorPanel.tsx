import { SCREEN_SIZES } from "../../data/screenSizes";
import type { ScreenType } from "../../hooks/useConfigurator";
import { useState } from "react";

type Props = {
  config: { screen: { type: ScreenType; quantity: number }; sound: Record<string, number>; lighting: string[]; extras: string[] };
  sizeIndex: number;
  eposterQuantity: number;
  actions: {
    setScreenType: (value: ScreenType) => void;
    setSizeIndex: (value: number) => void;
    setEposterQuantity: (value: number) => void;
    changeSoundQuantity: (value: string, delta: number) => void;
    toggleLighting: (value: string) => void;
    toggleExtra: (value: string) => void;
  };
};

const TYPES: Array<{ value: ScreenType; label: string; description: string }> = [
  { value: "LED Outdoor", label: "LED Outdoor", description: "Eventos grandes y al aire libre. Resiste lluvia, máxima calidad." },
  { value: "LED Indoor", label: "LED Indoor", description: "Eventos más chicos y bajo techo." },
  { value: "E-Poster", label: "E-Poster 1×2", description: "Tótem vertical para accesos y stands." },
];
const SOUND = ["JBL VRX", "RCF EVOX J8", "RCF AX15", "SUB VRX"];
const LIGHTING = ["PAR LED", "Sharpy", "Strobe"];
const EXTRAS = ["Consola DJ", "DJ", "Escenario", "Generador", "Micrófonos"];

function Chips({ items, selected, toggle }: { items: string[]; selected: string[]; toggle: (item: string) => void }) {
  return <div className="chips">{items.map((item) => <button key={item} className={selected.includes(item) ? "chip active" : "chip"} aria-pressed={selected.includes(item)} onClick={() => toggle(item)}>{item}</button>)}</div>;
}

function QuantityControls({ items, quantities, change }: { items: string[]; quantities: Record<string, number>; change: (item: string, delta: number) => void }) {
  return <div className="quantity-list">{items.map((item) => <div className={(quantities[item] ?? 0) > 0 ? "quantity-item active" : "quantity-item"} key={item}><span>{item}</span><div><button aria-label={`Quitar ${item}`} disabled={!quantities[item]} onClick={() => change(item, -1)}>−</button><strong>{quantities[item] ?? 0}</strong><button aria-label={`Agregar ${item}`} onClick={() => change(item, 1)}>+</button></div></div>)}</div>;
}

export default function ConfiguratorPanel({ config, sizeIndex, eposterQuantity, actions }: Props) {
  const [category, setCategory] = useState<"screen" | "sound" | "lighting" | "extras">("screen");
  return <div className="config-panel">
    <div className="eyebrow">CONFIGURACIÓN</div>
    <h2>Armá tu escenario</h2>
    <p>Elegí pantalla, sonido e iluminación y visualizá cómo podría verse tu montaje.</p>
    <div className="mobile-category-tabs" role="tablist">{[["screen", "Pantalla"], ["sound", "Sonido"], ["lighting", "Luces"], ["extras", "Extras"]].map(([key, label]) => <button role="tab" aria-selected={category === key} className={category === key ? "active" : ""} key={key} onClick={() => setCategory(key as typeof category)}>{label}</button>)}</div>
    <div className={`config-group mobile-pane ${category === "screen" ? "mobile-active" : ""}`}><h3>Pantalla</h3><div className="screen-type-cards">{TYPES.map((type) => <button key={type.value} className={config.screen.type === type.value ? "screen-type-card active" : "screen-type-card"} aria-pressed={config.screen.type === type.value} onClick={() => actions.setScreenType(type.value)}><strong>{type.label}</strong><span>{type.description}</span></button>)}</div></div>
    {config.screen.type !== "E-Poster" ? <div className={`config-group mobile-pane ${category === "screen" ? "mobile-active" : ""}`}><h3>Medida (m)</h3><div className="chips measures">{SCREEN_SIZES.map((size, index) => <button key={size.label} className={sizeIndex === index ? "chip active" : "chip"} aria-pressed={sizeIndex === index} onClick={() => actions.setSizeIndex(index)}>{size.label}</button>)}</div></div> : <div className={`config-group mobile-pane ${category === "screen" ? "mobile-active" : ""}`}><h3>Medida del tótem</h3><div className="chips"><button className="chip active" aria-pressed="true">1 × 2 m</button></div><h3 className="eposter-quantity-title">Cantidad de tótems</h3><div className="chips">{[1, 2, 3, 4].map((quantity) => <button key={quantity} className={eposterQuantity === quantity ? "chip active" : "chip"} aria-pressed={eposterQuantity === quantity} onClick={() => actions.setEposterQuantity(quantity)}>{quantity} {quantity === 1 ? "tótem" : "tótems"}</button>)}</div></div>}
    <div className={`config-group mobile-pane ${category === "sound" ? "mobile-active" : ""}`}><h3>Sonido <small>Cantidad por unidad</small></h3><QuantityControls items={SOUND} quantities={config.sound} change={actions.changeSoundQuantity} /></div>
    <div className={`config-group mobile-pane ${category === "lighting" ? "mobile-active" : ""}`}><h3>Iluminación</h3><Chips items={LIGHTING} selected={config.lighting} toggle={actions.toggleLighting} /></div>
    <div className={`config-group mobile-pane ${category === "extras" ? "mobile-active" : ""}`}><h3>DJ y extras</h3><Chips items={EXTRAS} selected={config.extras} toggle={actions.toggleExtra} /></div>
  </div>;
}
