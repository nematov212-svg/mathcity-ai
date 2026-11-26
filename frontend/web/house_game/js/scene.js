/**
 * MathCity AI — 3D House Game Scene, Grid, Lighting, Camera, & Interactive Sandbox Engine
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
    this.smokeParticles = [];
    this.placedMeshMap = new Map(); // instanceId -> Group

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
    this.isLowPerformance = false;

    this.init();
  }

  init() {
    // 1. Check WebGL support
    if (!this.checkWebGLSupport()) {
      document.getElementById('fallback-view').style.display = 'flex';
      return;
    }

    // 2. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xBAE6FD);
    this.scene.fog = new THREE.FogExp2(0xBAE6FD, 0.015);

    // 3. Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.5, 150);
    this.setCameraInitialPosition();

    // 4. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 5. Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 6.0;
    this.controls.maxDistance = 32.0;
    this.controls.minPolarAngle = 0.1;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.06; // Prevent diving under ground
    this.controls.target.set(0, 1.2, 0);

    // 6. Environment & Ground
    this.setupLighting();
    this.createEnvironment();
    this.createGridGround();

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
    const dist = 18.0;
    const angle = Math.PI / 4; // 45 deg isometric
    const elev = 0.65; // ~37 deg
    this.camera.position.set(
      Math.cos(angle) * dist,
      dist * Math.sin(elev),
      Math.sin(angle) * dist
    );
  }

  resetCamera() {
    this.setCameraInitialPosition();
    this.controls.target.set(0, 1.2, 0);
    this.controls.update();
  }

  setupLighting() {
    // Hemisphere ambient light
    this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x475569, 0.75);
    this.hemiLight.position.set(0, 30, 0);
    this.scene.add(this.hemiLight);

    // Sun directional light
    this.dirLight = new THREE.DirectionalLight(0xFFFBEB, 1.15);
    this.dirLight.position.set(16, 25, 14);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 60;
    const d = 15;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Moon directional light for night mode
    this.moonLight = new THREE.DirectionalLight(0x60A5FA, 0.0);
    this.moonLight.position.set(-16, 22, -14);
    this.scene.add(this.moonLight);
  }

  createEnvironment() {
    // Distant low-poly perimeter mountains
    const mountainMat = new THREE.MeshLambertMaterial({ color: 0x64748B, flatShading: true });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = 38 + (i % 3) * 6;
      const h = 8 + (i % 4) * 4;
      const mountain = new THREE.Mesh(new THREE.ConeGeometry(8 + (i % 2) * 4, h, 6), mountainMat);
      mountain.position.set(Math.cos(angle) * r, h / 2 - 1, Math.sin(angle) * r);
      this.scene.add(mountain);
    }

    // Drifting clouds
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, flatShading: true, transparent: true, opacity: 0.88 });
    for (let c = 0; c < 6; c++) {
      const cloud = new THREE.Group();
      for (let p = 0; p < 4; p++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.2 + Math.random() * 0.8, 6, 6), cloudMat);
        puff.position.set((p - 1.5) * 1.4, Math.random() * 0.4, (Math.random() - 0.5) * 1.2);
        cloud.add(puff);
      }
      cloud.position.set((Math.random() - 0.5) * 50, 14 + Math.random() * 4, (Math.random() - 0.5) * 50);
      cloud.userData.speed = 0.015 + Math.random() * 0.015;
      this.clouds.push(cloud);
      this.scene.add(cloud);
    }
  }

  createGridGround() {
    // Invisible raycast ground plane
    const planeGeom = new THREE.PlaneGeometry(100, 100);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    this.groundPlane = new THREE.Mesh(planeGeom, planeMat);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.scene.add(this.groundPlane);

    // 12x12 Yard Grass Base
    const yardBase = new THREE.Mesh(
      new THREE.BoxGeometry(18.2, 0.4, 18.2),
      new THREE.MeshLambertMaterial({ color: 0x4ADE80, flatShading: true })
    );
    yardBase.position.y = -0.2;
    yardBase.receiveShadow = true;
    this.scene.add(yardBase);

    // Driveway / Road along front edge (Z = 7 to 9)
    const road = new THREE.Mesh(
      new THREE.BoxGeometry(18.4, 0.04, 3.2),
      new THREE.MeshLambertMaterial({ color: 0x334155, flatShading: true })
    );
    road.position.set(0, 0.02, 7.4);
    road.receiveShadow = true;
    this.scene.add(road);

    // Road white dashed lines
    const lineMat = new THREE.MeshLambertMaterial({ color: 0xF8FAFC });
    for (let x = -8; x <= 8; x += 2.5) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.15), lineMat);
      stripe.position.set(x, 0.03, 7.4);
      this.scene.add(stripe);
    }

    // Central 6x6 house building area boundary
    const housePlotBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(9.05, 0.05, 9.05)),
      new THREE.LineBasicMaterial({ color: 0x8B5CF6, linewidth: 2 })
    );
    housePlotBorder.position.set(0, 0.03, 0);
    this.scene.add(housePlotBorder);

    // Subtle 12x12 cell grid lines
    const grid = new THREE.GridHelper(18, 12, 0x8B5CF6, 0xCBD5E1);
    grid.position.y = 0.02;
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  setTheme(isDark) {
    this.isDark = !!isDark;
    if (this.isDark) {
      // Night
      this.scene.background.setHex(0x0A0F24);
      this.scene.fog.color.setHex(0x0A0F24);
      this.hemiLight.color.setHex(0x1E1B4B);
      this.hemiLight.groundColor.setHex(0x0F172A);
      this.hemiLight.intensity = 0.45;
      this.dirLight.intensity = 0.15;
      this.moonLight.intensity = 0.9;
    } else {
      // Day
      this.scene.background.setHex(0xBAE6FD);
      this.scene.fog.color.setHex(0xBAE6FD);
      this.hemiLight.color.setHex(0xFFFFFF);
      this.hemiLight.groundColor.setHex(0x475569);
      this.hemiLight.intensity = 0.75;
      this.dirLight.intensity = 1.15;
      this.moonLight.intensity = 0.0;
    }

    // Toggle window glass and lantern glowing emissions
    this.placedMeshMap.forEach((meshGroup) => {
      meshGroup.traverse((node) => {
        if (node.isMesh && node.userData) {
          if (meshGroup.userData.isWindow) {
            node.material.emissive = new THREE.Color(this.isDark ? 0xFDE047 : 0x000000);
          }
          if (meshGroup.userData.isLantern && node === meshGroup.userData.bulbMesh) {
            node.material.emissiveIntensity = this.isDark ? 1.5 : 0.4;
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
    // Clear old items
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
