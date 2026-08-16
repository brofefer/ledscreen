import { CATALOG } from "../../data/catalog";
import type { ScreenItem } from "../../data/screens";
import { summaryRows, whatsappHref, type QuoteInput } from "../../data/quoteMessage";

const WHATSAPP = "595981416316";

type Config = { screens: ScreenItem[]; counts: Record<string, number>; extras: string[] };

export default function QuoteSummary({ config }: { config: Config }) {
  const input: QuoteInput = { screens: config.screens, counts: config.counts, extras: config.extras, catalog: CATALOG };
  const rows = summaryRows(input);
  return <aside className="quote-summary">
    <div className="quote-summary-head">
      <strong>Tu paquete</strong>
      <span>{rows.length} {rows.length === 1 ? "ítem" : "ítems"}</span>
    </div>
    <ul className="quote-summary-rows">
      {rows.map((row, index) => <li key={`${row.category}-${row.label}-${index}`}><span>{row.category}</span><strong>{row.label}</strong></li>)}
    </ul>
    <div className="quote-summary-cta">
      <a href={whatsappHref(WHATSAPP, input)} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp →</a>
      <small>Se abre WhatsApp con tu paquete listo para enviar.</small>
    </div>
  </aside>;
}
