// Level 6 - FIRE BOSS BATTLE
export const level6 = {
    name: "Level 6: Inferno Arena",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - fiery red
    backgroundColor: '#1f0f0f',

    // Arena layout - wider for fire zones
    platforms: [
        // Ground floor - wide arena
        { x: 0, y: 550, width: 1400, height: 50, color: '#8B4513' },

        // Lower platforms
        { x: 200, y: 480, width: 150, height: 20, color: '#A0522D' },
        { x: 500, y: 480, width: 150, height: 20, color: '#A0522D' },
        { x: 800, y: 480, width: 150, height: 20, color: '#A0522D' },
        { x: 1050, y: 480, width: 150, height: 20, color: '#A0522D' },

        // Mid platforms
        { x: 350, y: 400, width: 120, height: 20, color: '#CD853F' },
        { x: 650, y: 400, width: 120, height: 20, color: '#CD853F' },
        { x: 925, y: 400, width: 120, height: 20, color: '#CD853F' },

        // Boss platform - center
        { x: 600, y: 350, width: 200, height: 30, color: '#FF4500' },

        // High platforms (escape fire)
        { x: 100, y: 300, width: 100, height: 20, color: '#DEB887' },
        { x: 1200, y: 300, width: 100, height: 20, color: '#DEB887' },

        // Exit platform
        { x: 1250, y: 220, width: 150, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1400,
        minY: 0,
        maxY: 600
    },

    // Door position (exit to level 7) - unlocks after boss defeat
    door: {
        x: 1290,
        y: 140
    },

    // Goal position
    goal: {
        x: 1265,
        y: 170,
        width: 100,
        height: 50
    },

    // FIRE BOSS - Center platform
    enemies: [
        { x: 650, y: 290, isBoss: true, bossType: 'fire' }
    ]
};
