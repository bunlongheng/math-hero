"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";
import type { Hero } from "@/lib/heroes";
import styles from "@/app/game.module.css";

export function CompletionScreen(props: {
  hero: Hero;
  correct: number;
  total: number;
  treasures: number;
  best: number;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const { hero, correct, total, treasures, best, onPlayAgain, onHome } = props;
  const isNewBest = correct > best;

  return (
    <div className={styles.completionScreen} role="status" aria-live="polite">
      <div className={styles.victoryHeader}>
        <h1 className={styles.victoryTitle} style={{ color: hero.color }}>
          VICTORY!
        </h1>
      </div>

      <div className={styles.victoryHeroWrapper}>
        <span className={styles.victoryHero}>
          <Image src={hero.image} alt={hero.name} fill sizes="(max-width: 640px) 60vw, 280px" style={{ objectFit: "contain" }} />
        </span>
      </div>

      <div className={styles.victoryStats}>
        <div className={styles.statLine}>
          Score:{" "}
          <strong>
            {correct}/{total}
          </strong>
        </div>
        <div className={styles.statLine} style={{ color: hero.color }}>
          <span aria-hidden="true">{hero.item}</span> Treasures: <strong>{treasures}</strong>
        </div>
        <div className={styles.statLine}>{isNewBest ? "New best!" : `Best: ${best}/${total}`}</div>
      </div>

      <div className={styles.victoryActions}>
        <button className={styles.playAgainBtn} onClick={onPlayAgain}>
          <RotateCcw size={24} aria-hidden="true" style={{ marginRight: "10px" }} />
          PLAY AGAIN
        </button>
        <button className={styles.playAgainBtn} onClick={onHome}>
          PICK A NEW HERO
        </button>
      </div>
    </div>
  );
}
