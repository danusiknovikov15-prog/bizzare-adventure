// Level 17 - Tidal Towers
export const level17 = {
    name: "Level 17: Tidal Towers",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color - ocean twilight
    backgroundColor: '#0f1520',

    // Vertical tower climbing
    platforms: [
        // Bottom tower base
        { x: 0, y: 550, width: 350, height: 50, color: '#1E90FF' },

        // Tower 1 - left
        { x: 50, y: 480, width: 120, height: 20, color: '#4169E1' },
        { x: 200, y: 420, width: 120, height: 20, color: '#4169E1' },
        { x: 50, y: 360, width: 120, height: 20, color: '#4682B4' },
        { x: 200, y: 300, width: 120, height: 20, color: '#4682B4' },
        { x: 80, y: 240, width: 120, height: 20, color: '#87CEEB' },
        { x: 220, y: 180, width: 120, height: 20, color: '#87CEEB' },

        // Tower 2 - center
        { x: 450, y: 500, width: 200, height: 50, color: '#1E90FF' },
        { x: 480, y: 430, width: 140, height: 20, color: '#4169E1' },
        { x: 500, y: 370, width: 120, height: 20, color: '#4682B4' },
        { x: 520, y: 310, width: 100, height: 20, color: '#4682B4' },
        { x: 500, y: 250, width: 120, height: 20, color: '#87CEEB' },
        { x: 480, y: 190, width: 140, height: 20, color: '#87CEEB' },

        // Tower 3 - right
        { x: 750, y: 550, width: 350, height: 50, color: '#1E90FF' },
        { x: 800, y: 480, width: 120, height: 20, color: '#4169E1' },
        { x: 950, y: 420, width: 120, height: 20, color: '#4169E1' },
        { x: 800, y: 360, width: 120, height: 20, color: '#4682B4' },
        { x: 950, y: 300, width: 120, height: 20, color: '#4682B4' },
        { x: 830, y: 240, width: 120, height: 20, color: '#87CEEB' },
        { x: 980, y: 180, width: 120, height: 20, color: '#87CEEB' },

        // Connecting platforms
        { x: 360, y: 450, width: 80, height: 15, color: '#4682B4' },
        { x: 660, y: 390, width: 80, height: 15, color: '#4682B4' },
        { x: 370, y: 270, width: 100, height: 15, color: '#87CEEB' },
        { x: 650, y: 210, width: 100, height: 15, color: '#87CEEB' },

        // Top platform
        { x: 400, y: 120, width: 250, height: 30, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 1100,
        minY: 0,
        maxY: 600
    },

    // Door position
    door: {
        x: 490,
        y: 40
    },

    // Goal position
    goal: {
        x: 425,
        y: 70,
        width: 100,
        height: 50
    },

    // Enemies: 8 total
    // Level 17: HP = 15 + 16*3 = 63, Damage = 1 + floor(16/3) = 6
    // 3 elites
    enemies: [
        { x: 100, y: 500, isElite: false },
        { x: 120, y: 410, isElite: false },
        { x: 250, y: 250, isElite: true },  // Elite 1
        { x: 550, y: 450, isElite: false },
        { x: 550, y: 320, isElite: true },  // Elite 2
        { x: 850, y: 500, isElite: false },
        { x: 900, y: 350, isElite: false },
        { x: 1030, y: 130, isElite: true }  // Elite 3
    ]
};
