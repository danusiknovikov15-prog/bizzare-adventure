// Elite Enemy - stronger version with more HP and damage
import { Enemy } from './Enemy.js';

export class EliteEnemy extends Enemy {
    constructor(x, y) {
        // Call parent constructor - Enemy expects (x, y) but internally calls Entity(x, y, width, height)
        super(x, y);

        // Override size AFTER super() call
        this.width = 56; // Normal: 48
        this.height = 70; // Normal: 60

        // Elite stats
        this.maxHealth = 50; // 50 HP (normal enemy has 15)
        this.health = this.maxHealth;
        this.damage = 10; // 10 damage (normal enemy has 1)

        // Elite visual (golden color)
        this.color = '#FFD700'; // Gold
        this.eliteGlow = 0; // For glow animation

        console.log(`Elite Enemy spawned! HP: 50, Damage: 10, Size: ${this.width}x${this.height}`);
    }

    update(deltaTime) {
        if (!this.isAlive) return;

        // Call parent update (Enemy.update)
        super.update(deltaTime);

        // Animate elite glow
        this.eliteGlow += deltaTime * 3;
    }

    // Override getBounds to ensure correct size
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

    // Override takeDamage to add logging
    takeDamage(amount) {
        console.log(`👑 Elite Enemy taking ${amount} damage! HP before: ${this.health}/${this.maxHealth}`);
        super.takeDamage(amount);
        console.log(`👑 Elite Enemy HP after: ${this.health}/${this.maxHealth}, Alive: ${this.isAlive}`);
    }

    // Elite enemies use parent Enemy render but with custom elite tag
    render(ctx) {
        // Call parent render (Enemy's render method)
        super.render(ctx);

        // Add ELITE tag above health bar
        if (this.isAlive) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeText('ELITE', this.x + this.width / 2, this.y - 20);
            ctx.fillText('ELITE', this.x + this.width / 2, this.y - 20);
        }
    }
}
