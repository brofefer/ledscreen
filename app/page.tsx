import type { Metadata } from "next";
import LedScreenSite from "../components/LedScreenSite";

export const metadata: Metadata = {
  title: "LedScreen · Pantallas LED y soluciones técnicas para eventos",
  description: "Pantallas LED, sonido, iluminación y estructuras técnicas para eventos en Paraguay.",
};

export default function Home() {
  return <LedScreenSite />;
}
