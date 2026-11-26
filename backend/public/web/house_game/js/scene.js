/**
 * MathCity AI — 3D House Game Scene, Floating Diorama Island, Lighting, Camera, & Interactive Sandbox Engine
 * High-fidelity architectural diorama matching modern luxury villa design and construction stages.
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
    this.placedMeshMap = new Map(); // instanceId -> Group
    this.baseLedMesh = null;

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
      document.getElementById('fallback-view').style.display = 'flex';
      return;
    }

    // 2. Scene with elegant sky gradient
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xDCEEFF);
    this.scene.fog = new THREE.FogExp2(0xDCEEFF, 0.012);

    // 3. Camera (Isometric ~45 deg angle, elevation ~36 deg)
    this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.5, 160);
    this.setCameraInitialPosition();

    // 4. Renderer with soft shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 5. OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 6.0;
    this.controls.maxDistance = 34.0;
    this.controls.minPolarAngle = 0.1;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
    this.controls.target.set(0, 0.8, 0);

    // 6. Setup Lighting, Diorama Ground, & Environment
    this.setupLighting();
    this.createFloatingDiorama();
    this.createEnvironment();

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
    this.controls.target.set(0, 0.8, 0);
    this.controls.update();
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

    // 2. Soft Drop Shadow Disc beneath floating island at y = -2.1
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
    // Multi-material box: top=grass, sides=earth/stone cross-section, bottom=chamfer base
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x65A30D, flatShading: true });
    const sideMat = new THREE.MeshLambertMaterial({ color: 0x57534E, flatShading: true }); // Textured earthy-stone
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

    // 6. Corner Intersection Roadway (Matching Image 1)
    // Front road along Z = 7.0 to 10.4
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x1E293B, flatShading: true });
    const roadFront = new THREE.Mesh(new THREE.BoxGeometry(22.4, 0.04, 3.4), roadMat);
    roadFront.position.set(0, 0.02, 8.7);
    roadFront.receiveShadow = true;
    dioramaGroup.add(roadFront);

    // Left road along X = -10.4 to -7.0
    const roadLeft = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.04, 22.4), roadMat);
    roadLeft.position.set(-8.7, 0.02, 0);
    roadLeft.receiveShadow = true;
    dioramaGroup.add(roadLeft);

    // White dashed lane markings
    const lineMat = new THREE.MeshLambertMaterial({ color: 0xF8FAFC });
    // Front road dashed stripes
    for (let x = -6.0; x <= 10.0; x += 2.4) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.14), lineMat);
      stripe.position.set(x, 0.03, 8.7);
      dioramaGroup.add(stripe);
    }
    // Left road dashed stripes
    for (let z = -10.0; z <= 6.0; z += 2.4) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 1.2), lineMat);
      stripe.position.set(-8.7, 0.03, z);
      dioramaGroup.add(stripe);
    }

    // Road painted turn direction arrow (Matching Image 1: "→" marking near corner)
    const arrowShaft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.16), lineMat);
    arrowShaft.position.set(-6.2, 0.035, 7.6);
    const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 3), lineMat);
    arrowHead.rotation.z = -Math.PI / 2;
    arrowHead.rotation.x = -Math.PI / 2;
    arrowHead.position.set(-5.6, 0.035, 7.6);
    dioramaGroup.add(arrowShaft, arrowHead);

    // 7. Raised concrete sidewalk curb separating road and grass lawn
    const curbMat = new THREE.MeshLambertMaterial({ color: 0xE2E8F0 });
    // Front curb
    const curbFront = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.1, 0.24), curbMat);
    curbFront.position.set(1.0, 0.05, 6.9);
    curbFront.castShadow = true;
    curbFront.receiveShadow = true;
    // Left curb
    const curbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 15.6), curbMat);
    curbLeft.position.set(-6.9, 0.05, -1.0);
    curbLeft.castShadow = true;
    curbLeft.receiveShadow = true;
    dioramaGroup.add(curbFront, curbLeft);

    // 8. Low perimeter hedge along the curb (Image 1)
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

    // 9. Miniature Perimeter Trees (Matching Image 1: perimeter landscape)
    const treeMatTrunk = new THREE.MeshLambertMaterial({ color: 0x78350F });
    const treeMatLeaves = new THREE.MeshLambertMaterial({ color: 0x16A34A, flatShading: true });
    const perimeterTreePositions = [
      { x: 9.2, z: -9.2, scale: 0.9 },
      { x: 9.4, z: -6.4, scale: 1.05 },
      { x: 8.8, z: -3.8, scale: 0.85 },
      { x: 9.5, z: 4.8, scale: 0.95 },
      { x: -9.5, z: -9.5, scale: 1.1 },
      { x: -4.5, z: -9.8, scale: 0.8 },
      { x: 2.5, z: -9.8, scale: 1.0 },
    ];
    perimeterTreePositions.forEach((pos) => {
      const pTree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 1.4, 5), treeMatTrunk);
      trunk.position.y = 0.7;
      trunk.castShadow = true;
      const canopy1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 6, 6), treeMatLeaves);
      canopy1.position.y = 1.6;
      canopy1.castShadow = true;
      const canopy2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 5, 5), treeMatLeaves);
      canopy2.position.set(0, 2.1, 0);
      canopy2.castShadow = true;
      pTree.add(trunk, canopy1, canopy2);
      pTree.position.set(pos.x, 0, pos.z);
      pTree.scale.set(pos.scale, pos.scale, pos.scale);
      dioramaGroup.add(pTree);
    });

    // 10. Central Building Parcel Boundary (9x9 central house plot)
    const housePlotBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(9.05, 0.05, 9.05)),
      new THREE.LineBasicMaterial({ color: 0x8B5CF6, linewidth: 2 })
    );
    housePlotBorder.position.set(0, 0.03, 0);
    dioramaGroup.add(housePlotBorder);

    // Subtle 12x12 cell grid helper
    const grid = new THREE.GridHelper(18, 12, 0x8B5CF6, 0xCBD5E1);
    grid.position.y = 0.025;
    grid.material.opacity = 0.22;
    grid.material.transparent = true;
    dioramaGroup.add(grid);

    this.scene.add(dioramaGroup);
  }

  createEnvironment() {
    // Drifting clouds
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      flatShading: true,
      transparent: true,
      opacity: 0.88,
    });
    for (let c = 0; c < 6; c++) {
      const cloud = new THREE.Group();
      for (let p = 0; p < 4; p++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.2 + Math.random() * 0.8, 6, 6), cloudMat);
        puff.position.set((p - 1.5) * 1.4, Math.random() * 0.4, (Math.random() - 0.5) * 1.2);
        cloud.add(puff);
      }
      cloud.position.set((Math.random() - 0.5) * 55, 14 + Math.random() * 4, (Math.random() - 0.5) * 55);
      cloud.userData.speed = 0.014 + Math.random() * 0.012;
      this.clouds.push(cloud);
      this.scene.add(cloud);
    }
  }

  setTheme(isDark) {
    this.isDark = !!isDark;
    if (this.isDark) {
      // Night Mode (Matching Images 3 & 4)
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
    } else {
      // Day Mode (Matching Image 1 & 3)
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
    }

    // Toggle window glass and lantern glowing emissions
    this.placedMeshMap.forEach((meshGroup) => {
      meshGroup.traverse((node) => {
        if (node.isMesh && node.userData) {
          if (meshGroup.userData.isWindow) {
            node.material.emissive = new THREE.Color(this.isDark ? 0xFDE047 : 0x000000);
            node.material.emissiveIntensity = this.isDark ? 1.4 : 0.0;
          }
          if (meshGroup.userData.isLantern && node === meshGroup.userData.bulbMesh) {
            node.material.emissiveIntensity = this.isDark ? 1.6 : 0.4;
          }
          if (node.userData.isLedGroundSpot) {
            node.material.emissiveIntensity = this.isDark ? 1.8 : 0.5;
          }
          if (node.userData.isCarHeadlight) {
            node.material.emissiveIntensity = this.isDark ? 2.0 : 0.6;
          }
        }
      });
    });
  }

  setInteriorMode(isInterior) {
    this.isInteriorMode = !!isInterior;
    this.placedMeshMap.forEach((meshGroup) => {
      const isRoof = meshGroup.name.includes('roof');
      const isWall = meshGroup.name.includes('wall');
      if (isRoof || isWall) {
        meshGroup.traverse((child) => {
          if (child.isMesh) {
            child.visible = !this.isInteriorMode;
          }
        });
      }
    });
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

  // Select item from store to begin placement ghost
  selectItemToPlace(itemId, color) {
    this.selectedItemIdToPlace = itemId;
    this.selectedItemColor = color || null;
    this.currentRotation = 0;

    if (this.activeGhostMesh) {
      this.scene.remove(this.activeGhostMesh);
      this.activeGhostMesh = null;
    }

    if (!itemId) return;

    this.activeGhostMesh = window.itemBuilder.buildItemMesh(itemId, { color });
    this.activeGhostMesh.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
        node.material.transparent = true;
        node.material.opacity = 0.55;
      }
    });
    this.scene.add(this.activeGhostMesh);
    this.showHint('Joylashtirish uchun katakni tanlang', false);
  }

  rotatePlacementGhost() {
    this.currentRotation = (this.currentRotation + 90) % 360;
    if (this.activeGhostMesh) {
      this.activeGhostMesh.rotation.y = (this.currentRotation * Math.PI) / 180;
    }
  }

  cancelPlacement() {
    if (this.activeGhostMesh) {
      this.scene.remove(this.activeGhostMesh);
      this.activeGhostMesh = null;
    }
    this.selectedItemIdToPlace = null;
    this.hideHint();
  }

  onPointerMove(event) {
    if (!this.activeGhostMesh || !this.selectedItemIdToPlace) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.groundPlane);

    if (intersects.length > 0) {
      const p = intersects[0].point;
      const { cellX, cellY } = this.worldToCell(p.x, p.z);
      const worldPos = this.cellToWorld(cellX, cellY);

      // Central house boundary items snap to house center
      const isCentralItem =
        this.selectedItemIdToPlace.includes('foundation') ||
        this.selectedItemIdToPlace.includes('wall') ||
        this.selectedItemIdToPlace.includes('roof');

      if (isCentralItem) {
        this.activeGhostMesh.position.set(0, 0, 0);
      } else {
        this.activeGhostMesh.position.set(worldPos.x, 0, worldPos.z);
      }
      this.activeGhostMesh.rotation.y = (this.currentRotation * Math.PI) / 180;

      // Validate rule
      const validation = this.validatePlacementRule(this.selectedItemIdToPlace, cellX, cellY);
      const ghostColor = validation.valid ? 0x22C55E : 0xEF4444;

      this.activeGhostMesh.traverse((child) => {
        if (child.isMesh) {
          child.material.color.setHex(ghostColor);
        }
      });

      if (!validation.valid) {
        this.showHint(validation.error, true);
      } else {
        this.showHint('Bosing va joylashtiring! ✨', false);
      }
    }
  }

  onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.activeGhostMesh && this.selectedItemIdToPlace) {
      const intersects = this.raycaster.intersectObject(this.groundPlane);
      if (intersects.length > 0) {
        const { cellX, cellY } = this.worldToCell(intersects[0].point.x, intersects[0].point.z);
        const validation = this.validatePlacementRule(this.selectedItemIdToPlace, cellX, cellY);

        if (!validation.valid) {
          window.soundFx.playErrorThud();
          this.showHint(validation.error, true);
          return;
        }

        // Valid: send message to Flutter to execute server-backed placement
        window.sendToFlutter('REQUEST_PLACE_ITEM', {
          itemId: this.selectedItemIdToPlace,
          cellX,
          cellY,
          rotation: this.currentRotation,
          color: this.selectedItemColor,
        });

        window.soundFx.playBuildKnock();
        this.cancelPlacement();
      }
      return;
    }

    // Raycast on placed items for inspection
    const meshes = Array.from(this.placedMeshMap.values());
    const hits = this.raycaster.intersectObjects(meshes, true);
    if (hits.length > 0) {
      let topGroup = hits[0].object;
      while (topGroup.parent && topGroup.parent !== this.scene) {
        topGroup = topGroup.parent;
      }
      if (topGroup.userData && topGroup.userData.instanceId) {
        window.sendToFlutter('ITEM_SELECTED', topGroup.userData);
      }
    }
  }

  validatePlacementRule(itemId, cellX, cellY) {
    const placedItems = Array.from(this.placedMeshMap.values()).map((g) => g.userData);
    const hasFoundation = placedItems.some((p) => p.category === 'foundation');
    const hasWall = placedItems.some((p) => p.category === 'walls');

    const isWall = itemId.includes('wall');
    const isRoof = itemId.includes('roof') || itemId.includes('chimney') || itemId.includes('antenna');
    const isDoorOrWin = itemId.includes('door') || itemId.includes('window');
    const isVehicle = itemId.includes('car') || itemId.includes('bike') || itemId.includes('scooter') || itemId.includes('suv');
    const isFoundation = itemId.includes('foundation') || itemId === 'clean_lot' || itemId === 'gravel_base' || itemId === 'reinforced_basement';

    const isInsideHouse = cellX >= 3 && cellX <= 8 && cellY >= 3 && cellY <= 8;

    if (isWall && !hasFoundation) {
      return { valid: false, error: 'Avval poydevor quring! Devor poydevor ustiga quriladi.' };
    }
    if ((isRoof || isDoorOrWin) && !hasWall) {
      return { valid: false, error: 'Avval devor quring! Tom va eshiklar devorga o‘rnatiladi.' };
    }
    if (isVehicle && isInsideHouse) {
      return { valid: false, error: 'Mashina faqat hovli yo‘lagiga joylashtirilishi mumkin.' };
    }
    if (isFoundation && !isInsideHouse) {
      return { valid: false, error: 'Poydevor faqat markaziy uy hududiga (3–8 katak) quriladi.' };
    }

    return { valid: true };
  }

  // Load all placed items received from server
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
    const meshGroup = window.itemBuilder.buildItemMesh(item.itemId, { color: item.color });
    meshGroup.userData = { ...item };

    const isCentral =
      item.itemId.includes('foundation') ||
      item.itemId.includes('wall') ||
      item.itemId.includes('roof') ||
      item.itemId === 'clean_lot' ||
      item.itemId === 'gravel_base';

    if (isCentral) {
      meshGroup.position.set(0, 0, 0);
    } else {
      const worldPos = this.cellToWorld(item.cellX, item.cellY);
      meshGroup.position.set(worldPos.x, 0, worldPos.z);
    }
    meshGroup.rotation.y = ((item.rotation || 0) * Math.PI) / 180;

    // Pop-up bounce animation
    if (animate) {
      meshGroup.scale.set(0.01, 0.01, 0.01);
      const startTime = performance.now();
      const duration = 450;
      const animatePop = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1.0, elapsed / duration);
        // Ease out back curve
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

  showHint(message, isError) {
    const hintBox = document.getElementById('hint-box');
    if (!hintBox) return;
    hintBox.textContent = message;
    hintBox.className = isError ? 'show error' : 'show success';
    clearTimeout(this._hintTimer);
    this._hintTimer = setTimeout(() => this.hideHint(), 3200);
  }

  hideHint() {
    const hintBox = document.getElementById('hint-box');
    if (hintBox) hintBox.className = '';
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
