// Sword weapon that drops from enemies with 10% chance
import { Entity } from './Entity.js';

export class Sword extends Entity {
    constructor(x, y) {
        super(x, y, 28, 8); // 28x8 pixels (horizontal sword)

        // Physics properties
        this.vy = -100; // Initial upward velocity when dropped
        this.vx = 0;

        // Weapon properties
        this.damageBonus = 3; // +3 damage per hit
        this.isCollected = false;

        // Visual
        this.glowPhase = 0; // For pulsing glow effect
        this.rotation = 0; // Sword rotation for floating effect

        console.log('Sword dropped!');
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Update glow animation
        this.glowPhase += deltaTime * 3;

        // Gentle rotation while floating
        this.rotation += deltaTime * 2;

        // Apply physics (gravity and velocity)
        super.update(deltaTime);
    }

    collect() {
        this.isCollected = true;
        console.log('Sword collected!');
    }

    render(ctx) {
        if (this.isCollected) return;

        ctx.save();

        // Pulsing glow effect (golden/yellow)
        const glowIntensity = 0.4 + Math.sin(this.glowPhase) * 0.25;
        ctx.globalAlpha = glowIntensity;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x - 6, this.y - 6, this.width + 12, this.height + 12);

        ctx.restore();
        ctx.save();

        // Apply rotation
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.translate(-centerX, -centerY);

        // Sword blade (silver)
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(this.x, this.y, 20, 8);

        // Blade edge (lighter silver for shine)
        ctx.fillStyle = '#E8E8E8';
        ctx.fillRect(this.x, this.y + 2, 20, 2);

        // Blade tip (pointed)
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y);
        ctx.lineTo(this.x + 28, this.y + 4);
        ctx.lineTo(this.x + 20, this.y + 8);
        ctx.closePath();
        ctx.fill();

        // Handle/grip (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x - 6, this.y + 2, 6, 4);

        // Guard (gold)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x - 2, this.y, 2, 8);

        // Border for blade
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, 20, 8);

        ctx.restore();
    }
}
