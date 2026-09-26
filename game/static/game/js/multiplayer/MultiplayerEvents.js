// 100 synchronized multiplayer events.
// Events are selected by the host and announced to every player.
export const MULTIPLAYER_EVENTS = [
  {
    "id": 1,
    "name": "Meteor Shower",
    "icon": "☄️",
    "category": "hazard",
    "duration": 15
  },
  {
    "id": 2,
    "name": "Treasure Rain",
    "icon": "💰",
    "category": "reward",
    "duration": 22
  },
  {
    "id": 3,
    "name": "Gravity Flip",
    "icon": "🌀",
    "category": "chaos",
    "duration": 29
  },
  {
    "id": 4,
    "name": "Low Gravity",
    "icon": "🌙",
    "category": "movement",
    "duration": 36
  },
  {
    "id": 5,
    "name": "Super Speed",
    "icon": "⚡",
    "category": "boost",
    "duration": 43
  },
  {
    "id": 6,
    "name": "Slow Motion",
    "icon": "🐌",
    "category": "chaos",
    "duration": 19
  },
  {
    "id": 7,
    "name": "Enemy Swarm",
    "icon": "👾",
    "category": "combat",
    "duration": 26
  },
  {
    "id": 8,
    "name": "Boss Rush",
    "icon": "👑",
    "category": "combat",
    "duration": 33
  },
  {
    "id": 9,
    "name": "Healing Pulse",
    "icon": "💚",
    "category": "heal",
    "duration": 40
  },
  {
    "id": 10,
    "name": "Damage Surge",
    "icon": "💥",
    "category": "combat",
    "duration": 16
  },
  {
    "id": 11,
    "name": "Double Coins",
    "icon": "🪙",
    "category": "reward",
    "duration": 23
  },
  {
    "id": 12,
    "name": "No Jump",
    "icon": "🚫",
    "category": "challenge",
    "duration": 30
  },
  {
    "id": 13,
    "name": "Mega Jump",
    "icon": "🦘",
    "category": "movement",
    "duration": 37
  },
  {
    "id": 14,
    "name": "Tiny Players",
    "icon": "🔬",
    "category": "chaos",
    "duration": 44
  },
  {
    "id": 15,
    "name": "Giant Players",
    "icon": "🔭",
    "category": "chaos",
    "duration": 20
  },
  {
    "id": 16,
    "name": "Darkness",
    "icon": "🌑",
    "category": "visual",
    "duration": 27
  },
  {
    "id": 17,
    "name": "Rainbow Mode",
    "icon": "🌈",
    "category": "visual",
    "duration": 34
  },
  {
    "id": 18,
    "name": "Fog",
    "icon": "🌫️",
    "category": "visual",
    "duration": 41
  },
  {
    "id": 19,
    "name": "Earthquake",
    "icon": "🌋",
    "category": "hazard",
    "duration": 17
  },
  {
    "id": 20,
    "name": "Lava Rise",
    "icon": "🔥",
    "category": "hazard",
    "duration": 24
  },
  {
    "id": 21,
    "name": "Ice Floor",
    "icon": "🧊",
    "category": "hazard",
    "duration": 31
  },
  {
    "id": 22,
    "name": "Slippery Mode",
    "icon": "🛝",
    "category": "movement",
    "duration": 38
  },
  {
    "id": 23,
    "name": "Shield Party",
    "icon": "🛡️",
    "category": "defense",
    "duration": 45
  },
  {
    "id": 24,
    "name": "One Heart",
    "icon": "❤️",
    "category": "challenge",
    "duration": 21
  },
  {
    "id": 25,
    "name": "Regeneration",
    "icon": "✨",
    "category": "heal",
    "duration": 28
  },
  {
    "id": 26,
    "name": "Vampire Mode",
    "icon": "🧛",
    "category": "combat",
    "duration": 35
  },
  {
    "id": 27,
    "name": "Sword Storm",
    "icon": "⚔️",
    "category": "hazard",
    "duration": 42
  },
  {
    "id": 28,
    "name": "Arrow Storm",
    "icon": "🏹",
    "category": "hazard",
    "duration": 18
  },
  {
    "id": 29,
    "name": "Bomb Rain",
    "icon": "💣",
    "category": "hazard",
    "duration": 25
  },
  {
    "id": 30,
    "name": "Meteor Boss",
    "icon": "🌠",
    "category": "boss",
    "duration": 32
  },
  {
    "id": 31,
    "name": "Mini Boss",
    "icon": "👹",
    "category": "boss",
    "duration": 39
  },
  {
    "id": 32,
    "name": "Elite Wave",
    "icon": "💀",
    "category": "combat",
    "duration": 15
  },
  {
    "id": 33,
    "name": "Zombie Wave",
    "icon": "🧟",
    "category": "combat",
    "duration": 22
  },
  {
    "id": 34,
    "name": "Skeleton Wave",
    "icon": "💀",
    "category": "combat",
    "duration": 29
  },
  {
    "id": 35,
    "name": "Flying Wave",
    "icon": "🦇",
    "category": "combat",
    "duration": 36
  },
  {
    "id": 36,
    "name": "Fast Enemies",
    "icon": "🏃",
    "category": "combat",
    "duration": 43
  },
  {
    "id": 37,
    "name": "Tiny Enemies",
    "icon": "🐜",
    "category": "combat",
    "duration": 19
  },
  {
    "id": 38,
    "name": "Giant Enemies",
    "icon": "🦖",
    "category": "combat",
    "duration": 26
  },
  {
    "id": 39,
    "name": "Friendly Enemies",
    "icon": "🤝",
    "category": "chaos",
    "duration": 33
  },
  {
    "id": 40,
    "name": "Pacifist Minute",
    "icon": "🕊️",
    "category": "challenge",
    "duration": 40
  },
  {
    "id": 41,
    "name": "Double Damage",
    "icon": "⚡",
    "category": "combat",
    "duration": 16
  },
  {
    "id": 42,
    "name": "Half Damage",
    "icon": "🧸",
    "category": "defense",
    "duration": 23
  },
  {
    "id": 43,
    "name": "Critical Hits",
    "icon": "🎯",
    "category": "combat",
    "duration": 30
  },
  {
    "id": 44,
    "name": "Random Weapons",
    "icon": "🎲",
    "category": "chaos",
    "duration": 37
  },
  {
    "id": 45,
    "name": "Weapon Lock",
    "icon": "🔒",
    "category": "challenge",
    "duration": 44
  },
  {
    "id": 46,
    "name": "Infinite Ammo",
    "icon": "🔫",
    "category": "reward",
    "duration": 20
  },
  {
    "id": 47,
    "name": "No Items",
    "icon": "📦",
    "category": "challenge",
    "duration": 27
  },
  {
    "id": 48,
    "name": "Item Frenzy",
    "icon": "🎁",
    "category": "reward",
    "duration": 34
  },
  {
    "id": 49,
    "name": "Chest Hunt",
    "icon": "🗝️",
    "category": "reward",
    "duration": 41
  },
  {
    "id": 50,
    "name": "Secret Portal",
    "icon": "🌀",
    "category": "travel",
    "duration": 17
  },
  {
    "id": 51,
    "name": "Teleport Party",
    "icon": "✨",
    "category": "travel",
    "duration": 24
  },
  {
    "id": 52,
    "name": "Swap Positions",
    "icon": "🔄",
    "category": "chaos",
    "duration": 31
  },
  {
    "id": 53,
    "name": "Mirror World",
    "icon": "🪞",
    "category": "chaos",
    "duration": 38
  },
  {
    "id": 54,
    "name": "Reverse Controls",
    "icon": "↩️",
    "category": "challenge",
    "duration": 45
  },
  {
    "id": 55,
    "name": "Screen Shake",
    "icon": "📳",
    "category": "visual",
    "duration": 21
  },
  {
    "id": 56,
    "name": "Color Chaos",
    "icon": "🎨",
    "category": "visual",
    "duration": 28
  },
  {
    "id": 57,
    "name": "Disco Lights",
    "icon": "🪩",
    "category": "visual",
    "duration": 35
  },
  {
    "id": 58,
    "name": "Thunderstorm",
    "icon": "⛈️",
    "category": "hazard",
    "duration": 42
  },
  {
    "id": 59,
    "name": "Wind Gusts",
    "icon": "💨",
    "category": "movement",
    "duration": 18
  },
  {
    "id": 60,
    "name": "Sandstorm",
    "icon": "🏜️",
    "category": "visual",
    "duration": 25
  },
  {
    "id": 61,
    "name": "Snowstorm",
    "icon": "❄️",
    "category": "visual",
    "duration": 32
  },
  {
    "id": 62,
    "name": "Rainstorm",
    "icon": "🌧️",
    "category": "visual",
    "duration": 39
  },
  {
    "id": 63,
    "name": "Lightning Strike",
    "icon": "⚡",
    "category": "hazard",
    "duration": 15
  },
  {
    "id": 64,
    "name": "Safe Zone",
    "icon": "🟢",
    "category": "defense",
    "duration": 22
  },
  {
    "id": 65,
    "name": "Danger Zone",
    "icon": "🔴",
    "category": "hazard",
    "duration": 29
  },
  {
    "id": 66,
    "name": "Capture Point",
    "icon": "🚩",
    "category": "objective",
    "duration": 36
  },
  {
    "id": 67,
    "name": "King of the Hill",
    "icon": "🏔️",
    "category": "objective",
    "duration": 43
  },
  {
    "id": 68,
    "name": "Escort NPC",
    "icon": "🧑‍🤝‍🧑",
    "category": "objective",
    "duration": 19
  },
  {
    "id": 69,
    "name": "Protect Chest",
    "icon": "📦",
    "category": "objective",
    "duration": 26
  },
  {
    "id": 70,
    "name": "Race",
    "icon": "🏁",
    "category": "objective",
    "duration": 33
  },
  {
    "id": 71,
    "name": "Time Trial",
    "icon": "⏱️",
    "category": "objective",
    "duration": 40
  },
  {
    "id": 72,
    "name": "Survival",
    "icon": "🧟",
    "category": "objective",
    "duration": 16
  },
  {
    "id": 73,
    "name": "Boss Countdown",
    "icon": "⏳",
    "category": "boss",
    "duration": 23
  },
  {
    "id": 74,
    "name": "Final Stand",
    "icon": "🗿",
    "category": "objective",
    "duration": 30
  },
  {
    "id": 75,
    "name": "Last Player Standing",
    "icon": "🏆",
    "category": "objective",
    "duration": 37
  },
  {
    "id": 76,
    "name": "Team Heal",
    "icon": "💚",
    "category": "heal",
    "duration": 44
  },
  {
    "id": 77,
    "name": "Team Shield",
    "icon": "🛡️",
    "category": "defense",
    "duration": 20
  },
  {
    "id": 78,
    "name": "Team Speed",
    "icon": "⚡",
    "category": "boost",
    "duration": 27
  },
  {
    "id": 79,
    "name": "Team Damage",
    "icon": "💥",
    "category": "boost",
    "duration": 34
  },
  {
    "id": 80,
    "name": "Shared Health",
    "icon": "❤️",
    "category": "team",
    "duration": 41
  },
  {
    "id": 81,
    "name": "Health Swap",
    "icon": "🔄",
    "category": "chaos",
    "duration": 17
  },
  {
    "id": 82,
    "name": "Coin Swap",
    "icon": "🪙",
    "category": "chaos",
    "duration": 24
  },
  {
    "id": 83,
    "name": "Random Teleport",
    "icon": "🌀",
    "category": "chaos",
    "duration": 31
  },
  {
    "id": 84,
    "name": "Mystery Box",
    "icon": "❓",
    "category": "reward",
    "duration": 38
  },
  {
    "id": 85,
    "name": "Lucky Spin",
    "icon": "🍀",
    "category": "reward",
    "duration": 45
  },
  {
    "id": 86,
    "name": "Jackpot",
    "icon": "💎",
    "category": "reward",
    "duration": 21
  },
  {
    "id": 87,
    "name": "Rare Drop",
    "icon": "💎",
    "category": "reward",
    "duration": 28
  },
  {
    "id": 88,
    "name": "Legendary Drop",
    "icon": "👑",
    "category": "reward",
    "duration": 35
  },
  {
    "id": 89,
    "name": "XP Rush",
    "icon": "📈",
    "category": "reward",
    "duration": 42
  },
  {
    "id": 90,
    "name": "Level Up Burst",
    "icon": "⬆️",
    "category": "reward",
    "duration": 18
  },
  {
    "id": 91,
    "name": "Enemy Freeze",
    "icon": "🧊",
    "category": "combat",
    "duration": 25
  },
  {
    "id": 92,
    "name": "Player Freeze",
    "icon": "🥶",
    "category": "challenge",
    "duration": 32
  },
  {
    "id": 93,
    "name": "Time Freeze",
    "icon": "⏸️",
    "category": "chaos",
    "duration": 39
  },
  {
    "id": 94,
    "name": "Haste",
    "icon": "⏩",
    "category": "boost",
    "duration": 15
  },
  {
    "id": 95,
    "name": "Rage Mode",
    "icon": "😡",
    "category": "combat",
    "duration": 22
  },
  {
    "id": 96,
    "name": "Peace Mode",
    "icon": "☮️",
    "category": "challenge",
    "duration": 29
  },
  {
    "id": 97,
    "name": "Chaos Mode",
    "icon": "🌀",
    "category": "chaos",
    "duration": 36
  },
  {
    "id": 98,
    "name": "Clone Party",
    "icon": "👥",
    "category": "chaos",
    "duration": 43
  },
  {
    "id": 99,
    "name": "Decoy Attack",
    "icon": "🎭",
    "category": "chaos",
    "duration": 19
  },
  {
    "id": 100,
    "name": "Final Boss",
    "icon": "🐉",
    "category": "boss",
    "duration": 26
  }
];

export function getRandomMultiplayerEvent(lastId = 0) {
    const pool = MULTIPLAYER_EVENTS.filter(e => e.id !== lastId);
    return pool[Math.floor(Math.random() * pool.length)];
}
