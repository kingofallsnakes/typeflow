/** Tiny WebAudio sound engine — no assets, no dependencies. */

let context: AudioContext | null = null;
let enabled = false;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

export type SoundProfileId = "sound-soft" | "sound-mech" | "sound-retro" | "sound-bubble";

interface Profile {
  keyType: OscillatorType;
  keyFreq: number;
  keyMs: number;
  gain: number;
}

const PROFILES: Record<SoundProfileId, Profile> = {
  "sound-soft": { keyType: "triangle", keyFreq: 420, keyMs: 45, gain: 0.05 },
  "sound-mech": { keyType: "square", keyFreq: 220, keyMs: 28, gain: 0.045 },
  "sound-retro": { keyType: "square", keyFreq: 660, keyMs: 55, gain: 0.05 },
  "sound-bubble": { keyType: "sine", keyFreq: 520, keyMs: 70, gain: 0.07 },
};

let profile: Profile = PROFILES["sound-soft"];

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

export function setSoundProfile(id: string): void {
  profile = PROFILES[id as SoundProfileId] ?? PROFILES["sound-soft"];
}

function tone(frequency: number, durationMs: number, type: OscillatorType, gain: number): void {
  if (!enabled) return;
  const audio = ctx();
  if (!audio) return;
  const oscillator = audio.createOscillator();
  const volume = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
  volume.gain.setValueAtTime(gain, audio.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + durationMs / 1000);
  oscillator.connect(volume).connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + durationMs / 1000);
}

export const sfx = {
  key: () =>
    tone(
      profile.keyFreq + Math.random() * 60,
      profile.keyMs,
      profile.keyType,
      profile.gain,
    ),
  error: () => tone(150, 120, "sawtooth", 0.06),
  levelUp: () => {
    [523, 659, 784, 1046].forEach((frequency, index) =>
      window.setTimeout(() => tone(frequency, 220, "triangle", 0.08), index * 90),
    );
  },
  reward: () => {
    [660, 880].forEach((frequency, index) =>
      window.setTimeout(() => tone(frequency, 180, "sine", 0.07), index * 110),
    );
  },
  badge: () => {
    [784, 988, 1318].forEach((frequency, index) =>
      window.setTimeout(() => tone(frequency, 260, "sine", 0.07), index * 120),
    );
  },
};
