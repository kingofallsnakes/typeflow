export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  targetKeys: string[];
  drills: string[];
  minAccuracy: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  lessons: Lesson[];
}

const drill = (keys: string[], words: string[]): string[] => {
  const [a = "", b = ""] = keys;
  return [
    `${a}${a}${a} ${b}${b}${b} ${a}${b} ${b}${a} ${a}${a}${b} ${b}${b}${a}`,
    `${a}${b} ${b}${a} ${a}${b}${a} ${b}${a}${b} ${a}${a} ${b}${b} ${a}${b}${b} ${b}${a}${a}`,
    words.join(" "),
  ];
};

export const ENGLISH_COURSE: Course = {
  id: "english-touch-typing",
  title: "English Touch Typing",
  description: "A structured path from home row fundamentals to fluent sentences.",
  language: "en",
  lessons: [
    {
      id: "home-fj",
      title: "F and J",
      description: "Anchor keys for both index fingers. Keep your wrists still.",
      level: "Home Row",
      targetKeys: ["f", "j"],
      drills: drill(["f", "j"], ["fj jf ffj jjf fjf jfj", "jf fj jjf ffj fjj jff"]),
      minAccuracy: 92,
    },
    {
      id: "home-dk",
      title: "D and K",
      description: "Middle fingers reach without moving the hand.",
      level: "Home Row",
      targetKeys: ["d", "k"],
      drills: drill(["d", "k"], ["dk kd dkd kdk ddk kkd", "kd dk kkd ddk dkk kdd"]),
      minAccuracy: 92,
    },
    {
      id: "home-sl",
      title: "S and L",
      description: "Ring fingers, the weakest pair. Go slow and stay accurate.",
      level: "Home Row",
      targetKeys: ["s", "l"],
      drills: drill(["s", "l"], ["sl ls sls lsl ssl lls", "as all sad lass fall sail"]),
      minAccuracy: 92,
    },
    {
      id: "home-asemi",
      title: "A and ;",
      description: "Pinky control. Do not let the hand drift.",
      level: "Home Row",
      targetKeys: ["a", ";"],
      drills: drill(["a", ";"], ["a; ;a a;a ;a; aa; ;;a", "ask lad flask salad glass"]),
      minAccuracy: 90,
    },
    {
      id: "home-combined",
      title: "Home row combinations",
      description: "All eight home keys together with real words.",
      level: "Home Row",
      targetKeys: ["a", "s", "d", "f", "j", "k", "l", ";"],
      drills: [
        "asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj",
        "dad sad lad fall flask salad glass alaska",
        "a lad had a flask; dad had a salad; all glass falls",
      ],
      minAccuracy: 93,
    },
    {
      id: "top-ei",
      title: "E and I",
      description: "First reach to the top row with the middle fingers.",
      level: "Top Row",
      targetKeys: ["e", "i"],
      drills: drill(["e", "i"], ["die lie fie kid life field skies", "idle sidekick jellied"]),
      minAccuracy: 90,
    },
    {
      id: "top-ru",
      title: "R and U",
      description: "Index finger reaches upward and returns home.",
      level: "Top Row",
      targetKeys: ["r", "u"],
      drills: drill(["r", "u"], ["run rue fur sure rural jury", "user rules ruler surf"]),
      minAccuracy: 90,
    },
    {
      id: "top-ty",
      title: "T and Y",
      description: "The long inner reaches. Watch for slow transitions.",
      level: "Top Row",
      targetKeys: ["t", "y"],
      drills: drill(["t", "y"], ["try tyre yet toy tidy salty", "trusty steady tasty style"]),
      minAccuracy: 90,
    },
    {
      id: "bottom-cvn",
      title: "C, V and N",
      description: "Bottom row control without collapsing the wrist.",
      level: "Bottom Row",
      targetKeys: ["c", "v", "n"],
      drills: drill(["c", "v"], ["can van nice cove novel vacant", "convince nuance canvas"]),
      minAccuracy: 89,
    },
    {
      id: "sentences",
      title: "Full sentences",
      description: "Everything together, with spacing and rhythm.",
      level: "Fluency",
      targetKeys: [],
      drills: [
        "the quick brown fox jumps over the lazy dog",
        "steady rhythm beats raw speed every single time",
        "small consistent sessions build durable muscle memory",
      ],
      minAccuracy: 94,
    },
  ],
};

export const COURSES: Course[] = [ENGLISH_COURSE];

export function findLesson(lessonId: string): { course: Course; lesson: Lesson } | null {
  for (const course of COURSES) {
    const lesson = course.lessons.find((item) => item.id === lessonId);
    if (lesson) return { course, lesson };
  }
  return null;
}
