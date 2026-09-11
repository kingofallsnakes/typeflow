import { describe, expect, it } from "vitest";
import { TypingEngine } from "./typingEngine";
import { accuracyFrom, consistencyFrom, wpmFrom } from "./metrics";
import { classify, computeMastery, normalizedSpeed } from "../adaptive/mastery";
import { applyKeyStats, emptyProfile } from "../adaptive/skillProfile";
import { topWeakness, weakestKeys, weakestTransitions } from "../adaptive/skillSelector";
import { generateForSkill, sanitizeText } from "../adaptive/exerciseGenerator";

function type(engine: TypingEngine, text: string, startAt = 1000, step = 200) {
  let at = startAt;
  for (const char of text) {
    engine.input({ char, at });
    at += step;
  }
  return at;
}

describe("metrics", () => {
  it("uses the standard WPM formula", () => {
    expect(wpmFrom(300, 60_000)).toBeCloseTo(60);
    expect(wpmFrom(0, 60_000)).toBe(0);
    expect(wpmFrom(100, 0)).toBe(0);
  });

  it("computes accuracy and handles the empty case", () => {
    expect(accuracyFrom(9, 1)).toBeCloseTo(90);
    expect(accuracyFrom(0, 0)).toBe(100);
  });

  it("scores an even rhythm higher than a bursty one", () => {
    const even = consistencyFrom([200, 200, 200, 200, 200, 200]);
    const bursty = consistencyFrom([50, 600, 40, 900, 80, 700]);
    expect(even).toBeGreaterThan(bursty);
  });
});

describe("TypingEngine", () => {
  it("tracks correct and incorrect characters", () => {
    const engine = new TypingEngine("the");
    type(engine, "tge");
    const snapshot = engine.snapshot();
    expect(snapshot.completed).toBe(true);
    expect(snapshot.correct).toBe(2);
    expect(snapshot.incorrect).toBe(1);
    expect(snapshot.states[1]).toBe("incorrect");
  });

  it("classifies a wrong key with expected and actual characters", () => {
    const engine = new TypingEngine("the");
    type(engine, "tge");
    const wrong = engine.records().find((record) => !record.correct);
    expect(wrong?.expected).toBe("h");
    expect(wrong?.actual).toBe("g");
    expect(wrong?.errorTypes).toContain("wrong_key");
  });

  it("detects shift errors", () => {
    const engine = new TypingEngine("A");
    engine.input({ char: "a", at: 1000 });
    expect(engine.records()[0]?.errorTypes).toContain("shift_error");
  });

  it("counts backspaces and marks corrected characters", () => {
    const engine = new TypingEngine("ab");
    engine.input({ char: "x", at: 1000 });
    engine.input({ char: "Backspace", at: 1100 });
    engine.input({ char: "a", at: 1200 });
    engine.input({ char: "b", at: 1300 });
    const snapshot = engine.snapshot();
    expect(snapshot.backspaces).toBe(1);
    expect(snapshot.states[0]).toBe("corrected");
    expect(snapshot.completed).toBe(true);
  });

  it("flags hesitation on long pauses", () => {
    const engine = new TypingEngine("ab");
    engine.input({ char: "a", at: 1000 });
    engine.input({ char: "b", at: 3500 });
    expect(engine.records()[1]?.errorTypes).toContain("hesitation");
  });

  it("ignores an empty target", () => {
    const engine = new TypingEngine("");
    expect(engine.input({ char: "a", at: 1 })).toBe(false);
    expect(engine.metrics().wpm).toBe(0);
  });

  it("excludes paused time from the duration", () => {
    const engine = new TypingEngine("abcd");
    engine.input({ char: "a", at: 1000 });
    engine.pause(1200);
    engine.resume(5200);
    engine.input({ char: "b", at: 5400 });
    engine.finish(5600);
    expect(engine.elapsedMs()).toBeLessThan(1000);
  });

  it("aggregates per-key statistics", () => {
    const engine = new TypingEngine("rrr");
    engine.input({ char: "r", at: 1000 });
    engine.input({ char: "t", at: 1200 });
    engine.input({ char: "r", at: 1400 });
    const stat = engine.keyStats().find((item) => item.keyCode === "KeyR");
    expect(stat?.attempts).toBe(3);
    expect(stat?.correct).toBe(2);
    expect(stat?.incorrect).toBe(1);
  });

  it("aggregates key transitions", () => {
    const engine = new TypingEngine("rt rt");
    type(engine, "rt rt");
    const transition = engine.transitionStats().find((t) => t.from === "r" && t.to === "t");
    expect(transition?.attempts).toBe(2);
    expect(transition?.correct).toBe(2);
  });
});

describe("mastery", () => {
  it("penalises tiny sample sizes", () => {
    const few = computeMastery({
      accuracy: 100,
      averageIntervalMs: 150,
      attempts: 2,
      lastPracticedAt: Date.now(),
    });
    const many = computeMastery({
      accuracy: 100,
      averageIntervalMs: 150,
      attempts: 60,
      lastPracticedAt: Date.now(),
    });
    expect(few).toBeLessThan(many);
    expect(few).toBeLessThan(80);
  });

  it("normalises speed within bounds", () => {
    expect(normalizedSpeed(100)).toBe(100);
    expect(normalizedSpeed(900)).toBe(0);
    expect(normalizedSpeed(450)).toBeGreaterThan(0);
  });

  it("classifies skill states with a minimum attempt count", () => {
    expect(classify(95, 3)).toBe("NEEDS_PRACTICE");
    expect(classify(95, 40)).toBe("MASTERED");
    expect(classify(65, 40)).toBe("REVIEW");
    expect(classify(45, 40)).toBe("LEARNING");
    expect(classify(10, 40)).toBe("NEEDS_PRACTICE");
  });
});

describe("skill profile and selection", () => {
  it("merges session statistics into the profile", () => {
    const now = Date.now();
    const profile = applyKeyStats(
      emptyProfile(),
      [
        { keyCode: "KeyR", char: "r", attempts: 20, correct: 10, incorrect: 10, totalIntervalMs: 12000 },
        { keyCode: "KeyA", char: "a", attempts: 20, correct: 20, incorrect: 0, totalIntervalMs: 3000 },
      ],
      [{ from: "r", to: "t", attempts: 10, correct: 4, totalIntervalMs: 7000 }],
      now,
    );
    expect(profile.keys["KeyR"]?.attempts).toBe(20);
    expect(profile.keys["KeyR"]!.mastery).toBeLessThan(profile.keys["KeyA"]!.mastery);

    const weakKeys = weakestKeys(profile, 2, now);
    expect(weakKeys[0]?.char).toBe("r");

    const weakTransitions = weakestTransitions(profile, 2, now);
    expect(weakTransitions[0]?.from).toBe("r");

    const next = topWeakness(profile, now);
    expect(next).not.toBeNull();
  });
});

describe("exercise generation", () => {
  it("builds a drill containing the target skill", () => {
    const text = generateForSkill(
      {
        kind: "transition",
        from: "r",
        to: "t",
        accuracy: 50,
        averageIntervalMs: 600,
        mastery: 30,
        attempts: 20,
        priority: 90,
      },
      { level: 3, length: 120, seed: 7 },
    );
    expect(text.length).toBeGreaterThan(50);
    expect(text).toContain("rt");
  });

  it("sanitises pasted text", () => {
    expect(sanitizeText("hello\n\tworld  ✓")).toBe("hello world");
    expect(sanitizeText("x".repeat(50), 10)).toHaveLength(10);
  });
});
