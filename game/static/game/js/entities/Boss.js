// Boss enemy - powerful enemy with ranged attacks
import { Enemy } from './Enemy.js';

export class Boss extends Enemy {
    constructor(x, y, bossType = 'basic') {
        // Call Enemy constructor with position
        super(x, y);

        // Override size for boss
        this.width = 120;
        this.height = 150;

        // Override stats for boss (much stronger than regular enemy)
        this.maxHealth = 80;
        this.health = 80;
        this.damage = 8; // Boss projectile damage

        // Override movement (slower patrol, limited to platform)
        this.moveSpeed = 30; // Slower than regular enemies (regular: 80)
        this.patrolDistance = 70; // Limited patrol so boss stays on center platform (300px wide)

        // Combat
        this.attackRange = 300; // 5 meters (300 pixels = ~5 meters)
        this.attackCooldown = 2.0; // seconds between attacks
        this.attackTimer = 0;
        this.isAttacking = false;

        // Boss always has armor (for loot system)
        this.hasArmor = true;

        // Visual
        this.color = '#8B008B'; // Dark magenta for boss
        this.hitFlashTimer = 0;

        // Projectiles
        this.projectiles = [];

        // Make boss completely static (no physics)
        this.isStatic = true;

        // Ability system (for specialized boss subclasses)
        this.bossType = bossType;
        this.abilities = [];
        this.abilityTimers = {};

        // Initialize boss-specific abilities (override in subclasses)
        this.initializeAbilities();
    }

    // Virtual method - override in subclasses to add unique abilities
    initializeAbilities() {
        // Base boss has no special abilities
    }

    // Virtual method - override in subclasses to update abilities
    updateAbilities(deltaTime, player, game) {
        // Base boss has no abilities to update
    }

    // Virtual method - override in subclasses to render ability effects
    renderAbilities(ctx) {
        // Base boss has no ability effects to render
    }

    // Override AI - boss doesn't move at all
    updateAI() {
        // Boss is stationary - doesn't move, only shoots
        this.vx = 0;
        this.vy = 0;
    }

    update(deltaTime) {
        // Call parent Enemy.update() for patrol, timers, etc.
        super.update(deltaTime);

        // Boss-specific: Update projectiles
        if (this.projectiles && this.projectiles.length > 0) {
            if (Math.random() < 0.01) { // Log 1% of the time
                console.log(`Boss ${this.bossType} updating ${this.projectiles.length} projectiles`);
            }
            this.projectiles = this.projectiles.filter(proj => {
                proj.x += proj.velocityX * deltaTime;
                proj.y += proj.velocityY * deltaTime;
                proj.lifetime -= deltaTime;
                return proj.lifetime > 0;
            });
        }
    }

    // Boss can shoot projectiles at player
    shootAtPlayer(playerX, playerY) {
        if (this.attackTimer > 0 || !this.isAlive) return;

        const dx = playerX - (this.x + this.width / 2);
        const dy = playerY - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only shoot if player is within range
        if (distance <= this.attackRange) {
            const speed = 200; // Projectile speed
            const velocityX = (dx / distance) * speed;
            const velocityY = (dy / distance) * speed;

            this.projectiles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                velocityX: velocityX,
                velocityY: velocityY,
                lifetime: 3.0, // 3 seconds
                radius: 8,
                damage: this.damage
            });

