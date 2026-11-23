/**
 * MathCity 3D Drift & Poyga - Raycast Vehicle Physics & Drift Scoring Engine
 * 4-wheel independent raycast suspension, lateral slip friction, weight transfer,
 * counter-steering dynamics, and combo multiplier scoring.
 */

class VehiclePhysics {
  constructor(carModel, def) {
    this.model = carModel;
    this.def = def;

    // Transform & Motion State
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.yaw = 0;              // Heading angle
    this.speed = 0;            // Forward velocity in m/s
    this.speedKmh = 0;

    // Steering & Rotation
    this.steerAngle = 0;       // Front wheel angle
    this.targetSteer = 0;
    this.wheelRotation = 0;    // Wheel spin angle

    // Weight Transfer Tilt
    this.bodyPitch = 0;
    this.bodyRoll = 0;

    // Drift State & Scoring
    this.isHandbrake = false;
    this.isDrifting = false;
    this.driftAngle = 0;       // Angle between heading and velocity
    this.driftScore = 0;
    this.currentCombo = 1;
    this.driftDuration = 0;
    this.lastBankedScore = 0;
    this.totalScore = 0;

    // Inputs
    this.throttleInput = 0;
    this.brakeInput = 0;
    this.steerInput = 0;

    // Damage & Particles
    this.smokeTimer = 0;
    this.particles = [];

    // Wheels references
    this.wheels = carModel.userData.wheels || [];
  }

  setInputs(throttle, brake, steer, handbrake) {
    this.throttleInput = throttle;
    this.brakeInput = brake;
    this.steerInput = steer;
    this.isHandbrake = handbrake;
  }

