// Elite Enemy - stronger version with more HP and damage
import { Enemy } from './Enemy.js';

export class EliteEnemy extends Enemy {
    constructor(x, y) {
        // Call parent constructor - Enemy expects (x, y) but internally calls Entity(x, y, width, height)
        super(x, y);

        // Override size AFTER super() call
        this.width = 56; // Normal: 48
        this.height = 70; // Normal: 60

        // Elite stats
        this.maxHealth = 50; // 50 HP (normal enemy has 15)
        this.health = this.maxHealth;
        this.damage = 10; // 10 damage (normal enemy has 1)

        // Elite visual (golden color)
        this.color = '#FFD700'; // Gold
        this.eliteGlow = 0; // For glow animation

        console.log(`Elite Enemy spawned! HP: 50, Damage: 10, Size: ${this.width}x${this.height}`);
    }

    update(deltaTime) {
        if (!this.isAlive) return;

        // Call parent update (Enemy.update)
        super.update(deltaTime);

        // Animate elite glow
        this.eliteGlow += deltaTime * 3;
    }

    // Override getBounds to ensure correct size
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    // Override takeDamage to add logging
    takeDamage(amount) {
        console.log(`👑 Elite Enemy taking ${amount} damage! HP before: ${this.health}/${this.maxHealth}`);
        super.takeDamage(amount);
        console.log(`👑 Elite Enemy HP after: ${this.health}/${this.maxHealth}, Alive: ${this.isAlive}`);
    }

    // Render elite enemy body (separated for reuse in death animations)
    renderBody(ctx, isFlashing) {
        // Golden glow effect
        const glowIntensity = Math.sin(this.eliteGlow) * 0.3 + 0.7;
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.shadowColor = '#FFD700';

        // Colors for golden elite enemy
        const goldDark = isFlashing ? '#FFF' : '#B8860B';
        const goldMain = isFlashing ? '#FFF' : '#FFD700';
        const goldLight = isFlashing ? '#FFF' : '#FFEC8B';
        const skinColor = isFlashing ? '#FFF' : '#DEB887';

        // === TINY LEGS ===
        ctx.fillStyle = goldDark;
        ctx.fillRect(this.x + 16, this.y + 58, 8, 10);
        ctx.fillRect(this.x + 32, this.y + 58, 8, 10);

        // Golden boots
        ctx.fillStyle = goldMain;
        ctx.fillRect(this.x + 14, this.y + 65, 12, 5);
        ctx.fillRect(this.x + 30, this.y + 65, 12, 5);

        ctx.fillStyle = goldLight;
        ctx.fillRect(this.x + 16, this.y + 66, 4, 2);
        ctx.fillRect(this.x + 32, this.y + 66, 4, 2);

        // === BODY ===
        ctx.fillStyle = goldMain;
        ctx.fillRect(this.x + 14, this.y + 40, 28, 20);

        ctx.fillStyle = goldLight;
        ctx.fillRect(this.x + 20, this.y + 44, 16, 12);

        ctx.fillStyle = goldDark;
        ctx.fillRect(this.x + 24, this.y + 46, 8, 8);

        // Gem
        ctx.fillStyle = isFlashing ? '#FFF' : '#FF0000';
        ctx.fillRect(this.x + 26, this.y + 48, 4, 4);
        ctx.fillStyle = isFlashing ? '#FFF' : '#FF6666';
        ctx.fillRect(this.x + 27, this.y + 49, 1, 1);

        // === LEFT ARM ===
        ctx.fillStyle = goldMain;
        ctx.fillRect(this.x + 6, this.y + 42, 8, 14);

        ctx.fillStyle = goldLight;
        ctx.fillRect(this.x + 4, this.y + 38, 12, 8);

        ctx.fillStyle = goldMain;
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 38);
        ctx.lineTo(this.x + 8, this.y + 32);
        ctx.lineTo(this.x + 12, this.y + 38);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = goldDark;
        ctx.fillRect(this.x + 6, this.y + 54, 7, 6);