            this.attackTimer = this.attackCooldown;
            console.log('Boss shoots projectile!');
        }
    }

    // Override takeDamage to show boss-specific message
    takeDamage(amount) {
        if (!this.isAlive) return;

        this.health -= amount;
        this.hitFlashTimer = 0.2;

        console.log(`💥 Boss took ${amount} damage! HP: ${this.health}/${this.maxHealth}`);

        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    // Override die to show boss-specific message and drop elemental shard
    die() {
        this.isAlive = false;
        this.shouldDropShard = true; // Flag for LevelManager to drop shard
        console.log(`💀 BOSS ${this.bossType} DEFEATED! Final position: (${this.x}, ${this.y})`);
        console.log(`✨ Boss will drop ${this.bossType} elemental shard!`);
        console.trace('Boss death stack trace');
    }

    render(ctx) {
        if (!this.isAlive) return;

        ctx.save();

        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        const isHit = this.hitFlashTimer > 0;

        // === ARMORED DARK KNIGHT ===

        // Body armor - main torso
        const bodyGrad = ctx.createLinearGradient(x, y + 30, x + w, y + 100);
        bodyGrad.addColorStop(0, isHit ? '#FFFFFF' : '#5C005C');
        bodyGrad.addColorStop(0.5, isHit ? '#FFFFFF' : '#8B008B');
        bodyGrad.addColorStop(1, isHit ? '#FFFFFF' : '#5C005C');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(x + 10, y + 35, w - 20, 65);

        // Chest plate (central armor)
        const chestGrad = ctx.createLinearGradient(x + 25, y + 40, x + 25, y + 90);
        chestGrad.addColorStop(0, isHit ? '#FFF' : '#A020A0');
        chestGrad.addColorStop(0.5, isHit ? '#FFF' : '#6A006A');
        chestGrad.addColorStop(1, isHit ? '#FFF' : '#A020A0');
        ctx.fillStyle = chestGrad;
        ctx.beginPath();
        ctx.moveTo(x + 30, y + 40);
        ctx.lineTo(x + w - 30, y + 40);
        ctx.lineTo(x + w - 25, y + 90);
        ctx.lineTo(x + 25, y + 90);
        ctx.closePath();
        ctx.fill();

        // Chest emblem (diamond shape)
        ctx.fillStyle = isHit ? '#FFF' : '#FFD700';
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + 50);
        ctx.lineTo(x + w / 2 + 10, y + 65);
        ctx.lineTo(x + w / 2, y + 80);
        ctx.lineTo(x + w / 2 - 10, y + 65);
        ctx.closePath();
        ctx.fill();

        // Shoulder plates (left)
        ctx.fillStyle = isHit ? '#FFF' : '#6B006B';
        ctx.beginPath();
        ctx.ellipse(x + 8, y + 42, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isHit ? '#FFF' : '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Shoulder plates (right)
        ctx.beginPath();
        ctx.ellipse(x + w - 8, y + 42, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Head
        const headGrad = ctx.createRadialGradient(x + w / 2, y + 18, 5, x + w / 2, y + 18, 22);
        headGrad.addColorStop(0, isHit ? '#FFF' : '#9B009B');
        headGrad.addColorStop(1, isHit ? '#FFF' : '#5C005C');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 18, 22, 0, Math.PI * 2);
        ctx.fill();

        // Helmet visor
        ctx.fillStyle = isHit ? '#FFF' : '#2D002D';
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 16, y + 14);
        ctx.lineTo(x + w / 2 + 16, y + 14);
        ctx.lineTo(x + w / 2 + 12, y + 28);
        ctx.lineTo(x + w / 2 - 12, y + 28);
        ctx.closePath();
        ctx.fill();

        // Eyes (glowing through visor)
        ctx.fillStyle = isHit ? '#FFF' : '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = isHit ? 0 : 8;
        ctx.fillRect(x + w / 2 - 12, y + 17, 7, 5);
        ctx.fillRect(x + w / 2 + 5, y + 17, 7, 5);
        ctx.shadowBlur = 0;

        // Crown
        ctx.fillStyle = isHit ? '#FFF' : '#FFD700';
        for (let i = 0; i < 5; i++) {
            const cx = x + 30 + i * 15;
            const spikeH = i % 2 === 0 ? 14 : 10;
            ctx.beginPath();
            ctx.moveTo(cx - 5, y - 2);
            ctx.lineTo(cx, y - 2 - spikeH);
            ctx.lineTo(cx + 5, y - 2);
            ctx.closePath();
            ctx.fill();
        }
        ctx.fillRect(x + 25, y - 2, 70, 5);

        // Belt
        ctx.fillStyle = isHit ? '#FFF' : '#4A004A';
        ctx.fillRect(x + 15, y + 92, w - 30, 8);
        ctx.fillStyle = isHit ? '#FFF' : '#FFD700';
        ctx.fillRect(x + w / 2 - 6, y + 91, 12, 10);

        // Legs
        const legGrad = ctx.createLinearGradient(x, y + 100, x, y + h);
        legGrad.addColorStop(0, isHit ? '#FFF' : '#6B006B');
        legGrad.addColorStop(1, isHit ? '#FFF' : '#3D003D');
        ctx.fillStyle = legGrad;
        // Left leg
        ctx.fillRect(x + 18, y + 100, 30, 50);
        // Right leg
        ctx.fillRect(x + w - 48, y + 100, 30, 50);

        // Boots
        ctx.fillStyle = isHit ? '#FFF' : '#2D002D';
        ctx.fillRect(x + 14, y + h - 12, 38, 12);
        ctx.fillRect(x + w - 52, y + h - 12, 38, 12);

        // Armor line details
        ctx.strokeStyle = isHit ? '#FFF' : '#FFD70080';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 30, y + 55);
        ctx.lineTo(x + w - 30, y + 55);
        ctx.moveTo(x + 30, y + 70);
        ctx.lineTo(x + w - 30, y + 70);
        ctx.moveTo(x + 30, y + 85);
        ctx.lineTo(x + w - 30, y + 85);
        ctx.stroke();

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

        // Render projectiles
        ctx.fillStyle = '#FF4500';
        for (const proj of this.projectiles) {
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    // Get bounding box for collision
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
