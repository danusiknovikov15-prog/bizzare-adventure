// ZombieArcher - Zombie that shoots arrows at the player
import { Enemy } from './Enemy.js';

export class ZombieArcher extends Enemy {
    constructor(x, y) {
        super(x, y);

        // Zombie archer stats
        this.maxHealth = 20;
        this.health = 20;
        this.damage = 8; // Melee damage if player gets close
        this.moveSpeed = 60; // Slower than normal enemies

        // Visual customization
        this.color = '#2F4F2F'; // Dark green for zombie

        // Archer properties
        this.arrows = [];
        this.arrowDamage = 12;
        this.arrowSpeed = 300;
        this.shootRange = 400; // Range to detect and shoot at player
        this.shootCooldown = 2.5; // Seconds between shots
        this.shootTimer = 0;
        this.hasArmor = false; // Zombies don't have armor
    }

    update(deltaTime) {
        // Update shoot timer
        if (this.shootTimer > 0) {
            this.shootTimer -= deltaTime;
        }

        // Update arrows
        this.arrows = this.arrows.filter(arrow => {
            arrow.x += arrow.vx * deltaTime;
            arrow.y += arrow.vy * deltaTime;
            arrow.lifetime -= deltaTime;
            arrow.rotation += deltaTime * 5; // Rotate arrow in flight

            return arrow.lifetime > 0;
        });

        // Call parent update (this handles physics and AI)
        super.update(deltaTime);
    }

    updateAI(deltaTime) {
        if (!this.player || !this.player.isAlive) {
            this.patrol(deltaTime);
            return;
        }

        // Calculate distance to player
        const dx = this.player.x + this.player.width / 2 - (this.x + this.width / 2);
        const dy = this.player.y + this.player.height / 2 - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If player is in range, try to shoot
        if (distance <= this.shootRange && this.shootTimer <= 0) {
            this.shootArrow(this.player);
            this.shootTimer = this.shootCooldown;
        }

        // Keep distance from player (archer AI - stay back)
        if (distance < 200) {
            // Move away from player
            const targetDirection = dx > 0 ? -1 : 1;

            if (!this.checkPlatformEdge(this.platforms)) {
                this.direction = targetDirection;
                this.vx = this.moveSpeed * this.direction;
            } else {
                this.vx = 0; // Stop at edge
            }
        } else if (distance > this.shootRange) {
            // Get closer to player
            const targetDirection = dx > 0 ? 1 : -1;

            if (!this.checkPlatformEdge(this.platforms)) {
                this.direction = targetDirection;
                this.vx = this.moveSpeed * this.direction;
            } else {
                this.direction *= -1;
                this.vx = this.moveSpeed * this.direction;
            }
        } else {
            // In optimal range, stop moving
            this.vx = 0;
        }
    }

    shootArrow(player) {
        if (!player || !player.isAlive) return;

        // Calculate direction to player
        const startX = this.x + this.width / 2;
        const startY = this.y + this.height / 2;
        const targetX = player.x + player.width / 2;
        const targetY = player.y + player.height / 2;

        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Create arrow projectile
        const arrow = {
            x: startX,
            y: startY,
            vx: (dx / distance) * this.arrowSpeed,
            vy: (dy / distance) * this.arrowSpeed,
            lifetime: 3.0, // Arrow lasts 3 seconds
            damage: this.arrowDamage,
            rotation: Math.atan2(dy, dx), // Initial rotation based on direction
            length: 20,
            width: 4
        };

        this.arrows.push(arrow);
        console.log('🏹 Zombie Archer shot an arrow!');
    }

    render(ctx) {
        if (!this.isAlive) {
            // Render dead zombie
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#333';
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

        // Zombie body (darker, decayed look)
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Zombie head (greenish)
        const headColor = '#556B2F';
        ctx.fillStyle = this.hitFlashTimer > 0 ? '#FFF' : headColor;
        ctx.fillRect(this.x + 6, this.y + 6, 36, 21);

        // Zombie eyes (glowing red/orange)
        ctx.fillStyle = '#FF6347';
        const eyeY = this.y + 12;
        ctx.fillRect(this.x + 12, eyeY, 8, 8);
        ctx.fillRect(this.x + 28, eyeY, 8, 8);

        // Bow (held in hand)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const bowX = this.direction > 0 ? this.x + this.width : this.x;
        ctx.arc(bowX, this.y + 35, 10, Math.PI * 0.3, Math.PI * 1.7);
        ctx.stroke();

        // Bowstring
        ctx.strokeStyle = '#D3D3D3';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bowX + (this.direction > 0 ? 7 : -7), this.y + 27);
        ctx.lineTo(bowX + (this.direction > 0 ? 7 : -7), this.y + 43);
        ctx.stroke();

        // Health bar
        const barWidth = 45;
        const barHeight = 5;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 12;

        ctx.fillStyle = '#8B0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(barX, barY, healthWidth, barHeight);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        ctx.restore();

        // Render arrows
        this.renderArrows(ctx);
    }

    renderArrows(ctx) {
        for (const arrow of this.arrows) {
            ctx.save();

            ctx.translate(arrow.x, arrow.y);
            ctx.rotate(arrow.rotation);

            // Arrow shaft
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-arrow.length / 2, -arrow.width / 2, arrow.length, arrow.width);

            // Arrow tip
            ctx.fillStyle = '#C0C0C0';
            ctx.beginPath();
            ctx.moveTo(arrow.length / 2, 0);
            ctx.lineTo(arrow.length / 2 - 8, -4);
            ctx.lineTo(arrow.length / 2 - 8, 4);
            ctx.closePath();
            ctx.fill();

            // Arrow fletching (feathers)
            ctx.fillStyle = '#FF6347';
            ctx.beginPath();
            ctx.moveTo(-arrow.length / 2, 0);
            ctx.lineTo(-arrow.length / 2 - 6, -4);
            ctx.lineTo(-arrow.length / 2 - 2, 0);
            ctx.lineTo(-arrow.length / 2 - 6, 4);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    // Override getBounds to make sure we're properly detected
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
