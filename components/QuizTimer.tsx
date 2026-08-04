"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/game.module.css";

// Countdown bar. Remounted per question via a `key`, so the start value comes from the
// useState initializer (never a setState in an effect). The interval's setState is async
// and onTimeout is deferred out of the updater, so there is no synchronous setState-in-effect.
export function QuizTimer({ seconds, color, onTimeout }: { seconds: number; color: string; onTimeout: () => void }) {
  const [left, setLeft] = useState(seconds);
  const firedRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((p) => {
        const next = p - 1;
        if (next <= 0 && !firedRef.current) {
          firedRef.current = true;
          clearInterval(id);
          queueMicrotask(() => onTimeoutRef.current());
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pct = Math.max(0, (left / seconds) * 100);
  return (
    <div className={styles.timerContainer} role="timer" aria-label={`${left} seconds left`}>
      <div className={styles.timerBar} style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
