// The Math Hero characters. Ported from the games monorepo; images self-hosted in /public/heroes.
// hero.color drives the per-hero timer bar + answer-button accents, so it must clear 3:1 non-text
// contrast on the near-black background (Black Shadow's original #333 was lightened for that reason).
export interface Hero {
  id: string;
  name: string;
  title: string;
  color: string;
  item: string;
  image: string;
}

export const HEROES: Hero[] = [
  {
    "id": "red-blaze",
    "name": "Red Blaze",
    "title": "The Inferno Guardian",
    "color": "#ff3333",
    "item": "🔥",
    "image": "/heroes/1.png"
  },
  {
    "id": "orange-venus",
    "name": "Orange Venus",
    "title": "The Solar Warrior",
    "color": "#ff8800",
    "item": "☀️",
    "image": "/heroes/2.png"
  },
  {
    "id": "yellow-zap",
    "name": "Yellow Zap",
    "title": "The Lightning Striker",
    "color": "#ffdd00",
    "item": "⚡",
    "image": "/heroes/3.png"
  },
  {
    "id": "green-earth",
    "name": "Green Earth",
    "title": "The Nature Titan",
    "color": "#00ff00",
    "item": "🌿",
    "image": "/heroes/4.png"
  },
  {
    "id": "blue-blitz",
    "name": "Blue Blitz",
    "title": "The Ocean's Fury",
    "color": "#0099ff",
    "item": "🌊",
    "image": "/heroes/5.png"
  },
  {
    "id": "purple-pulse",
    "name": "Purple Pulse",
    "title": "The Tech Assassin",
    "color": "#9933ff",
    "item": "🔮",
    "image": "/heroes/6.png"
  },
  {
    "id": "pink-arrow",
    "name": "Pink Arrow",
    "title": "The Sharpshooter",
    "color": "#ff66cc",
    "item": "🏹",
    "image": "/heroes/7.png"
  },
  {
    "id": "brown-quake",
    "name": "Brown Quake",
    "title": "The Earthshaker",
    "color": "#cc6633",
    "item": "⛰️",
    "image": "/heroes/8.png"
  },
  {
    "id": "black-shadow",
    "name": "Black Shadow",
    "title": "The Dark Phantom",
    "color": "#8a8a9e",
    "item": "🥷",
    "image": "/heroes/9.png"
  },
  {
    "id": "white-snow",
    "name": "White Snow",
    "title": "The Ice Queen",
    "color": "#ffffff",
    "item": "❄️",
    "image": "/heroes/10.png"
  },
  {
    "id": "gray-mud",
    "name": "Gray Mud",
    "title": "The Swamp Guardian",
    "color": "#7a7a7a",
    "item": "🪨",
    "image": "/heroes/11.png"
  },
  {
    "id": "cyan-frost",
    "name": "Cyan Frost",
    "title": "The Crystal Guardian",
    "color": "#00ffff",
    "item": "🧊",
    "image": "/heroes/12.png"
  }
];
