/**
 * MultiplayerMain.js - Multiplayer-enabled game initialization
 */
import { Game } from '../engine/Game.js';
import { Physics } from '../engine/Physics.js';
import { Renderer } from '../engine/Renderer.js';
import { CombatSystem } from '../engine/CombatSystem.js';
import { Player } from '../entities/Player.js';
import { InputManager } from '../controls/InputManager.js';
import { VirtualJoystick } from '../controls/VirtualJoystick.js';
import { ActionButtons } from '../controls/ActionButtons.js';
import { LevelManager } from '../levels/LevelManager.js';
import { castleBackgroundImages } from '../levels/CastleBackgroundImage.js';
import { level1 } from '../levels/level1.js';
import { level2 } from '../levels/level2.js';
import { level3 } from '../levels/level3.js';
import { level4 } from '../levels/level4.js';
import { level5 } from '../levels/level5.js';
import { level6 } from '../levels/level6.js';
import { level7 } from '../levels/level7.js';
import { level8 } from '../levels/level8.js';
import { level9 } from '../levels/level9.js';
import { level10 } from '../levels/level10.js';
import { level11 } from '../levels/level11.js';
import { level12 } from '../levels/level12.js';
import { level13 } from '../levels/level13.js';
import { level14 } from '../levels/level14.js';
import { level15 } from '../levels/level15.js';
import { level16 } from '../levels/level16.js';
import { level17 } from '../levels/level17.js';
import { level18 } from '../levels/level18.js';
import { level19 } from '../levels/level19.js';
import { level20 } from '../levels/level20.js';

import { NetworkManager } from './NetworkManager.js';
import { RemotePlayer } from './RemotePlayer.js';
import { StateSync } from './StateSync.js';

const levels = [
    level1, level2, level3, level4, level5,
    level6, level7, level8, level9, level10,
    level11, level12, level13, level14, level15,
    level16, level17, level18, level19, level20
];

// Player slot colors
const SLOT_COLORS = [
    { body: '#4a90d9', outline: '#2d5a8a' },  // Blue (slot 0)
    { body: '#d94a4a', outline: '#8a2d2d' },  // Red (slot 1)
    { body: '#4ad94a', outline: '#2d8a2d' },  // Green (slot 2)
    { body: '#d9d94a', outline: '#8a8a2d' },  // Yellow (slot 3)
];

// Class skins/colors
const CLASS_SKINS = {
    'class_jedi': {
        body: '#5c4333',      // Brown robe
        outline: '#3a2a1a',
        hasLightsaber: true,
        lightsaberColor: '#7df9ff',
        glowingEyes: true,
        eyeColor: '#7df9ff'
    },
    'class_enemy_king': {
        body: '#4a1a1a',      // Dark red armor
        outline: '#2d0a0a',
        hasCrown: true,
        crownColor: '#8b0000',
        hasEvilSword: true,
        swordColor: '#ff3333',
        glowingEyes: true,
        eyeColor: '#ff0000',
        damageBonus: 1.2      // +20% damage
    },
    'class_chef': {
        body: '#ffffff',      // White chef coat
        outline: '#e0e0e0',
        hasChefHat: true,
        hatColor: '#ffffff',
        hasFryingPan: true,
        panColor: '#4a4a4a',
        attackSpeedBonus: 1.15  // +15% attack speed
    },
    'class_skibidi': {
        body: '#f5f5f5',       // Toilet white
        outline: '#c0c0c0',
        isToilet: true,
        hasToiletHead: true,
        jumpBonus: 1.3,       // +30% jump
        speedBonus: 1.25      // +25% speed
    },
    'class_sukuna': {
        body: '#e8d0c0',        // Skin tone with tattoos
        outline: '#1a1a1a',
        isSukuna: true,
        hasFourEyes: true,
        hasTattoos: true,
        hairColor: '#ffb6c1',   // Pink hair
        eyeColor: '#ff0044',    // Red eyes
        damageBonus: 1.5,       // +50% damage
        hasCleave: true
    },
    'class_boxer': {
        body: '#e8c4a0',        // Skin tone
        outline: '#8B4513',
        isBoxer: true,
        hasBoxingGloves: true,
        gloveColor: '#ff4444',  // Red gloves
        damageBonus: 1.25,      // +25% damage
        attackSpeedBonus: 1.2   // +20% attack speed
    }
};

