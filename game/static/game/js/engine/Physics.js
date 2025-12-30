// Physics engine for gravity, velocity, and collision resolution
export class Physics {
    constructor(gravity = 800) {
        this.gravity = gravity; // pixels per second squared (800 is good for platformers)
        this.maxFallSpeed = 600; // terminal velocity (pixels per second)
        this.groundFriction = 0.8; // friction when on ground
        this.airFriction = 0.98; // less friction in air

        console.log(`Physics initialized: gravity=${this.gravity}, maxFallSpeed=${this.maxFallSpeed}`);
    }

    // Apply gravity to an entity
    applyGravity(entity, deltaTime) {
        if (entity.isStatic) return;

        // Apply gravity force
        entity.vy += this.gravity * deltaTime;

        // Cap fall speed
        if (entity.vy > this.maxFallSpeed) {
            entity.vy = this.maxFallSpeed;
        }
    }

    // Update entity position based on velocity
    applyVelocity(entity, deltaTime) {
        if (entity.isStatic) return;

        entity.x += entity.vx * deltaTime;
        entity.y += entity.vy * deltaTime;
    }

    // Apply friction (slows down horizontal movement)
    applyFriction(entity, deltaTime) {
        if (entity.isStatic) return;

        const friction = entity.isGrounded ? this.groundFriction : this.airFriction;

        // Apply friction to horizontal velocity
        entity.vx *= friction;

        // Stop very small movements to prevent jitter
        if (Math.abs(entity.vx) < 0.1) {
            entity.vx = 0;
        }
    }

    // Check if entity is on ground (touching any platform from above)
    checkGrounded(entity, platforms) {
        entity.isGrounded = false;

        for (const platform of platforms) {
            const bounds = entity.getBounds();
            const platformBounds = platform.getBounds();

            // Check if entity is above platform and touching it
            const isAbove = bounds.bottom <= platformBounds.top + 5;
            const horizontalOverlap = bounds.right > platformBounds.left &&
                                     bounds.left < platformBounds.right;

            const verticalOverlap = bounds.bottom >= platformBounds.top &&
                                   bounds.bottom <= platformBounds.top + 10;

            if (horizontalOverlap && verticalOverlap && isAbove) {
                entity.isGrounded = true;
                return true;
            }
        }

        return false;
    }

    // Resolve collision between entity and platform
    resolveCollision(entity, platform) {
        if (entity.isStatic) return;

        const entityBounds = entity.getBounds();
        const platformBounds = platform.getBounds();

        // Calculate overlap on each axis
        const overlapLeft = entityBounds.right - platformBounds.left;
        const overlapRight = platformBounds.right - entityBounds.left;
        const overlapTop = entityBounds.bottom - platformBounds.top;
        const overlapBottom = platformBounds.bottom - entityBounds.top;

        // Find minimum overlap
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        // Resolve collision on the axis with smallest overlap
        if (minOverlapX < minOverlapY) {
            // Horizontal collision
            if (overlapLeft < overlapRight) {
                // Collision from left
                entity.x = platformBounds.left - entity.width;
            } else {
                // Collision from right
                entity.x = platformBounds.right;
            }
            entity.vx = 0;
        } else {
            // Vertical collision
            if (overlapTop < overlapBottom) {
                // Collision from top (entity landing on platform)
                entity.y = platformBounds.top - entity.height;
                entity.vy = 0;
                entity.isGrounded = true;
            } else {
                // Collision from bottom (entity hitting ceiling)
                entity.y = platformBounds.bottom;
                entity.vy = 0;
            }
        }
    }

    // Check and resolve collisions with all platforms
    handlePlatformCollisions(entity, platforms) {
        if (entity.isStatic) return;

        for (const platform of platforms) {
            if (entity.collidesWith(platform)) {
                this.resolveCollision(entity, platform);
            }
        }
    }

    // Update physics for all entities
    update(entities, platforms, deltaTime) {
        // Reset grounded state
        for (const entity of entities) {
            if (!entity.isStatic) {
                entity.isGrounded = false;
            }
        }

        // Apply physics to each entity
        for (const entity of entities) {
            if (entity.isStatic) continue;

            // Apply gravity
            this.applyGravity(entity, deltaTime);

            // Apply velocity
            this.applyVelocity(entity, deltaTime);

            // Check collisions with platforms
            this.handlePlatformCollisions(entity, platforms);

            // Check if grounded
            this.checkGrounded(entity, platforms);

            // Apply friction
            this.applyFriction(entity, deltaTime);
        }
    }
}
