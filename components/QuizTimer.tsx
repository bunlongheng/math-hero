"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/game.module.css";

// Countdown bar. Remounted per question via a `key`, so the start value comes from the
// useState initializer. Remaining time is derived from a deadline timestamp (drift-free
// under tab throttling); setLeft only ever stores a plain number and onTimeout fires from
// the interval callback - never inside a state updater - so the updater stays pure.
export function QuizTimer({ seconds, color, onTimeout }: { seconds: number; color: string; onTimeout: () => void }) {
  const [left, setLeft] = useState(seconds);
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    const deadline = Date.now() + seconds * 1000;
    let fired = false;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining <= 0 && !fired) {
        fired = true;
        clearInterval(id);
        onTimeoutRef.current();
      }
    }, 250);
    return () => clearInterval(id);
  }, [seconds]);

  const pct = Math.max(0, (left / seconds) * 100);
  return (
    <div className={styles.timerContainer} role="timer" aria-label={`${left} seconds left`}>
      <div className={styles.timerBar} style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
