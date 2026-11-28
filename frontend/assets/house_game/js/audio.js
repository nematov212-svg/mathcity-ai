/**
 * MathCity AI — 3D House Game Audio Synthesizer (Web Audio API)
 * Zero external audio files, 100% offline procedural sound generation.
 * Supports lazy initialization on user gesture (autoplay policy compliance),
 * graceful fallback to NullSoundFx if Web Audio API is unavailable.
 */

class NullSoundFx {
  constructor() {
    this.enabled = false;
    this.isMuted = true;
  }
  initAudioContext() {}
  ensureContextRunning() {}
  setEnabled() {}
  setMuted() {}
  play() {}
  playBuildKnock() {}
  playPlaceSuccess() {}
  playCoinChime() {}
  playFanfare() {}
  playErrorThud() {}
}

class HouseSoundFx {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.isMuted = false;
    this._userInteracted = false;
    this._bindUserGesture();
  }

  _bindUserGesture() {
    if (typeof window === 'undefined') return;
    const resumeOnGesture = () => {
      this._userInteracted = true;
      this.ensureContextRunning();
      window.removeEventListener('pointerdown', resumeOnGesture);
      window.removeEventListener('keydown', resumeOnGesture);
      window.removeEventListener('touchstart', resumeOnGesture);
    };
    window.addEventListener('pointerdown', resumeOnGesture, { passive: true });
    window.addEventListener('keydown', resumeOnGesture, { passive: true });
    window.addEventListener('touchstart', resumeOnGesture, { passive: true });
  }

  initAudioContext() {
    if (this.ctx) return;
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  ensureContextRunning() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setEnabled(val) {
    this.enabled = !!val;
  }

  setMuted(val) {
    this.isMuted = !!val;
    this.enabled = !this.isMuted;
  }

  play() {
    this.playPlaceSuccess();
  }

  /**
   * Classic wooden / brick construction knock ("tak-tak")
   */
  playBuildKnock() {
    if (!this.enabled || this.isMuted) return;
    try {
      this.ensureContextRunning();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this._playSingleTap(now, 260, 0.08);
      this._playSingleTap(now + 0.09, 340, 0.07);
    } catch (e) {
      console.warn('Audio playBuildKnock failed:', e);
    }
  }

  _playSingleTap(startTime, frequency, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, startTime);
    osc.frequency.exponentialRampToValueAtTime(80, startTime + duration);

    gain.gain.setValueAtTime(0.4, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Joyful pop sound when item / stage placed
   */
  playPlaceSuccess() {
    if (!this.enabled || this.isMuted) return;
    try {
      this.ensureContextRunning();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn('Audio playPlaceSuccess failed:', e);
    }
  }

  /**
   * Coin / purchase chime
   */
  playCoinChime() {
    if (!this.enabled || this.isMuted) return;
    try {
      this.ensureContextRunning();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [987.77, 1318.51]; // B5, E6
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch (e) {
      console.warn('Audio playCoinChime failed:', e);
    }
  }

  /**
   * Celebration fanfare when house stage completes
   */
  playFanfare() {
    if (!this.enabled || this.isMuted) return;
    try {
      this.ensureContextRunning();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch (e) {
      console.warn('Audio playFanfare failed:', e);
    }
  }

  /**
   * Error thud when action is blocked
   */
  playErrorThud() {
    if (!this.enabled || this.isMuted) return;
    try {
      this.ensureContextRunning();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.18);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      console.warn('Audio playErrorThud failed:', e);
    }
  }
}

// Global window registration and backward compatibility
if (typeof window !== 'undefined') {
  window.HouseSoundFx = HouseSoundFx;
  window.NullSoundFx = NullSoundFx;
  window.SoundEffects = HouseSoundFx; // Legacy fallback

  try {
    window.soundFx = new HouseSoundFx();
  } catch (err) {
    console.warn('SoundFx init failed, using NullSoundFx:', err);
    window.soundFx = new NullSoundFx();
  }
}

// CommonJS export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HouseSoundFx, NullSoundFx };
}
