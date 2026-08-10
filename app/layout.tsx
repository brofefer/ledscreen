import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LedScreen · Pantallas LED y soluciones técnicas para eventos",
  description: "Configurá tu evento con pantallas LED, sonido e iluminación profesional.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
