/**
 * MathCity AI — Procedural 3D Low-Poly Item Geometry Builder
 * High-fidelity architectural models matching modern luxury villa design,
 * realistic construction stages, and diorama aesthetics.
 * Completely code-generated, zero external 3D model files.
 */

class ItemBuilder {
  constructor() {
    this.materialsCache = new Map();
  }

  getMaterial(colorHex, options = {}) {
    const key = `${colorHex}_${options.roughness || 0.6}_${options.transparent || false}_${options.opacity || 1.0}_${options.emissive || 0}_${options.metalness || 0}`;
    if (!this.materialsCache.has(key)) {
      const mat = new THREE.MeshLambertMaterial({
        color: colorHex,
        roughness: options.roughness !== undefined ? options.roughness : 0.6,
        transparent: options.transparent || false,
        opacity: options.opacity !== undefined ? options.opacity : 1.0,
        emissive: options.emissive || 0x000000,
        emissiveIntensity: options.emissiveIntensity || 1.0,
        flatShading: true,
      });
      this.materialsCache.set(key, mat);
    }
    return this.materialsCache.get(key);
  }

  /**
   * Main entry point to build a 3D Object3D by itemId and optional color override
   */
  buildItemMesh(itemId, options = {}) {
    const group = new THREE.Group();
    group.name = `item_${itemId}`;
    const customColor = options.color;

    switch (itemId) {
      // ==========================================
      // A. POYDEVOR VA UCHASTKA
      // ==========================================
      case 'clean_lot': {
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(8.9, 0.08, 8.9),
          this.getMaterial('#84CC16')
        );
        slab.position.y = 0.04;
        slab.receiveShadow = true;
        group.add(slab);
        break;
      }
      case 'gravel_base': {
        const gravel = new THREE.Mesh(
          new THREE.BoxGeometry(8.9, 0.18, 8.9),
          this.getMaterial('#9CA3AF')
        );
        gravel.position.y = 0.09;
        gravel.receiveShadow = true;
        group.add(gravel);

        // Wooden perimeter border
        const borderMat = this.getMaterial('#78350F');
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(9.1, 0.22, 0.2), borderMat);
        b1.position.set(0, 0.11, 4.45);
        const b2 = b1.clone();
        b2.position.set(0, 0.11, -4.45);
        const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 9.1), borderMat);
        b3.position.set(4.45, 0.11, 0);
        const b4 = b3.clone();
        b4.position.set(-4.45, 0.11, 0);
        group.add(b1, b2, b3, b4);
        break;
      }
      case 'concrete_foundation': {
        // High-end smooth foundation slab (Image 2)
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(9.0, 0.35, 9.0),
          this.getMaterial('#E2E8F0')
        );
        slab.position.y = 0.175;
        slab.castShadow = true;
        slab.receiveShadow = true;
        group.add(slab);

        // Outer foundation formwork lines
        const lineMat = this.getMaterial('#94A3B8');
        const f1 = new THREE.Mesh(new THREE.BoxGeometry(9.05, 0.04, 0.04), lineMat);
        f1.position.set(0, 0.35, 4.5);
        const f2 = f1.clone();
        f2.position.set(0, 0.35, -4.5);
        group.add(f1, f2);
        break;
      }
      case 'reinforced_basement': {
        const basement = new THREE.Mesh(
          new THREE.BoxGeometry(9.2, 0.65, 9.2),
          this.getMaterial('#64748B')
        );
        basement.position.y = 0.325;
        basement.castShadow = true;
        basement.receiveShadow = true;
        group.add(basement);

        // Basement vents
        const ventMat = this.getMaterial('#0F172A');
        for (let i = -3; i <= 3; i += 3) {
          const v = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.08), ventMat);
          v.position.set(i, 0.35, 4.61);
          group.add(v);
        }
        break;
      }

      // ==========================================
      // B. DEVORLAR
      // ==========================================
      case 'red_brick_wall': {
        // Authentic Construction Site Brick Wall with White Capstones & Miniature Builder (Image 2)
        const wallMat = this.getMaterial('#B91C1C');
        const copingMat = this.getMaterial('#F1F5F9'); // White coping capstones
        const wallH = 2.4;
        const wallThick = 0.36;
        const roomSize = 8.6;

        // Back wall
        const wBack = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallH, wallThick), wallMat);
        wBack.position.set(0, wallH / 2 + 0.35, -roomSize / 2 + wallThick / 2);
        wBack.castShadow = true;
        wBack.receiveShadow = true;

        // White coping capstone along back wall top
        const cBack = new THREE.Mesh(new THREE.BoxGeometry(roomSize + 0.1, 0.12, wallThick + 0.08), copingMat);
        cBack.position.set(0, wallH + 0.35 + 0.06, -roomSize / 2 + wallThick / 2);
        cBack.castShadow = true;

        // Left wall with window opening
        const wLeft = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, roomSize), wallMat);
        wLeft.position.set(-roomSize / 2 + wallThick / 2, wallH / 2 + 0.35, 0);
        wLeft.castShadow = true;
        const cLeft = new THREE.Mesh(new THREE.BoxGeometry(wallThick + 0.08, 0.12, roomSize + 0.1), copingMat);
        cLeft.position.set(-roomSize / 2 + wallThick / 2, wallH + 0.35 + 0.06, 0);

        // Right wall with window opening
        const wRight = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, roomSize), wallMat);
        wRight.position.set(roomSize / 2 - wallThick / 2, wallH / 2 + 0.35, 0);
        wRight.castShadow = true;
        const cRight = new THREE.Mesh(new THREE.BoxGeometry(wallThick + 0.08, 0.12, roomSize + 0.1), copingMat);
        cRight.position.set(roomSize / 2 - wallThick / 2, wallH + 0.35 + 0.06, 0);

        // Front wall with doorway in middle
        const wFrontL = new THREE.Mesh(new THREE.BoxGeometry(3.3, wallH, wallThick), wallMat);
        wFrontL.position.set(-2.65, wallH / 2 + 0.35, roomSize / 2 - wallThick / 2);
        wFrontL.castShadow = true;
        const cFrontL = new THREE.Mesh(new THREE.BoxGeometry(3.3 + 0.05, 0.12, wallThick + 0.08), copingMat);
        cFrontL.position.set(-2.65, wallH + 0.35 + 0.06, roomSize / 2 - wallThick / 2);

        const wFrontR = new THREE.Mesh(new THREE.BoxGeometry(3.3, wallH, wallThick), wallMat);
        wFrontR.position.set(2.65, wallH / 2 + 0.35, roomSize / 2 - wallThick / 2);
        wFrontR.castShadow = true;
        const cFrontR = new THREE.Mesh(new THREE.BoxGeometry(3.3 + 0.05, 0.12, wallThick + 0.08), copingMat);
        cFrontR.position.set(2.65, wallH + 0.35 + 0.06, roomSize / 2 - wallThick / 2);

        const wFrontTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, wallThick), wallMat);
        wFrontTop.position.set(0, wallH + 0.35 - 0.25, roomSize / 2 - wallThick / 2);
        const cFrontTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, wallThick + 0.08), copingMat);
        cFrontTop.position.set(0, wallH + 0.35 + 0.06, roomSize / 2 - wallThick / 2);

        // Installed white window frames in brick walls (Image 2)
        const frameMat = this.getMaterial('#F8FAFC');
        const glassMat = this.getMaterial('#7DD3FC', { transparent: true, opacity: 0.65 });
        [-2.0, 2.0].forEach((x) => {
          const frame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 0.12), frameMat);
          frame.position.set(x, 1.7, -roomSize / 2 + wallThick / 2);
          const glass = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.06), glassMat);
          glass.position.copy(frame.position);
          group.add(frame, glass);
        });

        // Miniature Builder in Orange Safety Vest & Yellow Hardhat (Image 2)
        const worker = new THREE.Group();
        // Legs (blue jeans)
        const pants = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.18), this.getMaterial('#1E3A8A'));
        pants.position.y = 0.53;
        // Torso (orange hi-vis vest)
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.2), this.getMaterial('#EA580C'));
        torso.position.y = 0.88;
        // Yellow safety helmet
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), this.getMaterial('#FDE047'));
        head.position.y = 1.12;
        worker.add(pants, torso, head);
        worker.position.set(-1.8, 0.0, 2.2);
        worker.castShadow = true;

        // Miniature construction equipment: cute orange wheel loader / pallet truck (Image 2)
        const truck = new THREE.Group();
        const tBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 0.65), this.getMaterial('#EA580C'));
        tBody.position.y = 0.55;
        const tCab = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.55), this.getMaterial('#F8FAFC'));
        tCab.position.set(0.25, 0.95, 0);
        [-0.35, 0.35].forEach((x) => {
          [-0.35, 0.35].forEach((z) => {
            const w = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 8), this.getMaterial('#1E293B'));
            w.rotation.x = Math.PI / 2;
            w.position.set(x, 0.45, z);
            truck.add(w);
          });
        });
        truck.add(tBody, tCab);
        truck.position.set(3.4, 0.0, 3.2);
        truck.rotation.y = -Math.PI / 6;

        group.add(
          wBack, cBack,
          wLeft, cLeft,
          wRight, cRight,
          wFrontL, cFrontL,
          wFrontR, cFrontR,
          wFrontTop, cFrontTop,
          worker,
          truck
        );
        break;
      }

      case 'modern_glass_wall': {
        // Modern Luxury Villa: Crisp White Stucco + Teak Wood Slat Cladding + Panoramic Windows (Images 3 & 4)
        const whiteMat = this.getMaterial('#F8FAFC');
        const woodMat = this.getMaterial('#9A5328'); // Warm teak wood slats
        const darkTrimMat = this.getMaterial('#1E293B');
        const glassMat = this.getMaterial('#38BDF8', { transparent: true, opacity: 0.65 });
        const wallH = 2.4;
        const wallThick = 0.35;
        const roomSize = 8.6;

        // White stucco base structure
        const wBack = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallH, wallThick), whiteMat);
        wBack.position.set(0, wallH / 2 + 0.35, -roomSize / 2 + wallThick / 2);
        wBack.castShadow = true;
        wBack.receiveShadow = true;

        const wLeft = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, roomSize), whiteMat);
        wLeft.position.set(-roomSize / 2 + wallThick / 2, wallH / 2 + 0.35, 0);
        wLeft.castShadow = true;

        const wRight = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, roomSize), whiteMat);
        wRight.position.set(roomSize / 2 - wallThick / 2, wallH / 2 + 0.35, 0);
        wRight.castShadow = true;

        // Front facade: Right wing features warm vertical/horizontal wood paneling
        const woodPanel = new THREE.Mesh(new THREE.BoxGeometry(3.6, wallH, wallThick + 0.04), woodMat);
        woodPanel.position.set(2.5, wallH / 2 + 0.35, roomSize / 2 - wallThick / 2);
        woodPanel.castShadow = true;

        // Left wing: Large panoramic glass window with dark mullions
        const wFrontLeftStucco = new THREE.Mesh(new THREE.BoxGeometry(1.2, wallH, wallThick), whiteMat);
        wFrontLeftStucco.position.set(-3.7, wallH / 2 + 0.35, roomSize / 2 - wallThick / 2);

        const panoWindow = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.0, 0.12), glassMat);
        panoWindow.position.set(-1.8, 1.45, roomSize / 2 - wallThick / 2);

        const mullionH = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 0.14), darkTrimMat);
        mullionH.position.set(-1.8, 1.45, roomSize / 2 - wallThick / 2);
        const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.0, 0.14), darkTrimMat);
        mullionV.position.set(-1.8, 1.45, roomSize / 2 - wallThick / 2);

        // Exterior architectural wall sconce uplight on the white stucco facade (Images 3 & 4)
        const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.25, 0.1), darkTrimMat);
        sconce.position.set(-3.7, 1.8, roomSize / 2 + 0.05);
        const sconceLight = new THREE.Mesh(
          new THREE.ConeGeometry(0.4, 0.8, 8, 1, true),
          this.getMaterial('#FEF08A', { transparent: true, opacity: 0.35, emissive: 0xFDE047, emissiveIntensity: 1.5 })
        );
        sconceLight.position.set(-3.7, 1.35, roomSize / 2 + 0.1);
        sconceLight.rotation.x = Math.PI;

        group.add(
          wBack, wLeft, wRight,
          woodPanel, wFrontLeftStucco,
          panoWindow, mullionH, mullionV,
          sconce, sconceLight
        );
        group.userData.isWindow = true;
        break;
      }

      case 'mud_brick_wall':
      case 'white_brick_wall':
      case 'stone_wall': {
        const wallColors = {
          mud_brick_wall: '#D97706',
          white_brick_wall: '#F8FAFC',
          stone_wall: '#64748B',
        };
        const color = customColor || wallColors[itemId] || '#F8FAFC';
        const wallMat = this.getMaterial(color);

        const wallH = 2.4;
        const wallThick = 0.35;
        const roomSize = 8.6;

        const wBack = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallH, wallThick), wallMat);
        wBack.position.set(0, wallH / 2 + 0.35, -roomSize / 2 + wallThick / 2);
        wBack.castShadow = true;
        wBack.receiveShadow = true;

        const wLeft = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, roomSize), wallMat);
        wLeft.position.set(-roomSize / 2 + wallThick / 2, wallH / 2 + 0.35, 0);
        wLeft.castShadow = true;

        const wRight = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, roomSize), wallMat);
        wRight.position.set(roomSize / 2 - wallThick / 2, wallH / 2 + 0.35, 0);
        wRight.castShadow = true;

        const wFrontL = new THREE.Mesh(new THREE.BoxGeometry(3.3, wallH, wallThick), wallMat);
        wFrontL.position.set(-2.65, wallH / 2 + 0.35, roomSize / 2 - wallThick / 2);
        wFrontL.castShadow = true;

        const wFrontR = new THREE.Mesh(new THREE.BoxGeometry(3.3, wallH, wallThick), wallMat);
        wFrontR.position.set(2.65, wallH / 2 + 0.35, roomSize / 2 - wallThick / 2);
        wFrontR.castShadow = true;

        const wFrontTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, wallThick), wallMat);
        wFrontTop.position.set(0, wallH + 0.35 - 0.25, roomSize / 2 - wallThick / 2);
        wFrontTop.castShadow = true;

        group.add(wBack, wLeft, wRight, wFrontL, wFrontR, wFrontTop);
        break;
      }

      // ==========================================
      // C. TOMLAR
      // ==========================================
      case 'flat_roof': {
        // Modern Villa Flat Roof Terrace with Safety Railings (Images 3 & 4)
        const color = customColor || '#F8FAFC';
        const slab = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.32, 9.2), this.getMaterial(color));
        slab.position.y = 2.9;
        slab.castShadow = true;
        slab.receiveShadow = true;

        // Modern stainless steel & glass perimeter railing
        const railMat = this.getMaterial('#334155');
        const glassRailMat = this.getMaterial('#7DD3FC', { transparent: true, opacity: 0.5 });

        const railBack = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.65, 0.08), glassRailMat);
        railBack.position.set(0, 3.4, -4.4);
        const railFront = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.65, 0.08), glassRailMat);
        railFront.position.set(0, 3.4, 4.4);
        const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 9.0), glassRailMat);
        railLeft.position.set(-4.4, 3.4, 0);
        const railRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 9.0), glassRailMat);
        railRight.position.set(4.4, 3.4, 0);

        // Top stainless handrail
        const barF = new THREE.Mesh(new THREE.BoxGeometry(9.1, 0.06, 0.1), railMat);
        barF.position.set(0, 3.75, 4.4);
        const barB = new THREE.Mesh(new THREE.BoxGeometry(9.1, 0.06, 0.1), railMat);
        barB.position.set(0, 3.75, -4.4);

        group.add(slab, railBack, railFront, railLeft, railRight, barF, barB);
        break;
      }

      case 'second_floor': {
        // Modern 2-Story Villa Modular Volume with Cantilever (Images 3 & 4)
        const whiteMat = this.getMaterial('#F8FAFC');
        const woodMat = this.getMaterial('#9A5328');
        const darkTrimMat = this.getMaterial('#1E293B');
        const glassMat = this.getMaterial('#38BDF8', { transparent: true, opacity: 0.7 });

        // Cantilevered upper volume
        const upperBox = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.4, 6.2), whiteMat);
        upperBox.position.set(-1.2, 4.0, -0.8);
        upperBox.castShadow = true;

        // Wood accent facade on upper volume
        const upperWood = new THREE.Mesh(new THREE.BoxGeometry(5.85, 2.4, 0.1), woodMat);
        upperWood.position.set(-1.2, 4.0, 2.25);
        upperWood.castShadow = true;

        // Upper panoramic glass window
        const upperWin = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 0.12), glassMat);
        upperWin.position.set(-1.2, 4.0, 2.32);

        // Rooftop terrace / balcony deck on the other half (Images 3 & 4)
        const balconyDeck = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 4.8), this.getMaterial('#E2E8F0'));
        balconyDeck.position.set(2.6, 2.9, 1.6);
        balconyDeck.castShadow = true;

        // Balcony railing
        const bRailMat = this.getMaterial('#334155');
        const bRailF = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 0.06), bRailMat);
        bRailF.position.set(2.6, 3.35, 3.95);
        const bRailR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 4.8), bRailMat);
        bRailR.position.set(4.35, 3.35, 1.6);

        group.add(upperBox, upperWood, upperWin, balconyDeck, bRailF, bRailR);
        group.userData.isWindow = true;
        break;
      }

      case 'swimming_pool': {
        // Modern Luxury Swimming Pool with Clear Turquoise Water & Railings (Image 3)
        const poolGroup = new THREE.Group();
        const rimMat = this.getMaterial('#F8FAFC');
        const waterMat = this.getMaterial('#06B6D4', { transparent: true, opacity: 0.75, roughness: 0.1 });
        const railMat = this.getMaterial('#334155');
        const glassMat = this.getMaterial('#7DD3FC', { transparent: true, opacity: 0.45 });

        // White coping marble rim
        const rim = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.45, 3.4), rimMat);
        rim.position.y = 0.225;
        rim.castShadow = true;

        // Translucent turquoise pool water
        const water = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.12, 2.8), waterMat);
        water.position.y = 0.38;

        // Modern Glass & Steel Pool Enclosure Railing (Image 3)
        const glassBack = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.65, 0.06), glassMat);
        glassBack.position.set(0, 0.75, -1.65);
        const glassFront = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.65, 0.06), glassMat);
        glassFront.position.set(0, 0.75, 1.65);
        const glassEnd = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 3.3), glassMat);
        glassEnd.position.set(-2.25, 0.75, 0);

        // Sun lounger / beach bed + Red sun umbrella (Image 3)
        const lounger = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 0.65), this.getMaterial('#EF4444'));
        lounger.position.set(1.4, 0.35, 2.4);
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.55), this.getMaterial('#FFFFFF'));
        pillow.position.set(2.0, 0.45, 2.4);

        // Parasol / red umbrella
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2), this.getMaterial('#E2E8F0'));
        pole.position.set(2.2, 1.1, 3.0);
        const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.45, 12), this.getMaterial('#DC2626'));
        canopy.position.set(2.2, 2.2, 3.0);

        poolGroup.add(rim, water, glassBack, glassFront, glassEnd, lounger, pillow, pole, canopy);
        group.add(poolGroup);
        break;
      }

      case 'shed_roof':
      case 'gable_roof':
      case 'pyramid_roof':
      case 'hip_roof':
      case 'tile_roof':
      case 'mansard_roof':
      case 'dome_roof':
      case 'cone_tower_roof':
      case 'solar_roof':
      case 'glass_conservatory_roof': {
        const color = customColor || '#DC2626';
        if (itemId === 'shed_roof') {
          const roof = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.25, 9.6), this.getMaterial(color));
          roof.rotation.x = -0.15;
          roof.position.set(0, 3.4, 0);
          roof.castShadow = true;
          group.add(roof);
        } else if (itemId === 'gable_roof') {
          const geom = new THREE.ConeGeometry(6.6, 2.4, 4);
          const roof = new THREE.Mesh(geom, this.getMaterial(color));
          roof.position.y = 3.95;
          roof.rotation.y = Math.PI / 4;
          roof.castShadow = true;
          group.add(roof);
        } else if (itemId === 'solar_roof') {
          const base = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.3, 9.4), this.getMaterial('#1E293B'));
          base.position.y = 2.9;
          group.add(base);
          const panelMat = this.getMaterial('#1E40AF', { roughness: 0.2 });
          for (let x = -3; x <= 3; x += 2) {
            for (let z = -2; z <= 2; z += 4) {
              const p = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 3.2), panelMat);
              p.position.set(x, 3.1, z);
              group.add(p);
            }
          }
        } else {
          const cone = new THREE.Mesh(new THREE.ConeGeometry(6.4, 2.8, 4), this.getMaterial(color));
          cone.position.y = 4.15;
          cone.rotation.y = Math.PI / 4;
          cone.castShadow = true;
          group.add(cone);
        }
        break;
      }

      // Roof accessories:
      case 'chimney': {
        const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.6, 0.7), this.getMaterial('#991B1B'));
        chimney.position.set(2.2, 4.2, -1.8);
        chimney.castShadow = true;
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.15, 0.9), this.getMaterial('#1F2937'));
        cap.position.set(2.2, 5.05, -1.8);
        group.add(chimney, cap);
        break;
      }
      case 'roof_antenna': {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8), this.getMaterial('#64748B'));
        pole.position.set(-1.8, 4.5, -1.8);
        const bar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.0), this.getMaterial('#64748B'));
        bar1.rotation.z = Math.PI / 2;
        bar1.position.set(-1.8, 5.1, -1.8);
        group.add(pole, bar1);
        break;
      }

      // ==========================================
      // D. ESHIKLAR VA GARAJ
      // ==========================================
      case 'garage_gate': {
        // Modern Sectional Garage with Address Number & Sconces (Images 3 & 4)
        const gateMat = this.getMaterial('#334155');
        const frameMat = this.getMaterial('#F8FAFC');
        const darkMat = this.getMaterial('#0F172A');

        // Garage door portal frame
        const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.2, 0.35), frameMat);
        frameL.position.set(-1.9, 1.45, 4.35);
        const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.2, 0.35), frameMat);
        frameR.position.set(1.9, 1.45, 4.35);
        const frameT = new THREE.Mesh(new THREE.BoxGeometry(4.05, 0.25, 0.35), frameMat);
        frameT.position.set(0, 2.55, 4.35);

        // Sectional automatic garage door
        const door = new THREE.Mesh(new THREE.BoxGeometry(3.55, 2.1, 0.12), gateMat);
        door.position.set(0, 1.4, 4.35);
        door.castShadow = true;

        // Horizontal slat lines
        for (let y = 0.6; y <= 2.2; y += 0.5) {
          const slat = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.03, 0.14), darkMat);
          slat.position.set(0, y, 4.35);
          group.add(slat);
        }

        // Modern address plate ("108" as seen in Image 3!)
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.22, 0.04), this.getMaterial('#1E293B'));
        plate.position.set(-2.3, 2.1, 4.38);
        group.add(frameL, frameR, frameT, door, plate);
        break;
      }

      case 'simple_wood_door':
      case 'standard_door':
      case 'double_door':
      case 'modern_glass_door':
      case 'carved_door': {
        const doorColors = {
          simple_wood_door: '#92400E',
          standard_door: '#78350F',
          double_door: '#581C87',
          modern_glass_door: '#0284C7',
          carved_door: '#B45309',
        };
        const color = customColor || doorColors[itemId] || '#78350F';
        const doorW = itemId === 'double_door' || itemId === 'carved_door' ? 2.2 : 1.4;
        const doorH = 2.1;

        const door = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, 0.15), this.getMaterial(color));
        door.position.set(0, doorH / 2 + 0.35, 4.35);
        door.castShadow = true;

        const handle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), this.getMaterial('#F59E0B'));
        handle.position.set(doorW / 2 - 0.25, 1.25, 4.45);
        group.add(door, handle);
        break;
      }

      // ==========================================
      // E. DERAZALAR
      // ==========================================
      case 'panoramic_window':
      case 'small_window':
      case 'standard_window':
      case 'arch_window':
      case 'stained_glass_window': {
        const winW = itemId === 'panoramic_window' ? 2.8 : (itemId === 'small_window' ? 0.9 : 1.5);
        const winH = itemId === 'panoramic_window' ? 2.0 : (itemId === 'small_window' ? 0.9 : 1.4);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(winW, winH, 0.12), this.getMaterial('#FFFFFF'));
        frame.position.set(2.4, 1.6, 4.35);

        const glassColor = itemId === 'stained_glass_window' ? '#EC4899' : '#7DD3FC';
        const glass = new THREE.Mesh(
          new THREE.BoxGeometry(winW - 0.2, winH - 0.2, 0.14),
          this.getMaterial(glassColor, { transparent: true, opacity: 0.75 })
        );
        glass.position.copy(frame.position);

        group.add(frame, glass);
        group.userData.isWindow = true;
        group.userData.glassMesh = glass;
        break;
      }

      // ==========================================
      // F. QO'SHIMCHA QISMLAR
      // ==========================================
      case 'stairs': {
        for (let i = 0; i < 3; i++) {
          const step = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 0.4), this.getMaterial('#94A3B8'));
          step.position.set(0, 0.06 + i * 0.12, 4.5 + (2 - i) * 0.4);
          step.castShadow = true;
          step.receiveShadow = true;
          group.add(step);
        }
        break;
      }
      case 'balcony': {
        const deck = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.2, 1.4), this.getMaterial('#E2E8F0'));
        deck.position.set(0, 2.7, 4.9);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.7, 0.08), this.getMaterial('#334155'));
        rail.position.set(0, 3.1, 5.55);
        group.add(deck, rail);
        break;
      }

      // ==========================================
      // G. HOVLI, BOG' VA YO'LAKLAR
      // ==========================================
      case 'stone_path': {
        // Modern Architectural Paver Blocks with Recessed Round LED Ground Spots (Images 3 & 4)
        const paverMat = this.getMaterial('#E2E8F0');
        const spotMat = this.getMaterial('#FEF08A', { emissive: 0xF59E0B, emissiveIntensity: 0.8 });

        [-0.45, 0.0, 0.45].forEach((z, i) => {
          const stone = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.06, 0.38), paverMat);
          stone.position.set(i % 2 === 0 ? 0.06 : -0.06, 0.03, z);
          stone.receiveShadow = true;

          // Embedded round LED ground light
          const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.07, 8), spotMat);
          spot.position.set(i % 2 === 0 ? 0.42 : -0.42, 0.04, z);
          spot.userData.isLedGroundSpot = true;

          group.add(stone, spot);
        });
        break;
      }

      case 'tree':
      case 'fruit_tree': {
        // Sculptural Spreading Shade Tree (Image 4: beautiful garden tree)
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.36, 1.8, 7), this.getMaterial('#78350F'));
        trunk.position.y = 0.9;
        trunk.castShadow = true;
        group.add(trunk);

        const leafColor = itemId === 'fruit_tree' ? '#16A34A' : '#15803D';
        const leafMat = this.getMaterial(leafColor);

        // Multi-tiered organic foliage clusters
        const foliageCoords = [
          [0, 2.2, 0, 1.3],
          [-0.6, 2.6, 0.5, 0.95],
          [0.7, 2.7, -0.4, 1.05],
          [0.2, 3.2, 0.3, 0.85],
          [-0.4, 2.0, -0.6, 0.8],
        ];
        foliageCoords.forEach(([x, y, z, r]) => {
          const f = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 7), leafMat);
          f.position.set(x, y, z);
          f.castShadow = true;
          group.add(f);
        });
        break;
      }

      case 'bush': {
        // Manicured Boxwood Shrub + Purple Flowering Lavender Hedge (Image 4)
        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), this.getMaterial('#16A34A'));
        bush.position.y = 0.48;
        bush.scale.set(1.2, 0.85, 1.2);
        bush.castShadow = true;

        // Purple flowering lavender blooms (Image 4)
        const flowerMat = this.getMaterial('#9333EA');
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 5), flowerMat);
          blossom.position.set(Math.cos(angle) * 0.45, 0.65 + (i % 2) * 0.1, Math.sin(angle) * 0.45);
          group.add(blossom);
        }
        group.add(bush);
        break;
      }

      case 'flower': {
        // Dense Purple/Magenta Flowering Garden Clump (Image 4)
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 5), this.getMaterial('#16A34A'));
        stem.position.y = 0.2;
        const bloomGroup = new THREE.Group();
        const purpleMat = this.getMaterial('#A855F7');
        [-0.15, 0.15].forEach((x) => {
          [-0.15, 0.15].forEach((z) => {
            const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 6, 6), purpleMat);
            b.position.set(x, 0.45, z);
            bloomGroup.add(b);
          });
        });
        group.add(stem, bloomGroup);
        break;
      }

      case 'street_lantern': {
        // Modern Minimalist L-Shaped Architectural Lantern / Bollard (Images 3 & 4)
        const poleMat = this.getMaterial('#1E293B');
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8), poleMat);
        pole.position.y = 1.1;
        pole.castShadow = true;

        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.08), poleMat);
        arm.position.set(0.2, 2.2, 0);

        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 8, 8),
          this.getMaterial('#FEF08A', { emissive: 0xFBBF24, emissiveIntensity: 1.2 })
        );
        bulb.position.set(0.4, 2.05, 0);

        group.add(pole, arm, bulb);
        group.userData.isLantern = true;
        group.userData.bulbMesh = bulb;
        break;
      }

      case 'bench': {
        const woodMat = this.getMaterial('#92400E');
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.5), woodMat);
        seat.position.y = 0.4;
        const back = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.06), woodMat);
        back.position.set(0, 0.65, -0.22);
        const legMat = this.getMaterial('#1E293B');
        [-0.65, 0.65].forEach((x) => {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.45), legMat);
          leg.position.set(x, 0.2, 0);
          group.add(leg);
        });
        group.add(seat, back);
        break;
      }

      case 'wooden_fence':
      case 'iron_fence': {
        const fMat = this.getMaterial(itemId === 'iron_fence' ? '#1E293B' : '#F8FAFC');
        for (let i = -0.5; i <= 0.5; i += 0.25) {
          const picket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.04), fMat);
          picket.position.set(i, 0.425, 0);
          picket.castShadow = true;
          group.add(picket);
        }
        const bar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.04), fMat);
        bar.position.set(0, 0.5, 0);
        group.add(bar);
        break;
      }

      // ==========================================
      // H. TRANSPORT
      // ==========================================
      case 'sports_car': {
        // Luxury Modern Supercar (Images 3 & 4: red / silver sleek sports car)
        const color = customColor || '#DC2626'; // Red or silver
        const carMat = this.getMaterial(color, { roughness: 0.2 });
        const glassMat = this.getMaterial('#1E293B', { roughness: 0.1 });
        const rimMat = this.getMaterial('#CBD5E1');

        const carGroup = new THREE.Group();
        // Sleek aerodynamic chassis
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.45, 1.5), carMat);
        chassis.position.y = 0.38;
        chassis.castShadow = true;

        // Sloped aerodynamic front nose
        const nose = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 1.45), carMat);
        nose.position.set(1.4, 0.3, 0);

        // Curved cockpit glass canopy
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.42, 1.25), glassMat);
        cabin.position.set(-0.15, 0.72, 0);

        // Sport alloy wheels
        const wheelMat = this.getMaterial('#09090B');
        [-1.0, 1.0].forEach((x) => {
          [-0.8, 0.8].forEach((z) => {
            const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 12), wheelMat);
            tire.rotation.x = Math.PI / 2;
            tire.position.set(x, 0.28, z);
            const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.19, 6), rimMat);
            rim.rotation.x = Math.PI / 2;
            rim.position.set(x, 0.28, z);
            carGroup.add(tire, rim);
          });
        });

        // Glowing LED projector headlights (Image 4)
        const lightMat = this.getMaterial('#FEF08A', { emissive: 0xFDE047, emissiveIntensity: 1.5 });
        [-0.45, 0.45].forEach((z) => {
          const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.25), lightMat);
          headlight.position.set(1.76, 0.38, z);
          headlight.userData.isCarHeadlight = true;
          carGroup.add(headlight);
        });

        // Rear LED lightbar
        const tailMat = this.getMaterial('#EF4444', { emissive: 0xDC2626, emissiveIntensity: 1.2 });
        const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.3), tailMat);
        taillight.position.set(-1.66, 0.45, 0);
        carGroup.add(taillight);

        carGroup.add(chassis, nose, cabin);
        group.add(carGroup);
        break;
      }

      case 'standard_car':
      case 'large_suv': {
        const carColors = {
          standard_car: '#F8FAFC',
          large_suv: '#0F172A',
        };
        const color = customColor || carColors[itemId] || '#F8FAFC';
        const carMat = this.getMaterial(color);
        const length = itemId === 'large_suv' ? 3.4 : 3.0;
        const width = itemId === 'large_suv' ? 1.6 : 1.4;
        const height = itemId === 'large_suv' ? 0.8 : 0.6;

        const body = new THREE.Mesh(new THREE.BoxGeometry(length, height, width), carMat);
        body.position.y = 0.35 + height / 2;
        body.castShadow = true;

        const cabinH = 0.55;
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(length * 0.55, cabinH, width * 0.85), this.getMaterial('#38BDF8', { transparent: true, opacity: 0.7 }));
        cabin.position.set(-0.2, body.position.y + height / 2 + cabinH / 2, 0);

        const wheelMat = this.getMaterial('#111827');
        [-length * 0.32, length * 0.32].forEach((x) => {
          [-width / 2 - 0.05, width / 2 + 0.05].forEach((z) => {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.18, 12), wheelMat);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(x, 0.3, z);
            group.add(wheel);
          });
        });
        group.add(body, cabin);
        break;
      }

      case 'bicycle': {
        const frame = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2), this.getMaterial('#EF4444'));
        frame.rotation.z = Math.PI / 2;
        frame.position.y = 0.45;
        [-0.45, 0.45].forEach((x) => {
          const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.04, 8, 12), this.getMaterial('#1F2937'));
          wheel.position.set(x, 0.25, 0);
          group.add(wheel);
        });
        group.add(frame);
        break;
      }

      // ==========================================
      // I. ICHKI JIHOZLAR (INTERIOR)
      // ==========================================
      case 'carpet': {
        const carpet = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.02, 2.6), this.getMaterial('#991B1B'));
        carpet.position.set(0, 0.36, 0);
        group.add(carpet);
        break;
      }
      case 'sofa': {
        // Modern Designer Sofa (Image 4: visible cozy interior)
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.95), this.getMaterial('#2563EB'));
        base.position.set(0, 0.58, 0);
        const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 0.25), this.getMaterial('#1D4ED8'));
        back.position.set(0, 0.95, -0.35);
        [-1.15, 1.15].forEach((x) => {
          const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, 0.95), this.getMaterial('#1D4ED8'));
          arm.position.set(x, 0.68, 0);
          group.add(arm);
        });
        group.add(base, back);
        break;
      }
      case 'table': {
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 1.0), this.getMaterial('#A16207'));
        top.position.set(0, 1.1, 0);
        [-0.55, 0.55].forEach((x) => {
          [-0.35, 0.35].forEach((z) => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7), this.getMaterial('#78350F'));
            leg.position.set(x, 0.75, z);
            group.add(leg);
          });
        });
        group.add(top);
        break;
      }
      case 'bed': {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.3, 2.2), this.getMaterial('#78350F'));
        frame.position.set(0, 0.5, 0);
        const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.25, 2.05), this.getMaterial('#FFFFFF'));
        mattress.position.set(0, 0.75, 0);
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.5), this.getMaterial('#A855F7'));
        pillow.position.set(0, 0.95, -0.7);
        group.add(frame, mattress, pillow);
        break;
      }
      case 'tv': {
        const screen = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.08), this.getMaterial('#09090B'));
        screen.position.set(0, 1.4, 4.15);
        group.add(screen);
        break;
      }

      default: {
        const fallback = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.getMaterial('#8B5CF6'));
        fallback.position.y = 0.5;
        group.add(fallback);
        break;
      }
    }

    return group;
  }
}

window.itemBuilder = new ItemBuilder();
window.HouseItemBuilder = ItemBuilder;
