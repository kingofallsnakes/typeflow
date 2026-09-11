import type { WeakSkill } from "./skillSelector";

const WORD_BANK = [
  "the","and","for","are","but","not","you","all","any","can","her","was","one","our","out","day",
  "get","has","him","his","how","man","new","now","old","see","two","way","who","boy","did","its",
  "let","put","say","she","too","use","tree","train","treat","street","start","short","threat",
  "great","after","again","about","above","water","world","house","light","music","north","point",
  "power","right","sound","think","three","under","until","white","whole","write","young","brown",
  "quick","jumps","lazy","river","stone","field","paper","cloud","green","dream","frame","grade",
];

const SENTENCES = [
  "the quick brown fox jumps over the lazy dog",
  "practice makes progress when you focus on the right skill",
  "steady rhythm beats raw speed every single time",
  "your fingers learn what your eyes stop watching",
  "small consistent sessions build durable muscle memory",
];

function pick<T>(items: T[], count: number, seed: number): T[] {
  const out: T[] = [];
  let state = seed % 2147483647 || 1;
  for (let i = 0; i < count; i += 1) {
    state = (state * 16807) % 2147483647;
    out.push(items[state % items.length] as T);
  }
  return out;
}

function wordsContaining(fragment: string, limit: number, seed: number): string[] {
  const matches = WORD_BANK.filter((word) => word.includes(fragment));
  if (matches.length === 0) return pick(WORD_BANK, limit, seed);
  return pick(matches, limit, seed);
}

export interface GenerateOptions {
  /** 1-9, see difficulty ladder */
  level?: number;
  /** approximate character count */
  length?: number;
  seed?: number;
}

/** Build a drill focused on a weak key or transition, ramping in complexity. */
export function generateForSkill(skill: WeakSkill, options: GenerateOptions = {}): string {
  const level = options.level ?? 4;
  const length = options.length ?? 220;
  const seed = options.seed ?? Date.now();
  const fragment = skill.kind === "key" ? skill.char : `${skill.from}${skill.to}`;
  const reverse = skill.kind === "key" ? skill.char : `${skill.to}${skill.from}`;

  const chunks: string[] = [];
  if (level <= 2) {
    chunks.push(fragment.repeat(3), fragment.repeat(4), fragment, fragment.repeat(2));
  } else if (level <= 4) {
    chunks.push(fragment, reverse, `${fragment}${reverse}`, fragment.repeat(2), reverse);
  }
  const words = wordsContaining(fragment, 24, seed);
  chunks.push(...words);

  let text = chunks.join(" ");
  if (level >= 6) {
    text = `${text} ${pick(SENTENCES, 2, seed).join(" ")}`;
  }
  while (text.length < length) {
    text += ` ${wordsContaining(fragment, 8, seed + text.length).join(" ")}`;
  }
  return text.slice(0, length).trim();
}

export function generateSpeedText(length = 300, seed = Date.now()): string {
  let text = pick(SENTENCES, 4, seed).join(". ");
  while (text.length < length) text += `. ${pick(SENTENCES, 2, seed + text.length).join(". ")}`;
  return text.slice(0, length).trim();
}

export function generateAccuracyText(length = 260, seed = Date.now()): string {
  const words = pick(WORD_BANK, 80, seed);
  let text = words.join(" ");
  const punctuated = text
    .split(" ")
    .map((word, index) => (index % 7 === 6 ? `${word},` : word))
    .join(" ");
  text = punctuated;
  while (text.length < length) text += ` ${pick(WORD_BANK, 20, seed + text.length).join(" ")}`;
  return text.slice(0, length).trim();
}

export function generateTestText(length = 900, seed = Date.now()): string {
  const words = pick(WORD_BANK, Math.ceil(length / 4), seed);
  return words.join(" ").slice(0, length).trim();
}

export function sanitizeText(input: string, max = 5000): string {
  return input
    .replace(/[\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim()
    .slice(0, max);
}
