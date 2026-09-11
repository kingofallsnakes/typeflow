export type Hand = "left" | "right";

export type Finger =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "left-thumb"
  | "right-thumb"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky";

export interface KeyDefinition {
  /** Physical key code, e.g. "KeyF", "Semicolon", "Space" */
  keyCode: string;
  /** Unshifted character produced, if any */
  label: string;
  /** Shifted character produced, if any */
  shiftLabel?: string | undefined;
  row: number;
  column: number;
  /** Relative width unit (1 = standard key) */
  width?: number | undefined;
  finger: Finger;
  hand: Hand;
}

export interface KeyboardLayout {
  code: string;
  name: string;
  language: string;
  rows: KeyDefinition[][];
}

export interface KeyTarget {
  keyCode: string;
  shiftRequired: boolean;
  finger: Finger;
  hand: Hand;
}
