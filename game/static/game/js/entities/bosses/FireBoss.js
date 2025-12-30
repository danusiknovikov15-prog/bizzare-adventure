// FireBoss - Boss with fire zone area damage ability
import { Boss } from '../Boss.js';

export class FireBoss extends Boss {
    constructor(x, y) {
        super(x, y, 'fire');

        // Boss stats for Level 6 (Boss #2)
        this.maxHealth = 120;
        this.health = 120;
        this.damage = 11;

        // Visual customization
        this.color = '#FF4500'; // Orange-red for fire
        this.projectileColor = '#FF6347'; // Tomato red for fire projectiles

        // Fire zone ability
        this.fireZones = [];
        this.maxFireZones = 3;
        this.fireZoneSpawnTimer = 0;
        this.fireZoneSpawnInterval = 4.0; // Create new zones every 4 seconds
        this.fireZoneDuration = 8.0; // Zones last 8 seconds
        this.fireZoneDamage = 3; // 3 damage per second
    }

    initializeAbilities() {
        // Fire boss creates fire zones on platforms
        this.abilityTimers.fireZoneSpawn = 0;
    }

    updateAbilities(deltaTime, player, game) {
        // Update fire zone spawn timer
        this.fireZoneSpawnTimer -= deltaTime;

        if (this.fireZoneSpawnTimer <= 0 && this.fireZones.length < this.maxFireZones) {
            // Create a new fire zone at random position
            this.createFireZone(game);
            this.fireZoneSpawnTimer = this.fireZoneSpawnInterval;
        }

        // Update existing fire zones
        this.fireZones = this.fireZones.filter(zone => {
            zone.lifetime -= deltaTime;
            zone.animationTimer += deltaTime;
            return zone.lifetime > 0;
        });
    }

    createFireZone(game) {
        // Create fire zone at random position within the level
        // Try to place on a platform near the boss
        const randomX = this.x + (Math.random() - 0.5) * 400; // Within 200px of boss
        const randomY = this.y + this.height; // At boss's feet level

        const fireZone = {
            x: randomX,
            y: randomY,
            width: 100,
            height: 50,
            lifetime: this.fireZoneDuration,
            damage: this.fireZoneDamage,
            animationTimer: 0
        };

        this.fireZones.push(fireZone);
        console.log('🔥 FireBoss created fire zone!');
    }

    renderAbilities(ctx) {
        // Render fire zones
        for (const zone of this.fireZones) {
            ctx.save();

            // Flickering animation
            const flicker = Math.sin(zone.animationTimer * 10) * 0.2 + 0.8;
            ctx.globalAlpha = flicker;

            // Gradient fire effect
            const gradient = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.height);
            gradient.addColorStop(0, '#FF4500'); // Orange-red at bottom
            gradient.addColorStop(0.5, '#FF6347'); // Tomato in middle
            gradient.addColorStop(1, '#FFD700'); // Gold at top

            ctx.fillStyle = gradient;
            ctx.fillRect(zone.x, zone.y, zone.width, zone.height);

            // Fire particles
            for (let i = 0; i < 5; i++) {
                const particleX = zone.x + Math.random() * zone.width;
                const particleY = zone.y + Math.random() * zone.height;
                const particleSize = Math.random() * 8 + 4;

                ctx.fillStyle = i % 2 === 0 ? '#FF4500' : '#FFD700';
                ctx.globalAlpha = Math.random() * 0.7 + 0.3;
                ctx.beginPath();
                ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        // Render fire projectiles
        ctx.fillStyle = this.projectileColor;
        for (const proj of this.projectiles) {
            ctx.save();

            // Outer glow
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius + 5, 0, Math.PI * 2);
            ctx.fill();

            // Inner projectile
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

        // Flash white when hit
        if (this.hitFlashTimer > 0) {
            ctx.fillStyle = '#FFFFFF';
        } else {
            ctx.fillStyle = this.color;
        }

        // Boss body
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Fire crown effect
        ctx.fillStyle = '#FFD700'; // Gold
        const crownY = this.y - 15;
        for (let i = 0; i < 5; i++) {
            const crownX = this.x + 15 + i * 22;
            const flamHeight = 15 + Math.sin(Date.now() / 100 + i) * 5;
            ctx.fillRect(crownX, crownY - flamHeight, 12, 20 + flamHeight);
        }

        // Eyes - glowing orange
        ctx.fillStyle = '#FF4500';
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

        // Render fire abilities
        this.renderAbilities(ctx);

        ctx.restore();
    }
}
