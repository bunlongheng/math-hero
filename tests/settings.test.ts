import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSettings, DEFAULT_SETTINGS, loadSettings, saveSettings, readBest, writeBest } from "../lib/settings.ts";

// Stub window + localStorage so the browser-guarded helpers can be exercised in node.
function withStorage(fn: () => void) {
  const store = new Map<string, string>();
  const g = globalThis as unknown as { window?: unknown; localStorage?: unknown };
  g.window = globalThis;
  g.localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, String(v)) };
  try {
    fn();
  } finally {
    delete g.window;
    delete g.localStorage;
  }
}

test("parseSettings returns defaults for junk", () => {
  assert.deepEqual(parseSettings(null), DEFAULT_SETTINGS);
  assert.deepEqual(parseSettings("x"), DEFAULT_SETTINGS);
  assert.deepEqual(parseSettings({}), DEFAULT_SETTINGS);
});

test("parseSettings accepts valid values and rejects out-of-range", () => {
  assert.deepEqual(parseSettings({ difficulty: 4, operation: "division", soundOn: false, timerOn: false }), {
    difficulty: 4,
    operation: "division",
    soundOn: false,
    timerOn: false,
  });
  const s = parseSettings({ difficulty: 9, operation: "wat", soundOn: "x" });
  assert.equal(s.difficulty, 1);
  assert.equal(s.operation, "addition");
  assert.equal(s.soundOn, true);
  assert.equal(s.timerOn, true, "timerOn defaults on unless explicitly false");
});

test("settings and best score round-trip through localStorage", () => {
  withStorage(() => {
    saveSettings({ difficulty: 3, operation: "division", soundOn: false, timerOn: false });
    assert.deepEqual(loadSettings(), { difficulty: 3, operation: "division", soundOn: false, timerOn: false });
    writeBest("division", 3, 7);
    assert.equal(readBest("division", 3), 7);
    assert.equal(readBest("addition", 1), 0, "unset key reads 0");
  });
});
