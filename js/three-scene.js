/**
 * BIKKI JHA - 3D THREE.JS EXPERIENCE
 * Features:
 * - Dynamic 3D Particle Universe / Starfield
 * - 3 Signature Floating Tech Artifacts:
 *   1. Cyan Icosahedron (Web Development)
 *   2. Ruby/Amber Octahedron with Orbital Rings (Java Development)
 *   3. Emerald/Gold Torus Knot (Python Development)
 * - Mouse Parallax & Gyroscopic Cursor Following (Lerp Easing)
 * - Scroll-driven Camera Navigation through 3D Cosmos
 */

(function () {
  'use strict';

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060713, 0.035);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f2fe, 3, 50);
  cyanLight.position.set(10, 10, 10);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x9d4edd, 3, 50);
  purpleLight.position.set(-10, -10, 10);
  scene.add(purpleLight);

  const amberLight = new THREE.PointLight(0xf59e0b, 2.5, 40);
  amberLight.position.set(0, -15, 5);
  scene.add(amberLight);

  // ==========================================
  // 1. Cosmic Starfield / Particle Cloud
  // ==========================================
  const particleCount = 2200;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0x00f2fe), // Cyan
    new THREE.Color(0x4facfe), // Sky blue
    new THREE.Color(0x9d4edd), // Purple
    new THREE.Color(0x10b981), // Emerald
    new THREE.Color(0xffffff)  // White
  ];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Spread in a wide 3D sphere
    const radius = 35 + Math.random() * 45;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3] = chosenColor.r;
    colors[i3 + 1] = chosenColor.g;
    colors[i3 + 2] = chosenColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular point texture generated programmatically
  function createCircleTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(pCanvas);
  }

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.35,
    map: createCircleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const starField = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(starField);

  // ==========================================
  // 2. Signature 3D Tech Artifacts
  // ==========================================
  const artifactsGroup = new THREE.Group();
  scene.add(artifactsGroup);

  // --- Artifact 1: Web Development (Cyan Icosahedron + Wireframe) ---
  const icoGroup = new THREE.Group();
  const icoGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0x051a3a,
    emissive: 0x00f2fe,
    emissiveIntensity: 0.3,
    roughness: 0.2,
    metalness: 0.9,
    transparent: true,
    opacity: 0.75
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);

  const icoWireMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    wireframe: true,
    transparent: true,
    opacity: 0.85
  });
  const icoWire = new THREE.Mesh(icoGeo, icoWireMat);
  icoWire.scale.setScalar(1.02);

  icoGroup.add(icoMesh);
  icoGroup.add(icoWire);
  icoGroup.position.set(9, 4, -4);
  artifactsGroup.add(icoGroup);

  // --- Artifact 2: Java Development (High-Tech Octahedron + Cyber Rings) ---
  const javaGroup = new THREE.Group();
  const octGeo = new THREE.OctahedronGeometry(1.5, 0);
  const octMat = new THREE.MeshStandardMaterial({
    color: 0x2e0808,
    emissive: 0xef4444,
    emissiveIntensity: 0.45,
    roughness: 0.3,
    metalness: 0.8
  });
  const octMesh = new THREE.Mesh(octGeo, octMat);

  const octWireMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true
  });
  const octWire = new THREE.Mesh(octGeo, octWireMat);
  octWire.scale.setScalar(1.05);

  // Orbital Ring
  const ringGeo = new THREE.TorusGeometry(2.3, 0.04, 16, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.7
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 3;

  const ring2Mesh = new THREE.Mesh(ringGeo, ringMat);
  ring2Mesh.rotation.x = -Math.PI / 3;
  ring2Mesh.rotation.y = Math.PI / 4;

  javaGroup.add(octMesh);
  javaGroup.add(octWire);
  javaGroup.add(ringMesh);
  javaGroup.add(ring2Mesh);
  javaGroup.position.set(-10, -2, -5);
  artifactsGroup.add(javaGroup);

  // --- Artifact 3: Python Development (Glowing Torus Knot) ---
  const pyGroup = new THREE.Group();
  const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 120, 20);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x063725,
    emissive: 0x10b981,
    emissiveIntensity: 0.4,
    roughness: 0.3,
    metalness: 0.85
  });
  const knotMesh = new THREE.Mesh(knotGeo, knotMat);

  const knotWireMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const knotWire = new THREE.Mesh(knotGeo, knotWireMat);
  knotWire.scale.setScalar(1.03);

  pyGroup.add(knotMesh);
  pyGroup.add(knotWire);
  pyGroup.position.set(7, -12, -8);
  artifactsGroup.add(pyGroup);

  // ==========================================
  // 3. Mouse Tracking & Smooth Lerp Physics
  // ==========================================
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;
  let targetScrollY = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY || window.pageYOffset;
  }, { passive: true });

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ==========================================
  // 4. Animation Render Loop (60 FPS)
  // ==========================================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Lerp Mouse
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Smooth Lerp Scroll
    scrollY += (targetScrollY - scrollY) * 0.06;
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const scrollFraction = scrollY / maxScroll;

    // Camera Navigation through 3D Cosmos based on scroll and mouse
    camera.position.x = mouse.x * 2.5;
    camera.position.y = mouse.y * 2.0 - scrollFraction * 14;
    camera.position.z = 18 - scrollFraction * 6;
    camera.lookAt(0, -scrollFraction * 14, 0);

    // Rotate Starfield Galaxy
    starField.rotation.y = elapsedTime * 0.03;
    starField.rotation.x = elapsedTime * 0.015;

    // Rotate Web Dev Icosahedron
    icoGroup.rotation.x = elapsedTime * 0.5;
    icoGroup.rotation.y = elapsedTime * 0.7;
    icoGroup.position.y = 4 + Math.sin(elapsedTime * 1.5) * 0.5;

    // Rotate Java Octahedron & Rings
    javaGroup.rotation.y = elapsedTime * 0.6;
    ringMesh.rotation.z = elapsedTime * 0.8;
    ring2Mesh.rotation.z = -elapsedTime * 0.9;
    javaGroup.position.y = -2 + Math.cos(elapsedTime * 1.3) * 0.4;

    // Rotate Python Torus Knot
    pyGroup.rotation.x = elapsedTime * 0.4;
    pyGroup.rotation.y = elapsedTime * 0.5;
    pyGroup.position.y = -12 + Math.sin(elapsedTime * 1.2) * 0.6;

    renderer.render(scene, camera);
  }

  animate();
})();
