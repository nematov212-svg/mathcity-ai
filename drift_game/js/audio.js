/**
 * MathCity 3D Drift & Poyga - Web Audio API Audio Engine
 * Real-time dynamic multi-layered engine synthesis ("G'UUUNG!"),
 * sub-bass rumble, turbo blow-off, tire screeches, and collision crunch.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 0.85;
    this.engineVolume = 0.90;
    this.sfxVolume = 0.85;

    // Master bus nodes
    this.masterGain = null;
    this.limiter = null;
    this.compressor = null;

    // Engine synth nodes
    this.engineGain = null;
    this.subBassGain = null;
    this.subBassOsc = null;
    this.osc1 = null;
    this.osc2 = null;
    this.osc3 = null;
    this.noiseGen = null;
    this.engineFilter = null;
    this.distortion = null;

    // Tire screech nodes
    this.skidGain = null;
    this.skidFilter = null;
    this.skidNoise = null;

    // Sound profile
    this.currentProfile = 'v10_screamer';
    this.currentRPM = 900;
    this.targetRPM = 900;
    this.currentGear = 1;
    this.lastGear = 1;
    this.isAccelerating = false;
    this.isDrifting = false;

    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Output Chain: Compressor -> Limiter -> Destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      this._setupEngineNodes();
      this._setupSkidNodes();

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _setupEngineNodes() {
    const t = this.ctx.currentTime;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0, t);

    // Distortion for throaty exhaust growl
    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this._makeDistortionCurve(18);
    this.distortion.oversample = '2x';

    // Lowpass filter for RPM frequency opening
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(450, t);
    this.engineFilter.Q.setValueAtTime(3.5, t);

    // 1. Fundamental Pitch Oscillator (Sawtooth)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(65, t);
    this.osc1.start();

    // 2. Second Harmonic Oscillator (Triangle / Square blend)
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(130, t);
    this.osc2.start();

    // 3. Cylinder Fire Pulse Oscillator
    this.osc3 = this.ctx.createOscillator();
    this.osc3.type = 'sawtooth';
    this.osc3.frequency.setValueAtTime(97.5, t);
    this.osc3.start();

    // 4. Sub-Bass Rumble (Sine at 35-90 Hz)
    this.subBassOsc = this.ctx.createOscillator();
    this.subBassOsc.type = 'sine';
    this.subBassOsc.frequency.setValueAtTime(42, t);
    this.subBassOsc.start();

    this.subBassGain = this.ctx.createGain();
    this.subBassGain.gain.setValueAtTime(0.35, t);
    this.subBassOsc.connect(this.subBassGain);
    this.subBassGain.connect(this.masterGain);

    // Wire up engine harmonics through distortion & filter
    const oscGain1 = this.ctx.createGain();
    oscGain1.gain.setValueAtTime(0.45, t);
    this.osc1.connect(oscGain1);
    oscGain1.connect(this.distortion);

    const oscGain2 = this.ctx.createGain();
    oscGain2.gain.setValueAtTime(0.30, t);
    this.osc2.connect(oscGain2);
    oscGain2.connect(this.distortion);

    const oscGain3 = this.ctx.createGain();
    oscGain3.gain.setValueAtTime(0.25, t);
    this.osc3.connect(oscGain3);
    oscGain3.connect(this.distortion);

    this.distortion.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);
  }

  _setupSkidNodes() {
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.skidNoise = this.ctx.createBufferSource();
    this.skidNoise.buffer = noiseBuffer;
    this.skidNoise.loop = true;
    this.skidNoise.start();

    this.skidFilter = this.ctx.createBiquadFilter();
    this.skidFilter.type = 'bandpass';
    this.skidFilter.frequency.setValueAtTime(1400, t);
    this.skidFilter.Q.setValueAtTime(4.0, t);

    this.skidGain = this.ctx.createGain();
    this.skidGain.gain.setValueAtTime(0, t);

    this.skidNoise.connect(this.skidFilter);
    this.skidFilter.connect(this.skidGain);
    this.skidGain.connect(this.masterGain);
  }

  _makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 20;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  setProfile(profile) {
    this.currentProfile = profile || 'v10_screamer';
  }

  update(speedKmh, throttle, isBraking, isDrifting, gear, dt) {
    if (!this.initialized || !this.ctx) return;
    this.resume();

    this.isAccelerating = throttle;
    this.currentGear = gear;

    // Detect Gear Shift Pop / Backfire
    if (gear !== this.lastGear) {
      if (gear > this.lastGear) {
        this.playGearShiftBlowOff();
      }
      this.lastGear = gear;
    }

    // RPM Dynamics Calculation
    const idleRPM = 850;
    const maxRPM = 8200;

    let target = idleRPM;
    if (throttle) {
      // RPM climbs based on speed within current gear
      const speedInGear = Math.max(0, speedKmh - (gear - 1) * 35);
      const ratio = Math.min(1.0, speedInGear / 55.0);
      target = idleRPM + ratio * (maxRPM - idleRPM);
      if (target > maxRPM) target = maxRPM;
    } else if (isBraking) {
      target = Math.max(idleRPM, this.currentRPM - 3500 * dt);
    } else {
      // Engine deceleration / idle drop
      target = Math.max(idleRPM, this.currentRPM - 1800 * dt);
    }

    this.currentRPM += (target - this.currentRPM) * Math.min(1.0, dt * 11.0);

    // Audio frequency tuning according to engine profile
    const normRPM = (this.currentRPM - idleRPM) / (maxRPM - idleRPM);
    let baseFreq = 50 + normRPM * 240;

    if (this.currentProfile === 'v8_muscle') {
      baseFreq = 42 + normRPM * 190; // Deeper rumble
    } else if (this.currentProfile === 'turbo_drift') {
      baseFreq = 55 + normRPM * 270;
    } else if (this.currentProfile === 'hyper_v12') {
      baseFreq = 62 + normRPM * 330; // Screaming hypercar
    } else if (this.currentProfile === 'electric_whine') {
      baseFreq = 120 + normRPM * 650; // High-pitch electric motor
    }

    const t = this.ctx.currentTime;
    this.osc1.frequency.setTargetAtTime(baseFreq, t, 0.05);
    this.osc2.frequency.setTargetAtTime(baseFreq * 1.5, t, 0.05);
    this.osc3.frequency.setTargetAtTime(baseFreq * 2.0, t, 0.05);
    this.subBassOsc.frequency.setTargetAtTime(baseFreq * 0.5, t, 0.05);

    // Filter frequency: opens wide on throttle ("G'UUUUNG!")
    const filterFreq = 380 + (throttle ? 3200 : 900) * normRPM;
    this.engineFilter.frequency.setTargetAtTime(filterFreq, t, 0.08);

    // Engine volume
    const targetVol = (0.28 + normRPM * 0.55 + (throttle ? 0.25 : 0)) * this.engineVolume;
    this.engineGain.gain.setTargetAtTime(this.isMuted ? 0 : targetVol, t, 0.06);

    // Tire Skid / Screech Sound
    if (isDrifting && Math.abs(speedKmh) > 15) {
      const skidVol = Math.min(0.75, (Math.abs(speedKmh) / 80) * 0.70) * this.sfxVolume;
      this.skidGain.gain.setTargetAtTime(this.isMuted ? 0 : skidVol, t, 0.05);
      const skidPitch = 1200 + Math.min(800, Math.abs(speedKmh) * 12);
      this.skidFilter.frequency.setTargetAtTime(skidPitch, t, 0.05);

      // Light haptic pulse on mobile
      if (Math.random() < 0.25 && navigator.vibrate) {
        navigator.vibrate(15);
      }
    } else {
      this.skidGain.gain.setTargetAtTime(0, t, 0.08);
    }
  }

  playGearShiftBlowOff() {
    if (!this.initialized || !this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Turbo blow-off "tsst-pop!"
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2800, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
  }

  playCrash(intensity = 1.0) {
    if (!this.initialized || !this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // 1. Low Thud (Impact Body)
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.35);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.9 * intensity * this.sfxVolume, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start();
    osc.stop(t + 0.4);

    // 2. Metal Crunch Noise Burst
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.20));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, t);
    filter.Q.setValueAtTime(1.5, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.85 * intensity * this.sfxVolume, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start();

    // Heavy haptic vibration on mobile
    if (navigator.vibrate) {
      if (intensity > 0.7) {
        navigator.vibrate([80, 40, 120]);
      } else {
        navigator.vibrate(50);
      }
    }
  }

  playRewardFanfare() {
    if (!this.initialized || !this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.4 * this.sfxVolume, t + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.1);
      osc.stop(t + idx * 0.1 + 0.38);
    });
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.setMasterVolume(this.masterVolume);
    return this.isMuted;
  }
}

window.soundEngine = new SoundEngine();
