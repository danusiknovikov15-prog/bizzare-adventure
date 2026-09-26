// Main entry point for the game
// Version 9 - skin system debug
import { Game } from './engine/Game.js';
import { Physics } from './engine/Physics.js';
import { Renderer } from './engine/Renderer.js';
import { CombatSystem } from './engine/CombatSystem.js';
import { Player } from './entities/Player.js';
import { InputManager } from './controls/InputManager.js';
import { VirtualJoystick } from './controls/VirtualJoystick.js';
import { ActionButtons } from './controls/ActionButtons.js';
import { LevelManager } from './levels/LevelManager.js';
import { ProgressManager } from './ProgressManager.js';
import { castleBackgroundImages } from './levels/CastleBackgroundImage.js';
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
import { level21 } from './levels/level21.js';
import { level22 } from './levels/level22.js';
import { level23 } from './levels/level23.js';
import { level24 } from './levels/level24.js';
import { level25 } from './levels/level25.js';
import { level26 } from './levels/level26.js';
import { level27 } from './levels/level27.js';
import { level28 } from './levels/level28.js';
import { level29 } from './levels/level29.js';
import { level30 } from './levels/level30.js';
import { expandedLevels } from './levels/expandedLevels.js';

console.log('Game loading...');

// Helper function to load castle background image for a level
function loadCastleBackground(game, levelIndex) {
    const castleBg = castleBackgroundImages[`level${levelIndex + 1}`];
    if (castleBg) {
        game.backgroundImage = castleBg.getImage();
        return '#0a0a1a'; // Dark night sky color
    }
    game.backgroundImage = null;
    return null;
}

