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

        // Tsunami ability
        this.tsunamis = [];
        this.maxTsunamis = 1;
        this.tsunamiSpawnInterval = 10.0; // Spawn tsunami every 10 seconds
        this.tsunamiSpawnTimer = this.tsunamiSpawnInterval;
        this.tsunamiDuration = 15.0; // Lasts 15 seconds
        this.tsunamiDamage = 15; // 15 damage per second
        this.tsunamiSpeed = 150; // Moves across screen
        this.tsunamiWidth = 100;
        this.tsunamiHeight = 200;
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

        // Update tsunami spawn timer
        this.tsunamiSpawnTimer -= deltaTime;

        if (this.tsunamiSpawnTimer <= 0 && this.tsunamis.length < this.maxTsunamis) {
            this.spawnTsunami(game);
            this.tsunamiSpawnTimer = this.tsunamiSpawnInterval;
        }

        // Update existing tsunamis
        this.tsunamis = this.tsunamis.filter(tsunami => {
            tsunami.lifetime -= deltaTime;
            tsunami.animationTimer += deltaTime;

            // Move tsunami across screen
            tsunami.x += tsunami.direction * this.tsunamiSpeed * deltaTime;

            // Check collision with player (damage per second)
            if (player.isAlive &&
                player.x + player.width > tsunami.x &&
                player.x < tsunami.x + tsunami.width &&
                player.y + player.height > tsunami.y &&
                player.y < tsunami.y + tsunami.height) {

                // Damage player once per second
                if (!tsunami.lastHitTime || (Date.now() - tsunami.lastHitTime >= 1000)) {
                    player.takeDamage(this.tsunamiDamage);
                    tsunami.lastHitTime = Date.now();
                    console.log(`🌊 Tsunami hit player for ${this.tsunamiDamage} damage!`);
                }
            }

            return tsunami.lifetime > 0;
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

    spawnTsunami(game) {
        // Spawn tsunami from either left or right side of screen
        const fromLeft = Math.random() > 0.5;
        const direction = fromLeft ? 1 : -1;
        const spawnX = fromLeft ? -this.tsunamiWidth : game.canvas.width;
        const spawnY = game.canvas.height - this.tsunamiHeight;

        const tsunami = {
            x: spawnX,
            y: spawnY,
            width: this.tsunamiWidth,
            height: this.tsunamiHeight,
            lifetime: this.tsunamiDuration,
            direction: direction,
            animationTimer: 0,
            lastHitTime: 0
        };

        this.tsunamis.push(tsunami);
        console.log('🌊 WaterBoss summoned tsunami!');
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

        // Render tsunamis
        for (const tsunami of this.tsunamis) {
            ctx.save();

            // Tsunami wave gradient
            const tsunamiGradient = ctx.createLinearGradient(
                tsunami.x, tsunami.y,
                tsunami.x, tsunami.y + tsunami.height
            );
            tsunamiGradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)'); // Light blue top
            tsunamiGradient.addColorStop(0.3, 'rgba(30, 144, 255, 0.7)'); // Dodger blue
            tsunamiGradient.addColorStop(0.7, 'rgba(0, 105, 148, 0.9)'); // Deep water
            tsunamiGradient.addColorStop(1, 'rgba(0, 0, 139, 1)'); // Dark blue base

            ctx.fillStyle = tsunamiGradient;

            // Draw tsunami wave shape with curves
            const waveSegments = 5;
            const time = tsunami.animationTimer;

            ctx.beginPath();
            ctx.moveTo(tsunami.x, tsunami.y + tsunami.height);

            // Left edge
            ctx.lineTo(tsunami.x, tsunami.y);

            // Top wave (animated)
            for (let i = 0; i <= waveSegments; i++) {
                const t = i / waveSegments;
                const x = tsunami.x + t * tsunami.width;
                const waveHeight = Math.sin(time * 3 + t * Math.PI * 2) * 15;
                const y = tsunami.y + waveHeight;
                ctx.lineTo(x, y);
            }

            // Right edge
            ctx.lineTo(tsunami.x + tsunami.width, tsunami.y + tsunami.height);
            ctx.closePath();
            ctx.fill();

            // Water foam at top
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#FFFFFF';
            for (let i = 0; i < 10; i++) {
                const foamX = tsunami.x + (i / 10) * tsunami.width + Math.sin(time * 4 + i) * 10;
                const foamY = tsunami.y + Math.sin(time * 3 + i * 0.5) * 20;
                const foamSize = 5 + Math.random() * 8;
                ctx.beginPath();
                ctx.arc(foamX, foamY, foamSize, 0, Math.PI * 2);
                ctx.fill();
            }

            // Water splash particles
            const numParticles = 15;
            for (let i = 0; i < numParticles; i++) {
                const t = (i / numParticles + time * 0.5) % 1;
                const x = tsunami.x + t * tsunami.width;
                const y = tsunami.y + Math.sin(time * 5 + i) * 30;
                const particleSize = 3 + Math.random() * 5;

                ctx.globalAlpha = 0.5 + Math.random() * 0.3;
                ctx.fillStyle = i % 2 === 0 ? '#87CEEB' : '#FFFFFF';
                ctx.beginPath();
                ctx.arc(x, y, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }

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

        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        const isHit = this.hitFlashTimer > 0;
        const t = Date.now() / 1000;

        // === WATER ELEMENTAL / SEA KING ===

        // Body - flowing water
        const bodyGrad = ctx.createLinearGradient(x + 10, y + 35, x + w - 10, y + 100);
        bodyGrad.addColorStop(0, isHit ? '#FFF' : '#0E5A8A');
        bodyGrad.addColorStop(0.3, isHit ? '#FFF' : '#1E90FF');
        bodyGrad.addColorStop(0.6, isHit ? '#FFF' : '#4169E1');
        bodyGrad.addColorStop(1, isHit ? '#FFF' : '#0E5A8A');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(x + 10, y + 35, w - 20, 65);

        // Water flow lines on body (animated)
        if (!isHit) {
            ctx.strokeStyle = '#87CEEB';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.5;
            for (let i = 0; i < 5; i++) {
                const waveY = y + 42 + i * 12;
                ctx.beginPath();
                for (let j = 0; j <= 8; j++) {
                    const wx = x + 15 + j * (w - 30) / 8;
                    const wy = waveY + Math.sin(t * 3 + j * 0.8 + i) * 3;
                    if (j === 0) ctx.moveTo(wx, wy);
                    else ctx.lineTo(wx, wy);
                }
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        // Water core - swirling center
        if (!isHit) {
            const coreGrad = ctx.createRadialGradient(x + w / 2, y + 65, 2, x + w / 2, y + 65, 16);
            coreGrad.addColorStop(0, 'rgba(135,206,235,0.9)');
            coreGrad.addColorStop(0.4, 'rgba(30,144,255,0.6)');
            coreGrad.addColorStop(1, 'rgba(30,144,255,0)');
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 65, 16, 0, Math.PI * 2);
            ctx.fill();

            // Swirl lines in core
            ctx.strokeStyle = '#E0F0FF';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 2; a += 0.2) {
                const r = 4 + a * 1.5;
                const px = x + w / 2 + Math.cos(a + t * 2) * r;
                const py = y + 65 + Math.sin(a + t * 2) * r;
                if (a === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Coral/shell shoulder armor
        for (let side = 0; side < 2; side++) {
            const sx = side === 0 ? x + 3 : x + w - 3;
            const dir = side === 0 ? -1 : 1;
            // Shell shape
            const shellGrad = ctx.createRadialGradient(sx + dir * 10, y + 40, 2, sx + dir * 10, y + 40, 16);
            shellGrad.addColorStop(0, isHit ? '#FFF' : '#4682B4');
            shellGrad.addColorStop(1, isHit ? '#FFF' : '#1C3D5A');
            ctx.fillStyle = shellGrad;
            ctx.beginPath();
            ctx.ellipse(sx + dir * 10, y + 40, 18, 14, dir * 0.2, 0, Math.PI * 2);
            ctx.fill();
            // Shell ridges
            if (!isHit) {
                ctx.strokeStyle = '#87CEEB';
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.5;
                for (let r = 0; r < 3; r++) {
                    ctx.beginPath();
                    ctx.arc(sx + dir * 10, y + 40, 6 + r * 4, Math.PI * 0.3, Math.PI * 0.7);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            }
        }

        // Head - water orb
        const headGrad = ctx.createRadialGradient(x + w / 2, y + 18, 5, x + w / 2, y + 18, 24);
        headGrad.addColorStop(0, isHit ? '#FFF' : '#4AA8D8');
        headGrad.addColorStop(0.6, isHit ? '#FFF' : '#1E6FA0');
        headGrad.addColorStop(1, isHit ? '#FFF' : '#0E4A6A');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 18, 24, 0, Math.PI * 2);
        ctx.fill();

        // Water droplet highlights on head
        if (!isHit) {
            ctx.fillStyle = 'rgba(135,206,235,0.4)';
            ctx.beginPath();
            ctx.arc(x + w / 2 - 8, y + 10, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w / 2 + 5, y + 7, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Wave crown (animated waves on top)
        for (let i = 0; i < 7; i++) {
            const wx = x + 22 + i * 12;
            const waveH = 8 + Math.sin(t * 3 + i * 0.9) * 4;
            const waveGrad = ctx.createLinearGradient(wx, y - 5, wx, y - 5 - waveH);
            waveGrad.addColorStop(0, isHit ? '#FFF' : '#1E90FF');
            waveGrad.addColorStop(0.5, isHit ? '#FFF' : '#87CEEB');
            waveGrad.addColorStop(1, isHit ? '#FFF' : 'rgba(135,206,235,0.3)');
            ctx.fillStyle = waveGrad;
            ctx.beginPath();
            ctx.moveTo(wx - 5, y - 3);
            ctx.quadraticCurveTo(wx, y - 3 - waveH, wx + 5, y - 3);
            ctx.fill();
        }
        // Foam on wave tips
        if (!isHit) {
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            for (let i = 0; i < 5; i++) {
                const fx = x + 25 + i * 15 + Math.sin(t * 4 + i) * 3;
                const fy = y - 8 - Math.sin(t * 3 + i * 0.9) * 4;
                ctx.beginPath();
                ctx.arc(fx, fy, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Face
        ctx.fillStyle = isHit ? '#FFF' : '#0A3A5A';
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 14, y + 16);
        ctx.lineTo(x + w / 2 + 14, y + 16);
        ctx.lineTo(x + w / 2 + 10, y + 30);
        ctx.lineTo(x + w / 2 - 10, y + 30);
        ctx.closePath();
        ctx.fill();

        // Eyes - deep ocean glow
        ctx.fillStyle = isHit ? '#FFF' : '#00BFFF';
        ctx.shadowColor = '#00BFFF';
        ctx.shadowBlur = isHit ? 0 : 10;
        ctx.beginPath();
        ctx.arc(x + w / 2 - 8, y + 20, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w / 2 + 8, y + 20, 4, 0, Math.PI * 2);
        ctx.fill();
        // Eye pupils
        ctx.fillStyle = isHit ? '#FFF' : '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x + w / 2 - 7, y + 19, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w / 2 + 9, y + 19, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Belt - seashell
        ctx.fillStyle = isHit ? '#FFF' : '#0D4D6D';
        ctx.fillRect(x + 15, y + 92, w - 30, 8);
        // Trident buckle
        if (!isHit) {
            ctx.strokeStyle = '#87CEEB';
            ctx.lineWidth = 2;
            const bx = x + w / 2;
            const by = y + 96;
            ctx.beginPath();
            ctx.moveTo(bx, by + 5);
            ctx.lineTo(bx, by - 5);
            ctx.moveTo(bx - 4, by - 3);
            ctx.lineTo(bx - 4, by - 6);
            ctx.moveTo(bx + 4, by - 3);
            ctx.lineTo(bx + 4, by - 6);
            ctx.moveTo(bx - 5, by - 3);
            ctx.lineTo(bx + 5, by - 3);
            ctx.stroke();
        }

        // Legs - water flow
        const legGrad = ctx.createLinearGradient(x, y + 100, x, y + h);
        legGrad.addColorStop(0, isHit ? '#FFF' : '#1E6FA0');
        legGrad.addColorStop(1, isHit ? '#FFF' : '#0A3A5A');
        ctx.fillStyle = legGrad;
        ctx.fillRect(x + 18, y + 100, 30, 50);
        ctx.fillRect(x + w - 48, y + 100, 30, 50);

        // Water boots
        ctx.fillStyle = isHit ? '#FFF' : '#082D44';
        ctx.fillRect(x + 14, y + h - 14, 38, 14);
        ctx.fillRect(x + w - 52, y + h - 14, 38, 14);

        // Water drip from body
        if (!isHit) {
            ctx.fillStyle = '#87CEEB';
            for (let i = 0; i < 4; i++) {
                const dx = x + 20 + i * 25;
                const dropY = y + h + ((t * 30 + i * 10) % 15);
                const dropSize = 2 + Math.sin(t + i) * 0.5;
                ctx.globalAlpha = 1 - ((t * 30 + i * 10) % 15) / 15;
                ctx.beginPath();
                ctx.arc(dx, dropY, dropSize, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // Bubbles floating up
        if (!isHit) {
            ctx.strokeStyle = 'rgba(135,206,235,0.5)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const bx = x + 15 + Math.sin(t + i * 1.5) * 20 + (w / 2 - 15);
                const by = y + h - ((t * 25 + i * 30) % (h + 10));
                const br = 2 + Math.sin(t * 2 + i) * 1;
                ctx.globalAlpha = 0.3 + Math.sin(t + i) * 0.2;
                ctx.beginPath();
                ctx.arc(bx, by, br, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        // Health bar
        const barWidth = w;
        const barHeight = 12;
        const barX = x;
        const barY = y - 25;
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
