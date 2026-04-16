'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Idea } from '@/types';

interface Props {
  ideas: (Idea & { color: string })[];
  onSelect: (idea: Idea | null) => void;
  selectedId: string | null;
  isDark?: boolean;
}

export default function LibraryScene({ ideas, onSelect, selectedId, isDark = true }: Props) {
  const mountRef    = useRef<HTMLDivElement>(null);
  const propsRef    = useRef({ onSelect, selectedId });
  propsRef.current  = { onSelect, selectedId };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || ideas.length === 0) return;

    /* ── Renderer ────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    /* ── Scene + Camera ──────────────────────────────────────── */
    const scene = new THREE.Scene();

    // Subtle fog for depth
    if (isDark) {
      scene.fog = new THREE.Fog(0x07070f, 18, 40);
    } else {
      scene.fog = new THREE.Fog(0xf5f3ef, 20, 45);
    }

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 18);
    camera.lookAt(0, 2, 0);

    /* ── Lights ──────────────────────────────────────────────── */
    // Ambient — brighter in light mode
    scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.5 : 1.1));

    // Main directional
    const dirLight = new THREE.DirectionalLight(isDark ? 0xffffff : 0xfff8ee, isDark ? 0.9 : 1.2);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far  = 50;
    dirLight.shadow.radius = 3;
    scene.add(dirLight);

    // Rim light from back-left
    const rimLight = new THREE.DirectionalLight(isDark ? 0x6366F1 : 0xc7d2fe, isDark ? 0.4 : 0.25);
    rimLight.position.set(-8, 6, -4);
    scene.add(rimLight);

    // Warm fill from right
    const fillLight = new THREE.DirectionalLight(isDark ? 0x10B981 : 0xfde68a, isDark ? 0.25 : 0.3);
    fillLight.position.set(8, 2, 4);
    scene.add(fillLight);

    /* ── Materials ───────────────────────────────────────────── */
    // Shelf: dark walnut (dark) / warm oak (light)
    const woodColor = isDark ? 0x1e1a14 : 0x8b6344;
    const woodMat   = new THREE.MeshStandardMaterial({
      color: woodColor, roughness: 0.78, metalness: 0.06,
    });
    // Edge strip on shelves — subtle accent
    const edgeColor = isDark ? 0x2a2520 : 0xa07040;
    const edgeMat   = new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.6, metalness: 0.15 });

    const pagesMat = new THREE.MeshStandardMaterial({ color: 0xf2ede6, roughness: 0.88 });

    /* ── Shelf ───────────────────────────────────────────────── */
    function buildShelf() {
      const g = new THREE.Group();

      // Back panel (darker than wood)
      const backColor = isDark ? 0x100e0b : 0x6b4c30;
      const backMat   = new THREE.MeshStandardMaterial({ color: backColor, roughness: 0.95 });
      const back      = new THREE.Mesh(new THREE.BoxGeometry(8.3, 12.6, 0.1), backMat);
      back.position.z = -1.42;
      g.add(back);

      // Vertical side panels
      const sideGeo = new THREE.BoxGeometry(0.28, 12, 2.8);
      for (const x of [-4.14, 0, 4.14]) {
        const side = new THREE.Mesh(sideGeo, woodMat);
        side.position.x = x;
        side.castShadow = true;
        g.add(side);

        // Front edge strip on each vertical panel
        const edgeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 12, 0.04), edgeMat);
        edgeStrip.position.set(x, 0, 1.42);
        g.add(edgeStrip);
      }

      // Horizontal shelves
      const SHELF_YS_GEO = [-5.9, -3.4, -0.8, 1.8, 4.4, 6.4];
      const rowGeo = new THREE.BoxGeometry(8, 0.28, 2.8);
      for (const y of SHELF_YS_GEO) {
        const row = new THREE.Mesh(rowGeo, woodMat);
        row.position.y = y;
        row.receiveShadow = true;
        g.add(row);

        // Front edge strip on each horizontal shelf
        const frontEdge = new THREE.Mesh(new THREE.BoxGeometry(8, 0.28, 0.05), edgeMat);
        frontEdge.position.set(0, y, 1.42);
        g.add(frontEdge);
      }

      // Top cap
      const topCap = new THREE.Mesh(new THREE.BoxGeometry(8.56, 0.18, 3.1), woodMat);
      topCap.position.set(0, 6.54, 0);
      g.add(topCap);

      scene.add(g);
    }
    buildShelf();

    /* ── Books ───────────────────────────────────────────────── */
    interface BookEntry {
      group: THREE.Group;
      pivot: THREE.Group;
      idea: Idea & { color: string };
      originalPos: THREE.Vector3;
      isOpen: boolean;
    }

    const bookEntries: BookEntry[] = [];

    // Shelf thickness = 0.28, top surface = shelfY + 0.14
    // Book height = 1.75, book center = top surface + h/2
    // => bookCenterY = shelfY + 0.14 + 0.875 = shelfY + 1.015
    const SHELF_YS = [-5.9, -3.4, -0.8, 1.8, 4.4]; // actual shelf Y positions
    const BOOK_H   = 1.75;
    const BOOK_W   = 0.42;
    const BOOK_D   = 1.1;
    const BOOK_GAP = 0.48; // gap between books
    const BOOKS_PER_SECTION = 7; // max books per section per row

    // 2 sections: left [-3.85 → -0.22] and right [0.22 → 3.85]
    const SECTIONS = [
      { xStart: -3.85 },
      { xStart:  0.22 },
    ];

    function buildBook(idea: Idea & { color: string }): { group: THREE.Group; pivot: THREE.Group } {
      const w = BOOK_W, h = BOOK_H, d = BOOK_D;
      const bookColor = new THREE.Color(idea.color);
      const mat = new THREE.MeshStandardMaterial({ color: bookColor, roughness: 0.58, metalness: 0.04 });

      const group = new THREE.Group();

      // Back cover — sits at z=0 (touching shelf back area)
      const backCover = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), mat.clone());
      backCover.position.set(0, 0, 0);
      group.add(backCover);

      // Pages block
      const pages = new THREE.Mesh(new THREE.BoxGeometry(w * 0.86, h * 0.93, d - 0.06), pagesMat);
      pages.position.set(0, 0, d / 2);
      group.add(pages);

      // Pivot hinge on left edge
      const pivot = new THREE.Group();
      pivot.position.x = -w / 2;
      group.add(pivot);

      // Front cover (attached to pivot, offset right by w/2)
      const frontCover = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), mat.clone());
      frontCover.position.set(w / 2, 0, d + 0.02);
      pivot.add(frontCover);

      // Spine strip (emissive accent)
      const spineMat = new THREE.MeshStandardMaterial({
        color: bookColor, emissive: bookColor, emissiveIntensity: 0.35, roughness: 0.4,
      });
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.05, h * 0.88, 0.05), spineMat);
      spine.position.set(-w / 2 + 0.025, 0, d / 2);
      group.add(spine);

      return { group, pivot };
    }

    ideas.forEach((idea, i) => {
      const section  = i % 2;                                   // alternate between left/right
      const rowIdx   = Math.floor(i / (2 * BOOKS_PER_SECTION)); // which shelf row
      const posInRow = Math.floor(i / 2) % BOOKS_PER_SECTION;  // position within section

      const shelfY = SHELF_YS[rowIdx % SHELF_YS.length];
      const by     = shelfY + 0.14 + BOOK_H / 2;              // sit on top of shelf
      const bx     = SECTIONS[section].xStart + posInRow * BOOK_GAP;
      const bz     = -0.8;                                     // inside shelf, back portion

      const { group, pivot } = buildBook(idea);
      group.position.set(bx, by, bz);
      scene.add(group);
      bookEntries.push({ group, pivot, idea, originalPos: new THREE.Vector3(bx, by, bz), isOpen: false });
    });

    /* ── Interactions ────────────────────────────────────────── */
    const raycaster  = new THREE.Raycaster();
    const mouse      = new THREE.Vector2();
    let   openEntry: BookEntry | null = null;

    function closeBook(entry: BookEntry) {
      new TWEEN.Tween(entry.pivot.rotation)
        .to({ y: 0 }, 380)
        .easing(TWEEN.Easing.Quadratic.In)
        .start();
      new TWEEN.Tween(entry.group.position)
        .to({ x: entry.originalPos.x, y: entry.originalPos.y, z: entry.originalPos.z }, 550)
        .delay(200)
        .easing(TWEEN.Easing.Quadratic.In)
        .start();
      entry.isOpen = false;
    }

    function openBook(entry: BookEntry) {
      new TWEEN.Tween(entry.group.position)
        .to({ z: entry.originalPos.z + 2.8, x: 0, y: 2.5 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      new TWEEN.Tween(entry.pivot.rotation)
        .to({ y: -Math.PI * 0.8 }, 680)
        .delay(280)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      entry.isOpen = true;
    }

    function toggleBook(entry: BookEntry) {
      if (openEntry && openEntry !== entry && openEntry.isOpen) {
        closeBook(openEntry);
        propsRef.current.onSelect(null);
      }
      if (entry.isOpen) {
        closeBook(entry);
        openEntry = null;
        propsRef.current.onSelect(null);
      } else {
        openBook(entry);
        openEntry = entry;
        propsRef.current.onSelect(entry.idea);
      }
    }

    const getHitEntry = (e: MouseEvent): BookEntry | null => {
      const rect = mount.getBoundingClientRect();
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const meshes = bookEntries.flatMap(b => {
        const children: THREE.Object3D[] = [];
        b.group.traverse(c => { if ((c as THREE.Mesh).isMesh) children.push(c); });
        return children;
      }) as THREE.Mesh[];
      const hits = raycaster.intersectObjects(meshes, false);
      if (!hits.length) return null;
      const hit = hits[0].object;
      return bookEntries.find(b => { let found = false; b.group.traverse(c => { if (c === hit) found = true; }); return found; }) ?? null;
    };

    const onMouseMove = (e: MouseEvent) => {
      mount.style.cursor = getHitEntry(e) ? 'pointer' : 'auto';
    };
    const onClick = (e: MouseEvent) => {
      const entry = getHitEntry(e);
      if (entry) toggleBook(entry);
    };
    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('click', onClick);

    /* ── Manual orbit (no addon needed) ─────────────────────── */
    let isDragging = false, lastMX = 0, lastMY = 0;
    let spherical = { theta: 0, phi: Math.PI / 4 };
    const radius = 18;

    const updateCamera = () => {
      camera.position.x = radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = radius * Math.cos(spherical.phi) + 2;
      camera.position.z = radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 2, 0);
    };
    updateCamera();

    const onMouseDown = (e: MouseEvent) => { isDragging = true; lastMX = e.clientX; lastMY = e.clientY; };
    const onMouseUp   = () => { isDragging = false; };
    const onMouseDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = (e.clientX - lastMX) * 0.004;
      const dy = (e.clientY - lastMY) * 0.003;
      spherical.theta -= dx;
      spherical.phi    = Math.max(0.25, Math.min(Math.PI / 2.2, spherical.phi + dy));
      lastMX = e.clientX; lastMY = e.clientY;
      updateCamera();
    };
    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseDrag);

    /* ── Animation loop ──────────────────────────────────────── */
    let rafId: number;
    const animate = (time: number) => {
      rafId = requestAnimationFrame(animate);
      TWEEN.update(time);
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    /* ── Resize ──────────────────────────────────────────────── */
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── Cleanup ─────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafId);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('click', onClick);
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseDrag);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideas]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
