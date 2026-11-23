/**
 * MathCity 3D Drift & Poyga - Car Models & Vertex Deformation Engine
 * 10+ distinct vehicles, 8 paint colors, 3 rim variants, PBR materials,
 * real-time collision mesh deformation (kuzov pachoq bo'lishi) & repairs.
 */

const CAR_DEFINITIONS = [
  {
    key: 'samarkand_gt',
    name: 'Samarkand GT',
    category: 'Supercar',
    price: 0,
    maxSpeedKmh: 310,
    acceleration: 9.2,
    handling: 8.8,
    driftRating: 8.5,
    mass: 1350,
    soundProfile: 'v10_screamer',
    defaultColor: '#E11D48',
    defaultWheels: 'sport_5spoke',
    width: 2.15,
    height: 1.18,
    length: 4.60,
    desc: 'Aerodinamik uglerod korpus va yuqori tezlanishga ega professional superkar.',
  },
  {
    key: 'tashkent_v8',
    name: 'Tashkent V8',
    category: 'Muscle Car',
    price: 150,
    maxSpeedKmh: 275,
    acceleration: 8.9,
    handling: 7.2,
    driftRating: 9.3,
    mass: 1680,
    soundProfile: 'v8_muscle',
    defaultColor: '#EA580C',
    defaultWheels: 'classic_dish',
    width: 2.22,
    height: 1.34,
    length: 4.85,
    desc: 'Kuchli 6.2L V8 motor, chuqur g‘uldirash va orqa g‘ildirakli drift burnouti.',
  },
  {
    key: 'fergana_drift',
    name: 'Fergana R-Spec',
    category: 'Drift Maxsus',
    price: 280,
    maxSpeedKmh: 285,
    acceleration: 9.0,
    handling: 9.5,
    driftRating: 10.0,
    mass: 1240,
    soundProfile: 'turbo_drift',
    defaultColor: '#10B981',
    defaultWheels: 'deep_dish_drift',
    width: 2.20,
    height: 1.20,
    length: 4.55,
    desc: 'Kengaytirilgan burilish burchagi (60° lock) va agressiv turbo blow-off ovozli drift yetakchisi.',
  },
  {
    key: 'bukhara_phantom',
    name: 'Bukhara Phantom',
    category: 'Hypercar',
    price: 500,
    maxSpeedKmh: 345,
    acceleration: 9.9,
    handling: 9.6,
    driftRating: 8.8,
    mass: 1420,
    soundProfile: 'hyper_v12',
    defaultColor: '#8B5CF6',
    defaultWheels: 'multi_spoke_mesh',
    width: 2.24,
    height: 1.12,
    length: 4.75,
    desc: 'Aktiv aerodinamik qanotga ega 1200 ot kuchli gibrid giperkar.',
  },
  {
    key: 'andijan_turbo',
    name: 'Andijan Turbo',
    category: 'Hot-Hatch',
    price: 90,
    maxSpeedKmh: 235,
    acceleration: 7.8,
    handling: 9.1,
    driftRating: 7.9,
    mass: 1180,
    soundProfile: 'turbo_drift',
    defaultColor: '#06B6D4',
    defaultWheels: 'sport_5spoke',
    width: 1.98,
    height: 1.38,
    length: 4.05,
    desc: 'Shahar ko‘chalarida chaqqon, qisqa burilish radiusi bilan tor joylarda ustun.',
  },
  {
    key: 'khiva_cruiser',
    name: 'Khiva Cruiser',
    category: 'Klassik Coupe',
    price: 120,
    maxSpeedKmh: 220,
    acceleration: 7.0,
    handling: 7.0,
    driftRating: 8.2,
    mass: 1540,
    soundProfile: 'v8_muscle',
    defaultColor: '#F59E0B',
    defaultWheels: 'classic_dish',
    width: 2.10,
    height: 1.30,
    length: 4.90,
    desc: 'Xrom detallar, vintage kuzov va klassik sokin g‘uldirash bilan hashamatli kupé.',
  },
  {
    key: 'zaamin_beast',
    name: 'Zaamin Beast',
    category: 'SUV 4x4',
    price: 220,
    maxSpeedKmh: 240,
    acceleration: 7.5,
    handling: 7.8,
    driftRating: 7.2,
    mass: 2350,
    soundProfile: 'v8_muscle',
    defaultColor: '#1E293B',
    defaultWheels: 'deep_dish_drift',
    width: 2.30,
    height: 1.76,
    length: 4.95,
    desc: 'Mustahkam himoya bamperlari va yuqori to‘qnashuv chidamliligiga ega tog‘ yo‘ltanlami.',
  },
  {
    key: 'surxon_hauler',
    name: 'Surxon Titan',
    category: 'Pikap / Yuk',
    price: 180,
    maxSpeedKmh: 205,
    acceleration: 6.8,
    handling: 6.5,
    driftRating: 7.5,
    mass: 2800,
    soundProfile: 'v8_muscle',
    defaultColor: '#78350F',
    defaultWheels: 'classic_dish',
    width: 2.38,
    height: 1.82,
    length: 5.60,
    desc: 'Og‘ir to‘siqlarni yorib o‘tuvchi ulkan turtki quvvatiga ega mustahkam pikap.',
  },
  {
    key: 'navoi_lightning',
    name: 'Navoi Lightning',
    category: 'Elektr Sport',
    price: 380,
    maxSpeedKmh: 325,
    acceleration: 9.8,
    handling: 9.2,
    driftRating: 8.6,
    mass: 1650,
    soundProfile: 'electric_whine',
    defaultColor: '#EC4899',
    defaultWheels: 'multi_spoke_mesh',
    width: 2.18,
    height: 1.19,
    length: 4.68,
    desc: 'Bir lahzada maksimal quvvatga chiquvchi ikki motorli zamonaviy elektr sportkar.',
  },
  {
    key: 'kokand_interceptor',
    name: 'Kokand Interceptor',
    category: 'Sport Sedan',
    price: 320,
    maxSpeedKmh: 290,
    acceleration: 8.7,
    handling: 9.0,
    driftRating: 9.0,
    mass: 1520,
    soundProfile: 'turbo_drift',
    defaultColor: '#0F172A',
    defaultWheels: 'sport_5spoke',
    width: 2.12,
    height: 1.32,
    length: 4.78,
    desc: 'Mukammal muvozanat va drift barqarorligiga ega professional poyga sedani.',
  },
];

