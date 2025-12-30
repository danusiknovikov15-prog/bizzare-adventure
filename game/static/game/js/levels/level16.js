// Level 16 - Aquatic Depths
export const level16 = {
    name: "Level 16: Aquatic Depths",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - deep ocean
    backgroundColor: '#0a0f1f',

    // Precise platforming with water theme
    platforms: [
        // Ground floor - scattered
        { x: 0, y: 550, width: 250, height: 50, color: '#1E90FF' },
        { x: 350, y: 550, width: 200, height: 50, color: '#1E90FF' },
        { x: 650, y: 550, width: 250, height: 50, color: '#1E90FF' },
        { x: 1000, y: 550, width: 200, height: 50, color: '#1E90FF' },
        { x: 1300, y: 550, width: 300, height: 50, color: '#1E90FF' },

        // Lower platforms - precise jumps
        { x: 280, y: 480, width: 80, height: 20, color: '#4169E1' },
        { x: 420, y: 450, width: 70, height: 20, color: '#4169E1' },
        { x: 570, y: 420, width: 80, height: 20, color: '#4169E1' },
        { x: 720, y: 450, width: 70, height: 20, color: '#4169E1' },
        { x: 860, y: 480, width: 80, height: 20, color: '#4169E1' },
        { x: 1020, y: 460, width: 70, height: 20, color: '#4169E1' },
        { x: 1170, y: 430, width: 80, height: 20, color: '#4169E1' },
        { x: 1320, y: 460, width: 70, height: 20, color: '#4169E1' },
        { x: 1470, y: 480, width: 80, height: 20, color: '#4169E1' },

        // Mid tier - alternating heights
        { x: 200, y: 380, width: 90, height: 20, color: '#4682B4' },
        { x: 350, y: 350, width: 90, height: 20, color: '#4682B4' },
        { x: 500, y: 320, width: 90, height: 20, color: '#4682B4' },
        { x: 650, y: 290, width: 90, height: 20, color: '#4682B4' },
        { x: 800, y: 320, width: 90, height: 20, color: '#4682B4' },
        { x: 950, y: 350, width: 90, height: 20, color: '#4682B4' },
        { x: 1100, y: 320, width: 90, height: 20, color: '#4682B4' },
        { x: 1250, y: 290, width: 90, height: 20, color: '#4682B4' },
        { x: 1400, y: 320, width: 90, height: 20, color: '#4682B4' },

        // Upper tier - challenging
        { x: 400, y: 230, width: 100, height: 20, color: '#87CEEB' },
        { x: 600, y: 200, width: 100, height: 20, color: '#87CEEB' },
        { x: 800, y: 230, width: 100, height: 20, color: '#87CEEB' },
        { x: 1000, y: 200, width: 100, height: 20, color: '#87CEEB' },
        { x: 1200, y: 230, width: 100, height: 20, color: '#87CEEB' },

        // Exit platform
        { x: 1500, y: 450, width: 100, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1650,
        minY: 0,
        maxY: 600
    },

    // Door position
    door: {
        x: 1530,
        y: 370
    },

    // Goal position
    goal: {
        x: 1510,
        y: 400,
        width: 80,
        height: 50
    },

    // Enemies: 8 total
    // Level 16: HP = 15 + 15*3 = 60, Damage = 1 + floor(15/3) = 6
    // 3 elites (30%)
    enemies: [
        { x: 450, y: 500, isElite: false },
        { x: 750, y: 500, isElite: false },
        { x: 500, y: 270, isElite: true },  // Elite 1
        { x: 900, y: 300, isElite: false },
        { x: 1100, y: 500, isElite: true }, // Elite 2
        { x: 700, y: 150, isElite: false },
        { x: 1300, y: 270, isElite: true }, // Elite 3
        { x: 1450, y: 500, isElite: false }
    ]
};
