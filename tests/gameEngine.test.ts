import { test } from "node:test";
import assert from "node:assert/strict";
import { HEROES } from "../lib/heroes.ts";
import { buildRun, gameReducer, idleGame, type GameState } from "../lib/gameEngine.ts";

const hero = HEROES[0];
const run = (count = 10): GameState => buildRun(hero, "addition", 1, { count });
const answerCorrect = (s: GameState) => gameReducer(s, { type: "ANSWER", value: s.questions[s.index].answer });
const answerWrong = (s: GameState) => gameReducer(s, { type: "ANSWER", value: s.questions[s.index].answer + 1000 });

test("buildRun starts a playing game with the requested question count", () => {
  const s = run(10);
  assert.equal(s.screen, "playing");
  assert.equal(s.total, 10);
  assert.equal(s.questions.length, 10);
  assert.equal(s.index, 0);
  assert.equal(s.phase, "asking");
  assert.equal(s.correct, 0);
  assert.equal(s.hero?.id, hero.id);
});

test("correct answer scores + banks a treasure and reveals", () => {
  const s = answerCorrect(run());
  assert.equal(s.phase, "revealing");
  assert.equal(s.correct, 1);
  assert.equal(s.treasures, 1);
  assert.equal(s.lastCorrect, true);
  assert.match(s.verdict ?? "", /Correct/);
});

test("wrong answer scores nothing and reveals the right answer", () => {
  const s0 = run();
  const s = answerWrong(s0);
  assert.equal(s.correct, 0);
  assert.equal(s.treasures, 0);
  assert.equal(s.lastCorrect, false);
  assert.match(s.verdict ?? "", new RegExp(String(s0.questions[0].answer)));
});

test("a second ANSWER during revealing is ignored", () => {
  const s1 = answerCorrect(run());
  const s2 = answerCorrect(s1);
  assert.equal(s2, s1);
  assert.equal(s2.correct, 1);
});

test("TIMEOUT counts as wrong once and cannot double-fire", () => {
  const s0 = run();
  const s1 = gameReducer(s0, { type: "TIMEOUT" });
  assert.equal(s1.phase, "revealing");
  assert.equal(s1.correct, 0);
  assert.equal(s1.lastCorrect, false);
  const s2 = gameReducer(s1, { type: "TIMEOUT" });
  assert.equal(s2, s1);
});

test("ADVANCE moves to the next question and finishes the run at the end", () => {
  let s = run(3);
  assert.equal(gameReducer(s, { type: "ADVANCE" }), s, "no-op while asking");
  for (let i = 0; i < 3; i++) {
    s = answerCorrect(s);
    s = gameReducer(s, { type: "ADVANCE" });
  }
  assert.equal(s.screen, "done");
  assert.equal(s.correct, 3);
});

test("HOME resets to hero selection", () => {
  const s = gameReducer(answerCorrect(run()), { type: "HOME" });
  assert.deepEqual(s, idleGame());
});

test("the reducer is pure", () => {
  const s0 = run();
  assert.deepEqual(answerCorrect(s0), answerCorrect(s0));
});
