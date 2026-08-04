import type { Operation, Difficulty } from "./math";

export interface Settings {
  difficulty: Difficulty;
  operation: Operation;
  soundOn: boolean;
  timerOn: boolean;
}

export const DEFAULT_SETTINGS: Settings = { difficulty: 1, operation: "addition", soundOn: true, timerOn: true };

const KEY = "math-hero:settings";
const bestKey = (op: Operation, d: Difficulty) => `math-hero:best:${op}:${d}`;

const DIFFICULTIES = [1, 2, 3, 4, 5] as const;
const OPS = ["addition", "subtraction", "multiplication", "division"] as const;

// Validate an untyped parsed blob - never trust localStorage.
export function parseSettings(raw: unknown): Settings {
  if (typeof raw !== "object" || raw === null) return DEFAULT_SETTINGS;
  const o = raw as Record<string, unknown>;
  const difficulty = DIFFICULTIES.includes(o.difficulty as Difficulty) ? (o.difficulty as Difficulty) : DEFAULT_SETTINGS.difficulty;
  const operation = OPS.includes(o.operation as Operation) ? (o.operation as Operation) : DEFAULT_SETTINGS.operation;
  return { difficulty, operation, soundOn: o.soundOn !== false, timerOn: o.timerOn !== false };
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? parseSettings(JSON.parse(raw)) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable */
  }
}

export function readBest(op: Operation, d: Difficulty): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(localStorage.getItem(bestKey(op, d))) || 0;
  } catch {
    return 0;
  }
}

export function writeBest(op: Operation, d: Difficulty, score: number): void {
  try {
    localStorage.setItem(bestKey(op, d), String(score));
  } catch {
    /* storage unavailable */
  }
}
