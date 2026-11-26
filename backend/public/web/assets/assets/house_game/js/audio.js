/**
 * MathCity AI — 3D House Game Audio Synthesizer (Web Audio API)
 * Zero external audio files, 100% offline procedural sound generation.
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  ensureContextRunning() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setEnabled(val) {
    this.enabled = !!val;
  }

  /**
   * Classic wooden / brick construction knock ("tak-tak")
   */
  playBuildKnock() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContextRunning();

    const now = this.ctx.currentTime;

    // First knock
    this._playSingleTap(now, 260, 0.08);
    // Second knock
    this._playSingleTap(now + 0.09, 340, 0.07);
  }

  _playSingleTap(startTime, frequency, duration) {
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
   * Joyful pop sound when placed
   */
  playPlaceSuccess() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContextRunning();

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
  }

  /**
   * Coin / Sell chime
   */
  playCoinChime() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContextRunning();

    const now = this.ctx.currentTime;
    const notes = [987.77, 1318.51]; // B5, E6

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  /**
   * Error thud when placement rule is violated
   */
  playErrorThud() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContextRunning();

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
  }
}

window.soundFx = new SoundEffects();
