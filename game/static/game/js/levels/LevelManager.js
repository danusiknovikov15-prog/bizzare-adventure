// Level manager for loading and managing game levels
import { Platform } from '../entities/Platform.js';
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import { EliteEnemy } from '../entities/EliteEnemy.js';
import { Door } from '../entities/Door.js';
import { ItemFactory } from '../systems/ItemFactory.js';
import { LootSystem } from '../systems/LootSystem.js';
import { EntityManager } from '../systems/EntityManager.js';

// Import specialized bosses
import { AcidBoss } from '../entities/bosses/AcidBoss.js';
import { FireBoss } from '../entities/bosses/FireBoss.js';
import { IceBoss } from '../entities/bosses/IceBoss.js';
import { LightningBoss } from '../entities/bosses/LightningBoss.js';
import { WaterBoss } from '../entities/bosses/WaterBoss.js';
import { VoidBoss } from '../entities/bosses/VoidBoss.js';

export class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevel = null;
        this.levelData = null;
        this.door = null; // Track level exit door

        // New systems for entity and item management
        this.itemFactory = new ItemFactory();
        this.lootSystem = new LootSystem(this.itemFactory);
        this.entityManager = new EntityManager(game);

        // Track initial enemy count for level completion
        this.initialEnemyCount = 0;

        // Tutorial system
        this.tutorialHintsShown = new Set(); // Отслеживание показанных подсказок
        this.activeTutorialHint = null;      // Текущая активная подсказка

        console.log('LevelManager initialized with new systems');
    }

    // Load a level from level data
    loadLevel(levelData) {
        console.log(`Loading level: ${levelData.name}`);

        // Сбросить туториальные подсказки при загрузке нового уровня
        this.tutorialHintsShown.clear();
        this.activeTutorialHint = null;

        this.levelData = levelData;
        this.currentLevel = levelData.name;

        // Clear existing platforms
        this.game.platforms = [];

        // Create platforms from level data
        for (const platformData of levelData.platforms) {
            const platform = new Platform(
                platformData.x,
                platformData.y,
                platformData.width,
                platformData.height,
                platformData.color
            );
            this.game.addPlatform(platform);
        }

        // IMPORTANT: Clear all game entities first (but keep the player!)
        // Save the player before clearing
        const player = this.game.entities.find(e => e.constructor.name === 'Player');
        this.game.entities = [];

        // Restore player if found
        if (player) {
            this.game.entities.push(player);
        }

        // Clear entity manager tracking
        this.entityManager.clear();

        // Create enemies from level data
        if (levelData.enemies) {
            console.log(`📊 Creating ${levelData.enemies.length} enemies for ${levelData.name}`);
            for (const enemyData of levelData.enemies) {
                console.log(`  Enemy data:`, enemyData);
                let enemy;
                if (enemyData.isBoss) {
                    console.log(`  -> This is a BOSS! bossType=${enemyData.bossType}`);
                    // Boss factory - create specialized bosses based on type
                    if (enemyData.bossType) {
                        switch(enemyData.bossType) {
                            case 'acid':
                                enemy = new AcidBoss(enemyData.x, enemyData.y);
                                console.log('🧪 ACID BOSS SPAWNED!');
                                break;
                            case 'fire':
                                enemy = new FireBoss(enemyData.x, enemyData.y);
                                console.log('🔥 FIRE BOSS SPAWNED!');
                                break;
                            case 'ice':
                                enemy = new IceBoss(enemyData.x, enemyData.y);
                                console.log('❄️ ICE BOSS SPAWNED!');
                                break;
                            case 'lightning':
                                enemy = new LightningBoss(enemyData.x, enemyData.y);
                                console.log('⚡ LIGHTNING BOSS SPAWNED!');
                                break;
                            case 'water':
                                enemy = new WaterBoss(enemyData.x, enemyData.y);
                                console.log('💧 WATER BOSS SPAWNED!');
                                break;
                            case 'void':
                                enemy = new VoidBoss(enemyData.x, enemyData.y);
                                console.log('🌀 VOID BOSS SPAWNED!');
                                break;
                            default:
                                enemy = new Boss(enemyData.x, enemyData.y);
                                console.log('⚔️ BOSS SPAWNED!');
                        }
                    } else {
                        enemy = new Boss(enemyData.x, enemyData.y);
                        console.log('⚔️ BOSS SPAWNED!');
                    }
                } else if (enemyData.isElite) {
                    enemy = new EliteEnemy(enemyData.x, enemyData.y);
                    console.log('👑 ELITE ENEMY SPAWNED!');
                } else {
                    enemy = new Enemy(enemyData.x, enemyData.y);
                }
                this.entityManager.addEntity('enemies', enemy);
            }

            // Save initial enemy count for level completion tracking
            this.initialEnemyCount = levelData.enemies.length;
            console.log(`Spawned ${levelData.enemies.length} enemies`);
        } else {
            this.initialEnemyCount = 0;
        }

        // Create door if specified in level data
        if (levelData.door) {
            this.door = new Door(levelData.door.x, levelData.door.y);
            this.game.addEntity(this.door);
            console.log('Door created');
        } else {
            this.door = null;
        }

        console.log(`Level loaded: ${this.currentLevel} with ${levelData.platforms.length} platforms`);

        const enemies = this.entityManager.getEntities('enemies');
        return {
            playerSpawn: levelData.playerSpawn,
            backgroundColor: levelData.backgroundColor,
            bounds: levelData.bounds,
            goal: levelData.goal,
            enemies: enemies
        };
    }

    // Get player spawn position
    getPlayerSpawn() {
        if (!this.levelData) return { x: 100, y: 100 };
        return this.levelData.playerSpawn;
    }

    // Get level bounds
    getBounds() {
        if (!this.levelData) return null;
        return this.levelData.bounds;
    }

    // Get goal position
    getGoal() {
        if (!this.levelData) return null;
        return this.levelData.goal;
    }

    // Check if player reached the goal
    checkGoalReached(player) {
        const goal = this.getGoal();
        if (!goal) return false;

        return player.x + player.width >= goal.x &&
               player.x <= goal.x + goal.width &&
               player.y + player.height >= goal.y &&
               player.y <= goal.y + goal.height;
    }

    // Update tutorial system
    updateTutorial(player) {
        // Пропустить если не туториальный уровень
        if (!this.levelData || !this.levelData.isTutorial || !this.levelData.tutorialHints) {
            return;
        }

        this.activeTutorialHint = null;

        // Проверить каждую подсказку
        for (const hint of this.levelData.tutorialHints) {
            // Пропустить если уже показана и showOnce = true
            if (hint.showOnce && this.tutorialHintsShown.has(hint.id)) {
                continue;
            }

            // Проверить, находится ли игрок в зоне триггера
            const playerCenterX = player.x + player.width / 2;
            const playerCenterY = player.y + player.height / 2;

            if (playerCenterX >= hint.x &&
                playerCenterX <= hint.x + hint.width &&
                playerCenterY >= hint.y &&
                playerCenterY <= hint.y + hint.height) {

                this.activeTutorialHint = hint;

                // Отметить как показанную
                if (hint.showOnce) {
                    this.tutorialHintsShown.add(hint.id);
                }

                break; // Показать только одну подсказку за раз
            }
        }
    }

    // Render tutorial hint
    renderTutorialHint(ctx, hint) {
        const boxWidth = 400;
        const boxHeight = 120;
        const padding = 20;

        // Позиция подсказки (верх центр экрана, screen-space)
        const boxX = (ctx.canvas.width - boxWidth) / 2;
        const boxY = 80; // Под названием уровня

        // Полупрозрачный фон
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Золотая рамка
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Заголовок (белый, жирный)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(hint.title, boxX + boxWidth / 2, boxY + padding);

        // Основной текст (белый)
        ctx.font = '16px Arial';
        ctx.fillText(hint.text, boxX + boxWidth / 2, boxY + padding + 30);

        // Подтекст (серый, курсив)
        ctx.fillStyle = '#AAAAAA';
        ctx.font = 'italic 14px Arial';
        ctx.fillText(hint.subtext, boxX + boxWidth / 2, boxY + padding + 55);

        // Индикатор "продолжай двигаться" (мигающий)
        const blinkSpeed = 1000; // мс
        const opacity = (Math.sin(Date.now() / blinkSpeed * Math.PI * 2) + 1) / 2;
        ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`;
        ctx.font = '12px Arial';
        ctx.fillText('Двигайся чтобы продолжить', boxX + boxWidth / 2, boxY + padding + 85);
    }

    // Render level-specific elements
    renderLevel(ctx) {
        // Рендер активной туториальной подсказки
        if (this.activeTutorialHint) {
            this.renderTutorialHint(ctx, this.activeTutorialHint);
        }
    }

    // Get current level name
    getCurrentLevelName() {
        return this.currentLevel || 'No level loaded';
    }

    // Get all enemies (including Boss and EliteEnemy)
    getEnemies() {
        // Filter to ensure only actual Enemy/Boss/EliteEnemy instances are returned
        // Use instanceof to check for Boss subclasses (AcidBoss, FireBoss, etc.)
        return this.entityManager.getEntities('enemies').filter(entity => {
            return entity &&
                   (entity instanceof Enemy || entity instanceof Boss || entity instanceof EliteEnemy) &&
                   typeof entity.isAlive !== 'undefined';
        });
    }

    // Remove dead enemies and generate loot
    cleanupDeadEnemies() {
        const enemies = this.entityManager.getEntities('enemies');
        const deadEnemies = enemies.filter(e => !e.isAlive);

        for (const enemy of deadEnemies) {
            // Generate loot through LootSystem
            const drops = this.lootSystem.generateLoot(enemy);

            // Create items through ItemFactory
            const categoryMap = this.itemFactory.getCategoryMap();

            for (const drop of drops) {
                const item = this.itemFactory.createItem(drop.type, drop.x, drop.y);
                if (item) {
                    const category = categoryMap[drop.type];
                    this.entityManager.addEntity(category, item);
                }
            }

            // Remove dead enemy
            this.entityManager.removeEntity('enemies', enemy);
        }

        return deadEnemies.length;
    }

    // Get all potions
    getPotions() {
        return this.entityManager.getEntities('potions');
    }

    // Get all armors
    getArmors() {
        return this.entityManager.getEntities('armors');
    }

    // Get all swords
    getSwords() {
        return this.entityManager.getEntities('swords');
    }

    // Get all enemy swords
    getEnemySwords() {
        return this.entityManager.getEntities('enemySwords');
    }

    // Get all slingshots
    getSlingshots() {
        return this.entityManager.getEntities('slingshots');
    }

    // Get all elite armors
    getEliteArmors() {
        return this.entityManager.getEntities('eliteArmors');
    }

    // Get all elite swords
    getEliteSwords() {
        return this.entityManager.getEntities('eliteSwords');
    }

    // Remove collected potions
    cleanupCollectedPotions() {
        return this.entityManager.cleanupCollected('potions');
    }

    // Remove collected armors
    cleanupCollectedArmors() {
        return this.entityManager.cleanupCollected('armors');
    }

    // Remove collected swords
    cleanupCollectedSwords() {
        return this.entityManager.cleanupCollected('swords');
    }

    // Remove collected enemy swords
    cleanupCollectedEnemySwords() {
        return this.entityManager.cleanupCollected('enemySwords');
    }

    // Remove collected slingshots
    cleanupCollectedSlingshots() {
        return this.entityManager.cleanupCollected('slingshots');
    }

    // Remove collected elite armors
    cleanupCollectedEliteArmors() {
        return this.entityManager.cleanupCollected('eliteArmors');
    }

    // Remove collected elite swords
    cleanupCollectedEliteSwords() {
        return this.entityManager.cleanupCollected('eliteSwords');
    }

    // Remove all collected items at once
    cleanupAllCollectedItems() {
        return this.entityManager.cleanupAllCollected();
    }


    // Get door
    getDoor() {
        return this.door;
    }

    // Get initial enemy count (for level completion check)
    getInitialEnemyCount() {
        return this.initialEnemyCount;
    }

    // Check if player can enter door
    checkDoorEntry(player) {
        if (!this.door || !player.isAlive) return false;

        // Check if player is near door
        const playerBox = player.getBounds();
        const doorBox = this.door.getBounds();

        const distance = Math.sqrt(
            Math.pow(playerBox.x - doorBox.x, 2) +
            Math.pow(playerBox.y - doorBox.y, 2)
        );

        return distance < 150; // Within 150 pixels (increased range)
    }
}
