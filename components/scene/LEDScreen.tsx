"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScreenKind } from "../../data/screens";
import { LOGO_RATIO, SCAN_PERIOD, logoAspect, logoTexture, pixelTexture, waveTexture } from "./screenTexture";

/**
 * Una pantalla, dibujada con su base en el origen local: así el objeto se
 * puede envolver en `SceneObject` y moverse como cualquier otro equipo.
 *
 * El contenido replica el panel del prototipo: degradado que baja en bucle,
 * trama de píxeles encima y el isotipo al centro.
 */
export default function LEDScreen({ kind, width, height }: { kind: ScreenKind; width: number; height: number }) {
  const wave = useMemo(() => waveTexture(width, height), [width, height]);
  const pixels = useMemo(() => pixelTexture(width, height), [width, height]);
  const logo = useMemo(() => logoTexture(), []);
  const waveRef = useRef(wave);
  const logoMaterial = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => { waveRef.current = wave; }, [wave]);

  // Las texturas son recursos de GPU: hay que soltarlas al cambiar de medida
  // o al quitar la pantalla de la escena.
  useEffect(() => () => { wave.dispose(); }, [wave]);
  useEffect(() => () => { pixels.dispose(); }, [pixels]);
  useEffect(() => () => { logo.dispose(); }, [logo]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    // El degradado sube un mosaico completo por período, igual que `vx-scan`.
    // Se deriva del reloj y no se acumula, para que todas las pantallas vayan
    // sincronizadas aunque se agreguen en distinto momento.
    waveRef.current.offset.y = -((time / SCAN_PERIOD) % 1);
    // Latido suave del isotipo, equivalente al `vx-logo-glow` del prototipo.
    if (logoMaterial.current) {
      logoMaterial.current.opacity = 0.9 + 0.1 * Math.sin((time * Math.PI * 2) / 4);
    }
  });

  const logoWidth = width * LOGO_RATIO;

  return (
    <group>
      <group position={[0, height / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width + 0.18, height + 0.18, 0.18]} />
          <meshStandardMaterial color="#151922" metalness={0.7} roughness={0.28} />
        </mesh>
        {/* Las capas van en materiales básicos: un panel LED emite su propia luz. */}
        <mesh position={[0, 0, 0.101]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={wave} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.104]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={pixels} transparent opacity={0.55} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0, 0.107]}>
          <planeGeometry args={[logoWidth, logoWidth * logoAspect]} />
          <meshBasicMaterial ref={logoMaterial} map={logo} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      {kind === "E-Poster" && <group>
        <mesh position={[0, -0.06, 0]} castShadow>
          <boxGeometry args={[1.12, 0.12, 0.48]} />
          <meshStandardMaterial color="#151a20" metalness={0.65} roughness={0.32} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.72, 0.06, 0.68]} />
          <meshStandardMaterial color="#222832" metalness={0.55} roughness={0.4} />
        </mesh>
      </group>}
    </group>
  );
}
