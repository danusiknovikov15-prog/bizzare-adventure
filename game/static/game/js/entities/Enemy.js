// Enemy entity with health system and AI
import { Entity } from './Entity.js';

export class Enemy extends Entity {
    constructor(x, y) {
        super(x, y, 48, 60); // 48x60 pixels (bigger hitbox)

        // Health system
        this.maxHealth = 15;
        this.health = this.maxHealth;
        this.isAlive = true;

        // AI properties
        this.moveSpeed = 80; // slower than player
        this.patrolDistance = 150;
        this.startX = x;
        this.direction = Math.random() < 0.5 ? 1 : -1; // Random direction: 1 = right, -1 = left

        // Combat properties
        this.damage = 1; // damage to player
        this.attackCooldown = 1.5; // seconds between attacks
        this.attackTimer = 0;
        this.isAttacking = false;

        // Armor system (20% chance)
        this.hasArmor = Math.random() < 0.2; // 20% chance

        // Visual
        this.color = this.hasArmor ? '#4169E1' : '#8B0000'; // Blue if armored, dark red otherwise
        this.hitFlashTimer = 0; // For hit feedback

        // AI references (set by game loop)
        this.player = null;
        this.platforms = null;
    }

    update(deltaTime) {
        if (!this.isAlive) {
            // Death animation could go here
            return;
        }

        // Update timers
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }
        if (this.hitFlashTimer > 0) {
            this.hitFlashTimer -= deltaTime;
        }

        // AI behavior (can be overridden by subclasses)
        this.updateAI(deltaTime);

        // Call parent update (applies velocity)
        super.update(deltaTime);
    }

    // AI method that can be overridden
    updateAI(deltaTime) {
        // If we have player and platform info, chase player
        if (this.player && this.platforms) {
            this.chasePlayer(this.player, this.platforms, deltaTime);
        } else {
            // Fallback to simple patrol
            this.patrol(deltaTime);
        }
    }

    patrol(deltaTime) {
        // Move back and forth
        this.vx = this.moveSpeed * this.direction;

        // Check if reached patrol boundary
        const distanceFromStart = Math.abs(this.x - this.startX);
        if (distanceFromStart >= this.patrolDistance) {
            this.direction *= -1; // Reverse direction
        }
    }

    // Check for platform edge in front of enemy
    checkPlatformEdge(platforms) {
        if (!platforms) return false;

        // Check point slightly ahead of enemy's feet
        const checkDistance = 10;
        const checkX = this.direction > 0
            ? this.x + this.width + checkDistance
            : this.x - checkDistance;
        const feetY = this.y + this.height + 5;

        // Check if there's a platform below that point
        for (const platform of platforms) {
            const platformBounds = platform.getBounds();
            if (checkX >= platformBounds.left &&
                checkX <= platformBounds.right &&
                feetY >= platformBounds.top &&
                feetY <= platformBounds.bottom + 20) {
                return false; // Platform found, safe to move
            }
        }

        return true; // No platform = edge detected!
    }

    // Chase player AI
    chasePlayer(player, platforms, deltaTime) {
        if (!player || !player.isAlive) {
            this.patrol(deltaTime);
            return;
        }

        // Calculate direction to player
        const dx = player.x - this.x;
        const targetDirection = dx > 0 ? 1 : -1;

        // Check for platform edge before moving
        if (this.checkPlatformEdge(platforms)) {
            // Edge detected! Turn around
            this.direction *= -1;
        } else {
            // Safe to move towards player
            this.direction = targetDirection;
        }

        // Move in current direction
        this.vx = this.moveSpeed * this.direction;
    }

    takeDamage(amount) {
        if (!this.isAlive) return;

        this.health -= amount;
        this.hitFlashTimer = 0.2; // Flash white for 0.2 seconds

        console.log(`Enemy took ${amount} damage! Health: ${this.health}/${this.maxHealth}`);

        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    die() {
        this.isAlive = false;
        console.log(this.hasArmor ? 'Armored enemy died!' : 'Enemy died!');
    }

    // Check if enemy can attack
    canAttack() {
        return this.isAlive && this.attackTimer <= 0;
    }

    // Perform attack
    attack() {
        if (!this.canAttack()) return false;

        this.attackTimer = this.attackCooldown;
        this.isAttacking = true;

        // Reset attack flag after short delay
        setTimeout(() => {
            this.isAttacking = false;
        }, 300);

        return true;
    }

    // Get attack hitbox
    getAttackHitbox() {
        return {
            x: this.x - 10,
            y: this.y,
            width: this.width + 20,
            height: this.height
        };
    }

    render(ctx) {
        if (!this.isAlive) {
            // Render dead enemy (faded)
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#666';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
            return;
        }

        ctx.save();

        // Flash white when hit
        if (this.hitFlashTimer > 0) {
            ctx.fillStyle = '#FFF';
        } else {
            ctx.fillStyle = this.color;
        }

        // Body
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Head (proportionally bigger)
        const headColor = this.hasArmor ? '#5F9EA0' : '#A52A2A';
        ctx.fillStyle = this.hitFlashTimer > 0 ? '#FFF' : headColor;
        ctx.fillRect(this.x + 6, this.y + 6, 36, 21);

        // Eyes (angry, bigger)
        ctx.fillStyle = '#FF0000';
        const eyeY = this.y + 12;
        ctx.fillRect(this.x + 12, eyeY, 9, 9);
        ctx.fillRect(this.x + 27, eyeY, 9, 9);

        // Armor visual overlay (if has armor)
        if (this.hasArmor) {
            // Armor chest plate
            ctx.fillStyle = this.hitFlashTimer > 0 ? '#FFF' : '#C0C0C0';
            ctx.fillRect(this.x + 12, this.y + 30, 24, 20);

            // Armor shoulder guards
            ctx.fillRect(this.x + 6, this.y + 28, 10, 12);
            ctx.fillRect(this.x + 32, this.y + 28, 10, 12);

            // Armor shine/highlight
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x + 18, this.y + 34, 4, 4);
        }

        // Health bar above enemy (wider for bigger enemy)
        const barWidth = 45;
        const barHeight = 5;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 12;

        // Background (red)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health (green)
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(barX, barY, healthWidth, barHeight);

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        ctx.restore();

        // Debug: show patrol range
        if (false) { // Set to true to see patrol area
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.strokeRect(this.startX - this.patrolDistance, this.y, this.patrolDistance * 2, this.height);
        }
    }
}
