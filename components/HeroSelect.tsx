"use client";

import React from "react";
import Image from "next/image";
import { Settings } from "lucide-react";
import { HEROES, type Hero } from "@/lib/heroes";
import { TOTAL_QUESTIONS } from "@/lib/gameEngine";
import styles from "@/app/game.module.css";

export function HeroSelect({ onPick, onSettings, best }: { onPick: (hero: Hero) => void; onSettings: () => void; best: number }) {
  return (
    <div className={styles.characterSelection}>
      <div className={styles.headerRow}>
        {best > 0 && (
          <span className={styles.bestBadge}>
            Best: {best}/{TOTAL_QUESTIONS}
          </span>
        )}
        <button className={styles.selectionSettingsBtn} onClick={onSettings} aria-label="Settings">
          <Settings size={32} aria-hidden="true" />
        </button>
      </div>
      <h1 className={styles.srOnly}>Math Hero - pick your hero</h1>
      <div className={styles.characterGrid}>
        {HEROES.map((hero, i) => (
          <button
            key={hero.id}
            className={styles.characterCard}
            style={{ "--hover-color": hero.color } as React.CSSProperties}
            onClick={() => onPick(hero)}
            aria-label={`${hero.name}, ${hero.title}`}
          >
            <span className={styles.characterArtwork}>
              <Image
                src={hero.image}
                alt=""
                fill
                sizes="(max-width: 640px) 40vw, 180px"
                style={{ objectFit: "cover" }}
                priority={i < 6}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
