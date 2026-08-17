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
export type QuoteScreen = { kind: string; width: number; height: number };

export type QuoteInput = {
  eventProfile?: string;
  screens: QuoteScreen[];
  /** Unidades por clave de catálogo. */
  counts: Record<string, number>;
  extras: string[];
  /** Catálogo, para resolver etiquetas y respetar el orden de presentación. */
  catalog: QuoteCatalogEntry[];
};

export type SummaryRow = { category: "Evento" | "Pantalla" | "Sonido" | "Iluminación" | "Servicios"; label: string };

const meters = (value: number) => String(value).replace(".", ",");

/** Etiqueta de una pantalla suelta: tipo y medida. */
export function screenLabelOf(screen: QuoteScreen) {
  if (screen.kind === "E-Poster") return "E-Poster 1×2";
  return `${screen.kind} — ${meters(screen.width)} × ${meters(screen.height)} m`;
}

/**
 * Agrupa las pantallas idénticas para no repetir renglones: tres tótems
 * iguales se leen "E-Poster 1×2 × 3", no tres veces lo mismo.
 */
export function groupedScreens(screens: QuoteScreen[]) {
  const groups: Array<{ label: string; count: number }> = [];
  for (const screen of screens) {
    const label = screenLabelOf(screen);
    const existing = groups.find((group) => group.label === label);
    if (existing) existing.count += 1;
    else groups.push({ label, count: 1 });
  }
  return groups.map(({ label, count }) => (count > 1 ? `${label} × ${count}` : label));
}

/** Una fila por ítem elegido, en el orden en que se muestran. */
export function summaryRows({ eventProfile, screens, counts, extras, catalog }: QuoteInput): SummaryRow[] {
  const rows: SummaryRow[] = [];
  if (eventProfile) rows.push({ category: "Evento", label: eventProfile });
  rows.push(...groupedScreens(screens).map((label) => ({ category: "Pantalla" as const, label })));
  const units = (category: "sound" | "lighting") => catalog
    .filter((entry) => entry.category === category && (counts[entry.key] ?? 0) > 0)
    .map((entry) => category === "lighting" ? entry.label : `${entry.label} × ${counts[entry.key]}`);
  for (const label of units("sound")) rows.push({ category: "Sonido", label });
  for (const label of units("lighting")) rows.push({ category: "Iluminación", label });
  for (const label of extras) rows.push({ category: "Servicios", label });
  return rows;
}

/** Renglones del mensaje: una línea por categoría, con sus ítems juntos. */
export function quoteLines(input: QuoteInput) {
  const rows = summaryRows(input);
  const pick = (category: SummaryRow["category"]) => rows.filter((row) => row.category === category).map((row) => row.label);
  const screens = pick("Pantalla");
  const lines: string[] = [];
  if (input.eventProfile) lines.push(`Evento: ${input.eventProfile}`);
  lines.push(`${input.screens.length > 1 ? "Pantallas" : "Pantalla"}: ${screens.join(", ")}`);
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
