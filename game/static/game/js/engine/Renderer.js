// Rendering system for drawing game objects
export class Renderer {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;

        // Camera for scrolling levels
        this.cameraX = 0;
        this.cameraY = 0;

        console.log('Renderer initialized');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    fillBackground(color = '#1a1a2e') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Render a simple rectangle (for entities without sprites)
    renderRect(x, y, width, height, color = '#fff') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x - this.cameraX,
            y - this.cameraY,
            width,
            height
        );
    }

    // Render rectangle with outline
    renderRectWithBorder(x, y, width, height, fillColor = '#fff', borderColor = '#000', borderWidth = 2) {
        // Fill
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(
            x - this.cameraX,
            y - this.cameraY,
            width,
            height
        );

        // Border
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderWidth;
        this.ctx.strokeRect(
            x - this.cameraX,
            y - this.cameraY,
            width,
            height
        );
    }

    // Render text
    renderText(text, x, y, color = '#fff', font = '16px Arial', align = 'left') {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    // Render circle
    renderCircle(x, y, radius, color = '#fff') {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(
            x - this.cameraX,
            y - this.cameraY,
            radius,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    // Set camera position
    setCamera(x, y) {
        this.cameraX = x;
        this.cameraY = y;
    }

    // Camera follows target (like player)
    followTarget(target, canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        this.cameraX = target.x - centerX;
        this.cameraY = target.y - centerY;

        // Optional: Clamp camera to level bounds
        // this.cameraX = Math.max(0, Math.min(this.cameraX, levelWidth - canvas.width));
        // this.cameraY = Math.max(0, Math.min(this.cameraY, levelHeight - canvas.height));
    }

    // Debug: Render hitbox
    renderHitbox(x, y, width, height, color = 'rgba(255, 0, 0, 0.3)') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x - this.cameraX,
            y - this.cameraY,
            width,
            height
        );

        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            x - this.cameraX,
            y - this.cameraY,
            width,
            height
        );
    }
}
