// Level 19 - Void Aftermath
export const level19 = {
    name: "Level 19: Void Aftermath",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - dark void
    backgroundColor: '#050505',

    // Final challenge - combination of all mechanics
    platforms: [
        // Ground floor with gaps
        { x: 0, y: 550, width: 300, height: 50, color: '#4B0082' },
        { x: 400, y: 550, width: 250, height: 50, color: '#4B0082' },
        { x: 750, y: 550, width: 300, height: 50, color: '#4B0082' },
        { x: 1150, y: 550, width: 250, height: 50, color: '#4B0082' },
        { x: 1500, y: 550, width: 400, height: 50, color: '#4B0082' },

        // Lower tier - scattered small platforms
        { x: 150, y: 480, width: 80, height: 15, color: '#8B00FF' },
        { x: 320, y: 460, width: 70, height: 15, color: '#8B00FF' },
        { x: 450, y: 480, width: 80, height: 15, color: '#8B00FF' },
        { x: 600, y: 460, width: 70, height: 15, color: '#8B00FF' },
        { x: 800, y: 480, width: 80, height: 15, color: '#8B00FF' },
        { x: 950, y: 460, width: 70, height: 15, color: '#8B00FF' },
        { x: 1200, y: 480, width: 80, height: 15, color: '#8B00FF' },
        { x: 1350, y: 460, width: 70, height: 15, color: '#8B00FF' },
        { x: 1550, y: 480, width: 80, height: 15, color: '#8B00FF' },
        { x: 1700, y: 460, width: 70, height: 15, color: '#8B00FF' },

        // Mid tier - alternating
        { x: 200, y: 400, width: 90, height: 18, color: '#9370DB' },
        { x: 370, y: 370, width: 90, height: 18, color: '#9370DB' },
        { x: 520, y: 340, width: 90, height: 18, color: '#9370DB' },
        { x: 670, y: 310, width: 90, height: 18, color: '#9370DB' },
        { x: 820, y: 340, width: 90, height: 18, color: '#9370DB' },
        { x: 970, y: 370, width: 90, height: 18, color: '#9370DB' },
        { x: 1120, y: 340, width: 90, height: 18, color: '#9370DB' },
        { x: 1270, y: 310, width: 90, height: 18, color: '#9370DB' },
        { x: 1420, y: 340, width: 90, height: 18, color: '#9370DB' },
        { x: 1570, y: 370, width: 90, height: 18, color: '#9370DB' },

        // Upper tier - difficult jumps
        { x: 300, y: 260, width: 100, height: 20, color: '#BA55D3' },
        { x: 500, y: 230, width: 90, height: 20, color: '#BA55D3' },
        { x: 700, y: 200, width: 100, height: 20, color: '#BA55D3' },
        { x: 900, y: 230, width: 90, height: 20, color: '#BA55D3' },
        { x: 1100, y: 200, width: 100, height: 20, color: '#BA55D3' },
        { x: 1300, y: 230, width: 90, height: 20, color: '#BA55D3' },
        { x: 1500, y: 260, width: 100, height: 20, color: '#BA55D3' },

        // High path - expert only
        { x: 400, y: 150, width: 110, height: 20, color: '#DA70D6' },
        { x: 650, y: 120, width: 110, height: 20, color: '#DA70D6' },
        { x: 900, y: 150, width: 110, height: 20, color: '#DA70D6' },
        { x: 1150, y: 120, width: 110, height: 20, color: '#DA70D6' },
        { x: 1400, y: 150, width: 110, height: 20, color: '#DA70D6' },

        // Exit platform
        { x: 1750, y: 480, width: 150, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1950,
        minY: 0,
        maxY: 600
    },

    // Door position
    door: {
        x: 1810,
        y: 400
    },

    // Goal position
    goal: {
        x: 1770,
        y: 430,
        width: 100,
        height: 50
    },

    // Enemies: 8 total (max)
    // Level 19: HP = 15 + 18*3 = 69, Damage = 1 + floor(18/3) = 7
    // 3 elites (30%)
    enemies: [
        { x: 500, y: 500, isElite: false },
        { x: 450, y: 430, isElite: true },  // Elite 1
        { x: 900, y: 500, isElite: false },
        { x: 750, y: 260, isElite: false },
        { x: 1100, y: 150, isElite: true }, // Elite 2
        { x: 1300, y: 500, isElite: false },
        { x: 1450, y: 290, isElite: true }, // Elite 3
        { x: 1650, y: 500, isElite: false }
    ]
};
