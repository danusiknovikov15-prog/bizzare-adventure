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

        // Attack animation properties
        this.attackAnimationProgress = 0; // 0 to 1
        this.attackSwingAngle = 0; // Current angle of arm swing
        this.attackTrailPoints = []; // Trail effect for attack

        // Finisher/death animation
        this.isBeingFinished = false; // Being executed
        this.finisherProgress = 0; // 0 to 1 progress through finisher
        this.finisherType = null; // 'sword', 'fist', 'slingshot'
        this.deathAnimationProgress = 0; // 0 to 1 for death animation
        this.deathAnimationType = null; // Type of death animation

        // AI references (set by game loop)
        this.player = null;
        this.platforms = null;
    }

    update(deltaTime) {
        // Death animation update
        if (!this.isAlive) {
            if (this.deathAnimationProgress < 1) {
                this.deathAnimationProgress += deltaTime * 2; // 0.5 second death animation
                if (this.deathAnimationProgress > 1) this.deathAnimationProgress = 1;
            }
            return;
        }

        // Being finished - can't do anything
        if (this.isBeingFinished) {
            this.finisherProgress += deltaTime * 2; // 0.5 second finisher
            if (this.finisherProgress >= 1) {
                this.finisherProgress = 1;
                this.die();
            }
            return;
        }

        // Update timers
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }
        if (this.hitFlashTimer > 0) {
            this.hitFlashTimer -= deltaTime;
        }

        // Update attack animation
        if (this.isAttacking) {
            this.attackAnimationProgress += deltaTime * 4; // 0.25 second attack animation

            // Calculate swing angle based on progress
            if (this.attackAnimationProgress < 0.3) {
                // Wind-up phase: arm goes back
                this.attackSwingAngle = -60 * (this.attackAnimationProgress / 0.3);
            } else if (this.attackAnimationProgress < 0.6) {
                // Swing phase: fast forward swing
                const swingProgress = (this.attackAnimationProgress - 0.3) / 0.3;
                this.attackSwingAngle = -60 + (150 * swingProgress); // -60 to +90
            } else {
                // Follow-through phase
                const followProgress = (this.attackAnimationProgress - 0.6) / 0.4;
                this.attackSwingAngle = 90 - (90 * followProgress); // 90 to 0
            }

            // Add trail point during swing phase
            if (this.attackAnimationProgress >= 0.3 && this.attackAnimationProgress <= 0.6) {
                const armX = this.x + (this.direction > 0 ? this.width - 5 : 5);
                const armY = this.y + 42;
                const armLength = 15;
                const angleRad = (this.attackSwingAngle - 90) * Math.PI / 180;
                const tipX = armX + Math.cos(angleRad) * armLength * this.direction;
                const tipY = armY + Math.sin(angleRad) * armLength;

                this.attackTrailPoints.push({
                    x: tipX,
                    y: tipY,
                    alpha: 1.0
                });
            }

            if (this.attackAnimationProgress >= 1) {
                this.attackAnimationProgress = 0;
                this.attackSwingAngle = 0;
            }
        }

        // Fade out trail points
        this.attackTrailPoints = this.attackTrailPoints.filter(point => {
            point.alpha -= deltaTime * 5;
            return point.alpha > 0;
        });

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
        this.attackAnimationProgress = 0; // Start attack animation
        this.attackTrailPoints = []; // Clear trail

        // Reset attack flag after animation completes
        setTimeout(() => {
            this.isAttacking = false;
        }, 300);

        return true;
    }

    // Check if enemy can be finished (low health)
    canBeFinished() {
        const healthPercent = this.health / this.maxHealth;
        return this.isAlive && !this.isBeingFinished && healthPercent <= 0.25; // Below 25% HP
    }

    // Start finisher animation
    startFinisher(finisherType) {
        if (!this.canBeFinished()) return false;

        this.isBeingFinished = true;
        this.finisherProgress = 0;
        this.finisherType = finisherType;
        this.deathAnimationType = finisherType;
        this.vx = 0; // Stop moving

        console.log(`💀 FINISHER started on enemy! Type: ${finisherType}`);
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

    // Render enemy body (separated for reuse in death animations)
    renderBody(ctx, isFlashing) {
        // Colors for red enemy
        const skinColor = isFlashing ? '#FFF' : '#D2691E';
        const clothColor = isFlashing ? '#FFF' : '#4A0000';

        // === TINY LEGS ===
        ctx.fillStyle = clothColor;
        ctx.fillRect(this.x + 14, this.y + 50, 6, 8);
        ctx.fillRect(this.x + 28, this.y + 50, 6, 8);

        // Shoes
        ctx.fillStyle = isFlashing ? '#FFF' : '#1a1a1a';
        ctx.fillRect(this.x + 13, this.y + 56, 8, 4);
        ctx.fillRect(this.x + 27, this.y + 56, 8, 4);

        // === SMALL BODY ===
        ctx.fillStyle = clothColor;
        ctx.fillRect(this.x + 12, this.y + 34, 24, 18);

        // Body details
        ctx.fillStyle = isFlashing ? '#FFF' : '#3A0000';
        ctx.fillRect(this.x + 20, this.y + 36, 8, 14);

        // === LEFT ARM (non-attacking) ===
        ctx.fillStyle = clothColor;
        ctx.fillRect(this.x + 6, this.y + 36, 6, 10);
        ctx.fillStyle = skinColor;
        ctx.fillRect(this.x + 6, this.y + 44, 5, 5);

        // === RIGHT ARM (attacking arm with animation) ===
        if (this.isAttacking) {
            ctx.save();
            const armPivotX = this.x + 38;
            const armPivotY = this.y + 40;
            const armLength = 12;
            const angleRad = (this.attackSwingAngle - 90) * Math.PI / 180;

            ctx.translate(armPivotX, armPivotY);
            ctx.rotate(angleRad);

            // Arm
            ctx.fillStyle = clothColor;
            ctx.fillRect(-3, 0, 6, armLength);

            // Fist with claws
            ctx.fillStyle = skinColor;
            ctx.fillRect(-4, armLength - 2, 8, 8);

            // Claws
            ctx.fillStyle = isFlashing ? '#FFF' : '#2a0000';
            ctx.fillRect(-4, armLength + 5, 2, 4);
            ctx.fillRect(-1, armLength + 5, 2, 4);
            ctx.fillRect(2, armLength + 5, 2, 4);

            ctx.restore();
        } else {
            // Normal right arm position
            ctx.fillStyle = clothColor;
            ctx.fillRect(this.x + 36, this.y + 36, 6, 10);
            ctx.fillStyle = skinColor;
            ctx.fillRect(this.x + 37, this.y + 44, 5, 5);
        }

        // === MASSIVE HEAD ===
        ctx.fillStyle = skinColor;
        ctx.fillRect(this.x + 8, this.y + 6, 32, 26);
        ctx.fillRect(this.x + 10, this.y + 4, 28, 2);
        ctx.fillRect(this.x + 10, this.y + 32, 28, 2);
        ctx.fillRect(this.x + 6, this.y + 10, 2, 20);
        ctx.fillRect(this.x + 40, this.y + 10, 2, 20);

        // === ANGRY FACE ===
        ctx.fillStyle = isFlashing ? '#FFF' : '#2a0000';
        ctx.fillRect(this.x + 12, this.y + 12, 10, 3);
        ctx.fillRect(this.x + 26, this.y + 12, 10, 3);
        ctx.fillRect(this.x + 14, this.y + 10, 4, 2);
        ctx.fillRect(this.x + 30, this.y + 10, 4, 2);

        // Eyes
        ctx.fillStyle = isFlashing ? '#FFF' : '#FF0000';
        ctx.fillRect(this.x + 14, this.y + 16, 8, 6);
        ctx.fillRect(this.x + 26, this.y + 16, 8, 6);

        // Pupils
        ctx.fillStyle = isFlashing ? '#FFF' : '#000000';
        ctx.fillRect(this.x + 18, this.y + 18, 3, 3);
        ctx.fillRect(this.x + 28, this.y + 18, 3, 3);

        // Eye glow
        ctx.fillStyle = isFlashing ? '#FFF' : '#FF6600';
        ctx.fillRect(this.x + 14, this.y + 16, 2, 2);
        ctx.fillRect(this.x + 32, this.y + 16, 2, 2);

        // Mouth
        ctx.fillStyle = isFlashing ? '#FFF' : '#1a0000';
        ctx.fillRect(this.x + 16, this.y + 26, 16, 4);

        // Teeth
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + 17, this.y + 26, 3, 2);
        ctx.fillRect(this.x + 22, this.y + 26, 3, 2);
        ctx.fillRect(this.x + 27, this.y + 26, 3, 2);

        // === HORNS ===
        ctx.fillStyle = isFlashing ? '#FFF' : '#4A0000';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 8);
        ctx.lineTo(this.x + 6, this.y - 4);
        ctx.lineTo(this.x + 16, this.y + 6);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 38, this.y + 8);
        ctx.lineTo(this.x + 42, this.y - 4);
        ctx.lineTo(this.x + 32, this.y + 6);
        ctx.closePath();
        ctx.fill();

        // Horn highlights
        ctx.fillStyle = isFlashing ? '#FFF' : '#6A0000';
        ctx.fillRect(this.x + 8, this.y + 2, 2, 4);
        ctx.fillRect(this.x + 38, this.y + 2, 2, 4);

        // Armor overlay
        if (this.hasArmor) {
            ctx.fillStyle = isFlashing ? '#FFF' : '#4169E1';
            ctx.fillRect(this.x + 12, this.y + 34, 24, 18);
            ctx.fillRect(this.x + 6, this.y + 34, 8, 8);
            ctx.fillRect(this.x + 34, this.y + 34, 8, 8);
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(this.x + 16, this.y + 38, 4, 4);
        }
    }

    render(ctx) {
        // Death animation
        if (!this.isAlive) {
            ctx.save();

            // Fade out and fall down
            const deathAlpha = 1 - this.deathAnimationProgress;
            ctx.globalAlpha = deathAlpha * 0.8;

            // Different death effects based on type
            if (this.deathAnimationType === 'sword') {
                // Slash effect - enemy splits
                const splitOffset = this.deathAnimationProgress * 20;
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

                // Blood splatter
                ctx.fillStyle = '#8B0000';
                for (let i = 0; i < 5; i++) {
                    const px = this.x + this.width / 2 + (Math.random() - 0.5) * 30;
                    const py = this.y + this.height / 2 + (Math.random() - 0.5) * 20;
                    ctx.fillRect(px, py, 4, 4);
                }
            } else if (this.deathAnimationType === 'fist') {
                // Punch effect - enemy flies back
                const flyOffset = this.deathAnimationProgress * 40;
                ctx.translate(flyOffset * this.direction * -1, -this.deathAnimationProgress * 30);
                ctx.rotate(this.deathAnimationProgress * 0.5 * this.direction);
                this.renderBody(ctx, false);

                // Impact stars
                if (this.deathAnimationProgress < 0.5) {
                    ctx.fillStyle = '#FFFF00';
                    for (let i = 0; i < 4; i++) {
                        const angle = (i / 4) * Math.PI * 2 + Date.now() / 200;
                        const dist = 20 + this.deathAnimationProgress * 30;
                        ctx.fillRect(
                            this.x + this.width / 2 + Math.cos(angle) * dist - 3,
                            this.y + this.height / 2 + Math.sin(angle) * dist - 3,
                            6, 6
                        );
                    }
                }
            } else if (this.deathAnimationType === 'slingshot') {
                // Projectile hit - enemy crumbles
                const crumbleY = this.deathAnimationProgress * 50;
                ctx.translate(0, crumbleY);
                ctx.scale(1 - this.deathAnimationProgress * 0.3, 1 + this.deathAnimationProgress * 0.2);
                this.renderBody(ctx, false);

                // Debris particles
                ctx.fillStyle = '#4A0000';
                for (let i = 0; i < 6; i++) {
                    const px = this.x + Math.random() * this.width;
                    const py = this.y - this.deathAnimationProgress * 20 - Math.random() * 30;
                    ctx.fillRect(px, py, 3, 3);
                }
            } else {
                // Default death - fade and shrink
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

            // Flash rapidly and shake
            const flashRate = Math.floor(Date.now() / 50) % 2;
            if (flashRate) ctx.globalAlpha = 0.5;

            // Shake effect
            const shake = (1 - this.finisherProgress) * 5;
            ctx.translate(
                (Math.random() - 0.5) * shake,
                (Math.random() - 0.5) * shake
            );

            // Red tint
            this.renderBody(ctx, true);

            // Finisher effect based on type
            if (this.finisherType === 'sword') {
                // Multiple slash lines
                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 3;
                for (let i = 0; i < 3; i++) {
                    const offsetY = i * 15 - 15;
                    ctx.beginPath();
                    ctx.moveTo(this.x - 10, this.y + this.height / 2 + offsetY);
                    ctx.lineTo(this.x + this.width + 10, this.y + this.height / 2 + offsetY - 10);
                    ctx.stroke();
                }
            } else if (this.finisherType === 'fist') {
                // Impact burst
                ctx.fillStyle = '#FFAA00';
                ctx.globalAlpha = 0.7;
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const dist = 20 + this.finisherProgress * 30;
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
                    ctx.lineTo(
                        this.x + this.width / 2 + Math.cos(angle) * dist,
                        this.y + this.height / 2 + Math.sin(angle) * dist
                    );
                    ctx.strokeStyle = '#FFFF00';
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            } else if (this.finisherType === 'slingshot') {
                // Multiple projectile impacts
                ctx.fillStyle = '#696969';
                for (let i = 0; i < 5; i++) {
                    const px = this.x + this.width / 2 + (Math.random() - 0.5) * 40;
                    const py = this.y + this.height / 2 + (Math.random() - 0.5) * 40;
                    ctx.beginPath();
                    ctx.arc(px, py, 5, 0, Math.PI * 2);
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

        // Render body with optional attacking arm
        this.renderBody(ctx, isFlashing);

        ctx.restore();

        // Render attack trail effect
        if (this.attackTrailPoints.length > 1) {
            ctx.save();
            for (let i = 1; i < this.attackTrailPoints.length; i++) {
                const prev = this.attackTrailPoints[i - 1];
                const curr = this.attackTrailPoints[i];
                ctx.strokeStyle = `rgba(255, 100, 100, ${curr.alpha})`;
                ctx.lineWidth = 4 * curr.alpha;
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
            ctx.globalAlpha = 0.5 * (1 - Math.abs(this.attackAnimationProgress - 0.5) * 4);
            ctx.strokeStyle = '#FF4444';
            ctx.lineWidth = 3;
            const impactX = this.x + (this.direction > 0 ? this.width + 10 : -10);
            const impactY = this.y + this.height / 2;
            // Claw marks
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(impactX - 10 * this.direction, impactY + i * 8 - 5);
                ctx.lineTo(impactX + 10 * this.direction, impactY + i * 8 + 5);
                ctx.stroke();
            }
            ctx.restore();
        }

        // Health bar above enemy
        const barWidth = 45;
        const barHeight = 5;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 16;

        // Background (dark red)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health (green to red gradient based on health)
        const healthPercent = this.health / this.maxHealth;
        const healthWidth = healthPercent * barWidth;
        if (healthPercent > 0.5) {
            ctx.fillStyle = '#00FF00';
        } else if (healthPercent > 0.25) {
            ctx.fillStyle = '#FFFF00';
        } else {
            ctx.fillStyle = '#FF0000';
        }
        ctx.fillRect(barX, barY, healthWidth, barHeight);

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}
