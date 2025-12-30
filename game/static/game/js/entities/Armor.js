// Armor item that drops from armored enemies
import { Entity } from './Entity.js';

export class Armor extends Entity {
    constructor(x, y) {
        super(x, y, 24, 24); // 24x24 pixels

        // Physics properties
        this.vy = -100; // Initial upward velocity when dropped
        this.vx = 0;

        // Item properties
        this.healthBonus = 15; // +15 max HP when equipped
        this.isCollected = false;

        // Visual
        this.glowPhase = 0; // For pulsing glow effect

        console.log('Armor created!');
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
        console.log('Armor collected!');
    }

    render(ctx) {
        if (this.isCollected) return;

        ctx.save();

        // Pulsing glow effect
        const glowIntensity = 0.3 + Math.sin(this.glowPhase) * 0.2;
        ctx.globalAlpha = glowIntensity;
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(this.x - 4, this.y - 4, this.width + 8, this.height + 8);

        ctx.restore();

        // Armor chest piece (silver/gray)
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Armor details (darker gray)
        ctx.fillStyle = '#808080';
        ctx.fillRect(this.x + 4, this.y + 4, 16, 16);

        // Shoulder guards
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(this.x + 2, this.y + 2, 6, 8);
        ctx.fillRect(this.x + 16, this.y + 2, 6, 8);

        // Belt/straps
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x + 4, this.y + 12, 16, 3);

        // Highlight/shine
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + 6, this.y + 6, 3, 3);

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
