// Main entry point for the game
import { Game } from './engine/Game.js';
import { Physics } from './engine/Physics.js';
import { Renderer } from './engine/Renderer.js';
import { CombatSystem } from './engine/CombatSystem.js';
import { Player } from './entities/Player.js';
import { InputManager } from './controls/InputManager.js';
import { VirtualJoystick } from './controls/VirtualJoystick.js';
import { ActionButtons } from './controls/ActionButtons.js';
import { LevelManager } from './levels/LevelManager.js';
import { level1 } from './levels/level1.js';
import { level2 } from './levels/level2.js';
import { level3 } from './levels/level3.js';
import { level4 } from './levels/level4.js';
import { level5 } from './levels/level5.js';
import { level6 } from './levels/level6.js';
import { level7 } from './levels/level7.js';
import { level8 } from './levels/level8.js';
import { level9 } from './levels/level9.js';
import { level10 } from './levels/level10.js';
import { level11 } from './levels/level11.js';
import { level12 } from './levels/level12.js';
import { level13 } from './levels/level13.js';
import { level14 } from './levels/level14.js';
import { level15 } from './levels/level15.js';
import { level16 } from './levels/level16.js';
import { level17 } from './levels/level17.js';
import { level18 } from './levels/level18.js';
import { level19 } from './levels/level19.js';
import { level20 } from './levels/level20.js';

console.log('Game loading...');

