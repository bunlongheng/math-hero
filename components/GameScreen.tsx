"use client";

import Image from "next/image";
import { Home } from "lucide-react";
import type { GameState } from "@/lib/gameEngine";
import { QuizTimer } from "./QuizTimer";
import styles from "@/app/game.module.css";

export function GameScreen(props: {
  state: GameState;
  timerSeconds: number;
  timerOn: boolean;
  onAnswer: (value: number) => void;
  onTimeout: () => void;
  onHome: () => void;
}) {
  const { state, timerSeconds, timerOn, onAnswer, onTimeout, onHome } = props;
  const { hero, questions, index, treasures, phase, picked, verdict } = state;
  if (!hero) return null;
  const current = questions[index];
  const answering = phase !== "asking";

  return (
    <div className={styles.gameScreen} style={{ "--hero-color": hero.color } as React.CSSProperties}>
      <div className={styles.topNavRow}>
        <button className={styles.homeBtn} onClick={onHome} aria-label="Back to hero selection">
          <Home size={30} aria-hidden="true" />
        </button>
        {timerOn && phase === "asking" ? (
          <QuizTimer key={index} seconds={timerSeconds} color={hero.color} onTimeout={onTimeout} />
        ) : (
          <div className={styles.timerContainer} aria-hidden="true" />
        )}
        <div className={styles.topNavRight}>
          <div className={styles.treasureCounter} aria-label={`${treasures} treasures`}>
            <span className={styles.itemIcon} aria-hidden="true" style={{ filter: `drop-shadow(0 0 5px ${hero.color})` }}>
              {hero.item}
            </span>
            <span>{treasures}</span>
          </div>
        </div>
      </div>

      {/* Screen-reader running commentary. */}
      <div className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
        {verdict ?? `Question ${index + 1} of ${state.total}: ${current.prompt}`}
      </div>

      <div className={styles.gameContentWrapper}>
        <div className={styles.heroSection}>
          <span className={styles.characterHero}>
            <Image src={hero.image} alt={hero.name} fill sizes="(max-width: 640px) 60vw, 320px" style={{ objectFit: "contain" }} priority />
          </span>
        </div>
        <div className={styles.questionSection}>
          <div className={styles.questionText} data-testid="question">
            {current.prompt}
          </div>
        </div>
        <div className={styles.answerSection}>
          <div className={styles.answersGrid}>
            {current.options.map((opt) => {
              const isAnswer = opt === current.answer;
              const isPicked = picked === opt;
              const cls = [
                styles.answerBtn,
                answering && isAnswer ? styles.answerBtnCorrect : "",
                answering && isPicked && !isAnswer ? styles.answerBtnWrong : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <button
                  key={opt}
                  className={cls}
                  style={{ "--hero-border": hero.color } as React.CSSProperties}
                  // aria-disabled (not disabled) so keyboard focus is not thrown to <body>
                  // during the reveal; onAnswer no-ops outside the "asking" phase anyway.
                  aria-disabled={answering}
                  onClick={() => onAnswer(opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {verdict && (
            <div className={`${styles.verdict} ${state.lastCorrect ? styles.verdictGood : styles.verdictBad}`}>{verdict}</div>
          )}
        </div>
      </div>
    </div>
  );
}
