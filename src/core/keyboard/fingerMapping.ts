import type { Finger, Hand } from "./keyboardTypes";

export const FINGER_LABELS: Record<Finger, string> = {
  "left-pinky": "Left pinky",
  "left-ring": "Left ring",
  "left-middle": "Left middle",
  "left-index": "Left index",
  "left-thumb": "Left thumb",
  "right-thumb": "Right thumb",
  "right-index": "Right index",
  "right-middle": "Right middle",
  "right-ring": "Right ring",
  "right-pinky": "Right pinky",
};

/** Token name used for finger colour coding (see styles.css --finger-*). */
export const FINGER_TOKEN: Record<Finger, string> = {
  "left-pinky": "f1",
  "left-ring": "f2",
  "left-middle": "f3",
  "left-index": "f4",
  "left-thumb": "f5",
  "right-thumb": "f5",
  "right-index": "f6",
  "right-middle": "f7",
  "right-ring": "f8",
  "right-pinky": "f9",
};

export function handOf(finger: Finger): Hand {
  return finger.startsWith("left") ? "left" : "right";
}
