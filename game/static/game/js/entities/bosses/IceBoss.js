// IceBoss - Boss with slow and freeze abilities
import { Boss } from '../Boss.js';

export class IceBoss extends Boss {
    constructor(x, y) {
        super(x, y, 'ice');

        // Boss stats for Level 9 (Boss #3)
        this.maxHealth = 160;
        this.health = 160;
        this.damage = 14;

        // Visual customization
        this.color = '#87CEEB'; // Sky blue for ice
        this.projectileColor = '#00CED1'; // Dark turquoise for ice projectiles
    }

    initializeAbilities() {
        // Ice boss shoots projectiles that slow and freeze
        this.abilityTimers.iceShot = 0;
    }

    updateAbilities(deltaTime, player, game) {
        // Ice boss uses modified projectiles (handled in shootAtPlayer override)
        // The slow/freeze is applied by CombatSystem when projectile hits
    }

    // Override shootAtPlayer to create ice projectiles
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

            // Create ice projectile with special type
            this.projectiles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                velocityX: velocityX,
                velocityY: velocityY,
                lifetime: 3.0, // 3 seconds
                radius: 8,
                damage: this.damage,
                type: 'ice' // Special type for CombatSystem to detect
            });

            this.attackTimer = this.attackCooldown;
            console.log('IceBoss shoots ice projectile!');
        }
    }

    renderAbilities(ctx) {
        // Render ice projectiles with blue color and crystals
        for (const proj of this.projectiles) {
            if (proj.type === 'ice') {
                ctx.save();

                // Outer frost glow
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#B0E0E6'; // Powder blue
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, proj.radius + 6, 0, Math.PI * 2);
                ctx.fill();

                // Inner ice
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = this.projectileColor;
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
                ctx.fill();

                // Ice crystals (star shape)
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.8;
                for (let i = 0; i < 4; i++) {
                    const angle = (i * Math.PI / 2) + Date.now() / 500;
                    const x1 = proj.x + Math.cos(angle) * (proj.radius - 2);
                    const y1 = proj.y + Math.sin(angle) * (proj.radius - 2);
                    const x2 = proj.x + Math.cos(angle) * (proj.radius + 4);
                    const y2 = proj.y + Math.sin(angle) * (proj.radius + 4);
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }

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

        // Boss body
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Ice crystal crown
        ctx.fillStyle = '#E0FFFF'; // Light cyan
        const crownY = this.y - 15;
        for (let i = 0; i < 5; i++) {
            const crownX = this.x + 15 + i * 22;
            const crystalHeight = 20 + (i % 2) * 5;
            // Draw crystal (triangle)
            ctx.beginPath();
            ctx.moveTo(crownX + 6, crownY);
            ctx.lineTo(crownX, crownY + crystalHeight);
            ctx.lineTo(crownX + 12, crownY + crystalHeight);
            ctx.closePath();
            ctx.fill();
        }

        // Eyes - icy blue
        ctx.fillStyle = '#00CED1';
        ctx.fillRect(this.x + 30, this.y + 40, 18, 18);
        ctx.fillRect(this.x + 72, this.y + 40, 18, 18);

        // Frost effect (visual indicator)
        ctx.fillStyle = '#B0E0E6';
        ctx.globalAlpha = 0.5;
        // Icicles hanging from bottom
        for (let i = 0; i < 6; i++) {
            const icicleX = this.x + 15 + i * 18;
            ctx.beginPath();
            ctx.moveTo(icicleX, this.y + this.height);
            ctx.lineTo(icicleX + 5, this.y + this.height);
            ctx.lineTo(icicleX + 2.5, this.y + this.height + 8);
            ctx.closePath();
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

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

        // Render ice abilities
        this.renderAbilities(ctx);

        ctx.restore();
    }
}
