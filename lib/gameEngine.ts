import type { Hero } from "./heroes";
import type { Operation, Difficulty, Question } from "./math";
import { generateRun } from "./math.ts";

// The game as an explicit, PURE state machine. All randomness (question generation)
// happens in the buildRun factory (injectable rng); the reducer is a pure function of
// (state, action) and is fully unit-tested.

export type Screen = "selection" | "playing" | "done";
export type Phase = "asking" | "revealing";
export const TOTAL_QUESTIONS = 10;

export interface GameState {
  screen: Screen;
  hero: Hero | null;
  questions: Question[];
  index: number;
  total: number;
  correct: number;
  treasures: number;
  phase: Phase;
  picked: number | null; // the option the player chose (null on timeout)
  lastCorrect: boolean | null;
  verdict: string | null;
}

export type GameAction =
  | { type: "START"; run: GameState }
  | { type: "ANSWER"; value: number }
  | { type: "TIMEOUT" }
  | { type: "ADVANCE" }
  | { type: "HOME" };

export function idleGame(): GameState {
  return {
    screen: "selection",
    hero: null,
    questions: [],
    index: 0,
    total: 0,
    correct: 0,
    treasures: 0,
    phase: "asking",
    picked: null,
    lastCorrect: null,
    verdict: null,
  };
}

export interface RunOptions {
  rng?: () => number;
  count?: number;
}

// Build a fresh playing run for a hero + settings (impure: generates questions).
export function buildRun(hero: Hero, op: Operation, difficulty: Difficulty, opts: RunOptions = {}): GameState {
  const total = opts.count ?? TOTAL_QUESTIONS;
  return {
    ...idleGame(),
    screen: "playing",
    hero,
    questions: generateRun(op, difficulty, total, opts.rng),
    total,
    phase: "asking",
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START":
      return action.run;

    case "ANSWER": {
      if (state.screen !== "playing" || state.phase !== "asking") return state;
      const answer = state.questions[state.index].answer;
      const correct = action.value === answer;
      return {
        ...state,
        phase: "revealing",
        picked: action.value,
        lastCorrect: correct,
        correct: state.correct + (correct ? 1 : 0),
        treasures: state.treasures + (correct ? 1 : 0),
        verdict: correct ? "Correct!" : `The answer was ${answer}`,
      };
    }

    case "TIMEOUT": {
      if (state.screen !== "playing" || state.phase !== "asking") return state;
      const answer = state.questions[state.index].answer;
      return {
        ...state,
        phase: "revealing",
        picked: null,
        lastCorrect: false,
        verdict: `Time's up - the answer was ${answer}`,
      };
    }

    case "ADVANCE": {
      if (state.screen !== "playing" || state.phase !== "revealing") return state;
      const next = state.index + 1;
      if (next >= state.total) {
        return { ...state, screen: "done", phase: "asking", picked: null, lastCorrect: null, verdict: null };
      }
      return { ...state, index: next, phase: "asking", picked: null, lastCorrect: null, verdict: null };
    }

    case "HOME":
      return idleGame();

    default:
      return state;
  }
}
