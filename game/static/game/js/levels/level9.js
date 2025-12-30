// Level 9 - ICE BOSS BATTLE
export const level9 = {
    name: "Level 9: Frozen Fortress",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - icy blue
    backgroundColor: '#0f1f2f',

    // Arena with vertical layers
    platforms: [
        // Ground floor
        { x: 0, y: 550, width: 1200, height: 50, color: '#B0E0E6' },

        // Bottom tier platforms
        { x: 150, y: 480, width: 140, height: 20, color: '#ADD8E6' },
        { x: 400, y: 480, width: 140, height: 20, color: '#ADD8E6' },
        { x: 650, y: 480, width: 140, height: 20, color: '#ADD8E6' },
        { x: 900, y: 480, width: 140, height: 20, color: '#ADD8E6' },

        // Mid tier platforms
        { x: 80, y: 400, width: 120, height: 20, color: '#87CEEB' },
        { x: 280, y: 400, width: 120, height: 20, color: '#87CEEB' },
        { x: 520, y: 400, width: 120, height: 20, color: '#87CEEB' },
        { x: 720, y: 400, width: 120, height: 20, color: '#87CEEB' },
        { x: 920, y: 400, width: 120, height: 20, color: '#87CEEB' },

        // Boss platform - center
        { x: 500, y: 330, width: 200, height: 30, color: '#00CED1' },

        // Upper escape platforms
        { x: 200, y: 260, width: 100, height: 20, color: '#E0FFFF' },
        { x: 800, y: 260, width: 100, height: 20, color: '#E0FFFF' },

        // Exit platform
        { x: 1000, y: 200, width: 180, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1200,
        minY: 0,
        maxY: 600
    },

    // Door position (exit to level 10)
    door: {
        x: 1070,
        y: 120
    },

    // Goal position
    goal: {
        x: 1020,
        y: 150,
        width: 100,
        height: 50
    },

    // ICE BOSS - Center platform
    enemies: [
        { x: 550, y: 270, isBoss: true, bossType: 'ice' }
    ]
};
