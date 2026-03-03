// UNO Reverse Card - Reflects damage back to attacker
import { Entity } from './Entity.js';

export class UnoReverseCard extends Entity {
    constructor(x, y) {
        super(x, y, 30, 40); // Card size

        this.isCollected = false;
        this.floatOffset = 0;
        this.floatSpeed = 2;
        this.rotationAngle = 0;

        // Physics
        this.vy = 50; // Slow fall
        this.vx = 0;
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Floating animation
        this.floatOffset += this.floatSpeed * deltaTime;

        // Slow rotation
        this.rotationAngle += deltaTime * 0.5;

        super.update(deltaTime);

        if (this.isGrounded) {
            this.vy = 0;
        }
    }

    collect() {
        this.isCollected = true;
        console.log('🔄 UNO Reverse Card collected!');
    }

    render(ctx) {
        if (this.isCollected) return;

        ctx.save();

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2 + Math.sin(this.floatOffset) * 3;

        // Slight wobble animation
        ctx.translate(centerX, centerY);
        ctx.rotate(Math.sin(this.rotationAngle) * 0.1);
        ctx.translate(-centerX, -centerY);

        // Card glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FF0000';

        // Card background (red)
        ctx.fillStyle = '#E31B23';
        this.roundRect(ctx, centerX - 15, centerY - 20, 30, 40, 4);
        ctx.fill();

        // Card border (black)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        this.roundRect(ctx, centerX - 15, centerY - 20, 30, 40, 4);
        ctx.stroke();

        // Inner oval (yellow)
        ctx.fillStyle = '#FFDE00';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 12, 16, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Reverse arrows
        ctx.strokeStyle = '#E31B23';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        // Top arrow (pointing right)
        ctx.beginPath();
        ctx.moveTo(centerX - 6, centerY - 6);
        ctx.lineTo(centerX + 6, centerY - 6);
        ctx.lineTo(centerX + 3, centerY - 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 6, centerY - 6);
        ctx.lineTo(centerX + 3, centerY - 2);
        ctx.stroke();

        // Bottom arrow (pointing left)
        ctx.beginPath();
        ctx.moveTo(centerX + 6, centerY + 6);
        ctx.lineTo(centerX - 6, centerY + 6);
        ctx.lineTo(centerX - 3, centerY + 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - 6, centerY + 6);
        ctx.lineTo(centerX - 3, centerY + 2);
        ctx.stroke();

        // "UNO" text at bottom
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 6px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('UNO', centerX, centerY + 15);

        ctx.restore();

        // Sparkle particles
        this.renderSparkles(ctx, centerX, centerY);
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    renderSparkles(ctx, centerX, centerY) {
        const time = Date.now() / 1000;

        for (let i = 0; i < 4; i++) {
            const angle = (time * 2 + i * 1.57) % (Math.PI * 2);
            const distance = 22 + Math.sin(time * 3 + i) * 4;
            const px = centerX + Math.cos(angle) * distance;
            const py = centerY + Math.sin(angle) * distance;

            ctx.fillStyle = i % 2 === 0 ? '#FF0000' : '#FFDE00';
            ctx.globalAlpha = 0.6 + Math.sin(time * 4 + i) * 0.3;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
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
