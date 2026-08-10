import { LOGO_PATH } from "../data/brand";

/**
 * Marca LedScreen. `animated` reproduce la secuencia del prototipo:
 * el trazo se dibuja, entra el relleno y un degradado lo barre en bucle.
 * Sin la prop, se pinta el logo sólido (uso dentro del panel a escala).
 */
export default function BrandLogo({ animated = false }: { animated?: boolean }) {
  if (!animated) {
    return <span className="logo-symbol" aria-hidden="true"><svg viewBox="0 0 100 78.788"><path d={LOGO_PATH} fill="#eef2f7" fillRule="evenodd" /></svg></span>;
  }
  return <span className="logo-symbol logo-symbol-animated" aria-hidden="true">
    <svg viewBox="0 0 100 78.788">
      <defs>
        <linearGradient id="vxLogoGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="34" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.42" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="oklch(0.85 0.13 230)" />
          <stop offset="0.58" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" />
          <animateTransform attributeName="gradientTransform" type="translate" from="-40 0" to="120 0" dur="3.6s" begin="2.4s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <path className="logo-stroke" pathLength={100} d={LOGO_PATH} fill="none" stroke="#eef2f7" strokeWidth={1.5} strokeLinejoin="round" />
      <path className="logo-fill" d={LOGO_PATH} fill="url(#vxLogoGrad)" fillRule="evenodd" />
    </svg>
  </span>;
}
