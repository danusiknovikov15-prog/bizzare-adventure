// Level 15 - WATER BOSS BATTLE
export const level15 = {
    name: "Level 15: Aqua Arena",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - deep water blue
    backgroundColor: '#0f1f3f',

    // Arena with space for healing pools and knockback
    platforms: [
        // Wide ground floor
        { x: 0, y: 550, width: 1500, height: 50, color: '#1E90FF' },

        // Lower tier - scattered platforms
        { x: 180, y: 485, width: 130, height: 20, color: '#4169E1' },
        { x: 380, y: 485, width: 130, height: 20, color: '#4169E1' },
        { x: 580, y: 485, width: 130, height: 20, color: '#4169E1' },
        { x: 780, y: 485, width: 130, height: 20, color: '#4169E1' },
        { x: 980, y: 485, width: 130, height: 20, color: '#4169E1' },
        { x: 1180, y: 485, width: 130, height: 20, color: '#4169E1' },

        // Mid tier platforms
        { x: 100, y: 410, width: 110, height: 20, color: '#4682B4' },
        { x: 280, y: 410, width: 110, height: 20, color: '#4682B4' },
        { x: 460, y: 410, width: 110, height: 20, color: '#4682B4' },
        { x: 640, y: 410, width: 110, height: 20, color: '#4682B4' },
        { x: 820, y: 410, width: 110, height: 20, color: '#4682B4' },
        { x: 1000, y: 410, width: 110, height: 20, color: '#4682B4' },
        { x: 1180, y: 410, width: 110, height: 20, color: '#4682B4' },

        // Boss platform - central
        { x: 650, y: 340, width: 200, height: 30, color: '#00CED1' },

        // Upper platforms
        { x: 150, y: 270, width: 120, height: 20, color: '#87CEEB' },
        { x: 1230, y: 270, width: 120, height: 20, color: '#87CEEB' },

        // Exit platform
        { x: 1280, y: 200, width: 180, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1500,
        minY: 0,
        maxY: 600
    },

    // Door position (exit to level 16)
    door: {
        x: 1340,
        y: 120
    },

    // Goal position
    goal: {
        x: 1300,
        y: 150,
        width: 100,
        height: 50
    },

    // WATER BOSS - Center platform
    enemies: [
        { x: 700, y: 280, isBoss: true, bossType: 'water' }
    ]
};
