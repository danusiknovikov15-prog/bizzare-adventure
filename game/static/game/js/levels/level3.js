// Level 3 - ACID BOSS BATTLE
export const level3 = {
    name: "Level 3: Acid Boss Arena",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 500
    },

    // Background color
    backgroundColor: '#0f0f1f',

    // Platforms layout
    platforms: [
        // Starting ground
        { x: 0, y: 550, width: 300, height: 50, color: '#5A5A5A' },

        // First tower climb
        { x: 250, y: 500, width: 120, height: 20, color: '#6A6A6A' },
        { x: 320, y: 450, width: 120, height: 20, color: '#6A6A6A' },
        { x: 250, y: 400, width: 120, height: 20, color: '#6A6A6A' },
        { x: 180, y: 350, width: 120, height: 20, color: '#6A6A6A' },

        // Gap jump
        { x: 450, y: 350, width: 150, height: 20, color: '#7A7A7A' },

        // Second section
        { x: 650, y: 400, width: 200, height: 30, color: '#6A6A6A' },
        { x: 900, y: 450, width: 150, height: 20, color: '#6A6A6A' },

        // Descending platforms
        { x: 1100, y: 400, width: 120, height: 20, color: '#7A7A7A' },
        { x: 1270, y: 450, width: 120, height: 20, color: '#7A7A7A' },
        { x: 1440, y: 500, width: 120, height: 20, color: '#7A7A7A' },

        // Long platform with enemies
        { x: 1600, y: 500, width: 500, height: 30, color: '#6A6A6A' },

        // Final climb to goal
        { x: 2100, y: 450, width: 150, height: 20, color: '#7A7A7A' },
        { x: 2200, y: 400, width: 150, height: 20, color: '#7A7A7A' },
        { x: 2100, y: 350, width: 150, height: 20, color: '#7A7A7A' },
        { x: 2000, y: 300, width: 150, height: 20, color: '#7A7A7A' },

        // Goal platform
        { x: 2150, y: 250, width: 300, height: 50, color: '#FFD700' },

        // Bonus upper platforms
        { x: 500, y: 200, width: 150, height: 20, color: '#8A8A8A' },
        { x: 800, y: 180, width: 150, height: 20, color: '#8A8A8A' },
        { x: 1100, y: 200, width: 150, height: 20, color: '#8A8A8A' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 2500,
        minY: 0,
        maxY: 600
    },

    // Door position (exit to level 4)
    door: {
        x: 2295,
        y: 170
    },

    // Goal position
    goal: {
        x: 2200,
        y: 200,
        width: 100,
        height: 50
    },

    // ACID BOSS - Center of arena
    enemies: [
        { x: 1200, y: 440, isBoss: true, bossType: 'acid' }
    ]
};
