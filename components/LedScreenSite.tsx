"use client";

import { useEffect, useState, type FormEvent } from "react";
import BrandLogo from "./BrandLogo";
import Configurator from "./configurator/Configurator";
import HeroLedWall from "./HeroLedWall";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { MdEmail, MdPublic } from "react-icons/md";
import { contactWhatsappHref } from "../data/contactMessage";
import { LanguageProvider, useTranslate } from "./LanguageContext";

const WHATSAPP_HREF = "https://wa.me/595981416316";
const SOCIALS = [
  { label: "Instagram", Icon: FaInstagram, href: "https://www.instagram.com/ledscreenpy/" },
  { label: "Facebook", Icon: FaFacebookF, href: "https://www.facebook.com/leds.screen" },
  { label: "TikTok", Icon: FaTiktok, href: null },
];

function SocialButtons() {
  const tx = useTranslate();
  return <>{SOCIALS.map(({ label, Icon, href }) => href
    ? <a aria-label={label} href={href} target="_blank" rel="noopener noreferrer" key={label}><Icon aria-hidden="true" /></a>
    : <button type="button" className="social-upcoming" aria-label={`${label} ${tx("próximamente")}`} title={`${label} · ${tx("Próximamente")}`} key={label}><Icon aria-hidden="true" /><span>{tx("Próximamente")}</span></button>
  )}</>;
}
const SERVICES = [
  ["01", "Pantallas LED", "Módulos indoor/outdoor de alta resolución, cualquier medida."],
  ["02", "Sonido profesional", "Line-array y refuerzo sonoro para cualquier sala."],
  ["03", "Iluminación", "Diseño de luces, wash, beam y control DMX."],
  ["04", "Estructuras TRUSS", "Aluminio certificado para colgar y elevar con seguridad."],
  ["05", "Tarimas", "Escenarios modulares a la medida del evento."],
  ["06", "Montaje técnico", "Transporte, montaje, desmontaje y mano de obra."],
  ["07", "DJ", "Música y ambientación para tu producción."],
  ["08", "E-Póster", "Tótems LED verticales para stands y accesos."],
];
const PREVIEW_SIZES = [[3, 2], [4, 2.5], [4, 3], [5, 3], [6, 3], [6, 4]];
const EVENTS = [
  ["/assets/original/foto-01.jpg", "Sociales", ["Cumpleaños", "15 años", "Bodas", "Aniversarios"]],
  ["/assets/original/foto-02.jpg", "Empresariales", ["Activaciones", "Conferencias", "Lanzamientos", "Fiestas"]],
  ["/assets/original/foto-03.jpg", "Gubernamentales", ["Festivales", "Desfiles", "Convenciones", "Actos oficiales"]],
] as const;
const GALLERY = [
  ["/assets/original/foto-04.jpg", "Congreso de Neurocirugía", true], ["/assets/original/foto-02.jpg", "Activación Samsung", false],
  ["/assets/original/foto-01.jpg", "San José Run 2024", false], ["/assets/original/foto-05.jpg", "Graduación UCSA", true],
  ["/assets/original/foto-03.jpg", "Acto oficial", false], ["/assets/original/foto-06.jpg", "E-Póster farmacéutico", false],
] as const;
const FAQ_GROUPS = [
  { label: "Empresa", items: [
    { question: "¿Qué es la empresa y desde cuándo trabaja?", answer: "Somos una empresa pionera en servicios de pantallas LED y soluciones técnicas para eventos. Iniciamos en 2010 y seguimos activos hasta hoy, con amplia experiencia en el rubro." },
    { question: "¿Qué servicios ofrecen?", answer: "Ofrecemos soluciones integrales para eventos:", bullets: ["Pantallas LED", "Sonido profesional", "Iluminación", "Estructuras TRUSS de aluminio", "Tarimas", "Accesorios y montaje técnico", "DJ", "E-Póster"] },
    { question: "¿Qué tipos de eventos realizan?", answer: "Trabajamos en:", bullets: ["Eventos sociales (cumpleaños, 15 años, bodas, aniversarios)", "Eventos empresariales (activaciones, conferencias, lanzamientos, fiestas corporativas)", "Eventos gubernamentales (festivales, desfiles, convenciones, actos oficiales)"] },
    { question: "¿Qué los diferencia?", answer: "La atención personalizada y la experiencia en el rubro desde 2010." },
  ]},
  { label: "Pantallas", items: [
    { question: "¿Qué tamaños de pantallas LED tienen?", answer: "Contamos con pantallas desde 6 m² hasta más de 100 m².", bullets: ["Medidas comunes: 3×2, 4×2,5, 4×3, 5×3, 6×3, 6×4 m y más según necesidad."] },
    { question: "¿Tienen pantallas para exteriores?", answer: "Sí, contamos con pantallas outdoor y estructuras seguras diseñadas para eventos al aire libre." },
    { question: "¿Las pantallas funcionan con cualquier contenido?", answer: "Sí, reciben cualquier señal de video o multimedia. También se puede contratar servicio de streaming para eventos en vivo." },
    { question: "¿Qué tipo de archivos se pueden usar?", answer: "Se puede reproducir cualquier archivo multimedia: videos, imágenes o presentaciones." },
  ]},
  { label: "Servicio", items: [
    { question: "¿Qué incluye el servicio?", answer: "Incluye transporte, montaje, desmontaje, mano de obra especializada y atención personalizada." },
    { question: "¿Tienen soporte técnico en eventos?", answer: "Sí, ofrecemos guardia técnica y operador en vivo según la necesidad del evento." },
    { question: "¿En qué zonas trabajan?", answer: "Contamos con transporte propio para realizar eventos en cualquier punto del país." },
  ]},
  { label: "Contratación", items: [
    { question: "¿Cómo se reserva un evento?", answer: "Se recomienda reservar con al menos 1 mes de anticipación a través de contacto directo o correo electrónico." },
    { question: "¿Qué datos necesitan para un presupuesto?", answer: "Lugar, fecha, tipo de evento y necesidades técnicas." },
    { question: "¿Cómo es la forma de pago?", answer: "Se trabaja generalmente con pago al contado. Se puede dar un anticipo para reservar fecha y el saldo el día del evento. Aceptamos transferencia, efectivo y cheques." },
  ]},
] as const;