const COLOR_PALETTE = [
  { name: 'Crimson Qizil', hex: '#E11D48' },
  { name: 'Obsidian Qora', hex: '#1E293B' },
  { name: 'Marvarid Oq', hex: '#F8FAFC' },
  { name: 'Neon Yalpiz', hex: '#10B981' },
  { name: 'Elektr Moviy', hex: '#06B6D4' },
  { name: 'Quyosh Oltin', hex: '#F59E0B' },
  { name: 'Qirollik Binafsha', hex: '#8B5CF6' },
  { name: 'Poyga Zarg‘aldoq', hex: '#EA580C' },
];

const WHEEL_STYLES = [
  { key: 'sport_5spoke', name: 'Sport 5-Yulduz' },
  { key: 'multi_spoke_mesh', name: 'Poyga Panjarali' },
  { key: 'deep_dish_drift', name: 'Keng Chuqur Disk' },
];

class CarBuilder {
  static createCarModel(def, colorHex = null, wheelStyle = null) {
    const root = new THREE.Group();
    root.name = 'CarRoot_' + def.key;

    const paintColor = colorHex || def.defaultColor;
    const rimStyle = wheelStyle || def.defaultWheels;

    // PBR Paint Material
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(paintColor),
      metalness: 0.85,
      roughness: 0.18,
      envMapIntensity: 1.4,
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.4,
      roughness: 0.5,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.82,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.08,
    });

    const w = def.width;
    const h = def.height;
    const l = def.length;

    // --- 1. Deformable Chassis Body ---
    // Subdivided box so vertices can crumple realistically on collision
    const bodyGeo = new THREE.BoxGeometry(w, h * 0.45, l, 8, 4, 12);
    // Elevate slightly above ground for suspension
    bodyGeo.translate(0, h * 0.38, 0);

    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.name = 'DeformableBody';

    // Cache original vertex positions for deformation physics & repair
    const posAttr = bodyGeo.attributes.position;
    const origPositions = new Float32Array(posAttr.array.length);
    origPositions.set(posAttr.array);
    bodyMesh.userData.origPositions = origPositions;
    bodyMesh.userData.isDeformable = true;
    bodyMesh.userData.condition = 100;

    root.add(bodyMesh);

    // --- 2. Cabin / Cockpit Greenhouse ---
    const cabinW = w * 0.82;
    const cabinH = h * 0.48;
    let cabinL = l * 0.52;
    let cabinZ = -l * 0.06;

    if (def.category === 'Pikap / Yuk') {
      cabinL = l * 0.34;
      cabinZ = l * 0.14;
    } else if (def.category === 'Hot-Hatch') {
      cabinL = l * 0.62;
      cabinZ = -l * 0.02;
    }

    const cabinGeo = new THREE.BoxGeometry(cabinW, cabinH, cabinL, 6, 3, 6);
    cabinGeo.translate(0, h * 0.38 + h * 0.42, cabinZ);
    const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
    cabinMesh.castShadow = true;
    root.add(cabinMesh);

    // Roof cap
    const roofGeo = new THREE.BoxGeometry(cabinW * 0.96, 0.06, cabinL * 0.96);
    roofGeo.translate(0, h * 0.38 + h * 0.66, cabinZ);
    const roofMesh = new THREE.Mesh(roofGeo, bodyMat);
    roofMesh.castShadow = true;
    root.add(roofMesh);

    // --- 3. Unique Aerodynamic Props per Car Category ---
    if (def.category === 'Supercar' || def.category === 'Hypercar' || def.category === 'Drift Maxsus') {
      // Rear GT Wing / Spoiler
      const wingW = w * 0.88;
      const wingH = (def.category === 'Drift Maxsus') ? 0.45 : 0.28;
      const wingZ = -l * 0.44;

      const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(wingW, 0.06, 0.35), carbonMat);
      wingBlade.position.set(0, h * 0.65 + wingH, wingZ);
      wingBlade.castShadow = true;
      root.add(wingBlade);

      // Struts
      const strutL = new THREE.Mesh(new THREE.BoxGeometry(0.06, wingH, 0.12), carbonMat);
      strutL.position.set(-wingW * 0.32, h * 0.65 + wingH * 0.5, wingZ);
      const strutR = strutL.clone();
      strutR.position.x = wingW * 0.32;
      root.add(strutL);
      root.add(strutR);
    } else if (def.category === 'Pikap / Yuk') {
      // Cargo Bed
      const bedW = w * 0.94;
      const bedH = h * 0.45;
      const bedL = l * 0.48;
      const bedZ = -l * 0.22;
      const bedMesh = new THREE.Mesh(new THREE.BoxGeometry(bedW, bedH, bedL), carbonMat);
      bedMesh.position.set(0, h * 0.42, bedZ);
      root.add(bedMesh);
    } else if (def.category === 'SUV 4x4') {
      // Roof Rack with Offroad Bar
      const rack = new THREE.Mesh(new THREE.BoxGeometry(cabinW * 0.9, 0.08, cabinL * 0.85), carbonMat);
      rack.position.set(0, h * 0.38 + h * 0.72, cabinZ);
      root.add(rack);

      const lightBar = new THREE.Mesh(new THREE.BoxGeometry(cabinW * 0.7, 0.1, 0.12), chromeMat);
      lightBar.position.set(0, h * 0.38 + h * 0.76, cabinZ + cabinL * 0.42);
      root.add(lightBar);
    }

    // --- 4. Headlights & Brake Taillights ---
    const hlGeo = new THREE.BoxGeometry(w * 0.20, h * 0.15, 0.08);
    const hlMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    });
    const hlLeft = new THREE.Mesh(hlGeo, hlMat);
    hlLeft.position.set(-w * 0.34, h * 0.42, l * 0.495);
    const hlRight = hlLeft.clone();
    hlRight.position.x = w * 0.34;
    root.add(hlLeft);
    root.add(hlRight);

    // Brake Taillights (glow red)
    const tlGeo = new THREE.BoxGeometry(w * 0.22, h * 0.15, 0.08);
    const tlMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const tlLeft = new THREE.Mesh(tlGeo, tlMat);
    tlLeft.position.set(-w * 0.34, h * 0.42, -l * 0.495);
    const tlRight = tlLeft.clone();
    tlRight.position.x = w * 0.34;
    root.add(tlLeft);
    root.add(tlRight);

    root.userData.taillightMaterial = tlMat;

    // --- 5. Four 3D Wheels with Custom Rims ---
    const wheelRadius = h * 0.32;
    const wheelWidth = w * 0.18;
    const halfTrack = w * 0.48;
    const frontZ = l * 0.32;
    const rearZ = -l * 0.32;
    const wheelY = wheelRadius;

    const wheels = [];
    const wheelPositions = [
      { name: 'FL', pos: [-halfTrack, wheelY, frontZ], isFront: true },
      { name: 'FR', pos: [ halfTrack, wheelY, frontZ], isFront: true },
      { name: 'RL', pos: [-halfTrack, wheelY, rearZ],  isFront: false },
      { name: 'RR', pos: [ halfTrack, wheelY, rearZ],  isFront: false },
    ];

    wheelPositions.forEach((wp) => {
      const wheelGroup = CarBuilder._createWheelMesh(wheelRadius, wheelWidth, rimStyle, wp.pos[0] > 0);
      wheelGroup.position.set(wp.pos[0], wp.pos[1], wp.pos[2]);
      wheelGroup.name = 'Wheel_' + wp.name;
      wheelGroup.userData.isFront = wp.isFront;
      root.add(wheelGroup);
      wheels.push(wheelGroup);
    });

    root.userData.wheels = wheels;
    root.userData.bodyMesh = bodyMesh;
    root.userData.bodyMaterial = bodyMat;
    root.userData.definition = def;
    root.userData.paintColor = paintColor;
    root.userData.wheelStyle = rimStyle;

    return root;
  }

  static _createWheelMesh(radius, width, style, isRightSide) {
    const group = new THREE.Group();

    // Black Rubber Tire (Torus/Cylinder)
    const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 18);
    tireGeo.rotateZ(Math.PI / 2);

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.9,
      metalness: 0.1,
    });
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    group.add(tire);

    // Metallic Rim Core
    const rimGeo = new THREE.CylinderGeometry(radius * 0.68, radius * 0.68, width * 1.02, 16);
    rimGeo.rotateZ(Math.PI / 2);

    const rimMat = new THREE.MeshStandardMaterial({
      color: (style === 'classic_dish') ? 0xd4d4d8 : (style === 'deep_dish_drift' ? 0xf8fafc : 0xa1a1aa),
      metalness: 0.92,
      roughness: 0.15,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    group.add(rim);

    // Wheel Spokes
    const spokeCount = (style === 'multi_spoke_mesh') ? 10 : 5;
    const spokeMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8, roughness: 0.3 });
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(width * 1.03, radius * 0.65, 0.04), spokeMat);
      spoke.rotation.x = angle;
      group.add(spoke);
    }

    // Brake Disc & Caliper inside rim
    const brakeDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.52, radius * 0.52, 0.04, 16),
      new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.9, roughness: 0.2 })
    );
    brakeDisc.rotateZ(Math.PI / 2);
    brakeDisc.position.x = isRightSide ? -width * 0.2 : width * 0.2;
    group.add(brakeDisc);

    const caliper = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.14, 0.18),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6, roughness: 0.3 }) // Brembo red
    );
    caliper.position.set(brakeDisc.position.x, radius * 0.32, 0);
    group.add(caliper);

    return group;
  }

  /**
   * REAL MESH DEFORMATION PHYSICS (Kuzovni ezish)
   * Displaces vertices of the car's body inwards at impact location
   */
  static applyCollisionDeformation(carModel, localImpactPoint, normal, impulseForce) {
    const bodyMesh = carModel.userData.bodyMesh;
    if (!bodyMesh || !bodyMesh.userData.isDeformable) return;

    const geo = bodyMesh.geometry;
    const pos = geo.attributes.position;
    const orig = bodyMesh.userData.origPositions;

    const radius = Math.min(2.2, 0.8 + impulseForce * 0.12);
    const maxPush = Math.min(0.55, impulseForce * 0.05);

    let verticesDeformed = 0;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);

      const dx = vx - localImpactPoint.x;
      const dy = vy - localImpactPoint.y;
      const dz = vz - localImpactPoint.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < radius) {
        const falloff = 1.0 - (dist / radius);
        const displacement = falloff * falloff * maxPush;

        // Push inwards along impact normal with random crinkle noise
        const noise = (Math.random() - 0.5) * 0.08 * falloff;
        pos.setX(i, vx + (normal.x * displacement + noise));
        pos.setY(i, vy + (normal.y * displacement * 0.5 + noise));
        pos.setZ(i, vz + (normal.z * displacement + noise));

        verticesDeformed++;
      }
    }

    if (verticesDeformed > 0) {
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      // Degrade vehicle condition
      const damageAmount = Math.round(Math.min(35, impulseForce * 3.5));
      bodyMesh.userData.condition = Math.max(0, (bodyMesh.userData.condition || 100) - damageAmount);
    }
  }

  /**
   * REPAIR BODY (Pachoq kuzovni zavod holatiga qaytarish)
   */
  static repairCarModel(carModel) {
    const bodyMesh = carModel.userData.bodyMesh;
    if (!bodyMesh || !bodyMesh.userData.origPositions) return;

    const geo = bodyMesh.geometry;
    const pos = geo.attributes.position;
    const orig = bodyMesh.userData.origPositions;

    for (let i = 0; i < orig.length; i++) {
      pos.array[i] = orig[i];
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    bodyMesh.userData.condition = 100;
  }

  /**
   * REAL-TIME COLOR & WHEEL UPDATE
   */
  static updatePaintColor(carModel, newHex) {
    if (carModel.userData.bodyMaterial) {
      carModel.userData.bodyMaterial.color.set(newHex);
      carModel.userData.paintColor = newHex;
    }
  }

  static updateWheelStyle(carModel, newStyle) {
    const def = carModel.userData.definition;
    const wheels = carModel.userData.wheels;
    if (!wheels || !def) return;

    const wheelRadius = def.height * 0.32;
    const wheelWidth = def.width * 0.18;

    wheels.forEach((w) => {
      const isRight = w.position.x > 0;
      const isFront = w.userData.isFront;
      const currentPos = w.position.clone();
      const currentRot = w.rotation.clone();

      carModel.remove(w);

      const replacement = CarBuilder._createWheelMesh(wheelRadius, wheelWidth, newStyle, isRight);
      replacement.position.copy(currentPos);
      replacement.rotation.copy(currentRot);
      replacement.name = w.name;
      replacement.userData.isFront = isFront;

      carModel.add(replacement);
    });

    carModel.userData.wheelStyle = newStyle;
  }
}

window.CAR_DEFINITIONS = CAR_DEFINITIONS;
window.COLOR_PALETTE = COLOR_PALETTE;
window.WHEEL_STYLES = WHEEL_STYLES;
window.CarBuilder = CarBuilder;
