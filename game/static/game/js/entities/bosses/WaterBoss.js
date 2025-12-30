// WaterBoss - Boss with knockback and healing pool abilities
import { Boss } from '../Boss.js';

export class WaterBoss extends Boss {
    constructor(x, y) {
        super(x, y, 'water');

        // Boss stats for Level 15 (Boss #5)
        this.maxHealth = 240;
        this.health = 240;
        this.damage = 20;

        // Visual customization
        this.color = '#1E90FF'; // Dodger blue for water
        this.projectileColor = '#4169E1'; // Royal blue for water projectiles

        // Healing pool ability
        this.healingPools = [];
        this.maxHealingPools = 2;
        this.poolSpawnTimer = 0;
        this.poolSpawnInterval = 8.0; // Create new pool every 8 seconds
        this.poolHealRate = 2; // 2 HP per second
        this.poolDuration = 15.0; // Pools last 15 seconds
        this.poolHealTimer = 0;
    }

    initializeAbilities() {
        // Water boss creates healing pools
        this.abilityTimers.poolSpawn = 0;
    }

    updateAbilities(deltaTime, player, game) {
        // Update pool spawn timer
        this.poolSpawnTimer -= deltaTime;

        if (this.poolSpawnTimer <= 0 && this.healingPools.length < this.maxHealingPools) {
            this.createHealingPool();
            this.poolSpawnTimer = this.poolSpawnInterval;
        }

        // Update healing pools
        this.poolHealTimer -= deltaTime;
        this.healingPools = this.healingPools.filter(pool => {
            pool.lifetime -= deltaTime;
            pool.animationTimer += deltaTime;

            // Check if boss overlaps pool for healing
            const bossBox = this.getBounds();
            const poolBox = {
                x: pool.x - pool.radius,
                y: pool.y - pool.radius,
                width: pool.radius * 2,
                height: pool.radius * 2
            };

            if (this.boxesOverlap(bossBox, poolBox) && !pool.corrupted) {
                if (this.poolHealTimer <= 0) {
                    const healAmount = Math.min(pool.healRate, this.maxHealth - this.health);
                    this.health += healAmount;
                    this.poolHealTimer = 1.0;
                    if (healAmount > 0) {
                        console.log(`💧 WaterBoss healed ${healAmount} HP from pool!`);
                    }
                }
            }

            return pool.lifetime > 0 && !pool.corrupted;
        });
    }

    // Helper for box overlap check
    boxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }

    createHealingPool() {
        // Create healing pool near boss
        const randomAngle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const poolX = this.x + this.width / 2 + Math.cos(randomAngle) * distance;
        const poolY = this.y + this.height + 20; // On ground

        const pool = {
            x: poolX,
            y: poolY,
            radius: 40,
            lifetime: this.poolDuration,
            healRate: this.poolHealRate,
            animationTimer: 0,
            corrupted: false,
            corruptTimer: 0
        };

        this.healingPools.push(pool);
        console.log('💧 WaterBoss created healing pool!');
    }

    // Override shootAtPlayer to create water projectiles with knockback
    shootAtPlayer(playerX, playerY) {
        if (this.attackTimer > 0 || !this.isAlive) return;

        const dx = playerX - (this.x + this.width / 2);
        const dy = playerY - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.attackRange) {
            const speed = 200;
            const velocityX = (dx / distance) * speed;
            const velocityY = (dy / distance) * speed;

            this.projectiles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                velocityX: velocityX,
                velocityY: velocityY,
                lifetime: 3.0,
                radius: 10,
                damage: this.damage,
                type: 'water' // Special type for knockback
            });

            this.attackTimer = this.attackCooldown;
            console.log('WaterBoss shoots water projectile!');
        }
    }

    renderAbilities(ctx) {
        // Render healing pools
        for (const pool of this.healingPools) {
            ctx.save();

            // Ripple animation
            const ripple = Math.sin(pool.animationTimer * 3) * 5;

            ctx.globalAlpha = 0.6;
            ctx.fillStyle = pool.corrupted ? '#8B4513' : '#87CEEB'; // Brown if corrupted, light blue otherwise
            ctx.beginPath();
            ctx.arc(pool.x, pool.y, pool.radius + ripple, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(pool.x, pool.y, pool.radius + ripple + 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // Render water projectiles
        for (const proj of this.projectiles) {
            if (proj.type === 'water') {
                ctx.save();

                // Water splash effect
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#87CEEB';
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, proj.radius + 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 1.0;
                ctx.fillStyle = this.projectileColor;
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }
    }

    render(ctx) {
        if (!this.isAlive) return;

        ctx.save();

        if (this.hitFlashTimer > 0) {
            ctx.fillStyle = '#FFFFFF';
        } else {
            ctx.fillStyle = this.color;
        }

        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Wave crown
        ctx.fillStyle = '#00CED1';
        const crownY = this.y - 15;
        for (let i = 0; i < 8; i++) {
            const waveX = this.x + 10 + i * 14;
            const waveHeight = 15 + Math.sin(Date.now() / 300 + i) * 5;
            ctx.beginPath();
            ctx.arc(waveX, crownY + 10 - waveHeight, 8, 0, Math.PI, true);
            ctx.fill();
        }

        // Eyes - deep blue
        ctx.fillStyle = '#000080';
        ctx.fillRect(this.x + 30, this.y + 40, 18, 18);
        ctx.fillRect(this.x + 72, this.y + 40, 18, 18);

        // Health bar
        const barWidth = this.width;
        const barHeight = 12;
        const barX = this.x;
        const barY = this.y - 25;

        ctx.fillStyle = '#FF0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        this.renderAbilities(ctx);

        ctx.restore();
    }
}
