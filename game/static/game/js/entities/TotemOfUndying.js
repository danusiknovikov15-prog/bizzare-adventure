// Totem of Undying - Saves player from death once (Minecraft style)
import { Entity } from './Entity.js';

export class TotemOfUndying extends Entity {
    constructor(x, y) {
        super(x, y, 24, 36); // Totem size

        this.isCollected = false;
        this.floatOffset = 0;
        this.floatSpeed = 2;
        this.glowIntensity = 0;

        // Physics
        this.vy = 50; // Slow fall
        this.vx = 0;
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Floating animation
        this.floatOffset += this.floatSpeed * deltaTime;

        // Glow animation
        this.glowIntensity = Math.sin(Date.now() / 400) * 0.3 + 0.7;

        super.update(deltaTime);

        if (this.isGrounded) {
            this.vy = 0;
        }
    }

    collect() {
        this.isCollected = true;
        console.log('🗿 Totem of Undying collected!');
    }

    render(ctx) {
        if (this.isCollected) return;

        ctx.save();

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2 + Math.sin(this.floatOffset) * 3;

        // Glow effect
        ctx.shadowBlur = 15 * this.glowIntensity;
        ctx.shadowColor = '#FFD700';

        // === MINECRAFT TOTEM OF UNDYING ===

        // Main body (gold/tan color)
        const bodyColor = '#C4A44D';
        const darkGold = '#8B7332';
        const lightGold = '#FFD700';
        const green = '#2E8B2E';
        const darkGreen = '#1A5C1A';

        // Totem body (rectangular base)
        ctx.fillStyle = bodyColor;
        ctx.fillRect(centerX - 8, centerY - 14, 16, 28);

        // Head (top part - wider)
        ctx.fillStyle = bodyColor;
        ctx.fillRect(centerX - 10, centerY - 18, 20, 8);

        // Eyes (green emerald eyes)
        ctx.fillStyle = green;
        ctx.fillRect(centerX - 7, centerY - 15, 4, 4);
        ctx.fillRect(centerX + 3, centerY - 15, 4, 4);

        // Eye pupils (darker green)
        ctx.fillStyle = darkGreen;
        ctx.fillRect(centerX - 6, centerY - 14, 2, 2);
        ctx.fillRect(centerX + 4, centerY - 14, 2, 2);

        // Nose (small triangle/rectangle)
        ctx.fillStyle = darkGold;
        ctx.fillRect(centerX - 1, centerY - 10, 2, 3);

        // Mouth (wide grin)
        ctx.fillStyle = darkGold;
        ctx.fillRect(centerX - 5, centerY - 6, 10, 2);

        // Teeth
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(centerX - 4, centerY - 6, 2, 1);
        ctx.fillRect(centerX - 1, centerY - 6, 2, 1);
        ctx.fillRect(centerX + 2, centerY - 6, 2, 1);

        // Wings/Arms (left)
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(centerX - 8, centerY - 5);
        ctx.lineTo(centerX - 12, centerY - 2);
        ctx.lineTo(centerX - 12, centerY + 5);
        ctx.lineTo(centerX - 8, centerY + 2);
        ctx.closePath();
        ctx.fill();

        // Wings/Arms (right)
        ctx.beginPath();
        ctx.moveTo(centerX + 8, centerY - 5);
        ctx.lineTo(centerX + 12, centerY - 2);
        ctx.lineTo(centerX + 12, centerY + 5);
        ctx.lineTo(centerX + 8, centerY + 2);
        ctx.closePath();
        ctx.fill();

        // Body details (vertical line)
        ctx.fillStyle = darkGold;
        ctx.fillRect(centerX - 1, centerY - 2, 2, 12);

        // Horizontal body details
        ctx.fillRect(centerX - 6, centerY + 2, 12, 2);
        ctx.fillRect(centerX - 5, centerY + 7, 10, 2);

        // Bottom legs
        ctx.fillStyle = bodyColor;
        ctx.fillRect(centerX - 6, centerY + 12, 4, 4);
        ctx.fillRect(centerX + 2, centerY + 12, 4, 4);

        // Gem on forehead (green)
        ctx.fillStyle = lightGold;
        ctx.fillRect(centerX - 2, centerY - 17, 4, 3);

        // Border outline
        ctx.strokeStyle = darkGold;
        ctx.lineWidth = 1;
        ctx.strokeRect(centerX - 10, centerY - 18, 20, 34);

        ctx.shadowBlur = 0;

        // Sparkle particles around totem
        this.renderSparkles(ctx, centerX, centerY);

        ctx.restore();
    }

    renderSparkles(ctx, centerX, centerY) {
        const time = Date.now() / 1000;

        for (let i = 0; i < 4; i++) {
            const angle = (time + i * 1.57) % (Math.PI * 2);
            const distance = 18 + Math.sin(time * 2 + i) * 5;
            const px = centerX + Math.cos(angle) * distance;
            const py = centerY + Math.sin(angle) * distance;

            ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(time * 3 + i) * 0.3})`;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
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
