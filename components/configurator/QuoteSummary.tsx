import { catalogOf } from "../../data/catalog";

type Config = { screen: { type: string; label: string; quantity: number }; counts: Record<string, number>; extras: string[] };

/** Lista "Etiqueta × N" para las categorías que se cuentan por unidad. */
function unitList(category: "sound" | "lighting", counts: Record<string, number>) {
  return catalogOf(category)
    .filter((entry) => (counts[entry.key] ?? 0) > 0)
    .map((entry) => `${entry.label} × ${counts[entry.key]}`);
}

export default function QuoteSummary({ config }: { config: Config }) {
  const screenLabel = config.screen.type === "E-Poster" ? `E-Poster 1×2 — ${config.screen.quantity} ${config.screen.quantity === 1 ? "tótem" : "tótems"}` : `${config.screen.type} — ${config.screen.label}`;
  const lines = [`Pantalla: ${screenLabel}`];
  const sound = unitList("sound", config.counts);
  const lighting = unitList("lighting", config.counts);
  if (sound.length) lines.push(`Sonido: ${sound.join(", ")}`);
  if (lighting.length) lines.push(`Iluminación: ${lighting.join(", ")}`);
  if (config.extras.length) lines.push(`Servicios: ${config.extras.join(", ")}`);
  const message = `Hola LedScreen! Quiero cotizar este paquete:\n\n- ${lines.join("\n- ")}\n\n¿Me pasan presupuesto? Gracias!`;
  return <aside className="quote-summary"><div><span>Tu configuración</span><strong>{screenLabel}</strong></div><a href={`https://wa.me/595981123456?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp →</a></aside>;
}
