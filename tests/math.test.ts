import { test } from "node:test";
import assert from "node:assert/strict";
import { generateQuestion, buildOptions, generateRun, type Operation } from "../lib/math.ts";

// Cycle through fixed values so questions are reproducible.
function seq(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

// Verify the prompt's arithmetic actually equals the stated answer.
function checkMath(prompt: string, answer: number) {
  const m = prompt.match(/^(\d+)\s*([+\-x/])\s*(\d+)\s*=/);
  assert.ok(m, `unparseable prompt: ${prompt}`);
  const [, aStr, op, bStr] = m!;
  const a = Number(aStr);
  const b = Number(bStr);
  const got = op === "+" ? a + b : op === "-" ? a - b : op === "x" ? a * b : a / b;
  assert.equal(got, answer, `${prompt} should equal ${answer}, got ${got}`);
}

const OPS: Operation[] = ["addition", "subtraction", "multiplication", "division"];

test("every operation produces a question whose math checks out", () => {
  for (const op of OPS) {
    for (let d = 1 as 1 | 2 | 3 | 4 | 5; d <= 5; d = (d + 1) as 1 | 2 | 3 | 4 | 5) {
      for (let i = 0; i < 30; i++) {
        const q = generateQuestion(op, d);
        checkMath(q.prompt, q.answer);
        assert.ok(q.answer >= 0, `${op} answer should be non-negative`);
      }
    }
  }
});

test("options are always 4 distinct positive numbers including the answer", () => {
  for (const op of OPS) {
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion(op, 3);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4, "distinct");
      assert.ok(q.options.every((o) => o > 0), "all positive");
      assert.ok(q.options.includes(q.answer), "includes the answer");
    }
  }
});

test("buildOptions pads upward when the answer is too small for nearby distractors", () => {
  const opts = buildOptions(1, seq([0])); // rng always 0 -> neighbours collide, forces padding
  assert.equal(opts.length, 4);
  assert.equal(new Set(opts).size, 4);
  assert.ok(opts.every((o) => o > 0));
  assert.ok(opts.includes(1));
});

test("subtraction never goes negative and division is exact", () => {
  for (let i = 0; i < 100; i++) {
    const sub = generateQuestion("subtraction", 5);
    assert.ok(sub.answer >= 0);
    const div = generateQuestion("division", 5);
    const m = div.prompt.match(/^(\d+)\s*\/\s*(\d+)/)!;
    assert.equal(Number(m[1]) % Number(m[2]), 0, "division is exact");
  }
});

test("generateRun returns the requested number of questions, seedable", () => {
  const a = generateRun("addition", 2, 10, seq([0.1, 0.5, 0.9]));
  const b = generateRun("addition", 2, 10, seq([0.1, 0.5, 0.9]));
  assert.equal(a.length, 10);
  assert.deepEqual(
    a.map((q) => q.prompt),
    b.map((q) => q.prompt),
    "same seed -> same run",
  );
});
