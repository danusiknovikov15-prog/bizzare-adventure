// Level 12 - LIGHTNING BOSS BATTLE
export const level12 = {
    name: "Level 12: Thunder Dome",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - electric yellow/dark
    backgroundColor: '#1f1f0f',

    // Dynamic arena with cover platforms
    platforms: [
        // Ground floor
        { x: 0, y: 550, width: 1300, height: 50, color: '#FFD700' },

        // Cover platforms - hide from rapid fire
        { x: 150, y: 490, width: 80, height: 20, color: '#FFFF00' },
        { x: 300, y: 490, width: 80, height: 20, color: '#FFFF00' },
        { x: 450, y: 490, width: 80, height: 20, color: '#FFFF00' },
        { x: 600, y: 490, width: 80, height: 20, color: '#FFFF00' },
        { x: 750, y: 490, width: 80, height: 20, color: '#FFFF00' },
        { x: 900, y: 490, width: 80, height: 20, color: '#FFFF00' },
        { x: 1050, y: 490, width: 80, height: 20, color: '#FFFF00' },

        // Mid platforms - movement options
        { x: 220, y: 420, width: 100, height: 20, color: '#FFD700' },
        { x: 380, y: 420, width: 100, height: 20, color: '#FFD700' },
        { x: 680, y: 420, width: 100, height: 20, color: '#FFD700' },
        { x: 840, y: 420, width: 100, height: 20, color: '#FFD700' },
        { x: 1000, y: 420, width: 100, height: 20, color: '#FFD700' },

        // Boss platform - elevated
        { x: 550, y: 350, width: 200, height: 30, color: '#FFA500' },

        // High platforms
        { x: 100, y: 280, width: 100, height: 20, color: '#FFFFE0' },
        { x: 1100, y: 280, width: 100, height: 20, color: '#FFFFE0' },

        // Exit platform
        { x: 1100, y: 210, width: 180, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1300,
        minY: 0,
        maxY: 600
    },

    // Door position (exit to level 13)
    door: {
        x: 1160,
        y: 130
    },

    // Goal position
    goal: {
        x: 1120,
        y: 160,
        width: 100,
        height: 50
    },

    // LIGHTNING BOSS - Center platform
    enemies: [
        { x: 600, y: 290, isBoss: true, bossType: 'lightning' }
    ]
};
