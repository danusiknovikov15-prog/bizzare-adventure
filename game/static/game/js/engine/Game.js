// Main game class that handles the game loop and coordinates all systems
export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Game state
        this.isRunning = false;
        this.isPaused = false;

        // Time management for fixed timestep
        this.lastTime = 0;
        this.accumulator = 0;
        this.fixedDeltaTime = 1000 / 60; // 60 FPS (in milliseconds)

        // FPS counter
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;

        // Game objects
        this.entities = [];
        this.platforms = [];

        // Physics system
        this.physics = null;

        // Renderer will be initialized later
        this.renderer = null;

        // Resize canvas to fill window
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        console.log('Game initialized');
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        console.log(`Canvas resized to ${this.canvas.width}x${this.canvas.height}`);
    }

    init() {
        console.log('Initializing game systems...');
        // Game initialization will be done here
        // For now, just mark as initialized
    }

    start() {
        if (this.isRunning) return;

        console.log('Starting game...');
        this.isRunning = true;
        this.lastTime = performance.now();
        this.lastFpsUpdate = this.lastTime;

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    stop() {
        console.log('Stopping game...');
        this.isRunning = false;
    }

    pause() {
        this.isPaused = !this.isPaused;
        console.log(this.isPaused ? 'Game paused' : 'Game resumed');
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Update FPS counter
        this.frameCount++;
        if (timestamp - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = timestamp;
        }

        // Fixed timestep update
        if (!this.isPaused) {
            this.accumulator += deltaTime;

            // Update game logic at fixed intervals
            while (this.accumulator >= this.fixedDeltaTime) {
                this.update(this.fixedDeltaTime / 1000); // Convert to seconds
                this.accumulator -= this.fixedDeltaTime;
            }
        }

        // Render always happens (even when paused)
        this.render();

        // Continue game loop
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(deltaTime) {
        // Update physics if available
        if (this.physics) {
            this.physics.update(this.entities, this.platforms, deltaTime);
        }

        // Update all entities
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime);
            }
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render platforms first (background layer)
        for (const platform of this.platforms) {
            if (platform.render) {
                platform.render(this.ctx);
            }
        }

        // Render all entities
        for (const entity of this.entities) {
            if (entity.render) {
                entity.render(this.ctx);
            }
        }

        // Render FPS counter (debug)
        this.renderDebugInfo();
    }

    renderDebugInfo() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
        this.ctx.fillText(`Entities: ${this.entities.length}`, 10, 40);
    }

    addEntity(entity) {
        this.entities.push(entity);
        console.log(`Added entity: ${entity.constructor.name}`);
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            console.log(`Removed entity: ${entity.constructor.name}`);
        }
    }

    addPlatform(platform) {
        this.platforms.push(platform);
        console.log(`Added platform at (${platform.x}, ${platform.y})`);
    }

    removePlatform(platform) {
        const index = this.platforms.indexOf(platform);
        if (index > -1) {
            this.platforms.splice(index, 1);
            console.log(`Removed platform`);
        }
    }
}
