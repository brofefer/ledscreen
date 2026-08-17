import { CATALOG } from "../../data/catalog";
import type { ScreenItem } from "../../data/screens";
import { summaryRows, whatsappHref, type QuoteInput } from "../../data/quoteMessage";
import { eventProfileOf, type EventProfileKey } from "../../data/eventProfiles";
import { useTranslate } from "../LanguageContext";

const WHATSAPP = "595981416316";

type Config = { screens: ScreenItem[]; counts: Record<string, number>; extras: string[]; eventProfile: EventProfileKey };

export default function QuoteSummary({ config }: { config: Config }) {
  const tx = useTranslate();
  const input: QuoteInput = { eventProfile: eventProfileOf(config.eventProfile).label, screens: config.screens, counts: config.counts, extras: config.extras, catalog: CATALOG };
  const rows = summaryRows(input);
  return <aside className="quote-summary">
    <div className="quote-summary-head">
      <strong>{tx("Tu paquete")}</strong>
      <span>{rows.length} {tx(rows.length === 1 ? "ítem" : "ítems")}</span>
    </div>
    <ul className="quote-summary-rows">
      {rows.map((row, index) => <li key={`${row.category}-${row.label}-${index}`}><span>{tx(row.category)}</span><strong>{tx(row.label)}</strong></li>)}
    </ul>
    <div className="quote-summary-cta">
      <a href={whatsappHref(WHATSAPP, input)} target="_blank" rel="noopener noreferrer">{tx("Cotizar por WhatsApp →")}</a>
      <small>{tx("Se abre WhatsApp con tu paquete listo para enviar.")}</small>
    </div>
  </aside>;
}
