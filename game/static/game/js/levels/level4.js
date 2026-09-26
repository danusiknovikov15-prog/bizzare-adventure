// Level 4 - Boss Level
export const level4 = {
    name: "Level 4: Boss Arena",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 400
    },

    // Background color (darker for boss level)
    backgroundColor: '#0d0d1a',

    // Platforms layout (arena style)
    platforms: [
        // Ground floor
        { x: 0, y: 550, width: 1200, height: 50, color: '#4A4A4A' },

        // Side platforms
        { x: 50, y: 450, width: 150, height: 20, color: '#5A5A5A' },
        { x: 1000, y: 450, width: 150, height: 20, color: '#5A5A5A' },

        // Center boss platform
        { x: 450, y: 500, width: 300, height: 50, color: '#5A5A5A' },

        // Upper platforms
        { x: 250, y: 350, width: 200, height: 20, color: '#6A6A6A' },
        { x: 750, y: 350, width: 200, height: 20, color: '#6A6A6A' },

        // Arena walls (left and right boundaries)
        { x: 0, y: 0, width: 20, height: 600, color: '#2A2A2A' },
        { x: 1180, y: 0, width: 20, height: 600, color: '#2A2A2A' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1200,
        minY: 0,
        maxY: 600
    },

    // Portal to Level 5 — appears after the boss fight is cleared.
    // Placed at the right side of the arena so the player can walk into it.
    door: {
        x: 1100,
        y: 470
    },

    // Boss placement (one boss in the center) + Zombie Archers
    enemies: [
        { x: 540, y: 350, isBoss: true },  // Boss on center platform (y: 500 - 150 = 350)
        { x: 100, y: 390, isZombieArcher: true },  // Zombie archer on left platform
        { x: 1050, y: 390, isZombieArcher: true },  // Zombie archer on right platform
        { x: 300, y: 290, isZombieArcher: true },  // Zombie archer on upper left platform
        { x: 850, y: 290, isZombieArcher: true }   // Zombie archer on upper right platform
    ]
};
