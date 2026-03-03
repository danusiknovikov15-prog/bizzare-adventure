import { Entity } from './Entity.js';

/**
 * BackgroundBlock - Non-interactive background decoration blocks
 * Used to create castle silhouettes and environmental details
 */
export class BackgroundBlock extends Entity {
    constructor(x, y, width, height, blockType = 'stone') {
        super(x, y, width, height);

        this.blockType = blockType;
        this.isStatic = true;
        this.isBackground = true; // Don't collide with player

        // Visual properties based on block type
        this.setBlockProperties(blockType);
    }

    setBlockProperties(type) {
        switch(type) {
            case 'stone_wall':
                this.baseColor = '#4A4A4A';
                this.mortarColor = '#2A2A2A';
                this.hasMortar = true;
                this.mortarSpacing = 40;
                break;

            case 'dark_stone':
                this.baseColor = '#3A3A3A';
                this.mortarColor = '#1A1A1A';
                this.hasMortar = true;
                this.mortarSpacing = 40;
                break;

            case 'cracked_stone':
                this.baseColor = '#4A4A4A';
                this.mortarColor = '#2A2A2A';
                this.hasMortar = true;
                this.hasCracks = true;
                this.mortarSpacing = 40;
                break;

            case 'tower':
                this.baseColor = '#3A3A3A';
                this.mortarColor = '#1A1A1A';
                this.hasMortar = true;
                this.hasCrenellations = true;
                this.mortarSpacing = 50;
                break;

            case 'window_lit':
                this.baseColor = '#2A2A2A';
                this.glowColor = '#FFD700';
                this.isWindow = true;
                break;

            case 'window_dark':
                this.baseColor = '#2A2A2A';
                this.glowColor = '#4A4A4A';
                this.isWindow = true;
                break;

            case 'bridge':
                this.baseColor = '#5A4A3A';
                this.mortarColor = '#3A2A1A';
                this.hasMortar = true;
                this.mortarSpacing = 30;
                break;

            case 'ruins':
                this.baseColor = '#4A4A4A';
                this.mortarColor = '#2A2A2A';
                this.hasMortar = true;
                this.isRuined = true;
                this.mortarSpacing = 40;
                break;

            case 'moss_stone':
                this.baseColor = '#4A4A4A';
                this.mossColor = '#2A4A2A';
                this.hasMoss = true;
                this.mortarColor = '#2A2A2A';
                this.hasMortar = true;
                this.mortarSpacing = 40;
                break;

            default:
                this.baseColor = '#4A4A4A';
                this.mortarColor = '#2A2A2A';
                this.hasMortar = false;
        }
    }

    render(ctx) {
        ctx.save();

        // Fill base color
        ctx.fillStyle = this.baseColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Add mortar lines (stone block pattern)
        if (this.hasMortar) {
            ctx.strokeStyle = this.mortarColor;
            ctx.lineWidth = 2;

            // Horizontal mortar lines
            for (let y = this.y; y < this.y + this.height; y += this.mortarSpacing) {
                ctx.beginPath();
                ctx.moveTo(this.x, y);
                ctx.lineTo(this.x + this.width, y);
                ctx.stroke();
            }

            // Vertical mortar lines (offset every other row for brick pattern)
            let offset = 0;
            for (let y = this.y; y < this.y + this.height; y += this.mortarSpacing) {
                offset = (offset === 0) ? this.mortarSpacing / 2 : 0;
                for (let x = this.x + offset; x < this.x + this.width; x += this.mortarSpacing) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, Math.min(y + this.mortarSpacing, this.y + this.height));
                    ctx.stroke();
                }
            }
        }

        // Add cracks for damaged stones
        if (this.hasCracks) {
            ctx.strokeStyle = '#1A1A1A';
            ctx.lineWidth = 1;

            // Random-looking cracks
            const numCracks = Math.floor(this.width / 50);
            for (let i = 0; i < numCracks; i++) {
                const crackX = this.x + (i + 0.5) * (this.width / (numCracks + 1));
                const crackY = this.y + this.height * 0.3;

                ctx.beginPath();
                ctx.moveTo(crackX, crackY);
                ctx.lineTo(crackX + 10, crackY + 20);
                ctx.lineTo(crackX + 5, crackY + 35);
                ctx.stroke();
            }
        }

        // Add crenellations (castle top pattern)
        if (this.hasCrenellations && this.width > 60) {
            const crenelWidth = 20;
            const crenelHeight = 15;
            const numCrenels = Math.floor(this.width / (crenelWidth * 2));

            ctx.fillStyle = this.baseColor;
            for (let i = 0; i < numCrenels; i++) {
                const crenelX = this.x + i * (crenelWidth * 2);
                ctx.fillRect(crenelX, this.y, crenelWidth, crenelHeight);
            }
        }

        // Render window with glow
        if (this.isWindow) {
            const padding = 5;
            const innerX = this.x + padding;
            const innerY = this.y + padding;
            const innerWidth = this.width - padding * 2;
            const innerHeight = this.height - padding * 2;

            // Window glow
            ctx.fillStyle = this.glowColor;
            ctx.fillRect(innerX, innerY, innerWidth, innerHeight);

            // Window frame
            ctx.strokeStyle = '#1A1A1A';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            // Cross dividers for multi-pane window
            if (this.width > 20 && this.height > 20) {
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width / 2, this.y + this.height);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(this.x, this.y + this.height / 2);
                ctx.lineTo(this.x + this.width, this.y + this.height / 2);
                ctx.stroke();
            }
        }

        // Add ruined/broken appearance
        if (this.isRuined) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

            // Random missing chunks
            const numChunks = 3;
            for (let i = 0; i < numChunks; i++) {
                const chunkX = this.x + Math.random() * this.width * 0.8;
                const chunkY = this.y + Math.random() * this.height * 0.8;
                const chunkSize = 10 + Math.random() * 20;

                ctx.fillRect(chunkX, chunkY, chunkSize, chunkSize);
            }
        }

        // Add moss patches
        if (this.hasMoss) {
            ctx.fillStyle = this.mossColor;

            const numPatches = Math.floor(this.width / 60);
            for (let i = 0; i < numPatches; i++) {
                const patchX = this.x + Math.random() * this.width;
                const patchY = this.y + this.height * 0.6 + Math.random() * this.height * 0.4;
                const patchWidth = 15 + Math.random() * 20;
                const patchHeight = 10 + Math.random() * 15;

                ctx.beginPath();
                ctx.ellipse(patchX, patchY, patchWidth / 2, patchHeight / 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Outer border for depth
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.restore();
    }

    update(deltaTime) {
        // Background blocks don't move or update
        // Override to prevent any physics
    }
}
