import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hero3DVisualProps {
  className?: string;
}

/**
 * Creates a procedural dynamic canvas texture for the Earth's continents and oceans
 * with emerald landmasses, deep navy/slate oceans, and subtle atmospheric contours.
 */
function createEarthProceduralTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep oceanic background
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#0a1512');
    oceanGrad.addColorStop(0.5, '#0d1d18');
    oceanGrad.addColorStop(1, '#0a1311');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle oceanic latitude grid lines
    ctx.strokeStyle = 'rgba(181, 161, 106, 0.12)';
    ctx.lineWidth = 1;
    for (let y = 32; y < 512; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }
    for (let x = 32; x < 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    // Procedural representation of major continents & Indian Subcontinent
    ctx.fillStyle = '#2d5a3f';
    ctx.shadowColor = '#5a8a6c';
    ctx.shadowBlur = 8;

    // Indian Subcontinent & South Asia (centered prominently)
    ctx.beginPath();
    // India triangular peninsula
    ctx.moveTo(680, 200);
    ctx.lineTo(740, 210);
    ctx.lineTo(715, 290); // Southern tip (Kanyakumari)
    ctx.lineTo(670, 250);
    ctx.closePath();
    ctx.fill();

    // Himalayan arc & Tibetan plateau
    ctx.beginPath();
    ctx.ellipse(710, 185, 80, 25, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Central & Western Asia
    ctx.beginPath();
    ctx.ellipse(620, 180, 90, 45, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // East Asia & Southeast Asia
    ctx.beginPath();
    ctx.ellipse(800, 210, 65, 45, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(830, 280, 50, 25, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Africa
    ctx.beginPath();
    ctx.ellipse(540, 260, 60, 95, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Europe
    ctx.beginPath();
    ctx.ellipse(530, 150, 50, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Americas (Western Hemisphere)
    ctx.beginPath();
    ctx.ellipse(260, 170, 75, 55, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(300, 310, 50, 85, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Australia
    ctx.beginPath();
    ctx.ellipse(850, 360, 55, 38, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Atmospheric cloud streaks (ivory wisps)
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(241, 239, 232, 0.18)';
    for (let i = 0; i < 28; i++) {
      const cx = (i * 39) % 1024;
      const cy = 90 + ((i * 47) % 320);
      const cw = 60 + ((i * 13) % 110);
      const ch = 10 + ((i * 5) % 18);
      ctx.beginPath();
      ctx.ellipse(cx, cy, cw, ch, ((i % 4) - 2) * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const Hero3DVisual: React.FC<Hero3DVisualProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0c0b, 0.06);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 6.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
    } catch {
      setWebGlAvailable(false);
      return;
    }

    // Directional Lighting for Volumetric 3D Aesthetic (inspired by reference template)
    const ambientLight = new THREE.AmbientLight(0x2a3630, 1.8);
    scene.add(ambientLight);

    const primaryDirLight = new THREE.DirectionalLight(0xf1efe8, 2.4);
    primaryDirLight.position.set(5, 6, 4);
    scene.add(primaryDirLight);

    const emeraldRimLight = new THREE.DirectionalLight(0x5a8a6c, 3.2);
    emeraldRimLight.position.set(-6, -3, 2);
    scene.add(emeraldRimLight);

    const goldAccentLight = new THREE.PointLight(0xb5a16a, 2.0, 15);
    goldAccentLight.position.set(2, -4, 3);
    scene.add(goldAccentLight);

    // Root Group for smooth parallax & scroll response
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ==========================================
    // 1. THE SLOWLY ROTATING GREEN EARTH PLANET
    // ==========================================
    const planetGroup = new THREE.Group();
    planetGroup.position.set(-0.35, 0.1, 0);
    worldGroup.add(planetGroup);

    const earthTexture = createEarthProceduralTexture();
    const planetRadius = 1.75;
    const planetGeom = new THREE.SphereGeometry(planetRadius, 48, 48);
    const planetMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.55,
      metalness: 0.15,
      bumpScale: 0.05
    });
    const earthMesh = new THREE.Mesh(planetGeom, planetMat);
    planetGroup.add(earthMesh);

    // Atmospheric Glow Halo
    const atmosphereGeom = new THREE.SphereGeometry(planetRadius * 1.045, 36, 36);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x5a8a6c,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    planetGroup.add(atmosphereMesh);

    // Elegant Latitude/Longitude Coordinate Rings (Antique Brass & Olive)
    const ringRadius = planetRadius * 1.08;
    const equatorGeom = new THREE.BufferGeometry();
    const equatorPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      equatorPts.push(new THREE.Vector3(ringRadius * Math.cos(a), 0, ringRadius * Math.sin(a)));
    }
    equatorGeom.setFromPoints(equatorPts);
    const equatorMat = new THREE.LineBasicMaterial({
      color: 0xb5a16a,
      transparent: true,
      opacity: 0.55
    });
    const equatorLine = new THREE.Line(equatorGeom, equatorMat);
    planetGroup.add(equatorLine);

    // Inclined Tropic Parallel
    const tropicGeom = new THREE.BufferGeometry();
    const tropicPts: THREE.Vector3[] = [];
    const trR = ringRadius * Math.cos((23.5 * Math.PI) / 180);
    const trY = ringRadius * Math.sin((23.5 * Math.PI) / 180);
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      tropicPts.push(new THREE.Vector3(trR * Math.cos(a), trY, trR * Math.sin(a)));
    }
    tropicGeom.setFromPoints(tropicPts);
    const tropicMat = new THREE.LineBasicMaterial({
      color: 0x5a8a6c,
      transparent: true,
      opacity: 0.35
    });
    const tropicLine = new THREE.Line(tropicGeom, tropicMat);
    planetGroup.add(tropicLine);

    // Biodiversity Hotspot Beacons (Western Ghats, Sundarbans, Himalayas, Central Forests)
    const hotspots = [
      { lat: 14.5, lon: 75.8, color: 0xb5a16a, label: 'Western Ghats' },
      { lat: 21.9, lon: 89.0, color: 0x5a8a6c, label: 'Sundarbans' },
      { lat: 29.5, lon: 79.2, color: 0xb5a16a, label: 'Terai Arc' },
      { lat: 22.4, lon: 80.6, color: 0x5a8a6c, label: 'Central Highlands' }
    ];

    const hotspotNodes: THREE.Mesh[] = [];
    const pulseTargetRings: THREE.Line[] = [];
    const beaconGeom = new THREE.SphereGeometry(0.045, 12, 12);

    hotspots.forEach((spot) => {
      const phi = (90 - spot.lat) * (Math.PI / 180);
      const theta = (spot.lon + 180) * (Math.PI / 180);
      const x = -planetRadius * Math.sin(phi) * Math.cos(theta);
      const z = planetRadius * Math.sin(phi) * Math.sin(theta);
      const y = planetRadius * Math.cos(phi);

      const beaconMat = new THREE.MeshBasicMaterial({ color: spot.color });
      const beaconMesh = new THREE.Mesh(beaconGeom, beaconMat);
      beaconMesh.position.set(x, y, z);
      planetGroup.add(beaconMesh);
      hotspotNodes.push(beaconMesh);

      // Radar pulse ring
      const targetRingGeom = new THREE.BufferGeometry();
      const ringPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(0.09 * Math.cos(a), 0.09 * Math.sin(a), 0));
      }
      targetRingGeom.setFromPoints(ringPts);
      const targetRingMat = new THREE.LineBasicMaterial({
        color: spot.color,
        transparent: true,
        opacity: 0.6
      });
      const targetRing = new THREE.Line(targetRingGeom, targetRingMat);
      targetRing.position.set(x, y, z);
      targetRing.lookAt(new THREE.Vector3(x * 2, y * 2, z * 2));
      planetGroup.add(targetRing);
      pulseTargetRings.push(targetRing);
    });

    // Axial Earth Tilt
    planetGroup.rotation.z = -0.38; // ~22 degrees
    planetGroup.rotation.x = 0.22;

    // =========================================================================
    // 2. VOLUMETRIC FLOATING 3D OBJECTS (Directly Inspired by Reference Image)
    // =========================================================================

    // A. Major Volumetric Cube / Monolith (tilted, smooth satin charcoal with gold bevels)
    const cubeGeom = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0x1d2420,
      roughness: 0.35,
      metalness: 0.45,
      wireframe: false
    });
    const cubeMesh = new THREE.Mesh(cubeGeom, cubeMat);
    cubeMesh.position.set(1.9, 0.9, 0.4);
    cubeMesh.rotation.set(0.6, 0.75, 0.2);
    worldGroup.add(cubeMesh);

    // Inner wireframe glow for the cube
    const cubeWireGeom = new THREE.WireframeGeometry(cubeGeom);
    const cubeWireMat = new THREE.LineBasicMaterial({
      color: 0xb5a16a,
      transparent: true,
      opacity: 0.4
    });
    const cubeWireMesh = new THREE.LineSegments(cubeWireGeom, cubeWireMat);
    cubeMesh.add(cubeWireMesh);

    // B. Volumetric Torus / Orbital Floating Ring (like the prominent ring in reference)
    const torusGeom = new THREE.TorusGeometry(0.75, 0.08, 16, 48);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x3d5a4c,
      roughness: 0.4,
      metalness: 0.55
    });
    const torusMesh = new THREE.Mesh(torusGeom, torusMat);
    torusMesh.position.set(1.5, -1.2, 0.8);
    torusMesh.rotation.set(1.1, 0.4, 0.7);
    worldGroup.add(torusMesh);

    // C. Striated Satellite Sphere (reminiscent of the striped sphere in reference)
    const satelliteGeom = new THREE.SphereGeometry(0.42, 32, 32);
    const satelliteMat = new THREE.MeshStandardMaterial({
      color: 0x22352c,
      roughness: 0.4,
      metalness: 0.3
    });
    const satelliteMesh = new THREE.Mesh(satelliteGeom, satelliteMat);
    satelliteMesh.position.set(2.4, -0.2, -0.6);
    worldGroup.add(satelliteMesh);

    // Latitudinal stripe rings on the satellite sphere
    for (let s = -2; s <= 2; s++) {
      const sRingGeom = new THREE.BufferGeometry();
      const sPts: THREE.Vector3[] = [];
      const sLat = (s * 25 * Math.PI) / 180;
      const sr = 0.43 * Math.cos(sLat);
      const sy = 0.43 * Math.sin(sLat);
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        sPts.push(new THREE.Vector3(sr * Math.cos(a), sy, sr * Math.sin(a)));
      }
      sRingGeom.setFromPoints(sPts);
      const sRingMat = new THREE.LineBasicMaterial({
        color: s === 0 ? 0xb5a16a : 0x5a8a6c,
        transparent: true,
        opacity: 0.5
      });
      const sLine = new THREE.Line(sRingGeom, sRingMat);
      satelliteMesh.add(sLine);
    }

    // D. Small Deep Background Geodesic Floating Polyhedron
    const smallPolyGeom = new THREE.IcosahedronGeometry(0.24, 0);
    const smallPolyMat = new THREE.MeshStandardMaterial({
      color: 0xb5a16a,
      roughness: 0.25,
      metalness: 0.7
    });
    const smallPolyMesh = new THREE.Mesh(smallPolyGeom, smallPolyMat);
    smallPolyMesh.position.set(-2.2, 1.6, -1.5);
    worldGroup.add(smallPolyMesh);

    // E. Floating Coordinate Dot Matrix Cloud (subtle research aesthetic)
    const dotsCount = 45;
    const dotsGeom = new THREE.BufferGeometry();
    const dotsPositions = new Float32Array(dotsCount * 3);
    for (let i = 0; i < dotsCount; i++) {
      dotsPositions[i * 3] = (Math.random() - 0.5) * 8;
      dotsPositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      dotsPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    dotsGeom.setAttribute('position', new THREE.BufferAttribute(dotsPositions, 3));
    const dotsMat = new THREE.PointsMaterial({
      color: 0xb5a16a,
      size: 0.035,
      transparent: true,
      opacity: 0.35
    });
    const dotsCloud = new THREE.Points(dotsGeom, dotsMat);
    worldGroup.add(dotsCloud);

    // ==========================================
    // 3. INTERACTION & SCROLL PARALLAX
    // ==========================================
    let pointerX = 0;
    let pointerY = 0;
    let scrollYOffset = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = (e.clientX - rect.left) / rect.width - 0.5;
      pointerY = (e.clientY - rect.top) / rect.height - 0.5;
      setIsInteracting(true);
    };

    const handlePointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      setIsInteracting(false);
    };

    const handleScroll = () => {
      scrollYOffset = window.scrollY * 0.0018;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver to pause rendering when scrolled out of view
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop (using performance.now to prevent THREE.Clock deprecation warnings)
    let frameId = 0;
    const startTime = performance.now();
    let lastTime = startTime;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const currentTime = performance.now();
      const elapsed = (currentTime - startTime) * 0.001;
      const delta = (currentTime - lastTime) * 0.001;
      lastTime = currentTime;

      if (!prefersReducedMotion) {
        // Hypnotic, slow, majestic rotation of the green Earth planet
        earthMesh.rotation.y += 0.0035;

        // Pulse hotspot beacon rings
        const scale = 1 + Math.sin(elapsed * 2.8) * 0.22;
        pulseTargetRings.forEach((ring) => {
          ring.scale.set(scale, scale, scale);
        });

        // Harmonic breathing/bobbing of floating volumetric 3D shapes
        cubeMesh.position.y = 0.9 + Math.sin(elapsed * 1.2) * 0.08;
        cubeMesh.rotation.x += 0.004;
        cubeMesh.rotation.y += 0.006;

        torusMesh.position.y = -1.2 + Math.cos(elapsed * 1.4) * 0.09;
        torusMesh.rotation.z += 0.005;
        torusMesh.rotation.x += 0.003;

        satelliteMesh.position.y = -0.2 + Math.sin(elapsed * 0.9 + 1) * 0.07;
        satelliteMesh.rotation.y += 0.008;

        smallPolyMesh.rotation.x += 0.01;
        smallPolyMesh.rotation.y += 0.012;
      }

      // Smooth pointer parallax + scroll rotation integration
      const targetRotY = pointerX * 0.65 + scrollYOffset * 1.4;
      const targetRotX = pointerY * 0.45 - scrollYOffset * 0.35;

      worldGroup.rotation.y += (targetRotY - worldGroup.rotation.y) * 0.06;
      worldGroup.rotation.x += (targetRotX - worldGroup.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / (container.clientHeight || 1);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      earthTexture.dispose();
      planetGeom.dispose();
      planetMat.dispose();
      cubeGeom.dispose();
      cubeMat.dispose();
      torusGeom.dispose();
      torusMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-[400px] sm:h-[480px] lg:h-[540px] relative select-none cursor-grab active:cursor-grabbing overflow-hidden ${className}`}
      role="region"
      aria-label="Interactive 3D Spatial Planetary and Geometric Visual"
    >
      {/* Fallback for environments where WebGL is unavailable */}
      {!webGlAvailable && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#131513] border border-[#30322E] rounded-lg">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#B5A16A]/50 flex items-center justify-center animate-spin">
            <span className="font-mono text-xs text-[#B5A16A]">EARTH 3D</span>
          </div>
          <p className="mt-4 text-xs font-mono text-[#A5A59C]">
            Interactive 3D Globe · Standard 2D Projection Active
          </p>
        </div>
      )}

      {/* Cinematic Metadata Overlay Ticks (Precision Research Look) */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#5A8A6C] animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#B5A16A] bg-[#0B0C0B]/80 px-2 py-0.5 rounded border border-[#30322E]/80 backdrop-blur-xs">
          PLANET BIOSPHERE · 3D REAL-TIME
        </span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-3 font-mono text-[10px] text-[#A5A59C]/80 bg-[#0B0C0B]/80 px-2.5 py-1 rounded border border-[#30322E]/80 backdrop-blur-xs">
        <span className="text-[#F1EFE8]">AXIAL TILT 23.5°</span>
        <span className="text-[#30322E]">|</span>
        <span className="text-[#B5A16A]">SCROLL PARALLAX ACTIVE</span>
      </div>
    </div>
  );
};
