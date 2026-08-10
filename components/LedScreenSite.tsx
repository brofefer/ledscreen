"use client";

import { useEffect, useState } from "react";
import BrandLogo from "./BrandLogo";
import Configurator from "./configurator/Configurator";
import HeroLedWall from "./HeroLedWall";

const SOCIALS = [{ label: "Instagram", icon: "IG", href: "#" }, { label: "Facebook", icon: "f", href: "#" }, { label: "TikTok", icon: "♪", href: "#" }];
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
const FAQS = [
  ["¿Qué servicios ofrecen?", "Ofrecemos soluciones integrales para eventos: pantallas LED, sonido profesional, iluminación, estructuras TRUSS de aluminio, tarimas, accesorios, montaje técnico, DJ y E-Póster."],
  ["¿Qué tamaños de pantallas LED tienen?", "Contamos con pantallas desde 6 m² hasta más de 100 m². La medida se define según el espacio y las necesidades del evento."],
  ["¿Tienen pantallas para exteriores?", "Sí, contamos con pantallas outdoor y estructuras seguras diseñadas para eventos al aire libre."],
  ["¿Qué incluye el servicio?", "Incluye transporte, montaje, desmontaje, mano de obra especializada y atención personalizada."],
  ["¿Cómo se reserva un evento?", "Se recomienda reservar con al menos un mes de anticipación a través de contacto directo o correo electrónico."],
];