        // === RIGHT ARM (with attack animation) ===
        if (this.isAttacking) {
            ctx.save();
            const armPivotX = this.x + 44;
            const armPivotY = this.y + 46;
            const armLength = 16;
            const angleRad = (this.attackSwingAngle - 90) * Math.PI / 180;

            ctx.translate(armPivotX, armPivotY);
            ctx.rotate(angleRad);

            ctx.fillStyle = goldMain;
            ctx.fillRect(-4, 0, 8, armLength);

            // Golden gauntlet fist
            ctx.fillStyle = goldDark;
            ctx.fillRect(-5, armLength - 2, 10, 10);

            // Spikes on gauntlet
            ctx.fillStyle = goldLight;
            ctx.fillRect(-5, armLength + 6, 3, 4);
            ctx.fillRect(-1, armLength + 6, 3, 4);
            ctx.fillRect(3, armLength + 6, 3, 4);

            ctx.restore();
        } else {
            ctx.fillStyle = goldMain;
            ctx.fillRect(this.x + 42, this.y + 42, 8, 14);

            ctx.fillStyle = goldLight;
            ctx.fillRect(this.x + 40, this.y + 38, 12, 8);

            ctx.fillStyle = goldMain;
            ctx.beginPath();
            ctx.moveTo(this.x + 46, this.y + 38);
            ctx.lineTo(this.x + 48, this.y + 32);
            ctx.lineTo(this.x + 44, this.y + 38);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = goldDark;
            ctx.fillRect(this.x + 43, this.y + 54, 7, 6);
        }

        // === HEAD ===
        ctx.fillStyle = skinColor;
        ctx.fillRect(this.x + 10, this.y + 6, 36, 30);
        ctx.fillRect(this.x + 12, this.y + 4, 32, 2);
        ctx.fillRect(this.x + 12, this.y + 36, 32, 2);
        ctx.fillRect(this.x + 8, this.y + 10, 2, 24);
        ctx.fillRect(this.x + 46, this.y + 10, 2, 24);

        // === CROWN ===
        ctx.fillStyle = goldMain;
        ctx.fillRect(this.x + 12, this.y - 2, 32, 8);

        ctx.beginPath();
        ctx.moveTo(this.x + 14, this.y - 2);
        ctx.lineTo(this.x + 18, this.y - 10);
        ctx.lineTo(this.x + 22, this.y - 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 24, this.y - 2);
        ctx.lineTo(this.x + 28, this.y - 12);
        ctx.lineTo(this.x + 32, this.y - 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 34, this.y - 2);
        ctx.lineTo(this.x + 38, this.y - 10);
        ctx.lineTo(this.x + 42, this.y - 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = isFlashing ? '#FFF' : '#FF0000';
        ctx.fillRect(this.x + 16, this.y - 6, 3, 3);
        ctx.fillRect(this.x + 26, this.y - 8, 4, 4);
        ctx.fillRect(this.x + 37, this.y - 6, 3, 3);

        ctx.fillStyle = goldLight;
        ctx.fillRect(this.x + 14, this.y, 8, 2);
        ctx.fillRect(this.x + 34, this.y, 8, 2);

        // === FACE ===
        ctx.fillStyle = goldDark;
        ctx.fillRect(this.x + 14, this.y + 12, 12, 4);
        ctx.fillRect(this.x + 30, this.y + 12, 12, 4);
        ctx.fillRect(this.x + 16, this.y + 10, 6, 2);
        ctx.fillRect(this.x + 34, this.y + 10, 6, 2);

        ctx.fillStyle = isFlashing ? '#FFF' : '#FFD700';
        ctx.fillRect(this.x + 16, this.y + 18, 10, 8);
        ctx.fillRect(this.x + 30, this.y + 18, 10, 8);

        ctx.fillStyle = isFlashing ? '#FFF' : '#000000';
        ctx.fillRect(this.x + 20, this.y + 20, 4, 4);
        ctx.fillRect(this.x + 32, this.y + 20, 4, 4);

        ctx.fillStyle = isFlashing ? '#FFF' : '#FF6600';
        ctx.fillRect(this.x + 16, this.y + 18, 3, 3);
        ctx.fillRect(this.x + 37, this.y + 18, 3, 3);

        ctx.fillStyle = isFlashing ? '#FFF' : '#8B4513';
        ctx.fillRect(this.x + 20, this.y + 30, 16, 4);

        ctx.fillStyle = goldLight;
        ctx.fillRect(this.x + 22, this.y + 30, 3, 2);
        ctx.fillRect(this.x + 31, this.y + 30, 3, 2);

        ctx.shadowBlur = 0;
    }

