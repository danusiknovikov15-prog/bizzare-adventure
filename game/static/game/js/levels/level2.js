// Level 2 - Advanced level with more enemies and challenges
export const level2 = {
    name: "Level 2: The Gauntlet",

    // Player spawn point
    playerSpawn: {
        x: 100,
        y: 100
    },

    // Background color
    backgroundColor: '#0d1b2a',

    // Platforms layout
    platforms: [
        // Starting area - ground floor
        { x: 0, y: 550, width: 500, height: 50, color: '#415a77' },

        // First challenge - multiple gaps
        { x: 600, y: 500, width: 120, height: 30, color: '#415a77' },
        { x: 800, y: 480, width: 120, height: 30, color: '#415a77' },
        { x: 1000, y: 460, width: 120, height: 30, color: '#415a77' },
        { x: 1200, y: 440, width: 120, height: 30, color: '#415a77' },

        // High platform section
        { x: 1400, y: 350, width: 200, height: 30, color: '#778da9' },
        { x: 1700, y: 300, width: 180, height: 30, color: '#778da9' },
        { x: 2000, y: 250, width: 160, height: 30, color: '#778da9' },

        // Tower climb
        { x: 2250, y: 500, width: 150, height: 30, color: '#415a77' },
        { x: 2300, y: 450, width: 100, height: 20, color: '#415a77' },
        { x: 2350, y: 400, width: 100, height: 20, color: '#415a77' },
        { x: 2300, y: 350, width: 100, height: 20, color: '#415a77' },
        { x: 2350, y: 300, width: 100, height: 20, color: '#415a77' },
        { x: 2300, y: 250, width: 100, height: 20, color: '#415a77' },

        // Floating islands
        { x: 500, y: 350, width: 150, height: 25, color: '#1b263b' },
        { x: 800, y: 280, width: 150, height: 25, color: '#1b263b' },
        { x: 1100, y: 250, width: 150, height: 25, color: '#1b263b' },

        // Final platform area
        { x: 2600, y: 400, width: 300, height: 30, color: '#415a77' },
        { x: 3000, y: 350, width: 300, height: 30, color: '#415a77' },

        // Goal platform (with door)
        { x: 3400, y: 450, width: 400, height: 50, color: '#FFD700' },

        // Ground safety (prevent falling to death)
        { x: 0, y: 600, width: 4000, height: 50, color: '#0a0e27' },
    ],

    // Level bounds
    bounds: {
        minX: 0,
        maxX: 3900,
        minY: 0,
        maxY: 650
    },

    // Door position (exit to next level)
    door: {
        x: 3600,
        y: 370
    },

    // Goal position (area near door)
    goal: {
        x: 3500,
        y: 400,
        width: 250,
        height: 50
    },

    // Enemies placement (more enemies than level 1)
    enemies: [
        // Starting area
        { x: 250, y: 510 },
        { x: 400, y: 510 },

        // Gap challenge area
        { x: 650, y: 460 },
        { x: 850, y: 440 },
        { x: 1050, y: 420 },

        // High platform section
        { x: 1450, y: 310 },
        { x: 1750, y: 260 },
        { x: 2050, y: 210 },

        // Tower climb guards
        { x: 2300, y: 410 },
        { x: 2350, y: 260 },

        // Floating islands
        { x: 550, y: 310 },
        { x: 850, y: 240 },

        // Final platform area - tough guards
        { x: 2650, y: 360 },
        { x: 2850, y: 360 },
        { x: 3050, y: 310 },
        { x: 3250, y: 310 },

        // Boss area (before door)
        { x: 3500, y: 410 },
        { x: 3700, y: 410 },
    ]
};
