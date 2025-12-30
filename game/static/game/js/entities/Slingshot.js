// Slingshot weapon - ranged weapon (15 damage)
import { Entity } from './Entity.js';

export class Slingshot extends Entity {
    constructor(x, y) {
        super(x, y, 40, 32); // Larger slingshot icon size

        this.isCollected = false;
        this.damage = 15; // Slingshot damage
        this.floatOffset = 0;
        this.floatSpeed = 2;
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Floating animation
        this.floatOffset += this.floatSpeed * deltaTime;
    }

    collect() {
        this.isCollected = true;
        console.log('Collected Slingshot! (+15 damage)');
    }

    render(ctx) {
        if (this.isCollected) return;

        const floatY = Math.sin(this.floatOffset) * 5;

        ctx.save();

        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF6347'; // Tomato red glow

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2 + floatY;

        // === WOOD TEXTURE (Y-shaped frame) ===

        // Wood grain base color
        ctx.strokeStyle = '#8B4513'; // Saddle Brown
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';

        // Handle (vertical)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 12);
        ctx.lineTo(centerX, centerY - 3);
        ctx.stroke();

        // Left prong
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 3);
        ctx.lineTo(centerX - 12, centerY - 12);
        ctx.stroke();

        // Right prong
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 3);
        ctx.lineTo(centerX + 12, centerY - 12);
        ctx.stroke();

        // Wood highlights (lighter brown)
        ctx.strokeStyle = '#A0522D'; // Sienna (lighter)
        ctx.lineWidth = 2;

        // Handle highlight
        ctx.beginPath();
        ctx.moveTo(centerX - 1, centerY + 12);
        ctx.lineTo(centerX - 1, centerY - 3);
        ctx.stroke();

        // Left prong highlight
        ctx.beginPath();
        ctx.moveTo(centerX - 1, centerY - 3);
        ctx.lineTo(centerX - 12, centerY - 12);
        ctx.stroke();

        // Right prong highlight
        ctx.beginPath();
        ctx.moveTo(centerX - 1, centerY - 3);
        ctx.lineTo(centerX + 12, centerY - 12);
        ctx.stroke();

        // === ELASTIC BAND (black rubber) ===
        ctx.strokeStyle = '#2a2a2a'; // Dark gray
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - 12);
        ctx.lineTo(centerX + 12, centerY - 12);
        ctx.stroke();

        // Band shine (lighter gray)
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 11, centerY - 11);
        ctx.lineTo(centerX + 11, centerY - 11);
        ctx.stroke();

        // === STONE PROJECTILE (sitting in pouch) ===
        ctx.shadowBlur = 0; // Remove glow for stone
        ctx.fillStyle = '#696969'; // Dim Gray
        ctx.beginPath();
        ctx.arc(centerX, centerY - 12, 3, 0, Math.PI * 2);
        ctx.fill();

        // Stone highlight
        ctx.fillStyle = '#A9A9A9'; // Dark Gray (lighter)
        ctx.beginPath();
        ctx.arc(centerX - 1, centerY - 13, 1, 0, Math.PI * 2);
        ctx.fill();

        // === LEATHER POUCH (holding stone) ===
        ctx.fillStyle = '#654321'; // Dark brown leather
        ctx.beginPath();
        ctx.arc(centerX, centerY - 12, 4, 0, Math.PI, true); // Half circle below stone
        ctx.fill();

        // === SPARKLE EFFECT (magical glow) ===
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFD700';
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x + this.width - 8, this.y + 8 + floatY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Extra sparkles
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + this.width - 10, this.y + 6 + floatY, 2, 2);
        ctx.fillRect(this.x + this.width - 6, this.y + 10 + floatY, 2, 2);

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
