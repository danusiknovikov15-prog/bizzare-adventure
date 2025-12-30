// Collision detection system using AABB (Axis-Aligned Bounding Box)
export class CollisionDetector {
    constructor() {
        console.log('CollisionDetector initialized');
    }

    // Check AABB collision between two rectangles
    checkAABB(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    // Check collision between entity and platform
    checkPlatformCollision(entity, platform) {
        const entityBounds = entity.getBounds();
        const platformBounds = platform.getBounds();

        return this.checkAABB(entityBounds, platformBounds);
    }

    // Check collisions with all platforms and return colliding ones
    checkAllPlatforms(entity, platforms) {
        const collisions = [];

        for (const platform of platforms) {
            if (this.checkPlatformCollision(entity, platform)) {
                collisions.push(platform);
            }
        }

        return collisions;
    }

    // Get collision side (useful for specific collision responses)
    getCollisionSide(entity, platform) {
        const entityBounds = entity.getBounds();
        const platformBounds = platform.getBounds();

        const overlapLeft = entityBounds.right - platformBounds.left;
        const overlapRight = platformBounds.right - entityBounds.left;
        const overlapTop = entityBounds.bottom - platformBounds.top;
        const overlapBottom = platformBounds.bottom - entityBounds.top;

        // Find minimum overlap
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapTop) {
            return 'top'; // Entity is above platform
        } else if (minOverlap === overlapBottom) {
            return 'bottom'; // Entity is below platform
        } else if (minOverlap === overlapLeft) {
            return 'left'; // Entity is to the left
        } else {
            return 'right'; // Entity is to the right
        }
    }

    // Get penetration depth for collision resolution
    getPenetrationDepth(entity, platform) {
        const entityBounds = entity.getBounds();
        const platformBounds = platform.getBounds();

        const overlapX = Math.min(
            entityBounds.right - platformBounds.left,
            platformBounds.right - entityBounds.left
        );

        const overlapY = Math.min(
            entityBounds.bottom - platformBounds.top,
            platformBounds.bottom - entityBounds.top
        );

        return {
            x: overlapX,
            y: overlapY
        };
    }

    // Check if point is inside rectangle
    pointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }

    // Check circle collision (useful for round objects)
    checkCircleCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < circle1.radius + circle2.radius;
    }
}
