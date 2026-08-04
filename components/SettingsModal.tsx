"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { OPERATIONS, type Operation, type Difficulty } from "@/lib/math";
import styles from "@/app/game.module.css";

export function SettingsModal(props: {
  difficulty: Difficulty;
  onDifficulty: (d: Difficulty) => void;
  operation: Operation;
  onOperation: (o: Operation) => void;
  soundOn: boolean;
  onSound: (v: boolean) => void;
  timerOn: boolean;
  onTimer: (v: boolean) => void;
  onClose: () => void;
}) {
  const { difficulty, onDifficulty, operation, onOperation, soundOn, onSound, timerOn, onTimer, onClose } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    // Restore focus to whatever opened the dialog when it closes (WAI-ARIA modal pattern).
    const opener = document.activeElement as HTMLElement | null;
    card.querySelector<HTMLElement>("button, [tabindex]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const f = Array.from(card.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, []);

  return (
    <div className={styles.settingsModal} onClick={onClose}>
      <div
        className={styles.settingsContent}
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.settingsHeader}>
          <h2 className={styles.settingsTitle} id="settings-title">
            SETTINGS
          </h2>
          <button className={styles.closeIcon} onClick={onClose} aria-label="Close settings">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className={styles.settingGroup}>
          <div className={styles.settingLabel} id="difficulty-label">
            DIFFICULTY
          </div>
          <div className={styles.optionRow} role="group" aria-labelledby="difficulty-label">
            {([1, 2, 3, 4, 5] as const).map((d) => (
              <button
                key={d}
                aria-pressed={difficulty === d}
                aria-label={`Difficulty ${d}`}
                className={`${styles.configBtn} ${difficulty === d ? styles.active : ""}`}
                onClick={() => onDifficulty(d)}
              >
                {d}
                <span aria-hidden="true">⭐</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.settingGroup}>
          <div className={styles.settingLabel} id="op-label">
            OPERATION
          </div>
          <div className={styles.optionRow} role="group" aria-labelledby="op-label">
            {OPERATIONS.map((op) => (
              <button
                key={op.id}
                aria-pressed={operation === op.id}
                aria-label={op.label}
                className={`${styles.configBtn} ${styles.opBtn} ${operation === op.id ? styles.active : ""}`}
                onClick={() => onOperation(op.id)}
              >
                {op.symbol}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.settingGroup}>
          <div className={styles.settingLabel} id="options-label">
            OPTIONS
          </div>
          <div className={styles.optionRow} role="group" aria-labelledby="options-label">
            <button className={`${styles.configBtn} ${soundOn ? styles.active : ""}`} aria-pressed={soundOn} onClick={() => onSound(!soundOn)}>
              {soundOn ? "🔊" : "🔇"} Sound
            </button>
            <button className={`${styles.configBtn} ${timerOn ? styles.active : ""}`} aria-pressed={timerOn} onClick={() => onTimer(!timerOn)}>
              {timerOn ? "⏱️" : "⏳"} Timer
            </button>
          </div>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          SAVE &amp; CLOSE
        </button>
      </div>
    </div>
  );
}
