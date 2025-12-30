// Base class for all game entities (player, platforms, enemies, etc.)
export class Entity {
    constructor(x, y, width, height) {
        // Position
        this.x = x;
        this.y = y;

        // Size
        this.width = width;
        this.height = height;

        // Velocity
        this.vx = 0; // horizontal velocity
        this.vy = 0; // vertical velocity

        // Physics properties
        this.isGrounded = false;
        this.isStatic = false; // Static entities don't move (like platforms)

        // Visual properties
        this.color = '#ffffff';
    }

    // Update entity state (to be overridden by subclasses)
    update(deltaTime) {
        if (!this.isStatic) {
            // Apply velocity
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
        }
    }

    // Render entity (to be overridden by subclasses)
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Get bounding box for collision detection
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    // Check collision with another entity (AABB collision)
    collidesWith(other) {
        const a = this.getBounds();
        const b = other.getBounds();

        return a.left < b.right &&
               a.right > b.left &&
               a.top < b.bottom &&
               a.bottom > b.top;
    }

    // Get the center position
    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }
}
