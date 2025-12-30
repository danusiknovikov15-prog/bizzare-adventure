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
        this.blackHoleSpawnInterval = 7.0;
        this.blackHoleDuration = 12.0;
        this.blackHolePullStrength = 150; // Pull force per second
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
            radius: 60,
            pullStrength: this.blackHolePullStrength,
            lifetime: this.blackHoleDuration,
            animationTimer: 0
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
                const radius = hole.radius;
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = '#4B0082';
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * 20, Math.sin(angle) * 20, radius * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }

            // Inner void
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(0, 0, hole.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();

            // Event horizon
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = '#8B00FF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, hole.radius * 0.6, 0, Math.PI * 2);
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

        // Void glow effect
        ctx.shadowColor = '#8B00FF';
        ctx.shadowBlur = 20;

        if (this.hitFlashTimer > 0) {
            ctx.fillStyle = '#FFFFFF';
        } else {
            ctx.fillStyle = this.color;
        }

        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.shadowBlur = 0;

        // Void crown (floating dark orbs)
        ctx.fillStyle = '#000000';
        const crownY = this.y - 15;
        for (let i = 0; i < 5; i++) {
            const orbX = this.x + 20 + i * 20;
            const orbFloat = Math.sin(Date.now() / 200 + i) * 3;
            ctx.beginPath();
            ctx.arc(orbX, crownY - orbFloat, 8, 0, Math.PI * 2);
            ctx.fill();

            // Purple glow around orbs
            ctx.strokeStyle = '#8B00FF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(orbX, crownY - orbFloat, 10, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Eyes - glowing purple
        ctx.fillStyle = '#8B00FF';
        ctx.fillRect(this.x + 30, this.y + 40, 18, 18);
        ctx.fillRect(this.x + 72, this.y + 40, 18, 18);

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

        this.renderAbilities(ctx);

        ctx.restore();
    }
}
