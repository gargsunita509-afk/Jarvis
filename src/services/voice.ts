/**
 * JARVIS Audio & Voice Engine
 * Real Web Speech API for Recognition & Synthesis, plus synthetic Web Audio sound effects.
 */

class SoundFxEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  // Futuristic power-up reactor hum
  public playPowerUp() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      // AudioContext blocked by browser autoplay policy
    }
  }

  // JARVIS listening activation chirp
  public playListeningChirp() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  // Action executed tone
  public playAcknowledgeTone() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc2.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);
    } catch {}
  }

  // Warning / error state alert
  public playAlertTone() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.setValueAtTime(220, now + 0.1);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }
}

export const sfx = new SoundFxEngine();

export interface VoiceOption {
  name: string;
  lang: string;
  voice: SpeechSynthesisVoice;
}

class VoiceEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private onVoicesLoadedCallbacks: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      this.initRecognition();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.onVoicesLoadedCallbacks.forEach(cb => cb());
    };

    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public getAvailableVoices(): VoiceOption[] {
    return this.voices.map(v => ({
      name: `${v.name} (${v.lang})`,
      lang: v.lang,
      voice: v
    }));
  }

  public onVoicesReady(cb: () => void) {
    if (this.voices.length > 0) {
      cb();
    } else {
      this.onVoicesLoadedCallbacks.push(cb);
    }
  }

  // Pick best cinematic male voice (UK English Male, Google UK English, Daniel, or Indian English)
  public getCinematicMaleVoice(preferredName?: string, langPreference?: string): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    }

    if (preferredName) {
      const match = this.voices.find(v => v.name.toLowerCase().includes(preferredName.toLowerCase()));
      if (match) return match;
    }

    // Language prioritization if Hindi/Indian
    if (langPreference === 'Hindi' || langPreference === 'Hinglish') {
      const hindiMale = this.voices.find(v => (v.lang.includes('hi') || v.lang.includes('en-IN')) && !v.name.toLowerCase().includes('female'));
      if (hindiMale) return hindiMale;
    }

    // Priorities for JARVIS-like cinematic male voice:
    // 1. Google UK English Male
    // 2. Daniel (British)
    // 3. Microsoft George / Oliver
    // 4. Any en-GB male
    // 5. Any en male
    const ukMale = this.voices.find(v => 
      (v.lang === 'en-GB' || v.lang.startsWith('en_GB')) && 
      (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('uk'))
    );
    if (ukMale) return ukMale;

    const anyUk = this.voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en_GB'));
    if (anyUk) return anyUk;

    const generalMale = this.voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('alex'))
    );
    if (generalMale) return generalMale;

    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  // Text-To-Speech execution
  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      voiceName?: string;
      language?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      options.onEnd?.();
      return;
    }

    // Cancel any currently playing speech to support voice interruption
    this.stopSpeaking();

    // Clean text of markdown formatting before speaking
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) {
      options.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 0.95; // slightly lower pitch for cinematic authority

    const voice = this.getCinematicMaleVoice(options.voiceName, options.language);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onstart = () => {
      this.currentUtterance = utterance;
      options.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      options.onError?.(e);
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isCurrentlySpeaking(): boolean {
    return typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis.speaking : false;
  }

  // Speech Recognition (STT)
  private initRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  public startListening(
    callbacks: {
      onResult: (transcript: string, isFinal: boolean) => void;
      onError?: (err: any) => void;
      onEnd?: () => void;
    },
    lang: string = 'en-US'
  ): boolean {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      callbacks.onError?.('Speech recognition is not supported in this browser.');
      return false;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }

    // Set recognition language (en-US, en-IN, hi-IN)
    this.recognition.lang = lang === 'Hindi' ? 'hi-IN' : (lang === 'Hinglish' ? 'en-IN' : 'en-US');

    this.recognition.onstart = () => {
      this.isListening = true;
      sfx.playListeningChirp();
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        callbacks.onResult(finalTranscript.trim(), true);
      } else if (interim) {
        callbacks.onResult(interim.trim(), false);
      }
    };

    this.recognition.onerror = (e: any) => {
      this.isListening = false;
      callbacks.onError?.(e);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd?.();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      callbacks.onError?.(e);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceEngine = new VoiceEngine();
