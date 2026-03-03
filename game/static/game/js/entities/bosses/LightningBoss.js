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

        // Lightning Strike ability
        this.lightningStrikes = [];
        this.maxLightningStrikes = 2;
        this.lightningStrikeInterval = 4.0; // Strike every 4 seconds
        this.lightningStrikeTimer = this.lightningStrikeInterval;
        this.lightningStrikeDamage = 40;
        this.lightningStrikeWarningTime = 1.0; // 1 second warning
        this.lightningStrikeWidth = 80; // Wider hitbox
        this.lightningStrikeHeight = 600; // Full screen height

        // Teleport ability
        this.teleportInterval = 7.0; // Teleport every 7 seconds
        this.teleportTimer = this.teleportInterval;
        this.teleportRange = 150; // Teleport to 150px from player
        this.isTeleporting = false;
        this.teleportDuration = 0.5; // Teleport animation duration
        this.teleportAnimationTimer = 0;
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

        // Update teleport timer and animation
        if (this.isTeleporting) {
            this.teleportAnimationTimer -= deltaTime;
            if (this.teleportAnimationTimer <= 0) {
                this.isTeleporting = false;
            }
        } else {
            this.teleportTimer -= deltaTime;
            if (this.teleportTimer <= 0 && player.isAlive) {
                this.teleportToPlayer(player);
                this.teleportTimer = this.teleportInterval;
            }
        }

        // Update lightning strike timer
        this.lightningStrikeTimer -= deltaTime;

        if (this.lightningStrikeTimer <= 0 && this.lightningStrikes.length < this.maxLightningStrikes) {
            // Spawn lightning strike at player's position
            this.spawnLightningStrike(player);
            this.lightningStrikeTimer = this.lightningStrikeInterval;
        }

        // Update existing lightning strikes
        this.lightningStrikes = this.lightningStrikes.filter(strike => {
            strike.warningTimer -= deltaTime;

            if (strike.warningTimer <= 0 && !strike.active) {
                // Strike becomes active
                strike.active = true;
                strike.lifetime = 0.3; // Lightning strike lasts 0.3 seconds
            }

            if (strike.active) {
                strike.lifetime -= deltaTime;

                // Check collision with player (only hit once)
                if (!strike.hasHit && player.isAlive &&
                    player.x + player.width > strike.x &&
                    player.x < strike.x + strike.width) {

                    player.takeDamage(this.lightningStrikeDamage);
                    strike.hasHit = true;
                    console.log(`⚡ Lightning strike hit player for ${this.lightningStrikeDamage} damage!`);
                }

                return strike.lifetime > 0;
            }

            return true; // Keep during warning phase
        });
    }

    teleportToPlayer(player) {
        // Calculate position near player
        const angle = Math.random() * Math.PI * 2;
        const targetX = player.x + Math.cos(angle) * this.teleportRange;
        const targetY = player.y + Math.sin(angle) * this.teleportRange;

        // Start teleport animation
        this.isTeleporting = true;
        this.teleportAnimationTimer = this.teleportDuration;

        // Save old position for effect
        this.oldX = this.x;
        this.oldY = this.y;

        // Teleport to new position
        this.x = targetX;
        this.y = targetY;

        console.log('⚡ LightningBoss teleported!');
    }

    spawnLightningStrike(player) {
        // Create warning indicator at player's position
        const strike = {
            x: player.x + player.width / 2 - this.lightningStrikeWidth / 2,
            y: 0, // From top of screen
            width: this.lightningStrikeWidth,
            height: this.lightningStrikeHeight,
            warningTimer: this.lightningStrikeWarningTime,
            active: false,
            hasHit: false,
            damage: this.lightningStrikeDamage
        };

        this.lightningStrikes.push(strike);
        console.log('⚡ LightningBoss summoning lightning strike!');
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
        // Render lightning strikes
        for (const strike of this.lightningStrikes) {
            ctx.save();

            if (!strike.active) {
                // Warning indicator (yellow pulsing line)
                const pulse = Math.sin(Date.now() / 100) * 0.3 + 0.7;
                ctx.globalAlpha = pulse * 0.7;
                ctx.fillStyle = '#FFFF00';
                ctx.fillRect(strike.x, strike.y, strike.width, strike.height);

                // Warning borders
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.strokeRect(strike.x, strike.y, strike.width, strike.height);

                // Warning text
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                const text = '⚡';
                ctx.strokeText(text, strike.x + strike.width / 2, strike.y + strike.height / 2);
                ctx.fillText(text, strike.x + strike.width / 2, strike.y + strike.height / 2);
            } else {
                // Active lightning strike (zigzag pattern)
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 4;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#FFFF00';

                // Draw zigzag lightning bolt
                ctx.beginPath();
                let currentY = strike.y;
                let currentX = strike.x + strike.width / 2;

                ctx.moveTo(currentX, currentY);

                const segments = 10;
                const segmentHeight = strike.height / segments;

                for (let i = 0; i < segments; i++) {
                    currentY += segmentHeight;
                    currentX += (Math.random() - 0.5) * strike.width * 0.8;
                    ctx.lineTo(currentX, currentY);
                }

                ctx.stroke();

                // Outer glow
                ctx.strokeStyle = '#FFFF00';
                ctx.lineWidth = 8;
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                currentY = strike.y;
                currentX = strike.x + strike.width / 2;
                ctx.moveTo(currentX, currentY);
                for (let i = 0; i < segments; i++) {
                    currentY += segmentHeight;
                    currentX += (Math.random() - 0.5) * strike.width * 0.8;
                    ctx.lineTo(currentX, currentY);
                }
                ctx.stroke();

                ctx.shadowBlur = 0;
            }

            ctx.restore();
        }

        // Render teleport effect
        if (this.isTeleporting && this.oldX !== undefined) {
            ctx.save();

            // Old position lightning effect (disappearing)
            const fadeOut = this.teleportAnimationTimer / this.teleportDuration;
            ctx.globalAlpha = fadeOut * 0.8;

            // Electric circle at old position
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.oldX + this.width / 2, this.oldY + this.height / 2, 60, 0, Math.PI * 2);
            ctx.stroke();

            // Lightning sparks at old position
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + Date.now() / 100;
                const x1 = this.oldX + this.width / 2 + Math.cos(angle) * 40;
                const y1 = this.oldY + this.height / 2 + Math.sin(angle) * 40;
                const x2 = this.oldX + this.width / 2 + Math.cos(angle) * 70;
                const y2 = this.oldY + this.height / 2 + Math.sin(angle) * 70;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            ctx.restore();
        }

        if (this.isTeleporting) {
            ctx.save();

            // New position lightning effect (appearing)
            const fadeIn = 1 - (this.teleportAnimationTimer / this.teleportDuration);
            ctx.globalAlpha = fadeIn * 0.8;

            // Electric circle at new position
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 60, 0, Math.PI * 2);
            ctx.stroke();

            // Lightning sparks at new position
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 - Date.now() / 100;
                const x1 = this.x + this.width / 2 + Math.cos(angle) * 40;
                const y1 = this.y + this.height / 2 + Math.sin(angle) * 40;
                const x2 = this.x + this.width / 2 + Math.cos(angle) * 70;
                const y2 = this.y + this.height / 2 + Math.sin(angle) * 70;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            ctx.restore();
        }

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

        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        const isHit = this.hitFlashTimer > 0;
        const t = Date.now() / 1000;

        // === STORM ELEMENTAL ===

        // Electric aura (behind body)
        if (!isHit && this.inBurst) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.4 + Math.sin(t * 10) * 0.3;
            ctx.strokeRect(x - 8, y - 5, w + 16, h + 10);
            ctx.globalAlpha = 1;
        }

        // Body - electric energy
        const bodyGrad = ctx.createLinearGradient(x + 10, y + 35, x + w - 10, y + 100);
        bodyGrad.addColorStop(0, isHit ? '#FFF' : '#B8860B');
        bodyGrad.addColorStop(0.3, isHit ? '#FFF' : '#FFD700');
        bodyGrad.addColorStop(0.7, isHit ? '#FFF' : '#DAA520');
        bodyGrad.addColorStop(1, isHit ? '#FFF' : '#B8860B');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(x + 10, y + 35, w - 20, 65);

        // Lightning bolt patterns on body
        if (!isHit) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#FFFF00';
            ctx.shadowBlur = 8;
            // Bolt pattern left
            ctx.beginPath();
            ctx.moveTo(x + 25, y + 42);
            ctx.lineTo(x + 35, y + 52);
            ctx.lineTo(x + 28, y + 58);
            ctx.lineTo(x + 38, y + 70);
            ctx.lineTo(x + 30, y + 78);
            ctx.lineTo(x + 40, y + 90);
            ctx.stroke();
            // Bolt pattern right
            ctx.beginPath();
            ctx.moveTo(x + w - 25, y + 45);
            ctx.lineTo(x + w - 35, y + 55);
            ctx.lineTo(x + w - 28, y + 62);
            ctx.lineTo(x + w - 38, y + 72);
            ctx.lineTo(x + w - 30, y + 82);
            ctx.stroke();

            // Electric sparks (animated)
            ctx.globalAlpha = 0.6 + Math.sin(t * 8) * 0.4;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                const sx = x + 20 + Math.sin(t * 6 + i * 2) * 30 + 30;
                const sy = y + 40 + (i * 15);
                const ex = sx + Math.cos(t * 8 + i) * 15;
                const ey = sy + Math.sin(t * 8 + i) * 8;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(ex, ey);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }

        // Energy core
        if (!isHit) {
            const coreGrad = ctx.createRadialGradient(x + w / 2, y + 65, 2, x + w / 2, y + 65, 15);
            coreGrad.addColorStop(0, '#FFFFFF');
            coreGrad.addColorStop(0.3, '#FFFF00');
            coreGrad.addColorStop(0.7, '#FFD700');
            coreGrad.addColorStop(1, 'rgba(255,215,0,0)');
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 65, 15, 0, Math.PI * 2);
            ctx.fill();
        }

        // Storm cloud shoulders
        for (let side = 0; side < 2; side++) {
            const sx = side === 0 ? x + 2 : x + w - 2;
            const dir = side === 0 ? -1 : 1;
            // Cloud shape
            ctx.fillStyle = isHit ? '#FFF' : '#8B7500';
            ctx.beginPath();
            ctx.arc(sx + dir * 8, y + 40, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(sx + dir * 16, y + 38, 10, 0, Math.PI * 2);
            ctx.fill();
            // Mini lightning from shoulder
            if (!isHit) {
                ctx.strokeStyle = '#FFFF00';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#FFFF00';
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.moveTo(sx + dir * 10, y + 50);
                ctx.lineTo(sx + dir * 14, y + 56);
                ctx.lineTo(sx + dir * 8, y + 60);
                ctx.lineTo(sx + dir * 12, y + 66);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        // Head - storm sphere
        const headGrad = ctx.createRadialGradient(x + w / 2, y + 18, 4, x + w / 2, y + 18, 24);
        headGrad.addColorStop(0, isHit ? '#FFF' : '#FFD700');
        headGrad.addColorStop(0.6, isHit ? '#FFF' : '#B8860B');
        headGrad.addColorStop(1, isHit ? '#FFF' : '#8B6914');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 18, 24, 0, Math.PI * 2);
        ctx.fill();

        // Lightning bolt crown (3 bolts)
        for (let i = 0; i < 3; i++) {
            const bx = x + 30 + i * 30;
            const boltGrad = ctx.createLinearGradient(bx, y - 20, bx, y + 5);
            boltGrad.addColorStop(0, isHit ? '#FFF' : '#FFFF00');
            boltGrad.addColorStop(1, isHit ? '#FFF' : '#FFD700');
            ctx.fillStyle = boltGrad;
            ctx.beginPath();
            ctx.moveTo(bx - 3, y - 3);
            ctx.lineTo(bx + 3, y - 10);
            ctx.lineTo(bx + 1, y - 6);
            ctx.lineTo(bx + 5, y - 15);
            ctx.lineTo(bx + 2, y - 8);
            ctx.lineTo(bx + 6, y - 20);
            ctx.lineTo(bx - 1, y - 8);
            ctx.lineTo(bx + 1, y - 12);
            ctx.lineTo(bx - 3, y - 6);
            ctx.closePath();
            ctx.fill();
        }

        // Face visor
        ctx.fillStyle = isHit ? '#FFF' : '#5C4A00';
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 15, y + 14);
        ctx.lineTo(x + w / 2 + 15, y + 14);
        ctx.lineTo(x + w / 2 + 11, y + 28);
        ctx.lineTo(x + w / 2 - 11, y + 28);
        ctx.closePath();
        ctx.fill();

        // Eyes - electric cyan
        ctx.fillStyle = isHit ? '#FFF' : '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = isHit ? 0 : 12;
        ctx.fillRect(x + w / 2 - 13, y + 17, 8, 5);
        ctx.fillRect(x + w / 2 + 5, y + 17, 8, 5);
        // Flickering pupils
        if (!isHit) {
            ctx.fillStyle = '#FFFFFF';
            const flicker = Math.random() > 0.1 ? 1 : 0;
            ctx.globalAlpha = flicker;
            ctx.fillRect(x + w / 2 - 10, y + 18, 3, 3);
            ctx.fillRect(x + w / 2 + 8, y + 18, 3, 3);
            ctx.globalAlpha = 1;
        }
        ctx.shadowBlur = 0;

        // Belt with lightning emblem
        ctx.fillStyle = isHit ? '#FFF' : '#7B6B00';
        ctx.fillRect(x + 15, y + 92, w - 30, 8);
        ctx.fillStyle = isHit ? '#FFF' : '#FFFF00';
        // Lightning bolt buckle
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 3, y + 91);
        ctx.lineTo(x + w / 2 + 3, y + 94);
        ctx.lineTo(x + w / 2 - 1, y + 96);
        ctx.lineTo(x + w / 2 + 3, y + 101);
        ctx.lineTo(x + w / 2 - 3, y + 98);
        ctx.lineTo(x + w / 2 + 1, y + 96);
        ctx.closePath();
        ctx.fill();

        // Legs - charged
        const legGrad = ctx.createLinearGradient(x, y + 100, x, y + h);
        legGrad.addColorStop(0, isHit ? '#FFF' : '#DAA520');
        legGrad.addColorStop(1, isHit ? '#FFF' : '#8B6914');
        ctx.fillStyle = legGrad;
        ctx.fillRect(x + 18, y + 100, 30, 50);
        ctx.fillRect(x + w - 48, y + 100, 30, 50);

        // Electric boots
        ctx.fillStyle = isHit ? '#FFF' : '#5C4A00';
        ctx.fillRect(x + 14, y + h - 14, 38, 14);
        ctx.fillRect(x + w - 52, y + h - 14, 38, 14);

        // Sparks from boots
        if (!isHit) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5 + Math.sin(t * 6) * 0.3;
            for (let i = 0; i < 3; i++) {
                const sparkX = x + 20 + Math.random() * (w - 40);
                ctx.beginPath();
                ctx.moveTo(sparkX, y + h);
                ctx.lineTo(sparkX + (Math.random() - 0.5) * 10, y + h + 5 + Math.random() * 5);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        // Health bar
        const barWidth = w;
        const barHeight = 12;
        const barX = x;
        const barY = y - 30;
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
