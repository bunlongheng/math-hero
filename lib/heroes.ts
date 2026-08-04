// The Math Hero characters. Ported from the games monorepo; images self-hosted in /public/heroes.
export interface Hero {
  id: string;
  name: string;
  title: string;
  color: string;
  gradient: string;
  element: string;
  item: string;
  description: string;
  image: string;
}

export const HEROES: Hero[] = [
  {
    "id": "red-blaze",
    "name": "Red Blaze",
    "title": "The Inferno Guardian",
    "color": "#ff3333",
    "gradient": "linear-gradient(135deg, #ff3333, #cc0000)",
    "element": "Fire",
    "item": "🔥",
    "description": "Master of flames and heat manipulation",
    "image": "/heroes/1.png"
  },
  {
    "id": "orange-venus",
    "name": "Orange Venus",
    "title": "The Solar Warrior",
    "color": "#ff8800",
    "gradient": "linear-gradient(135deg, #ff8800, #ff6600)",
    "element": "Solar Energy",
    "item": "☀️",
    "description": "Drawing power from solar radiation",
    "image": "/heroes/2.png"
  },
  {
    "id": "yellow-zap",
    "name": "Yellow Zap",
    "title": "The Lightning Striker",
    "color": "#ffdd00",
    "gradient": "linear-gradient(135deg, #ffdd00, #ffaa00)",
    "element": "Lightning",
    "item": "⚡",
    "description": "Fastest hero with electrical powers",
    "image": "/heroes/3.png"
  },
  {
    "id": "green-earth",
    "name": "Green Earth",
    "title": "The Nature Titan",
    "color": "#00ff00",
    "gradient": "linear-gradient(135deg, #00ff00, #00cc00)",
    "element": "Nature",
    "item": "🌿",
    "description": "Controls nature and earth elements",
    "image": "/heroes/4.png"
  },
  {
    "id": "blue-blitz",
    "name": "Blue Blitz",
    "title": "The Ocean's Fury",
    "color": "#0099ff",
    "gradient": "linear-gradient(135deg, #0099ff, #0066cc)",
    "element": "Water",
    "item": "🌊",
    "description": "Commander of water and ice",
    "image": "/heroes/5.png"
  },
  {
    "id": "purple-pulse",
    "name": "Purple Pulse",
    "title": "The Tech Assassin",
    "color": "#9933ff",
    "gradient": "linear-gradient(135deg, #9933ff, #6600cc)",
    "element": "Energy",
    "item": "🔮",
    "description": "Master of energy manipulation",
    "image": "/heroes/6.png"
  },
  {
    "id": "pink-arrow",
    "name": "Pink Arrow",
    "title": "The Sharpshooter",
    "color": "#ff66cc",
    "gradient": "linear-gradient(135deg, #ff66cc, #ff0099)",
    "element": "Precision",
    "item": "🏹",
    "description": "Expert archer with perfect aim",
    "image": "/heroes/7.png"
  },
  {
    "id": "brown-quake",
    "name": "Brown Quake",
    "title": "The Earthshaker",
    "color": "#cc6633",
    "gradient": "linear-gradient(135deg, #cc6633, #994422)",
    "element": "Earth",
    "item": "⛰️",
    "description": "Seismic power and raw strength",
    "image": "/heroes/8.png"
  },
  {
    "id": "black-shadow",
    "name": "Black Shadow",
    "title": "The Dark Phantom",
    "color": "#333333",
    "gradient": "linear-gradient(135deg, #333333, #000000)",
    "element": "Darkness",
    "item": "🥷",
    "description": "Master of shadows and stealth",
    "image": "/heroes/9.png"
  },
  {
    "id": "white-snow",
    "name": "White Snow",
    "title": "The Ice Queen",
    "color": "#ffffff",
    "gradient": "linear-gradient(135deg, #ffffff, #cccccc)",
    "element": "Ice",
    "item": "❄️",
    "description": "Controls ice and snow",
    "image": "/heroes/10.png"
  },
  {
    "id": "gray-mud",
    "name": "Gray Mud",
    "title": "The Swamp Guardian",
    "color": "#7a7a7a",
    "gradient": "linear-gradient(135deg, #7a7a7a, #4a4a4a)",
    "element": "Mud",
    "item": "🪨",
    "description": "A tanky defender who controls thick gray slime to slow enemies and absorb damage",
    "image": "/heroes/11.png"
  },
  {
    "id": "cyan-frost",
    "name": "Cyan Frost",
    "title": "The Crystal Guardian",
    "color": "#00ffff",
    "gradient": "linear-gradient(135deg, #00ffff, #00cccc)",
    "element": "Crystal Ice",
    "item": "🧊",
    "description": "Creates crystal ice formations",
    "image": "/heroes/12.png"
  }
];
