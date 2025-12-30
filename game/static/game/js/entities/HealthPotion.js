// Health potion that drops from enemies
import { Entity } from './Entity.js';

export class HealthPotion extends Entity {
    constructor(x, y) {
        super(x, y, 20, 20); // 20x20 pixels

        this.isStatic = false; // Can fall with gravity
        this.healAmount = 10; // Heals 10 HP
        this.isCollected = false;

        // Visual properties
        this.color = '#00FF00'; // Bright green
        this.glowPhase = 0; // For pulsing glow effect

        // Float up slightly when dropped
        this.vy = -100; // Initial upward velocity

        console.log('Health potion created');
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Update glow animation
        this.glowPhase += deltaTime * 3; // Pulse speed

        // Apply friction when on ground
        if (this.isGrounded) {
            this.vx *= 0.9;
            if (Math.abs(this.vx) < 5) {
                this.vx = 0;
            }
        }

        // Call parent update (applies velocity and gravity)
        super.update(deltaTime);
    }

    // Collect the potion
    collect() {
        if (this.isCollected) return 0;

        this.isCollected = true;
        console.log(`Health potion collected! +${this.healAmount} HP`);
        return this.healAmount;
    }

    render(ctx) {
        if (this.isCollected) return; // Don't render if collected

        ctx.save();

        // Pulsing glow effect
        const glowIntensity = 0.3 + Math.sin(this.glowPhase) * 0.2;
        const glowSize = 8 + Math.sin(this.glowPhase) * 4;

        // Outer glow
        ctx.globalAlpha = glowIntensity;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(
            this.x - glowSize / 2,
            this.y - glowSize / 2,
            this.width + glowSize,
            this.height + glowSize
        );

        ctx.globalAlpha = 1.0;

        // Potion bottle body
        ctx.fillStyle = '#00CC00';
        ctx.fillRect(this.x + 4, this.y + 6, 12, 12);

        // Potion bottle neck
        ctx.fillStyle = '#009900';
        ctx.fillRect(this.x + 7, this.y + 2, 6, 6);

        // Cork/cap
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 7, this.y, 6, 3);

        // Liquid shine effect
        ctx.fillStyle = '#66FF66';
        ctx.fillRect(this.x + 6, this.y + 8, 3, 3);

        // Plus symbol (healing indicator)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + 9, this.y + 11, 2, 6); // Vertical line
        ctx.fillRect(this.x + 7, this.y + 13, 6, 2); // Horizontal line

        ctx.restore();
    }
}
