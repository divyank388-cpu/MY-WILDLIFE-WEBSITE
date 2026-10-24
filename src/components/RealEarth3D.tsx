import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Globe,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  RotateCw,
  Info,
  Layers,
  ChevronRight,
  Eye,
  Wind,
  Trees,
  Sun,
  Droplets,
  Flame,
  CheckCircle2
} from 'lucide-react';

export type EarthViewMode = 'globe' | 'heatmap';
export type HeatmapLayer = 'aqi' | 'forest' | 'renewable' | 'wetlands';

/**
 * Creates an equirectangular procedural texture of the world
 * with optional interactive Environmental Heatmap overlays directly painted across India
 */
function createWorldTexture(
  viewMode: EarthViewMode,
  heatmapLayer: HeatmapLayer
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Deep Oceanic Base with bathymetric gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#06111a');
    oceanGrad.addColorStop(0.2, '#091c29');
    oceanGrad.addColorStop(0.5, '#0a2333');
    oceanGrad.addColorStop(0.8, '#091c29');
    oceanGrad.addColorStop(1, '#06111a');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Oceanic coordinate grid lines
    ctx.strokeStyle = 'rgba(181, 161, 106, 0.09)';
    ctx.lineWidth = 1;
    for (let y = 64; y < 1024; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }
    for (let x = 64; x < 2048; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }

    // 2. Global Continents Background
    ctx.fillStyle = '#1c3e2e';
    ctx.strokeStyle = '#2d5a43';
    ctx.lineWidth = 2;

    // --- EURASIA (excluding Indian Peninsula for specialized rendering) ---
    ctx.fillStyle = '#1e382b';
    ctx.beginPath();
    ctx.moveTo(1020, 380);
    ctx.lineTo(1050, 330);
    ctx.lineTo(1080, 260);
    ctx.lineTo(1200, 230);
    ctx.lineTo(1400, 210);
    ctx.lineTo(1650, 240);
    ctx.lineTo(1680, 310);
    ctx.lineTo(1600, 370);
    ctx.lineTo(1550, 440);
    ctx.lineTo(1520, 490);
    ctx.lineTo(1380, 430);
    ctx.lineTo(1260, 440);
    ctx.lineTo(1200, 390);
    ctx.lineTo(1080, 390);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // British Isles
    ctx.beginPath();
    ctx.ellipse(1040, 290, 14, 24, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Japan
    ctx.beginPath();
    ctx.ellipse(1680, 370, 10, 32, -0.6, 0, Math.PI * 2);
    ctx.fill();

    // Southeast Asia islands
    ctx.beginPath();
    ctx.ellipse(1560, 520, 35, 12, 0.2, 0, Math.PI * 2);
    ctx.ellipse(1620, 540, 35, 12, -0.1, 0, Math.PI * 2);
    ctx.ellipse(1630, 500, 30, 25, 0, 0, Math.PI * 2);
    ctx.ellipse(1690, 520, 45, 18, 0.1, 0, Math.PI * 2);
    ctx.ellipse(1640, 440, 14, 25, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // --- AFRICA ---
    ctx.fillStyle = '#223628';
    ctx.beginPath();
    ctx.moveTo(1030, 400);
    ctx.lineTo(1200, 400);
    ctx.lineTo(1260, 490);
    ctx.lineTo(1220, 600);
    ctx.lineTo(1160, 710);
    ctx.lineTo(1100, 630);
    ctx.lineTo(1060, 530);
    ctx.lineTo(980, 470);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Madagascar
    ctx.beginPath();
    ctx.ellipse(1270, 640, 14, 38, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // --- NORTH AMERICA ---
    ctx.fillStyle = '#1c382b';
    ctx.beginPath();
    ctx.moveTo(350, 180);
    ctx.lineTo(460, 210);
    ctx.lineTo(600, 240);
    ctx.lineTo(620, 350);
    ctx.lineTo(580, 440);
    ctx.lineTo(520, 470);
    ctx.lineTo(490, 520);
    ctx.lineTo(430, 460);
    ctx.lineTo(390, 360);
    ctx.lineTo(350, 270);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Greenland
    ctx.fillStyle = '#2d4239';
    ctx.beginPath();
    ctx.ellipse(750, 160, 55, 75, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // --- SOUTH AMERICA ---
    ctx.fillStyle = '#1a3c2c';
    ctx.beginPath();
    ctx.moveTo(500, 520);
    ctx.lineTo(630, 560);
    ctx.lineTo(590, 670);
    ctx.lineTo(540, 760);
    ctx.lineTo(510, 830);
    ctx.lineTo(480, 720);
    ctx.lineTo(460, 590);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // --- AUSTRALIA & OCEANIA ---
    ctx.fillStyle = '#2a3d2b';
    ctx.beginPath();
    ctx.moveTo(1700, 620);
    ctx.lineTo(1780, 640);
    ctx.lineTo(1820, 720);
    ctx.lineTo(1780, 780);
    ctx.lineTo(1680, 770);
    ctx.lineTo(1640, 680);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // New Zealand
    ctx.beginPath();
    ctx.ellipse(1870, 780, 8, 24, 0.4, 0, Math.PI * 2);
    ctx.ellipse(1860, 810, 8, 22, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Antarctica
    ctx.fillStyle = '#1e332c';
    ctx.beginPath();
    ctx.rect(0, 940, 2048, 84);
    ctx.fill();

    // 3. Indian Subcontinent Base Contour
    ctx.beginPath();
    ctx.moveTo(1410, 400); // Gujarat/Rann of Kutch
    ctx.lineTo(1450, 370); // Punjab / Kashmir northern arc
    ctx.lineTo(1510, 390); // Nepal / Sikkim Himalayan border
    ctx.lineTo(1560, 410); // Arunachal Pradesh / Assam
    ctx.lineTo(1530, 440); // Sundarbans / Bengal delta
    ctx.lineTo(1500, 480); // Coromandel Coast
    ctx.lineTo(1460, 540); // Kanyakumari southern apex
    ctx.lineTo(1430, 470); // Malabar / Western Ghats coast
    ctx.lineTo(1410, 430); // Konkan coast
    ctx.closePath();

    if (viewMode === 'globe') {
      // Natural Realistic Representation
      ctx.fillStyle = '#26593f';
      ctx.fill();
      ctx.strokeStyle = '#b5a16a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Atmospheric clouds
      ctx.fillStyle = 'rgba(241, 239, 232, 0.15)';
      for (let c = 0; c < 45; c++) {
        const cx = (c * 67) % 2048;
        const cy = 120 + ((c * 43) % 760);
        ctx.beginPath();
        ctx.ellipse(cx, cy, 60 + (c % 10) * 8, 12 + (c % 5) * 3, 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // ========================================================
      // INTERACTIVE ENVIRONMENTAL HEATMAP OVERLAY DIRECTLY ON SURFACE
      // ========================================================
      ctx.save();
      ctx.clip(); // Restrict the intense thermal heatmap cleanly to the subcontinent landmass

      if (heatmapLayer === 'aqi') {
        // --- AIR QUALITY INDEX (PM2.5) HEATMAP ---
        // Base landmass color
        ctx.fillStyle = '#1a2920';
        ctx.fillRect(1380, 350, 220, 220);

        // Severe AQI plume over Indo-Gangetic Basin (Punjab, Haryana, Delhi NCR, UP, Bihar, WB)
        const aqiPlume = ctx.createRadialGradient(1465, 405, 10, 1475, 415, 80);
        aqiPlume.addColorStop(0, '#991b1b'); // Deep crimson (Severe 400+)
        aqiPlume.addColorStop(0.35, '#dc2626'); // Red (Very Poor 320)
        aqiPlume.addColorStop(0.65, '#ea580c'); // Orange (Poor 220)
        aqiPlume.addColorStop(0.85, '#eab308'); // Moderate 150
        aqiPlume.addColorStop(1, 'rgba(34, 197, 94, 0.1)'); // Clean Green
        ctx.fillStyle = aqiPlume;
        ctx.fillRect(1380, 350, 220, 220);

        // Second severe hotspot over eastern industrial coal belt (Jharkhand/WB)
        const aqiEast = ctx.createRadialGradient(1510, 425, 5, 1510, 425, 45);
        aqiEast.addColorStop(0, '#7f1d1d');
        aqiEast.addColorStop(0.6, '#dc2626');
        aqiEast.addColorStop(1, 'rgba(234, 88, 12, 0)');
        ctx.fillStyle = aqiEast;
        ctx.beginPath();
        ctx.arc(1510, 425, 45, 0, Math.PI * 2);
        ctx.fill();

        // Clean air zones (Western Ghats & Himalayas) in cool emerald/cyan
        const cleanGhats = ctx.createLinearGradient(1420, 450, 1460, 530);
        cleanGhats.addColorStop(0, 'rgba(16, 185, 129, 0.55)');
        cleanGhats.addColorStop(1, 'rgba(6, 182, 212, 0.65)');
        ctx.fillStyle = cleanGhats;
        ctx.beginPath();
        ctx.ellipse(1435, 480, 18, 55, 0.35, 0, Math.PI * 2);
        ctx.fill();

      } else if (heatmapLayer === 'forest') {
        // --- FOREST CANOPY & BIODIVERSITY DENSITY HEATMAP ---
        ctx.fillStyle = '#111814';
        ctx.fillRect(1380, 350, 220, 220);

        // Western Ghats Ultra-Dense Canopy Belt (78% cover)
        const ghatsGrad = ctx.createLinearGradient(1420, 440, 1450, 520);
        ghatsGrad.addColorStop(0, '#047857');
        ghatsGrad.addColorStop(0.5, '#10b981');
        ghatsGrad.addColorStop(1, '#34d399');
        ctx.fillStyle = ghatsGrad;
        ctx.beginPath();
        ctx.ellipse(1435, 480, 16, 60, 0.32, 0, Math.PI * 2);
        ctx.fill();

        // Northeast India Biodiversity Hotspot (72% cover)
        const neGrad = ctx.createRadialGradient(1545, 405, 5, 1545, 405, 40);
        neGrad.addColorStop(0, '#059669');
        neGrad.addColorStop(0.5, '#10b981');
        neGrad.addColorStop(1, '#6ee7b7');
        ctx.fillStyle = neGrad;
        ctx.beginPath();
        ctx.arc(1545, 405, 38, 0, Math.PI * 2);
        ctx.fill();

        // Central Highlands (Kanha / Pench / Satpura)
        const centralGrad = ctx.createRadialGradient(1470, 445, 5, 1470, 445, 32);
        centralGrad.addColorStop(0, '#059669');
        centralGrad.addColorStop(0.7, '#10b981');
        centralGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = centralGrad;
        ctx.beginPath();
        ctx.arc(1470, 445, 32, 0, Math.PI * 2);
        ctx.fill();

      } else if (heatmapLayer === 'renewable') {
        // --- RENEWABLE ENERGY & SOLAR IRRADIATION HEATMAP ---
        ctx.fillStyle = '#131513';
        ctx.fillRect(1380, 350, 220, 220);

        // Thar Desert Solar Radiation Core (Bhadla Solar Park, Rajasthan > 6.2 kWh/m²)
        const tharSun = ctx.createRadialGradient(1430, 395, 5, 1430, 395, 55);
        tharSun.addColorStop(0, '#fbbf24'); // Brilliant Gold
        tharSun.addColorStop(0.4, '#f59e0b'); // Amber
        tharSun.addColorStop(0.7, '#d97706'); // Copper
        tharSun.addColorStop(1, 'rgba(217, 119, 6, 0)');
        ctx.fillStyle = tharSun;
        ctx.beginPath();
        ctx.arc(1430, 395, 55, 0, Math.PI * 2);
        ctx.fill();

        // Khavda Renewable Park & Gulf of Kutch (Gujarat 30 GW)
        const kutchSun = ctx.createRadialGradient(1415, 420, 5, 1415, 420, 35);
        kutchSun.addColorStop(0, '#fef08a');
        kutchSun.addColorStop(0.5, '#f59e0b');
        kutchSun.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = kutchSun;
        ctx.beginPath();
        ctx.arc(1415, 420, 35, 0, Math.PI * 2);
        ctx.fill();

        // Southern Wind Corridor (Muppandal Wind Belt, Tamil Nadu & Karnataka)
        const windSouth = ctx.createRadialGradient(1470, 520, 5, 1470, 520, 40);
        windSouth.addColorStop(0, '#38bdf8'); // Sky blue
        windSouth.addColorStop(0.5, '#0ea5e9');
        windSouth.addColorStop(1, 'rgba(14, 165, 233, 0)');
        ctx.fillStyle = windSouth;
        ctx.beginPath();
        ctx.arc(1470, 520, 40, 0, Math.PI * 2);
        ctx.fill();

      } else if (heatmapLayer === 'wetlands') {
        // --- RAMSAR WETLANDS & WATER DEPLETION STRESS HEATMAP ---
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(1380, 350, 220, 220);

        // Sundarbans Mangrove Archipelago (Largest Ramsar site, 4,260 km²)
        const sundarGrad = ctx.createRadialGradient(1530, 440, 4, 1530, 440, 35);
        sundarGrad.addColorStop(0, '#06b6d4');
        sundarGrad.addColorStop(0.5, '#0891b2');
        sundarGrad.addColorStop(1, 'rgba(8, 145, 178, 0)');
        ctx.fillStyle = sundarGrad;
        ctx.beginPath();
        ctx.arc(1530, 440, 35, 0, Math.PI * 2);
        ctx.fill();

        // Tamil Nadu High-Density Ramsar Cluster (16 sites)
        const tnGrad = ctx.createRadialGradient(1480, 510, 4, 1480, 510, 38);
        tnGrad.addColorStop(0, '#38bdf8');
        tnGrad.addColorStop(0.6, '#0284c7');
        tnGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        ctx.fillStyle = tnGrad;
        ctx.beginPath();
        ctx.arc(1480, 510, 38, 0, Math.PI * 2);
        ctx.fill();

        // Critical Groundwater Depletion Stress in Northwest (Punjab/Haryana alluvial stress)
        const gwStress = ctx.createRadialGradient(1445, 385, 4, 1445, 385, 32);
        gwStress.addColorStop(0, '#e11d48'); // Stress Red
        gwStress.addColorStop(0.6, '#be123c');
        gwStress.addColorStop(1, 'rgba(190, 18, 60, 0)');
        ctx.fillStyle = gwStress;
        ctx.beginPath();
        ctx.arc(1445, 385, 32, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Golden contour boundary line
      ctx.strokeStyle = '#b5a16a';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#b5a16a';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Sri Lanka teardrop island
    ctx.beginPath();
    ctx.ellipse(1475, 560, 10, 16, 0.1, 0, Math.PI * 2);
    ctx.fillStyle = viewMode === 'heatmap' ? '#1e382b' : '#26593f';
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const RealEarth3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // View state
  const [viewMode, setViewMode] = useState<EarthViewMode>('globe');
  const [heatmapLayer, setHeatmapLayer] = useState<HeatmapLayer>('aqi');
  const [activeTab, setActiveTab] = useState<'wildlife' | 'indices' | 'protected'>('wildlife');
  const [isRotating, setIsRotating] = useState(true);

  // Three.js References
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const worldGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Switch Texture on ViewMode or HeatmapLayer Change
  useEffect(() => {
    if (!earthMeshRef.current) return;
    const newTexture = createWorldTexture(viewMode, heatmapLayer);
    const oldTexture = earthMeshRef.current.material instanceof THREE.MeshStandardMaterial ? earthMeshRef.current.material.map : null;
    
    if (earthMeshRef.current.material instanceof THREE.MeshStandardMaterial) {
      earthMeshRef.current.material.map = newTexture;
      earthMeshRef.current.material.needsUpdate = true;
    }

    // When switching to heatmap, rotate the world smoothly to center India
    if (viewMode === 'heatmap' && worldGroupRef.current) {
      worldGroupRef.current.rotation.y = 1.35; // Centers Indian subcontinent directly facing user
      setIsRotating(false); // Pause so user can comfortably inspect the surface heat map
    }

    return () => {
      oldTexture?.dispose();
    };
  }, [viewMode, heatmapLayer]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0c0b, 0.05);

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / (container.clientHeight || 1),
      0.1,
      100
    );
    camera.position.set(0, 0.2, 5.2);

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
      rendererRef.current = renderer;
    } catch {
      return;
    }

    // Directional Lighting for Realistic Planetary Shading
    const ambientLight = new THREE.AmbientLight(0x2d3a33, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xf1efe8, 2.8);
    sunLight.position.set(6, 4, 4);
    scene.add(sunLight);

    const emeraldAtmosphereRim = new THREE.DirectionalLight(0x5a8a6c, 2.4);
    emeraldAtmosphereRim.position.set(-6, -2, 2);
    scene.add(emeraldAtmosphereRim);

    const goldAccent = new THREE.PointLight(0xb5a16a, 2.5, 12);
    goldAccent.position.set(1, -3, 3);
    scene.add(goldAccent);

    // World Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);
    worldGroupRef.current = worldGroup;

    // Earth Sphere
    const earthRadius = 1.8;
    const earthGeom = new THREE.SphereGeometry(earthRadius, 64, 64);
    const initialTexture = createWorldTexture(viewMode, heatmapLayer);
    const earthMat = new THREE.MeshStandardMaterial({
      map: initialTexture,
      roughness: 0.65,
      metalness: 0.12,
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    worldGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Real Earth Axial Tilt: 23.44°
    worldGroup.rotation.z = -0.409;
    worldGroup.rotation.x = 0.15;
    worldGroup.rotation.y = 1.35; // Start aligned nicely to Indian subcontinent

    // Outer Atmospheric Glow Halo
    const atmosGeom = new THREE.SphereGeometry(earthRadius * 1.035, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x5a8a6c,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosGeom, atmosMat);
    worldGroup.add(atmosphereMesh);

    // Golden Coordinate Orbit Equator & Tropical Latitudes
    const ringRadius = earthRadius * 1.05;
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
      opacity: 0.45
    });
    const equatorLine = new THREE.Line(equatorGeom, equatorMat);
    worldGroup.add(equatorLine);

    // India Focal Target Beacon (Centered around 22°N, 78°E)
    const indiaPhi = (90 - 22.5) * (Math.PI / 180);
    const indiaTheta = (78.5 + 180) * (Math.PI / 180);
    const ix = -earthRadius * Math.sin(indiaPhi) * Math.cos(indiaTheta);
    const iz = earthRadius * Math.sin(indiaPhi) * Math.sin(indiaTheta);
    const iy = earthRadius * Math.cos(indiaPhi);

    const beaconGeom = new THREE.SphereGeometry(0.065, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xb5a16a });
    const beaconMesh = new THREE.Mesh(beaconGeom, beaconMat);
    beaconMesh.position.set(ix, iy, iz);
    earthMesh.add(beaconMesh);

    // Pulsing radar ring on India
    const targetRingGeom = new THREE.BufferGeometry();
    const ringPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(0.16 * Math.cos(a), 0.16 * Math.sin(a), 0));
    }
    targetRingGeom.setFromPoints(ringPts);
    const targetRingMat = new THREE.LineBasicMaterial({
      color: 0x5a8a6c,
      transparent: true,
      opacity: 0.8
    });
    const targetRing = new THREE.Line(targetRingGeom, targetRingMat);
    targetRing.position.set(ix, iy, iz);
    targetRing.lookAt(new THREE.Vector3(ix * 2, iy * 2, iz * 2));
    earthMesh.add(targetRing);

    // Mouse Drag Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !worldGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      worldGroup.rotation.y += deltaX * 0.006;
      worldGroup.rotation.x += deltaY * 0.006;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop (using performance.now to prevent THREE.Clock deprecation warnings)
    let frameId = 0;
    const startTime = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth axial rotation
      if (isRotating && !isDragging) {
        earthMesh.rotation.y += 0.0028;
      }

      // Radar pulse expansion
      const pulseScale = 1.0 + Math.sin(elapsed * 3.0) * 0.35;
      targetRing.scale.set(pulseScale, pulseScale, pulseScale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / (container.clientHeight || 1);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      earthGeom.dispose();
      earthMat.dispose();
      initialTexture.dispose();
      atmosGeom.dispose();
      atmosMat.dispose();
    };
  }, [isRotating]);

  // Center Indian Subcontinent on user click
  const centerOnIndia = () => {
    if (worldGroupRef.current) {
      worldGroupRef.current.rotation.y = 1.35;
      worldGroupRef.current.rotation.x = 0.15;
    }
  };

  return (
    <div className="w-full bg-[#131513] border border-[#30322E] rounded-xl overflow-hidden shadow-2xl">
      {/* Top Telemetry Header & Overlay Toggle */}
      <div className="px-5 py-3.5 bg-[#0B0C0B] border-b border-[#30322E] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-[#B5A16A]" />
          <span className="font-serif font-bold text-sm text-[#F1EFE8]">
            Planetary Biosphere &amp; Indian Subcontinent Model
          </span>
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#131513] border border-[#5A8A6C]/40 text-[#5A8A6C]">
            AXIS 23.4°
          </span>
        </div>

        {/* View Mode Toggle: Realistic Globe vs. Environmental Heatmap */}
        <div className="flex items-center gap-2 bg-[#181B18] p-1 rounded-lg border border-[#30322E]">
          <button
            onClick={() => setViewMode('globe')}
            className={`px-3 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'globe'
                ? 'bg-[#B5A16A] text-[#0B0C0B] font-semibold shadow-xs'
                : 'text-[#A5A59C] hover:text-[#F1EFE8]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Realistic Globe</span>
          </button>

          <button
            onClick={() => {
              setViewMode('heatmap');
              centerOnIndia();
            }}
            className={`px-3 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'heatmap'
                ? 'bg-[#5A8A6C] text-[#0B0C0B] font-semibold shadow-xs'
                : 'text-[#A5A59C] hover:text-[#F1EFE8]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Surface Heatmap</span>
          </button>
        </div>

        {/* Rotation Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 text-xs font-mono rounded border flex items-center gap-1.5 transition cursor-pointer ${
              isRotating
                ? 'bg-[#5A8A6C]/20 border-[#5A8A6C] text-[#5A8A6C]'
                : 'bg-[#181B18] border-[#30322E] text-[#A5A59C]'
            }`}
            title="Toggle axial auto-rotation"
          >
            <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Rotating' : 'Paused'}</span>
          </button>

          <button
            onClick={centerOnIndia}
            className="px-2.5 py-1 text-xs font-mono rounded border border-[#30322E] bg-[#181B18] hover:bg-[#202420] text-[#A5A59C] hover:text-[#B5A16A] transition cursor-pointer"
            title="Center view on India"
          >
            Center India
          </button>
        </div>
      </div>

      {/* Sub-Header Bar: Environmental Heatmap Layer Selector (When Heatmap is Active) */}
      {viewMode === 'heatmap' && (
        <div className="px-5 py-2.5 bg-[#181B18] border-b border-[#30322E] flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-[#A5A59C]">
            <Layers className="w-3.5 h-3.5 text-[#5A8A6C]" />
            <span className="uppercase text-[11px] tracking-wider text-[#F1EFE8]">
              Select Heatmap Layer:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'aqi', label: 'Air Quality (PM2.5)', icon: Wind, color: 'text-rose-400' },
              { id: 'forest', label: 'Forest Canopy Density', icon: Trees, color: 'text-emerald-400' },
              { id: 'renewable', label: 'Renewable Solar & Wind', icon: Sun, color: 'text-amber-400' },
              { id: 'wetlands', label: 'Ramsar Wetlands & Aquifers', icon: Droplets, color: 'text-cyan-400' }
            ].map((layer) => {
              const Icon = layer.icon;
              const isActive = heatmapLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setHeatmapLayer(layer.id as HeatmapLayer)}
                  className={`px-3 py-1 rounded text-xs transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#0B0C0B] text-[#F1EFE8] border border-[#B5A16A]'
                      : 'bg-[#131513] text-[#A5A59C] hover:text-[#F1EFE8] border border-[#30322E]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: 3D Earth on Left/Center, Verified Data Telemetry on Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">
        {/* 3D Earth Viewport */}
        <div className="lg:col-span-7 relative flex items-center justify-center bg-[#0B0C0B]/60 p-4 border-b lg:border-b-0 lg:border-r border-[#30322E]">
          <div
            ref={mountRef}
            className="w-full h-[380px] sm:h-[440px] lg:h-[500px] cursor-grab active:cursor-grabbing relative select-none"
            aria-label="3D Rotating Earth with Indian Subcontinent Focal Point"
          />

          {/* Overlay Coordinates & Controls */}
          <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5A8A6C] animate-pulse" />
            <span className="text-[10px] font-mono text-[#A5A59C] bg-[#0B0C0B]/90 px-2 py-0.5 rounded border border-[#30322E]">
              {viewMode === 'heatmap'
                ? `HEATMAP: ${heatmapLayer.toUpperCase()} · SURFACE PROJECTION`
                : 'FOCAL LAT: 22.5°N · LON: 78.5°E (INDIA)'}
            </span>
          </div>

          {/* Interactive Heatmap Legend on 3D Surface */}
          {viewMode === 'heatmap' && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#0B0C0B]/90 border border-[#30322E] rounded-lg p-3 text-xs backdrop-blur-md max-w-sm pointer-events-none shadow-xl">
              <div className="font-mono text-[10px] uppercase text-[#B5A16A] mb-1 font-bold">
                {heatmapLayer === 'aqi' && 'Air Quality Index (AQI) Concentration'}
                {heatmapLayer === 'forest' && 'Forest Canopy Cover & Biomass Density'}
                {heatmapLayer === 'renewable' && 'Solar & Wind Generation Potential'}
                {heatmapLayer === 'wetlands' && 'Wetland Ecosystems & Depletion Zones'}
              </div>

              {/* Gradient Bar */}
              <div className="h-2 w-full rounded-full my-1.5 overflow-hidden">
                {heatmapLayer === 'aqi' && (
                  <div className="h-full w-full bg-gradient-to-r from-emerald-500 via-amber-500 via-orange-600 to-rose-700" />
                )}
                {heatmapLayer === 'forest' && (
                  <div className="h-full w-full bg-gradient-to-r from-stone-800 via-emerald-800 to-emerald-400" />
                )}
                {heatmapLayer === 'renewable' && (
                  <div className="h-full w-full bg-gradient-to-r from-stone-800 via-amber-600 to-amber-300" />
                )}
                {heatmapLayer === 'wetlands' && (
                  <div className="h-full w-full bg-gradient-to-r from-rose-800 via-slate-700 to-cyan-400" />
                )}
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#A5A59C]">
                <span>
                  {heatmapLayer === 'aqi' && 'Clean (< 50 AQI)'}
                  {heatmapLayer === 'forest' && 'Sparse (< 20%)'}
                  {heatmapLayer === 'renewable' && 'Moderate (3 kWh/m²)'}
                  {heatmapLayer === 'wetlands' && 'High Stress'}
                </span>
                <span>
                  {heatmapLayer === 'aqi' && 'Severe (400+ AQI)'}
                  {heatmapLayer === 'forest' && 'Dense (> 75%)'}
                  {heatmapLayer === 'renewable' && 'Extreme (6.5+ kWh/m²)'}
                  {heatmapLayer === 'wetlands' && 'Pristine Ramsar'}
                </span>
              </div>
            </div>
          )}

          {viewMode === 'globe' && (
            <div className="absolute bottom-4 left-4 pointer-events-none text-[10px] font-mono text-[#A5A59C]/80 bg-[#0B0C0B]/80 px-2.5 py-1 rounded border border-[#30322E]">
              Drag to spin globe · Toggle heatmap above to see environmental indices
            </div>
          )}
        </div>

        {/* Side Panel: India Wildlife Data & Global Environmental Rankings */}
        <div className="lg:col-span-5 flex flex-col bg-[#131513]">
          {/* Sub-Tabs */}
          <div className="flex border-b border-[#30322E] bg-[#0B0C0B] text-xs font-mono">
            <button
              onClick={() => setActiveTab('wildlife')}
              className={`flex-1 py-3 px-3 text-center border-b-2 transition cursor-pointer ${
                activeTab === 'wildlife'
                  ? 'border-[#B5A16A] text-[#B5A16A] font-semibold bg-[#131513]'
                  : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
              }`}
            >
              Wildlife Censuses
            </button>
            <button
              onClick={() => setActiveTab('indices')}
              className={`flex-1 py-3 px-3 text-center border-b-2 transition cursor-pointer ${
                activeTab === 'indices'
                  ? 'border-[#5A8A6C] text-[#5A8A6C] font-semibold bg-[#131513]'
                  : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
              }`}
            >
              Global Rankings
            </button>
            <button
              onClick={() => setActiveTab('protected')}
              className={`flex-1 py-3 px-3 text-center border-b-2 transition cursor-pointer ${
                activeTab === 'protected'
                  ? 'border-[#B5A16A] text-[#B5A16A] font-semibold bg-[#131513]'
                  : 'border-transparent text-[#A5A59C] hover:text-[#F1EFE8]'
              }`}
            >
              Ramsar &amp; Reserves
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {activeTab === 'wildlife' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#30322E]">
                  <span className="font-serif font-bold text-sm text-[#F1EFE8]">
                    Flagship Species Censuses (Official Data)
                  </span>
                  <span className="text-[10px] font-mono text-[#B5A16A]">WII / NTCA / MoEFCC</span>
                </div>

                {/* Tiger */}
                <div className="p-3 bg-[#0B0C0B] border border-[#30322E] hover:border-[#B5A16A] rounded-lg transition space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-sm text-[#F1EFE8]">Royal Bengal Tiger</span>
                    <span className="font-mono text-base font-bold text-[#B5A16A]">3,682</span>
                  </div>
                  <p className="text-xs text-[#A5A59C] leading-relaxed">
                    Accounts for <strong className="text-[#F1EFE8]">~75% of global wild tigers</strong> across 58 notified reserves. Leading states: Madhya Pradesh (785), Karnataka (563), Uttarakhand (560).
                  </p>
                </div>

                {/* Asian Elephant */}
                <div className="p-3 bg-[#0B0C0B] border border-[#30322E] hover:border-[#5A8A6C] rounded-lg transition space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-sm text-[#F1EFE8]">Asian Elephant</span>
                    <span className="font-mono text-base font-bold text-[#5A8A6C]">22,446</span>
                  </div>
                  <p className="text-xs text-[#A5A59C] leading-relaxed">
                    Represents <strong className="text-[#F1EFE8]">~60% of the world’s wild Asian elephants</strong>. Western Ghats holds 11,934; Karnataka leads nationwide with 6,013 elephants.
                  </p>
                </div>

                {/* Greater One-Horned Rhino */}
                <div className="p-3 bg-[#0B0C0B] border border-[#30322E] hover:border-[#B5A16A] rounded-lg transition space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-sm text-[#F1EFE8]">Greater One-Horned Rhino</span>
                    <span className="font-mono text-base font-bold text-[#B5A16A]">3,260</span>
                  </div>
                  <p className="text-xs text-[#A5A59C] leading-relaxed">
                    Houses <strong className="text-[#F1EFE8]">~80% of the global population</strong>, concentrated in Assam (Kaziranga National Park &amp; Orang) and West Bengal (Jaldapara).
                  </p>
                </div>

                {/* Snow Leopard & Asiatic Lion */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-[#0B0C0B] border border-[#30322E] rounded-lg">
                    <div className="text-[11px] font-serif font-bold text-[#F1EFE8]">Snow Leopard</div>
                    <div className="font-mono text-sm font-bold text-[#5A8A6C] mt-0.5">718</div>
                    <div className="text-[10px] text-[#A5A59C] mt-1">SPAI Census; Ladakh hosts 477</div>
                  </div>
                  <div className="p-2.5 bg-[#0B0C0B] border border-[#30322E] rounded-lg">
                    <div className="text-[11px] font-serif font-bold text-[#F1EFE8]">Asiatic Lion</div>
                    <div className="font-mono text-sm font-bold text-[#B5A16A] mt-0.5">674</div>
                    <div className="text-[10px] text-[#A5A59C] mt-1">100% of global wild stock (Gir)</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'indices' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#30322E]">
                  <span className="font-serif font-bold text-sm text-[#F1EFE8]">
                    India’s International Environmental Standing
                  </span>
                  <span className="text-[10px] font-mono text-[#5A8A6C]">Global Benchmarks</span>
                </div>

                {/* CCPI */}
                <div className="p-3 bg-[#0B0C0B] border border-[#30322E] rounded-lg space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-xs text-[#F1EFE8]">Climate Change Performance (CCPI)</span>
                    <span className="font-mono text-sm font-bold text-[#B5A16A]">Rank 23rd</span>
                  </div>
                  <p className="text-[11px] text-[#A5A59C] leading-relaxed">
                    Recognized for rapid non-fossil renewable capacity expansion, but ranked in the "Medium" band due to ongoing coal generation dependencies.
                  </p>
                </div>

                {/* RECAI */}
                <div className="p-3 bg-[#0B0C0B] border border-[#30322E] rounded-lg space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-xs text-[#F1EFE8]">Renewable Energy Attractiveness (RECAI)</span>
                    <span className="font-mono text-sm font-bold text-[#5A8A6C]">Rank 6th</span>
                  </div>
                  <p className="text-[11px] text-[#A5A59C] leading-relaxed">
                    EY Global index: 6th most attractive global market for solar, wind, and battery energy storage investments.
                  </p>
                </div>

                {/* Net Forest Gain */}
                <div className="p-3 bg-[#0B0C0B] border border-[#30322E] rounded-lg space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-xs text-[#F1EFE8]">FAO Annual Net Forest Gain</span>
                    <span className="font-mono text-sm font-bold text-[#5A8A6C]">Rank 3rd</span>
                  </div>
                  <p className="text-[11px] text-[#A5A59C] leading-relaxed">
                    United Nations FAO Global Forest Resources Assessment: India ranks 3rd worldwide in average annual net forest area gain, 9th in total forest area.
                  </p>
                </div>

                {/* EPI & Air Quality Challenges */}
                <div className="p-3 bg-[#0B0C0B] border border-rose-950/80 rounded-lg space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif font-bold text-xs text-rose-300">Air Quality &amp; EPI Ranking</span>
                    <span className="font-mono text-sm font-bold text-rose-400">176th / 180</span>
                  </div>
                  <p className="text-[11px] text-[#A5A59C] leading-relaxed">
                    Yale Environmental Performance Index: Low score driven by Indo-Gangetic Plain winter PM2.5 concentrations and linear habitat fragmentation.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'protected' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#30322E]">
                  <span className="font-serif font-bold text-sm text-[#F1EFE8]">
                    Conservation Land Cover &amp; Ramsar Network
                  </span>
                  <span className="text-[10px] font-mono text-[#B5A16A]">103 Ramsar Sites</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-[#0B0C0B] border border-[#30322E] rounded-lg text-center">
                    <span className="block font-mono text-xl font-bold text-[#F1EFE8]">103</span>
                    <span className="text-[10px] font-mono uppercase text-[#B5A16A]">Ramsar Wetlands</span>
                    <span className="block text-[10px] text-[#A5A59C] mt-1">#1 in South Asia</span>
                  </div>

                  <div className="p-3 bg-[#0B0C0B] border border-[#30322E] rounded-lg text-center">
                    <span className="block font-mono text-xl font-bold text-[#5A8A6C]">1,027</span>
                    <span className="text-[10px] font-mono uppercase text-[#5A8A6C]">Protected Areas</span>
                    <span className="block text-[10px] text-[#A5A59C] mt-1">5.26% of Landmass</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-[#0B0C0B] border border-[#30322E] rounded flex items-center justify-between">
                    <span className="text-[#F1EFE8]">Notified Tiger Reserves</span>
                    <span className="font-mono font-bold text-[#B5A16A]">58 Reserves</span>
                  </div>
                  <div className="p-2.5 bg-[#0B0C0B] border border-[#30322E] rounded flex items-center justify-between">
                    <span className="text-[#F1EFE8]">National Parks &amp; Sanctuaries</span>
                    <span className="font-mono font-bold text-[#5A8A6C]">106 Parks · 573 Sanctuaries</span>
                  </div>
                  <div className="p-2.5 bg-[#0B0C0B] border border-[#30322E] rounded flex items-center justify-between">
                    <span className="text-[#F1EFE8]">Largest Single Ramsar Site</span>
                    <span className="font-mono text-[#A5A59C]">Sundarbans (4,260 km²)</span>
                  </div>
                  <div className="p-2.5 bg-[#0B0C0B] border border-[#30322E] rounded flex items-center justify-between">
                    <span className="text-[#F1EFE8]">Highest Ramsar Density State</span>
                    <span className="font-mono text-[#B5A16A]">Tamil Nadu (16 Sites)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Footnote */}
          <div className="p-3 bg-[#0B0C0B] border-t border-[#30322E] text-[10px] font-mono text-[#A5A59C] flex items-center justify-between">
            <span>Primary Sources: MoEFCC · WII · NTCA 2024–2026</span>
            <span className="text-[#B5A16A]">Updated Oct 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
