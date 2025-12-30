// Level 1 - Tutorial level with platforming challenges
export const level1 = {
    name: "Level 1: The Beginning",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 100
    },

    // Background color
    backgroundColor: '#1a1a2e',

    // Platforms layout
    platforms: [
        // Ground floor
        { x: 0, y: 550, width: 400, height: 50, color: '#795548' },

        // Starting area - stairs up
        { x: 350, y: 500, width: 150, height: 30, color: '#795548' },
        { x: 450, y: 450, width: 150, height: 30, color: '#795548' },
        { x: 550, y: 400, width: 150, height: 30, color: '#795548' },

        // Gap - need to jump
        { x: 800, y: 400, width: 200, height: 30, color: '#795548' },

        // High platform - difficult jump
        { x: 1100, y: 300, width: 180, height: 30, color: '#8B4513' },

        // Descending platforms
        { x: 1350, y: 350, width: 150, height: 30, color: '#795548' },
        { x: 1550, y: 400, width: 150, height: 30, color: '#795548' },
        { x: 1750, y: 450, width: 150, height: 30, color: '#795548' },

        // Final ground area
        { x: 1900, y: 500, width: 500, height: 30, color: '#795548' },

        // Small platforms in air (bonus area)
        { x: 200, y: 300, width: 100, height: 20, color: '#A0522D' },
        { x: 350, y: 250, width: 100, height: 20, color: '#A0522D' },
        { x: 500, y: 200, width: 100, height: 20, color: '#A0522D' },

        // Floating island
        { x: 1200, y: 150, width: 200, height: 25, color: '#CD853F' },

        // Moving towards goal
        { x: 2000, y: 400, width: 150, height: 30, color: '#795548' },
        { x: 2200, y: 350, width: 150, height: 30, color: '#795548' },

        // Goal platform
        { x: 2400, y: 300, width: 300, height: 50, color: '#FFD700' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 2800,
        minY: 0,
        maxY: 600
    },

    // Door position (exit to next level)
    door: {
        x: 2550,
        y: 220
    },

    // Goal position (where player needs to reach)
    goal: {
        x: 2500,
        y: 250,
        width: 100,
        height: 50
    },

    // Enemies placement
    enemies: [
        // Starting area enemies
        { x: 200, y: 510 },  // On ground floor

        // Mid-level enemies
        { x: 850, y: 360 },  // On platform after gap

        // Final area before goal
        { x: 2050, y: 360 }, // Guard before goal
        { x: 2250, y: 310 }, // Another guard
    ]
};
