// Level 18 - VOID BOSS BATTLE (Final Boss)
export const level18 = {
    name: "Level 18: Void Dimension",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - dark void
    backgroundColor: '#0a0a0a',

    // Complex arena for teleportation and black holes
    platforms: [
        // Ground floor
        { x: 0, y: 550, width: 1600, height: 50, color: '#4B0082' },

        // Lower scattered platforms - teleport destinations
        { x: 200, y: 480, width: 100, height: 20, color: '#8B00FF' },
        { x: 400, y: 480, width: 100, height: 20, color: '#8B00FF' },
        { x: 600, y: 480, width: 100, height: 20, color: '#8B00FF' },
        { x: 800, y: 480, width: 100, height: 20, color: '#8B00FF' },
        { x: 1000, y: 480, width: 100, height: 20, color: '#8B00FF' },
        { x: 1200, y: 480, width: 100, height: 20, color: '#8B00FF' },
        { x: 1400, y: 480, width: 100, height: 20, color: '#8B00FF' },

        // Mid tier platforms
        { x: 100, y: 400, width: 90, height: 20, color: '#9370DB' },
        { x: 260, y: 400, width: 90, height: 20, color: '#9370DB' },
        { x: 420, y: 400, width: 90, height: 20, color: '#9370DB' },
        { x: 580, y: 400, width: 90, height: 20, color: '#9370DB' },
        { x: 740, y: 400, width: 90, height: 20, color: '#9370DB' },
        { x: 900, y: 400, width: 90, height: 20, color: '#9370DB' },
        { x: 1060, y: 400, width: 90, height: 20, color: '#9370DB' },
        { x: 1220, y: 400, width: 90, height: 20, color: '#9370DB' },
        { x: 1380, y: 400, width: 90, height: 20, color: '#9370DB' },

        // Boss initial platform - center
        { x: 700, y: 330, width: 200, height: 30, color: '#6A0DAD' },

        // High platforms - escape from black holes
        { x: 180, y: 260, width: 120, height: 20, color: '#BA55D3' },
        { x: 1300, y: 260, width: 120, height: 20, color: '#BA55D3' },

        // Ultra high platforms
        { x: 400, y: 200, width: 100, height: 20, color: '#DA70D6' },
        { x: 1100, y: 200, width: 100, height: 20, color: '#DA70D6' },

        // Exit platform
        { x: 1350, y: 140, width: 200, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1600,
        minY: 0,
        maxY: 600
    },

    // Door position (exit to level 19)
    door: {
        x: 1420,
        y: 60
    },

    // Goal position
    goal: {
        x: 1370,
        y: 90,
        width: 100,
        height: 50
    },

    // VOID BOSS - Center platform (strongest boss)
    enemies: [
        { x: 750, y: 270, isBoss: true, bossType: 'void' }
    ]
};
