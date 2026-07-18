'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─── Le champ d'ondes ────────────────────────────────────────
   Une nappe de particules qui respire comme une onde sonore
   (le pianiste) et se soulève au passage du curseur comme un
   réseau de capteurs (l'ingénieur IoT). Three.js vanilla,
   sans post-processing : léger, fluide, 60 fps.               */

const COLS = 130;
const ROWS = 72;
const GAP = 0.62;

export default function WaveField({ isDark }: { isDark: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(0, 13, 26);
    camera.lookAt(0, 0, -4);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    /* Nappe de points */
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const cx = (i % COLS) - COLS / 2;
      const cz = Math.floor(i / COLS) - ROWS / 2;
      positions[i * 3] = cx * GAP;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = cz * GAP;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    /* Couleurs : encre discrète, safran là où l'onde monte */
    const inkLight = new THREE.Color('#8f8a7d');
    const inkDark = new THREE.Color('#575249');
    const saffron = new THREE.Color('#F2B41B');

    /* Souris projetée sur la nappe */
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ndc = new THREE.Vector2(10, 10);
    const mouseWorld = new THREE.Vector3(9999, 0, 9999);
    const mouseTarget = new THREE.Vector3(9999, 0, 9999);

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      raycaster.ray.intersectPlane(plane, mouseTarget);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    let t = 0;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const col = geometry.attributes.color as THREE.BufferAttribute;

    const render = () => {
      t += reduce ? 0 : 0.016;
      mouseWorld.lerp(mouseTarget, 0.08);
      const base = isDarkRef.current ? inkDark : inkLight;

      for (let i = 0; i < count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        /* L'onde : deux sinusoïdes croisées, comme des harmoniques */
        let y = Math.sin(x * 0.28 + t * 1.1) * 0.45 + Math.sin(z * 0.32 + t * 0.7) * 0.35;
        /* La bosse du curseur : le capteur qui répond */
        const dx = x - mouseWorld.x;
        const dz = z - mouseWorld.z;
        const d2 = dx * dx + dz * dz;
        const bump = Math.exp(-d2 * 0.055) * 2.6;
        y += bump;
        pos.setY(i, y);

        /* Plus l'onde est haute, plus le point vire au safran */
        const k = Math.min(1, Math.max(0, (y + 0.4) * 0.34 + bump * 0.22));
        col.setXYZ(
          i,
          base.r + (saffron.r - base.r) * k,
          base.g + (saffron.g - base.g) * k,
          base.b + (saffron.b - base.b) * k,
        );
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
