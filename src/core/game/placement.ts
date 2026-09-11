import { COURSES } from "@/data/curriculum";

export interface PlacementResult {
  wpm: number;
  accuracy: number;
  /** index of the first lesson unlocked for the learner */
  unlockedUpTo: number;
  stage: string;
  completedAt: number;
}

export const EMPTY_PLACEMENT: Partial<PlacementResult> = {};

export const PLACEMENT_TEXT =
  "the quick brown fox jumps over a lazy dog while eight red kites fly high above the calm river and a small child laughs at the bright yellow balloon drifting past";

export const allLessons = () => COURSES.flatMap((course) => course.lessons);

export function gradePlacement(wpm: number, accuracy: number): { unlockedUpTo: number; stage: string } {
  const lessons = allLessons();
  const score = accuracy < 80 ? 0 : wpm;
  if (score < 12) return { unlockedUpTo: Math.min(3, lessons.length), stage: "Beginner" };
  if (score < 25) return { unlockedUpTo: Math.min(6, lessons.length), stage: "Getting started" };
  if (score < 40) return { unlockedUpTo: Math.min(10, lessons.length), stage: "Improver" };
  if (score < 60) return { unlockedUpTo: Math.min(14, lessons.length), stage: "Confident" };
  return { unlockedUpTo: lessons.length, stage: "Advanced" };
}

/** How many lessons the learner may open: placement grant, plus one past their progress. */
export function unlockedCount(
  placement: Partial<PlacementResult> | undefined,
  completedIds: string[],
): number {
  const lessons = allLessons();
  const fromPlacement = placement?.unlockedUpTo ?? 3;
  const completed = lessons.filter((lesson) => completedIds.includes(lesson.id)).length;
  return Math.min(lessons.length, Math.max(fromPlacement, completed + 1));
}

export function nextLessonId(
  placement: Partial<PlacementResult> | undefined,
  completedIds: string[],
): string {
  const lessons = allLessons();
  const open = unlockedCount(placement, completedIds);
  const next = lessons.slice(0, open).find((lesson) => !completedIds.includes(lesson.id));
  return (next ?? lessons[Math.min(open, lessons.length) - 1] ?? lessons[0])!.id;
}
