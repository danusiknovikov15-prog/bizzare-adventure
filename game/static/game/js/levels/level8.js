// Level 8 - Volcanic Ascent
export const level8 = {
    name: "Level 8: Volcanic Ascent",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - volcanic
    backgroundColor: '#1a0a00',

    // Vertical climbing level
    platforms: [
        // Bottom
        { x: 0, y: 550, width: 400, height: 50, color: '#8B4513' },

        // Ascending platforms - zigzag pattern
        { x: 300, y: 480, width: 140, height: 20, color: '#A0522D' },
        { x: 100, y: 410, width: 140, height: 20, color: '#A0522D' },
        { x: 300, y: 340, width: 140, height: 20, color: '#A0522D' },
        { x: 500, y: 340, width: 140, height: 20, color: '#A0522D' },
        { x: 700, y: 340, width: 140, height: 20, color: '#A0522D' },
        { x: 900, y: 340, width: 140, height: 20, color: '#A0522D' },
        { x: 1100, y: 280, width: 140, height: 20, color: '#CD853F' },
        { x: 900, y: 220, width: 140, height: 20, color: '#CD853F' },
        { x: 1100, y: 160, width: 140, height: 20, color: '#CD853F' },
        { x: 1300, y: 160, width: 140, height: 20, color: '#CD853F' },
        { x: 1500, y: 160, width: 140, height: 20, color: '#CD853F' },

        // Side platforms
        { x: 600, y: 270, width: 100, height: 20, color: '#DEB887' },
        { x: 1300, y: 100, width: 100, height: 20, color: '#DEB887' },

        // Exit platform
        { x: 1650, y: 100, width: 200, height: 30, color: '#FFD700' },
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
        x: 1730,
        y: 20
    },

    // Goal position
    goal: {
        x: 1670,
        y: 50,
        width: 100,
        height: 50
    },

    // Enemies: 6 total
    // Level 8: HP = 15 + 7*3 = 36, Damage = 1 + floor(7/3) = 3
    enemies: [
        { x: 350, y: 430, isElite: false },
        { x: 550, y: 290, isElite: false },
        { x: 800, y: 290, isElite: false },
        { x: 1000, y: 230, isElite: false },
        { x: 1200, y: 110, isElite: false },
        { x: 1400, y: 110, isElite: true }  // 1 Elite
    ]
};
