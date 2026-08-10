"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroLedWall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vw = window.innerWidth;
    const cols = Math.max(24, vw < 600 ? 34 : vw < 900 ? 46 : 64);
    const rows = Math.round(cols * 0.46);
    const gap = 0.62;
    const count = cols * rows;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(0, 0, 26);
    const geometry = new THREE.BoxGeometry(0.42, 0.42, 0.42);
    const material = new THREE.MeshBasicMaterial({ toneMapped: false });
    const wall = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    const base = new Float32Array(count * 3);
    let i = 0;
    for (let row = 0; row < rows; row += 1) for (let col = 0; col < cols; col += 1) {
      const x = (col - cols / 2) * gap;
      const y = (row - rows / 2) * gap;
      base[i * 3] = x; base[i * 3 + 1] = y;
      dummy.position.set(x, y, 0); dummy.updateMatrix(); wall.setMatrixAt(i, dummy.matrix); i += 1;
    }
    scene.add(wall);
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    const resize = () => {
      const width = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    resize();
    const color = new THREE.Color();
    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const time = still ? 6.2 : clock.getElapsedTime();
      for (let item = 0; item < count; item += 1) {
        const x = base[item * 3], y = base[item * 3 + 1];
        const wave = Math.sin(x * .25 + time) + Math.cos(y * .3 + time * .8) + Math.sin((x + y) * .14 + time * 1.25);
        const brightness = (wave + 3) / 6;
        const hue = .55 + .26 * (.5 + .5 * Math.sin(x * .05 + y * .04 + time * .25));
        color.setHSL(hue, .85, .1 + .55 * brightness * brightness); wall.setColorAt(item, color);
        if (!still) { dummy.position.set(x, y, wave * .55); dummy.updateMatrix(); wall.setMatrixAt(item, dummy.matrix); }
      }
      if (wall.instanceColor) wall.instanceColor.needsUpdate = true;
      if (!still) wall.instanceMatrix.needsUpdate = true;
      pointer.x += (pointer.tx - pointer.x) * .05; pointer.y += (pointer.ty - pointer.y) * .05;
      wall.rotation.y = pointer.x * .28 + (still ? 0 : Math.sin(time * .15) * .05);
      wall.rotation.x = -pointer.y * .18;
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame); window.removeEventListener("pointermove", onPointer); observer.disconnect();
      geometry.dispose(); material.dispose(); renderer.dispose();
    };
  }, []);
  return <canvas ref={canvasRef} className="hero-led-wall" aria-hidden="true" />;
}
