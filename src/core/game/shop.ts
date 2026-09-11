export type ShopCategory = "theme" | "keyboard" | "sound" | "effect";

export interface ShopItem {
  id: string;
  category: ShopCategory;
  name: string;
  description: string;
  emoji: string;
  price: number;
  /** minimum level required before it can be bought */
  level: number;
  swatch?: string;
}

export interface ShopState {
  owned: string[];
  equipped: Record<ShopCategory, string>;
}

export const DEFAULT_EQUIPPED: Record<ShopCategory, string> = {
  theme: "theme-aurora",
  keyboard: "keys-classic",
  sound: "sound-soft",
  effect: "effect-confetti",
};

export const EMPTY_SHOP: ShopState = {
  owned: [
    "theme-aurora",
    "keys-classic",
    "sound-soft",
    "effect-confetti",
  ],
  equipped: { ...DEFAULT_EQUIPPED },
};

export const SHOP_ITEMS: ShopItem[] = [
  // Themes
  {
    id: "theme-aurora",
    category: "theme",
    name: "Aurora",
    description: "The classic TYPEFLOW glow.",
    emoji: "🌌",
    price: 0,
    level: 1,
    swatch: "linear-gradient(135deg,#6366f1,#22d3ee)",
  },
  {
    id: "theme-sunset",
    category: "theme",
    name: "Sunset Pop",
    description: "Warm orange and pink energy.",
    emoji: "🌅",
    price: 150,
    level: 2,
    swatch: "linear-gradient(135deg,#fb7185,#f59e0b)",
  },
  {
    id: "theme-mint",
    category: "theme",
    name: "Mint Rush",
    description: "Fresh green speed vibes.",
    emoji: "🍃",
    price: 220,
    level: 3,
    swatch: "linear-gradient(135deg,#34d399,#22d3ee)",
  },
  {
    id: "theme-candy",
    category: "theme",
    name: "Candy Arcade",
    description: "Bright purple arcade colours.",
    emoji: "🍬",
    price: 320,
    level: 5,
    swatch: "linear-gradient(135deg,#c084fc,#f472b6)",
  },
  // Keyboard skins
  {
    id: "keys-classic",
    category: "keyboard",
    name: "Classic keys",
    description: "Clean, calm keycaps.",
    emoji: "⌨️",
    price: 0,
    level: 1,
  },
  {
    id: "keys-neon",
    category: "keyboard",
    name: "Neon keys",
    description: "Glowing outlines on every key.",
    emoji: "💡",
    price: 180,
    level: 2,
  },
  {
    id: "keys-bubble",
    category: "keyboard",
    name: "Bubble keys",
    description: "Big, rounded, playful keycaps.",
    emoji: "🫧",
    price: 260,
    level: 4,
  },
  // Sound profiles
  {
    id: "sound-soft",
    category: "sound",
    name: "Soft taps",
    description: "Gentle, quiet key sounds.",
    emoji: "🔈",
    price: 0,
    level: 1,
  },
  {
    id: "sound-mech",
    category: "sound",
    name: "Mechanical",
    description: "Clicky mechanical keyboard sound.",
    emoji: "🎹",
    price: 140,
    level: 2,
  },
  {
    id: "sound-retro",
    category: "sound",
    name: "Retro game",
    description: "Blippy 8-bit console sounds.",
    emoji: "🕹️",
    price: 200,
    level: 3,
  },
  {
    id: "sound-bubble",
    category: "sound",
    name: "Bubbles",
    description: "Soft popping bubble sounds.",
    emoji: "🎈",
    price: 200,
    level: 3,
  },
  // Celebration effects
  {
    id: "effect-confetti",
    category: "effect",
    name: "Confetti",
    description: "Classic paper shower.",
    emoji: "🎊",
    price: 0,
    level: 1,
  },
  {
    id: "effect-stars",
    category: "effect",
    name: "Star burst",
    description: "Sparkling stars on every win.",
    emoji: "⭐",
    price: 160,
    level: 2,
  },
  {
    id: "effect-hearts",
    category: "effect",
    name: "Hearts",
    description: "Floating hearts celebration.",
    emoji: "💖",
    price: 160,
    level: 2,
  },
];

export const CATEGORY_LABEL: Record<ShopCategory, string> = {
  theme: "Themes",
  keyboard: "Keyboard skins",
  sound: "Sound packs",
  effect: "Celebrations",
};

export const itemById = (id: string): ShopItem | undefined =>
  SHOP_ITEMS.find((item) => item.id === id);

export function normalizeShop(state: Partial<ShopState> | undefined): ShopState {
  const owned = Array.from(new Set([...EMPTY_SHOP.owned, ...(state?.owned ?? [])]));
  const equipped = { ...DEFAULT_EQUIPPED, ...(state?.equipped ?? {}) };
  (Object.keys(equipped) as ShopCategory[]).forEach((category) => {
    const current = equipped[category];
    if (!owned.includes(current)) equipped[category] = DEFAULT_EQUIPPED[category];
  });
  return { owned, equipped };
}
