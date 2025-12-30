// Key entity that appears when all enemies are defeated
import { Entity } from './Entity.js';

export class Key extends Entity {
    constructor(x, y) {
        super(x, y, 20, 30); // 20x30 pixels (key shape)

        // Physics properties
        this.vy = -150; // Initial upward velocity when dropped
        this.vx = 0;

        // Key properties
        this.isCollected = false;

        // Visual
        this.glowPhase = 0; // For pulsing glow effect
        this.floatOffset = 0; // For floating animation
    }

    collect() {
        this.isCollected = true;
        console.log('Key collected!');
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Update glow and float animation
        this.glowPhase += deltaTime * 4;
        this.floatOffset = Math.sin(this.glowPhase) * 3;

        // Call parent update (applies velocity and gravity)
        super.update(deltaTime);
    }

    render(ctx) {
        if (this.isCollected) return;

        ctx.save();

        // Pulsing golden glow
        const glowIntensity = 0.5 + Math.sin(this.glowPhase) * 0.3;
        const glowSize = 8;

        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2,
            this.y + this.height / 2 + this.floatOffset,
            0,
            this.x + this.width / 2,
            this.y + this.height / 2 + this.floatOffset,
            glowSize + this.width
        );
        gradient.addColorStop(0, `rgba(255, 215, 0, ${glowIntensity})`);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(
            this.x - glowSize,
            this.y - glowSize + this.floatOffset,
            this.width + glowSize * 2,
            this.height + glowSize * 2
        );

        // Key head (circular top)
        ctx.fillStyle = '#FFD700'; // Gold color
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 8 + this.floatOffset, 7, 0, Math.PI * 2);
        ctx.fill();

        // Key hole in head
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 8 + this.floatOffset, 3, 0, Math.PI * 2);
        ctx.fill();

        // Key shaft (main body)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x + 8, this.y + 12 + this.floatOffset, 4, 12);

        // Key teeth (bottom)
        ctx.fillRect(this.x + 12, this.y + 18 + this.floatOffset, 4, 3);
        ctx.fillRect(this.x + 12, this.y + 22 + this.floatOffset, 4, 3);

        // Highlight/shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 6 + this.floatOffset, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
