/**
 * Resumen comercial y mensaje de WhatsApp.
 *
 * Vive fuera del componente y sin dependencias de React porque es lo que
 * finalmente le llega al cliente: conviene poder probarlo entero
 * (ver `tests/quote-message.test.mjs`).
 *
 * La forma del resumen sigue la del prototipo: una fila por ítem, con su
 * categoría, y el mensaje se arma agrupando esas mismas filas.
 */

export type QuoteCatalogEntry = { key: string; label: string; category: "sound" | "lighting" };

export type QuoteInput = {
  screen: { type: string; label: string; quantity: number };
  /** Unidades por clave de catálogo. */
  counts: Record<string, number>;
  extras: string[];
  /** Catálogo, para resolver etiquetas y respetar el orden de presentación. */
  catalog: QuoteCatalogEntry[];
};

export type SummaryRow = { category: "Pantalla" | "Sonido" | "Iluminación" | "Servicios"; label: string };

/** Texto corto de la pantalla elegida. */
export function screenLabelOf(screen: QuoteInput["screen"]) {
  if (screen.type === "E-Poster") {
    return `E-Poster 1×2 — ${screen.quantity} ${screen.quantity === 1 ? "tótem" : "tótems"}`;
  }
  return `${screen.type} — ${screen.label}`;
}

/** Una fila por ítem elegido, en el orden en que se muestran. */
export function summaryRows({ screen, counts, extras, catalog }: QuoteInput): SummaryRow[] {
  const rows: SummaryRow[] = [{ category: "Pantalla", label: screenLabelOf(screen) }];
  const units = (category: "sound" | "lighting") => catalog
    .filter((entry) => entry.category === category && (counts[entry.key] ?? 0) > 0)
    .map((entry) => `${entry.label} × ${counts[entry.key]}`);
  for (const label of units("sound")) rows.push({ category: "Sonido", label });
  for (const label of units("lighting")) rows.push({ category: "Iluminación", label });
  for (const label of extras) rows.push({ category: "Servicios", label });
  return rows;
}

/** Renglones del mensaje: una línea por categoría, con sus ítems juntos. */
export function quoteLines(input: QuoteInput) {
  const rows = summaryRows(input);
  const pick = (category: SummaryRow["category"]) => rows.filter((row) => row.category === category).map((row) => row.label);
  const lines = [`Pantalla: ${screenLabelOf(input.screen)}`];
  for (const category of ["Sonido", "Iluminación", "Servicios"] as const) {
    const picked = pick(category);
    if (picked.length) lines.push(`${category}: ${picked.join(", ")}`);
  }
  return lines;
}

export function quoteMessage(input: QuoteInput) {
  return `Hola LedScreen! Quiero cotizar este paquete:\n\n- ${quoteLines(input).join("\n- ")}\n\n¿Me pasan presupuesto? Gracias!`;
}

export function whatsappHref(phone: string, input: QuoteInput) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(quoteMessage(input))}`;
}
