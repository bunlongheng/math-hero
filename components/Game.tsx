"use client";

import { useEffect, useReducer, useState } from "react";
import confetti from "canvas-confetti";
import type { Hero } from "@/lib/heroes";
import type { Operation, Difficulty } from "@/lib/math";
import { gameReducer, idleGame, buildRun, isCorrect, TOTAL_QUESTIONS } from "@/lib/gameEngine";
import { loadSettings, saveSettings, readBest, writeBest, type Settings } from "@/lib/settings";
import { useGameAudio, prefersReducedMotion } from "@/lib/useGameAudio";
import { HeroSelect } from "./HeroSelect";
import { GameScreen } from "./GameScreen";
import { CompletionScreen } from "./CompletionScreen";
import { SettingsModal } from "./SettingsModal";
import styles from "@/app/game.module.css";

const TIMER_SECONDS = 30;

export default function Game() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const { difficulty, operation, soundOn, timerOn } = settings;
  const [showSettings, setShowSettings] = useState(false);
  const [game, dispatch] = useReducer(gameReducer, undefined, idleGame);
  const [bestAtStart, setBestAtStart] = useState(0);

  const { playSuccess, playWrong, playVictory } = useGameAudio();
  const patch = (p: Partial<Settings>) => setSettings((s) => ({ ...s, ...p }));

  // Persist settings (side-effect-only).
  useEffect(() => saveSettings(settings), [settings]);

  // After a reveal, advance. setTimeout keeps dispatch out of the effect body; cleanup cancels it.
  useEffect(() => {
    if (game.phase !== "revealing" || game.screen !== "playing") return;
    const id = setTimeout(() => dispatch({ type: "ADVANCE" }), 1300);
    return () => clearTimeout(id);
  }, [game.phase, game.screen, game.index]);

  // On finish: celebrate + record a new best.
  useEffect(() => {
    if (game.screen !== "done") return;
    if (soundOn) playVictory();
    if (!prefersReducedMotion()) {
      const colors = [game.hero?.color ?? "#00d9ff", "#ffffff", "#ffd700"];
      confetti({ particleCount: 160, spread: 160, origin: { x: 0.3, y: 0.5 }, colors });
      confetti({ particleCount: 160, spread: 160, origin: { x: 0.7, y: 0.5 }, colors });
    }
    if (game.correct > bestAtStart) writeBest(operation, difficulty, game.correct);
  }, [game.screen, game.correct, game.hero, operation, difficulty, bestAtStart, soundOn, playVictory]);

  const pickHero = (hero: Hero) => {
    setBestAtStart(readBest(operation, difficulty));
    dispatch({ type: "START", run: buildRun(hero, operation, difficulty, { count: TOTAL_QUESTIONS }) });
  };

  const answer = (value: number) => {
    if (game.phase !== "asking") return;
    const correct = isCorrect(game, value);
    if (correct) {
      if (soundOn) playSuccess();
      if (!prefersReducedMotion()) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 }, colors: [game.hero?.color ?? "#00d9ff", "#fff", "#ffd700"] });
      }
    } else if (soundOn) {
      playWrong();
    }
    dispatch({ type: "ANSWER", value });
  };

  const onTimeout = () => {
    if (soundOn) playWrong();
    dispatch({ type: "TIMEOUT" });
  };

  const changeDifficulty = (d: Difficulty) => patch({ difficulty: d });
  const changeOperation = (o: Operation) => patch({ operation: o });

  return (
    <main className={styles.container} style={game.hero ? ({ "--hero-color": game.hero.color } as React.CSSProperties) : undefined}>
      {game.screen === "selection" && (
        <HeroSelect onPick={pickHero} onSettings={() => setShowSettings(true)} />
      )}

      {game.screen === "playing" && (
        <GameScreen
          state={game}
          timerSeconds={TIMER_SECONDS}
          timerOn={timerOn}
          onAnswer={answer}
          onTimeout={onTimeout}
          onHome={() => dispatch({ type: "HOME" })}
        />
      )}

      {game.screen === "done" && game.hero && (
        <CompletionScreen
          hero={game.hero}
          correct={game.correct}
          total={game.total}
          treasures={game.treasures}
          best={bestAtStart}
          onPlayAgain={() => pickHero(game.hero!)}
          onHome={() => dispatch({ type: "HOME" })}
        />
      )}

      {showSettings && (
        <SettingsModal
          difficulty={difficulty}
          onDifficulty={changeDifficulty}
          operation={operation}
          onOperation={changeOperation}
          soundOn={soundOn}
          onSound={(v) => patch({ soundOn: v })}
          timerOn={timerOn}
          onTimer={(v) => patch({ timerOn: v })}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