export default function LedScreenSite() {
  const [menu, setMenu] = useState(false);
  const [preview, setPreview] = useState(5);
  const [previewAuto, setPreviewAuto] = useState(true);
  const [faq, setFaq] = useState(0);
  const [lang, setLang] = useState<"ES" | "EN">("ES");
  const [screenW, screenH] = PREVIEW_SIZES[preview];

  // El prototipo va rotando las medidas cada 2,6 s hasta que el visitante elige una.
  useEffect(() => {
    if (!previewAuto) return;
    const timer = setInterval(() => setPreview((current) => (current + 1) % PREVIEW_SIZES.length), 2600);
    return () => clearInterval(timer);
  }, [previewAuto]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <main>
    <header className="site-header"><a className="brand" href="#inicio"><BrandLogo animated /><span>LedScreen</span></a><nav className="desktop-nav"><a href="#inicio">Inicio</a><a href="#servicios">Servicios</a><a href="#pantallas">Pantallas LED</a><a href="#eventos">Eventos</a><a href="#trabajos">Trabajos</a><a className="nav-accent" href="#cotizador">Cotizá</a><a href="#faq">FAQ</a><button className="lang-button" onClick={() => setLang(lang === "ES" ? "EN" : "ES")}>{lang === "ES" ? "EN" : "ES"}</button><a className="nav-cta" href="#contacto">Cotizar</a></nav><button className="menu-button" aria-label="Abrir menú" aria-expanded={menu} onClick={() => setMenu(!menu)}><i /><i /><i /></button></header>
    <div className={menu ? "mobile-menu open" : "mobile-menu"} aria-hidden={!menu}><a onClick={() => setMenu(false)} href="#inicio">Inicio</a><a onClick={() => setMenu(false)} href="#servicios">Servicios</a><a onClick={() => setMenu(false)} href="#pantallas">Pantallas LED</a><a onClick={() => setMenu(false)} href="#eventos">Eventos</a><a onClick={() => setMenu(false)} href="#trabajos">Trabajos</a><a className="nav-accent" onClick={() => setMenu(false)} href="#cotizador">Cotizá</a><a onClick={() => setMenu(false)} href="#faq">FAQ</a><a className="nav-cta" onClick={() => setMenu(false)} href="#contacto">Cotizar</a><div className="mobile-socials">{SOCIALS.map((item) => <a aria-label={item.label} href={item.href} key={item.label}>{item.icon}</a>)}</div></div>

    <section id="inicio" className="hero"><HeroLedWall /><div className="hero-vignette" /><div className="hero-side-shade" /><div className="hero-copy"><div className="hero-badge"><span />PIONEROS EN PANTALLAS LED · DESDE 2010</div><h1><span>Convertimos</span><em>cada evento en luz</em></h1><p>Pantallas LED, sonido, iluminación y estructuras técnicas para eventos sociales, empresariales y gubernamentales en todo Paraguay.</p><div className="hero-actions"><a className="primary" href="#cotizador">Pedir presupuesto</a><a className="secondary" href="#trabajos">Ver trabajos</a></div><div className="stats"><div><strong>15+</strong><span>AÑOS DE EXPERIENCIA</span></div><div><strong>100+</strong><span>M² DE PANTALLA</span></div><div><strong>500+</strong><span>EVENTOS MONTADOS</span></div></div></div></section>
    <div className="marquee"><div>{[0, 1].map((copy) => <span className="marquee-set" key={copy}><b>PANTALLAS LED</b><i>◆</i><b>SONIDO</b><i>◆</i><b>ILUMINACIÓN</b><i>◆</i><b>TRUSS</b><i>◆</i><b>TARIMAS</b><i>◆</i><b>DJ</b><i>◆</i><b>E-PÓSTER</b><i>◆</i><b>STREAMING</b><i>◆</i></span>)}</div></div>

    <section id="servicios" className="original-section services-original"><div className="section-intro reveal"><div className="eyebrow">01 — SERVICIOS</div><h2>Soluciones integrales para eventos</h2><p>Todo lo técnico bajo un mismo equipo: desde la pantalla hasta el último cable. Transporte, montaje y operación en vivo incluidos.</p></div><div className="services-original-grid">{SERVICES.map(([num, title, text]) => <article className="service-original-card reveal" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p><i /></article>)}</div></section>

    <section id="pantallas" className="screens-original"><div className="screens-original-inner"><div className="screen-copy reveal"><div className="eyebrow">02 — PANTALLAS LED</div><h2>Desde 6 m² hasta más de 100 m²</h2><p>Módulos de alta resolución para interior y exterior. Elegimos la medida y el pixel-pitch ideal según tu evento, tu sala y tu presupuesto.</p><div className="preview-size-buttons">{PREVIEW_SIZES.map(([w, h], index) => <button className={preview === index ? "active" : ""} key={`${w}-${h}`} onClick={() => { setPreview(index); setPreviewAuto(false); }}>{w} × {String(h).replace(".", ",")} m</button>)}</div><div className="screen-hint">↗ Tocá una medida para verla a escala junto a una persona de 1,70 m.</div><div className="screen-features"><div><strong>Indoor &amp; Outdoor</strong><span>Estructuras seguras para intemperie.</span></div><div><strong>Cualquier contenido</strong><span>Video, imágenes, presentaciones y streaming en vivo.</span></div></div></div><div className="screen-preview reveal"><div className="preview-grid" /><div className="preview-floor" /><div className="preview-label"><strong>{screenW} × {String(screenH).replace(".", ",")} m</strong><i /><span>{screenW * screenH} m²</span></div><div className="scale-stage"><div className="scale-person" style={{ height: `${1.7 * 100 / 4.6}%` }}><small>1,70 m</small><svg viewBox="0 0 24 80" preserveAspectRatio="xMidYMax meet"><circle cx="12" cy="8.5" r="6.6" /><path d="M12 16.5C6.5 16.5 5 21 5 29L4 47c-.2 2.4 2.3 2.6 2.7.2L8.2 33 8 78c0 2 3 2 3.1 0l.9-23 .9 23c.1 2 3.1 2 3.1 0l-.2-45 1.5 14.2c.4 2.4 2.9 2.2 2.7-.2l-1-18c0-8-1.5-12.5-7-12.5Z" /></svg></div><div className="scale-panel" style={{ width: `${screenW * 100 / 7.8}%`, height: `${screenH * 100 / 4.6}%` }}><div className="scale-panel-wave" /><div className="scale-panel-pixels" /><BrandLogo /></div></div></div></div></section>

    <section id="eventos" className="original-section"><div className="section-intro reveal"><div className="eyebrow">03 — EVENTOS</div><h2>Para cada tipo de evento</h2><p>Experiencia comprobada en producciones sociales, corporativas y oficiales.</p></div><div className="event-grid">{EVENTS.map(([image, title, tags]) => <article className="event-card reveal" key={title}><img src={image} alt={title} /><div className="event-shade" /><div className="event-info"><h3>{title}</h3><div>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>)}</div></section>

    <section id="trabajos" className="works-original"><div className="works-inner"><div className="section-intro reveal"><div className="eyebrow">04 — TRABAJOS</div><h2>Producciones reales</h2><p>Una muestra de montajes recientes en Asunción y el interior del país.</p></div><div className="gallery-grid">{GALLERY.map(([image, title, tall]) => <article className={`gallery-card reveal ${tall ? "tall" : ""}`} key={title}><img src={image} alt={title} /><div><span>{title}</span></div></article>)}</div></div></section>

    <section className="quote-cta-wrap"><div className="quote-cta reveal"><i /><div><h2>Armá tu evento y cotizá al instante</h2><p>Elegí pantalla, sonido, luces y servicios, visualizá la maqueta a escala y enviá tu paquete por WhatsApp.</p></div><a href="#cotizador">Abrir cotizador →</a></div></section>

    <Configurator />

    <section id="faq" className="faq-original"><div className="section-intro centered reveal"><div className="eyebrow">05 — PREGUNTAS FRECUENTES</div><h2>Todo lo que querés saber</h2></div><div className="faq-list">{FAQS.map(([question, answer], index) => <article className="reveal" key={question}><button aria-expanded={faq === index} onClick={() => setFaq(faq === index ? -1 : index)}><span>{question}</span><i className={faq === index ? "open" : ""}>+</i></button><div className={faq === index ? "faq-answer open" : "faq-answer"}><p>{answer}</p></div></article>)}</div></section>

    <section id="contacto" className="contact-original"><i /><div className="contact-inner"><div className="reveal"><div className="eyebrow">06 — CONTACTO</div><h2>Pedí tu presupuesto</h2><p>Contanos lugar, fecha, tipo de evento y necesidades técnicas. Reservá con al menos 1 mes de anticipación.</p><div className="contact-data"><a href="https://wa.me/595981123456"><b>W</b><span><small>WhatsApp / Tel</small><strong>+595 981 123 456</strong></span></a><a href="mailto:hola@ledscreen.com.py"><b>@</b><span><small>Email</small><strong>hola@ledscreen.com.py</strong></span></a><div><b>◎</b><span><small>Cobertura</small><strong>Asunción · todo el país</strong></span></div></div></div><form className="contact-form reveal" onSubmit={(event) => event.preventDefault()}><label><span>Nombre</span><input required placeholder="Nombre" /></label><label><span>Tipo de evento</span><input placeholder="Tipo de evento" /></label><label><span>Fecha</span><input type="date" /></label><label><span>Mensaje</span><textarea rows={4} placeholder="Contanos qué necesitás (lugar, medidas, servicios)" /></label><button type="submit">Enviar solicitud</button></form></div></section>

    <footer><a className="brand" href="#inicio"><span>LedScreen</span></a><div className="footer-tagline">Pantallas LED y soluciones técnicas para eventos · desde 2010</div><div className="footer-socials">{SOCIALS.map((item) => <a aria-label={item.label} href={item.href} key={item.label}>{item.icon}</a>)}</div><div className="footer-copy">© {new Date().getFullYear()} LedScreen</div></footer>
    <div className="social-rail">{SOCIALS.map((item) => <a aria-label={item.label} href={item.href} key={item.label}>{item.icon}</a>)}</div><a className="whatsapp-float" aria-label="Contactar por WhatsApp" href="https://wa.me/595981123456">W</a>
  </main>;
}
