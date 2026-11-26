/**
 * MathCity AI — Procedural 3D Low-Poly Item Geometry Builder
 * Constructs rich, stylized low-poly 3D models with Three.js primitives.
 * Completely code-generated, zero external 3D model files.
 */

class ItemBuilder {
  constructor() {
    this.materialsCache = new Map();
  }

  getMaterial(colorHex, options = {}) {
    const key = `${colorHex}_${options.roughness || 0.6}_${options.transparent || false}_${options.opacity || 1.0}_${options.emissive || 0}`;
    if (!this.materialsCache.has(key)) {
      const mat = new THREE.MeshLambertMaterial({
        color: colorHex,
        roughness: options.roughness !== undefined ? options.roughness : 0.6,
        transparent: options.transparent || false,
        opacity: options.opacity !== undefined ? options.opacity : 1.0,
        emissive: options.emissive || 0x000000,
        flatShading: true,
      });
      this.materialsCache.set(key, mat)
    }
    return this.materialsCache.get(key)
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
          new THREE.BoxGeometry(8.8, 0.08, 8.8),
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
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(9.0, 0.35, 9.0),
          this.getMaterial('#E2E8F0')
        );
        slab.position.y = 0.175;
        slab.castShadow = true;
        slab.receiveShadow = true;
        group.add(slab);
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
      case 'mud_brick_wall':
      case 'white_brick_wall':
      case 'red_brick_wall':
      case 'stone_wall':
      case 'modern_glass_wall': {
        const wallColors = {
          mud_brick_wall: '#D97706',
          white_brick_wall: '#F8FAFC',
          red_brick_wall: '#B91C1C',
          stone_wall: '#475569',
          modern_glass_wall: '#F1F5F9',
        };
        const color = customColor || wallColors[itemId] || '#B91C1C';
        const wallMat = this.getMaterial(color);

        // 4 outer villa perimeter walls (forming a 6x6 room perimeter)
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

        // Front wall with door opening in middle
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

        // If modern glass wall: add floor-to-ceiling glass panel accents
        if (itemId === 'modern_glass_wall') {
          const glassMat = this.getMaterial('#38BDF8', { transparent: true, opacity: 0.55 });
          const gPanel = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.0, 0.1), glassMat);
          gPanel.position.set(2.65, 1.35, roomSize / 2);
          group.add(gPanel);
        }
        break;
      }

      // ==========================================
      // C. TOMLAR
      // ==========================================
      case 'flat_roof': {
        const color = customColor || '#334155';
        const slab = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.3, 9.4), this.getMaterial(color));
        slab.position.y = 2.9;
        slab.castShadow = true;
        slab.receiveShadow = true;

        // Modern perimeter safety railing
        const railMat = this.getMaterial('#1E293B');
        const rail = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.5, 0.1), railMat);
        rail.position.set(0, 3.25, 4.6);
        group.add(slab, rail);
        break;
      }
      case 'shed_roof': {
        const color = customColor || '#B45309';
        const geom = new THREE.BufferGeometry();
        // Inclined wedge shape
        const slab = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.3, 9.4), this.getMaterial(color));
        slab.position.set(0, 3.4, 0);
        slab.rotation.x = 0.22;
        slab.castShadow = true;
        group.add(slab);
        break;
      }
      case 'gable_roof': {
        const color = customColor || '#B91C1C';
        const roofMat = this.getMaterial(color);

        // Left slope
        const rLeft = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.25, 5.5), roofMat);
        rLeft.position.set(0, 3.8, -2.1);
        rLeft.rotation.x = 0.65;
        rLeft.castShadow = true;

        // Right slope
        const rRight = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.25, 5.5), roofMat);
        rRight.position.set(0, 3.8, 2.1);
        rRight.rotation.x = -0.65;
        rRight.castShadow = true;

        // Gable triangles front & back
        const triangleShape = new THREE.Shape();
        triangleShape.moveTo(-4.3, 0);
        triangleShape.lineTo(4.3, 0);
        triangleShape.lineTo(0, 2.2);
        triangleShape.closePath();

        const extrudeGeom = new THREE.ExtrudeGeometry(triangleShape, { depth: 0.25, bevelEnabled: false });
        const gFront = new THREE.Mesh(extrudeGeom, this.getMaterial('#F1F5F9'));
        gFront.position.set(4.35, 2.75, 0);
        gFront.rotation.y = Math.PI / 2;

        const gBack = gFront.clone();
        gBack.position.set(-4.6, 2.75, 0);

        group.add(rLeft, rRight, gFront, gBack);
        break;
      }
      case 'pyramid_roof': {
        const color = customColor || '#1D4ED8';
        const pyramid = new THREE.Mesh(
          new THREE.ConeGeometry(6.6, 2.8, 4),
          this.getMaterial(color)
        );
        pyramid.position.y = 4.15;
        pyramid.rotation.y = Math.PI / 4;
        pyramid.castShadow = true;
        group.add(pyramid);
        break;
      }
      case 'hip_roof': {
        const color = customColor || '#78350F';
        const hip = new THREE.Mesh(
          new THREE.ConeGeometry(6.8, 2.4, 4),
          this.getMaterial(color)
        );
        hip.scale.set(1.15, 1.0, 0.95);
        hip.position.y = 3.95;
        hip.rotation.y = Math.PI / 4;
        hip.castShadow = true;
        group.add(hip);
        break;
      }
      case 'tile_roof': {
        const color = customColor || '#C2410C';
        const tileMat = this.getMaterial(color);
        const rL = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.35, 5.5), tileMat);
        rL.position.set(0, 3.8, -2.1);
        rL.rotation.x = 0.65;
        rL.castShadow = true;

        const rR = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.35, 5.5), tileMat);
        rR.position.set(0, 3.8, 2.1);
        rR.rotation.x = -0.65;
        rR.castShadow = true;

        // Ridge cap tile
        const ridge = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 9.8, 8), this.getMaterial('#9A3412'));
        ridge.rotation.z = Math.PI / 2;
        ridge.position.set(0, 4.85, 0);

        group.add(rL, rR, ridge);
        break;
      }
      case 'mansard_roof': {
        const color = customColor || '#374151';
        const m1 = new THREE.Mesh(new THREE.ConeGeometry(7.0, 2.2, 4), this.getMaterial(color));
        m1.position.y = 3.85;
        m1.rotation.y = Math.PI / 4;
        m1.castShadow = true;

        const mTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.3, 5.2), this.getMaterial('#1F2937'));
        mTop.position.y = 4.8;
        group.add(m1, mTop);
        break;
      }
      case 'dome_roof': {
        const color = customColor || '#0284C7';
        const dome = new THREE.Mesh(
          new THREE.SphereGeometry(3.6, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
          this.getMaterial(color)
        );
        dome.position.y = 2.8;
        dome.castShadow = true;

        // Gold finial spire on top
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.15, 1.4, 8), this.getMaterial('#F59E0B'));
        spire.position.y = 6.8;
        const crescent = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.05, 8, 12), this.getMaterial('#F59E0B'));
        crescent.position.y = 7.4;
        group.add(dome, spire, crescent);
        break;
      }
      case 'cone_tower_roof': {
        const color = customColor || '#7E22CE';
        const cone = new THREE.Mesh(new THREE.ConeGeometry(3.8, 4.2, 12), this.getMaterial(color));
        cone.position.y = 4.85;
        cone.castShadow = true;
        group.add(cone);
        break;
      }
      case 'solar_roof': {
        const base = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.3, 9.4), this.getMaterial('#1E293B'));
        base.position.y = 2.9;
        group.add(base);

        // 8 Blue solar panels
        const panelMat = this.getMaterial('#1E40AF', { roughness: 0.2 });
        for (let x = -3; x <= 3; x += 2) {
          for (let z = -2; z <= 2; z += 4) {
            const p = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 3.2), panelMat);
            p.position.set(x, 3.1, z);
            group.add(p);
          }
        }
        break;
      }
      case 'glass_conservatory_roof': {
        const glassMat = this.getMaterial('#38BDF8', { transparent: true, opacity: 0.6 });
        const gRoof = new THREE.Mesh(new THREE.ConeGeometry(6.4, 2.2, 4), glassMat);
        gRoof.position.y = 3.85;
        gRoof.rotation.y = Math.PI / 4;
        group.add(gRoof);
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
        group.userData.hasSmoke = true;
        group.userData.smokePos = new THREE.Vector3(2.2, 5.2, -1.8);
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
      case 'wind_vane': {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2), this.getMaterial('#F59E0B'));
        pole.position.set(0, 5.2, 0);
        const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 4), this.getMaterial('#F59E0B'));
        arrow.rotation.z = -Math.PI / 2;
        arrow.position.set(0, 5.7, 0);
        group.add(pole, arrow);
        break;
      }
      case 'skylight': {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.6), this.getMaterial('#334155'));
        frame.position.set(-1.5, 3.8, 1.5);
        frame.rotation.x = -0.65;
        const glass = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 1.4), this.getMaterial('#7DD3FC', { transparent: true, opacity: 0.7 }));
        glass.position.copy(frame.position);
        glass.rotation.copy(frame.rotation);
        group.add(frame, glass);
        break;
      }

      // ==========================================
      // D. ESHIKLAR
      // ==========================================
      case 'simple_wood_door':
      case 'standard_door':
      case 'double_door':
      case 'garage_gate':
      case 'modern_glass_door':
      case 'carved_door': {
        const doorColors = {
          simple_wood_door: '#92400E',
          standard_door: '#78350F',
          double_door: '#581C87',
          garage_gate: '#334155',
          modern_glass_door: '#0284C7',
          carved_door: '#B45309',
        };
        const color = customColor || doorColors[itemId] || '#78350F';
        const doorW = itemId === 'garage_gate' ? 3.6 : (itemId === 'double_door' || itemId === 'carved_door' ? 2.2 : 1.4);
        const doorH = 2.1;

        const door = new THREE.Mesh(
          new THREE.BoxGeometry(doorW, doorH, 0.15),
          this.getMaterial(color)
        );
        door.position.set(0, doorH / 2 + 0.35, 4.35);
        door.castShadow = true;

        // Handle
        const handle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), this.getMaterial('#F59E0B'));
        handle.position.set(doorW / 2 - 0.25, 1.25, 4.45);
        group.add(door, handle);
        break;
      }

      // ==========================================
      // E. DERAZALAR
      // ==========================================
      case 'small_window':
      case 'standard_window':
      case 'arch_window':
      case 'panoramic_window':
      case 'stained_glass_window': {
        const winW = itemId === 'panoramic_window' ? 2.8 : (itemId === 'small_window' ? 0.9 : 1.5);
        const winH = itemId === 'panoramic_window' ? 2.0 : (itemId === 'small_window' ? 0.9 : 1.4);

        const frame = new THREE.Mesh(
          new THREE.BoxGeometry(winW, winH, 0.12),
          this.getMaterial('#FFFFFF')
        );
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
          const step = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 0.12, 0.4),
            this.getMaterial('#94A3B8')
          );
          step.position.set(0, 0.06 + i * 0.12, 4.5 + (2 - i) * 0.4);
          step.castShadow = true;
          step.receiveShadow = true;
          group.add(step);
        }
        break;
      }
      case 'ayvon_pillars': {
        const pillarMat = this.getMaterial('#B45309');
        [-1.8, 1.8].forEach((x) => {
          const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 2.4, 8), pillarMat);
          p.position.set(x, 1.4, 5.6);
          p.castShadow = true;
          group.add(p);
        });
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 2.4), this.getMaterial('#92400E'));
        canopy.position.set(0, 2.65, 5.1);
        canopy.castShadow = true;
        group.add(canopy);
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
      case 'terrace': {
        const deck = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 3.6), this.getMaterial('#F59E0B'));
        deck.position.set(-3.2, 0.125, 4.8);
        deck.receiveShadow = true;
        group.add(deck);
        break;
      }
      case 'second_floor': {
        const floor2 = new THREE.Mesh(new THREE.BoxGeometry(8.6, 2.2, 8.6), this.getMaterial('#F8FAFC'));
        floor2.position.set(0, 3.8, 0);
        floor2.castShadow = true;
        group.add(floor2);
        break;
      }
      case 'air_conditioner': {
        const ac = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.35), this.getMaterial('#F8FAFC'));
        ac.position.set(-3.2, 1.8, 4.45);
        ac.castShadow = true;
        group.add(ac);
        break;
      }
      case 'satellite_dish': {
        const dish = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.5), this.getMaterial('#E2E8F0'));
        dish.position.set(-3.6, 2.2, 4.5);
        dish.rotation.x = Math.PI / 3;
        group.add(dish);
        break;
      }

      // ==========================================
      // G. HOVLI VA BOG'
      // ==========================================
      case 'tree':
      case 'fruit_tree': {
        // Trunk
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.6, 6), this.getMaterial('#78350F'));
        trunk.position.y = 0.8;
        trunk.castShadow = true;
        group.add(trunk);

        // Foliage layers
        const leavesColor = itemId === 'fruit_tree' ? '#16A34A' : '#15803D';
        const leaf1 = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 8), this.getMaterial(leavesColor));
        leaf1.position.y = 2.0;
        leaf1.castShadow = true;

        const leaf2 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 7, 7), this.getMaterial(leavesColor));
        leaf2.position.set(0, 2.7, 0);
        leaf2.castShadow = true;
        group.add(leaf1, leaf2);

        // Apples on fruit tree
        if (itemId === 'fruit_tree') {
          const appleMat = this.getMaterial('#DC2626');
          [[-0.6, 1.9, 0.5], [0.5, 2.2, 0.6], [0.2, 2.4, -0.6], [-0.4, 2.6, -0.4]].forEach(([x, y, z]) => {
            const apple = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), appleMat);
            apple.position.set(x, y, z);
            group.add(apple);
          });
        }
        break;
      }
      case 'bush': {
        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), this.getMaterial('#22C55E'));
        bush.position.y = 0.5;
        bush.scale.set(1.2, 0.85, 1.2);
        bush.castShadow = true;
        group.add(bush);
        break;
      }
      case 'flower': {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 5), this.getMaterial('#16A34A'));
        stem.position.y = 0.2;
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), this.getMaterial('#EC4899'));
        petal.position.y = 0.42;
        group.add(stem, petal);
        break;
      }
      case 'grass_patch': {
        const patch = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.06, 8), this.getMaterial('#4ADE80'));
        patch.position.y = 0.03;
        group.add(patch);
        break;
      }
      case 'street_lantern': {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.5, 8), this.getMaterial('#1E293B'));
        pole.position.y = 1.25;
        pole.castShadow = true;

        const head = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.35, 6), this.getMaterial('#1E293B'));
        head.position.y = 2.6;

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), this.getMaterial('#FEF08A', { emissive: 0xFBBF24 }));
        bulb.position.y = 2.42;

        group.add(pole, head, bulb);
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
      case 'stone_path': {
        [-0.4, 0, 0.4].forEach((z, i) => {
          const stone = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.35), this.getMaterial('#94A3B8'));
          stone.position.set(i % 2 === 0 ? 0.08 : -0.08, 0.03, z);
          stone.receiveShadow = true;
          group.add(stone);
        });
        break;
      }
      case 'wooden_fence': {
        const fMat = this.getMaterial('#F8FAFC');
        for (let i = -0.5; i <= 0.5; i += 0.25) {
          const picket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, 0.04), fMat);
          picket.position.set(i, 0.45, 0);
          picket.castShadow = true;
          group.add(picket);
        }
        const bar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.04), fMat);
        bar.position.set(0, 0.5, 0);
        group.add(bar);
        break;
      }
      case 'dog_kennel': {
        const house = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 1.0), this.getMaterial('#B45309'));
        house.position.y = 0.4;
        house.castShadow = true;

        const kRoof = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.5, 4), this.getMaterial('#991B1B'));
        kRoof.position.y = 1.0;
        kRoof.rotation.y = Math.PI / 4;

        // Dog puppy inside
        const dog = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), this.getMaterial('#D97706'));
        dog.position.set(0, 0.25, 0.35);
        group.add(house, kRoof, dog);
        break;
      }
      case 'water_well': {
        const wellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.6, 10), this.getMaterial('#64748B'));
        wellBase.position.y = 0.3;
        wellBase.castShadow = true;

        const wRoof = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.5, 4), this.getMaterial('#92400E'));
        wRoof.position.y = 1.35;
        wRoof.rotation.y = Math.PI / 4;
        group.add(wellBase, wRoof);
        break;
      }
      case 'tandir': {
        const oven = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.65, 0.9, 10), this.getMaterial('#EA580C'));
        oven.position.y = 0.45;
        oven.castShadow = true;
        group.add(oven);
        break;
      }
      case 'grape_pergola': {
        const pMat = this.getMaterial('#78350F');
        [-0.8, 0.8].forEach((x) => {
          [-0.8, 0.8].forEach((z) => {
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 6), pMat);
            pole.position.set(x, 1.1, z);
            group.add(pole);
          });
        });
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 2.0), this.getMaterial('#15803D'));
        canopy.position.y = 2.2;
        group.add(canopy);
        break;
      }
      case 'playground_swing': {
        const frameMat = this.getMaterial('#3B82F6');
        const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4), frameMat);
        topBar.rotation.z = Math.PI / 2;
        topBar.position.y = 2.0;

        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.25), this.getMaterial('#EF4444'));
        seat.position.y = 0.4;
        group.add(topBar, seat);
        break;
      }
      case 'supa_tosh_koshk': {
        const supaBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 2.4), this.getMaterial('#B45309'));
        supaBase.position.y = 0.225;
        supaBase.castShadow = true;

        const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 2.2), this.getMaterial('#DC2626'));
        mattress.position.y = 0.51;
        group.add(supaBase, mattress);
        break;
      }
      case 'fountain': {
        const fBase = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 0.35, 16), this.getMaterial('#E2E8F0'));
        fBase.position.y = 0.175;
        const water = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.06, 16), this.getMaterial('#0284C7'));
        water.position.y = 0.35;
        const fCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.9, 10), this.getMaterial('#E2E8F0'));
        fCenter.position.y = 0.65;
        group.add(fBase, water, fCenter);
        break;
      }
      case 'swimming_pool': {
        const rim = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 3.2), this.getMaterial('#F8FAFC'));
        rim.position.y = 0.1;
        const water = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 2.8), this.getMaterial('#0EA5E9', { transparent: true, opacity: 0.8 }));
        water.position.y = 0.12;
        group.add(rim, water);
        break;
      }
      case 'mailbox': {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0), this.getMaterial('#78350F'));
        post.position.y = 0.5;
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.5), this.getMaterial('#EF4444'));
        box.position.set(0, 1.1, 0);
        group.add(post, box);
        break;
      }
      case 'mangal_bbq': {
        const grill = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.4), this.getMaterial('#1F2937'));
        grill.position.y = 0.7;
        [-0.3, 0.3].forEach((x) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6), this.getMaterial('#111827'));
          leg.position.set(x, 0.3, 0);
          group.add(leg);
        });
        group.add(grill);
        break;
      }
      case 'cat': {
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 7, 7), this.getMaterial('#F97316'));
        body.position.y = 0.2;
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 7, 7), this.getMaterial('#F97316'));
        head.position.set(0.18, 0.3, 0);
        group.add(body, head);
        break;
      }
      case 'bird': {
        const bird = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 5), this.getMaterial('#38BDF8'));
        bird.rotation.z = Math.PI / 2;
        bird.position.y = 0.2;
        group.add(bird);
        break;
      }

      // ==========================================
      // H. TRANSPORT
      // ==========================================
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
      case 'scooter': {
        const deck = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.2), this.getMaterial('#10B981'));
        deck.position.y = 0.12;
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9), this.getMaterial('#10B981'));
        bar.position.set(0.35, 0.55, 0);
        group.add(deck, bar);
        break;
      }
      case 'motorcycle': {
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.4), this.getMaterial('#F59E0B'));
        body.position.y = 0.45;
        body.castShadow = true;
        [-0.5, 0.5].forEach((x) => {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 10), this.getMaterial('#111827'));
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(x, 0.22, 0);
          group.add(wheel);
        });
        group.add(body);
        break;
      }
      case 'standard_car':
      case 'sports_car':
      case 'large_suv': {
        const carColors = {
          standard_car: '#F8FAFC',
          sports_car: '#DC2626',
          large_suv: '#0F172A',
        };
        const color = customColor || carColors[itemId] || '#F8FAFC';
        const carMat = this.getMaterial(color);

        const length = itemId === 'large_suv' ? 3.4 : (itemId === 'sports_car' ? 3.2 : 3.0);
        const width = itemId === 'large_suv' ? 1.6 : 1.4;
        const height = itemId === 'large_suv' ? 0.8 : (itemId === 'sports_car' ? 0.45 : 0.6);

        // Lower body
        const body = new THREE.Mesh(new THREE.BoxGeometry(length, height, width), carMat);
        body.position.y = 0.35 + height / 2;
        body.castShadow = true;

        // Cabin
        const cabinH = itemId === 'sports_car' ? 0.35 : 0.55;
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(length * 0.55, cabinH, width * 0.85), this.getMaterial('#38BDF8', { transparent: true, opacity: 0.7 }));
        cabin.position.set(-0.2, body.position.y + height / 2 + cabinH / 2, 0);

        // Wheels
        const wheelMat = this.getMaterial('#111827');
        [-length * 0.32, length * 0.32].forEach((x) => {
          [-width / 2 - 0.05, width / 2 + 0.05].forEach((z) => {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.18, 12), wheelMat);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(x, 0.3, z);
            group.add(wheel);
          });
        });

        // Headlights
        const lightMat = this.getMaterial('#FEF08A', { emissive: 0xFDE047 });
        [-width / 3, width / 3].forEach((z) => {
          const light = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.2), lightMat);
          light.position.set(length / 2 + 0.04, body.position.y + 0.1, z);
          group.add(light);
        });

        group.add(body, cabin);
        break;
      }

      // ==========================================
      // I. ICHKI JIHOZLAR (INTERIOR)
      // ==========================================
      case 'carpet': {
        const carpet = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 2.4), this.getMaterial('#991B1B'));
        carpet.position.set(0, 0.36, 0);
        group.add(carpet);
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
      case 'sofa': {
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 0.9), this.getMaterial('#2563EB'));
        base.position.set(0, 0.58, 0);
        const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 0.25), this.getMaterial('#1D4ED8'));
        back.position.set(0, 0.95, -0.35);
        group.add(base, back);
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
      case 'kitchen_set': {
        const counter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.8), this.getMaterial('#475569'));
        counter.position.set(-2.8, 0.8, -2.8);
        const sink = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.5), this.getMaterial('#E2E8F0'));
        sink.position.set(-2.8, 1.26, -2.8);
        group.add(counter, sink);
        break;
      }
      case 'bookshelf': {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.0, 0.45), this.getMaterial('#78350F'));
        shelf.position.set(3.2, 1.35, -2.8);
        group.add(shelf);
        break;
      }
      case 'interior_lamp': {
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), this.getMaterial('#64748B'));
        cord.position.set(0, 2.4, 0);
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.3, 8), this.getMaterial('#FEF08A', { emissive: 0xFEF08A }));
        shade.position.set(0, 2.0, 0);
        group.add(cord, shade);
        break;
      }
      case 'potted_flower': {
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.3, 8), this.getMaterial('#EA580C'));
        pot.position.set(0, 0.5, 0);
        const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), this.getMaterial('#F43F5E'));
        bloom.position.set(0, 0.75, 0);
        group.add(pot, bloom);
        break;
      }
      case 'fridge': {
        const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.9, 0.85), this.getMaterial('#CBD5E1'));
        fridge.position.set(-3.2, 1.3, -1.2);
        group.add(fridge);
        break;
      }

      default: {
        // Generic fallback box
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
