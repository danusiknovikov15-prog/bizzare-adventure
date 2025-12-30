// Platform entity - static objects that players can stand on
import { Entity } from './Entity.js';

export class Platform extends Entity {
    constructor(x, y, width, height, color = '#795548') {
        super(x, y, width, height);

        this.isStatic = true; // Platforms don't move
        this.color = color; // Brown color by default

        // Visual properties
        this.borderColor = '#5D4037';
        this.borderWidth = 2;
    }

    // Platforms don't need physics updates
    update(deltaTime) {
        // Static platforms don't update
    }

    // Custom render for platforms
    render(ctx) {
        // Draw platform with border
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Add simple texture/pattern
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        const gridSize = 20;
        for (let i = 0; i < this.width; i += gridSize) {
            ctx.fillRect(this.x + i, this.y, 1, this.height);
        }
    }
}