function loadCastleBackground(game, levelIndex) {
    const castleBg = castleBackgroundImages[`level${levelIndex + 1}`];
    if (castleBg) {
        game.backgroundImage = castleBg.getImage();
        return '#0a0a1a';
    }
    game.backgroundImage = null;
    return null;
}

export function initMultiplayerGame(config) {
    console.log('[Multiplayer] Initializing with config:', config);

    const game = new Game('gameCanvas');
    window.game = game;

    // Initialize systems
    game.physics = new Physics(800);
    game.renderer = new Renderer(game.canvas, game.ctx);
    const combatSystem = new CombatSystem();
    const levelManager = new LevelManager(game);

    // Network manager
    const networkManager = new NetworkManager();
    const stateSync = new StateSync(networkManager, config.isHost);

    // Remote players map
    const remotePlayers = new Map();

    // Load level
    const currentLevelIndex = config.level - 1;
    const levelInfo = levelManager.loadLevel(levels[currentLevelIndex]);

    const bgColor = loadCastleBackground(game, currentLevelIndex);
    if (bgColor) {
        levelInfo.backgroundColor = bgColor;
    }

    // Create local player
    const player = new Player(levelInfo.playerSpawn.x, levelInfo.playerSpawn.y);
    player.playerId = config.playerId;
    player.playerSlot = config.playerSlot;
    player.username = config.username;
    player.equippedClass = config.equippedClass || null;

    // Apply class skin or slot color to local player
    if (config.equippedClass && CLASS_SKINS[config.equippedClass]) {
        const classSkin = CLASS_SKINS[config.equippedClass];
        player.slotColors = { body: classSkin.body, outline: classSkin.outline };
        player.classSkin = classSkin;
        console.log(`[Multiplayer] Applied class skin: ${config.equippedClass}`);
    } else {
        const colors = SLOT_COLORS[config.playerSlot % 4];
        player.slotColors = colors;
        player.classSkin = null;
    }

    // Input manager
    const inputManager = new InputManager();
    const joystick = new VirtualJoystick('joystick');
    const actionButtons = new ActionButtons('actionButtons');
    inputManager.bindMobileControls(joystick, actionButtons);

    game.addEntity(player);

    // Network callbacks
    stateSync.onRemotePlayerUpdate = (playerId, state) => {
        if (playerId === config.playerId) return;

        let remotePlayer = remotePlayers.get(playerId);
        if (!remotePlayer) {
            // Create new remote player
            remotePlayer = new RemotePlayer(
                state.x, state.y,
                playerId,
                state.slot || 0,
                state.username || `Player ${playerId}`
            );
            remotePlayers.set(playerId, remotePlayer);
            console.log(`[Multiplayer] New remote player: ${playerId}`);
        }
        remotePlayer.applyNetworkState(state);
    };

    // Enemy state sync for non-host
    stateSync.onEnemyUpdate = (enemyStates) => {
        if (config.isHost) return;

        const enemies = levelManager.getEnemies();
        for (const enemyState of enemyStates) {
            const enemy = enemies.find(e => e.id === enemyState.id);
            if (enemy) {
                stateSync.applyEnemyState(enemy, enemyState);
            }
        }
    };

    // Damage sync
    stateSync.onDamage = (attackerId, targetId, targetType, damage) => {
        if (targetType === 'player') {
            if (targetId === config.playerId) {
                player.takeDamage(damage);
            } else {
                const remotePlayer = remotePlayers.get(targetId);
                if (remotePlayer) {
                    remotePlayer.health -= damage;
                }
            }
        } else if (targetType === 'enemy') {
            const enemies = levelManager.getEnemies();
            const enemy = enemies.find(e => e.id === targetId);
            if (enemy) {
                enemy.takeDamage(damage);
            }
        }
    };

    // Death sync
    stateSync.onDeath = (entityId, entityType, killerId) => {
        if (entityType === 'enemy') {
            const enemies = levelManager.getEnemies();
            const enemy = enemies.find(e => e.id === entityId);
            if (enemy) {
                enemy.health = 0;
                enemy.isAlive = false;
            }
        }
    };

    // Handle player disconnect
    networkManager.onPlayerDisconnected = (playerId, username) => {
        remotePlayers.delete(playerId);
        updatePlayersHUD();
        console.log(`[Multiplayer] Player disconnected: ${username}`);
    };

    // Update players HUD
    function updatePlayersHUD() {
        const hud = document.getElementById('playersHUD');
        if (!hud) return;

        let html = '';

        // Local player
        const localColors = SLOT_COLORS[config.playerSlot % 4];
        html += `<div style="color: ${localColors.body};">${config.username}: ${player.health}HP</div>`;

        // Remote players
        for (const [id, rp] of remotePlayers) {
            const rpColors = SLOT_COLORS[rp.playerSlot % 4];
            html += `<div style="color: ${rpColors.body};">${rp.username}: ${rp.health}HP</div>`;
        }

        hud.innerHTML = html;
    }

    // State sync counter
    let syncCounter = 0;

    // Override update
    const originalUpdate = game.update.bind(game);
    game.update = function(deltaTime) {
        inputManager.updatePlayer(player);
        originalUpdate(deltaTime);

        // Update remote players
        for (const [id, remotePlayer] of remotePlayers) {
            remotePlayer.update(deltaTime);
        }

        // Update combat
        const enemies = levelManager.getEnemies();
        const potions = levelManager.getPotions();
        const armors = levelManager.getArmors();
        const swords = levelManager.getSwords();
        const enemySwords = levelManager.getEnemySwords();
        const slingshots = levelManager.getSlingshots();
        const eliteArmors = levelManager.getEliteArmors();
        const eliteSwords = levelManager.getEliteSwords();
        const totems = levelManager.getTotems();
        const unoCards = levelManager.getUnoCards();

        // Update enemy AI (only on host)
        if (config.isHost) {
            // Collect all players for enemy targeting
            const allPlayers = [player];
            for (const rp of remotePlayers.values()) {
                allPlayers.push(rp);
            }

            for (const enemy of enemies) {
                if (enemy.isAlive) {
                    // Find nearest player
                    let nearestPlayer = player;
                    let nearestDist = Infinity;

                    for (const p of allPlayers) {
                        if (!p.isAlive || (p.health !== undefined && p.health <= 0)) continue;
                        const dx = enemy.x - p.x;
                        const dy = enemy.y - p.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < nearestDist) {
                            nearestDist = dist;
                            nearestPlayer = p;
                        }
                    }

                    enemy.player = nearestPlayer;
                    enemy.platforms = game.platforms;

                    if (enemy.bossType) {
                        enemy.shootAtPlayer(nearestPlayer.x + (nearestPlayer.width || 40)/2, nearestPlayer.y + (nearestPlayer.height || 60)/2);
                        if (enemy.updateAbilities) {
                            enemy.updateAbilities(deltaTime, nearestPlayer, game);
                        }
                    }
                }
            }
        }

        combatSystem.update(player, enemies, potions, armors, swords, enemySwords, slingshots, eliteArmors, eliteSwords, [], totems, unoCards, deltaTime);

        // Cleanup
        if (config.isHost) {
            levelManager.cleanupDeadEnemies(player);
        }
        levelManager.cleanupCollectedPotions();
        levelManager.cleanupCollectedArmors();
        levelManager.cleanupCollectedSwords();
        levelManager.cleanupCollectedEnemySwords();
        levelManager.cleanupCollectedSlingshots();
        levelManager.cleanupCollectedEliteArmors();
        levelManager.cleanupCollectedEliteSwords();
        levelManager.cleanupCollectedTotems();
        levelManager.cleanupCollectedUnoCards();

        // Camera
        game.renderer.followTarget(player, game.canvas);

        // Network sync
        syncCounter++;
        if (syncCounter % 3 === 0) { // 20Hz at 60fps
            stateSync.sendPlayerState(player);
        }

        if (config.isHost && syncCounter % 6 === 0) { // 10Hz
            const items = [...potions, ...armors, ...swords, ...slingshots];
            stateSync.sendGameState(enemies, items);
        }

        // Update HUD
        if (syncCounter % 30 === 0) {
            updatePlayersHUD();
        }

        // Check for player death
        const bounds = levelManager.getBounds();
        if (bounds && player.isAlive && player.y > bounds.maxY + 100) {
            player.takeDamage(player.health);
            setTimeout(() => {
                const spawnPoint = levelManager.getPlayerSpawn();
                player.reset(spawnPoint.x, spawnPoint.y);
            }, 1000);
        }
    };

    // Override render
    const originalRender = game.render.bind(game);
    game.render = function() {
        game.ctx.fillStyle = levelInfo.backgroundColor || '#1a1a2e';
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

        game.ctx.save();
        game.ctx.translate(-game.renderer.cameraX, -game.renderer.cameraY);

        // Background
        if (game.backgroundImage) {
            const parallaxFactor = 0.5;
            const bgX = game.renderer.cameraX * parallaxFactor;
            game.ctx.drawImage(
                game.backgroundImage,
                -bgX, 0,
                game.backgroundImage.width,
                game.backgroundImage.height
            );
        }

        // Platforms
        for (const platform of game.platforms) {
            if (platform.render) {
                platform.render(game.ctx);
            }
        }

        // Entities
        for (const entity of game.entities) {
            if (entity.render) {
                entity.render(game.ctx);
            }
        }

        // Remote players
        const camera = { x: game.renderer.cameraX, y: game.renderer.cameraY };
        for (const [id, remotePlayer] of remotePlayers) {
            remotePlayer.render(game.ctx, { x: 0, y: 0 }); // Already in world coords
        }

        // Level elements
        levelManager.renderLevel(game.ctx);

        game.ctx.restore();

        // UI
        game.ctx.fillStyle = '#fff';
        game.ctx.font = '20px Arial';
        game.ctx.textAlign = 'center';
        game.ctx.fillText(`${levelManager.getCurrentLevelName()} - ${config.mode.toUpperCase()}`, game.canvas.width / 2, 30);

        // Health
        game.ctx.textAlign = 'left';
        game.ctx.font = '16px Arial';
        const healthColor = player.health > 25 ? '#00FF00' : player.health > 10 ? '#FFFF00' : '#FF0000';
        game.ctx.fillStyle = healthColor;
        game.ctx.fillText(`Health: ${player.health}/${player.maxHealth}`, 10, 30);

        // Enemy count
        game.ctx.textAlign = 'right';
        game.ctx.fillStyle = '#FFD700';
        const aliveEnemies = levelManager.getEnemies().filter(e => e.isAlive).length;
        game.ctx.fillText(`Enemies: ${aliveEnemies}`, game.canvas.width - 10, 30);

        // Game over
        if (!player.isAlive) {
            game.ctx.textAlign = 'center';
            game.ctx.font = '48px Arial';
            game.ctx.fillStyle = '#FF0000';
            game.ctx.fillText('GAME OVER', game.canvas.width / 2, game.canvas.height / 2);
            game.ctx.font = '24px Arial';
            game.ctx.fillStyle = '#FFF';
            game.ctx.fillText('Press R to respawn', game.canvas.width / 2, game.canvas.height / 2 + 50);
        }
    };

    // Connect to game server
    networkManager.connect(
        config.roomCode,
        config.playerId,
        config.playerSlot,
        config.isHost
    );

    // Initialize and start
    game.init();
    game.start();

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyP') {
            game.pause();
        } else if (e.code === 'KeyR' && !player.isAlive) {
            const spawn = levelManager.getPlayerSpawn();
            player.reset(spawn.x, spawn.y);
        } else if (e.code === 'KeyE') {
            if (player.inventory.getItemCount('healthPotion') > 0) {
                player.useHealthPotion();
            } else {
                player.useHotbarItem();
            }
        }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        networkManager.disconnect();
    });

    console.log('[Multiplayer] Game initialized!');
    console.log(`[Multiplayer] Room: ${config.roomCode}, Mode: ${config.mode}, Host: ${config.isHost}`);
}