// Auto-start game on page load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// Item rendering functions for dynamic hotbar
const ITEM_RENDERERS = {
    healthPotion: (ctx, slotX, slotY, slotSize, count) => {
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
        if (count > 1) {
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeText(count.toString(), slotX + slotSize - 5, slotY + slotSize - 5);
            ctx.fillText(count.toString(), slotX + slotSize - 5, slotY + slotSize - 5);
        }
    },
    totem: (ctx, slotX, slotY, slotSize) => {
        const centerX = slotX + slotSize / 2;
        const centerY = slotY + slotSize / 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FFD700';
        ctx.fillStyle = '#C4A44D';
        ctx.fillRect(centerX - 6, centerY - 10, 12, 20);
        ctx.fillRect(centerX - 8, centerY - 14, 16, 6);
        ctx.fillStyle = '#2E8B2E';
        ctx.fillRect(centerX - 5, centerY - 12, 3, 3);
        ctx.fillRect(centerX + 2, centerY - 12, 3, 3);
        ctx.fillStyle = '#8B7332';
        ctx.fillRect(centerX - 4, centerY - 5, 8, 2);
        ctx.shadowBlur = 0;
    },
    unoReverse: (ctx, slotX, slotY, slotSize) => {
        const centerX = slotX + slotSize / 2;
        const centerY = slotY + slotSize / 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FF0000';
        ctx.fillStyle = '#E31B23';
        ctx.fillRect(centerX - 10, centerY - 14, 20, 28);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - 10, centerY - 14, 20, 28);
        ctx.fillStyle = '#FFDE00';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 7, 10, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    },
    sword: (ctx, slotX, slotY, slotSize) => {
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(slotX + 10, slotY + 23, 28, 4);
        ctx.fillRect(slotX + 38, slotY + 21, 2, 8);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(slotX + 8, slotY + 20, 4, 10);
        ctx.fillRect(slotX + 4, slotY + 23, 6, 4);
        ctx.fillRect(slotX + 2, slotY + 22, 4, 6);
    },
    lightsaber: (ctx, slotX, slotY, slotSize) => {
        const centerX = slotX + slotSize / 2;
        const centerY = slotY + slotSize / 2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#7df9ff';
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(centerX - 14, centerY + 2, 12, 6);
        ctx.fillStyle = '#444';
        ctx.fillRect(centerX - 12, centerY + 2, 1, 6);
        ctx.fillRect(centerX - 9, centerY + 2, 1, 6);
        ctx.fillRect(centerX - 6, centerY + 2, 1, 6);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(centerX - 2, centerY + 3, 3, 4);
        ctx.fillStyle = '#ff3333';
        ctx.fillRect(centerX - 13, centerY + 7, 2, 2);
        ctx.fillStyle = 'rgba(125, 249, 255, 0.4)';
        ctx.fillRect(centerX + 1, centerY + 3, 20, 4);
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#7df9ff';
        ctx.fillRect(centerX + 1, centerY + 4, 18, 2);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(centerX + 2, centerY + 4.5, 16, 1);
        ctx.fillStyle = '#7df9ff';
        ctx.beginPath();
        ctx.arc(centerX + 19, centerY + 5, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    },
    slingshot: (ctx, slotX, slotY, slotSize) => {
        const iconCenterX = slotX + slotSize / 2;
        const iconCenterY = slotY + slotSize / 2;
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(iconCenterX, iconCenterY + 10);
        ctx.lineTo(iconCenterX, iconCenterY - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(iconCenterX, iconCenterY - 2);
        ctx.lineTo(iconCenterX - 8, iconCenterY - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(iconCenterX, iconCenterY - 2);
        ctx.lineTo(iconCenterX + 8, iconCenterY - 10);
        ctx.stroke();
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(iconCenterX - 8, iconCenterY - 10);
        ctx.lineTo(iconCenterX + 8, iconCenterY - 10);
        ctx.stroke();
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.arc(iconCenterX, iconCenterY - 10, 2.5, 0, Math.PI * 2);
        ctx.fill();
    },
    evilSword: (ctx, slotX, slotY, slotSize) => {
        const centerX = slotX + slotSize / 2;
        const centerY = slotY + slotSize / 2;

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff3333';

        // Dark blade
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(centerX - 14, centerY - 2, 28, 4);
        ctx.fillRect(centerX + 14, centerY - 4, 3, 8);

        // Red glow on blade
        ctx.fillStyle = 'rgba(255, 51, 51, 0.6)';
        ctx.fillRect(centerX - 12, centerY - 1, 26, 2);

        // Dark crossguard
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(centerX - 16, centerY - 6, 4, 12);

        // Handle (dark red)
        ctx.fillStyle = '#5c2a2a';
        ctx.fillRect(centerX - 22, centerY - 2, 8, 4);

        // Skull pommel
        ctx.fillStyle = '#1a0a0a';
        ctx.beginPath();
        ctx.arc(centerX - 24, centerY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Red eyes on pommel
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(centerX - 25, centerY - 1, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX - 23, centerY - 1, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    },

    fryingPan: (ctx, slotX, slotY, slotSize) => {
        const centerX = slotX + slotSize / 2;
        const centerY = slotY + slotSize / 2;

        // Pan shadow
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ff6600';

        // Pan base (circle)
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.ellipse(centerX + 5, centerY, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pan inner (darker)
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.ellipse(centerX + 5, centerY, 9, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Handle
        ctx.fillStyle = '#5c4030';
        ctx.fillRect(centerX - 22, centerY - 2, 16, 4);

        // Handle end
        ctx.fillStyle = '#4a3020';
        ctx.beginPath();
        ctx.arc(centerX - 22, centerY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Fire/steam effect
        ctx.fillStyle = 'rgba(255, 102, 0, 0.7)';
        ctx.beginPath();
        ctx.moveTo(centerX + 2, centerY - 6);
        ctx.quadraticCurveTo(centerX + 4, centerY - 12, centerX + 2, centerY - 16);
        ctx.quadraticCurveTo(centerX, centerY - 12, centerX + 2, centerY - 6);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 136, 0, 0.6)';
        ctx.beginPath();
        ctx.moveTo(centerX + 8, centerY - 5);
        ctx.quadraticCurveTo(centerX + 10, centerY - 10, centerX + 8, centerY - 14);
        ctx.quadraticCurveTo(centerX + 6, centerY - 10, centerX + 8, centerY - 5);
        ctx.fill();

        ctx.shadowBlur = 0;
    },

    toilet: (ctx, slotX, slotY, slotSize) => {
        const centerX = slotX + slotSize / 2;
        const centerY = slotY + slotSize / 2;

        // Glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#8B4513';

        // Toilet base
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 8, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Toilet bowl
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 2, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner bowl (water)
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 2, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tank
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(centerX - 8, centerY - 15, 16, 12);

        // Tank lid
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(centerX - 9, centerY - 17, 18, 3);

        // Flush button
        ctx.fillStyle = '#c0c0c0';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 10, 2, 0, Math.PI * 2);
        ctx.fill();

        // Face (skibidi style)
        ctx.fillStyle = '#000000';
        // Eyes
        ctx.beginPath();
        ctx.arc(centerX - 3, centerY - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 3, centerY - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Mouth
        ctx.beginPath();
        ctx.arc(centerX, centerY + 4, 3, 0, Math.PI);
        ctx.stroke();

        ctx.shadowBlur = 0;
    },

    cleave: (ctx, slotX, slotY, slotSize) => {
        const centerX = slotX + slotSize / 2;
        const centerY = slotY + slotSize / 2;

        // Red glow effect (Sukuna's cursed energy)
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff0044';

        // First slash (diagonal)
        ctx.strokeStyle = '#ff0044';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - 10);
        ctx.lineTo(centerX + 12, centerY + 10);
        ctx.stroke();

        // Second slash (crossing)
        ctx.beginPath();
        ctx.moveTo(centerX + 10, centerY - 12);
        ctx.lineTo(centerX - 10, centerY + 12);
        ctx.stroke();

        // Inner glow lines
        ctx.strokeStyle = '#ff6688';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY - 8);
        ctx.lineTo(centerX + 10, centerY + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 8, centerY - 10);
        ctx.lineTo(centerX - 8, centerY + 10);
        ctx.stroke();

        // Center energy burst
        ctx.fillStyle = '#ff0044';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }
};

// Shard configurations
const SHARD_TYPES = {
    acidShard: { color: '#7FFF00', symbol: '☣' },
    fireShard: { color: '#FF4500', symbol: '🔥' },
    iceShard: { color: '#00FFFF', symbol: '❄' },
    lightningShard: { color: '#FFD700', symbol: '⚡' },
    waterShard: { color: '#1E90FF', symbol: '💧' }
};

// Render a shard in a slot
function renderShard(ctx, slotX, slotY, slotSize, shardType, count) {
    const shard = SHARD_TYPES[shardType];
    if (!shard) return;

    const centerX = slotX + slotSize / 2;
    const centerY = slotY + slotSize / 2;

    ctx.shadowBlur = 10;
    ctx.shadowColor = shard.color;
    ctx.fillStyle = shard.color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 12);
    ctx.lineTo(centerX + 8, centerY);
    ctx.lineTo(centerX, centerY + 12);
    ctx.lineTo(centerX - 8, centerY);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(shard.symbol, centerX, centerY);

    if (count > 1) {
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(count.toString(), slotX + slotSize - 5, slotY + slotSize - 5);
        ctx.fillText(count.toString(), slotX + slotSize - 5, slotY + slotSize - 5);
    }
}

// Render hotbar UI at bottom of screen (dynamic slot-based system)
function renderHotbar(ctx, player, canvas) {
    const slotSize = 50;
    const slotSpacing = 10;
    const totalWidth = (slotSize * player.hotbarSlots) + (slotSpacing * (player.hotbarSlots - 1));
    const startX = (canvas.width - totalWidth) / 2;
    const startY = canvas.height - slotSize - 20;

    // Get all slots from inventory
    const slots = player.inventory.getAllSlots();

    for (let i = 0; i < player.hotbarSlots; i++) {
        const slotX = startX + (i * (slotSize + slotSpacing));
        const slotY = startY;

        // Slot background
        if (i === player.selectedSlot) {
            ctx.fillStyle = '#444';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
        } else {
            ctx.fillStyle = '#222';
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
        }

        ctx.fillRect(slotX, slotY, slotSize, slotSize);
        ctx.strokeRect(slotX, slotY, slotSize, slotSize);

        // Render item in this slot
        const slotItem = slots[i];
        if (slotItem) {
            const itemType = slotItem.type;
            const count = slotItem.count;

            // Check if it's a shard
            if (SHARD_TYPES[itemType]) {
                renderShard(ctx, slotX, slotY, slotSize, itemType, count);
            }
            // Check for specific item renderers
            else if (ITEM_RENDERERS[itemType]) {
                ITEM_RENDERERS[itemType](ctx, slotX, slotY, slotSize, count);
            }
        }

        // Also render player equipment that's not in inventory slots
        // (backwards compatibility for items like totem, sword, slingshot, lightsaber)
        if (!slotItem) {
            // Find first empty slot for equipped items
            if (player.hasTotem && !slots.some(s => s && s.type === 'totem')) {
                const totemSlot = player.inventory.findItemSlot('totem');
                if (totemSlot === -1 && i === player.inventory.findEmptySlot()) {
                    // Auto-add totem to inventory if not there
                    player.inventory.addItem('totem', 1);
                }
            }
            if (player.hasUnoReverse && !slots.some(s => s && s.type === 'unoReverse')) {
                const unoSlot = player.inventory.findItemSlot('unoReverse');
                if (unoSlot === -1 && i === player.inventory.findEmptySlot()) {
                    player.inventory.addItem('unoReverse', 1);
                }
            }
            if (player.hasSword && !player.hasLightsaber && !slots.some(s => s && s.type === 'sword')) {
                const swordSlot = player.inventory.findItemSlot('sword');
                if (swordSlot === -1 && i === player.inventory.findEmptySlot()) {
                    player.inventory.addItem('sword', 1);
                }
            }
            if (player.hasLightsaber && !slots.some(s => s && s.type === 'lightsaber')) {
                const lightsaberSlot = player.inventory.findItemSlot('lightsaber');
                if (lightsaberSlot === -1 && i === player.inventory.findEmptySlot()) {
                    player.inventory.addItem('lightsaber', 1);
                }
            }
            if (player.hasSlingshot && !slots.some(s => s && s.type === 'slingshot')) {
                const slingshotSlot = player.inventory.findItemSlot('slingshot');
                if (slingshotSlot === -1 && i === player.inventory.findEmptySlot()) {
                    player.inventory.addItem('slingshot', 1);
                }
            }
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
async function initGame() {
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

// Initialize progress manager
const progressManager = new ProgressManager(game);
game.progressManager = progressManager;

// Track current level
let currentLevelIndex = 0;
const levels = [
    level1, level2, level3, level4, level5,
    level6, level7, level8, level9, level10,
    level11, level12, level13, level14, level15,
    level16, level17, level18, level19, level20,
    level21, level22, level23, level24, level25,
    level26, level27, level28, level29, level30,
    ...expandedLevels
];
let showLevelSelector = false; // Level selection menu state
let showItemSpawnMenu = false; // Item spawn menu state

// Load saved progress if available
if (window.PLAYER_PROFILE) {
    const savedProgress = await progressManager.loadProgress();
    if (savedProgress && savedProgress.currentLevel > 1) {
        currentLevelIndex = savedProgress.currentLevel - 1;
        console.log(`📂 Loaded saved progress - starting at level ${savedProgress.currentLevel}`);
    }
}

// Store currentLevelIndex on game for ProgressManager
game.currentLevelIndex = currentLevelIndex;

// Load level
const levelInfo = levelManager.loadLevel(levels[currentLevelIndex]);

// Load castle background for this level
const bgColor = loadCastleBackground(game, currentLevelIndex);
if (bgColor) {
    levelInfo.backgroundColor = bgColor;
}

// Create player at spawn point
const player = new Player(levelInfo.playerSpawn.x, levelInfo.playerSpawn.y);

// Load and apply equipped skin
try {
    console.log('🎨 Fetching skin data from API...');
    const skinResponse = await fetch('/api/shop/inventory/');
    const skinData = await skinResponse.json();
    console.log('🎨 Skin API response:', skinData);
    if (skinData.success && skinData.equipped_skin && skinData.equipped_skin !== 'default') {
        console.log(`🎨 Applying skin: ${skinData.equipped_skin}`);
        player.applySkin(skinData.equipped_skin);
        console.log(`🎨 Player color after applySkin: ${player.color}`);
    } else {
        console.log('🎨 Using default skin');
    }
} catch (error) {
    console.log('❌ Could not load skin data:', error);
}

// Load and apply equipped title
try {
    console.log('🏷️ Fetching title data from API...');
    const titleResponse = await fetch('/api/title/equipped/');
    const titleData = await titleResponse.json();
    console.log('🏷️ Title API response:', titleData);
    if (titleData.success && titleData.equipped_title) {
        console.log(`🏷️ Applying title: ${titleData.equipped_title}`);
        player.equippedTitle = titleData.equipped_title;
    } else {
        console.log('🏷️ No title equipped');
    }
} catch (error) {
    console.log('❌ Could not load title data:', error);
}

// Load player inventory from database
try {
    console.log('📦 Loading player inventory from API...');
    const inventoryResponse = await fetch('/api/load/');
    const inventoryData = await inventoryResponse.json();
    console.log('📦 Inventory API response:', inventoryData);
    if (inventoryData.success && inventoryData.inventory) {
        console.log(`📦 Found ${inventoryData.inventory.length} items in inventory`);
        for (const item of inventoryData.inventory) {
            console.log(`📦 Loading item: ${item.item_id} (type: ${item.item_type})`);
            // Apply weapons (only lightsaber, sword must be picked up)
            if (item.item_type === 'weapons') {
                if (item.item_id === 'lightsaber') {
                    console.log('⚔️ Equipping lightsaber from inventory!');
                    player.equipLightsaber();
                    console.log(`⚔️ hasLightsaber: ${player.hasLightsaber}, damage: ${player.attackDamage}`);
                }
                // Sword is NOT auto-equipped - must be picked up in game
            }
        }
    } else {
        console.log('📦 No inventory found or empty');
    }
} catch (error) {
    console.log('❌ Could not load inventory data:', error);
}

// Create input manager (keyboard + mobile)
const inputManager = new InputManager();

// Create mobile controls
const joystick = new VirtualJoystick('joystick');
const actionButtons = new ActionButtons('actionButtons');

// Bind mobile controls to input manager
inputManager.bindMobileControls(joystick, actionButtons);

// Add player to game
game.addEntity(player);
game.player = player; // Make player accessible globally for admin panel

// Apply item effect function for admin panel
game.applyItemEffect = function(itemId) {
    console.log(`🎁 Applying item effect: ${itemId}`);
    switch(itemId) {
        case 'lightsaber':
            player.equipLightsaber();
            console.log(`⚔️ Lightsaber equipped! hasLightsaber: ${player.hasLightsaber}, damage: ${player.attackDamage}`);
            break;
        case 'weapon_fire_sword':
            player.equipSword();
            break;
        case 'weapon_ice_bow':
            player.equipSlingshot();
            break;
        case 'class_jedi':
            player.equipLightsaber();
            console.log(`⚔️ Jedi class - Lightsaber equipped! hasLightsaber: ${player.hasLightsaber}`);
            break;
        case 'class_enemy_king':
            player.equipEnemyKing();
            console.log(`👑 Enemy King class equipped! Damage bonus: +20%`);
            break;
        case 'class_chef':
            player.equipChef();
            console.log(`👨‍🍳 Chef class equipped! Attack speed: +15%`);
            break;
        case 'class_skibidi':
            player.equipSkibidi();
            console.log(`🚽 Skibidi Toilet equipped! Jump +30%, Speed +25%`);
            break;
        case 'class_sukuna':
            player.equipSukuna();
            console.log(`👹 Sukuna equipped! +50% damage, Cleave attack!`);
            break;
        case 'class_boxer':
            player.equipBoxer();
            console.log(`🥊 Boxer equipped! +25% damage, faster attacks!`);
            break;
        case 'health_potion':
            player.inventory.addItem('healthPotion', 1);
            break;
        case 'upgrade_health':
            player.maxHealth += 25;
            player.health = player.maxHealth;
            break;
        case 'upgrade_damage':
            player.attackDamage = Math.floor(player.attackDamage * 1.15);
            break;
        default:
            // Handle generic classes from the 100 new classes system
            if (itemId.startsWith('class_') && typeof CLASS_STATS !== 'undefined' && CLASS_STATS[itemId]) {
                player.equipGenericClass(itemId);
                console.log(`Equipped generic class: ${itemId}`);
            } else {
                console.log(`Unknown item: ${itemId}`);
            }
    }
};

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
    const elementalShards = []; // No longer needed - shards go directly to inventory
    const totems = levelManager.getTotems();
    const unoCards = levelManager.getUnoCards();

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

    combatSystem.update(player, enemies, potions, armors, swords, enemySwords, slingshots, eliteArmors, eliteSwords, elementalShards, totems, unoCards, deltaTime);

    // Clean up dead enemies (will drop potions, armor, swords, and elemental shards)
    levelManager.cleanupDeadEnemies(player);

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

    // Clean up collected totems
    levelManager.cleanupCollectedTotems();

    // Clean up collected UNO cards
    levelManager.cleanupCollectedUnoCards();

    // Note: Elemental shards no longer need cleanup - they go directly to inventory

    // Update camera to follow player
    game.renderer.followTarget(player, game.canvas);

    // Обновить туториальную систему
    levelManager.updateTutorial(player);

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
                game.currentLevelIndex = currentLevelIndex;
                if (currentLevelIndex < levels.length) {
                    const nextLevel = levels[currentLevelIndex];
                    console.log(`🚪 Loading ${nextLevel.name}!`);
                    const newLevelInfo = levelManager.loadLevel(nextLevel);

                    // Load castle background for new level
                    const bgColor = loadCastleBackground(game, currentLevelIndex);
                    if (bgColor) {
                        newLevelInfo.backgroundColor = bgColor;
                        levelInfo.backgroundColor = bgColor; // Update current levelInfo reference
                    }

                    player.reset(newLevelInfo.playerSpawn.x, newLevelInfo.playerSpawn.y);
                    console.log(`✨ ${nextLevel.name} loaded!`);

                    // Record level completion and save progress
                    progressManager.recordLevelComplete();
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
        progressManager.recordDeath(); // Track death

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

    // Render background image FIRST (behind everything)
    if (game.backgroundImage) {
        // Draw the background image, positioned with parallax effect
        const parallaxFactor = 0.5; // Background moves slower than foreground
        const bgX = game.renderer.cameraX * parallaxFactor;
        const bgY = 0;

        game.ctx.drawImage(
            game.backgroundImage,
            -bgX, // Offset by parallax
            bgY,
            game.backgroundImage.width,
            game.backgroundImage.height
        );
    }

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
    let inventoryY = player.hasArmor ? 70 : 50;
    game.ctx.fillText(`Potions: ${potionCount} (Press E)`, 10, inventoryY);

    // Show equipped weapon
    if (player.hasLightsaber) {
        inventoryY += 18;
        game.ctx.fillStyle = '#7df9ff';
        game.ctx.shadowColor = '#7df9ff';
        game.ctx.shadowBlur = 8;
        game.ctx.fillText(`⚔ Lightsaber (DMG: ${player.lightsaberDamage})`, 10, inventoryY);
        game.ctx.shadowBlur = 0;
    } else if (player.hasSword) {
        inventoryY += 18;
        game.ctx.fillStyle = '#C0C0C0';
        game.ctx.fillText(`⚔ Sword (DMG: ${player.attackDamage})`, 10, inventoryY);
    } else if (player.hasSlingshot) {
        inventoryY += 18;
        game.ctx.fillStyle = '#8B4513';
        game.ctx.fillText(`🎯 Slingshot`, 10, inventoryY);
    }

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
        game.ctx.fillText('SPAWN ITEM', game.canvas.width / 2, 80);

        // Item list
        game.ctx.font = '24px Arial';
        const items = [
            { key: '1', name: 'Health Potion', color: '#00FF00' },
            { key: '2', name: 'Armor', color: '#FFFFFF' },
            { key: '3', name: 'Sword', color: '#FFFFFF' },
            { key: '4', name: 'Enemy Sword', color: '#FFFFFF' },
            { key: '5', name: 'Slingshot', color: '#FFFFFF' },
            { key: '6', name: '⚔️ Elite Armor (30 HP + Thorns)', color: '#FFD700' },
            { key: '7', name: '👑 Elite Sword (20 Damage)', color: '#FFD700' },
            { key: '8', name: '🗿 Totem of Undying (Save from death)', color: '#C4A44D' },
            { key: '9', name: '🔄 UNO Reverse Card (Reflect damage)', color: '#E31B23' }
        ];

        for (let i = 0; i < items.length; i++) {
            const y = 140 + i * 45;
            game.ctx.fillStyle = items[i].color;
            game.ctx.fillText(`${items[i].key}. ${items[i].name}`, game.canvas.width / 2, y);
        }

        // Instructions
        game.ctx.font = '20px Arial';
        game.ctx.fillStyle = '#AAAAAA';
        game.ctx.fillText('Press 1-9 to spawn item, I to close', game.canvas.width / 2, game.canvas.height - 50);
    }
};

// Initialize and start the game
game.init();
game.start();

// Start game session tracking
progressManager.startSession();

console.log('Game started successfully!');
console.log('Player controls ready (Keyboard + Mobile)!');

// Save progress when leaving page
window.addEventListener('beforeunload', () => {
    progressManager.saveProgress();
    progressManager.endSession();
});

// Function to load next level
function loadNextLevel() {
    const aliveEnemies = levelManager.getEnemies().filter(e => e.isAlive);
    const initialEnemyCount = levelManager.getInitialEnemyCount();

    console.log(`Initial enemies: ${initialEnemyCount}, Alive: ${aliveEnemies.length}`);

    if (aliveEnemies.length === 0 && initialEnemyCount > 0) {
        // All enemies defeated - move to next level
        currentLevelIndex++;
        game.currentLevelIndex = currentLevelIndex;

        if (currentLevelIndex >= levels.length) {
            console.log('🎉 ALL LEVELS COMPLETED!');
            currentLevelIndex = levels.length - 1; // Stay on last level
            game.currentLevelIndex = currentLevelIndex;
            progressManager.saveProgress(); // Save final progress
            return;
        }

        const nextLevel = levels[currentLevelIndex];
        console.log(`🚪 Loading ${nextLevel.name}!`);
        const newLevelInfo = levelManager.loadLevel(nextLevel);

        // Load castle background for new level
        const bgColor = loadCastleBackground(game, currentLevelIndex);
        if (bgColor) {
            newLevelInfo.backgroundColor = bgColor;
            levelInfo.backgroundColor = bgColor; // Update current levelInfo reference
        }

        player.reset(newLevelInfo.playerSpawn.x, newLevelInfo.playerSpawn.y);
        console.log(`✨ ${nextLevel.name} loaded!`);

        // Record level completion and save progress
        progressManager.recordLevelComplete();

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
    } else if (e.code === 'KeyP') {
        // Show inventory in console for debugging
        console.log('📦 INVENTORY:');
        console.log(player.inventory.getAllItems());
        const items = player.inventory.getAllItems();
        for (const [itemName, count] of Object.entries(items)) {
            console.log(`  - ${itemName}: ${count}`);
        }
        // Also test adding a shard
        console.log('🧪 TEST: Adding acid shard to inventory');
        player.collectElementalShard('acid');
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
    } else if (showItemSpawnMenu && e.code >= 'Digit1' && e.code <= 'Digit9') {
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
            { type: 'eliteSword', name: 'Elite Sword' },
            { type: 'totem', name: 'Totem of Undying' },
            { type: 'unoCard', name: 'UNO Reverse Card' }
        ];

        if (itemIndex < items.length) {
            const selectedItem = items[itemIndex];
            console.log(`🔨 Attempting to spawn: ${selectedItem.name} (${selectedItem.type})`);

            // Spawn item near player
            const spawnX = player.x + player.width / 2;
            const spawnY = player.y;
            console.log(`📍 Spawn position: x=${spawnX}, y=${spawnY}`);

            // Special handling for totem
            if (selectedItem.type === 'totem') {
                levelManager.spawnTotem(spawnX, spawnY);
                console.log(`✨ Spawned ${selectedItem.name} near player!`);
                showItemSpawnMenu = false;
            } else if (selectedItem.type === 'unoCard') {
                // Special handling for UNO Reverse Card
                levelManager.spawnUnoCard(spawnX, spawnY);
                console.log(`✨ Spawned ${selectedItem.name} near player!`);
                showItemSpawnMenu = false;
            } else {
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
