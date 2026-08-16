export type ContactRequest = {
  name: string;
  eventType: string;
  date: string;
  message: string;
};

export function contactMessage({ name, eventType, date, message }: ContactRequest) {
  const lines = [
    "Hola LedScreen! Quiero solicitar información para un evento:",
    "",
    `Nombre: ${name.trim()}`,
  ];
  if (eventType.trim()) lines.push(`Tipo de evento: ${eventType.trim()}`);
  if (date.trim()) lines.push(`Fecha: ${date.trim()}`);
  if (message.trim()) lines.push(`Mensaje: ${message.trim()}`);
  return lines.join("\n");
}

export function contactWhatsappHref(phone: string, request: ContactRequest) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(contactMessage(request))}`;
}
