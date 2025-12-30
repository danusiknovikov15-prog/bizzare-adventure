// AcidBoss - Boss with acid damage over time ability
import { Boss } from '../Boss.js';

export class AcidBoss extends Boss {
    constructor(x, y) {
        super(x, y, 'acid');

        // Boss stats for Level 3
        this.maxHealth = 80;
        this.health = 80;
        this.damage = 8;

        // Visual customization
        this.color = '#00FF00'; // Green for acid
        this.projectileColor = '#32CD32'; // Lime green for acid projectiles

        console.log(`🧪 AcidBoss CONSTRUCTOR: pos=(${x}, ${y}), HP=${this.health}/${this.maxHealth}, isAlive=${this.isAlive}, isStatic=${this.isStatic}`);
        console.log(`   Size: ${this.width}x${this.height}, attackRange=${this.attackRange}, attackCooldown=${this.attackCooldown}`);
    }

    initializeAbilities() {
        // Acid boss shoots projectiles that apply DoT (damage over time)
        this.abilityTimers.acidShot = 0;
    }

    updateAbilities(deltaTime, player, game) {
        // Acid boss uses modified projectiles (handled in shootAtPlayer override)
        // The actual DoT is applied by CombatSystem when projectile hits
    }

    // Override shootAtPlayer to create acid projectiles
    shootAtPlayer(playerX, playerY) {
        if (this.attackTimer > 0 || !this.isAlive) {
            return;
        }

        const dx = playerX - (this.x + this.width / 2);
        const dy = playerY - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        console.log(`AcidBoss checking range: distance=${distance.toFixed(1)}, attackRange=${this.attackRange}`);

        // Only shoot if player is within range
        if (distance <= this.attackRange) {
            const speed = 200; // Projectile speed
            const velocityX = (dx / distance) * speed;
            const velocityY = (dy / distance) * speed;

            // Create acid projectile with special type
            this.projectiles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                velocityX: velocityX,
                velocityY: velocityY,
                lifetime: 3.0, // 3 seconds
                radius: 8,
                damage: this.damage,
                type: 'acid' // Special type for CombatSystem to detect
            });

            this.attackTimer = this.attackCooldown;
            console.log('AcidBoss shoots acid projectile!');
        }
    }

    renderAbilities(ctx) {
        // Render acid projectiles with green color
        ctx.fillStyle = this.projectileColor;
        for (const proj of this.projectiles) {
            if (proj.type === 'acid') {
                // Draw acid projectile with glow effect
                ctx.save();

                // Outer glow
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, proj.radius + 4, 0, Math.PI * 2);
                ctx.fill();

                // Inner projectile
                ctx.globalAlpha = 1.0;
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

        // Eyes - red for boss
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x + 30, this.y + 40, 18, 18);
        ctx.fillRect(this.x + 72, this.y + 40, 18, 18);

        // Acid drip effect (visual indicator)
        ctx.fillStyle = '#00FF00';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(this.x + 40, this.y + this.height - 10, 8, 15);
        ctx.fillRect(this.x + 72, this.y + this.height - 10, 8, 15);
        ctx.globalAlpha = 1.0;

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

        // Render acid projectiles (with special rendering)
        this.renderAbilities(ctx);

        ctx.restore();
    }
}