    // Override render with golden Funko Pop style
    render(ctx) {
        // Death animation
        if (!this.isAlive) {
            ctx.save();

            const deathAlpha = 1 - this.deathAnimationProgress;
            ctx.globalAlpha = deathAlpha * 0.8;

            if (this.deathAnimationType === 'sword') {
                // Crown falls off and enemy splits
                const splitOffset = this.deathAnimationProgress * 25;
                ctx.save();
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width, this.height / 2);
                ctx.clip();
                ctx.translate(0, -splitOffset);
                this.renderBody(ctx, false);
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.rect(this.x, this.y + this.height / 2, this.width, this.height / 2);
                ctx.clip();
                ctx.translate(0, splitOffset);
                this.renderBody(ctx, false);
                ctx.restore();

                // Gold particles
                ctx.fillStyle = '#FFD700';
                for (let i = 0; i < 8; i++) {
                    const px = this.x + this.width / 2 + (Math.random() - 0.5) * 40;
                    const py = this.y + this.height / 2 + (Math.random() - 0.5) * 30;
                    ctx.fillRect(px, py, 5, 5);
                }
            } else if (this.deathAnimationType === 'fist') {
                const flyOffset = this.deathAnimationProgress * 50;
                ctx.translate(flyOffset * this.direction * -1, -this.deathAnimationProgress * 40);
                ctx.rotate(this.deathAnimationProgress * 0.6 * this.direction);
                this.renderBody(ctx, false);

                // Golden impact stars
                if (this.deathAnimationProgress < 0.5) {
                    ctx.fillStyle = '#FFD700';
                    for (let i = 0; i < 6; i++) {
                        const angle = (i / 6) * Math.PI * 2 + Date.now() / 150;
                        const dist = 25 + this.deathAnimationProgress * 40;
                        ctx.fillRect(
                            this.x + this.width / 2 + Math.cos(angle) * dist - 4,
                            this.y + this.height / 2 + Math.sin(angle) * dist - 4,
                            8, 8
                        );
                    }
                }
            } else if (this.deathAnimationType === 'slingshot') {
                const crumbleY = this.deathAnimationProgress * 60;
                ctx.translate(0, crumbleY);
                ctx.scale(1 - this.deathAnimationProgress * 0.3, 1 + this.deathAnimationProgress * 0.2);
                this.renderBody(ctx, false);

                // Gold debris
                ctx.fillStyle = '#FFD700';
                for (let i = 0; i < 8; i++) {
                    const px = this.x + Math.random() * this.width;
                    const py = this.y - this.deathAnimationProgress * 30 - Math.random() * 40;
                    ctx.fillRect(px, py, 4, 4);
                }
            } else {
                ctx.translate(this.x + this.width / 2, this.y + this.height);
                ctx.scale(1 - this.deathAnimationProgress * 0.5, 1 - this.deathAnimationProgress * 0.5);
                ctx.translate(-(this.x + this.width / 2), -(this.y + this.height));
                this.renderBody(ctx, false);
            }

            ctx.restore();
            return;
        }

