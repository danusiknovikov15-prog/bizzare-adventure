// Elite Armor with spikes - +30 HP and deals 1 damage/sec to touching enemies
import { Entity } from './Entity.js';

export class EliteArmor extends Entity {
    constructor(x, y) {
        super(x, y, 28, 28); // 28x28 pixels (bigger than normal armor)

        // Physics properties
        this.vy = -100; // Initial upward velocity when dropped
        this.vx = 0;

        // Item properties
        this.healthBonus = 30; // +30 max HP when equipped
        this.thornsDamage = 1; // 1 damage per second to enemies
        this.isCollected = false;

        // Visual
        this.glowPhase = 0; // For pulsing glow effect

        console.log('Elite Armor with Spikes created! +30 HP, Thorns damage: 1/sec');
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Update glow animation
        this.glowPhase += deltaTime * 3;

        // Apply physics (gravity and velocity)
        super.update(deltaTime);
    }

    collect() {
        this.isCollected = true;
        console.log('Elite Armor collected! +30 HP, Thorns damage enabled!');
    }

    render(ctx) {
        if (this.isCollected) return;

        ctx.save();

        // Pulsing golden glow effect
        const glowIntensity = 0.4 + Math.sin(this.glowPhase) * 0.3;
        ctx.globalAlpha = glowIntensity;
        ctx.fillStyle = '#FFD700'; // Gold glow
        ctx.fillRect(this.x - 6, this.y - 6, this.width + 12, this.height + 12);

        ctx.restore();

        // Elite Armor chest piece (gold)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Armor details (darker gold)
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(this.x + 5, this.y + 5, 18, 18);

        // Shoulder guards (with spikes)
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(this.x + 2, this.y + 2, 8, 10);
        ctx.fillRect(this.x + 18, this.y + 2, 8, 10);

        // SPIKES on shoulders
        ctx.fillStyle = '#8B0000'; // Dark red spikes
        // Left shoulder spikes
        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y);
        ctx.lineTo(this.x + 6, this.y - 4);
        ctx.lineTo(this.x + 8, this.y);
        ctx.fill();

        // Right shoulder spikes
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y);
        ctx.lineTo(this.x + 22, this.y - 4);
        ctx.lineTo(this.x + 24, this.y);
        ctx.fill();

        // Center chest spikes
        ctx.fillStyle = '#DC143C'; // Crimson spikes
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 8);
        ctx.lineTo(this.x + 14, this.y + 4);
        ctx.lineTo(this.x + 16, this.y + 8);
        ctx.fill();

        // Belt/straps
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 5, this.y + 14, 18, 3);

        // Highlight/shine (golden)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + 8, this.y + 8, 4, 4);

        // Border (thick gold border)
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Sparkle effects
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFD700';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + this.width - 4, this.y + 4, 2, 2);
        ctx.fillRect(this.x + 4, this.y + this.height - 4, 2, 2);

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
