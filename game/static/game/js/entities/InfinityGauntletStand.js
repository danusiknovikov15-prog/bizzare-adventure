import { Entity } from './Entity.js';

export class InfinityGauntletStand extends Entity {
    constructor(x, y) {
        super(x, y, 70, 90);
        this.float = 0;
        this.glow = 0;
        this.isCollected = false;
    }

    update(deltaTime) {
        if (this.isCollected) return;
        this.float += deltaTime * 2;
        this.glow = 0.65 + Math.sin(Date.now() / 250) * 0.2;
    }

    collect() {
        this.isCollected = true;
    }

    render(ctx) {
        if (this.isCollected) return;
        ctx.save();

        const cx = this.x + this.width / 2;
        const baseY = this.y + this.height;
        const bob = Math.sin(this.float) * 3;

        // Purple/gold glow
        ctx.shadowBlur = 25 * this.glow;
        ctx.shadowColor = '#a855f7';

        // Stone pedestal
        ctx.fillStyle = '#24123f';
        ctx.fillRect(this.x + 5, this.y + 45, 60, 40);
        ctx.fillStyle = '#6d28d9';
        ctx.fillRect(this.x, this.y + 40, 70, 10);
        ctx.fillStyle = '#c4b5fd';
        ctx.fillRect(this.x + 12, this.y + 50, 46, 8);
        ctx.fillStyle = '#3b176d';
        ctx.fillRect(this.x + 15, this.y + 62, 40, 23);

        // Golden supports
        ctx.fillStyle = '#f5c542';
        ctx.fillRect(this.x + 20, this.y + 30, 8, 18);
        ctx.fillRect(this.x + 42, this.y + 30, 8, 18);

        // Infinity Gauntlet hovering above the stand
        const gy = this.y + 18 + bob;
        ctx.shadowBlur = 30 * this.glow;
        ctx.shadowColor = '#f59e0b';
        ctx.fillStyle = '#d6a84f';

        // Wrist/hand
        ctx.fillRect(cx - 15, gy + 12, 30, 25);
        ctx.fillRect(cx - 21, gy + 20, 10, 13);
        ctx.fillRect(cx + 11, gy + 20, 10, 13);

        // Fingers
        ctx.fillRect(cx - 18, gy + 3, 7, 18);
        ctx.fillRect(cx - 9, gy, 7, 20);
        ctx.fillRect(cx + 2, gy, 7, 20);
        ctx.fillRect(cx + 11, gy + 3, 7, 18);

        // Six Infinity Stones
        const gems = ['#a855f7','#3b82f6','#ef4444','#f59e0b','#22c55e','#ec4899'];
        const positions = [[cx-9,gy+19],[cx,gy+15],[cx+9,gy+19],[cx-8,gy+29],[cx,gy+26],[cx+8,gy+29]];
        positions.forEach(([gx,gy2],i) => {
            ctx.fillStyle = gems[i];
            ctx.beginPath();
            ctx.arc(gx, gy2, 3.5, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ INFINITY GAUNTLET', cx, baseY + 18);

        ctx.restore();
    }
}
