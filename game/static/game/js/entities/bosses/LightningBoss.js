// LightningBoss - Boss with fast, rapid-fire attacks
import { Boss } from '../Boss.js';

export class LightningBoss extends Boss {
    constructor(x, y) {
        super(x, y, 'lightning');

        // Boss stats for Level 12 (Boss #4)
        this.maxHealth = 200;
        this.health = 200;
        this.damage = 17;

        // Visual customization
        this.color = '#FFD700'; // Gold for lightning
        this.projectileColor = '#FFFF00'; // Yellow for lightning bolts

        // Lightning ability - rapid fire
        this.attackCooldown = 1.5; // Faster than normal (normal: 2.0)
        this.burstSize = 3; // Shoots 3 projectiles in rapid succession
        this.burstDelay = 0.3; // 0.3 seconds between each shot in burst
        this.projectileSpeedMultiplier = 2.0; // 2x faster projectiles
    }

    initializeAbilities() {
        // Lightning boss shoots rapid bursts
        this.burstCounter = 0;
        this.burstTimer = 0;
        this.inBurst = false;
    }

    updateAbilities(deltaTime, player, game) {
        // Handle burst firing
        if (this.inBurst) {
            this.burstTimer -= deltaTime;
            if (this.burstTimer <= 0 && this.burstCounter < this.burstSize) {
                // Fire next shot in burst
                if (player) {
                    this.shootAtPlayer(player.x + player.width / 2, player.y + player.height / 2, true);
                }
                this.burstCounter++;
                this.burstTimer = this.burstDelay;

                if (this.burstCounter >= this.burstSize) {
                    this.inBurst = false;
                }
            }
        }
    }

    // Override shootAtPlayer to create lightning projectiles with burst
    shootAtPlayer(playerX, playerY, isBurstShot = false) {
        // If not a burst shot, start a new burst
        if (!isBurstShot) {
            if (this.attackTimer > 0 || !this.isAlive || this.inBurst) return;

            this.inBurst = true;
            this.burstCounter = 0;
            this.burstTimer = 0;
            this.attackTimer = this.attackCooldown;
            return;
        }

        // Fire a single shot (part of burst)
        const dx = playerX - (this.x + this.width / 2);
        const dy = playerY - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.attackRange) {
            const speed = 200 * this.projectileSpeedMultiplier; // 2x faster
            const velocityX = (dx / distance) * speed;
            const velocityY = (dy / distance) * speed;

            this.projectiles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                velocityX: velocityX,
                velocityY: velocityY,
                lifetime: 3.0,
                radius: 6, // Slightly smaller
                damage: this.damage,
                type: 'lightning'
            });

            console.log(`⚡ LightningBoss fires lightning bolt ${this.burstCounter + 1}/${this.burstSize}!`);
        }
    }

    renderAbilities(ctx) {
        // Render lightning projectiles with electric effect
        for (const proj of this.projectiles) {
            if (proj.type === 'lightning') {
                ctx.save();

                // Electric glow
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = '#FFFF00';
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, proj.radius + 8, 0, Math.PI * 2);
                ctx.fill();

                // Inner lightning bolt
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = this.projectileColor;
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
                ctx.fill();

                // Lightning sparks
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                for (let i = 0; i < 4; i++) {
                    const angle = (i * Math.PI / 2) + Date.now() / 100;
                    const sparkLength = 8 + Math.random() * 4;
                    const x1 = proj.x + Math.cos(angle) * proj.radius;
                    const y1 = proj.y + Math.sin(angle) * proj.radius;
                    const x2 = proj.x + Math.cos(angle) * (proj.radius + sparkLength);
                    const y2 = proj.y + Math.sin(angle) * (proj.radius + sparkLength);
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

        // Boss body with electric pulsing
        const pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
        ctx.globalAlpha = pulse;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;

        // Lightning bolt crown
        ctx.fillStyle = '#FFFF00';
        const crownY = this.y - 15;
        for (let i = 0; i < 3; i++) {
            const crownX = this.x + 30 + i * 30;
            // Zigzag lightning bolt
            ctx.beginPath();
            ctx.moveTo(crownX, crownY - 10);
            ctx.lineTo(crownX + 5, crownY - 5);
            ctx.lineTo(crownX + 2, crownY);
            ctx.lineTo(crownX + 7, crownY + 5);
            ctx.lineTo(crownX + 4, crownY + 10);
            ctx.lineTo(crownX + 9, crownY + 15);
            ctx.lineTo(crownX - 2, crownY + 8);
            ctx.lineTo(crownX + 1, crownY + 3);
            ctx.lineTo(crownX - 3, crownY - 2);
            ctx.closePath();
            ctx.fill();
        }

        // Eyes - electric blue
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(this.x + 30, this.y + 40, 18, 18);
        ctx.fillRect(this.x + 72, this.y + 40, 18, 18);

        // Electric aura
        if (this.inBurst) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.6;
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
            ctx.globalAlpha = 1.0;
        }

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

        // Render lightning abilities
        this.renderAbilities(ctx);

        ctx.restore();
    }
}
