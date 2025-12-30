// Level 20 - FINAL CHALLENGE
export const level20 = {
    name: "Level 20: The Final Trial",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - ultimate void
    backgroundColor: '#000000',

    // Epic final level - combines all previous challenges
    platforms: [
        // Starting area
        { x: 0, y: 550, width: 400, height: 50, color: '#4B0082' },

        // Section 1: Precision jumps (Void theme)
        { x: 450, y: 500, width: 80, height: 15, color: '#8B00FF' },
        { x: 580, y: 470, width: 70, height: 15, color: '#8B00FF' },
        { x: 700, y: 440, width: 80, height: 15, color: '#8B00FF' },
        { x: 830, y: 410, width: 70, height: 15, color: '#8B00FF' },
        { x: 950, y: 380, width: 80, height: 15, color: '#8B00FF' },

        // Section 2: Water-themed platforms
        { x: 1100, y: 550, width: 300, height: 50, color: '#1E90FF' },
        { x: 1150, y: 480, width: 90, height: 20, color: '#4169E1' },
        { x: 1280, y: 450, width: 90, height: 20, color: '#4169E1' },
        { x: 1150, y: 380, width: 120, height: 20, color: '#4682B4' },
        { x: 1300, y: 350, width: 100, height: 20, color: '#4682B4' },

        // Section 3: Ice-themed vertical climb
        { x: 1500, y: 550, width: 250, height: 50, color: '#B0E0E6' },
        { x: 1550, y: 480, width: 100, height: 20, color: '#ADD8E6' },
        { x: 1650, y: 420, width: 100, height: 20, color: '#ADD8E6' },
        { x: 1550, y: 360, width: 100, height: 20, color: '#87CEEB' },
        { x: 1650, y: 300, width: 100, height: 20, color: '#87CEEB' },
        { x: 1550, y: 240, width: 120, height: 20, color: '#E0FFFF' },

        // Section 4: Lightning gauntlet
        { x: 1800, y: 550, width: 300, height: 50, color: '#FFD700' },
        { x: 1850, y: 480, width: 80, height: 15, color: '#FFFF00' },
        { x: 1980, y: 450, width: 80, height: 15, color: '#FFFF00' },
        { x: 1880, y: 390, width: 90, height: 20, color: '#FFD700' },
        { x: 2020, y: 360, width: 90, height: 20, color: '#FFD700' },
        { x: 1900, y: 300, width: 100, height: 20, color: '#FFFFE0' },
        { x: 2050, y: 270, width: 100, height: 20, color: '#FFFFE0' },

        // Section 5: Fire ascent
        { x: 2200, y: 550, width: 300, height: 50, color: '#8B4513' },
        { x: 2250, y: 480, width: 100, height: 20, color: '#A0522D' },
        { x: 2380, y: 430, width: 100, height: 20, color: '#A0522D' },
        { x: 2270, y: 370, width: 100, height: 20, color: '#CD853F' },
        { x: 2400, y: 320, width: 100, height: 20, color: '#CD853F' },
        { x: 2280, y: 260, width: 120, height: 20, color: '#DEB887' },

        // Final platforms - multi-level arena
        { x: 2550, y: 550, width: 450, height: 50, color: '#4B0082' },
        { x: 2600, y: 480, width: 120, height: 20, color: '#8B00FF' },
        { x: 2780, y: 480, width: 120, height: 20, color: '#8B00FF' },
        { x: 2650, y: 410, width: 100, height: 20, color: '#9370DB' },
        { x: 2800, y: 410, width: 100, height: 20, color: '#9370DB' },
        { x: 2600, y: 340, width: 140, height: 20, color: '#BA55D3' },
        { x: 2800, y: 340, width: 140, height: 20, color: '#BA55D3' },
        { x: 2670, y: 270, width: 120, height: 20, color: '#DA70D6' },
        { x: 2840, y: 270, width: 120, height: 20, color: '#DA70D6' },

        // VICTORY platform
        { x: 2700, y: 180, width: 250, height: 40, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 3000,
        minY: 0,
        maxY: 600
    },

    // Door position (FINAL DOOR!)
    door: {
        x: 2800,
        y: 80
    },

    // Goal position (FINAL GOAL!)
    goal: {
        x: 2725,
        y: 120,
        width: 200,
        height: 60
    },

    // Enemies: 8 total (max)
    // Level 20: HP = 15 + 19*3 = 72, Damage = 1 + floor(19/3) = 7
    // 3 elites (30%) - FINAL CHALLENGE
    enemies: [
        { x: 600, y: 450, isElite: false },   // Section 1
        { x: 1200, y: 500, isElite: false },  // Section 2
        { x: 1350, y: 300, isElite: true },   // Elite 1 - Section 2
        { x: 1600, y: 500, isElite: false },  // Section 3
        { x: 1900, y: 500, isElite: false },  // Section 4
        { x: 2100, y: 220, isElite: true },   // Elite 2 - Section 4
        { x: 2350, y: 500, isElite: false },  // Section 5
        { x: 2750, y: 320, isElite: true }    // Elite 3 - FINAL GUARDIAN
    ]
};
