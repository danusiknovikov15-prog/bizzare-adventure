/**
 * Castle Background Generator
 * Generates ruined castle backgrounds for all levels
 */

export function generateCastleBackground(levelNumber, levelWidth = 3000, levelHeight = 600) {
    const blocks = [];

    // Variation based on level number
    const seed = levelNumber * 123;
    const random = (min, max) => {
        const x = Math.sin(seed + blocks.length) * 10000;
        return min + (x - Math.floor(x)) * (max - min);
    };

    // Night sky background - very dark
    const skyColor = '#0a0a1a';

    // Castle silhouette - far in the background
    addCastleSilhouette(blocks, levelWidth, levelHeight, random);

    // Ruined walls and structures
    addRuinedStructures(blocks, levelWidth, levelHeight, random);

    // Towers at various heights
    addTowers(blocks, levelWidth, levelHeight, random);

    // Windows with occasional lights
    addWindows(blocks, levelWidth, levelHeight, random);

    // Broken bridges and walkways
    addBridges(blocks, levelWidth, levelHeight, random);

    return {
        backgroundColor: skyColor,
        backgroundBlocks: blocks
    };
}

function addCastleSilhouette(blocks, levelWidth, levelHeight, random) {
    // Large castle structure in far background (top of screen)
    const castleY = 50;
    const castleHeight = 150;

    // Main castle body
    blocks.push({
        x: levelWidth * 0.6,
        y: castleY,
        width: 300,
        height: castleHeight,
        type: 'dark_stone'
    });

    // Left tower
    blocks.push({
        x: levelWidth * 0.55,
        y: castleY - 50,
        width: 60,
        height: castleHeight + 50,
        type: 'tower'
    });

    // Right tower
    blocks.push({
        x: levelWidth * 0.85,
        y: castleY - 30,
        width: 70,
        height: castleHeight + 30,
        type: 'tower'
    });

    // Central tall tower
    blocks.push({
        x: levelWidth * 0.72,
        y: castleY - 80,
        width: 50,
        height: castleHeight + 80,
        type: 'tower'
    });
}

function addRuinedStructures(blocks, levelWidth, levelHeight, random) {
    // Scattered ruined walls throughout the level
    const numWalls = 5 + Math.floor(random(0, 3));

    for (let i = 0; i < numWalls; i++) {
        const wallX = random(100, levelWidth - 200);
        const wallY = levelHeight - random(200, 350);
        const wallWidth = random(80, 150);
        const wallHeight = random(100, 200);

        const wallType = random(0, 1) > 0.6 ? 'ruins' : 'cracked_stone';

        blocks.push({
            x: wallX,
            y: wallY,
            width: wallWidth,
            height: wallHeight,
            type: wallType
        });
    }

    // Mossy stones near ground level
    const numMossy = 3 + Math.floor(random(0, 2));
    for (let i = 0; i < numMossy; i++) {
        blocks.push({
            x: random(50, levelWidth - 100),
            y: levelHeight - random(80, 150),
            width: random(60, 100),
            height: random(50, 80),
            type: 'moss_stone'
        });
    }
}

function addTowers(blocks, levelWidth, levelHeight, random) {
    // Add 2-4 tower structures at different positions
    const numTowers = 2 + Math.floor(random(0, 2));

    for (let i = 0; i < numTowers; i++) {
        const towerX = random(200, levelWidth - 300);
        const towerHeight = random(200, 350);
        const towerY = levelHeight - towerHeight - 50; // Slightly above ground

        blocks.push({
            x: towerX,
            y: towerY,
            width: random(50, 80),
            height: towerHeight,
            type: random(0, 1) > 0.5 ? 'tower' : 'dark_stone'
        });
    }
}

function addWindows(blocks, levelWidth, levelHeight, random) {
    // Add windows to existing structures
    // Small lit or dark windows scattered across the background
    const numWindows = 8 + Math.floor(random(0, 5));

    for (let i = 0; i < numWindows; i++) {
        const windowX = random(100, levelWidth - 100);
        const windowY = random(100, levelHeight - 200);
        const isLit = random(0, 1) > 0.7; // 30% chance of being lit

        blocks.push({
            x: windowX,
            y: windowY,
            width: random(20, 35),
            height: random(25, 40),
            type: isLit ? 'window_lit' : 'window_dark'
        });
    }
}

function addBridges(blocks, levelWidth, levelHeight, random) {
    // Broken bridges connecting towers or walls
    const numBridges = 1 + Math.floor(random(0, 2));

    for (let i = 0; i < numBridges; i++) {
        const bridgeX = random(300, levelWidth - 400);
        const bridgeY = levelHeight - random(250, 400);
        const bridgeWidth = random(150, 250);

        blocks.push({
            x: bridgeX,
            y: bridgeY,
            width: bridgeWidth,
            height: 20,
            type: 'bridge'
        });
    }
}

// Pre-generate backgrounds for all 20 levels
export const castleBackgrounds = {};
for (let i = 1; i <= 20; i++) {
    castleBackgrounds[`level${i}`] = generateCastleBackground(i);
}
