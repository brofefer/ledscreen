"use client";

import * as THREE from "three";
import { LOGO_PATH, LOGO_VIEWBOX, PANEL_GRADIENT } from "../../data/brand";

/**
 * Texturas del contenido que muestran las pantallas LED.
 *
 * Reproducen las tres capas que el prototipo arma con CSS en el panel a
 * escala de la sección "Pantallas LED": el degradado que baja en bucle
 * (`vx-scan`), la trama de píxeles y el isotipo al centro.
 *
 * Los lienzos se dibujan una sola vez y se comparten; cada pantalla crea su
 * propia `Texture` sobre esa misma imagen para poder repetirla según su
 * medida física y desplazarla por su cuenta.
 */

/** Lado del mosaico del degradado, en metros. Equivale al background-size del prototipo. */
export const WAVE_TILE = 1.4;
/** Separación entre píxeles, en metros. Constante: una pantalla más grande tiene más píxeles, no más grandes. */
export const PIXEL_TILE = 0.035;
/** Ancho del isotipo respecto del ancho de la pantalla (34% en el prototipo). */
export const LOGO_RATIO = 0.34;
/** Segundos que tarda el degradado en recorrer un mosaico completo. */
export const SCAN_PERIOD = 3;

let waveImage: HTMLCanvasElement | null = null;
let pixelImage: HTMLCanvasElement | null = null;
let logoImage: HTMLCanvasElement | null = null;

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/** Degradado a 120°, igual que `linear-gradient(120deg, …)`. */
function getWaveImage() {
  if (waveImage) return waveImage;
  const size = 256;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext("2d")!;
  // En CSS 0deg apunta hacia arriba y el eje y del lienzo va hacia abajo.
  const angle = (120 * Math.PI) / 180;
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  const length = Math.abs(size * dx) + Math.abs(size * dy);
  const gradient = ctx.createLinearGradient(
    size / 2 - (dx * length) / 2, size / 2 - (dy * length) / 2,
    size / 2 + (dx * length) / 2, size / 2 + (dy * length) / 2,
  );
  PANEL_GRADIENT.forEach((color, index, colors) => gradient.addColorStop(index / (colors.length - 1), color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  waveImage = canvas;
  return waveImage;
}

/** Punto oscuro por celda: es la separación entre píxeles del panel. */
function getPixelImage() {
  if (pixelImage) return pixelImage;
  const size = 16;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.28, 0, Math.PI * 2);
  ctx.fill();
  pixelImage = canvas;
  return canvas;
}

/** Isotipo blanco sobre fondo transparente. */
function getLogoImage() {
  if (logoImage) return logoImage;
  const scale = 6;
  const canvas = makeCanvas(Math.round(LOGO_VIEWBOX.width * scale), Math.round(LOGO_VIEWBOX.height * scale));
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  // Path2D interpreta la misma cadena que usa el <svg> del sitio.
  ctx.fill(new Path2D(LOGO_PATH), "evenodd");
  logoImage = canvas;
  return canvas;
}

function textureFrom(image: HTMLCanvasElement, repeatX: number, repeatY: number) {
  const texture = new THREE.CanvasTexture(image);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Degradado, repetido según la medida física de la pantalla. */
export const waveTexture = (width: number, height: number) =>
  textureFrom(getWaveImage(), width / WAVE_TILE, height / WAVE_TILE);

/** Trama de píxeles, con paso constante en metros. */
export const pixelTexture = (width: number, height: number) =>
  textureFrom(getPixelImage(), width / PIXEL_TILE, height / PIXEL_TILE);

/** Isotipo, sin repetir. */
export function logoTexture() {
  const texture = new THREE.CanvasTexture(getLogoImage());
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export const logoAspect = LOGO_VIEWBOX.height / LOGO_VIEWBOX.width;
