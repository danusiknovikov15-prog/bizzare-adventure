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

    // Override die to show boss-specific message
    die() {
        this.isAlive = false;
        console.log(`💀 BOSS ${this.bossType} DEFEATED! Final position: (${this.x}, ${this.y})`);
        console.trace('Boss death stack trace');
    }

    render(ctx) {
        if (!this.isAlive) return;

        ctx.save();

        // Flash white when hit
        if (this.hitFlashTimer > 0) {
            ctx.fillStyle = '#FFFFFF';
        } else {
            ctx.fillStyle = this.color;
        }

        // Boss body (larger rectangle)
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Boss crown (to show it's special) - scaled for larger boss
        ctx.fillStyle = '#FFD700'; // Gold
        const crownY = this.y - 15;
        ctx.fillRect(this.x + 20, crownY, 15, 20);
        ctx.fillRect(this.x + 45, crownY, 15, 20);
        ctx.fillRect(this.x + 70, crownY, 15, 20);
        ctx.fillRect(this.x + 95, crownY, 15, 20);
        ctx.fillRect(this.x + 25, crownY - 8, 70, 8);

        // Eyes - scaled for larger boss
        ctx.fillStyle = '#FF0000'; // Red eyes
        ctx.fillRect(this.x + 30, this.y + 40, 18, 18);
        ctx.fillRect(this.x + 72, this.y + 40, 18, 18);

        // Health bar (above boss) - larger for bigger boss
        const barWidth = this.width;
        const barHeight = 12;
        const barX = this.x;
        const barY = this.y - 25;

        // Background (red)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health (green)
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Render projectiles
        ctx.fillStyle = '#FF4500'; // Orange-red projectiles
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
