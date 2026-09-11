export interface AiCategory {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  /** extra guidance for the writer */
  prompt: string;
  topics: string[];
}

export const AI_CATEGORIES: AiCategory[] = [
  {
    id: "animals",
    label: "Animals",
    emoji: "🦁",
    blurb: "Fun facts about creatures big and small.",
    prompt: "playful, kid-friendly facts about animals",
    topics: ["Lions", "Dolphins", "Penguins", "Dinosaurs", "Insects", "Pets"],
  },
  {
    id: "space",
    label: "Space",
    emoji: "🚀",
    blurb: "Planets, rockets and the stars.",
    prompt: "exciting facts about space, planets and astronauts",
    topics: ["Mars", "Black holes", "The Moon", "Rockets", "Stars", "Astronauts"],
  },
  {
    id: "stories",
    label: "Stories",
    emoji: "📖",
    blurb: "Short adventures and fairy tales.",
    prompt: "a very short original adventure story with a clear beginning and end",
    topics: ["Pirates", "Dragons", "A robot friend", "Lost treasure", "A magic school"],
  },
  {
    id: "jokes",
    label: "Jokes & riddles",
    emoji: "😂",
    blurb: "Silly one-liners to keep you smiling.",
    prompt: "clean, silly jokes and riddles suitable for children",
    topics: ["Animal jokes", "School jokes", "Riddles", "Knock knock", "Puns"],
  },
  {
    id: "science",
    label: "Science",
    emoji: "🔬",
    blurb: "How the world actually works.",
    prompt: "clear, simple science explanations",
    topics: ["Weather", "The human body", "Volcanoes", "Electricity", "Oceans"],
  },
  {
    id: "history",
    label: "History",
    emoji: "🏛️",
    blurb: "People and events worth remembering.",
    prompt: "engaging historical facts told simply",
    topics: ["Ancient Egypt", "Explorers", "Inventions", "Castles", "Olympics"],
  },
  {
    id: "sports",
    label: "Sports",
    emoji: "⚽",
    blurb: "Games, teams and record breakers.",
    prompt: "energetic sports facts and moments",
    topics: ["Football", "Cricket", "Basketball", "Swimming", "Athletics"],
  },
  {
    id: "gaming",
    label: "Gaming",
    emoji: "🎮",
    blurb: "Game worlds, characters and tips.",
    prompt: "gaming-themed text about game worlds, characters and strategies (no brand copying)",
    topics: ["Puzzle games", "Racing", "Adventure", "Esports", "Game design"],
  },
  {
    id: "coding",
    label: "Coding",
    emoji: "💻",
    blurb: "Programming words and symbols.",
    prompt: "beginner programming explanations using common code words and symbols",
    topics: ["Variables", "Loops", "Functions", "HTML", "Debugging"],
  },
  {
    id: "numbers",
    label: "Numbers & symbols",
    emoji: "🔢",
    blurb: "Digits, punctuation and special keys.",
    prompt: "sentences that naturally include plenty of digits, punctuation and symbols",
    topics: ["Prices", "Dates", "Measurements", "Maths facts", "Addresses"],
  },
  {
    id: "quotes",
    label: "Quotes",
    emoji: "💬",
    blurb: "Short motivating lines.",
    prompt: "short original motivational lines about learning and effort",
    topics: ["Practice", "Courage", "Friendship", "Curiosity", "Patience"],
  },
  {
    id: "nature",
    label: "Nature",
    emoji: "🌳",
    blurb: "Forests, oceans and weather.",
    prompt: "vivid but simple descriptions of nature",
    topics: ["Rainforests", "Deserts", "Rivers", "Mountains", "Seasons"],
  },
  {
    id: "food",
    label: "Food",
    emoji: "🍕",
    blurb: "Recipes, snacks and flavours.",
    prompt: "tasty descriptions of food and simple recipes",
    topics: ["Pizza", "Fruit", "Baking", "World food", "Healthy snacks"],
  },
  {
    id: "music",
    label: "Music",
    emoji: "🎵",
    blurb: "Instruments, rhythm and sound.",
    prompt: "friendly writing about music, instruments and rhythm",
    topics: ["Drums", "Guitar", "Orchestra", "Singing", "Rhythm"],
  },
];

export const DIFFICULTIES = [
  { id: "easy", label: "Easy", hint: "short common words, lowercase, no punctuation" },
  { id: "medium", label: "Medium", hint: "normal sentences with commas and full stops" },
  { id: "hard", label: "Hard", hint: "longer words, capitals, punctuation and numbers" },
  { id: "expert", label: "Expert", hint: "complex vocabulary, symbols, numbers and mixed casing" },
] as const;

export const LENGTHS = [
  { id: "short", label: "Short", chars: 180 },
  { id: "medium", label: "Medium", chars: 380 },
  { id: "long", label: "Long", chars: 700 },
] as const;

export type DifficultyId = (typeof DIFFICULTIES)[number]["id"];
export type LengthId = (typeof LENGTHS)[number]["id"];
