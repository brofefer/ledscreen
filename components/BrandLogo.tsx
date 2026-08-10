const LOGO_PATH = "M49.036 0H72.727l3.031 1.377 1.652 3.306-.275 2.755-1.102 1.653H57.025l-5.785 1.377-4.684 2.755-2.203 2.204-2.48 3.857-1.653 6.887.551 5.234 1.929 4.683 4.132 5.234 1.928 1.653v.551l-9.642 11.019-.826 1.929v2.204l.826 1.928 2.48 1.928 11.295.276v.551l-3.031 3.581H3.857l-1.929-.826L0 63.361v-3.306l.826-1.653L14.05 42.7l4.683-6.336 2.755-2.755 1.102-1.929 1.377-1.101 1.102-1.929 2.755-2.755 1.102-1.928 2.754-2.755 1.102-1.928 1.378-1.102 1.102-1.929 9.642-11.019 2.479-3.581L49.036.275Zm9.642 11.846 35.261.275.551.551 2.48 3.306H73.829l-2.479 1.377-1.102 1.929-.276 1.928 1.378 3.306 25.895 30.027 1.653 2.755L100 60.882v5.785l-2.479 6.06-3.857 3.857-4.408 1.928-49.311.276 3.03-4.132h25.896l2.479-1.102 1.928-3.306-.275-2.755-1.653-2.479-1.653-1.378-1.102-1.928-3.03-3.03-.827-1.653-3.305-3.306-9.367-11.846-4.959-5.234-3.03-5.234-.551-2.204v-4.959l1.102-3.581 1.928-3.03 3.306-3.03 3.031-1.653 3.03-.827 2.755.001Z";

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
