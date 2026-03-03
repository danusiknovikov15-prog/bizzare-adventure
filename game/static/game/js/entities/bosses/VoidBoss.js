// VoidBoss - Boss with teleportation and black hole abilities
import { Boss } from '../Boss.js';

export class VoidBoss extends Boss {
    constructor(x, y) {
        super(x, y, 'void');

        // Boss stats for Level 18 (Boss #6)
        this.maxHealth = 280;
        this.health = 280;
        this.damage = 23;

        // Visual customization
        this.color = '#4B0082'; // Indigo for void
        this.projectileColor = '#8B00FF'; // Violet for void projectiles

        // Teleportation ability
        this.teleportTimer = 0;
        this.teleportInterval = 10.0; // Teleport every 10 seconds
        this.teleportTargets = []; // Will be set by game

        // Black hole ability
        this.blackHoles = [];
        this.maxBlackHoles = 2;
        this.blackHoleSpawnTimer = 0;
        this.blackHoleSpawnInterval = 12.0; // Create black hole every 12 seconds
        this.blackHoleDuration = 5.0; // Lasts 5 seconds
        this.blackHolePullStrength = 3750; // Pull force per second (strong pull - 2.5x base)
        this.blackHoleDamage = 20; // 20 damage per second
    }

    initializeAbilities() {
        this.abilityTimers.teleport = this.teleportInterval;
        this.abilityTimers.blackHole = 0;
    }

