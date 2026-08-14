"use client";

import { Lightformer, Environment } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { SceneEnvironment } from "../../data/environments";

/**
 * Lo que rodea al escenario: cielo, paredes e iluminación de entorno.
 *
 * El mapa de entorno se arma con `Lightformer` en vez de un preset de drei.
 * Los presets descargan un HDRI de un CDN de terceros, y además viajaban
 * dentro del mismo Suspense que el resto de la escena: si tardaba, el
 * visitante veía un lienzo vacío. Acá se genera localmente y una sola vez.
 */

/** Cúpula con degradado vertical, para el ambiente al aire libre. */
function SkyDome({ horizon, zenith }: { horizon: string; zenith: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, zenith);
    gradient.addColorStop(0.62, horizon);
    gradient.addColorStop(1, horizon);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [horizon, zenith]);

  useEffect(() => () => { texture.dispose(); }, [texture]);

  return <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
    <sphereGeometry args={[90, 24, 16]} />
    <meshBasicMaterial map={texture} side={THREE.BackSide} depthWrite={false} fog={false} toneMapped={false} />
  </mesh>;
}

/** Paredes y techo del salón. La caja es abierta al frente, hacia la cámara. */
function Room({ span, color, ceiling }: { span: number; color: string; ceiling: string }) {
  const width = Math.max(24, span + 14);
  const depth = 30;
  const height = 9;
  return <group>
    {/* fondo */}
    <mesh position={[0, height / 2, -7]} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} roughness={0.94} />
    </mesh>
    {/* laterales */}
    <mesh position={[-width / 2, height / 2, depth / 2 - 7]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[depth, height]} />
      <meshStandardMaterial color={color} roughness={0.94} />
    </mesh>
    <mesh position={[width / 2, height / 2, depth / 2 - 7]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[depth, height]} />
      <meshStandardMaterial color={color} roughness={0.94} />
    </mesh>
    {/* techo */}
    <mesh position={[0, height, depth / 2 - 7]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={ceiling} roughness={0.98} />
    </mesh>
  </group>;
}

/** Mapa de entorno propio: da reflejos a los metales sin pedir nada por red. */
function EnvironmentRig({ environment }: { environment: SceneEnvironment }) {
  const { key } = environment;
  // `frames={1}` hornea el mapa una sola vez; la `key` fuerza que se rehaga
  // al cambiar de ambiente, que si no quedaría el del ambiente anterior.
  return <Environment key={key} resolution={128} frames={1}>
    {key === "outdoor" && <>
      <Lightformer form="rect" intensity={3.2} color="#fff6e6" scale={[18, 18, 1]} position={[6, 12, -8]} rotation={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.1} color="#cfe6ff" scale={[40, 20, 1]} position={[0, 14, 10]} rotation={[Math.PI / 2, 0, 0]} />
    </>}
    {key === "salon" && <>
      <Lightformer form="rect" intensity={1.6} color="#fff4e4" scale={[22, 10, 1]} position={[0, 11, 2]} rotation={[Math.PI / 2, 0, 0]} />
      <Lightformer form="rect" intensity={0.7} color="#e6e2d8" scale={[14, 8, 1]} position={[-11, 5, 4]} rotation={[0, Math.PI / 2, 0]} />
      <Lightformer form="rect" intensity={0.7} color="#e6e2d8" scale={[14, 8, 1]} position={[11, 5, 4]} rotation={[0, -Math.PI / 2, 0]} />
    </>}
    {key === "party" && <>
      <Lightformer form="rect" intensity={0.55} color="#9fd8ff" scale={[16, 6, 1]} position={[0, 9, 4]} rotation={[Math.PI / 2, 0, 0]} />
      <Lightformer form="rect" intensity={0.35} color="#c58cff" scale={[10, 6, 1]} position={[-9, 4, 3]} rotation={[0, Math.PI / 2, 0]} />
      <Lightformer form="rect" intensity={0.35} color="#38d6ff" scale={[10, 6, 1]} position={[9, 4, 3]} rotation={[0, -Math.PI / 2, 0]} />
    </>}
  </Environment>;
}

export default function SceneSurroundings({ environment, span }: { environment: SceneEnvironment; span: number }) {
  return <group>
    {environment.sky && <SkyDome horizon="#dceaf4" zenith="#5ea3d8" />}
    {environment.room && <Room span={span} color="#8a8378" ceiling="#5f5a52" />}
    <EnvironmentRig environment={environment} />
  </group>;
}
