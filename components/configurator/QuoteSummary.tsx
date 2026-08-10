type Config = { screen: { type: string; label: string; quantity: number }; sound: Record<string, number>; lighting: string[]; extras: string[] };

export default function QuoteSummary({ config }: { config: Config }) {
  const screenLabel = config.screen.type === "E-Poster" ? `E-Poster 1×2 — ${config.screen.quantity} ${config.screen.quantity === 1 ? "tótem" : "tótems"}` : `${config.screen.type} — ${config.screen.label}`;
  const lines = [`Pantalla: ${screenLabel}`];
  const soundItems = Object.entries(config.sound).filter(([, quantity]) => quantity > 0).map(([item, quantity]) => `${item} × ${quantity}`);
  if (soundItems.length) lines.push(`Sonido: ${soundItems.join(", ")}`);
  if (config.lighting.length) lines.push(`Iluminación: ${config.lighting.join(", ")}`);
  if (config.extras.length) lines.push(`Servicios: ${config.extras.join(", ")}`);
  const message = `Hola LedScreen! Quiero cotizar este paquete:\n\n- ${lines.join("\n- ")}\n\n¿Me pasan presupuesto? Gracias!`;
  return <aside className="quote-summary"><div><span>Tu configuración</span><strong>{screenLabel}</strong></div><a href={`https://wa.me/595981123456?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp →</a></aside>;
}
