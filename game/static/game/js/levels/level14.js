// Level 14 - Lightning Gauntlet
export const level14 = {
    name: "Level 14: Lightning Gauntlet",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - electric storm
    backgroundColor: '#0f0f1f',

    // Dense combat level with tight spaces
    platforms: [
        // Ground with gaps
        { x: 0, y: 550, width: 400, height: 50, color: '#FFD700' },
        { x: 500, y: 550, width: 300, height: 50, color: '#FFD700' },
        { x: 900, y: 550, width: 400, height: 50, color: '#FFD700' },
        { x: 1400, y: 550, width: 400, height: 50, color: '#FFD700' },

        // Lower tier - many small platforms
        { x: 150, y: 480, width: 90, height: 20, color: '#FFFF00' },
        { x: 300, y: 460, width: 90, height: 20, color: '#FFFF00' },
        { x: 520, y: 480, width: 90, height: 20, color: '#FFFF00' },
        { x: 670, y: 460, width: 90, height: 20, color: '#FFFF00' },
        { x: 920, y: 480, width: 90, height: 20, color: '#FFFF00' },
        { x: 1070, y: 460, width: 90, height: 20, color: '#FFFF00' },
        { x: 1220, y: 480, width: 90, height: 20, color: '#FFFF00' },
        { x: 1450, y: 480, width: 90, height: 20, color: '#FFFF00' },
        { x: 1600, y: 460, width: 90, height: 20, color: '#FFFF00' },

        // Mid tier
        { x: 200, y: 390, width: 100, height: 20, color: '#FFD700' },
        { x: 400, y: 370, width: 100, height: 20, color: '#FFD700' },
        { x: 600, y: 350, width: 100, height: 20, color: '#FFD700' },
        { x: 800, y: 370, width: 100, height: 20, color: '#FFD700' },
        { x: 1000, y: 350, width: 100, height: 20, color: '#FFD700' },
        { x: 1200, y: 370, width: 100, height: 20, color: '#FFD700' },
        { x: 1400, y: 390, width: 100, height: 20, color: '#FFD700' },

        // Upper tier
        { x: 300, y: 280, width: 110, height: 20, color: '#FFFFE0' },
        { x: 500, y: 260, width: 110, height: 20, color: '#FFFFE0' },
        { x: 900, y: 260, width: 110, height: 20, color: '#FFFFE0' },
        { x: 1100, y: 280, width: 110, height: 20, color: '#FFFFE0' },
        { x: 1300, y: 260, width: 110, height: 20, color: '#FFFFE0' },

        // Exit platform
        { x: 1650, y: 480, width: 150, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1800,
        minY: 0,
        maxY: 600
    },

    // Door position
    door: {
        x: 1710,
        y: 400
    },

    // Goal position
    goal: {
        x: 1670,
        y: 430,
        width: 100,
        height: 50
    },

    // Enemies: 8 total
    // Level 14: HP = 15 + 13*3 = 54, Damage = 1 + floor(13/3) = 5
    // 2 elites
    enemies: [
        { x: 250, y: 500, isElite: false },
        { x: 600, y: 500, isElite: false },
        { x: 450, y: 320, isElite: true },  // Elite 1
        { x: 1000, y: 500, isElite: false },
        { x: 850, y: 320, isElite: false },
        { x: 1250, y: 500, isElite: true }, // Elite 2
        { x: 1150, y: 230, isElite: false },
        { x: 1500, y: 500, isElite: false }
    ]
};
