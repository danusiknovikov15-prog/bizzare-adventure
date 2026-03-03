// ElementalShard - Fragments dropped by bosses that grant special abilities
import { Entity } from './Entity.js';

export class ElementalShard extends Entity {
    constructor(x, y, elementType) {
        super(x, y, 30, 30); // 30x30 pixels

        this.elementType = elementType; // 'acid', 'fire', 'ice', 'lightning', 'water', 'void'
        this.isCollected = false;
        this.floatOffset = 0;
        this.floatSpeed = 2;
        this.glowIntensity = 0;
        this.rotationAngle = 0;

        // Set color based on element type
        this.setElementProperties();

        // Make it affected by gravity but with slow fall
        this.vy = 50; // Slow fall speed
        this.vx = 0;
    }

    setElementProperties() {
        switch (this.elementType) {
            case 'acid':
                this.color = '#7FFF00'; // Chartreuse
                this.glowColor = '#32CD32';
                this.name = 'Acid Shard';
                break;
            case 'fire':
                this.color = '#FF4500'; // Orange red
                this.glowColor = '#FF6347';
                this.name = 'Fire Shard';
                break;
            case 'ice':
                this.color = '#00FFFF'; // Cyan
                this.glowColor = '#87CEEB';
                this.name = 'Ice Shard';
                break;
            case 'lightning':
                this.color = '#FFD700'; // Gold
                this.glowColor = '#FFFF00';
                this.name = 'Lightning Shard';
                break;
            case 'water':
                this.color = '#1E90FF'; // Dodger blue
                this.glowColor = '#4169E1';
                this.name = 'Water Shard';
                break;
            case 'void':
                this.color = '#8B00FF'; // Violet
                this.glowColor = '#4B0082';
                this.name = 'Void Shard';
                break;
            default:
                this.color = '#FFFFFF';
                this.glowColor = '#CCCCCC';
                this.name = 'Unknown Shard';
        }
    }

    update(deltaTime) {
        if (this.isCollected) return;

        // Floating animation
        this.floatOffset += this.floatSpeed * deltaTime;

        // Glow animation
        this.glowIntensity = Math.sin(Date.now() / 300) * 0.5 + 0.5;

        // Rotation animation
        this.rotationAngle += deltaTime * 2;

        // Update physics (gravity applied by physics system)
        super.update(deltaTime);

        // Stop falling when on ground (simple ground check)
        if (this.isGrounded) {
            this.vy = 0;
        }
    }

    collect() {
        this.isCollected = true;
        console.log(`✨ ${this.name} collected!`);
    }

    render(ctx) {
        if (this.isCollected) return;

        ctx.save();

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2 + Math.sin(this.floatOffset) * 5;

        // Glow effect
        ctx.shadowBlur = 20 + this.glowIntensity * 15;
        ctx.shadowColor = this.glowColor;

        // Outer glow circle
        ctx.globalAlpha = 0.3 + this.glowIntensity * 0.2;
        ctx.fillStyle = this.glowColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20 + this.glowIntensity * 5, 0, Math.PI * 2);
        ctx.fill();

        // Main shard (diamond shape with rotation)
        ctx.globalAlpha = 1.0;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotationAngle);

        // Create gradient for shard
        const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, 15);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, this.glowColor);

        ctx.fillStyle = gradient;

        // Diamond shape
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(10, 0);
        ctx.lineTo(0, 15);
        ctx.lineTo(-10, 0);
        ctx.closePath();
        ctx.fill();

        // Inner crystal facets
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();

        // Element symbol in center
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#000000';

        const symbol = this.getElementSymbol();
        ctx.fillText(symbol, 0, 0);

        ctx.restore();

        // Floating particles around shard
        this.renderParticles(ctx, centerX, centerY);
    }

    getElementSymbol() {
        switch (this.elementType) {
            case 'acid': return '☣';
            case 'fire': return '🔥';
            case 'ice': return '❄';
            case 'lightning': return '⚡';
            case 'water': return '💧';
            case 'void': return '🌀';
            default: return '?';
        }
    }

    renderParticles(ctx, centerX, centerY) {
        ctx.save();

        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + this.rotationAngle * 0.5;
            const distance = 25 + Math.sin(Date.now() / 500 + i) * 5;
            const px = centerX + Math.cos(angle) * distance;
            const py = centerY + Math.sin(angle) * distance;

            ctx.globalAlpha = 0.4 + Math.sin(Date.now() / 300 + i) * 0.3;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
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
