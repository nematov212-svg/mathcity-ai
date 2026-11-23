/**
 * MathCity 3D Drift & Poyga - Master Game Coordinator
 * Handles Scene, Renderer with Low/Med/High Quality & Auto-FPS monitoring,
 * State Machine (Garage <-> Playing), Dynamic Cameras, PostMessage Bridge with Flutter.
 */

class MathCityDriftGame {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.state = 'GARAGE'; // 'GARAGE' | 'PLAYING' | 'PAUSED'
    this.mode = 'drift';   // 'free' | 'drift' | 'time_attack'

    this.quality = 'high'; // 'low' | 'med' | 'high'
    this.fpsCounter = 60;
    this.fpsHistory = [];
    this.lastTime = performance.now();

    // Scene & Renderer
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // Subsystems
    this.cityManager = null;
    this.garageManager = null;
    this.physics = null;
    this.activeCarModel = null;

    // Cameras
    this.cameraMode = 'CHASE'; // 'CHASE' | 'HOOD' | 'TOP'
    this.camYaw = 0;
    this.camPitch = 0.22;
    this.camDist = 8.5;

    // Weather & Day/Night
    this.timeOfDay = 12.0; // 0-24 hrs
    this.isNight = false;
    this.isRaining = false;

    // Time Attack Mode timer
    this.timeAttackRemaining = 90.0;

    // User Data from Flutter
    this.userId = 'demo-user';
    this.token = '';
    this.userCoins = 100;
    this.ownedCars = ['samarkand_gt'];

    // Inputs
    this.keys = {};
    this.touchSteer = 0;
    this.touchThrottle = false;
    this.touchBrake = false;
    this.touchHandbrake = false;

