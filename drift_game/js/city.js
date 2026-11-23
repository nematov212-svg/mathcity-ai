/**
 * MathCity 3D Drift & Poyga - Open World City & Stunt Drift Arena
 * Realistic architectural houses (modern villas, traditional Uzbek courtyards, apartments, shops),
 * solid rigid colliders (uylar mustahkam), lighting, streetlamps, and stunt jump ramps.
 */

class CityManager {
  constructor(scene) {
    this.scene = scene;
    this.colliders = []; // Rigid bounding boxes for solid building collision
    this.destructibles = [];
    this.lights = [];
    this.streetLamps = [];
    this.windowMeshes = [];
    this.jumpRamps = [];

    this.blockSize = 80;
    this.gridBlocksX = 6;
    this.gridBlocksZ = 6;
    this.roadWidth = 16;
    this.sidewalkWidth = 4;

    this.isNight = false;
    this.isRaining = false;
  }

  buildCity() {
    this._buildGroundAndRoads();
    this._buildBuildingsAndHouses();
    this._buildDriftStuntArena();
    this._buildStreetPropsAndLighting();
  }

  _buildGroundAndRoads() {
    const totalW = this.gridBlocksX * this.blockSize;
    const totalD = this.gridBlocksZ * this.blockSize;

    // 1. Terrain Grass Base
    const grassGeo = new THREE.PlaneGeometry(totalW + 240, totalD + 240);
    grassGeo.rotateX(-Math.PI / 2);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a1e,
      roughness: 0.9,
      metalness: 0.05,
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.y = -0.05;
    grass.receiveShadow = true;
    this.scene.add(grass);

    // 2. Asphalt Material (high roughness, or wet reflective if raining)
    this.roadMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.8,
      metalness: 0.15,
      envMapIntensity: 0.8,
    });

    const curbMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      roughness: 0.7,
      metalness: 0.1,
    });

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 }); // Yellow road marking
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // North-South Avenues
    for (let x = 0; x <= this.gridBlocksX; x++) {
      const worldX = (x - this.gridBlocksX * 0.5) * this.blockSize;

      // Road strip
      const rGeo = new THREE.PlaneGeometry(this.roadWidth, totalD);
      rGeo.rotateX(-Math.PI / 2);
      const road = new THREE.Mesh(rGeo, this.roadMat);
      road.position.set(worldX, 0.01, 0);
      road.receiveShadow = true;
      this.scene.add(road);

      // Elevated concrete sidewalks (curbs)
      const curbOff = this.roadWidth * 0.5 + this.sidewalkWidth * 0.5;
      const curbGeo = new THREE.BoxGeometry(this.sidewalkWidth, 0.22, totalD);

      const curbL = new THREE.Mesh(curbGeo, curbMat);
      curbL.position.set(worldX - curbOff, 0.11, 0);
      curbL.receiveShadow = true;
      this.scene.add(curbL);

      const curbR = new THREE.Mesh(curbGeo, curbMat);
      curbR.position.set(worldX + curbOff, 0.11, 0);
      curbR.receiveShadow = true;
      this.scene.add(curbR);

      // Yellow dashed center line
      for (let z = -totalD * 0.5 + 5; z < totalD * 0.5; z += 10) {
        const line = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 5), lineMat);
        line.rotateX(-Math.PI / 2);
        line.position.set(worldX, 0.02, z);
        this.scene.add(line);
      }
    }

    // East-West Cross Streets
    for (let z = 0; z <= this.gridBlocksZ; z++) {
      const worldZ = (z - this.gridBlocksZ * 0.5) * this.blockSize;

      const rGeo = new THREE.PlaneGeometry(totalW, this.roadWidth);
      rGeo.rotateX(-Math.PI / 2);
      const road = new THREE.Mesh(rGeo, this.roadMat);
      road.position.set(0, 0.015, worldZ);
      road.receiveShadow = true;
      this.scene.add(road);

      const curbOff = this.roadWidth * 0.5 + this.sidewalkWidth * 0.5;
      const curbGeo = new THREE.BoxGeometry(totalW, 0.22, this.sidewalkWidth);

      const curbB = new THREE.Mesh(curbGeo, curbMat);
      curbB.position.set(0, 0.11, worldZ - curbOff);
      curbB.receiveShadow = true;
      this.scene.add(curbB);

      const curbT = new THREE.Mesh(curbGeo, curbMat);
      curbT.position.set(0, 0.11, worldZ + curbOff);
      curbT.receiveShadow = true;
      this.scene.add(curbT);

      // Yellow dashed lines
      for (let x = -totalW * 0.5 + 5; x < totalW * 0.5; x += 10) {
        const line = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.3), lineMat);
        line.rotateX(-Math.PI / 2);
        line.position.set(x, 0.022, worldZ);
        this.scene.add(line);
      }

      // Intersection Zebra Crosswalks
      for (let x = 0; x <= this.gridBlocksX; x++) {
        const ix = (x - this.gridBlocksX * 0.5) * this.blockSize;
        const offset = this.roadWidth * 0.5 + 1.2;

        for (let s = -this.roadWidth * 0.38; s <= this.roadWidth * 0.38; s += 2.0) {
          const cw1 = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.5), whiteLineMat);
          cw1.rotateX(-Math.PI / 2);
          cw1.position.set(ix + s, 0.025, worldZ - offset);
          this.scene.add(cw1);

          const cw2 = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.5), whiteLineMat);
          cw2.rotateX(-Math.PI / 2);
          cw2.position.set(ix + s, 0.025, worldZ + offset);
          this.scene.add(cw2);
        }
      }
    }
  }

  _buildBuildingsAndHouses() {
    const usableBlock = this.blockSize - this.roadWidth - this.sidewalkWidth * 2.0;

    // Materials Palette
    const brickMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85, metalness: 0.1 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.75, metalness: 0.15 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7, metalness: 0.1 });
    const glassTowerMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.15, metalness: 0.85, envMapIntensity: 1.5 });
    const tileRoofMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7, metalness: 0.15 });

    for (let bx = 0; bx < this.gridBlocksX; bx++) {
      for (let bz = 0; bz < this.gridBlocksZ; bz++) {
        // Reserve block (2,2) for the Stunt Drift Arena!
        if (bx === 2 && bz === 2) continue;

        const cornerX = (bx - this.gridBlocksX * 0.5) * this.blockSize + this.roadWidth * 0.5 + this.sidewalkWidth;
        const cornerZ = (bz - this.gridBlocksZ * 0.5) * this.blockSize + this.roadWidth * 0.5 + this.sidewalkWidth;
        const centerX = cornerX + usableBlock * 0.5;
        const centerZ = cornerZ + usableBlock * 0.5;

        const distFromCenter = Math.sqrt(centerX * centerX + centerZ * centerZ);

        if (distFromCenter < this.blockSize * 1.1) {
          // 1. Downtown High-Rise Skyscraper with Rooftop Heli/AC
          const height = 48 + ((bx * 13 + bz * 17) % 36);
          const bW = usableBlock * 0.82;
          const bD = usableBlock * 0.82;

          const bGeo = new THREE.BoxGeometry(bW, height, bD);
          const skyscraper = new THREE.Mesh(bGeo, ((bx + bz) % 2 === 0) ? glassTowerMat : concreteMat);
          skyscraper.position.set(centerX, height * 0.5, centerZ);
          skyscraper.castShadow = true;
          skyscraper.receiveShadow = true;
          this.scene.add(skyscraper);

          // Solid Rigid Collider
          this.addSolidCollider(centerX, centerZ, bW, bD, height);

          // Rooftop AC and Spire Antenna
          const roofAC = new THREE.Mesh(new THREE.BoxGeometry(bW * 0.35, 3.5, bD * 0.35), concreteMat);
          roofAC.position.set(centerX, height + 1.75, centerZ);
          this.scene.add(roofAC);

          const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.4, 9, 6), concreteMat);
          spire.position.set(centerX, height + 8, centerZ);
          this.scene.add(spire);

          // Windows
          this._createBuildingWindows(centerX, centerZ, bW, bD, height, 4.2);

        } else if (distFromCenter < this.blockSize * 2.2) {
          // 2. Commercial Stores with Shop Fronts & Apartments
          const subD = usableBlock * 0.45;
          for (let sub = 0; sub < 2; sub++) {
            const subZ = (sub === 0) ? (centerZ - usableBlock * 0.24) : (centerZ + usableBlock * 0.24);
            const height = 18 + ((bx * 7 + bz * 11 + sub * 5) % 12);
            const bW = usableBlock * 0.85;

            const bGeo = new THREE.BoxGeometry(bW, height, subD);
            const apt = new THREE.Mesh(bGeo, brickMat);
            apt.position.set(centerX, height * 0.5, subZ);
            apt.castShadow = true;
            apt.receiveShadow = true;
            this.scene.add(apt);

            this.addSolidCollider(centerX, subZ, bW, subD, height);

            // Ground Floor Storefront Awning
            const awning = new THREE.Mesh(
              new THREE.BoxGeometry(bW * 0.75, 0.4, 2.5),
              new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 })
            );
            awning.position.set(centerX, 3.8, subZ + subD * 0.5 + 1.25);
            this.scene.add(awning);

            this._createBuildingWindows(centerX, subZ, bW, subD, height, 3.5);
          }

        } else {
          // 3. Traditional Uzbek Courtyard House (Hovli) & Modern Suburban Villa
          const halfSize = usableBlock * 0.45;
          const offsets = [-usableBlock * 0.24, usableBlock * 0.24];

          for (let hx = 0; hx < 2; hx++) {
            for (let hz = 0; hz < 2; hz++) {
              const hX = centerX + offsets[hx];
              const hZ = centerZ + offsets[hz];
              const height = 6.5 + ((bx + bz + hx + hz) % 3) * 1.5;
              const vW = halfSize * 0.82;
              const vD = halfSize * 0.82;

              // House Main Walls
              const house = new THREE.Mesh(new THREE.BoxGeometry(vW, height, vD), concreteMat);
              house.position.set(hX, height * 0.5, hZ);
              house.castShadow = true;
              house.receiveShadow = true;
              this.scene.add(house);

              this.addSolidCollider(hX, hZ, vW, vD, height + 3.0);

              // Pitched Roof (Pyramidal Gable)
              const roofGeo = new THREE.ConeGeometry(vW * 0.75, 3.2, 4);
              roofGeo.rotateY(Math.PI / 4);
              const roof = new THREE.Mesh(roofGeo, tileRoofMat);
              roof.position.set(hX, height + 1.6, hZ);
              roof.castShadow = true;
              this.scene.add(roof);

              // Carved Wooden Front Door & Chimney
              const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.15), woodMat);
              door.position.set(hX, 1.2, hZ + vD * 0.5 + 0.08);
              this.scene.add(door);

              const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.5, 0.8), brickMat);
              chimney.position.set(hX + vW * 0.26, height + 2.0, hZ);
              this.scene.add(chimney);

              this._createBuildingWindows(hX, hZ, vW, vD, height, 3.2);
            }
          }
        }
      }
    }
  }

  _buildDriftStuntArena() {
    // Dedicated Stunt & Drift Arena at Grid Block (2, 2)
    const bx = 2, bz = 2;
    const usableBlock = this.blockSize - this.roadWidth - this.sidewalkWidth * 2.0;
    const cornerX = (bx - this.gridBlocksX * 0.5) * this.blockSize + this.roadWidth * 0.5 + this.sidewalkWidth;
    const cornerZ = (bz - this.gridBlocksZ * 0.5) * this.blockSize + this.roadWidth * 0.5 + this.sidewalkWidth;
    const centerX = cornerX + usableBlock * 0.5;
    const centerZ = cornerZ + usableBlock * 0.5;

    // Smooth Skidpad Concrete Surface
    const padGeo = new THREE.BoxGeometry(usableBlock, 0.1, usableBlock);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      roughness: 0.45,
      metalness: 0.25,
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(centerX, 0.05, centerZ);
    pad.receiveShadow = true;
    this.scene.add(pad);

    // Donut Circle Center Tower
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 3.0, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 })
    );
    tower.position.set(centerX, 4, centerZ);
    tower.castShadow = true;
    this.scene.add(tower);
    this.addSolidCollider(centerX, centerZ, 5.5, 5.5, 8.0);

    // Giant Jump Ramps (Sakrash uchun panduslar)
    this._createJumpRamp(centerX - 16, centerZ - 12, 6.0, 2.5, 12.0, 0);
    this._createJumpRamp(centerX + 16, centerZ + 12, 6.0, 2.5, 12.0, Math.PI);

    // Drift Slalom Cones (Rubber barrels around perimeter)
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const rx = centerX + Math.cos(a) * 18;
      const rz = centerZ + Math.sin(a) * 18;
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 12), barrelMat);
      barrel.position.set(rx, 0.6, rz);
      barrel.castShadow = true;
      this.scene.add(barrel);
      this.addSolidCollider(rx, rz, 1.2, 1.2, 1.5);
    }
  }

  _createJumpRamp(x, z, width, height, length, rotationY) {
    const rampGroup = new THREE.Group();
    rampGroup.position.set(x, 0, z);
    rampGroup.rotation.y = rotationY;

    // Wedge Shape Geometry
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(length, height);
    shape.lineTo(length, 0);
    shape.closePath();

    const extrudeSettings = { depth: width, bevelEnabled: false };
    const rampGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    rampGeo.translate(-length * 0.5, 0, -width * 0.5);

    const rampMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.6,
      metalness: 0.4,
    });
    const ramp = new THREE.Mesh(rampGeo, rampMat);
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    rampGroup.add(ramp);

    this.scene.add(rampGroup);

    this.jumpRamps.push({
      x, z, width, height, length, rotationY,
      bounds: { minX: x - width, maxX: x + width, minZ: z - length, maxZ: z + length }
    });
  }

  _createBuildingWindows(x, z, width, depth, height, stepY) {
    const winW = 1.4;
    const winH = 1.8;

    const winMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });

    for (let y = 3.5; y < height - 2.0; y += stepY) {
      // Front & Back facade windows
      for (let wOff = -width * 0.38; wOff <= width * 0.38; wOff += winW * 2.2) {
        const wF = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), winMat);
        wF.position.set(x + wOff, y, z + depth * 0.505);
        this.scene.add(wF);
        this.windowMeshes.push(wF);

        const wB = new THREE.Mesh(new THREE.PlaneGeometry(winW, winH), winMat);
        wB.rotateY(Math.PI);
        wB.position.set(x + wOff, y, z - depth * 0.505);
        this.scene.add(wB);
        this.windowMeshes.push(wB);
      }
    }
  }

  _buildStreetPropsAndLighting() {
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.8, roughness: 0.2 });
    const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    const totalD = this.gridBlocksZ * this.blockSize;

    for (let x = 0; x <= this.gridBlocksX; x++) {
      const worldX = (x - this.gridBlocksX * 0.5) * this.blockSize;
      const swOff = this.roadWidth * 0.5 + this.sidewalkWidth * 0.5;

      for (let z = -totalD * 0.5 + 20; z < totalD * 0.5 - 10; z += 35) {
        // Streetlight Post
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 6.5, 8), poleMat);
        pole.position.set(worldX + swOff, 3.25, z);
        pole.castShadow = true;
        this.scene.add(pole);

        // Curved Lamp arm
        const arm = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 0.12), poleMat);
        arm.position.set(worldX + swOff - 0.9, 6.4, z);
        this.scene.add(arm);

        // Glowing Lantern Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.6), lampGlowMat);
        head.position.set(worldX + swOff - 1.8, 6.25, z);
        this.scene.add(head);
        this.streetLamps.push(head);

        // Deciduous Tree on other side of sidewalk
        const treeTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 3.5, 6), poleMat);
        treeTrunk.position.set(worldX - swOff, 1.75, z);
        this.scene.add(treeTrunk);

        const canopy = new THREE.Mesh(
          new THREE.SphereGeometry(2.2, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 })
        );
        canopy.position.set(worldX - swOff, 4.2, z);
        canopy.castShadow = true;
        this.scene.add(canopy);

        this.addSolidCollider(worldX + swOff, z, 0.8, 0.8, 6.5);
        this.addSolidCollider(worldX - swOff, z, 1.2, 1.2, 4.5);
      }
    }
  }

  addSolidCollider(x, z, width, depth, height) {
    const halfW = width * 0.5;
    const halfD = depth * 0.5;
    this.colliders.push({
      minX: x - halfW,
      maxX: x + halfW,
      minZ: z - halfD,
      maxZ: z + halfD,
      centerX: x,
      centerZ: z,
      halfW,
      halfD,
      height,
    });
  }

  /**
   * SOLID RIGID COLLISION DETECTION
   * Checks if car bounding box intersects with any solid building or wall.
   * Resolves collision with push-out vector so car cannot penetrate into houses!
   */
  checkCarCollision(carPos, carHalfW, carHalfL) {
    const cMinX = carPos.x - carHalfW;
    const cMaxX = carPos.x + carHalfW;
    const cMinZ = carPos.z - carHalfL;
    const cMaxZ = carPos.z + carHalfL;

    for (let i = 0; i < this.colliders.length; i++) {
      const b = this.colliders[i];

      // Quick AABB overlap test
      if (cMaxX > b.minX && cMinX < b.maxX && cMaxZ > b.minZ && cMinZ < b.maxZ) {
        // Calculate penetration depths
        const overlapX1 = cMaxX - b.minX;
        const overlapX2 = b.maxX - cMinX;
        const overlapZ1 = cMaxZ - b.minZ;
        const overlapZ2 = b.maxZ - cMinZ;

        const minOverlapX = Math.min(overlapX1, overlapX2);
        const minOverlapZ = Math.min(overlapZ1, overlapZ2);

        let pushX = 0;
        let pushZ = 0;
        let normal = { x: 0, y: 0, z: 0 };

        if (minOverlapX < minOverlapZ) {
          pushX = (overlapX1 < overlapX2) ? -overlapX1 : overlapX2;
          normal.x = (pushX > 0) ? 1 : -1;
        } else {
          pushZ = (overlapZ1 < overlapZ2) ? -overlapZ1 : overlapZ2;
          normal.z = (pushZ > 0) ? 1 : -1;
        }

        const impactPoint = {
          x: carPos.x - pushX,
          y: 0.6,
          z: carPos.z - pushZ,
        };

        return {
          collided: true,
          pushX,
          pushZ,
          normal,
          impactPoint,
        };
      }
    }
    return { collided: false };
  }

  setDayNightState(isNight) {
    this.isNight = isNight;
    const winColor = isNight ? 0xfef08a : 0x38bdf8; // Warm amber lit windows at night
    this.windowMeshes.forEach((w) => {
      w.material.color.setHex(winColor);
    });

    this.streetLamps.forEach((l) => {
      l.visible = isNight;
    });
  }

  setWeatherRain(isRain) {
    this.isRaining = isRain;
    if (this.roadMat) {
      this.roadMat.roughness = isRain ? 0.25 : 0.80;
      this.roadMat.metalness = isRain ? 0.50 : 0.15;
    }
  }
}

window.CityManager = CityManager;
