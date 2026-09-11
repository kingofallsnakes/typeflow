import type { KeyDefinition, KeyboardLayout, KeyTarget } from "./keyboardTypes";

const k = (
  keyCode: string,
  label: string,
  shiftLabel: string | undefined,
  row: number,
  column: number,
  finger: KeyDefinition["finger"],
  width?: number,
): KeyDefinition => ({
  keyCode,
  label,
  shiftLabel,
  row,
  column,
  finger,
  hand: finger.startsWith("left") ? "left" : "right",
  width,
});

const numberRow: KeyDefinition[] = [
  k("Backquote", "`", "~", 0, 0, "left-pinky"),
  k("Digit1", "1", "!", 0, 1, "left-pinky"),
  k("Digit2", "2", "@", 0, 2, "left-ring"),
  k("Digit3", "3", "#", 0, 3, "left-middle"),
  k("Digit4", "4", "$", 0, 4, "left-index"),
  k("Digit5", "5", "%", 0, 5, "left-index"),
  k("Digit6", "6", "^", 0, 6, "right-index"),
  k("Digit7", "7", "&", 0, 7, "right-index"),
  k("Digit8", "8", "*", 0, 8, "right-middle"),
  k("Digit9", "9", "(", 0, 9, "right-ring"),
  k("Digit0", "0", ")", 0, 10, "right-pinky"),
  k("Minus", "-", "_", 0, 11, "right-pinky"),
  k("Equal", "=", "+", 0, 12, "right-pinky"),
  k("Backspace", "⌫", undefined, 0, 13, "right-pinky", 2),
];

const topRow: KeyDefinition[] = [
  k("Tab", "⇥", undefined, 1, 0, "left-pinky", 1.5),
  k("KeyQ", "q", "Q", 1, 1, "left-pinky"),
  k("KeyW", "w", "W", 1, 2, "left-ring"),
  k("KeyE", "e", "E", 1, 3, "left-middle"),
  k("KeyR", "r", "R", 1, 4, "left-index"),
  k("KeyT", "t", "T", 1, 5, "left-index"),
  k("KeyY", "y", "Y", 1, 6, "right-index"),
  k("KeyU", "u", "U", 1, 7, "right-index"),
  k("KeyI", "i", "I", 1, 8, "right-middle"),
  k("KeyO", "o", "O", 1, 9, "right-ring"),
  k("KeyP", "p", "P", 1, 10, "right-pinky"),
  k("BracketLeft", "[", "{", 1, 11, "right-pinky"),
  k("BracketRight", "]", "}", 1, 12, "right-pinky"),
  k("Backslash", "\\", "|", 1, 13, "right-pinky", 1.5),
];

const homeRow: KeyDefinition[] = [
  k("CapsLock", "caps", undefined, 2, 0, "left-pinky", 1.8),
  k("KeyA", "a", "A", 2, 1, "left-pinky"),
  k("KeyS", "s", "S", 2, 2, "left-ring"),
  k("KeyD", "d", "D", 2, 3, "left-middle"),
  k("KeyF", "f", "F", 2, 4, "left-index"),
  k("KeyG", "g", "G", 2, 5, "left-index"),
  k("KeyH", "h", "H", 2, 6, "right-index"),
  k("KeyJ", "j", "J", 2, 7, "right-index"),
  k("KeyK", "k", "K", 2, 8, "right-middle"),
  k("KeyL", "l", "L", 2, 9, "right-ring"),
  k("Semicolon", ";", ":", 2, 10, "right-pinky"),
  k("Quote", "'", '"', 2, 11, "right-pinky"),
  k("Enter", "⏎", undefined, 2, 12, "right-pinky", 2.2),
];

const bottomRow: KeyDefinition[] = [
  k("ShiftLeft", "⇧", undefined, 3, 0, "left-pinky", 2.4),
  k("KeyZ", "z", "Z", 3, 1, "left-pinky"),
  k("KeyX", "x", "X", 3, 2, "left-ring"),
  k("KeyC", "c", "C", 3, 3, "left-middle"),
  k("KeyV", "v", "V", 3, 4, "left-index"),
  k("KeyB", "b", "B", 3, 5, "left-index"),
  k("KeyN", "n", "N", 3, 6, "right-index"),
  k("KeyM", "m", "M", 3, 7, "right-index"),
  k("Comma", ",", "<", 3, 8, "right-middle"),
  k("Period", ".", ">", 3, 9, "right-ring"),
  k("Slash", "/", "?", 3, 10, "right-pinky"),
  k("ShiftRight", "⇧", undefined, 3, 11, "right-pinky", 2.6),
];

const spaceRow: KeyDefinition[] = [k("Space", " ", undefined, 4, 0, "right-thumb", 10)];

export const US_QWERTY: KeyboardLayout = {
  code: "us-qwerty",
  name: "US QWERTY",
  language: "en",
  rows: [numberRow, topRow, homeRow, bottomRow, spaceRow],
};

export const LAYOUTS: KeyboardLayout[] = [US_QWERTY];

export function getLayout(code: string): KeyboardLayout {
  return LAYOUTS.find((l) => l.code === code) ?? US_QWERTY;
}

const charIndex = new Map<string, KeyTarget>();

for (const row of US_QWERTY.rows) {
  for (const key of row) {
    if (key.label && key.label.length === 1 && !charIndex.has(key.label)) {
      charIndex.set(key.label, {
        keyCode: key.keyCode,
        shiftRequired: false,
        finger: key.finger,
        hand: key.hand,
      });
    }
    if (key.shiftLabel && key.shiftLabel.length === 1 && !charIndex.has(key.shiftLabel)) {
      charIndex.set(key.shiftLabel, {
        keyCode: key.keyCode,
        shiftRequired: true,
        finger: key.finger,
        hand: key.hand,
      });
    }
  }
}

/** Resolve which physical key + modifier produces a character. */
export function targetForChar(char: string): KeyTarget | undefined {
  return charIndex.get(char);
}

export function allKeyDefinitions(layout: KeyboardLayout = US_QWERTY): KeyDefinition[] {
  return layout.rows.flat();
}

export function keyDefinitionByCode(code: string): KeyDefinition | undefined {
  return allKeyDefinitions().find((key) => key.keyCode === code);
}
