/**
 * MathCity AI — 3D House Game Scene, Floating Diorama Island, Lighting, Camera & 6-Stage Construction Engine
 * Procedural low-poly architectural diorama with rounded edges, soft pastel colors & shadows.
 * Zero external 3D model files. 100% offline procedural WebGL generation.
 */

class HouseGameScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // Grid configuration: 12x12 grid, cell size 1.5
    this.gridSize = 12;
    this.cellSize = 1.5;
    this.gridOffset = (this.gridSize * this.cellSize) / 2; // 9.0

    // Lighting & Environment
    this.dirLight = null;
    this.hemiLight = null;
    this.moonLight = null;
    this.isDark = false;
    this.clouds = [];
    this.chimneySmoke = [];
    this.particles = [];
    this.placedMeshMap = new Map(); // instanceId -> Group
    this.baseLedMesh = null;

    // 6-Stage House Construction System
    this.currentBuildingStage = 0; // 0 to 6
    this.stageGroups = []; // Array of 6 THREE.Group (solid)
    this.ghostGroups = []; // Array of 6 THREE.Group (translucent ghost)
    this.houseRoot = null;
    this.windowMeshes = [];

    // Interaction & Ghost Placement
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.groundPlane = null;
    this.activeGhostMesh = null;
    this.selectedItemIdToPlace = null;
    this.selectedItemColor = null;
    this.currentRotation = 0; // 0, 90, 180, 270
    this.selectedInstanceId = null;
    this.isInteriorMode = false;

    this.init();
  }

  init() {
    // 1. Check WebGL support
    if (!this.checkWebGLSupport()) {
      const fallback = document.getElementById('fallback-view');
      if (fallback) fallback.style.display = 'flex';
      return;
    }

    // 2. Scene with elegant sky gradient
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xDCEEFF);
    this.scene.fog = new THREE.FogExp2(0xDCEEFF, 0.012);

    // 3. Camera (Isometric angle ~45 deg, elevation ~36 deg)
    this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.5, 160);
    this.setCameraInitialPosition();

    // 4. Renderer with soft shadows (capped at 2x pixel ratio for smooth 60fps)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (this.container) {
      this.container.innerHTML = '';
      this.container.appendChild(this.renderer.domElement);
    }

    // 5. OrbitControls with bounded angle (never clips beneath ground)
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 6.0;
    this.controls.maxDistance = 32.0;
    this.controls.minPolarAngle = 0.12;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.06; // Keep above ground
    this.controls.target.set(0, 1.0, 0);

    // 6. Setup Lighting, Diorama Pedestal, Environment & 6-Stage House
    this.setupLighting();
    this.createFloatingDiorama();
    this.createEnvironment();
    this.buildSixStageHouse();

    // 7. Event listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));

    // 8. Start render loop
    this.animate();
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  setCameraInitialPosition() {
    const dist = 21.0;
    const angle = Math.PI / 4; // 45 deg isometric
    const elev = 0.62; // ~35.5 deg
    this.camera.position.set(
      Math.cos(angle) * dist,
      dist * Math.sin(elev),
      Math.sin(angle) * dist
    );
  }

  resetCamera() {
    this.setCameraInitialPosition();
    this.controls.target.set(0, 1.0, 0);
    this.controls.update();
  }

  rotateCamera90() {
    if (!this.controls || !this.camera) return;
    const currentAngle = Math.atan2(this.camera.position.x, this.camera.position.z);
    const radius = Math.sqrt(this.camera.position.x * this.camera.position.x + this.camera.position.z * this.camera.position.z);
    const startY = this.camera.position.y;
    const startTime = performance.now();
    const duration = 400;

    const animateRotate = (now) => {
      const progress = Math.min(1.0, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const angle = currentAngle + (Math.PI / 2) * ease;
      this.camera.position.x = radius * Math.sin(angle);
      this.camera.position.z = radius * Math.cos(angle);
      this.camera.position.y = startY;
      this.controls.update();
      if (progress < 1.0) {
        requestAnimationFrame(animateRotate);
      }
    };
    requestAnimationFrame(animateRotate);
  }

  setupLighting() {
    // Hemisphere ambient light
    this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x64748B, 0.85);
    this.hemiLight.position.set(0, 35, 0);
    this.scene.add(this.hemiLight);

    // Sun directional light with soft shadows
    this.dirLight = new THREE.DirectionalLight(0xFFFBEB, 1.35);
    this.dirLight.position.set(18, 28, 16);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 70;
    const d = 16;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0004;
    this.scene.add(this.dirLight);

    // Moon directional light for night mode
    this.moonLight = new THREE.DirectionalLight(0x60A5FA, 0.0);
    this.moonLight.position.set(-18, 24, -16);
    this.scene.add(this.moonLight);
  }

  createFloatingDiorama() {
    const dioramaGroup = new THREE.Group();
    dioramaGroup.name = 'diorama_island';

    // 1. Invisible raycast ground plane at y = 0
    const planeGeom = new THREE.PlaneGeometry(120, 120);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    this.groundPlane = new THREE.Mesh(planeGeom, planeMat);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.scene.add(this.groundPlane);

    // 2. Soft Drop Shadow Disc beneath floating island at y = -2.05
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.38)');
    grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.16)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 32),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.85 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.05;
    this.scene.add(shadowPlane);

    // 3. Main Floating Diorama Pedestal Slice (height: 1.4, width: 22.4, depth: 22.4)
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x65A30D, flatShading: true });
    const sideMat = new THREE.MeshLambertMaterial({ color: 0x57534E, flatShading: true });
    const bottomMat = new THREE.MeshLambertMaterial({ color: 0x292524, flatShading: true });

    const pedestalBox = new THREE.Mesh(
      new THREE.BoxGeometry(22.4, 1.4, 22.4),
      [sideMat, sideMat, grassMat, bottomMat, sideMat, sideMat]
    );
    pedestalBox.position.y = -0.7;
    pedestalBox.receiveShadow = true;
    dioramaGroup.add(pedestalBox);

    // 4. White chamfered foundation rim on bottom edge of pedestal
    const rimMat = new THREE.MeshLambertMaterial({ color: 0xE2E8F0 });
    const rimMesh = new THREE.Mesh(new THREE.BoxGeometry(22.8, 0.12, 22.8), rimMat);
    rimMesh.position.y = -1.35;
    dioramaGroup.add(rimMesh);

    // 5. LED Ambient Light Strip around the diorama base (glows in night mode)
    const ledMat = new THREE.MeshLambertMaterial({
      color: 0xE0E7FF,
      emissive: 0x38BDF8,
      emissiveIntensity: 0.25,
    });
    this.baseLedMesh = new THREE.Mesh(new THREE.BoxGeometry(22.9, 0.08, 22.9), ledMat);
    this.baseLedMesh.position.y = -1.32;
    dioramaGroup.add(this.baseLedMesh);

    // 6. Corner Intersection Roadway
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x1E293B, flatShading: true });
    const roadFront = new THREE.Mesh(new THREE.BoxGeometry(22.4, 0.04, 3.4), roadMat);
    roadFront.position.set(0, 0.02, 8.7);
    roadFront.receiveShadow = true;
    dioramaGroup.add(roadFront);

    const roadLeft = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.04, 22.4), roadMat);
    roadLeft.position.set(-8.7, 0.02, 0);
    roadLeft.receiveShadow = true;
    dioramaGroup.add(roadLeft);

    // White dashed lane markings
    const lineMat = new THREE.MeshLambertMaterial({ color: 0xF8FAFC });
    for (let x = -6.0; x <= 10.0; x += 2.4) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.14), lineMat);
      stripe.position.set(x, 0.03, 8.7);
      dioramaGroup.add(stripe);
    }
    for (let z = -10.0; z <= 6.0; z += 2.4) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 1.2), lineMat);
      stripe.position.set(-8.7, 0.03, z);
      dioramaGroup.add(stripe);
    }

    // 7. Raised concrete sidewalk curb
    const curbMat = new THREE.MeshLambertMaterial({ color: 0xE2E8F0 });
    const curbFront = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.1, 0.24), curbMat);
    curbFront.position.set(1.0, 0.05, 6.9);
    curbFront.receiveShadow = true;
    const curbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 15.6), curbMat);
    curbLeft.position.set(-6.9, 0.05, -1.0);
    curbLeft.receiveShadow = true;
    dioramaGroup.add(curbFront, curbLeft);

    // 8. Low perimeter hedge along the curb
    const hedgeMat = new THREE.MeshLambertMaterial({ color: 0x15803D, flatShading: true });
    for (let x = -5.8; x <= 9.6; x += 1.4) {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 6), hedgeMat);
      bush.scale.set(1.3, 0.85, 1.1);
      bush.position.set(x, 0.28, 6.5);
      bush.castShadow = true;
      dioramaGroup.add(bush);
    }
    for (let z = -9.6; z <= 5.8; z += 1.4) {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 6), hedgeMat);
      bush.scale.set(1.1, 0.85, 1.3);
      bush.position.set(-6.5, 0.28, z);
      bush.castShadow = true;
      dioramaGroup.add(bush);
    }

    // 9. Perimeter Trees
    const treeMatTrunk = new THREE.MeshLambertMaterial({ color: 0x78350F });
    const treeMatLeaves = new THREE.MeshLambertMaterial({ color: 0x16A34A, flatShading: true });
    const treePositions = [
      { x: 9.2, z: -9.2 },
      { x: 9.4, z: -6.4 },
      { x: -9.5, z: -9.5 },
      { x: 2.5, z: -9.8 },
    ];
    treePositions.forEach((pos) => {
      const pTree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 1.4, 5), treeMatTrunk);
      trunk.position.y = 0.7;
      trunk.castShadow = true;
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.7, 6, 6), treeMatLeaves);
      canopy.position.y = 1.6;
      canopy.castShadow = true;
      pTree.add(trunk, canopy);
      pTree.position.set(pos.x, 0, pos.z);
      dioramaGroup.add(pTree);
    });

    this.scene.add(dioramaGroup);
  }

  createEnvironment() {
    // Stylized low-poly clouds
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.85,
      flatShading: true,
    });

    const cloudDefs = [
      { x: -16, y: 15, z: -14, s: 1.4, speed: 0.015 },
      { x: 12, y: 17, z: -18, s: 1.8, speed: 0.012 },
      { x: -4, y: 19, z: 16, s: 1.2, speed: 0.018 },
    ];

    cloudDefs.forEach((def) => {
      const cloud = new THREE.Group();
      const b1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 6, 6), cloudMat);
      const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 5, 5), cloudMat);
      b2.position.set(-1.1, -0.15, 0.2);
      const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.95, 5, 5), cloudMat);
      b3.position.set(1.2, -0.1, -0.1);
      cloud.add(b1, b2, b3);
      cloud.position.set(def.x, def.y, def.z);
      cloud.scale.set(def.s, def.s * 0.55, def.s * 0.85);
      cloud.userData = { speed: def.speed };
      this.clouds.push(cloud);
      this.scene.add(cloud);
    });
  }

  /**
   * Builds the 6 Procedural House Stages and their Ghost counterparts
   */
  buildSixStageHouse() {
    this.houseRoot = new THREE.Group();
    this.houseRoot.name = 'six_stage_house_root';

    // Materials helper
    const ghostMat = new THREE.MeshBasicMaterial({
      color: 0x94A3B8,
      transparent: true,
      opacity: 0.16,
      wireframe: true,
    });

    const concreteMat = new THREE.MeshLambertMaterial({ color: 0xE2E8F0, flatShading: true });
    const gravelMat = new THREE.MeshLambertMaterial({ color: 0x94A3B8, flatShading: true });
    const wallPlasterMat = new THREE.MeshLambertMaterial({ color: 0xF8FAFC, flatShading: true });
    const wallAccentMat = new THREE.MeshLambertMaterial({ color: 0x334155, flatShading: true });
    const roofTileMat = new THREE.MeshLambertMaterial({ color: 0x1E3A8A, flatShading: true }); // Luxury Navy Blue Tiles
    const chimneyMat = new THREE.MeshLambertMaterial({ color: 0xB91C1C, flatShading: true });
    const woodDoorMat = new THREE.MeshLambertMaterial({ color: 0x92400E, flatShading: true });
    const glassMat = new THREE.MeshLambertMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.75,
      flatShading: true,
    });
    const sofaMat = new THREE.MeshLambertMaterial({ color: 0x6366F1, flatShading: true });
    const tableMat = new THREE.MeshLambertMaterial({ color: 0xB45309, flatShading: true });
    const fenceMat = new THREE.MeshLambertMaterial({ color: 0xF1F5F9, flatShading: true });
    const carMat = new THREE.MeshLambertMaterial({ color: 0xDC2626, flatShading: true }); // Red family car

    // ==========================================
    // STAGE 1: POYDEVOR (Concrete Slab & Lot)
    // ==========================================
    const s1Solid = new THREE.Group();
    s1Solid.name = 'stage_1_solid';
    const s1Gravel = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.1, 9.4), gravelMat);
    s1Gravel.position.y = 0.05;
    s1Gravel.receiveShadow = true;
    const s1Slab = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.35, 8.8), concreteMat);
    s1Slab.position.y = 0.25;
    s1Slab.castShadow = true;
    s1Slab.receiveShadow = true;
    const s1Step = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 1.2), concreteMat);
    s1Step.position.set(0, 0.15, 4.8);
    s1Step.receiveShadow = true;
    s1Solid.add(s1Gravel, s1Slab, s1Step);

    const s1Ghost = new THREE.Group();
    s1Ghost.name = 'stage_1_ghost';
    const s1GhostMesh = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.35, 8.8), ghostMat);
    s1GhostMesh.position.y = 0.25;
    s1Ghost.add(s1GhostMesh);

    // ==========================================
    // STAGE 2: DEVORLAR (Villa Walls & Rooms)
    // ==========================================
    const s2Solid = new THREE.Group();
    s2Solid.name = 'stage_2_solid';
    // Back wall
    const wBack = new THREE.Mesh(new THREE.BoxGeometry(8.0, 3.0, 0.4), wallPlasterMat);
    wBack.position.set(0, 1.9, -3.8);
    wBack.castShadow = true;
    wBack.receiveShadow = true;
    // Left wall with window opening
    const wLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.0, 8.0), wallPlasterMat);
    wLeft.position.set(-3.8, 1.9, 0);
    wLeft.castShadow = true;
    // Right wall with window opening
    const wRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.0, 8.0), wallPlasterMat);
    wRight.position.set(3.8, 1.9, 0);
    wRight.castShadow = true;
    // Front wall Left & Right pillars (door gap in middle)
    const wFrontL = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.0, 0.4), wallPlasterMat);
    wFrontL.position.set(-2.5, 1.9, 3.8);
    wFrontL.castShadow = true;
    const wFrontR = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.0, 0.4), wallPlasterMat);
    wFrontR.position.set(2.5, 1.9, 3.8);
    wFrontR.castShadow = true;
    const wFrontTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 0.4), wallPlasterMat);
    wFrontTop.position.set(0, 3.0, 3.8);
    // Interior dividing wall
    const wDivider = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 4.4), wallAccentMat);
    wDivider.position.set(0.5, 1.8, -1.6);
    s2Solid.add(wBack, wLeft, wRight, wFrontL, wFrontR, wFrontTop, wDivider);

    const s2Ghost = new THREE.Group();
    s2Ghost.name = 'stage_2_ghost';
    const s2GhostMesh = new THREE.Mesh(new THREE.BoxGeometry(8.0, 3.0, 8.0), ghostMat);
    s2GhostMesh.position.set(0, 1.9, 0);
    s2Ghost.add(s2GhostMesh);

    // ==========================================
    // STAGE 3: TOM (Gable Tiled Roof & Chimney)
    // ==========================================
    const s3Solid = new THREE.Group();
    s3Solid.name = 'stage_3_solid';
    // Ceiling slab / Eaves
    const rEaves = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.25, 8.8), concreteMat);
    rEaves.position.set(0, 3.5, 0);
    rEaves.castShadow = true;
    // Left roof slope
    const rSlopeL = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.22, 9.2), roofTileMat);
    rSlopeL.rotation.z = 0.46;
    rSlopeL.position.set(-2.0, 4.4, 0);
    rSlopeL.castShadow = true;
    // Right roof slope
    const rSlopeR = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.22, 9.2), roofTileMat);
    rSlopeR.rotation.z = -0.46;
    rSlopeR.position.set(2.0, 4.4, 0);
    rSlopeR.castShadow = true;
    // Gable triangular facades
    const gableGeom = new THREE.ConeGeometry(4.4, 2.1, 4);
    const rGableFront = new THREE.Mesh(gableGeom, wallPlasterMat);
    rGableFront.rotation.y = Math.PI / 4;
    rGableFront.position.set(0, 4.45, 3.8);
    const rGableBack = new THREE.Mesh(gableGeom, wallPlasterMat);
    rGableBack.rotation.y = Math.PI / 4;
    rGableBack.position.set(0, 4.45, -3.8);
    // Chimney
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.2, 0.85), chimneyMat);
    chimney.position.set(2.4, 5.2, -1.8);
    chimney.castShadow = true;
    const chimneyCap = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.15, 1.05), concreteMat);
    chimneyCap.position.set(2.4, 6.35, -1.8);
    s3Solid.add(rEaves, rSlopeL, rSlopeR, rGableFront, rGableBack, chimney, chimneyCap);

    const s3Ghost = new THREE.Group();
    s3Ghost.name = 'stage_3_ghost';
    const s3GhostMesh = new THREE.Mesh(new THREE.BoxGeometry(8.8, 2.4, 8.8), ghostMat);
    s3GhostMesh.position.set(0, 4.5, 0);
    s3Ghost.add(s3GhostMesh);

    // ==========================================
    // STAGE 4: ESHIK VA DERAZALAR (Doors & Windows)
    // ==========================================
    const s4Solid = new THREE.Group();
    s4Solid.name = 'stage_4_solid';
    // Front entrance wooden door
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.16), woodDoorMat);
    door.position.set(0, 1.5, 3.9);
    door.castShadow = true;
    const doorKnob = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 5, 5),
      new THREE.MeshLambertMaterial({ color: 0xFBBF24 })
    );
    doorKnob.position.set(0.55, 1.45, 4.02);
    // Front windows (Left & Right)
    const winFrontL = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 0.12), glassMat);
    winFrontL.position.set(-2.5, 2.0, 3.9);
    const winFrontR = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 0.12), glassMat);
    winFrontR.position.set(2.5, 2.0, 3.9);
    // Side windows
    const winLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.5, 2.2), glassMat);
    winLeft.position.set(-3.9, 2.0, 0);
    const winRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.5, 2.2), glassMat);
    winRight.position.set(3.9, 2.0, 0);

    this.windowMeshes.push(winFrontL, winFrontR, winLeft, winRight);
    s4Solid.add(door, doorKnob, winFrontL, winFrontR, winLeft, winRight);

    const s4Ghost = new THREE.Group();
    s4Ghost.name = 'stage_4_ghost';
    const s4GhostDoor = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.2), ghostMat);
    s4GhostDoor.position.set(0, 1.5, 3.9);
    s4Ghost.add(s4GhostDoor);

    // ==========================================
    // STAGE 5: ICHKI BEZAK (Interior Furniture & Decor)
    // ==========================================
    const s5Solid = new THREE.Group();
    s5Solid.name = 'stage_5_solid';
    // Living room sofa
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 1.1), sofaMat);
    sofaBase.position.set(-1.8, 0.65, 1.2);
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 0.35), sofaMat);
    sofaBack.position.set(-1.8, 1.05, 0.7);
    // Coffee table
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 0.8), tableMat);
    table.position.set(-1.8, 0.62, 2.4);
    // Traditional colorful rug
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.04, 1.8),
      new THREE.MeshLambertMaterial({ color: 0x7C3AED, flatShading: true })
    );
    rug.position.set(-1.8, 0.44, 1.8);
    // Bedroom bed
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.6, 2.4),
      new THREE.MeshLambertMaterial({ color: 0x0284C7, flatShading: true })
    );
    bed.position.set(2.2, 0.7, -1.8);
    s5Solid.add(sofaBase, sofaBack, table, rug, bed);

    const s5Ghost = new THREE.Group();
    s5Ghost.name = 'stage_5_ghost';
    const s5GhostSofa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 1.1), ghostMat);
    s5GhostSofa.position.set(-1.8, 0.8, 1.2);
    s5Ghost.add(s5GhostSofa);

    // ==========================================
    // STAGE 6: HOVLI (Lawn, Walkway, Fence, Tree, Car)
    // ==========================================
    const s6Solid = new THREE.Group();
    s6Solid.name = 'stage_6_solid';
    // Stone flagstone walkway from step to sidewalk
    for (let z = 5.6; z <= 6.8; z += 0.5) {
      const stone = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.38), concreteMat);
      stone.position.set(0, 0.04, z);
      stone.receiveShadow = true;
      s6Solid.add(stone);
    }
    // Front white picket fence sections
    const fenceL = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.7, 0.14), fenceMat);
    fenceL.position.set(-3.5, 0.35, 6.8);
    const fenceR = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.7, 0.14), fenceMat);
    fenceR.position.set(3.5, 0.35, 6.8);
    // Yard garden tree
    const yTree = new THREE.Group();
    const yTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.6, 5), new THREE.MeshLambertMaterial({ color: 0x78350F }));
    yTrunk.position.y = 0.8;
    yTrunk.castShadow = true;
    const yCanopy = new THREE.Mesh(new THREE.SphereGeometry(1.0, 6, 6), new THREE.MeshLambertMaterial({ color: 0x22C55E, flatShading: true }));
    yCanopy.position.y = 2.0;
    yCanopy.castShadow = true;
    yTree.add(yTrunk, yCanopy);
    yTree.position.set(-4.8, 0, 4.6);
    // Family car parked on front road
    const carGroup = new THREE.Group();
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.85, 1.7), carMat);
    carBody.position.y = 0.55;
    carBody.castShadow = true;
    const carCabin = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.65, 1.4),
      new THREE.MeshLambertMaterial({ color: 0x1E293B, flatShading: true })
    );
    carCabin.position.set(-0.2, 1.25, 0);
    carCabin.castShadow = true;
    carGroup.add(carBody, carCabin);
    carGroup.position.set(3.5, 0.02, 8.7);
    s6Solid.add(fenceL, fenceR, yTree, carGroup);

    const s6Ghost = new THREE.Group();
    s6Ghost.name = 'stage_6_ghost';
    const s6GhostCar = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.3, 1.7), ghostMat);
    s6GhostCar.position.set(3.5, 0.65, 8.7);
    s6Ghost.add(s6GhostCar);

    // Register stages 1 to 6
    this.stageGroups = [s1Solid, s2Solid, s3Solid, s4Solid, s5Solid, s6Solid];
    this.ghostGroups = [s1Ghost, s2Ghost, s3Ghost, s4Ghost, s5Ghost, s6Ghost];

    for (let i = 0; i < 6; i++) {
      this.houseRoot.add(this.stageGroups[i]);
      this.houseRoot.add(this.ghostGroups[i]);
    }

    this.scene.add(this.houseRoot);

    // Initial state setup (stage 0: all unbuilt are ghost)
    this.setBuildingStage(0, false);
  }

  /**
   * Updates which stages are fully built vs ghost outlines
   */
  setBuildingStage(stage, animate = false) {
    this.currentBuildingStage = Math.max(0, Math.min(6, stage));

    for (let i = 0; i < 6; i++) {
      const stageNum = i + 1;
      const isBuilt = stageNum <= this.currentBuildingStage;
      const solidGroup = this.stageGroups[i];
      const ghostGroup = this.ghostGroups[i];

      if (solidGroup) solidGroup.visible = isBuilt;
      if (ghostGroup) ghostGroup.visible = !isBuilt;
    }

    if (animate && this.currentBuildingStage > 0) {
      const activeGroup = this.stageGroups[this.currentBuildingStage - 1];
      if (activeGroup) {
        // Animate pop / rise with bounce
        activeGroup.scale.set(0.01, 0.01, 0.01);
        const startTime = performance.now();
        const duration = 500;
        const animateStage = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(1.0, elapsed / duration);
          const c1 = 1.70158;
          const c3 = c1 + 1;
          const scale = 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
          activeGroup.scale.set(scale, scale, scale);
          if (progress < 1.0) {
            requestAnimationFrame(animateStage);
          } else {
            activeGroup.scale.set(1, 1, 1);
          }
        };
        requestAnimationFrame(animateStage);
      }

      // Spawn dust / spark particles
      this.spawnParticleBurst(new THREE.Vector3(0, 1.2, 0), 0xFBBF24);

      // Play sound
      if (window.soundFx) {
        if (this.currentBuildingStage >= 6) {
          window.soundFx.playFanfare();
        } else {
          window.soundFx.playBuildKnock();
        }
      }

      // Camera gentle zoom nudge
      if (this.controls) {
        this.camera.position.multiplyScalar(0.96);
        setTimeout(() => {
          this.camera.position.multiplyScalar(1.0 / 0.96);
        }, 350);
      }

      // Send event to Flutter
      window.sendToFlutter('STAGE_BUILT', {
        stage: this.currentBuildingStage,
        timestamp: Date.now(),
      });
    }

    this.setTheme(this.isDark);
  }

  spawnParticleBurst(center, colorHex) {
    const pGroup = new THREE.Group();
    const count = 18;
    const pMat = new THREE.MeshBasicMaterial({ color: colorHex });

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), pMat);
      p.position.copy(center);
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 3.5;
      p.userData = {
        vx: Math.cos(angle) * speed,
        vy: 3.5 + Math.random() * 4.0,
        vz: Math.sin(angle) * speed,
      };
      pGroup.add(p);
    }

    this.scene.add(pGroup);
    const startTime = performance.now();
    const duration = 650;

    const animateParticles = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(1.0, (now - startTime) / duration);

      pGroup.children.forEach((p) => {
        p.position.x += p.userData.vx * 0.016;
        p.position.y += (p.userData.vy - 9.8 * elapsed) * 0.016;
        p.position.z += p.userData.vz * 0.016;
        const s = (1 - progress);
        p.scale.set(s, s, s);
      });

      if (progress < 1.0) {
        requestAnimationFrame(animateParticles);
      } else {
        this.scene.remove(pGroup);
      }
    };
    requestAnimationFrame(animateParticles);
  }

  setTheme(isDark) {
    this.isDark = !!isDark;
    if (this.isDark) {
      // Night Mode
      this.scene.background.setHex(0x0A0F1D);
      this.scene.fog.color.setHex(0x0A0F1D);
      this.hemiLight.color.setHex(0x1E1B4B);
      this.hemiLight.groundColor.setHex(0x0F172A);
      this.hemiLight.intensity = 0.45;
      this.dirLight.intensity = 0.15;
      this.moonLight.intensity = 0.85;

      // Base LED strip glowing blue
      if (this.baseLedMesh) {
        this.baseLedMesh.material.emissive.setHex(0x38BDF8);
        this.baseLedMesh.material.emissiveIntensity = 1.6;
      }

      // Windows glow warm yellow
      this.windowMeshes.forEach((w) => {
        if (w.material) {
          w.material.emissive = new THREE.Color(0xFBBF24);
          w.material.emissiveIntensity = 1.4;
        }
      });
    } else {
      // Day Mode
      this.scene.background.setHex(0xDCEEFF);
      this.scene.fog.color.setHex(0xDCEEFF);
      this.hemiLight.color.setHex(0xFFFFFF);
      this.hemiLight.groundColor.setHex(0x64748B);
      this.hemiLight.intensity = 0.85;
      this.dirLight.intensity = 1.35;
      this.moonLight.intensity = 0.0;

      // Base LED strip subtle
      if (this.baseLedMesh) {
        this.baseLedMesh.material.emissive.setHex(0x38BDF8);
        this.baseLedMesh.material.emissiveIntensity = 0.25;
      }

      // Windows normal transparent glass
      this.windowMeshes.forEach((w) => {
        if (w.material) {
          w.material.emissive = new THREE.Color(0x000000);
          w.material.emissiveIntensity = 0.0;
        }
      });
    }
  }

  setInteriorMode(isInterior) {
    this.isInteriorMode = !!isInterior;
    // Stage 3 is the roof, Stage 2 is the outer walls
    const roofGroup = this.stageGroups[2]; // Stage 3
    const wallsGroup = this.stageGroups[1]; // Stage 2

    if (roofGroup) {
      roofGroup.visible = !this.isInteriorMode && (this.currentBuildingStage >= 3);
    }
    if (wallsGroup) {
      wallsGroup.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = this.isInteriorMode;
          child.material.opacity = this.isInteriorMode ? 0.22 : 1.0;
        }
      });
    }
  }

  // Convert (cellX, cellY) from 0..11 to world coordinates
  cellToWorld(cellX, cellY) {
    const x = (cellX + 0.5) * this.cellSize - this.gridOffset;
    const z = (cellY + 0.5) * this.cellSize - this.gridOffset;
    return { x, z };
  }

  // Convert world coordinates to (cellX, cellY)
  worldToCell(x, z) {
    const cellX = Math.floor((x + this.gridOffset) / this.cellSize);
    const cellY = Math.floor((z + this.gridOffset) / this.cellSize);
    return {
      cellX: Math.max(0, Math.min(11, cellX)),
      cellY: Math.max(0, Math.min(11, cellY)),
    };
  }

  onPointerMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onPointerDown(e) {
    // Keep standard click handlers if any
  }

  loadPlacedItems(placedList) {
    this.placedMeshMap.forEach((mesh) => this.scene.remove(mesh));
    this.placedMeshMap.clear();

    if (!Array.isArray(placedList)) return;
    placedList.forEach((item) => {
      this.addPlacedItemToScene(item, false);
    });
    this.setTheme(this.isDark);
  }

  addPlacedItemToScene(item, animate = true) {
    if (!window.itemBuilder) return;
    const meshGroup = window.itemBuilder.buildItemMesh(item.itemId, { color: item.color });
    meshGroup.userData = { ...item };

    const worldPos = this.cellToWorld(item.cellX || 6, item.cellY || 6);
    meshGroup.position.set(worldPos.x, 0, worldPos.z);
    meshGroup.rotation.y = ((item.rotation || 0) * Math.PI) / 180;

    if (animate) {
      meshGroup.scale.set(0.01, 0.01, 0.01);
      const startTime = performance.now();
      const duration = 450;
      const animatePop = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / duration);
        const c1 = 1.70158;
        const c3 = c1 + 1;
        const scale = 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
        meshGroup.scale.set(scale, scale, scale);
        if (progress < 1.0) {
          requestAnimationFrame(animatePop);
        } else {
          meshGroup.scale.set(1, 1, 1);
        }
      };
      requestAnimationFrame(animatePop);
    }

    this.scene.add(meshGroup);
    this.placedMeshMap.set(item.instanceId, meshGroup);
  }

  removeItemFromScene(instanceId) {
    if (this.placedMeshMap.has(instanceId)) {
      const mesh = this.placedMeshMap.get(instanceId);
      this.scene.remove(mesh);
      this.placedMeshMap.delete(instanceId);
    }
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update controls
    if (this.controls) this.controls.update();

    // Drift clouds
    this.clouds.forEach((cloud) => {
      cloud.position.x += cloud.userData.speed;
      if (cloud.position.x > 35) cloud.position.x = -35;
    });

    this.renderer.render(this.scene, this.camera);
  }
}

window.HouseGameScene = HouseGameScene;