    updateAbilities(deltaTime, player, game) {
        // Teleportation
        this.teleportTimer -= deltaTime;
        if (this.teleportTimer <= 0) {
            this.teleport();
            this.teleportTimer = this.teleportInterval;
        }

        // Black hole spawning
        this.blackHoleSpawnTimer -= deltaTime;
        if (this.blackHoleSpawnTimer <= 0 && this.blackHoles.length < this.maxBlackHoles) {
            this.createBlackHole(player);
            this.blackHoleSpawnTimer = this.blackHoleSpawnInterval;
        }

        // Update black holes
        this.blackHoles = this.blackHoles.filter(hole => {
            hole.lifetime -= deltaTime;
            hole.animationTimer += deltaTime;

            // Check if player is within black hole radius
            const dx = player.x + player.width / 2 - hole.x;
            const dy = player.y + player.height / 2 - hole.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < hole.radius && player.isAlive) {
                // Damage player once per second
                if (!hole.lastHitTime || (Date.now() - hole.lastHitTime >= 1000)) {
                    player.takeDamage(this.blackHoleDamage);
                    hole.lastHitTime = Date.now();
                    console.log(`🕳️ Black hole hit player for ${this.blackHoleDamage} damage!`);
                }
            }

            return hole.lifetime > 0;
        });
    }

    teleport() {
        // Teleport to a random position
        // For now, teleport within a range around current position
        const teleportDistance = 200;
        const angle = Math.random() * Math.PI * 2;
        const newX = this.x + Math.cos(angle) * teleportDistance;
        const newY = this.y; // Keep same Y for simplicity

        // Clamp to reasonable bounds (will be properly bounded by physics)
        this.x = newX;

        console.log('🌀 VoidBoss teleported!');
    }

    createBlackHole(player) {
        if (!player) return;

        // Create black hole between boss and player
        const midX = (this.x + player.x) / 2;
        const midY = (this.y + player.y) / 2;

        const blackHole = {
            x: midX,
            y: midY,
            radius: 60, // Damage radius - only damage inside the black hole
            pullRadius: 1300, // Pull radius - pull from 1300 pixels away
            pullStrength: this.blackHolePullStrength,
            lifetime: this.blackHoleDuration,
            animationTimer: 0,
            lastHitTime: 0,
            visualRadius: 60 // Visual size for rendering
        };

        this.blackHoles.push(blackHole);
        console.log('🕳️ VoidBoss created black hole!');
    }

    renderAbilities(ctx) {
        // Render black holes
        for (const hole of this.blackHoles) {
            ctx.save();

            // Swirling void effect
            const rotation = hole.animationTimer * 2;
            ctx.translate(hole.x, hole.y);
            ctx.rotate(rotation);

            // Outer swirl
            for (let i = 0; i < 3; i++) {
                const angle = (i * Math.PI * 2 / 3) + rotation;
                const visualRadius = hole.visualRadius || 60;
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = '#4B0082';
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * 20, Math.sin(angle) * 20, visualRadius * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }

            // Inner void
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(0, 0, (hole.visualRadius || 60) * 0.5, 0, Math.PI * 2);
            ctx.fill();

            // Event horizon
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = '#8B00FF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, (hole.visualRadius || 60) * 0.6, 0, Math.PI * 2);
            ctx.stroke();

            ctx.restore();
        }

        // Render void projectiles
        for (const proj of this.projectiles) {
            ctx.save();

            // Void aura
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#4B0082';
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius + 8, 0, Math.PI * 2);
            ctx.fill();

            // Inner void
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = this.projectileColor;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
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

        // === VOID ENTITY / DARK LORD ===

        // Void aura (behind body)
        if (!isHit) {
            ctx.shadowColor = '#8B00FF';
            ctx.shadowBlur = 25;
        }

        // Body - dark matter with void energy
        const bodyGrad = ctx.createLinearGradient(x + 10, y + 35, x + w - 10, y + 100);
        bodyGrad.addColorStop(0, isHit ? '#FFF' : '#1A0033');
        bodyGrad.addColorStop(0.3, isHit ? '#FFF' : '#4B0082');
        bodyGrad.addColorStop(0.7, isHit ? '#FFF' : '#3A006F');
        bodyGrad.addColorStop(1, isHit ? '#FFF' : '#1A0033');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(x + 10, y + 35, w - 20, 65);
        ctx.shadowBlur = 0;

        // Void cracks / dark energy veins
        if (!isHit) {
            ctx.strokeStyle = '#8B00FF';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#8B00FF';
            ctx.shadowBlur = 6;
            ctx.globalAlpha = 0.6 + Math.sin(t * 3) * 0.3;
            ctx.beginPath();
            ctx.moveTo(x + 25, y + 42);
            ctx.lineTo(x + 40, y + 55);
            ctx.lineTo(x + 30, y + 68);
            ctx.lineTo(x + 45, y + 80);
            ctx.moveTo(x + 40, y + 55);
            ctx.lineTo(x + 55, y + 48);
            ctx.lineTo(x + 70, y + 60);
            ctx.moveTo(x + 70, y + 60);
            ctx.lineTo(x + 85, y + 50);
            ctx.lineTo(x + 95, y + 65);
            ctx.moveTo(x + 70, y + 60);
            ctx.lineTo(x + 65, y + 78);
            ctx.lineTo(x + 80, y + 88);
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }

        // Void portal core (center of chest)
        if (!isHit) {
            // Swirling void
            ctx.save();
            ctx.translate(x + w / 2, y + 65);
            ctx.rotate(t * 1.5);
            const voidGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
            voidGrad.addColorStop(0, '#000000');
            voidGrad.addColorStop(0.3, '#1A0033');
            voidGrad.addColorStop(0.6, '#4B0082');
            voidGrad.addColorStop(0.8, '#8B00FF');
            voidGrad.addColorStop(1, 'rgba(139,0,255,0)');
            ctx.fillStyle = voidGrad;
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fill();

            // Spiral arms
            ctx.strokeStyle = '#9B30FF';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.7;
            for (let arm = 0; arm < 3; arm++) {
                ctx.beginPath();
                for (let a = 0; a < Math.PI * 1.5; a += 0.1) {
                    const r = 3 + a * 3;
                    const angle = a + arm * (Math.PI * 2 / 3);
                    const px = Math.cos(angle) * r;
                    const py = Math.sin(angle) * r;
                    if (a === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            ctx.restore();
        }

        // Shadow shoulders (floating dark plates)
        for (let side = 0; side < 2; side++) {
            const sx = side === 0 ? x + 2 : x + w - 2;
            const dir = side === 0 ? -1 : 1;
            const floatY = Math.sin(t * 2 + side * Math.PI) * 3;

            // Dark plate
            const plateGrad = ctx.createRadialGradient(sx + dir * 12, y + 38 + floatY, 2, sx + dir * 12, y + 38 + floatY, 18);
            plateGrad.addColorStop(0, isHit ? '#FFF' : '#2D004D');
            plateGrad.addColorStop(1, isHit ? '#FFF' : '#0D0018');
            ctx.fillStyle = plateGrad;
            ctx.beginPath();
            ctx.ellipse(sx + dir * 12, y + 38 + floatY, 20, 14, dir * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Purple edge glow
            if (!isHit) {
                ctx.strokeStyle = '#8B00FF';
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5 + Math.sin(t * 4 + side) * 0.3;
                ctx.beginPath();
                ctx.ellipse(sx + dir * 12, y + 38 + floatY, 20, 14, dir * 0.3, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        // Head - void skull
        const headGrad = ctx.createRadialGradient(x + w / 2, y + 18, 4, x + w / 2, y + 18, 24);
        headGrad.addColorStop(0, isHit ? '#FFF' : '#3A006F');
        headGrad.addColorStop(0.7, isHit ? '#FFF' : '#1A0033');
        headGrad.addColorStop(1, isHit ? '#FFF' : '#0D0018');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 18, 24, 0, Math.PI * 2);
        ctx.fill();

        // Floating dark orb crown
        for (let i = 0; i < 5; i++) {
            const orbX = x + 20 + i * 20;
            const orbFloat = Math.sin(t * 2.5 + i * 1.2) * 4;
            const orbSize = 6 + Math.sin(t * 3 + i) * 1.5;

            // Orb
            ctx.fillStyle = isHit ? '#FFF' : '#0D0018';
            ctx.beginPath();
            ctx.arc(orbX, y - 8 - orbFloat, orbSize, 0, Math.PI * 2);
            ctx.fill();

            // Orb glow
            if (!isHit) {
                ctx.strokeStyle = '#8B00FF';
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5 + Math.sin(t * 4 + i) * 0.3;
                ctx.beginPath();
                ctx.arc(orbX, y - 8 - orbFloat, orbSize + 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        // Void face
        ctx.fillStyle = isHit ? '#FFF' : '#000000';
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 14, y + 14);
        ctx.lineTo(x + w / 2 + 14, y + 14);
        ctx.lineTo(x + w / 2 + 10, y + 30);
        ctx.lineTo(x + w / 2 - 10, y + 30);
        ctx.closePath();
        ctx.fill();

        // Eyes - burning purple void
        ctx.fillStyle = isHit ? '#FFF' : '#8B00FF';
        ctx.shadowColor = '#8B00FF';
        ctx.shadowBlur = isHit ? 0 : 15;
        ctx.beginPath();
        ctx.arc(x + w / 2 - 8, y + 20, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w / 2 + 8, y + 20, 5, 0, Math.PI * 2);
        ctx.fill();
        // Inner glow
        ctx.fillStyle = isHit ? '#FFF' : '#DA70D6';
        ctx.beginPath();
        ctx.arc(x + w / 2 - 8, y + 19, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w / 2 + 8, y + 19, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Belt - void chain
        ctx.fillStyle = isHit ? '#FFF' : '#1A0033';
        ctx.fillRect(x + 15, y + 92, w - 30, 8);
        // Void gem buckle
        if (!isHit) {
            const gemGrad = ctx.createRadialGradient(x + w / 2, y + 96, 1, x + w / 2, y + 96, 6);
            gemGrad.addColorStop(0, '#DA70D6');
            gemGrad.addColorStop(0.5, '#8B00FF');
            gemGrad.addColorStop(1, '#4B0082');
            ctx.fillStyle = gemGrad;
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y + 90);
            ctx.lineTo(x + w / 2 + 7, y + 96);
            ctx.lineTo(x + w / 2, y + 102);
            ctx.lineTo(x + w / 2 - 7, y + 96);
            ctx.closePath();
            ctx.fill();
        }

        // Legs - void matter
        const legGrad = ctx.createLinearGradient(x, y + 100, x, y + h);
        legGrad.addColorStop(0, isHit ? '#FFF' : '#3A006F');
        legGrad.addColorStop(1, isHit ? '#FFF' : '#0D0018');
        ctx.fillStyle = legGrad;
        ctx.fillRect(x + 18, y + 100, 30, 50);
        ctx.fillRect(x + w - 48, y + 100, 30, 50);

        // Void boots
        ctx.fillStyle = isHit ? '#FFF' : '#0D0018';
        ctx.fillRect(x + 14, y + h - 14, 38, 14);
        ctx.fillRect(x + w - 52, y + h - 14, 38, 14);

        // Dark particles dissipating
        if (!isHit) {
            for (let i = 0; i < 8; i++) {
                const px = x + 10 + Math.sin(t * 1.2 + i * 0.9) * (w / 2 - 10) + w / 2 - 10;
                const py = y + h - ((t * 15 + i * 20) % (h + 20));
                const ps = 1.5 + Math.sin(t * 2 + i) * 0.8;
                ctx.globalAlpha = 0.3 + Math.sin(t * 3 + i) * 0.2;
                ctx.fillStyle = i % 2 === 0 ? '#8B00FF' : '#4B0082';
                ctx.beginPath();
                ctx.arc(px, py, ps, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // Void tendrils from edges
        if (!isHit) {
            ctx.strokeStyle = '#4B0082';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.4;
            for (let i = 0; i < 4; i++) {
                const startX = x + 10 + i * (w - 20) / 3;
                const startY = y + h;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(
                    startX + Math.sin(t * 2 + i) * 15,
                    startY + 10,
                    startX + Math.sin(t * 3 + i) * 10,
                    startY + 15 + Math.sin(t + i) * 5
                );
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

        this.renderAbilities(ctx);

        ctx.restore();
    }
}
