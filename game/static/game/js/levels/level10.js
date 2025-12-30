// Level 10 - Frozen Heights
export const level10 = {
    name: "Level 10: Frozen Heights",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - icy
    backgroundColor: '#0a0f1f',

    // Vertical climb with ice theme
    platforms: [
        // Ground
        { x: 0, y: 550, width: 500, height: 50, color: '#B0E0E6' },

        // Ascending path
        { x: 400, y: 480, width: 150, height: 20, color: '#ADD8E6' },
        { x: 250, y: 420, width: 150, height: 20, color: '#ADD8E6' },
        { x: 450, y: 360, width: 150, height: 20, color: '#ADD8E6' },
        { x: 650, y: 360, width: 150, height: 20, color: '#ADD8E6' },
        { x: 850, y: 320, width: 150, height: 20, color: '#87CEEB' },
        { x: 1050, y: 280, width: 150, height: 20, color: '#87CEEB' },
        { x: 900, y: 220, width: 150, height: 20, color: '#87CEEB' },
        { x: 1100, y: 160, width: 150, height: 20, color: '#E0FFFF' },
        { x: 1300, y: 120, width: 150, height: 20, color: '#E0FFFF' },
        { x: 1500, y: 160, width: 150, height: 20, color: '#E0FFFF' },

        // Side platforms for safety
        { x: 100, y: 350, width: 100, height: 20, color: '#87CEEB' },
        { x: 750, y: 240, width: 100, height: 20, color: '#E0FFFF' },

        // Exit platform
        { x: 1700, y: 200, width: 180, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1900,
        minY: 0,
        maxY: 600
    },

    // Door position
    door: {
        x: 1760,
        y: 120
    },

    // Goal position
    goal: {
        x: 1720,
        y: 150,
        width: 100,
        height: 50
    },

    // Enemies: 7 total (3 + floor(9/2) = 7)
    // Level 10: HP = 15 + 9*3 = 42, Damage = 1 + floor(9/3) = 4
    // 1-2 elites
    enemies: [
        { x: 500, y: 430, isElite: false },
        { x: 350, y: 370, isElite: false },
        { x: 750, y: 310, isElite: false },
        { x: 950, y: 270, isElite: false },
        { x: 1000, y: 170, isElite: true },  // Elite 1
        { x: 1200, y: 110, isElite: false },
        { x: 1400, y: 110, isElite: true }   // Elite 2
    ]
};
