// Level 5 - Elite Enemy Arena
export const level5 = {
    name: 'Level 5: Elite Arena',
    playerSpawn: { x: 100, y: 300 },

    platforms: [
        // Ground
        { x: 0, y: 550, width: 1200, height: 50 },

        // Left side platforms
        { x: 50, y: 450, width: 150, height: 20 },
        { x: 80, y: 350, width: 120, height: 20 },

        // Right side platforms
        { x: 1000, y: 450, width: 150, height: 20 },
        { x: 1000, y: 350, width: 120, height: 20 },

        // Center platforms (for combat)
        { x: 300, y: 400, width: 200, height: 20 },
        { x: 700, y: 400, width: 200, height: 20 },
        { x: 500, y: 300, width: 200, height: 20 },

        // Top platform
        { x: 400, y: 150, width: 400, height: 20 },

        // Walls
        { x: 0, y: 0, width: 20, height: 600 },
        { x: 1180, y: 0, width: 20, height: 600 }
    ],

    enemies: [
        // 4 Elite enemies positioned strategically
        { x: 350, y: 350, isElite: true },  // Left center
        { x: 750, y: 350, isElite: true },  // Right center
        { x: 550, y: 250, isElite: true },  // Top center
        { x: 600, y: 500, isElite: true }   // Ground center
    ],

    door: null // No door - must defeat all elites to progress
};