const EN: Record<string, string> = {
  "Inicio": "Home", "Servicios": "Services", "Eventos": "Events", "Trabajos": "Work", "Cotizador 3D": "3D Quote Builder",
  "PIONEROS EN PANTALLAS LED · DESDE 2010": "LED SCREEN PIONEERS · SINCE 2010", "Convertimos": "We turn", "cada evento en luz": "every event into light",
  "Pantallas LED, sonido, iluminación y estructuras técnicas para eventos sociales, empresariales y gubernamentales en todo Paraguay.": "LED screens, sound, lighting and technical structures for social, corporate and government events throughout Paraguay.",
  "Cotizá tu evento en 3D": "Build your event quote in 3D", "Ver trabajos": "View our work", "Visualizá el montaje a escala y envialo por WhatsApp.": "Preview the setup to scale and send it through WhatsApp.",
  "AÑOS DE EXPERIENCIA": "YEARS OF EXPERIENCE", "M² DE PANTALLA": "M² OF LED SCREENS", "EVENTOS MONTADOS": "EVENTS PRODUCED",
  "01 — SERVICIOS": "01 — SERVICES", "Soluciones integrales para eventos": "Complete event solutions", "Todo lo técnico bajo un mismo equipo: desde la pantalla hasta el último cable. Transporte, montaje y operación en vivo incluidos.": "Every technical service under one team, from the screen to the last cable. Transport, setup and live operation included.",
  "Pantallas LED": "LED screens", "Módulos indoor/outdoor de alta resolución, cualquier medida.": "High-resolution indoor/outdoor modules in any size.", "Sonido profesional": "Professional sound", "Line-array y refuerzo sonoro para cualquier sala.": "Line arrays and sound reinforcement for any venue.", "Iluminación": "Lighting", "Diseño de luces, wash, beam y control DMX.": "Lighting design, wash, beams and DMX control.", "Estructuras TRUSS": "TRUSS structures", "Aluminio certificado para colgar y elevar con seguridad.": "Certified aluminum structures for safe rigging.", "Tarimas": "Stages", "Escenarios modulares a la medida del evento.": "Modular stages tailored to the event.", "Montaje técnico": "Technical setup", "Transporte, montaje, desmontaje y mano de obra.": "Transport, setup, teardown and technical crew.", "Música y ambientación para tu producción.": "Music and atmosphere for your production.", "E-Póster": "E-Poster", "Tótems LED verticales para stands y accesos.": "Vertical LED displays for booths and entrances.",
  "02 — PANTALLAS LED": "02 — LED SCREENS", "Desde 6 m² hasta más de 100 m²": "From 6 m² to more than 100 m²", "Módulos de alta resolución para interior y exterior. Elegimos la medida y el pixel-pitch ideal según tu evento, tu sala y tu presupuesto.": "High-resolution indoor and outdoor modules. We select the ideal size and pixel pitch for your event, venue and budget.", "↗ Tocá una medida para verla a escala junto a una persona de 1,70 m.": "↗ Choose a size to compare it with a 1.70 m person.", "Estructuras seguras para intemperie.": "Weather-safe structures.", "Cualquier contenido": "Any content", "Video, imágenes, presentaciones y streaming en vivo.": "Video, images, presentations and live streaming.",
  "03 — EVENTOS": "03 — EVENTS", "Para cada tipo de evento": "For every kind of event", "Experiencia comprobada en producciones sociales, corporativas y oficiales.": "Proven experience in social, corporate and official productions.", "Sociales": "Social", "Empresariales": "Corporate", "Gubernamentales": "Government",
  "04 — TRABAJOS": "04 — WORK", "Producciones reales": "Real productions", "Una muestra de montajes recientes en Asunción y el interior del país.": "A selection of recent productions in Asunción and across Paraguay.",
  "05 — PREGUNTAS FRECUENTES": "05 — FREQUENTLY ASKED QUESTIONS", "Todo lo que querés saber": "Everything you need to know",
  "06 — CONTACTO": "06 — CONTACT", "Pedí tu presupuesto": "Request a quote", "Contanos lugar, fecha, tipo de evento y necesidades técnicas. Reservá con al menos 1 mes de anticipación.": "Tell us the venue, date, event type and technical needs. Book at least one month in advance.", "Cobertura": "Coverage", "Todo el país": "Nationwide", "Nombre": "Name", "Tipo de evento": "Event type", "Fecha": "Date", "Mensaje": "Message", "Enviar solicitud": "Send request",
  "Pantallas LED y soluciones técnicas para eventos · desde 2010": "LED screens and technical event solutions · since 2010", "Contactar por WhatsApp": "Contact us on WhatsApp",
  "próximamente": "coming soon", "Próximamente": "Coming soon", "Abrir menú": "Open menu",
  "PANTALLAS LED": "LED SCREENS", "SONIDO": "SOUND", "ILUMINACIÓN": "LIGHTING", "TARIMAS": "STAGES", "E-PÓSTER": "E-POSTER",
  "Cumpleaños": "Birthdays", "15 años": "Quinceañeras", "Bodas": "Weddings", "Aniversarios": "Anniversaries", "Activaciones": "Brand activations", "Conferencias": "Conferences", "Lanzamientos": "Launches", "Fiestas": "Parties", "Festivales": "Festivals", "Desfiles": "Parades", "Convenciones": "Conventions", "Actos oficiales": "Official events",
  "Congreso de Neurocirugía": "Neurosurgery Congress", "Activación Samsung": "Samsung activation", "Graduación UCSA": "UCSA graduation", "Acto oficial": "Official event", "E-Póster farmacéutico": "Pharmaceutical E-Poster",
  "¿Qué servicios ofrecen?": "What services do you offer?", "Ofrecemos soluciones integrales para eventos: pantallas LED, sonido profesional, iluminación, estructuras TRUSS de aluminio, tarimas, accesorios, montaje técnico, DJ y E-Póster.": "We offer complete event solutions: LED screens, professional sound, lighting, aluminum TRUSS structures, stages, accessories, technical setup, DJ and E-Posters.",
  "¿Qué tamaños de pantallas LED tienen?": "What LED screen sizes are available?", "Contamos con pantallas desde 6 m² hasta más de 100 m². La medida se define según el espacio y las necesidades del evento.": "We offer screens from 6 m² to over 100 m². Size is determined by the venue and event requirements.",
  "¿Tienen pantallas para exteriores?": "Do you offer outdoor screens?", "Sí, contamos con pantallas outdoor y estructuras seguras diseñadas para eventos al aire libre.": "Yes, we offer outdoor screens and safe structures designed for open-air events.",
  "¿Qué incluye el servicio?": "What does the service include?", "Incluye transporte, montaje, desmontaje, mano de obra especializada y atención personalizada.": "It includes transport, setup, teardown, specialized crew and personalized support.",
  "¿Cómo se reserva un evento?": "How do I book an event?", "Se recomienda reservar con al menos un mes de anticipación a través de contacto directo o correo electrónico.": "We recommend booking at least one month in advance by direct contact or email.",
  "Fecha del evento": "Event date", "Contanos qué necesitás (lugar, medidas, servicios)": "Tell us what you need (venue, dimensions, services)", "Desarrollado por": "Developed by",
  "Abrir Cotizador 3D": "Open 3D Quote Builder", "Cerrar Cotizador 3D": "Close 3D Quote Builder", "COTIZADOR 3D": "3D QUOTE BUILDER", "Armá tu escenario": "Build your setup", "Elegí pantallas, sonido e iluminación y visualizá cómo podría verse tu montaje a escala.": "Choose screens, sound and lighting, and preview your setup to scale.",
  "¿Qué tipo de evento estás preparando?": "What type of event are you planning?", "Corporativo": "Corporate", "Institucional": "Institutional", "Festival": "Festival", "Otro evento": "Other event", "Presentaciones, congresos y lanzamientos.": "Presentations, conferences and launches.", "Bodas, cumpleaños y celebraciones.": "Weddings, birthdays and celebrations.", "Actos oficiales, educativos y gubernamentales.": "Official, educational and government events.", "Conciertos y producciones al aire libre.": "Concerts and outdoor productions.", "Una producción diferente o todavía por definir.": "A different production or one still to be defined.", "Se incluirá en tu solicitud de presupuesto.": "It will be included in your quote request.",
  "Pantallas": "Screens", "Sonido": "Sound", "Luces": "Lights", "Extras": "Extras", "Pantalla": "Screen", "Eliminar": "Delete", "Eventos grandes y al aire libre. Resiste lluvia, máxima calidad.": "Large outdoor events. Weather resistant, maximum quality.", "Eventos más chicos y bajo techo.": "Smaller indoor events.", "Tótem vertical para accesos y stands.": "Vertical display for entrances and booths.", "Medida fija de 1 × 2 m.": "Fixed size: 1 × 2 m.", "Medida": "Size", "Personalizada": "Custom", "Ancho": "Width", "Alto": "Height", "Agregar": "Add", "Cantidad por unidad": "Quantity per unit", "Quitar": "Remove", "Iluminación": "Lighting", "La cantidad de equipos se determinará al preparar el presupuesto. La cantidad visualizada en el escenario es solo de referencia.": "Equipment quantities will be determined when preparing the quote. The amount shown in the scene is for reference only.", "DJ y extras": "DJ and extras", "Consola DJ": "DJ console", "Escenario": "Stage", "Generador": "Generator", "Micrófonos": "Microphones",
  "Tu paquete": "Your package", "ítem": "item", "ítems": "items", "Cotizar por WhatsApp →": "Request quote on WhatsApp →", "Se abre WhatsApp con tu paquete listo para enviar.": "WhatsApp opens with your package ready to send.", "Preparando escenario 3D": "Preparing 3D scene", "Cargando la experiencia interactiva…": "Loading interactive experience…",
  "1 unidad = 1 metro": "1 unit = 1 meter", "Centrar vista": "Center view", "Ambiente del escenario": "Scene environment", "Salón de actos": "Event hall", "Aire libre": "Outdoor", "Fiesta": "Party", "Luces en movimiento": "Moving lights", "Arrastrá para mirar · Pellizcá o desplazá para acercar": "Drag to look · Pinch or scroll to zoom", "Deslizá para mover": "Drag to move", "Seleccionado": "Selected", "Listo": "Done", "Mover": "Move", "Rotar": "Rotate", "Restablecer": "Reset",
  "Estructura de luces": "Lighting structure", "Bajo techo, luz pareja": "Indoors, even lighting", "Exterior, luz de día": "Outdoors, daylight", "Nocturno, para lucir luces": "Night setting for showcasing lights",
  "Evento": "Event", "Equipo": "Equipment", "Extra": "Extra", "Globos Espejados": "Mirror balls", "Pines": "Pin spots", "Globo Espejado": "Mirror ball", "Pin": "Pin spot",
  "Empresa": "Company", "Servicio": "Service", "Contratación": "Booking",
  "¿Qué es la empresa y desde cuándo trabaja?": "What is the company and how long has it been operating?", "Somos una empresa pionera en servicios de pantallas LED y soluciones técnicas para eventos. Iniciamos en 2010 y seguimos activos hasta hoy, con amplia experiencia en el rubro.": "We are a pioneering LED screen and technical event solutions company. We started in 2010 and remain active today, with extensive industry experience.",
  "Ofrecemos soluciones integrales para eventos:": "We offer complete event solutions:", "Estructuras TRUSS de aluminio": "Aluminum TRUSS structures", "Accesorios y montaje técnico": "Accessories and technical setup",
  "¿Qué tipos de eventos realizan?": "What types of events do you produce?", "Trabajamos en:": "We work on:", "Eventos sociales (cumpleaños, 15 años, bodas, aniversarios)": "Social events (birthdays, quinceañeras, weddings and anniversaries)", "Eventos empresariales (activaciones, conferencias, lanzamientos, fiestas corporativas)": "Corporate events (activations, conferences, launches and company parties)", "Eventos gubernamentales (festivales, desfiles, convenciones, actos oficiales)": "Government events (festivals, parades, conventions and official ceremonies)",
  "¿Qué los diferencia?": "What sets you apart?", "La atención personalizada y la experiencia en el rubro desde 2010.": "Personalized service and industry experience since 2010.",
  "Contamos con pantallas desde 6 m² hasta más de 100 m².": "We offer screens from 6 m² to more than 100 m².", "Medidas comunes: 3×2, 4×2,5, 4×3, 5×3, 6×3, 6×4 m y más según necesidad.": "Common sizes: 3×2, 4×2.5, 4×3, 5×3, 6×3, 6×4 m, and larger options as needed.",
  "¿Las pantallas funcionan con cualquier contenido?": "Do the screens work with any content?", "Sí, reciben cualquier señal de video o multimedia. También se puede contratar servicio de streaming para eventos en vivo.": "Yes, they accept any video or multimedia signal. Live event streaming is also available.", "¿Qué tipo de archivos se pueden usar?": "What file types can be used?", "Se puede reproducir cualquier archivo multimedia: videos, imágenes o presentaciones.": "Any multimedia file can be played, including videos, images and presentations.",
  "¿Tienen soporte técnico en eventos?": "Do you provide on-site technical support?", "Sí, ofrecemos guardia técnica y operador en vivo según la necesidad del evento.": "Yes, we provide technical standby and a live operator according to the event's needs.", "¿En qué zonas trabajan?": "What areas do you cover?", "Contamos con transporte propio para realizar eventos en cualquier punto del país.": "We have our own transport and can produce events anywhere in the country.",
  "¿Qué datos necesitan para un presupuesto?": "What information is needed for a quote?", "Lugar, fecha, tipo de evento y necesidades técnicas.": "Venue, date, event type and technical requirements.", "¿Cómo es la forma de pago?": "What payment methods do you accept?", "Se trabaja generalmente con pago al contado. Se puede dar un anticipo para reservar fecha y el saldo el día del evento. Aceptamos transferencia, efectivo y cheques.": "Payment is generally made in full. A deposit can reserve the date, with the balance due on the event day. We accept bank transfers, cash and checks.",
  "Se recomienda reservar con al menos 1 mes de anticipación a través de contacto directo o correo electrónico.": "We recommend booking at least one month in advance by direct contact or email.",
};

