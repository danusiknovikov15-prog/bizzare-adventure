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

        // Freeze ability
        this.freezeSpawnInterval = 8.0; // Freeze every 8 seconds
        this.freezeSpawnTimer = this.freezeSpawnInterval;
        this.freezeDuration = 5.0; // Freeze for 5 seconds
        this.freezeRange = 300; // Range to freeze player

        // Ice spikes ability
        this.iceSpikes = [];
        this.maxIceSpikes = 3;
        this.iceSpikeSpawnInterval = 5.0; // Spawn spikes every 5 seconds
        this.iceSpikeSpawnTimer = this.iceSpikeSpawnInterval;
        this.iceSpikeDamage = 30;
        this.iceSpikeWarningTime = 1.5; // Warning before spike appears
        this.iceSpikeLifetime = 3.0; // How long spike stays
    }

    initializeAbilities() {
        // Ice boss shoots projectiles that slow and freeze
        this.abilityTimers.iceShot = 0;
    }

    updateAbilities(deltaTime, player, game) {
        // Ice boss uses modified projectiles (handled in shootAtPlayer override)
        // The slow/freeze is applied by CombatSystem when projectile hits

        // Update freeze timer
        this.freezeSpawnTimer -= deltaTime;

        if (this.freezeSpawnTimer <= 0) {
            // Check if player is in range
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.freezeRange && player.isAlive) {
                // Freeze the player
                this.freezePlayer(player);
                this.freezeSpawnTimer = this.freezeSpawnInterval;
            } else {
                this.freezeSpawnTimer = 2.0; // Try again in 2 seconds if out of range
            }
        }

        // Update ice spike timer
        this.iceSpikeSpawnTimer -= deltaTime;

        if (this.iceSpikeSpawnTimer <= 0 && this.iceSpikes.length < this.maxIceSpikes) {
            // Spawn ice spike at player's position
            this.spawnIceSpike(player);
            this.iceSpikeSpawnTimer = this.iceSpikeSpawnInterval;
        }

        // Update existing ice spikes
        this.iceSpikes = this.iceSpikes.filter(spike => {
            spike.warningTimer -= deltaTime;

            if (spike.warningTimer <= 0 && !spike.active) {
                // Spike becomes active
                spike.active = true;
                spike.lifetime = this.iceSpikeLifetime;
            }

            if (spike.active) {
                spike.lifetime -= deltaTime;

                // Check collision with player (only hit once)
                if (!spike.hasHit && player.isAlive &&
                    player.x + player.width > spike.x &&
                    player.x < spike.x + spike.width &&
                    player.y + player.height > spike.y &&
                    player.y < spike.y + spike.height) {

                    player.takeDamage(this.iceSpikeDamage);
                    spike.hasHit = true;
                    console.log(`❄️ Ice spike hit player for ${this.iceSpikeDamage} damage!`);
                }

                return spike.lifetime > 0;
            }

            return true; // Keep during warning phase
        });
    }

    freezePlayer(player) {
        // Freeze the player for 5 seconds
        player.isFrozen = true;
        player.frozenTimer = this.freezeDuration;

        console.log(`🧊 IceBoss froze player for ${this.freezeDuration} seconds!`);
    }

    spawnIceSpike(player) {
        // Create warning indicator at player's position
        const spike = {
            x: player.x - 10,
            y: player.y + player.height - 5,
            width: player.width + 20,
            height: 50,
            warningTimer: this.iceSpikeWarningTime,
            active: false,
            hasHit: false,
            damage: this.iceSpikeDamage
        };

        this.iceSpikes.push(spike);
        console.log('❄️ IceBoss spawning ice spike!');
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
        // Render ice spikes
        for (const spike of this.iceSpikes) {
            ctx.save();

            if (!spike.active) {
                // Warning indicator (red circle pulsing)
                const pulse = Math.sin(Date.now() / 100) * 0.3 + 0.7;
                ctx.globalAlpha = pulse * 0.6;
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(spike.x, spike.y, spike.width, spike.height);

                // Warning text
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                const text = '!';
                ctx.strokeText(text, spike.x + spike.width / 2, spike.y + spike.height / 2 + 5);
                ctx.fillText(text, spike.x + spike.width / 2, spike.y + spike.height / 2 + 5);
            } else {
                // Active ice spike
                const spikeCount = 5;
                const spikeSpacing = spike.width / spikeCount;

                for (let i = 0; i < spikeCount; i++) {
                    const spikeX = spike.x + i * spikeSpacing + spikeSpacing / 2;
                    const spikeBaseY = spike.y + spike.height;
                    const spikeHeight = spike.height * (0.8 + Math.random() * 0.4);

                    // Spike gradient
                    const gradient = ctx.createLinearGradient(spikeX, spikeBaseY, spikeX, spikeBaseY - spikeHeight);
                    gradient.addColorStop(0, '#B0E0E6');
                    gradient.addColorStop(0.5, '#87CEEB');
                    gradient.addColorStop(1, '#FFFFFF');

                    ctx.fillStyle = gradient;

                    // Draw spike (triangle)
                    ctx.beginPath();
                    ctx.moveTo(spikeX - 8, spikeBaseY);
                    ctx.lineTo(spikeX, spikeBaseY - spikeHeight);
                    ctx.lineTo(spikeX + 8, spikeBaseY);
                    ctx.closePath();
                    ctx.fill();

                    // Ice shine
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(spikeX - 2, spikeBaseY - spikeHeight * 0.3);
                    ctx.lineTo(spikeX - 2, spikeBaseY - spikeHeight * 0.7);
                    ctx.stroke();
                }

                // Ice base
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = '#B0E0E6';
                ctx.fillRect(spike.x, spike.y + spike.height - 5, spike.width, 5);
            }

            ctx.restore();
        }

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

        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        const isHit = this.hitFlashTimer > 0;
        const t = Date.now() / 1000;

        // === ICE GOLEM ===

        // Body - crystalline ice
        const bodyGrad = ctx.createLinearGradient(x + 10, y + 35, x + w - 10, y + 100);
        bodyGrad.addColorStop(0, isHit ? '#FFF' : '#4A90C4');
        bodyGrad.addColorStop(0.3, isHit ? '#FFF' : '#87CEEB');
        bodyGrad.addColorStop(0.6, isHit ? '#FFF' : '#B0E0E6');
        bodyGrad.addColorStop(1, isHit ? '#FFF' : '#4A90C4');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(x + 10, y + 35, w - 20, 65);

        // Crystal facets on body
        if (!isHit) {
            ctx.strokeStyle = '#E0FFFF';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.6;
            // Crystal facet lines
            ctx.beginPath();
            ctx.moveTo(x + 30, y + 40);
            ctx.lineTo(x + 50, y + 60);
            ctx.lineTo(x + 30, y + 80);
            ctx.moveTo(x + 50, y + 60);
            ctx.lineTo(x + 70, y + 45);
            ctx.lineTo(x + 90, y + 65);
            ctx.moveTo(x + 70, y + 45);
            ctx.lineTo(x + 65, y + 85);
            ctx.moveTo(x + 90, y + 65);
            ctx.lineTo(x + 80, y + 90);
            ctx.stroke();
            ctx.globalAlpha = 1;

            // Ice shine spots
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.arc(x + 40, y + 50, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 75, y + 55, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 55, y + 75, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Frost core (inner glow)
        if (!isHit) {
            const coreGrad = ctx.createRadialGradient(x + w / 2, y + 65, 3, x + w / 2, y + 65, 16);
            coreGrad.addColorStop(0, 'rgba(224,255,255,0.9)');
            coreGrad.addColorStop(0.5, 'rgba(0,206,209,0.5)');
            coreGrad.addColorStop(1, 'rgba(0,206,209,0)');
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 65, 16, 0, Math.PI * 2);
            ctx.fill();
        }

        // Ice shoulder crystals
        for (let side = 0; side < 2; side++) {
            const sx = side === 0 ? x + 5 : x + w - 5;
            const dir = side === 0 ? -1 : 1;
            // Large crystal
            const crystalGrad = ctx.createLinearGradient(sx, y + 30, sx + dir * 20, y + 50);
            crystalGrad.addColorStop(0, isHit ? '#FFF' : '#E0FFFF');
            crystalGrad.addColorStop(1, isHit ? '#FFF' : '#5B9BD5');
            ctx.fillStyle = crystalGrad;
            ctx.beginPath();
            ctx.moveTo(sx, y + 32);
            ctx.lineTo(sx + dir * 18, y + 28);
            ctx.lineTo(sx + dir * 22, y + 42);
            ctx.lineTo(sx + dir * 10, y + 52);
            ctx.lineTo(sx, y + 48);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = isHit ? '#FFF' : '#E0FFFF';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Head - ice crystal
        ctx.fillStyle = isHit ? '#FFF' : '#6CB4D9';
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y - 2);
        ctx.lineTo(x + w / 2 + 24, y + 15);
        ctx.lineTo(x + w / 2 + 20, y + 35);
        ctx.lineTo(x + w / 2 - 20, y + 35);
        ctx.lineTo(x + w / 2 - 24, y + 15);
        ctx.closePath();
        ctx.fill();

        // Head inner gradient
        if (!isHit) {
            const headInner = ctx.createRadialGradient(x + w / 2, y + 18, 3, x + w / 2, y + 18, 18);
            headInner.addColorStop(0, 'rgba(176,224,230,0.6)');
            headInner.addColorStop(1, 'rgba(106,180,217,0)');
            ctx.fillStyle = headInner;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 18, 18, 0, Math.PI * 2);
            ctx.fill();
        }

        // Ice crown - crystal spikes
        for (let i = 0; i < 5; i++) {
            const cx = x + 28 + i * 16;
            const spikeH = (i % 2 === 0 ? 18 : 12) + Math.sin(t * 2 + i) * 2;
            const spikeGrad = ctx.createLinearGradient(cx, y - 2, cx, y - 2 - spikeH);
            spikeGrad.addColorStop(0, isHit ? '#FFF' : '#87CEEB');
            spikeGrad.addColorStop(0.5, isHit ? '#FFF' : '#E0FFFF');
            spikeGrad.addColorStop(1, isHit ? '#FFF' : '#FFFFFF');
            ctx.fillStyle = spikeGrad;
            ctx.beginPath();
            ctx.moveTo(cx - 4, y - 2);
            ctx.lineTo(cx, y - 2 - spikeH);
            ctx.lineTo(cx + 4, y - 2);
            ctx.closePath();
            ctx.fill();
            // Crystal shine
            if (!isHit) {
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                ctx.moveTo(cx - 1, y - 4);
                ctx.lineTo(cx - 1, y - 2 - spikeH + 4);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        // Eyes - piercing ice blue
        ctx.fillStyle = isHit ? '#FFF' : '#00CED1';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = isHit ? 0 : 10;
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 14, y + 16);
        ctx.lineTo(x + w / 2 - 6, y + 14);
        ctx.lineTo(x + w / 2 - 6, y + 20);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w / 2 + 14, y + 16);
        ctx.lineTo(x + w / 2 + 6, y + 14);
        ctx.lineTo(x + w / 2 + 6, y + 20);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Belt - frozen
        ctx.fillStyle = isHit ? '#FFF' : '#3A7CA5';
        ctx.fillRect(x + 15, y + 92, w - 30, 8);
        // Snowflake buckle
        if (!isHit) {
            ctx.strokeStyle = '#E0FFFF';
            ctx.lineWidth = 2;
            const bx = x + w / 2;
            const by = y + 96;
            for (let i = 0; i < 6; i++) {
                const angle = i * Math.PI / 3;
                ctx.beginPath();
                ctx.moveTo(bx, by);
                ctx.lineTo(bx + Math.cos(angle) * 6, by + Math.sin(angle) * 6);
                ctx.stroke();
            }
        }

        // Legs - ice pillars
        const legGrad = ctx.createLinearGradient(x, y + 100, x, y + h);
        legGrad.addColorStop(0, isHit ? '#FFF' : '#6CB4D9');
        legGrad.addColorStop(1, isHit ? '#FFF' : '#3A7CA5');
        ctx.fillStyle = legGrad;
        ctx.fillRect(x + 18, y + 100, 30, 50);
        ctx.fillRect(x + w - 48, y + 100, 30, 50);

        // Ice boots
        ctx.fillStyle = isHit ? '#FFF' : '#2A5F7E';
        ctx.fillRect(x + 14, y + h - 14, 38, 14);
        ctx.fillRect(x + w - 52, y + h - 14, 38, 14);

        // Icicles from body
        if (!isHit) {
            ctx.fillStyle = '#B0E0E6';
            ctx.globalAlpha = 0.7;
            for (let i = 0; i < 6; i++) {
                const ix = x + 18 + i * 16;
                const ih = 6 + Math.sin(t + i) * 3;
                ctx.beginPath();
                ctx.moveTo(ix, y + h);
                ctx.lineTo(ix + 4, y + h);
                ctx.lineTo(ix + 2, y + h + ih);
                ctx.closePath();
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // Frost particles floating
        if (!isHit) {
            ctx.fillStyle = '#E0FFFF';
            for (let i = 0; i < 6; i++) {
                const px = x + 10 + Math.sin(t * 1.5 + i * 1.2) * (w / 2 - 10) + w / 2 - 10;
                const py = y + 10 + ((t * 20 + i * 25) % (h - 20));
                const ps = 1.5 + Math.sin(t * 3 + i) * 0.5;
                ctx.globalAlpha = 0.4 + Math.sin(t * 2 + i) * 0.3;
                ctx.beginPath();
                ctx.arc(px, py, ps, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

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

        // Render ice abilities
        this.renderAbilities(ctx);

        ctx.restore();
    }
}