    this.init();
  }

  init() {
    this._initThree();
    this._initLighting();
    this._initSubsystems();
    this._initInputs();
    this._initPostMessageBridge();
    this._initUI();

    window.addEventListener('resize', () => this.onWindowResize());

    // Start loop
    requestAnimationFrame((t) => this.animate(t));

    // Notify Flutter that Game is ready
    this.sendMessageToFlutter('MATHCITY_GAME_READY', {});
  }

  _initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8); // Sky blue
    this.scene.fog = new THREE.FogExp2(0x38bdf8, 0.0035);

    this.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.2, 800);
    this.camera.position.set(-6, 3, 7);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    if (window.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
    }
  }

  _initLighting() {
    // Sun Directional Light
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    this.sunLight.position.set(60, 100, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 300;
    this.sunLight.shadow.camera.left = -90;
    this.sunLight.shadow.camera.right = 90;
    this.sunLight.shadow.camera.top = 90;
    this.sunLight.shadow.camera.bottom = -90;
    this.scene.add(this.sunLight);

    // Hemisphere Ambient Sky/Ground Light
    this.hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 1.2);
    this.scene.add(this.hemiLight);
  }

  _initSubsystems() {
    // 1. City Open World
    this.cityManager = new CityManager(this.scene);
    this.cityManager.buildCity();

    // 2. 3D Garage Showroom
    this.garageManager = new GarageManager(
      this.scene,
      this.camera,
      this.controls,
      (def, isOwned) => this.onGarageCarChanged(def, isOwned),
      (mode) => this.startPlayMode(mode)
    );
    this.garageManager.loadCar(0);

    // Initial state: Show garage
    this.enterGarage();

    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart')) {
      setTimeout(() => this.startPlayMode(params.get('autostart')), 200);
    }
  }

  _initInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (window.soundEngine) window.soundEngine.resume();

      if (e.code === 'KeyC') this.cycleCamera();
      if (e.code === 'KeyR') this.repairCar();
      if (e.code === 'Escape') this.togglePause();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Touch Controls setup
    const bindTouch = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); });
      el.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
      el.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(); });
      el.addEventListener('mouseup', (e) => { e.preventDefault(); onUp(); });
    };

    bindTouch('btn-left', () => { this.touchSteer = 1.0; }, () => { this.touchSteer = 0; });
    bindTouch('btn-right', () => { this.touchSteer = -1.0; }, () => { this.touchSteer = 0; });
    bindTouch('btn-gas', () => { this.touchThrottle = true; }, () => { this.touchThrottle = false; });
    bindTouch('btn-brake', () => { this.touchBrake = true; }, () => { this.touchBrake = false; });
    bindTouch('btn-handbrake', () => { this.touchHandbrake = true; }, () => { this.touchHandbrake = false; });
  }

  _initPostMessageBridge() {
    window.addEventListener('message', (event) => {
      const { type, data } = event.data || {};
      if (!type) return;

      switch (type) {
        case 'INIT_USER':
          this.userId = data.userId || this.userId;
          this.token = data.token || this.token;
          this.userCoins = data.coins ?? this.userCoins;
          if (Array.isArray(data.ownedCars)) {
            this.ownedCars = data.ownedCars;
            this.garageManager.setOwnedCars(this.ownedCars);
          }
          this.garageManager.setUserCoins(this.userCoins);
          this.updateCoinDisplay();
          break;

        case 'CAR_BOUGHT_SUCCESS':
          this.userCoins = data.newBalance ?? this.userCoins;
          if (data.carKey && !this.ownedCars.includes(data.carKey)) {
            this.ownedCars.push(data.carKey);
            this.garageManager.setOwnedCars(this.ownedCars);
          }
          this.updateCoinDisplay();
          this.onGarageCarChanged(this.garageManager.getCurrentCarData().definition, true);
          if (window.soundEngine) window.soundEngine.playRewardFanfare();
          break;

        case 'DRIFT_RECORDED_SUCCESS':
          this.userCoins = data.newBalance ?? this.userCoins;
          this.updateCoinDisplay();
          break;
      }
    });
  }

  sendMessageToFlutter(type, data) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type, data }, '*');
    }
  }

  _initUI() {
    this.updateCoinDisplay();

    // Color Swatches
    const paletteEl = document.getElementById('color-palette');
    if (paletteEl) {
      paletteEl.innerHTML = '';
      COLOR_PALETTE.forEach((c) => {
        const d = document.createElement('div');
        d.className = 'color-swatch';
        d.style.backgroundColor = c.hex;
        d.title = c.name;
        d.onclick = () => {
          this.garageManager.setColor(c.hex);
          const activeCar = this.garageManager.getCurrentCarData();
          this.sendMessageToFlutter('CUSTOMIZE_CAR', { carKey: activeCar.definition.key, color: c.hex });
        };
        paletteEl.appendChild(d);
      });
    }

    // Wheel Selector
    const wheelEl = document.getElementById('wheel-selector');
    if (wheelEl) {
      wheelEl.innerHTML = '';
      WHEEL_STYLES.forEach((w) => {
        const btn = document.createElement('button');
        btn.className = 'btn-wheel';
        btn.innerText = w.name;
        btn.onclick = () => {
          this.garageManager.setWheels(w.key);
          const activeCar = this.garageManager.getCurrentCarData();
          this.sendMessageToFlutter('CUSTOMIZE_CAR', { carKey: activeCar.definition.key, wheels: w.key });
        };
        wheelEl.appendChild(btn);
      });
    }
  }

  updateCoinDisplay() {
    const el = document.getElementById('garage-coins-text');
    if (el) el.innerText = `${this.userCoins} tanga`;
    const elHud = document.getElementById('hud-coins-text');
    if (elHud) elHud.innerText = `${this.userCoins} tanga`;
  }

  enterGarage() {
    this.state = 'GARAGE';
    document.getElementById('garage-overlay').style.display = 'flex';
    document.getElementById('hud-overlay').style.display = 'none';
    document.getElementById('touch-controls').style.display = 'none';

    this.garageManager.setVisible(true);

    if (this.activeCarModel) {
      this.scene.remove(this.activeCarModel);
      this.activeCarModel = null;
      this.physics = null;
    }
  }

  startPlayMode(mode = 'drift') {
    this.mode = mode;
    this.state = 'PLAYING';
    this.timeAttackRemaining = 90.0;

    document.getElementById('garage-overlay').style.display = 'none';
    document.getElementById('hud-overlay').style.display = 'block';

    // Show touch controls if on touch-capable device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.getElementById('touch-controls').style.display = 'flex';
    }

    this.garageManager.setVisible(false);

    // Spawn Player's Car in City
    const carData = this.garageManager.getCurrentCarData();
    this.activeCarModel = CarBuilder.createCarModel(carData.definition, carData.color, carData.wheels);

    // Start at City Center Boulevard
    this.activeCarModel.position.set(0, 0, 0);
    this.scene.add(this.activeCarModel);

    this.physics = new VehiclePhysics(this.activeCarModel, carData.definition);
    this.physics.position.set(0, 0, 0);

    if (window.soundEngine) {
      window.soundEngine.setProfile(carData.definition.soundProfile);
    }
  }

  repairCar() {
    if (this.physics && this.activeCarModel) {
      CarBuilder.repairCarModel(this.activeCarModel);
      if (window.soundEngine) window.soundEngine.playRewardFanfare();
      this.sendMessageToFlutter('REPAIR_CAR', { carKey: this.physics.def.key });
    }
  }

  cycleCamera() {
    if (this.cameraMode === 'CHASE') this.cameraMode = 'HOOD';
    else if (this.cameraMode === 'HOOD') this.cameraMode = 'TOP';
    else this.cameraMode = 'CHASE';
  }

  setQuality(q) {
    this.quality = q;
    if (q === 'low') {
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(1.0);
    } else if (q === 'med') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
      this.renderer.setPixelRatio(1.0);
    } else {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    }
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      document.getElementById('pause-menu').style.display = 'flex';
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      document.getElementById('pause-menu').style.display = 'none';
    }
  }

  onGarageCarChanged(def, isOwned) {
    document.getElementById('car-name').innerText = def.name;
    document.getElementById('car-cat').innerText = `${def.category}  •  ${def.maxSpeedKmh} KM/H`;
    document.getElementById('car-desc').innerText = def.desc;

    // Stat bars
    document.getElementById('bar-speed').style.width = `${Math.min(100, (def.maxSpeedKmh / 350) * 100)}%`;
    document.getElementById('bar-accel').style.width = `${def.acceleration * 10}%`;
    document.getElementById('bar-handling').style.width = `${def.handling * 10}%`;
    document.getElementById('bar-drift').style.width = `${def.driftRating * 10}%`;

    const buyBtn = document.getElementById('btn-buy-car');
    const playBtn = document.getElementById('btn-play');

    if (isOwned || def.price === 0) {
      buyBtn.style.display = 'none';
      playBtn.style.display = 'flex';
      playBtn.innerText = 'O‘YNAWNI BOSHLASH';
    } else {
      buyBtn.style.display = 'flex';
      playBtn.style.display = 'none';
      buyBtn.innerText = `Sotib olish: ${def.price} tanga`;
    }
  }

  buyCurrentCar() {
    const carData = this.garageManager.getCurrentCarData();
    const def = carData.definition;
    if (this.userCoins < def.price) {
      alert(`Oltin tangalar yetarli emas! Sizda: ${this.userCoins} tanga, kerak: ${def.price} tanga.`);
      return;
    }
    this.sendMessageToFlutter('BUY_CAR', { carKey: def.key, price: def.price });
  }

  animate(currentTime) {
    requestAnimationFrame((t) => this.animate(t));

    const dt = Math.min(0.08, (currentTime - this.lastTime) * 0.001);
    this.lastTime = currentTime;

    // Auto-FPS monitor
    this.fpsCounter = Math.round(1.0 / Math.max(0.001, dt));
    this.fpsHistory.push(this.fpsCounter);
    if (this.fpsHistory.length > 70) {
      this.fpsHistory.shift();
      const avg = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
      if (avg < 28 && this.quality === 'high') {
        this.setQuality('med');
      } else if (avg < 25 && this.quality === 'med') {
        this.setQuality('low');
      }
    }

    // Garage turntable update
    if (this.state === 'GARAGE') {
      this.garageManager.update(dt);
      if (this.controls) this.controls.update();
    }

    // Active Driving in City
    if (this.state === 'PLAYING' && this.physics) {
      // Collect Inputs
      let throttle = 0;
      let brake = 0;
      let steer = 0;
      let handbrake = false;

      if (this.keys['KeyW'] || this.keys['ArrowUp'] || this.touchThrottle) throttle = 1.0;
      if (this.keys['KeyS'] || this.keys['ArrowDown'] || this.touchBrake) brake = 1.0;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) steer += 1.0;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) steer -= 1.0;
      if (this.touchSteer !== 0) steer = this.touchSteer;
      if (this.keys['Space'] || this.touchHandbrake) handbrake = true;

      this.physics.setInputs(throttle, brake, steer, handbrake);
      this.physics.update(dt, this.cityManager);

      // Camera Follow Logic
      this._updateCamera(dt);

      // Time Attack Mode timer
      if (this.mode === 'time_attack') {
        this.timeAttackRemaining -= dt;
        if (this.timeAttackRemaining <= 0) {
          this.timeAttackRemaining = 0;
          this.endSession();
        }
      }

      // HUD Update
      this._updateHUD();
    }

    this.renderer.render(this.scene, this.camera);
  }

  _updateCamera(dt) {
    const carPos = this.physics.position;
    const carYaw = this.physics.yaw;
    const speedRatio = Math.abs(this.physics.speedKmh) / 200.0;

    if (this.cameraMode === 'CHASE') {
      // Dynamic camera with drift pivot & speed lag
      const targetDist = this.camDist + speedRatio * 3.5;
      const targetHeight = 3.2 + speedRatio * 0.8;

      // Slight lateral offset during high-angle drift for cinematic drama
      let lateralAngle = carYaw + Math.PI;
      if (this.physics.isDrifting) {
        lateralAngle += (this.physics.steerAngle * 0.35);
      }

      const diff = lateralAngle - this.camYaw;
      let delta = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      this.camYaw += delta * Math.min(1.0, dt * 7.5);

      const targetCamX = carPos.x + Math.sin(this.camYaw) * targetDist;
      const targetCamY = carPos.y + targetHeight;
      const targetCamZ = carPos.z + Math.cos(this.camYaw) * targetDist;

      this.camera.position.x += (targetCamX - this.camera.position.x) * Math.min(1.0, dt * 10.0);
      this.camera.position.y += (targetCamY - this.camera.position.y) * Math.min(1.0, dt * 10.0);
      this.camera.position.z += (targetCamZ - this.camera.position.z) * Math.min(1.0, dt * 10.0);

      this.camera.lookAt(carPos.x, carPos.y + 1.2, carPos.z);
    } else if (this.cameraMode === 'HOOD') {
      // Low Hood Cam
      const fwd = new THREE.Vector3(Math.sin(carYaw), 0, Math.cos(carYaw));
      this.camera.position.copy(carPos).add(fwd.clone().multiplyScalar(0.6)).add(new THREE.Vector3(0, 1.1, 0));
      this.camera.lookAt(carPos.clone().add(fwd.clone().multiplyScalar(15)));
    } else {
      // Birds-Eye Top Down
      this.camera.position.set(carPos.x, carPos.y + 35, carPos.z + 10);
      this.camera.lookAt(carPos.x, carPos.y, carPos.z);
    }
  }

  _updateHUD() {
    const kmh = Math.round(Math.abs(this.physics.speedKmh));
    const gear = Math.max(1, Math.min(6, Math.floor(kmh / 45) + 1));
    const condition = this.physics.getCondition();

    document.getElementById('hud-speed-num').innerText = kmh;
    document.getElementById('hud-gear').innerText = `GEAR: ${gear}`;
    document.getElementById('hud-condition-bar').style.width = `${condition}%`;
    document.getElementById('hud-condition-text').innerText = `Kuzov: ${condition}%`;

    // Drift Score HUD
    const driftBox = document.getElementById('hud-drift-banner');
    if (this.physics.isDrifting) {
      driftBox.style.display = 'flex';
      document.getElementById('hud-drift-pts').innerText = `+${Math.round(this.physics.driftScore)}`;
      document.getElementById('hud-combo-badge').innerText = `x${this.physics.currentCombo}`;
    } else {
      driftBox.style.display = 'none';
    }

    document.getElementById('hud-total-score').innerText = `BALL: ${this.physics.totalScore}`;

    if (this.mode === 'time_attack') {
      document.getElementById('hud-timer-badge').style.display = 'block';
      document.getElementById('hud-timer-badge').innerText = `⏱ ${Math.ceil(this.timeAttackRemaining)}s`;
    } else {
      document.getElementById('hud-timer-badge').style.display = 'none';
    }
  }

  endSession() {
    const finalScore = this.physics ? this.physics.totalScore : 0;
    const maxCombo = this.physics ? this.physics.currentCombo : 1;
    const carKey = this.physics ? this.physics.def.key : 'samarkand_gt';

    this.sendMessageToFlutter('DRIFT_FINISHED', {
      carKey,
      score: finalScore,
      maxCombo,
      duration: 60,
      maxSpeed: Math.round(Math.abs(this.physics.speedKmh)),
    });

    this.enterGarage();
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.mathCityGame = new MathCityDriftGame();
});