export default function LedScreenSite() {
  const [menu, setMenu] = useState(false);
  const [preview, setPreview] = useState(5);
  const [previewAuto, setPreviewAuto] = useState(true);
  const [faqGroup, setFaqGroup] = useState(0);
  const [faq, setFaq] = useState(0);
  const [lang, setLang] = useState<"ES" | "EN">("ES");
  const tx = (value: string) => lang === "EN" ? (EN[value] ?? value) : value;
  const [screenW, screenH] = PREVIEW_SIZES[preview];

  // El prototipo va rotando las medidas cada 2,6 s hasta que el visitante elige una.
  useEffect(() => {
    if (!previewAuto) return;
    const timer = setInterval(() => setPreview((current) => (current + 1) % PREVIEW_SIZES.length), 2600);
    return () => clearInterval(timer);
  }, [previewAuto]);

  useEffect(() => { document.documentElement.lang = lang.toLowerCase(); }, [lang]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    const root = document.documentElement;
    root.classList.add("reveal-enabled");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); }
    }), { threshold: .12, rootMargin: "0px 0px -8% 0px" });
    elements.forEach((element) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top >= 0 && bounds.top <= window.innerHeight * .86) element.classList.add("revealed");
      else observer.observe(element);
    });
    return () => { observer.disconnect(); root.classList.remove("reveal-enabled"); };
  }, []);

  const sendContactToWhatsapp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const href = contactWhatsappHref("595981416316", {
      name: String(form.get("name") ?? ""),
      eventType: String(form.get("eventType") ?? ""),
      date: String(form.get("date") ?? ""),
      message: String(form.get("message") ?? ""),
    });
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return <LanguageProvider translate={tx}><main>
    <header className="site-header"><a className="brand" href="#inicio"><BrandLogo animated /><span>LedScreen</span></a><nav className="desktop-nav"><a href="#inicio">{tx("Inicio")}</a><a href="#servicios">{tx("Servicios")}</a><a href="#pantallas">{tx("Pantallas LED")}</a><a href="#eventos">{tx("Eventos")}</a><a href="#trabajos">{tx("Trabajos")}</a><a href="#faq">FAQ</a><button className="lang-button" onClick={() => setLang(lang === "ES" ? "EN" : "ES")}>{lang === "ES" ? "EN" : "ES"}</button><a className="nav-cta" href="#cotizador">{tx("Cotizador 3D")}</a></nav><button className="menu-button" aria-label={tx("Abrir menú")} aria-expanded={menu} onClick={() => setMenu(!menu)}><i /><i /><i /></button></header>
    <div className={menu ? "mobile-menu open" : "mobile-menu"} aria-hidden={!menu}><a onClick={() => setMenu(false)} href="#inicio">{tx("Inicio")}</a><a onClick={() => setMenu(false)} href="#servicios">{tx("Servicios")}</a><a onClick={() => setMenu(false)} href="#pantallas">{tx("Pantallas LED")}</a><a onClick={() => setMenu(false)} href="#eventos">{tx("Eventos")}</a><a onClick={() => setMenu(false)} href="#trabajos">{tx("Trabajos")}</a><a onClick={() => setMenu(false)} href="#faq">FAQ</a><button className="lang-button" onClick={() => setLang(lang === "ES" ? "EN" : "ES")}>{lang === "ES" ? "EN" : "ES"}</button><a className="nav-cta" onClick={() => setMenu(false)} href="#cotizador">{tx("Cotizador 3D")}</a><div className="mobile-socials"><SocialButtons /></div></div>

    <section id="inicio" className="hero"><HeroLedWall /><div className="hero-vignette" /><div className="hero-side-shade" /><div className="hero-copy"><div className="hero-badge"><span />{tx("PIONEROS EN PANTALLAS LED · DESDE 2010")}</div><h1><span>{tx("Convertimos")}</span><em>{tx("cada evento en luz")}</em></h1><p>{tx("Pantallas LED, sonido, iluminación y estructuras técnicas para eventos sociales, empresariales y gubernamentales en todo Paraguay.")}</p><div className="hero-actions"><a className="primary" href="#cotizador">{tx("Cotizá tu evento en 3D")}</a><a className="secondary" href="#trabajos">{tx("Ver trabajos")}</a></div><p className="hero-cta-note">{tx("Visualizá el montaje a escala y envialo por WhatsApp.")}</p><div className="stats"><div><strong>15+</strong><span>{tx("AÑOS DE EXPERIENCIA")}</span></div><div><strong>100+</strong><span>{tx("M² DE PANTALLA")}</span></div><div><strong>500+</strong><span>{tx("EVENTOS MONTADOS")}</span></div></div></div></section>
    <div className="marquee"><div>{[0, 1].map((copy) => <span className="marquee-set" key={copy}><b>{tx("PANTALLAS LED")}</b><i>◆</i><b>{tx("SONIDO")}</b><i>◆</i><b>{tx("ILUMINACIÓN")}</b><i>◆</i><b>TRUSS</b><i>◆</i><b>{tx("TARIMAS")}</b><i>◆</i><b>DJ</b><i>◆</i><b>{tx("E-PÓSTER")}</b><i>◆</i><b>STREAMING</b><i>◆</i></span>)}</div></div>

    <section id="servicios" className="original-section services-original"><div className="section-intro reveal"><div className="eyebrow">{tx("01 — SERVICIOS")}</div><h2>{tx("Soluciones integrales para eventos")}</h2><p>{tx("Todo lo técnico bajo un mismo equipo: desde la pantalla hasta el último cable. Transporte, montaje y operación en vivo incluidos.")}</p></div><div className="services-original-grid">{SERVICES.map(([num, title, text]) => <article className="service-original-card reveal" key={num}><span>{num}</span><h3>{tx(title)}</h3><p>{tx(text)}</p><i /></article>)}</div></section>

    <section id="pantallas" className="screens-original"><div className="screens-original-inner"><div className="screen-copy reveal"><div className="eyebrow">{tx("02 — PANTALLAS LED")}</div><h2>{tx("Desde 6 m² hasta más de 100 m²")}</h2><p>{tx("Módulos de alta resolución para interior y exterior. Elegimos la medida y el pixel-pitch ideal según tu evento, tu sala y tu presupuesto.")}</p><div className="preview-size-buttons">{PREVIEW_SIZES.map(([w, h], index) => <button className={preview === index ? "active" : ""} key={`${w}-${h}`} onClick={() => { setPreview(index); setPreviewAuto(false); }}>{w} × {String(h).replace(".", ",")} m</button>)}</div><div className="screen-hint">{tx("↗ Tocá una medida para verla a escala junto a una persona de 1,70 m.")}</div><div className="screen-features"><div><strong>Indoor &amp; Outdoor</strong><span>{tx("Estructuras seguras para intemperie.")}</span></div><div><strong>{tx("Cualquier contenido")}</strong><span>{tx("Video, imágenes, presentaciones y streaming en vivo.")}</span></div></div></div><div className="screen-preview reveal"><div className="preview-grid" /><div className="preview-floor" /><div className="preview-label"><strong>{screenW} × {String(screenH).replace(".", ",")} m</strong><i /><span>{screenW * screenH} m²</span></div><div className="scale-stage"><div className="scale-person" style={{ height: `${1.7 * 100 / 4.6}%` }}><small>1,70 m</small><svg viewBox="0 0 24 80" preserveAspectRatio="xMidYMax meet"><circle cx="12" cy="8.5" r="6.6" /><path d="M12 16.5C6.5 16.5 5 21 5 29L4 47c-.2 2.4 2.3 2.6 2.7.2L8.2 33 8 78c0 2 3 2 3.1 0l.9-23 .9 23c.1 2 3.1 2 3.1 0l-.2-45 1.5 14.2c.4 2.4 2.9 2.2 2.7-.2l-1-18c0-8-1.5-12.5-7-12.5Z" /></svg></div><div className="scale-panel" style={{ width: `${screenW * 100 / 7.8}%`, height: `${screenH * 100 / 4.6}%` }}><div className="scale-panel-wave" /><div className="scale-panel-pixels" /><BrandLogo /></div></div></div></div></section>

    <Configurator />

    <section id="eventos" className="original-section"><div className="section-intro reveal"><div className="eyebrow">{tx("03 — EVENTOS")}</div><h2>{tx("Para cada tipo de evento")}</h2><p>{tx("Experiencia comprobada en producciones sociales, corporativas y oficiales.")}</p></div><div className="event-grid">{EVENTS.map(([image, title, tags]) => <article className="event-card reveal" key={title}><img src={image} alt={tx(title)} /><div className="event-shade" /><div className="event-info"><h3>{tx(title)}</h3><div>{tags.map((tag) => <span key={tag}>{tx(tag)}</span>)}</div></div></article>)}</div></section>

    <section id="trabajos" className="works-original"><div className="works-inner"><div className="section-intro reveal"><div className="eyebrow">{tx("04 — TRABAJOS")}</div><h2>{tx("Producciones reales")}</h2><p>{tx("Una muestra de montajes recientes en Asunción y el interior del país.")}</p></div><div className="gallery-grid">{GALLERY.map(([image, title, tall]) => <article className={`gallery-card reveal ${tall ? "tall" : ""}`} key={title}><img src={image} alt={tx(title)} /><div><span>{tx(title)}</span></div></article>)}</div></div></section>

    <section id="faq" className="faq-original"><div className="section-intro centered reveal"><div className="eyebrow">{tx("05 — PREGUNTAS FRECUENTES")}</div><h2>{tx("Todo lo que querés saber")}</h2></div><div className="faq-groups" role="tablist">{FAQ_GROUPS.map((group, index) => <button role="tab" aria-selected={faqGroup === index} className={faqGroup === index ? "active" : ""} key={group.label} onClick={() => { setFaqGroup(index); setFaq(0); }}><span>{tx(group.label)}</span><small>{group.items.length}</small></button>)}</div><div className="faq-list">{FAQ_GROUPS[faqGroup].items.map((item, index) => <article className="reveal revealed" key={item.question}><button aria-expanded={faq === index} onClick={() => setFaq(faq === index ? -1 : index)}><span>{tx(item.question)}</span><i className={faq === index ? "open" : ""}>+</i></button><div className={faq === index ? "faq-answer open" : "faq-answer"}><div className="faq-answer-content"><p>{tx(item.answer)}</p>{"bullets" in item && item.bullets && <ul>{item.bullets.map((bullet) => <li key={bullet}>{tx(bullet)}</li>)}</ul>}</div></div></article>)}</div></section>

    <section id="contacto" className="contact-original"><i /><div className="contact-inner"><div className="reveal"><div className="eyebrow">{tx("06 — CONTACTO")}</div><h2>{tx("Pedí tu presupuesto")}</h2><p>{tx("Contanos lugar, fecha, tipo de evento y necesidades técnicas. Reservá con al menos 1 mes de anticipación.")}</p><div className="contact-data"><a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer"><b><FaWhatsapp aria-hidden="true" /></b><span><small>WhatsApp / Tel</small><strong>+595 981 416316</strong></span></a><a href="mailto:ledscreen@gmail.com"><b><MdEmail aria-hidden="true" /></b><span><small>Email</small><strong>ledscreen@gmail.com</strong></span></a><div><b><MdPublic aria-hidden="true" /></b><span><small>{tx("Cobertura")}</small><strong>{tx("Todo el país")}</strong></span></div></div></div><form className="contact-form reveal" onSubmit={sendContactToWhatsapp}><label><span>{tx("Nombre")}</span><input name="name" required placeholder={tx("Nombre")} /></label><label><span>{tx("Tipo de evento")}</span><input name="eventType" placeholder={tx("Tipo de evento")} /></label><label className="date-field"><span>{tx("Fecha del evento")}</span><input name="date" type="date" /></label><label><span>{tx("Mensaje")}</span><textarea name="message" rows={4} placeholder={tx("Contanos qué necesitás (lugar, medidas, servicios)")} /></label><button type="submit">{tx("Enviar solicitud")}</button></form></div></section>

    <footer><a className="brand" href="#inicio"><span>LedScreen</span></a><div className="footer-tagline">{tx("Pantallas LED y soluciones técnicas para eventos · desde 2010")}</div><div className="footer-socials"><SocialButtons /></div><div className="footer-copy">© {new Date().getFullYear()} LedScreen</div><div className="footer-credit">{tx("Desarrollado por")} <a href="https://a30.com.py" target="_blank" rel="noopener noreferrer">A30 Group</a></div></footer>
    <div className="social-rail"><SocialButtons /></div><a className="whatsapp-float" aria-label={tx("Contactar por WhatsApp")} href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer"><FaWhatsapp aria-hidden="true" /></a>
  </main></LanguageProvider>;
}
