// Pure math-question generation. All randomness is an injectable rng (default
// Math.random) so questions are deterministic and unit-testable.

export type Operation = "addition" | "subtraction" | "multiplication" | "division";
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Question {
  prompt: string;
  answer: number;
  options: number[]; // 4 choices including the answer
}

export const OPERATIONS: { id: Operation; symbol: string; label: string }[] = [
  { id: "addition", symbol: "+", label: "Addition" },
  { id: "subtraction", symbol: "-", label: "Subtraction" },
  { id: "multiplication", symbol: "x", label: "Multiplication" },
  { id: "division", symbol: "/", label: "Division" },
];

// Addition/subtraction operand range, and the multiplication/division factor range -
// both scale with difficulty so every tier is genuinely harder for every operation.
const MAX_BY_DIFFICULTY: Record<Difficulty, number> = { 1: 10, 2: 20, 3: 50, 4: 100, 5: 200 };
const FACTOR_MAX_BY_DIFFICULTY: Record<Difficulty, number> = { 1: 5, 2: 9, 3: 12, 4: 16, 5: 20 };

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 4 distinct positive options including `answer`: nearby distractors, padded upward
// if the answer is too small to find 3 distinct neighbours.
export function buildOptions(answer: number, rng: () => number): number[] {
  const opts = [answer];
  let guard = 0;
  while (opts.length < 4 && guard++ < 50) {
    const w = answer + (Math.floor(rng() * 11) - 5);
    if (w > 0 && !opts.includes(w)) opts.push(w);
  }
  let pad = answer + 1;
  while (opts.length < 4) {
    if (!opts.includes(pad)) opts.push(pad);
    pad++;
  }
  return shuffle(opts, rng);
}

export function generateQuestion(op: Operation, difficulty: Difficulty, rng: () => number = Math.random): Question {
  const max = MAX_BY_DIFFICULTY[difficulty];
  const upTo = (n: number) => Math.floor(rng() * n) + 1;
  let n1: number;
  let n2: number;
  let answer: number;
  let symbol: string;

  switch (op) {
    case "addition":
      n1 = upTo(max);
      n2 = upTo(max);
      answer = n1 + n2;
      symbol = "+";
      break;
    case "subtraction": {
      // Keep it non-negative: answer + n2 = n1.
      answer = upTo(max);
      n2 = upTo(max);
      n1 = answer + n2;
      symbol = "-";
      break;
    }
    case "multiplication": {
      const f = FACTOR_MAX_BY_DIFFICULTY[difficulty];
      n1 = upTo(f);
      n2 = upTo(f);
      answer = n1 * n2;
      symbol = "x";
      break;
    }
    case "division":
    default: {
      const f = FACTOR_MAX_BY_DIFFICULTY[difficulty];
      n2 = upTo(f);
      answer = upTo(f);
      n1 = n2 * answer; // exact division
      symbol = "/";
      break;
    }
  }

  return { prompt: `${n1} ${symbol} ${n2} = ?`, answer, options: buildOptions(answer, rng) };
}

// A full run of `count` questions for the chosen operation + difficulty.
export function generateRun(op: Operation, difficulty: Difficulty, count: number, rng: () => number = Math.random): Question[] {
  return Array.from({ length: count }, () => generateQuestion(op, difficulty, rng));
}
