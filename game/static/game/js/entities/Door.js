// Door entity - portal to next level (opens when all enemies defeated)
import { Entity } from './Entity.js';

export class Door extends Entity {
    constructor(x, y) {
        super(x, y, 60, 80); // 60x80 pixels (door size)

        // Visual
        this.pulsePhase = 0;
    }

    update(deltaTime) {
        // Pulse animation
        this.pulsePhase += deltaTime * 3;
    }

    render(ctx) {
        ctx.save();

        // Portal frame - dark brown wood
        ctx.fillStyle = '#4A2511';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Door frame
        ctx.strokeStyle = '#2C1810';
        ctx.lineWidth = 4;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Glowing portal effect (pulsing)
        const pulseIntensity = 0.5 + Math.sin(this.pulsePhase) * 0.3;
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2,
            this.y + this.height / 2,
            0,
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width
        );
        gradient.addColorStop(0, `rgba(100, 150, 255, ${pulseIntensity * 0.6})`);
        gradient.addColorStop(0.5, `rgba(50, 100, 200, ${pulseIntensity * 0.4})`);
        gradient.addColorStop(1, 'rgba(0, 50, 150, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);

        // Portal particles (swirling effect)
        for (let i = 0; i < 8; i++) {
            const angle = (this.pulsePhase + i * Math.PI / 4) % (Math.PI * 2);
            const radius = 15 + Math.sin(this.pulsePhase * 2 + i) * 5;
            const particleX = this.x + this.width / 2 + Math.cos(angle) * radius;
            const particleY = this.y + this.height / 2 + Math.sin(angle) * radius;

            ctx.fillStyle = `rgba(150, 200, 255, ${pulseIntensity * 0.8})`;
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