        // Finisher animation
        if (this.isBeingFinished) {
            ctx.save();

            const flashRate = Math.floor(Date.now() / 50) % 2;
            if (flashRate) ctx.globalAlpha = 0.5;

            const shake = (1 - this.finisherProgress) * 8;
            ctx.translate(
                (Math.random() - 0.5) * shake,
                (Math.random() - 0.5) * shake
            );

            this.renderBody(ctx, true);

            // Golden finisher effects
            if (this.finisherType === 'sword') {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 4;
                for (let i = 0; i < 4; i++) {
                    const offsetY = i * 18 - 27;
                    ctx.beginPath();
                    ctx.moveTo(this.x - 15, this.y + this.height / 2 + offsetY);
                    ctx.lineTo(this.x + this.width + 15, this.y + this.height / 2 + offsetY - 15);
                    ctx.stroke();
                }
            } else if (this.finisherType === 'fist') {
                ctx.fillStyle = '#FFD700';
                ctx.globalAlpha = 0.7;
                for (let i = 0; i < 10; i++) {
                    const angle = (i / 10) * Math.PI * 2;
                    const dist = 30 + this.finisherProgress * 40;
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
                    ctx.lineTo(
                        this.x + this.width / 2 + Math.cos(angle) * dist,
                        this.y + this.height / 2 + Math.sin(angle) * dist
                    );
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 5;
                    ctx.stroke();
                }
            } else if (this.finisherType === 'slingshot') {
                ctx.fillStyle = '#696969';
                for (let i = 0; i < 7; i++) {
                    const px = this.x + this.width / 2 + (Math.random() - 0.5) * 50;
                    const py = this.y + this.height / 2 + (Math.random() - 0.5) * 50;
                    ctx.beginPath();
                    ctx.arc(px, py, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.restore();
            return;
        }

        ctx.save();

        // Flip horizontally based on direction
        if (this.direction < 0) {
            ctx.translate(this.x + this.width / 2, this.y);
            ctx.scale(-1, 1);
            ctx.translate(-(this.x + this.width / 2), -this.y);
        }

        // Flash white when hit
        const isFlashing = this.hitFlashTimer > 0;

        // Render body
        this.renderBody(ctx, isFlashing);

        ctx.restore();

        // Render attack trail effect
        if (this.attackTrailPoints.length > 1) {
            ctx.save();
            for (let i = 1; i < this.attackTrailPoints.length; i++) {
                const prev = this.attackTrailPoints[i - 1];
                const curr = this.attackTrailPoints[i];
                ctx.strokeStyle = `rgba(255, 215, 0, ${curr.alpha})`;
                ctx.lineWidth = 5 * curr.alpha;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(curr.x, curr.y);
                ctx.stroke();
            }
            ctx.restore();
        }

        // Attack impact effect
        if (this.isAttacking && this.attackAnimationProgress >= 0.4 && this.attackAnimationProgress <= 0.6) {
            ctx.save();
            ctx.globalAlpha = 0.6 * (1 - Math.abs(this.attackAnimationProgress - 0.5) * 4);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 4;
            const impactX = this.x + (this.direction > 0 ? this.width + 15 : -15);
            const impactY = this.y + this.height / 2;
            // Golden slash marks
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(impactX - 12 * this.direction, impactY + i * 10 - 6);
                ctx.lineTo(impactX + 12 * this.direction, impactY + i * 10 + 6);
                ctx.stroke();
            }
            ctx.restore();
        }

        // Health bar above enemy
        const barWidth = 50;
        const barHeight = 6;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 22;

        // Background (dark gold)
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health (golden gradient)
        const healthPercent = this.health / this.maxHealth;
        const healthWidth = healthPercent * barWidth;
        if (healthPercent > 0.5) {
            ctx.fillStyle = '#FFD700';
        } else if (healthPercent > 0.25) {
            ctx.fillStyle = '#FFA500';
        } else {
            ctx.fillStyle = '#FF4500';
        }
        ctx.fillRect(barX, barY, healthWidth, barHeight);

        // Golden border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // ELITE tag above health bar
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText('👑 ELITE', this.x + this.width / 2, this.y - 28);
        ctx.fillText('👑 ELITE', this.x + this.width / 2, this.y - 28);
    }
}
