export type BgmTrack = 'NONE' | 'FIGHT' | 'SHOP';

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentBgmTrack: BgmTrack = 'NONE';
  private fightAudio: HTMLAudioElement | null = null;
  private shopAudio: HTMLAudioElement | null = null;
  private musicVolume: number = 0.35;
  private isMusicMuted: boolean = false;
  private userInteracted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAllBgm();
    } else if (this.currentBgmTrack !== 'NONE') {
      this.applyBgmTrack(this.currentBgmTrack);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private initBgm() {
    if (typeof window === 'undefined') return;
    if (!this.fightAudio) {
      try {
        this.fightAudio = new Audio('/src/assets/sound/fight_music.mp3');
        this.fightAudio.loop = true;
        this.fightAudio.volume = this.musicVolume;
      } catch {
        // Fallback
      }
    }
    if (!this.shopAudio) {
      try {
        this.shopAudio = new Audio('/src/assets/sound/shop.mp3');
        this.shopAudio.loop = true;
        this.shopAudio.volume = this.musicVolume;
      } catch {
        // Fallback
      }
    }

    if (!this.userInteracted) {
      const handleFirstInteraction = () => {
        this.userInteracted = true;
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        if (this.currentBgmTrack !== 'NONE') {
          this.applyBgmTrack(this.currentBgmTrack);
        }
      };
      window.addEventListener('click', handleFirstInteraction, { once: true });
      window.addEventListener('keydown', handleFirstInteraction, { once: true });
    }
  }

  public playBgm(track: BgmTrack) {
    this.initBgm();
    this.currentBgmTrack = track;
    this.applyBgmTrack(track);
  }

  private applyBgmTrack(track: BgmTrack) {
    if (this.isMuted || this.isMusicMuted) {
      this.stopAllBgm();
      return;
    }

    if (track === 'FIGHT') {
      if (this.shopAudio) {
        this.shopAudio.pause();
        this.shopAudio.currentTime = 0;
      }
      if (this.fightAudio) {
        this.fightAudio.volume = this.musicVolume;
        this.fightAudio.play().catch(() => {});
      }
    } else if (track === 'SHOP') {
      if (this.fightAudio) {
        this.fightAudio.pause();
        this.fightAudio.currentTime = 0;
      }
      if (this.shopAudio) {
        this.shopAudio.volume = this.musicVolume;
        this.shopAudio.play().catch(() => {});
      }
    } else {
      this.stopAllBgm();
    }
  }

  public stopAllBgm() {
    if (this.fightAudio) {
      this.fightAudio.pause();
      this.fightAudio.currentTime = 0;
    }
    if (this.shopAudio) {
      this.shopAudio.pause();
      this.shopAudio.currentTime = 0;
    }
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.fightAudio) this.fightAudio.volume = this.musicVolume;
    if (this.shopAudio) this.shopAudio.volume = this.musicVolume;
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  private sfxVolume: number = 0.7;

  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public getCurrentBgmTrack(): BgmTrack {
    return this.currentBgmTrack;
  }

  /**
   * Sword Slash / Physical Attack sound
   */
  public playAttack() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  /**
   * Magic Spell Evocation sound (Fireball, Frost Nova, Lightning)
   */
  public playMagicSpell() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  /**
   * Holy Heal chime sound
   */
  public playHeal() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25]; // A4, C#5, E5
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + index * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /**
   * Critical Hit heavy impact sound
   */
  public playCriticalHit() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  /**
   * Shield Guard / Defense sound
   */
  public playDefend() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  }

  /**
   * Victory fanfare sound
   */
  public playVictory() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + index * 0.12;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  /**
   * Defeat gloom sound
   */
  public playDefeat() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  /**
   * Button click sound
   */
  public playClick() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  /**
   * Card Draw / Deck Shuffle Whoosh
   */
  public playCardDraw() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Filtered noise swoosh
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  /**
   * Card Play specialized by category: ATTACK, SKILL, POWER
   */
  public playCardPlay(cardType: 'ATTACK' | 'SKILL' | 'POWER') {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (cardType === 'ATTACK') {
      this.playAttack();
    } else if (cardType === 'SKILL') {
      // Metallic resonant clank
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.24, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } else {
      // Power / Enchantment shimmer
      const chord = [392.0, 587.33, 880.0]; // G4, D5, A5
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const st = ctx.currentTime + idx * 0.04;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, st);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, st + 0.28);

        gain.gain.setValueAtTime(0.18, st);
        gain.gain.exponentialRampToValueAtTime(0.01, st + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(st);
        osc.stop(st + 0.3);
      });
    }
  }

  /**
   * Turn Transition Gong / Bell
   */
  public playTurnStart() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3 gong
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.45);

    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  /**
   * Shield Shatter / Break Sound
   */
  public playShieldBreak() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(800, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1200, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.22);
    osc2.stop(ctx.currentTime + 0.22);
  }

  /**
   * Status effect tick (Poison, Burn, Bleed, Frost)
   */
  public playStatusTick(type: 'POISON' | 'BURNING' | 'BLEEDING' | 'CORROSION' | 'FROST') {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'POISON' || type === 'CORROSION') {
      // Sizzling acid bubble
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    } else if (type === 'BURNING') {
      // Crackle
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    } else {
      // Bleed slice
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  /**
   * Gold Coin Jingle
   */
  public playCoinJingle() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [987.77, 1318.51]; // B5, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = ctx.currentTime + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0.18, st);
      gain.gain.exponentialRampToValueAtTime(0.01, st + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.18);
    });
  }

  /**
   * Enemy intent windup cue for high threat moves
   */
  public playEnemyWindup() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  /**
   * Enemy Death Explosion Sound (explosion.wav with procedural fallback)
   */
  public playExplosion() {
    if (this.isMuted) return;
    try {
      const audio = new Audio('/src/assets/sound/explosion.wav');
      audio.volume = 0.7 * this.sfxVolume;
      audio.play().catch(() => {
        this.playProceduralExplosion();
      });
      return;
    } catch {
      this.playProceduralExplosion();
    }
  }

  private playProceduralExplosion() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  /**
   * Footsteps Walking Transition Sound (walk.wav with procedural fallback)
   */
  public playWalk() {
    if (this.isMuted) return;
    try {
      const audio = new Audio('/src/assets/sound/walk.wav');
      audio.volume = 0.6 * this.sfxVolume;
      audio.play().catch(() => {
        this.playProceduralWalk();
      });
      return;
    } catch {
      this.playProceduralWalk();
    }
  }

  private playProceduralWalk() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    [0, 0.25, 0.5, 0.75].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = ctx.currentTime + offset;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, st);
      osc.frequency.exponentialRampToValueAtTime(55, st + 0.12);

      gain.gain.setValueAtTime(0.15 * this.sfxVolume, st);
      gain.gain.exponentialRampToValueAtTime(0.01, st + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.12);
    });
  }
}

export const soundFx = new SoundSystem();
