// Level 7 - Post Fire Boss
export const level7 = {
    name: "Level 7: Scorched Plains",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - dark red
    backgroundColor: '#2a0f0f',

    // Long horizontal level with multiple paths
    platforms: [
        // Ground floor
        { x: 0, y: 550, width: 2800, height: 50, color: '#8B4513' },

        // Lower path - platforming
        { x: 300, y: 480, width: 150, height: 20, color: '#A0522D' },
        { x: 520, y: 450, width: 150, height: 20, color: '#A0522D' },
        { x: 740, y: 420, width: 150, height: 20, color: '#A0522D' },
        { x: 960, y: 400, width: 150, height: 20, color: '#A0522D' },
        { x: 1180, y: 380, width: 150, height: 20, color: '#A0522D' },
        { x: 1400, y: 400, width: 150, height: 20, color: '#A0522D' },
        { x: 1620, y: 420, width: 150, height: 20, color: '#A0522D' },
        { x: 1840, y: 450, width: 150, height: 20, color: '#A0522D' },
        { x: 2060, y: 480, width: 150, height: 20, color: '#A0522D' },

        // Upper path - alternative route
        { x: 400, y: 350, width: 120, height: 20, color: '#CD853F' },
        { x: 600, y: 320, width: 120, height: 20, color: '#CD853F' },
        { x: 800, y: 290, width: 120, height: 20, color: '#CD853F' },
        { x: 1000, y: 260, width: 120, height: 20, color: '#CD853F' },
        { x: 1200, y: 260, width: 120, height: 20, color: '#CD853F' },
        { x: 1400, y: 290, width: 120, height: 20, color: '#CD853F' },
        { x: 1600, y: 320, width: 120, height: 20, color: '#CD853F' },
        { x: 1800, y: 350, width: 120, height: 20, color: '#CD853F' },

        // Exit platform
        { x: 2500, y: 450, width: 250, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 2800,
        minY: 0,
        maxY: 600
    },

    // Door position
    door: {
        x: 2600,
        y: 370
    },

    // Goal position
    goal: {
        x: 2520,
        y: 400,
        width: 100,
        height: 50
    },

    // Enemies: 6 total (level 7 = 3 + floor((7-1)/2) = 6)
    // No elites yet (start at level 5-9, but only 1 elite)
    enemies: [
        { x: 600, y: 500, isElite: false },  // Ground
        { x: 900, y: 350, isElite: false },  // Lower platforms
        { x: 1200, y: 320, isElite: false }, // Upper path
        { x: 1500, y: 350, isElite: false }, // Lower platforms
        { x: 1800, y: 300, isElite: false }, // Upper path
        { x: 2200, y: 500, isElite: true }   // 1 Elite (20% of 5 = 1)
    ]
};
