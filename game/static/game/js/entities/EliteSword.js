// Elite Sword - Golden glowing sword with 20 damage
import { Entity } from './Entity.js';

export class EliteSword extends Entity {
    constructor(x, y) {
        super(x, y, 32, 10); // 32x10 pixels (bigger than normal sword)

        // Physics properties
        this.vy = -100; // Initial upward velocity when dropped
        this.vx = 0;

        // Weapon properties
        this.damageBonus = 19; // +19 damage (1 base + 19 = 20 total)
        this.isCollected = false;

        // Visual
        this.glowPhase = 0; // For pulsing glow effect
        this.rotation = 0; // Sword rotation for floating effect
        this.sparklePhase = 0; // For sparkle effects

        console.log('Elite Sword dropped! Damage: 20');
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Update glow animation
        this.glowPhase += deltaTime * 4;
        this.sparklePhase += deltaTime * 5;

        // Gentle rotation while floating
        this.rotation += deltaTime * 2;

        // Apply physics (gravity and velocity)
        super.update(deltaTime);
    }

    collect() {
        this.isCollected = true;
        console.log('Elite Sword collected! Damage: 20');
    }

    render(ctx) {
        if (this.isCollected) return;

        ctx.save();

        // Strong pulsing golden glow effect
        const glowIntensity = 0.6 + Math.sin(this.glowPhase) * 0.4;
        ctx.globalAlpha = glowIntensity;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFD700';
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x - 8, this.y - 8, this.width + 16, this.height + 16);

        ctx.restore();
        ctx.save();

        // Apply rotation
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.translate(-centerX, -centerY);

        // Sword blade (bright gold)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x, this.y, 24, 10);

        // Blade edge (lighter gold for shine)
        ctx.fillStyle = '#FFEC8B'; // Light gold
        ctx.fillRect(this.x, this.y + 3, 24, 2);

        // Energy glow in center of blade
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + 2, this.y + 4, 20, 1);

        // Blade tip (pointed, glowing)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(this.x + 24, this.y);
        ctx.lineTo(this.x + 32, this.y + 5);
        ctx.lineTo(this.x + 24, this.y + 10);
        ctx.closePath();
        ctx.fill();

        // Tip glow (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(this.x + 26, this.y + 3);
        ctx.lineTo(this.x + 30, this.y + 5);
        ctx.lineTo(this.x + 26, this.y + 7);
        ctx.closePath();
        ctx.fill();

        // Handle/grip (dark gold/bronze)
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(this.x - 8, this.y + 2, 8, 6);

        // Grip details
        ctx.fillStyle = '#B8860B';
        ctx.fillRect(this.x - 7, this.y + 3, 1, 4);
        ctx.fillRect(this.x - 5, this.y + 3, 1, 4);
        ctx.fillRect(this.x - 3, this.y + 3, 1, 4);

        // Guard (bright gold, ornate)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x - 2, this.y - 2, 2, 14);

        // Guard decorations
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x - 2, this.y + 1, 2, 2);
        ctx.fillRect(this.x - 2, this.y + 7, 2, 2);

        // Border for blade (golden)
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, 24, 10);

        // Sparkle effects (animated)
        const sparkle1 = Math.sin(this.sparklePhase) > 0.5 ? 1 : 0;
        const sparkle2 = Math.sin(this.sparklePhase + 1) > 0.5 ? 1 : 0;
        const sparkle3 = Math.sin(this.sparklePhase + 2) > 0.5 ? 1 : 0;

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';

        if (sparkle1) {
            ctx.fillRect(this.x + 8, this.y + 2, 2, 2);
        }
        if (sparkle2) {
            ctx.fillRect(this.x + 16, this.y + 6, 2, 2);
        }
        if (sparkle3) {
            ctx.fillRect(this.x + 12, this.y + 4, 2, 2);
        }

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
