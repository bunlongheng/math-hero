import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSettings, DEFAULT_SETTINGS } from "../lib/settings.ts";

test("parseSettings returns defaults for junk", () => {
  assert.deepEqual(parseSettings(null), DEFAULT_SETTINGS);
  assert.deepEqual(parseSettings("x"), DEFAULT_SETTINGS);
  assert.deepEqual(parseSettings({}), DEFAULT_SETTINGS);
});

test("parseSettings accepts valid values and rejects out-of-range", () => {
  assert.deepEqual(parseSettings({ difficulty: 4, operation: "division", soundOn: false }), {
    difficulty: 4,
    operation: "division",
    soundOn: false,
  });
  const s = parseSettings({ difficulty: 9, operation: "wat", soundOn: "x" });
  assert.equal(s.difficulty, 1);
  assert.equal(s.operation, "addition");
  assert.equal(s.soundOn, true);
});
