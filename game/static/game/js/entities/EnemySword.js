// Enemy Sword - dropped by boss (10 damage)
import { Entity } from './Entity.js';

export class EnemySword extends Entity {
    constructor(x, y) {
        super(x, y, 32, 8); // Horizontal sword

        this.isCollected = false;
        this.damage = 10; // Enemy sword damage
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
        console.log('Collected Enemy Sword! (+10 damage)');
    }

    render(ctx) {
        if (this.isCollected) return;

        const floatY = Math.sin(this.floatOffset) * 5;

        ctx.save();

        // Glow effect (dark red)
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#8B0000';

        // Blade (dark red)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(this.x, this.y + floatY, this.width - 8, this.height);

        // Handle
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(this.x + this.width - 10, this.y - 2 + floatY, 10, this.height + 4);

        // Guard
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(this.x + this.width - 12, this.y - 4 + floatY, 2, this.height + 8);

        // Sparkle effect
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(this.x + 5, this.y + this.height / 2 + floatY, 2, 0, Math.PI * 2);
        ctx.fill();

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
