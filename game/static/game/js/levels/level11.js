// Level 11 - Crystal Caverns
export const level11 = {
    name: "Level 11: Crystal Caverns",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - deep ice cave
    backgroundColor: '#050a15',

    // Complex multi-level cave
    platforms: [
        // Ground floor
        { x: 0, y: 550, width: 600, height: 50, color: '#B0E0E6' },
        { x: 800, y: 550, width: 400, height: 50, color: '#B0E0E6' },
        { x: 1400, y: 550, width: 600, height: 50, color: '#B0E0E6' },

        // Lower level
        { x: 150, y: 480, width: 120, height: 20, color: '#ADD8E6' },
        { x: 350, y: 450, width: 120, height: 20, color: '#ADD8E6' },
        { x: 900, y: 480, width: 120, height: 20, color: '#ADD8E6' },
        { x: 1100, y: 450, width: 120, height: 20, color: '#ADD8E6' },
        { x: 1500, y: 480, width: 120, height: 20, color: '#ADD8E6' },
        { x: 1700, y: 450, width: 120, height: 20, color: '#ADD8E6' },

        // Mid level
        { x: 250, y: 380, width: 110, height: 20, color: '#87CEEB' },
        { x: 450, y: 350, width: 110, height: 20, color: '#87CEEB' },
        { x: 650, y: 320, width: 110, height: 20, color: '#87CEEB' },
        { x: 850, y: 350, width: 110, height: 20, color: '#87CEEB' },
        { x: 1050, y: 320, width: 110, height: 20, color: '#87CEEB' },
        { x: 1250, y: 350, width: 110, height: 20, color: '#87CEEB' },
        { x: 1450, y: 380, width: 110, height: 20, color: '#87CEEB' },
        { x: 1650, y: 350, width: 110, height: 20, color: '#87CEEB' },

        // Upper level
        { x: 400, y: 250, width: 100, height: 20, color: '#E0FFFF' },
        { x: 700, y: 220, width: 100, height: 20, color: '#E0FFFF' },
        { x: 1000, y: 200, width: 100, height: 20, color: '#E0FFFF' },
        { x: 1300, y: 220, width: 100, height: 20, color: '#E0FFFF' },
        { x: 1600, y: 250, width: 100, height: 20, color: '#E0FFFF' },

        // Exit platform
        { x: 1850, y: 480, width: 150, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 2000,
        minY: 0,
        maxY: 600
    },

    // Door position
    door: {
        x: 1910,
        y: 400
    },

    // Goal position
    goal: {
        x: 1870,
        y: 430,
        width: 100,
        height: 50
    },

    // Enemies: 8 total (3 + floor(10/2) = 8, max 8)
    // Level 11: HP = 15 + 10*3 = 45, Damage = 1 + floor(10/3) = 4
    // 2 elites (25%)
    enemies: [
        { x: 400, y: 500, isElite: false },
        { x: 250, y: 430, isElite: false },
        { x: 700, y: 270, isElite: false },
        { x: 1000, y: 500, isElite: true },  // Elite 1
        { x: 1200, y: 300, isElite: false },
        { x: 1100, y: 150, isElite: false },
        { x: 1600, y: 300, isElite: true },  // Elite 2
        { x: 1750, y: 500, isElite: false }
    ]
};
