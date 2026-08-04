"use client";

import dynamic from "next/dynamic";
import styles from "./game.module.css";

// The game reads persisted settings from localStorage during init and uses canvas /
// Web Audio, so it is loaded client-only with a real loading state.
const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => (
    <main className={styles.container}>
      <div className={styles.loading} role="status" aria-live="polite">
        Loading Math Hero...
      </div>
    </main>
  ),
});

export default function Page() {
  return <Game />;
}
