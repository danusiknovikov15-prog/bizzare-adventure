// Level 13 - Storm Arena
export const level13 = {
    name: "Level 13: Storm Arena",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - stormy dark yellow
    backgroundColor: '#151510',

    // Combat-focused arena
    platforms: [
        // Ground floor - wide arena
        { x: 0, y: 550, width: 1600, height: 50, color: '#FFD700' },

        // Lower combat platforms
        { x: 200, y: 480, width: 100, height: 20, color: '#FFFF00' },
        { x: 380, y: 480, width: 100, height: 20, color: '#FFFF00' },
        { x: 560, y: 480, width: 100, height: 20, color: '#FFFF00' },
        { x: 740, y: 480, width: 100, height: 20, color: '#FFFF00' },
        { x: 920, y: 480, width: 100, height: 20, color: '#FFFF00' },
        { x: 1100, y: 480, width: 100, height: 20, color: '#FFFF00' },
        { x: 1280, y: 480, width: 100, height: 20, color: '#FFFF00' },

        // Mid platforms - strategic positions
        { x: 150, y: 400, width: 120, height: 20, color: '#FFD700' },
        { x: 350, y: 380, width: 120, height: 20, color: '#FFD700' },
        { x: 550, y: 360, width: 120, height: 20, color: '#FFD700' },
        { x: 750, y: 340, width: 120, height: 20, color: '#FFD700' },
        { x: 950, y: 360, width: 120, height: 20, color: '#FFD700' },
        { x: 1150, y: 380, width: 120, height: 20, color: '#FFD700' },
        { x: 1350, y: 400, width: 120, height: 20, color: '#FFD700' },

        // High platforms - escape routes
        { x: 300, y: 280, width: 100, height: 20, color: '#FFFFE0' },
        { x: 700, y: 250, width: 100, height: 20, color: '#FFFFE0' },
        { x: 1100, y: 280, width: 100, height: 20, color: '#FFFFE0' },

        // Exit platform
        { x: 1400, y: 450, width: 180, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1600,
        minY: 0,
        maxY: 600
    },

    // Door position
    door: {
        x: 1470,
        y: 370
    },

    // Goal position
    goal: {
        x: 1420,
        y: 400,
        width: 100,
        height: 50
    },

    // Enemies: 8 total
    // Level 13: HP = 15 + 12*3 = 51, Damage = 1 + floor(12/3) = 5
    // 2 elites
    enemies: [
        { x: 300, y: 500, isElite: false },
        { x: 500, y: 430, isElite: false },
        { x: 700, y: 500, isElite: true },  // Elite 1
        { x: 850, y: 290, isElite: false },
        { x: 1000, y: 430, isElite: false },
        { x: 1200, y: 500, isElite: true }, // Elite 2
        { x: 400, y: 330, isElite: false },
        { x: 1200, y: 330, isElite: false }
    ]
};