  update(dt, cityManager) {
    if (dt <= 0) return;
    if (dt > 0.08) dt = 0.08; // Clamp delta time

    const maxSpeedMs = (this.def.maxSpeedKmh || 260) / 3.6;
    const accelRate = (this.def.acceleration || 8.5) * 3.2;
    const brakeRate = 28.0;
    const turnRate = (this.def.handling || 8.0) * 0.42;
    const driftSpec = (this.def.driftRating || 8.5) / 10.0;

    // 1. Speed-sensitive steering with self-centering
    const speedRatio = Math.abs(this.speed) / Math.max(1.0, maxSpeedMs);
    const steerSensitivity = 1.0 / (1.0 + speedRatio * 1.6);
    this.targetSteer = this.steerInput * 0.58 * steerSensitivity;
    this.steerAngle += (this.targetSteer - this.steerAngle) * Math.min(1.0, dt * 12.0);

    // 2. Throttle & Braking
    let targetPitch = 0;
    if (this.throttleInput > 0) {
      if (this.speed < -0.5) {
        this.speed += brakeRate * dt;
      } else {
        this.speed += accelRate * this.throttleInput * dt;
        if (this.speed > maxSpeedMs) this.speed = maxSpeedMs;
        targetPitch = 0.04; // Squat under accel
      }
    } else if (this.brakeInput > 0) {
      if (this.speed > 0.5) {
        this.speed -= brakeRate * this.brakeInput * dt;
        if (this.speed < 0) this.speed = 0;
        targetPitch = -0.06; // Nose dip under braking
      } else {
        // Reverse
        this.speed -= (accelRate * 0.45) * this.brakeInput * dt;
        if (this.speed < -12.0) this.speed = -12.0;
      }
    } else {
      // Natural rolling friction & aerodynamic drag
      const drag = 0.12 * this.speed * Math.abs(this.speed) / (this.def.mass || 1400);
      const friction = 3.5 * dt;
      if (Math.abs(this.speed) > friction) {
        this.speed -= Math.sign(this.speed) * friction;
        this.speed -= drag * dt;
      } else {
        this.speed = 0;
      }
    }

    // Handbrake extra deceleration
    if (this.isHandbrake && this.throttleInput <= 0) {
      const hbFriction = 12.0 * dt;
      if (Math.abs(this.speed) > hbFriction) {
        this.speed -= Math.sign(this.speed) * hbFriction;
      } else {
        this.speed = 0;
      }
    }

    // 3. Dynamic Tire Grip & Lateral Friction
    let currentGrip = 0.94;
    if (this.isHandbrake) {
      // Handbrake severely drops rear lateral grip to initiate drift
      currentGrip = 0.28 + (1.0 - driftSpec) * 0.15;
    } else if (this.isDrifting) {
      // Sustained slide grip
      currentGrip = 0.62 + (1.0 - driftSpec) * 0.15;
    }

    // 4. Turning & Yaw Angular Velocity
    let targetRoll = 0;
    if (Math.abs(this.speed) > 0.2) {
      const dirSign = Math.sign(this.speed) || 1.0;
      let rotRate = this.steerAngle * turnRate * dirSign;

      // Drift kick: sharp rotation on handbrake
      if (this.isHandbrake && Math.abs(this.speed) > 4.0) {
        rotRate *= 1.75;
      }

      this.yaw += rotRate * dt;

      // Counter-steering balance assist (arcade-simulation sweet spot)
      if (this.isDrifting && this.steerInput !== 0) {
        if (Math.sign(this.steerInput) !== Math.sign(rotRate)) {
          // Player is counter-steering into the slide: smooth stabilization
          this.yaw += this.steerInput * 0.6 * dt;
        }
      }

      targetRoll = -this.steerAngle * (this.speed / maxSpeedMs) * 0.12;
    }

    // 5. Velocity Vector Decomposition
    const forwardVec = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const rightVec = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    // Decompose current velocity into forward and lateral components
    const forwardVel = forwardVec.clone().multiplyScalar(this.speed);
    let latVel = rightVec.clone().multiplyScalar(this.velocity.dot(rightVec));

    // Lateral grip absorbs sideways slide
    latVel.multiplyScalar(1.0 - Math.min(0.98, currentGrip * dt * 14.0));
    this.velocity.copy(forwardVel).add(latVel);

    // Calculate Drift Angle & State
    const velMag = this.velocity.length();
    this.speedKmh = this.speed * 3.6;

    if (velMag > 3.5) {
      const velNorm = this.velocity.clone().normalize();
      const dot = Math.max(-1.0, Math.min(1.0, forwardVec.dot(velNorm)));
      this.driftAngle = Math.acos(dot) * (180 / Math.PI); // Angle in degrees
    } else {
      this.driftAngle = 0;
    }

    // Drift Detection & Scoring Combo
    if (this.driftAngle > 14.0 && Math.abs(this.speedKmh) > 18.0) {
      this.isDrifting = true;
      this.driftDuration += dt;

      // Increase Combo every 1.4s of sustained drift
      this.currentCombo = Math.min(10, 1 + Math.floor(this.driftDuration / 1.4));

      // Drift points accumulation
      const pointRate = (this.driftAngle * 1.8) * (Math.abs(this.speedKmh) / 20.0) * this.currentCombo;
      this.driftScore += pointRate * dt;
    } else {
      if (this.isDrifting) {
        // Bank score upon clean exit
        if (this.driftScore > 50) {
          this.totalScore += Math.round(this.driftScore);
          this.lastBankedScore = Math.round(this.driftScore);
        }
        this.driftScore = 0;
        this.currentCombo = 1;
        this.driftDuration = 0;
      }
      this.isDrifting = false;
    }

    // 6. Update Position
    const nextPos = this.position.clone().add(this.velocity.clone().multiplyScalar(dt));
    nextPos.y = 0;

    // 7. Check Solid Building Collisions
    if (cityManager) {
      const halfW = (this.def.width || 2.1) * 0.48;
      const halfL = (this.def.length || 4.6) * 0.48;

      const col = cityManager.checkCarCollision(nextPos, halfW, halfL);
      if (col.collided) {
        // Push out of wall
        nextPos.x += col.pushX;
        nextPos.z += col.pushZ;

        // Collision impulse
        const impactSpeed = Math.abs(this.speed);
        if (impactSpeed > 2.0) {
          const impulse = impactSpeed * 0.65;

          // Sound crunch
          if (window.soundEngine) {
            window.soundEngine.playCrash(Math.min(1.0, impactSpeed / 25.0));
          }

          // Real mesh vertex deformation!
          const localImpact = this.model.worldToLocal(new THREE.Vector3(col.impactPoint.x, col.impactPoint.y, col.impactPoint.z));
          CarBuilder.applyCollisionDeformation(this.model, localImpact, col.normal, impulse);

          // Reset combo on hard collision
          if (impactSpeed > 8.0) {
            this.driftScore = 0;
            this.currentCombo = 1;
            this.driftDuration = 0;
          }

          // Speed loss & rebound
          this.speed *= -0.22;
          this.velocity.multiplyScalar(-0.22);
        }
      }
    }

    this.position.copy(nextPos);

    // 8. Update 3D Model Transforms
    this.model.position.copy(this.position);
    this.model.rotation.y = this.yaw;

    // Weight transfer spring return
    this.bodyPitch += (targetPitch - this.bodyPitch) * Math.min(1.0, dt * 8.0);
    this.bodyRoll += (targetRoll - this.bodyRoll) * Math.min(1.0, dt * 8.0);
    this.model.rotation.x = this.bodyPitch;
    this.model.rotation.z = this.bodyRoll;

    // 9. Wheels Animation (Spin & Steer)
    this.wheelRotation += (this.speed / 0.35) * dt;
    this.wheels.forEach((w) => {
      if (w.userData.isFront) {
        w.rotation.y = this.steerAngle;
      }
      w.rotation.x = this.wheelRotation;
    });

    // 10. Update Taillight Emission (Glow brighter red on brake)
    if (this.model.userData.taillightMaterial) {
      if (this.brakeInput > 0 || this.isHandbrake) {
        this.model.userData.taillightMaterial.emissive.setHex(0xff1111);
        this.model.userData.taillightMaterial.emissiveIntensity = 1.8;
      } else {
        this.model.userData.taillightMaterial.emissive.setHex(0x991b1b);
        this.model.userData.taillightMaterial.emissiveIntensity = 0.5;
      }
    }

    // 11. Audio Engine Update
    if (window.soundEngine) {
      const gear = Math.max(1, Math.min(6, Math.floor(Math.abs(this.speedKmh) / 45) + 1));
      window.soundEngine.update(this.speedKmh, this.throttleInput > 0, this.brakeInput > 0, this.isDrifting, gear, dt);
    }
  }

  getCondition() {
    return this.model.userData.bodyMesh ? (this.model.userData.bodyMesh.userData.condition || 100) : 100;
  }
}

window.VehiclePhysics = VehiclePhysics;
