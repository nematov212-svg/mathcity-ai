/**
 * MathCity 3D Drift & Poyga - 3D Showroom Garage & Lobby
 * Rotating turntable podium, reflective floor, spotlights, 360 orbit inspection,
 * car selection carousel, paint & rim customizer, and game mode launcher.
 */

class GarageManager {
  constructor(scene, camera, controls, onCarSelected, onPlayGame) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.onCarSelected = onCarSelected;
    this.onPlayGame = onPlayGame;

    this.garageGroup = new THREE.Group();
    this.scene.add(this.garageGroup);

    this.currentCarIndex = 0;
    this.currentCarModel = null;
    this.podium = null;
    this.isRotating = true;

    this.ownedCars = ['samarkand_gt'];
    this.userCoins = 100;

    this._buildGarageEnvironment();
  }

  _buildGarageEnvironment() {
    // 1. Dark Reflective Epoxy Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.12,
      metalness: 0.88,
      envMapIntensity: 1.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    this.garageGroup.add(floor);

    // 2. Circular Turntable Podium
    const podiumGeo = new THREE.CylinderGeometry(5.2, 5.5, 0.35, 48);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.8,
      roughness: 0.25,
    });
    this.podium = new THREE.Mesh(podiumGeo, podiumMat);
    this.podium.position.set(0, 0.175, 0);
    this.podium.receiveShadow = true;
    this.garageGroup.add(this.podium);

    // Neon Accent Ring around podium
    const ringGeo = new THREE.TorusGeometry(5.3, 0.05, 16, 64);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 }); // Indigo Neon
    const neonRing = new THREE.Mesh(ringGeo, ringMat);
    neonRing.position.set(0, 0.35, 0);
    this.garageGroup.add(neonRing);

    // 3. Back Wall with Neon Strip & MathCity Branding
    const wallGeo = new THREE.BoxGeometry(45, 18, 1);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.2,
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 9, -15);
    backWall.receiveShadow = true;
    this.garageGroup.add(backWall);

    // Neon Wall Light Strips
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // Emerald Neon
    const strip1 = new THREE.Mesh(new THREE.BoxGeometry(32, 0.15, 0.1), stripMat);
    strip1.position.set(0, 11, -14.4);
    this.garageGroup.add(strip1);

    const strip2 = new THREE.Mesh(new THREE.BoxGeometry(32, 0.15, 0.1), new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
    strip2.position.set(0, 7, -14.4);
    this.garageGroup.add(strip2);

    // 4. Dramatic Studio Spotlights
    const spotCenter = new THREE.SpotLight(0xffffff, 4.5);
    spotCenter.position.set(0, 14, 0);
    spotCenter.angle = Math.PI / 4;
    spotCenter.penumbra = 0.6;
    spotCenter.castShadow = true;
    spotCenter.shadow.mapSize.width = 1024;
    spotCenter.shadow.mapSize.height = 1024;
    this.garageGroup.add(spotCenter);

    const spotFront = new THREE.SpotLight(0x60a5fa, 2.2);
    spotFront.position.set(-8, 9, 8);
    spotFront.target = this.podium;
    this.garageGroup.add(spotFront);

    const spotRear = new THREE.SpotLight(0xf472b6, 2.2);
    spotRear.position.set(8, 9, -8);
    spotRear.target = this.podium;
    this.garageGroup.add(spotRear);

    // Ambient light
    const ambLight = new THREE.AmbientLight(0x1e293b, 1.2);
    this.garageGroup.add(ambLight);

    // Initially active in garage
    this.setVisible(true);
  }

  loadCar(index, customColor = null, customWheels = null) {
    this.currentCarIndex = index;
    const def = CAR_DEFINITIONS[index];

    if (this.currentCarModel) {
      this.garageGroup.remove(this.currentCarModel);
    }

    this.currentCarModel = CarBuilder.createCarModel(def, customColor, customWheels);
    this.currentCarModel.position.set(0, 0.35, 0);
    this.garageGroup.add(this.currentCarModel);

    if (this.onCarSelected) {
      this.onCarSelected(def, this.isCarOwned(def.key));
    }
  }

  isCarOwned(carKey) {
    return this.ownedCars.includes(carKey) || carKey === 'samarkand_gt';
  }

  setOwnedCars(list) {
    if (Array.isArray(list)) {
      this.ownedCars = list;
    }
  }

  setUserCoins(coins) {
    this.userCoins = coins;
  }

  nextCar() {
    let nextIdx = (this.currentCarIndex + 1) % CAR_DEFINITIONS.length;
    this.loadCar(nextIdx);
  }

  prevCar() {
    let prevIdx = (this.currentCarIndex - 1 + CAR_DEFINITIONS.length) % CAR_DEFINITIONS.length;
    this.loadCar(prevIdx);
  }

  setColor(hex) {
    if (this.currentCarModel) {
      CarBuilder.updatePaintColor(this.currentCarModel, hex);
    }
  }

  setWheels(styleKey) {
    if (this.currentCarModel) {
      CarBuilder.updateWheelStyle(this.currentCarModel, styleKey);
    }
  }

  repairCurrentCar() {
    if (this.currentCarModel) {
      CarBuilder.repairCarModel(this.currentCarModel);
    }
  }

  update(dt) {
    if (!this.garageGroup.visible) return;

    // Turntable smooth auto-rotation
    if (this.isRotating && this.currentCarModel) {
      this.currentCarModel.rotation.y += dt * 0.35;
      if (this.podium) {
        this.podium.rotation.y = this.currentCarModel.rotation.y;
      }
    }
  }

  setVisible(visible) {
    this.garageGroup.visible = visible;
    if (visible) {
      // Set camera to garage angle
      this.camera.position.set(-6.5, 3.2, 7.5);
      this.camera.lookAt(0, 1.2, 0);
      if (this.controls) {
        this.controls.target.set(0, 1.2, 0);
        this.controls.enabled = true;
        this.controls.minDistance = 4.0;
        this.controls.maxDistance = 14.0;
      }
    } else {
      if (this.controls) {
        this.controls.enabled = false;
      }
    }
  }

  getCurrentCarData() {
    const def = CAR_DEFINITIONS[this.currentCarIndex];
    return {
      definition: def,
      color: this.currentCarModel ? this.currentCarModel.userData.paintColor : def.defaultColor,
      wheels: this.currentCarModel ? this.currentCarModel.userData.wheelStyle : def.defaultWheels,
      isOwned: this.isCarOwned(def.key),
    };
  }
}

window.GarageManager = GarageManager;
