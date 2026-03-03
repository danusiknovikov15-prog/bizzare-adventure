import { Entity } from '../entities/Entity.js';

/**
 * RemotePlayer - Represents other players in multiplayer with interpolation
 */
export class RemotePlayer extends Entity {
    // Player slot colors
    static SLOT_COLORS = [
        { body: '#4a90d9', outline: '#2d5a8a' },  // Blue (slot 0)
        { body: '#d94a4a', outline: '#8a2d2d' },  // Red (slot 1)
        { body: '#4ad94a', outline: '#2d8a2d' },  // Green (slot 2)
        { body: '#d9d94a', outline: '#8a8a2d' },  // Yellow (slot 3)
    ];

    // Class skins
    static CLASS_SKINS = {
        'class_jedi': {
            body: '#5c4333',      // Brown robe
            outline: '#3a2a1a',
            hasLightsaber: true,
            lightsaberColor: '#7df9ff',
            glowingEyes: true,
            eyeColor: '#7df9ff'
        },
        'class_enemy_king': {
            body: '#4a1a1a',      // Dark red armor
            outline: '#2d0a0a',
            hasCrown: true,
            crownColor: '#8b0000',
            hasEvilSword: true,
            swordColor: '#ff3333',
            glowingEyes: true,
            eyeColor: '#ff0000',
            damageBonus: 1.2      // +20% damage
        },
        'class_chef': {
            body: '#ffffff',      // White chef coat
            outline: '#e0e0e0',
            hasChefHat: true,
            hatColor: '#ffffff',
            hasFryingPan: true,
            panColor: '#4a4a4a',
            attackSpeedBonus: 1.15  // +15% attack speed
        },
        'class_skibidi': {
            body: '#f5f5f5',       // Toilet white
            outline: '#c0c0c0',
            isToilet: true,
            hasToiletHead: true,
            jumpBonus: 1.3,       // +30% jump
            speedBonus: 1.25      // +25% speed
        },
        'class_sukuna': {
            body: '#e8d0c0',        // Skin tone with tattoos
            outline: '#1a1a1a',
            isSukuna: true,
            hasFourEyes: true,
            hasTattoos: true,
            hairColor: '#ffb6c1',   // Pink hair
            eyeColor: '#ff0044',    // Red eyes
            damageBonus: 1.5,       // +50% damage
            hasCleave: true
        },
        'class_boxer': {
            body: '#e8c4a0',        // Skin tone
            outline: '#8B4513',
            isBoxer: true,
            hasBoxingGloves: true,
            gloveColor: '#ff4444',  // Red gloves
            damageBonus: 1.25,      // +25% damage
            attackSpeedBonus: 1.2   // +20% attack speed
        }
    };

    constructor(x, y, playerId, playerSlot, username) {
        super(x, y, 40, 60);

        this.playerId = playerId;
        this.playerSlot = playerSlot;
        this.username = username;
        this.equippedClass = null;
        this.classSkin = null;

        // Interpolation
        this.targetX = x;
        this.targetY = y;
        this.interpolationSpeed = 0.15;

        // State from network
        this.health = 100;
        this.maxHealth = 100;
        this.facingRight = true;
        this.isGrounded = true;
        this.isAttacking = false;
        this.currentWeaponIndex = 0;
        this.currentAnimation = 'idle';
        this.velocityX = 0;
        this.velocityY = 0;

        // Visual state
        this.animationTime = 0;
        this.colors = RemotePlayer.SLOT_COLORS[playerSlot % 4];

        // Name tag
        this.showNameTag = true;
    }

    /**
     * Apply network state update
     */
    applyNetworkState(state) {
        this.targetX = state.x;
        this.targetY = state.y;
        this.velocityX = state.vx || 0;
        this.velocityY = state.vy || 0;
        this.health = state.hp;
        this.maxHealth = state.maxHp || 100;
        this.facingRight = state.facing === 1;
        this.isGrounded = state.grounded === 1;
        this.isAttacking = state.attacking === 1;
        this.currentWeaponIndex = state.weapon || 0;
        this.currentAnimation = state.anim || 'idle';

        // Update class skin if received
        if (state.equippedClass && state.equippedClass !== this.equippedClass) {
            this.equippedClass = state.equippedClass;
            if (RemotePlayer.CLASS_SKINS[state.equippedClass]) {
                this.classSkin = RemotePlayer.CLASS_SKINS[state.equippedClass];
                this.colors = { body: this.classSkin.body, outline: this.classSkin.outline };
            }
        }
    }

    /**
     * Update - interpolate position
     */
    update(deltaTime) {
        // Interpolate position
        this.x += (this.targetX - this.x) * this.interpolationSpeed;
        this.y += (this.targetY - this.y) * this.interpolationSpeed;

        // Update animation
        this.animationTime += deltaTime;
    }

    /**
     * Render the remote player
     */
    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();
        ctx.translate(screenX + this.width / 2, screenY + this.height / 2);

        // Flip if facing left
        if (!this.facingRight) {
            ctx.scale(-1, 1);
        }

        // Draw body
        this.renderBody(ctx);

        ctx.restore();