// Auto-start game on page load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// Render hotbar UI at bottom of screen
function renderHotbar(ctx, player, canvas) {
    const slotSize = 50;
    const slotSpacing = 10;
    const totalWidth = (slotSize * player.hotbarSlots) + (slotSpacing * (player.hotbarSlots - 1));
    const startX = (canvas.width - totalWidth) / 2;
    const startY = canvas.height - slotSize - 20;

    for (let i = 0; i < player.hotbarSlots; i++) {
        const slotX = startX + (i * (slotSize + slotSpacing));
        const slotY = startY;

        // Slot background
        if (i === player.selectedSlot) {
            // Highlighted slot (selected)
            ctx.fillStyle = '#444';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
        } else {
            // Normal slot
            ctx.fillStyle = '#222';
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
        }

        // Draw slot box
        ctx.fillRect(slotX, slotY, slotSize, slotSize);
        ctx.strokeRect(slotX, slotY, slotSize, slotSize);

        // Slot 0: Health Potions
        if (i === 0) {
            const potionCount = player.inventory.getItemCount('healthPotion');
            if (potionCount > 0) {
                // Potion bottle icon
                ctx.fillStyle = '#00FF00';
                ctx.fillRect(slotX + 15, slotY + 15, 20, 25);

                // Potion cap
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(slotX + 15, slotY + 12, 20, 6);

                // Plus symbol
                ctx.fillStyle = '#FFF';
                ctx.fillRect(slotX + 23, slotY + 20, 4, 12);
                ctx.fillRect(slotX + 19, slotY + 24, 12, 4);

                // Item count
                ctx.fillStyle = '#FFF';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.strokeText(potionCount.toString(), slotX + slotSize - 5, slotY + slotSize - 5);
                ctx.fillText(potionCount.toString(), slotX + slotSize - 5, slotY + slotSize - 5);
            }
        }

        // Slot 1: Equipped Sword (only if no slingshot)
        if (i === 1 && player.hasSword && !player.hasSlingshot) {
            // Sword icon (silver blade with gold handle)
            // Blade (silver)
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(slotX + 10, slotY + 23, 28, 4);

            // Blade tip (pointed)
            ctx.fillRect(slotX + 38, slotY + 21, 2, 8);

            // Crossguard (gold)
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(slotX + 8, slotY + 20, 4, 10);

            // Handle (gold)
            ctx.fillRect(slotX + 4, slotY + 23, 6, 4);

            // Pommel (gold)
            ctx.fillRect(slotX + 2, slotY + 22, 4, 6);

            // Equipped indicator (E)
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeText('E', slotX + slotSize - 5, slotY + slotSize - 5);
            ctx.fillText('E', slotX + slotSize - 5, slotY + slotSize - 5);
        }

        // Slot 2: Equipped Slingshot
        if (i === 2 && player.hasSlingshot) {
            // Center position for drawing
            const iconCenterX = slotX + slotSize / 2;
            const iconCenterY = slotY + slotSize / 2;

            // Wood frame (Y-shape) - brown
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            // Handle (vertical)
            ctx.beginPath();
            ctx.moveTo(iconCenterX, iconCenterY + 10);
            ctx.lineTo(iconCenterX, iconCenterY - 2);
            ctx.stroke();

            // Left prong
            ctx.beginPath();
            ctx.moveTo(iconCenterX, iconCenterY - 2);
            ctx.lineTo(iconCenterX - 8, iconCenterY - 10);
            ctx.stroke();

            // Right prong
            ctx.beginPath();
            ctx.moveTo(iconCenterX, iconCenterY - 2);
            ctx.lineTo(iconCenterX + 8, iconCenterY - 10);
            ctx.stroke();

            // Elastic band (black)
            ctx.strokeStyle = '#2a2a2a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(iconCenterX - 8, iconCenterY - 10);
            ctx.lineTo(iconCenterX + 8, iconCenterY - 10);
            ctx.stroke();

            // Stone projectile (gray)
            ctx.fillStyle = '#696969';
            ctx.beginPath();
            ctx.arc(iconCenterX, iconCenterY - 10, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Equipped indicator (E)
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeText('E', slotX + slotSize - 5, slotY + slotSize - 5);
            ctx.fillText('E', slotX + slotSize - 5, slotY + slotSize - 5);
        }

        // Hotkey number
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeText((i + 1).toString(), slotX + 5, slotY + 3);
        ctx.fillText((i + 1).toString(), slotX + 5, slotY + 3);
    }
}

// Initialize the game (wrapped in function for menu)
function initGame() {
const game = new Game('gameCanvas');
window.game = game; // Make game accessible globally for pause/resume

// Initialize physics system
game.physics = new Physics(800); // 800 = gravity

// Initialize renderer with camera support
game.renderer = new Renderer(game.canvas, game.ctx);

// Initialize combat system
const combatSystem = new CombatSystem();

// Initialize level manager
const levelManager = new LevelManager(game);

// Track current level
let currentLevelIndex = 0;
const levels = [
    level1, level2, level3, level4, level5,
    level6, level7, level8, level9, level10,
    level11, level12, level13, level14, level15,
    level16, level17, level18, level19, level20
];
let showLevelSelector = false; // Level selection menu state
let showItemSpawnMenu = false; // Item spawn menu state

// Load level 1
const levelInfo = levelManager.loadLevel(levels[currentLevelIndex]);

// Create player at spawn point
const player = new Player(levelInfo.playerSpawn.x, levelInfo.playerSpawn.y);

// Create input manager (keyboard + mobile)
const inputManager = new InputManager();

// Create mobile controls
const joystick = new VirtualJoystick('joystick');
const actionButtons = new ActionButtons('actionButtons');

// Bind mobile controls to input manager
inputManager.bindMobileControls(joystick, actionButtons);

// Add player to game
game.addEntity(player);

// Update player input each frame and camera
const originalUpdate = game.update.bind(game);
game.update = function(deltaTime) {
    // Update player input from keyboard AND mobile
    inputManager.updatePlayer(player);

    // Call original update
    originalUpdate(deltaTime);

    // Update combat system
    const enemies = levelManager.getEnemies();
    const potions = levelManager.getPotions();
    const armors = levelManager.getArmors();
    const swords = levelManager.getSwords();
    const enemySwords = levelManager.getEnemySwords();
    const slingshots = levelManager.getSlingshots();
    const eliteArmors = levelManager.getEliteArmors();
    const eliteSwords = levelManager.getEliteSwords();

    // Debug: Log elite enemies every 60 frames (once per second at 60fps)
    if (Math.random() < 0.016) { // ~1 in 60 chance
        const eliteEnemies = enemies.filter(e => e.constructor.name === 'EliteEnemy');
        if (eliteEnemies.length > 0) {
            console.log(`👑 Elite enemies in array: ${eliteEnemies.length}, alive: ${eliteEnemies.filter(e => e.isAlive).length}`);
            console.log('First elite bounds:', eliteEnemies[0].getBounds());
        }
    }

    // Update enemy AI - give them access to player and platforms
    for (const enemy of enemies) {
        if (enemy.isAlive) {
            // Set AI references
            enemy.player = player;
            enemy.platforms = game.platforms;

            // Boss-specific: shoot at player and update abilities
            if (enemy.bossType) {
                if (Math.random() < 0.01) { // Log 1% of the time to avoid spam
                    console.log(`Calling shootAtPlayer for ${enemy.constructor.name} (bossType=${enemy.bossType})`);
                }
                enemy.shootAtPlayer(player.x + player.width/2, player.y + player.height/2);

                // Update boss abilities (fire zones, black holes, etc.)
                if (enemy.updateAbilities) {
                    enemy.updateAbilities(deltaTime, player, game);
                }
            }
        }
    }

    combatSystem.update(player, enemies, potions, armors, swords, enemySwords, slingshots, eliteArmors, eliteSwords);

    // Clean up dead enemies (will drop potions, armor, and swords)
    levelManager.cleanupDeadEnemies();

    // Clean up collected potions
    levelManager.cleanupCollectedPotions();

    // Clean up collected armors
    levelManager.cleanupCollectedArmors();

    // Clean up collected swords
    levelManager.cleanupCollectedSwords();

    // Clean up collected enemy swords
    levelManager.cleanupCollectedEnemySwords();

    // Clean up collected slingshots
    levelManager.cleanupCollectedSlingshots();

    // Clean up collected elite armors
    levelManager.cleanupCollectedEliteArmors();

    // Clean up collected elite swords
    levelManager.cleanupCollectedEliteSwords();

    // Update camera to follow player
    game.renderer.followTarget(player, game.canvas);

    // Check if player reached the goal
    if (player.isAlive && levelManager.checkGoalReached(player)) {
        console.log('🎉 Level completed!');
        // Could trigger level complete screen here
    }

    // Check if player is near door (for level 1)
    if (player.isAlive && levelManager.checkDoorEntry(player)) {
        const door = levelManager.getDoor();
        if (door && !door.isEntering) {
            door.isEntering = true; // Prevent multiple triggers
            console.log('🚪 Entering door...');

            // Move to next level after short delay
            setTimeout(() => {
                currentLevelIndex++;
                if (currentLevelIndex < levels.length) {
                    const nextLevel = levels[currentLevelIndex];
                    console.log(`🚪 Loading ${nextLevel.name}!`);
                    const newLevelInfo = levelManager.loadLevel(nextLevel);
                    player.reset(newLevelInfo.playerSpawn.x, newLevelInfo.playerSpawn.y);
                    console.log(`✨ ${nextLevel.name} loaded!`);
                }
            }, 500); // 0.5 second delay
        }
    } else {
        // Reset door entering state when player moves away
        const door = levelManager.getDoor();
        if (door) {
            door.isEntering = false;
        }
    }

    // Check if player fell off the map (death zone below visible area)
    const bounds = levelManager.getBounds();
    if (bounds && player.isAlive && player.y > bounds.maxY + 100) {
        // Player fell into death zone - kill and respawn
        console.log('💀 Player fell off the map!');
        player.takeDamage(player.health); // Kill player

        // Respawn after short delay
        setTimeout(() => {
            const spawnPoint = levelManager.getPlayerSpawn();
            player.reset(spawnPoint.x, spawnPoint.y);
            console.log('♻️ Player respawned!');
        }, 1000);
    }

    // Check if player died
    if (!player.isAlive) {
        // Could show game over screen here
    }
};

// Override render to use camera
const originalRender = game.render.bind(game);
game.render = function() {
    // Clear canvas
    game.ctx.fillStyle = levelInfo.backgroundColor || '#1a1a2e';
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    // Save context
    game.ctx.save();

    // Apply camera translation
    game.ctx.translate(-game.renderer.cameraX, -game.renderer.cameraY);

    // Render platforms
    for (const platform of game.platforms) {
        if (platform.render) {
            platform.render(game.ctx);
        }
    }

    // Render entities
    for (const entity of game.entities) {
        if (entity.render) {
            entity.render(game.ctx);
        }
    }

    // Render level-specific elements (goal marker)
    levelManager.renderLevel(game.ctx);

    // Restore context
    game.ctx.restore();

    // Render UI (FPS, etc.) without camera offset
    game.renderDebugInfo();

    // Render UI elements (level name, health, enemy count)
    game.ctx.fillStyle = '#fff';
    game.ctx.font = '20px Arial';
    game.ctx.textAlign = 'center';
    game.ctx.fillText(levelManager.getCurrentLevelName(), game.canvas.width / 2, 30);

    // Player health display (top left)
    game.ctx.textAlign = 'left';
    game.ctx.font = '16px Arial';
    const healthColor = player.health > 25 ? '#00FF00' : player.health > 10 ? '#FFFF00' : '#FF0000';
    game.ctx.fillStyle = healthColor;
    game.ctx.fillText(`Health: ${player.health}/${player.maxHealth}`, 10, 30);

    // Armor indicator (top left, below health)
    if (player.hasArmor) {
        game.ctx.fillStyle = '#87CEEB';
        game.ctx.fillText('🛡️ Armor Equipped', 10, 50);
    }

    // Enemy count (top right)
    game.ctx.textAlign = 'right';
    game.ctx.fillStyle = '#FFD700';
    const enemiesList = levelManager.getEnemies();
    const aliveEnemies = enemiesList.filter(e => e.isAlive).length;
    game.ctx.fillText(`Enemies: ${aliveEnemies}`, game.canvas.width - 10, 30);

    // DEBUG INFO (top right, below enemy count)
    game.ctx.font = '12px monospace';
    game.ctx.fillStyle = '#00FF00';
    game.ctx.fillText(`DEBUG - Total: ${enemiesList.length}`, game.canvas.width - 10, 50);
    game.ctx.fillStyle = '#FFFF00';
    game.ctx.fillText(`DEBUG - Alive: ${aliveEnemies}`, game.canvas.width - 10, 65);

    // Show entity types in enemies array
    game.ctx.fillStyle = '#FF6B6B';
    const types = enemiesList.map(e => e.constructor.name);
    const typesText = types.length > 0 ? types.join(', ') : 'None';
    game.ctx.fillText(`Types: ${typesText.substring(0, 25)}`, game.canvas.width - 10, 80);
    if (typesText.length > 25) {
        game.ctx.fillText(`...${typesText.substring(25, 50)}`, game.canvas.width - 10, 95);
    }

    // Inventory display (left side, below health and armor)
    game.ctx.textAlign = 'left';
    game.ctx.font = '14px Arial';
    game.ctx.fillStyle = '#00FF00';
    const potionCount = player.inventory.getItemCount('healthPotion');
    const inventoryY = player.hasArmor ? 70 : 50;
    game.ctx.fillText(`Potions: ${potionCount} (Press E)`, 10, inventoryY);

    // Render hotbar
    renderHotbar(game.ctx, player, game.canvas);

    // Next Level Button (when all enemies defeated on levels 2, 3, 4)
    const allEnemiesList = levelManager.getEnemies();
    const aliveEnemiesCount = allEnemiesList.filter(e => e.isAlive).length;
    const initialEnemyCount = levelManager.getInitialEnemyCount();

    // Debug: log enemy info every 3 seconds
    if (!window.lastEnemyLog || Date.now() - window.lastEnemyLog > 3000) {
        console.log(`DEBUG: Level ${currentLevelIndex + 1}, Initial enemies: ${initialEnemyCount}, Current: ${allEnemiesList.length}, Alive: ${aliveEnemiesCount}`);
        console.log('Enemy types:', allEnemiesList.map(e => e.constructor.name));
        window.lastEnemyLog = Date.now();
    }

    // Only show button on levels 2, 3, and 4 (indices 1, 2, 3)
    if (aliveEnemiesCount === 0 && initialEnemyCount > 0 && currentLevelIndex >= 1) {
        // All enemies defeated - show next level button
        const buttonWidth = 300;
        const buttonHeight = 60;
        const buttonX = (game.canvas.width - buttonWidth) / 2;
        const buttonY = game.canvas.height / 2 - 50;

        // Button shadow
        game.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        game.ctx.fillRect(buttonX + 5, buttonY + 5, buttonWidth, buttonHeight);

        // Button background (glowing green)
        const gradient = game.ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
        gradient.addColorStop(0, '#00FF64');
        gradient.addColorStop(1, '#00CC50');
        game.ctx.fillStyle = gradient;
        game.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Button border
        game.ctx.strokeStyle = '#FFD700';
        game.ctx.lineWidth = 4;
        game.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Button text
        game.ctx.fillStyle = '#000';
        game.ctx.font = 'bold 24px Arial';
        game.ctx.textAlign = 'center';
        game.ctx.textBaseline = 'middle';
        game.ctx.fillText('🚪 NEXT LEVEL', game.canvas.width / 2, buttonY + buttonHeight / 2);

        // Store button bounds for click detection
        window.nextLevelButton = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
    } else {
        window.nextLevelButton = null;
    }

    // Game over text
    if (!player.isAlive) {
        game.ctx.textAlign = 'center';
        game.ctx.font = '48px Arial';
        game.ctx.fillStyle = '#FF0000';
        game.ctx.fillText('GAME OVER', game.canvas.width / 2, game.canvas.height / 2);
        game.ctx.font = '24px Arial';
        game.ctx.fillStyle = '#FFF';
        game.ctx.fillText('Press R to respawn', game.canvas.width / 2, game.canvas.height / 2 + 50);
    }

    // Level selector overlay
    if (showLevelSelector) {
        // Semi-transparent background
        game.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

        // Title
        game.ctx.fillStyle = '#FFD700';
        game.ctx.font = 'bold 48px Arial';
        game.ctx.textAlign = 'center';
        game.ctx.fillText('SELECT LEVEL', game.canvas.width / 2, 150);

        // Level buttons
        game.ctx.font = '24px Arial';
        const cols = 3; // 3 columns
        const startX = game.canvas.width / 2 - 400;
        const startY = 220;
        const colWidth = 300;
        const rowHeight = 60;

        for (let i = 0; i < levels.length; i++) {
            const level = levels[i];
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * colWidth;
            const y = startY + row * rowHeight;

            const isCurrentLevel = i === currentLevelIndex;
            const isAvailable = level !== null;

            // Button background
            if (isAvailable) {
                game.ctx.fillStyle = isCurrentLevel ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            } else {
                game.ctx.fillStyle = 'rgba(100, 100, 100, 0.1)';
            }
            game.ctx.fillRect(x, y - 15, 250, 40);

            // Level number and name
            if (isAvailable) {
                game.ctx.fillStyle = isCurrentLevel ? '#00FF00' : '#FFFFFF';
                game.ctx.textAlign = 'left';
                game.ctx.fillText(`${i + 1}. ${level.name.substring(0, 20)}`, x + 10, y + 10);
            } else {
                game.ctx.fillStyle = '#666666';
                game.ctx.textAlign = 'left';
                game.ctx.fillText(`${i + 1}. Coming Soon...`, x + 10, y + 10);
            }
        }

        // Instructions
        game.ctx.font = '18px Arial';
        game.ctx.fillStyle = '#AAAAAA';
        game.ctx.textAlign = 'center';
        game.ctx.fillText('Use number keys to select level (1-9, then Q=10, W=11, E=12, R=13, T=14, Y=15, U=16, H=17, J=18)', game.canvas.width / 2, game.canvas.height - 60);
        game.ctx.fillText('Press L to close', game.canvas.width / 2, game.canvas.height - 30);
    }

    // Item spawn menu overlay
    if (showItemSpawnMenu) {
        // Semi-transparent background
        game.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

        // Title
        game.ctx.fillStyle = '#FFD700';
        game.ctx.font = 'bold 48px Arial';
        game.ctx.textAlign = 'center';
        game.ctx.fillText('SPAWN ITEM', game.canvas.width / 2, 100);

        // Item list
        game.ctx.font = '24px Arial';
        const items = [
            { key: '1', name: 'Health Potion', type: 'healthPotion' },
            { key: '2', name: 'Armor', type: 'armor' },
            { key: '3', name: 'Sword', type: 'sword' },
            { key: '4', name: 'Enemy Sword', type: 'enemySword' },
            { key: '5', name: 'Slingshot', type: 'slingshot' },
            { key: '6', name: '⚔️ Elite Armor (30 HP + Thorns)', type: 'eliteArmor' },
            { key: '7', name: '👑 Elite Sword (20 Damage)', type: 'eliteSword' }
        ];

        for (let i = 0; i < items.length; i++) {
            const y = 160 + i * 50;

            // Highlight elite items with gold color
            if (i >= 5) {
                game.ctx.fillStyle = '#FFD700'; // Gold for elite items
            } else {
                game.ctx.fillStyle = '#FFFFFF';
            }

            game.ctx.fillText(`${items[i].key}. ${items[i].name}`, game.canvas.width / 2, y);
        }

        // Instructions
        game.ctx.font = '20px Arial';
        game.ctx.fillStyle = '#AAAAAA';
        game.ctx.fillText('Press 1-7 to spawn item, I to close', game.canvas.width / 2, game.canvas.height - 50);
    }
};

// Initialize and start the game
game.init();
game.start();

console.log('Game started successfully!');
console.log('Player controls ready (Keyboard + Mobile)!');

// Function to load next level
function loadNextLevel() {
    const aliveEnemies = levelManager.getEnemies().filter(e => e.isAlive);
    const initialEnemyCount = levelManager.getInitialEnemyCount();

    console.log(`Initial enemies: ${initialEnemyCount}, Alive: ${aliveEnemies.length}`);

    if (aliveEnemies.length === 0 && initialEnemyCount > 0) {
        // All enemies defeated - move to next level
        currentLevelIndex++;

        if (currentLevelIndex >= levels.length) {
            console.log('🎉 ALL LEVELS COMPLETED!');
            currentLevelIndex = levels.length - 1; // Stay on last level
            return;
        }

        const nextLevel = levels[currentLevelIndex];
        console.log(`🚪 Loading ${nextLevel.name}!`);
        const newLevelInfo = levelManager.loadLevel(nextLevel);
        player.reset(newLevelInfo.playerSpawn.x, newLevelInfo.playerSpawn.y);
        console.log(`✨ ${nextLevel.name} loaded!`);

        // Clear the button after loading next level
        window.nextLevelButton = null;
    }
}

// Add click/touch handler for Next Level button
game.canvas.addEventListener('click', (e) => {
    if (window.nextLevelButton) {
        const rect = game.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const btn = window.nextLevelButton;
        if (clickX >= btn.x && clickX <= btn.x + btn.width &&
            clickY >= btn.y && clickY <= btn.y + btn.height) {
            console.log('Next Level button clicked!');
            loadNextLevel();
        }
    }
});

// Add touch handler for mobile
game.canvas.addEventListener('touchstart', (e) => {
    if (window.nextLevelButton) {
        const rect = game.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        const btn = window.nextLevelButton;
        if (touchX >= btn.x && touchX <= btn.x + btn.width &&
            touchY >= btn.y && touchY <= btn.y + btn.height) {
            console.log('Next Level button tapped!');
            loadNextLevel();
            e.preventDefault(); // Prevent default touch behavior
        }
    }
});

// Add pause control, respawn, use potion, hotbar selection, and level selector
document.addEventListener('keydown', (e) => {
    console.log(`🎮 Key pressed: ${e.code}, showItemSpawnMenu: ${showItemSpawnMenu}, showLevelSelector: ${showLevelSelector}`);

    if (e.code === 'KeyP') {
        game.pause();
    } else if (e.code === 'KeyR') {
        // Restart: reset player to spawn point
        const spawn = levelManager.getPlayerSpawn();
        player.reset(spawn.x, spawn.y);
        console.log('Player respawned at starting position');
    } else if (e.code === 'KeyE') {
        // Use item in selected hotbar slot OR load next level
        if (window.nextLevelButton) {
            // Next level button is showing - load next level
            loadNextLevel();
        } else if (player.inventory.getItemCount('healthPotion') > 0) {
            // Auto-use health potion if available
            player.useHealthPotion();
        } else {
            // Not near door and no potions, use hotbar item
            player.useHotbarItem();
        }
    } else if (e.code === 'KeyL') {
        // Toggle level selector menu
        showLevelSelector = !showLevelSelector;
        if (showLevelSelector) showItemSpawnMenu = false; // Close item menu if open
        console.log(showLevelSelector ? 'Level selector opened (1-5 to select)' : 'Level selector closed');
    } else if (e.code === 'KeyI') {
        // Toggle item spawn menu
        showItemSpawnMenu = !showItemSpawnMenu;
        if (showItemSpawnMenu) showLevelSelector = false; // Close level selector if open
        console.log(showItemSpawnMenu ? '✅ Item spawn menu opened (1-7 to spawn)' : '❌ Item spawn menu closed');
    } else if (showItemSpawnMenu && e.code >= 'Digit1' && e.code <= 'Digit7') {
        // Spawn item when item menu is open
        console.log(`🎯 Spawn condition met! Menu: ${showItemSpawnMenu}, Key: ${e.code}`);
        const itemIndex = parseInt(e.code.slice(-1)) - 1;
        const items = [
            { type: 'healthPotion', name: 'Health Potion' },
            { type: 'armor', name: 'Armor' },
            { type: 'sword', name: 'Sword' },
            { type: 'enemySword', name: 'Enemy Sword' },
            { type: 'slingshot', name: 'Slingshot' },
            { type: 'eliteArmor', name: 'Elite Armor' },
            { type: 'eliteSword', name: 'Elite Sword' }
        ];

        if (itemIndex < items.length) {
            const selectedItem = items[itemIndex];
            console.log(`🔨 Attempting to spawn: ${selectedItem.name} (${selectedItem.type})`);

            // Spawn item near player
            const spawnX = player.x + player.width / 2;
            const spawnY = player.y;
            console.log(`📍 Spawn position: x=${spawnX}, y=${spawnY}`);

            const item = levelManager.itemFactory.createItem(
                selectedItem.type,
                spawnX,
                spawnY
            );

            if (item) {
                console.log(`✅ Item created:`, item);
                const categoryMap = levelManager.itemFactory.getCategoryMap();
                const category = categoryMap[selectedItem.type];
                console.log(`📦 Category: ${category}`);

                levelManager.entityManager.addEntity(category, item);
                console.log(`✨ Spawned ${selectedItem.name} near player!`);

                // Close menu after spawning
                showItemSpawnMenu = false;
            } else {
                console.error(`❌ Failed to create item: ${selectedItem.type}`);
            }
        }
    } else if (showLevelSelector) {
        // Select level when level selector is open
        // Map keys to level indices: 1-9 = levels 1-9, Q=10, W=11, E=12, R=13, T=14, Y=15, U=16, H=17, J=18
        const keyToLevel = {
            'Digit1': 0, 'Digit2': 1, 'Digit3': 2, 'Digit4': 3, 'Digit5': 4,
            'Digit6': 5, 'Digit7': 6, 'Digit8': 7, 'Digit9': 8,
            'KeyQ': 9, 'KeyW': 10, 'KeyE': 11, 'KeyR': 12, 'KeyT': 13,
            'KeyY': 14, 'KeyU': 15, 'KeyH': 16, 'KeyJ': 17
        };

        const levelIndex = keyToLevel[e.code];
        if (levelIndex !== undefined && levelIndex < levels.length) {
            const selectedLevel = levels[levelIndex];
            if (selectedLevel !== null) {
                currentLevelIndex = levelIndex;
                const levelInfo = levelManager.loadLevel(selectedLevel);
                player.reset(levelInfo.playerSpawn.x, levelInfo.playerSpawn.y);
                showLevelSelector = false;
                console.log(`Jumped to ${selectedLevel.name}`);
            } else {
                console.log(`Level ${levelIndex + 1} is not available yet`);
            }
        }
    } else if (!showLevelSelector && !showItemSpawnMenu && e.code >= 'Digit1' && e.code <= 'Digit5') {
        // Hotbar slot selection (1-5 keys) - only when both menus are closed
        const slotIndex = parseInt(e.code.slice(-1)) - 1;
        player.selectHotbarSlot(slotIndex);
    }
});

// Display instructions
setTimeout(() => {
    console.log('%c=== CONTROLS ===', 'color: #FF6B9D; font-size: 16px; font-weight: bold');
    console.log('KEYBOARD:');
    console.log('  Arrow Keys or A/D: Move left/right');
    console.log('  Arrow Up or W or SPACE: Jump');
    console.log('  Z or X: Attack');
    console.log('');
    console.log('MOBILE:');
    console.log('  Virtual Joystick (left): Move');
    console.log('  JUMP button (right bottom): Jump');
    console.log('  ATTACK button (right top): Attack');
    console.log('');
    console.log('HOTBAR:');
    console.log('  1-5: Select hotbar slot (when menus closed)');
    console.log('  E: Use item in selected slot');
    console.log('');
    console.log('MENUS:');
    console.log('  L: Open level selector (1-5 to jump to level)');
    console.log('  I: Open item spawn menu (1-7 to spawn item)');
    console.log('');
    console.log('OTHER:');
    console.log('  P: Pause/Resume');
    console.log('  R: Restart game');
    console.log('%c===============', 'color: #FF6B9D; font-size: 16px; font-weight: bold');
}, 500);

} // End of initGame function