        // Draw name tag and health bar (not flipped)
        if (this.showNameTag) {
            this.renderNameTag(ctx, screenX, screenY);
        }
        this.renderHealthBar(ctx, screenX, screenY);
    }

    /**
     * Render player body
     */
    renderBody(ctx) {
        const w = this.width;
        const h = this.height;

        // Body
        ctx.fillStyle = this.colors.body;
        ctx.strokeStyle = this.colors.outline;
        ctx.lineWidth = 2;

        // Main body (rectangle with rounded top)
        ctx.beginPath();
        ctx.roundRect(-w/2 + 5, -h/2 + 15, w - 10, h - 25, 5);
        ctx.fill();
        ctx.stroke();

        // Head - Jedi has hood
        if (this.classSkin) {
            // Hood
            ctx.beginPath();
            ctx.arc(0, -h/2 + 12, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Inner shadow
            ctx.fillStyle = '#1a0a00';
            ctx.beginPath();
            ctx.arc(0, -h/2 + 14, 10, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(0, -h/2 + 12, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // Eyes - Jedi has glowing eyes
        if (this.classSkin && this.classSkin.glowingEyes) {
            ctx.fillStyle = this.classSkin.eyeColor;
            ctx.shadowColor = this.classSkin.eyeColor;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(-3, -h/2 + 12, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(5, -h/2 + 12, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(3, -h/2 + 10, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(4, -h/2 + 10, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Legs animation
        const legOffset = this.isGrounded && Math.abs(this.velocityX) > 0.1
            ? Math.sin(this.animationTime * 10) * 5
            : 0;

        ctx.fillStyle = this.colors.body;
        ctx.strokeStyle = this.colors.outline;

        // Left leg
        ctx.beginPath();
        ctx.roundRect(-w/2 + 8, h/2 - 15 + legOffset, 8, 15, 2);
        ctx.fill();
        ctx.stroke();

        // Right leg
        ctx.beginPath();
        ctx.roundRect(w/2 - 16, h/2 - 15 - legOffset, 8, 15, 2);
        ctx.fill();
        ctx.stroke();

        // Arms
        const armAngle = this.isAttacking ? -Math.PI / 2 : Math.sin(this.animationTime * 5) * 0.2;

        ctx.save();
        ctx.translate(w/2 - 8, -h/2 + 25);
        ctx.rotate(armAngle);
        ctx.beginPath();
        ctx.roundRect(-3, 0, 6, 20, 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Weapon indicator
        this.renderWeapon(ctx, w, h);
    }

    /**
     * Render current weapon
     */
    renderWeapon(ctx, w, h) {
        const weaponX = w/2 - 5;
        const weaponY = -h/2 + 25;

        ctx.save();
        ctx.translate(weaponX, weaponY);

        if (this.isAttacking) {
            ctx.rotate(-Math.PI / 3);
        }

        // Jedi always has lightsaber
        if (this.classSkin && this.classSkin.hasLightsaber) {
            const saberColor = this.classSkin.lightsaberColor;

            // Handle - metallic body
            ctx.fillStyle = '#2a2a2a';
            ctx.fillRect(-3, -3, 6, 14);

            // Handle grip rings
            ctx.fillStyle = '#444';
            ctx.fillRect(-3, -1, 6, 1);
            ctx.fillRect(-3, 2, 6, 1);
            ctx.fillRect(-3, 5, 6, 1);
            ctx.fillRect(-3, 8, 6, 1);

            // Handle highlight
            ctx.fillStyle = '#666';
            ctx.fillRect(-2, -3, 1, 14);

            // Emitter shroud
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(-2, -6, 4, 4);

            // Activation button (red)
            ctx.fillStyle = '#ff3333';
            ctx.fillRect(2, 1, 2, 2);
            ctx.fillStyle = '#ff6666';
            ctx.fillRect(2, 1, 1, 1);

            // Blade with plasma glow
            const bladeY = -38;
            const bladeHeight = 32;

            // Outer glow
            ctx.shadowColor = saberColor;
            ctx.shadowBlur = 20;
            ctx.fillStyle = `rgba(125, 249, 255, 0.3)`;
            ctx.fillRect(-2, bladeY, 4, bladeHeight);

            // Main blade
            ctx.shadowBlur = 12;
            ctx.fillStyle = saberColor;
            ctx.fillRect(-1, bladeY, 2, bladeHeight);

            // Bright core
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-0.5, bladeY + 1, 1, bladeHeight - 2);

            // Blade tip
            ctx.fillStyle = saberColor;
            ctx.beginPath();
            ctx.arc(0, bladeY, 1, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            return;
        }

        switch (this.currentWeaponIndex) {
            case 0: // Fist - no weapon visible
                break;
            case 1: // Sword
                ctx.fillStyle = '#c0c0c0';
                ctx.strokeStyle = '#808080';
                ctx.beginPath();
                ctx.rect(0, 0, 4, 25);
                ctx.fill();
                ctx.stroke();
                // Handle
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(-1, -5, 6, 5);
                break;
            case 2: // Slingshot
                ctx.strokeStyle = '#8b4513';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-5, 15);
                ctx.moveTo(0, 0);
                ctx.lineTo(5, 15);
                ctx.stroke();
                // Rubber band
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-5, 15);
                ctx.quadraticCurveTo(0, 20, 5, 15);
                ctx.stroke();
                break;
        }

        ctx.restore();
    }

    /**
     * Render name tag above player
     */
    renderNameTag(ctx, screenX, screenY) {
        const tagY = screenY - 25;

        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';

        // Background
        const textWidth = ctx.measureText(this.username).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(
            screenX + this.width/2 - textWidth/2 - 4,
            tagY - 10,
            textWidth + 8,
            16
        );

        // Text
        ctx.fillStyle = this.colors.body;
        ctx.fillText(this.username, screenX + this.width/2, tagY);
    }

    /**
     * Render health bar
     */
    renderHealthBar(ctx, screenX, screenY) {
        const barWidth = 40;
        const barHeight = 5;
        const barX = screenX + (this.width - barWidth) / 2;
        const barY = screenY - 10;

        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.5 ? '#4a4' :
                           healthPercent > 0.25 ? '#aa4' : '#a44';
        ctx.fillStyle = healthColor;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    /**
     * Check if player is alive
     */
    isAlive() {
        return this.health > 0;
    }

    /**
     * Get collision box for PvP
     */
    getHitbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
