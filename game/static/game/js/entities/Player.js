// Player character with movement, jumping, and attacking
import { Entity } from './Entity.js';
import { Inventory } from '../systems/Inventory.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 32, 48); // 32x48 pixels

        // Movement properties
        this.moveSpeed = 200; // pixels per second
        this.jumpForce = -400; // negative = upward
        this.maxHorizontalSpeed = 300;

        // Health system
        this.baseMaxHealth = 50; // Base health without armor
        this.maxHealth = this.baseMaxHealth;
        this.health = this.maxHealth;
        this.isAlive = true;
        this.invincible = false;
        this.invincibilityTimer = 0;
        this.invincibilityDuration = 1.0; // 1 second of invincibility after hit

        // Equipment system
        this.hasArmor = false; // Is armor equipped
        this.armorHealthBonus = 15; // +15 HP from armor
        this.hasSword = false; // Is sword equipped
        this.swordDamageBonus = 3; // +3 damage from sword
        this.hasKey = false; // Is key collected
        this.hasSlingshot = false; // Is slingshot equipped
        this.hasEliteArmor = false; // Is elite armor with spikes equipped
        this.eliteArmorHealthBonus = 30; // +30 HP from elite armor
        this.armorThornsDamage = 0; // Thorns damage when wearing elite armor
        this.thornsCooldown = 1.0; // 1 second between thorns damage
        this.thornsTimer = 0; // Timer for thorns damage

        // Inventory system
        this.inventory = new Inventory(10); // 10 slots

        // Hotbar system
        this.hotbarSlots = 5; // Number of hotbar slots
        this.selectedSlot = 0; // Currently selected slot (0-4)

        // State
        this.facingRight = true;
        this.state = 'idle'; // idle, running, jumping, attacking

        // Attack properties
        this.isAttacking = false;
        this.attackDuration = 0.3; // seconds
        this.attackTimer = 0;
        this.attackDamage = 1; // damage to enemies (1 HP per hit)
        this.attackWidth = 50; // larger hitbox
        this.attackHeight = 40;
        this.hasHitThisAttack = false; // Track if we've hit something this attack

        // Slingshot/Projectile properties
        this.projectiles = []; // Array of active projectiles
        this.shootCooldown = 0.5; // 0.5 seconds between shots
        this.shootTimer = 0;
        this.projectileSpeed = 400; // pixels per second
        this.projectileDamage = 15; // Slingshot projectile damage

        // Input flags (will be set from outside)
        this.input = {
            left: false,
            right: false,
            jump: false,
            attack: false
        };

        // Jump control
        this.canJump = true;
        this.jumpPressed = false;

        // Visual (Pixel Art Gojo Satoru style)
        this.color = '#1a1a2e'; // Dark uniform
        this.hairColor = '#E8E8E8'; // White/silver hair
        this.blindfoldColor = '#000000'; // Black blindfold
        this.skinColor = '#FFD7B5'; // Skin tone

        // Animation properties
        this.animationTimer = 0;
        this.runFrame = 0; // 0-3 for run cycle
        this.runFrameDuration = 0.1; // Change frame every 0.1 seconds
        this.jumpSquashStretch = 1.0; // For Mario-style squash and stretch
        this.landingSquash = 0; // Squash amount when landing
        this.wasGrounded = true; // Track landing detection

        // Status effects system (for boss abilities)
        this.statusEffects = {
            acid: { active: false, damage: 2, timer: 0, duration: 5.0 },
            slow: { active: false, multiplier: 0.5, timer: 0, duration: 3.0 },
            freeze: { active: false, timer: 0, duration: 1.5 },
            knockback: { active: false, forceX: 0, forceY: 0 }
        };

        // Status effect tick timers
        this.acidTickTimer = 0;
        this.fireDamageTimer = 0;
        this.poolHealTimer = 0;
        this.freezeHitCount = 0; // Track hits for ice boss freeze mechanic
    }

    update(deltaTime) {
        if (!this.isAlive) return;

        // Update invincibility
        if (this.invincibilityTimer > 0) {
            this.invincibilityTimer -= deltaTime;
            if (this.invincibilityTimer <= 0) {
                this.invincible = false;
            }
        }

        // Update shoot timer
        if (this.shootTimer > 0) {
            this.shootTimer -= deltaTime;
        }

        // Update thorns timer
        if (this.thornsTimer > 0) {
            this.thornsTimer -= deltaTime;
        }

        // Update status effects
        this.updateStatusEffects(deltaTime);

        // Handle input
        this.handleMovement(deltaTime);
        this.handleJump();
        this.handleAttack(deltaTime);

        // Update projectiles
        this.updateProjectiles(deltaTime);

        // Update state
        this.updateState();

        // Update animations
        this.updateAnimations(deltaTime);

        // Call parent update (applies velocity)
        super.update(deltaTime);

        // Cap horizontal speed
        if (Math.abs(this.vx) > this.maxHorizontalSpeed) {
            this.vx = Math.sign(this.vx) * this.maxHorizontalSpeed;
        }
    }

    handleMovement(deltaTime) {
        // Can't move while frozen
        if (this.statusEffects.freeze.active) {
            this.vx = 0;
            return;
        }

        if (this.isAttacking) return; // Can't move while attacking

        // Calculate movement speed with slow effect
        let currentMoveSpeed = this.moveSpeed;
        if (this.statusEffects.slow.active) {
            currentMoveSpeed *= this.statusEffects.slow.multiplier;
        }

        // Horizontal movement
        if (this.input.left) {
            this.vx = -currentMoveSpeed;
            this.facingRight = false;
        } else if (this.input.right) {
            this.vx = currentMoveSpeed;
            this.facingRight = true;
        } else {
            // Apply friction when no input
            this.vx *= 0.8;
            if (Math.abs(this.vx) < 10) {
                this.vx = 0;
            }
        }
    }

    handleJump() {
        // Jump only when grounded and jump button is pressed
        if (this.input.jump && this.isGrounded && this.canJump && !this.jumpPressed) {
            this.vy = this.jumpForce;
            this.canJump = false;
            this.jumpPressed = true;
            console.log('Player jumped!');
        }

        // Reset jump when button is released
        if (!this.input.jump) {
            this.jumpPressed = false;
        }

        // Allow jumping again when grounded
        if (this.isGrounded) {
            this.canJump = true;
        }
    }

    handleAttack(deltaTime) {
        // If slingshot is equipped, shoot projectile instead of melee
        if (this.hasSlingshot) {
            if (this.input.attack && this.shootTimer <= 0) {
                console.log('🏹 Slingshot attack triggered!');
                this.shootProjectile();
                this.shootTimer = this.shootCooldown;
            }
            return;
        }

        // Normal melee attack
        if (Math.random() < 0.01) { // Log 1% of the time
            console.log(`Attack input check: input.attack=${this.input.attack}, isAttacking=${this.isAttacking}, attackTimer=${this.attackTimer.toFixed(2)}`);
        }
        if (this.input.attack && !this.isAttacking && this.attackTimer <= 0) {
            this.isAttacking = true;
            this.attackTimer = this.attackDuration;
            this.hasHitThisAttack = false; // Reset hit tracking
            this.vx *= 0.5; // Slow down during attack
            console.log(`⚔️ Player attacked! attackDamage=${this.attackDamage}, facingRight=${this.facingRight}`);
        }

        // Update attack timer
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
                this.hasHitThisAttack = false;
            }
        }
    }

    updateState() {
        if (this.isAttacking) {
            this.state = 'attacking';
        } else if (!this.isGrounded) {
            this.state = 'jumping';
        } else if (Math.abs(this.vx) > 10) {
            this.state = 'running';
        } else {
            this.state = 'idle';
        }
    }

    updateAnimations(deltaTime) {
        // === SILKSONG-STYLE RUNNING ANIMATION ===
        if (this.state === 'running') {
            // Update animation timer
            this.animationTimer += deltaTime;

            // Cycle through run frames
            if (this.animationTimer >= this.runFrameDuration) {
                this.animationTimer = 0;
                this.runFrame = (this.runFrame + 1) % 4; // 4-frame run cycle (0, 1, 2, 3)
            }
        } else {
            // Reset run animation when not running
            this.runFrame = 0;
            this.animationTimer = 0;
        }

        // === MARIO-STYLE JUMP SQUASH AND STRETCH ===
        // Detect landing (transition from air to ground)
        if (!this.wasGrounded && this.isGrounded) {
            // Just landed!
            this.landingSquash = 0.3; // Squash down on landing
        }

        // Decay landing squash over time
        if (this.landingSquash > 0) {
            this.landingSquash -= deltaTime * 2.5; // Decay in 0.12 seconds
            if (this.landingSquash < 0) {
                this.landingSquash = 0;
            }
        }

        // Calculate squash/stretch based on vertical velocity
        if (!this.isGrounded) {
            if (this.vy < -150) {
                // Jumping up - stretch vertically
                this.jumpSquashStretch = 1.15; // 15% taller
            } else if (this.vy > 150) {
                // Falling down - stretch vertically
                this.jumpSquashStretch = 1.1; // 10% taller
            } else {
                // Mid-air transition
                this.jumpSquashStretch = 1.0;
            }
        } else {
            // Grounded
            if (this.landingSquash > 0) {
                // Squash down on landing
                this.jumpSquashStretch = 1.0 - this.landingSquash; // 0.7 = squashed
            } else {
                // Normal
                this.jumpSquashStretch = 1.0;
            }
        }

        // Update grounded state tracker for next frame
        this.wasGrounded = this.isGrounded;
    }

    // Shoot a projectile from slingshot
    shootProjectile() {
        const projectileX = this.facingRight
            ? this.x + this.width
            : this.x - 8;

        const projectileY = this.y + this.height / 2 - 4;

        const projectile = {
            x: projectileX,
            y: projectileY,
            vx: this.facingRight ? this.projectileSpeed : -this.projectileSpeed,
            vy: 0,
            radius: 4,
            damage: this.projectileDamage,
            lifetime: 3.0, // 3 seconds
            hasHit: false
        };

        this.projectiles.push(projectile);
        console.log(`🎯 Player shot projectile! Position: (${projectileX}, ${projectileY}), Direction: ${this.facingRight ? 'RIGHT' : 'LEFT'}, Total projectiles: ${this.projectiles.length}`);
    }

    // Update all active projectiles
    updateProjectiles(deltaTime) {
        this.projectiles = this.projectiles.filter(proj => {
            // Update position
            proj.x += proj.vx * deltaTime;
            proj.y += proj.vy * deltaTime;

            // Update lifetime
            proj.lifetime -= deltaTime;

            // Remove if lifetime expired or already hit
            return proj.lifetime > 0 && !proj.hasHit;
        });
    }

    // Get attack hitbox (larger than player)
    getAttackHitbox() {
        if (!this.isAttacking) return null;

        const attackX = this.facingRight
            ? this.x + this.width - 10
            : this.x - this.attackWidth + 10;

        return {
            x: attackX,
            y: this.y + 4,
            width: this.attackWidth,
            height: this.attackHeight
        };
    }

    // Take damage from enemy
    takeDamage(amount) {
        if (!this.isAlive || this.invincible) return false;

        this.health -= amount;
        this.invincible = true;
        this.invincibilityTimer = this.invincibilityDuration;

        console.log(`Player took ${amount} damage! Health: ${this.health}/${this.maxHealth}`);

        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }

        return true; // Damage was applied
    }

    // Heal player
    heal(amount) {
        if (!this.isAlive) return;

        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        console.log(`Player healed ${amount} HP! Health: ${this.health}/${this.maxHealth}`);
    }

    // Use health potion from inventory
    useHealthPotion() {
        if (!this.isAlive) return false;

        if (this.inventory.hasItem('healthPotion')) {
            this.inventory.removeItem('healthPotion', 1);
            this.heal(10); // Heal 10 HP
            console.log('Used health potion from inventory!');
            return true;
        } else {
            console.log('No health potions in inventory');
            return false;
        }
    }

    // Select hotbar slot (0-4)
    selectHotbarSlot(slotIndex) {
        if (slotIndex >= 0 && slotIndex < this.hotbarSlots) {
            this.selectedSlot = slotIndex;
            console.log(`Selected hotbar slot ${slotIndex + 1}`);
        }
    }

    // Use item in currently selected hotbar slot
    useHotbarItem() {
        if (!this.isAlive) return false;

        // Slot 0: Health Potions
        if (this.selectedSlot === 0) {
            return this.useHealthPotion();
        }

        // Slot 1: Sword (equipped item, can't be "used")
        if (this.selectedSlot === 1) {
            console.log('Sword is already equipped!');
            return false;
        }

        // Empty slot or other slots
        console.log('No usable item in this slot');
        return false;
    }

    // Equip armor
    equipArmor() {
        if (this.hasArmor) {
            console.log('Armor already equipped!');
            return false;
        }

        this.hasArmor = true;

        // Increase max health
        this.maxHealth = this.baseMaxHealth + this.armorHealthBonus;

        // Heal to new max health (or keep current health if higher)
        if (this.health < this.maxHealth) {
            this.health = this.maxHealth;
        }

        console.log(`Armor equipped! Max HP increased to ${this.maxHealth}`);
        return true;
    }

    // Unequip armor (for potential future use)
    unequipArmor() {
        if (!this.hasArmor) return false;

        this.hasArmor = false;
        this.maxHealth = this.baseMaxHealth;

        // Adjust health if over new max
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        console.log(`Armor unequipped. Max HP: ${this.maxHealth}`);
        return true;
    }

    // Equip sword
    equipSword() {
        if (this.hasSword) {
            console.log('Sword already equipped!');
            return false;
        }

        this.hasSword = true;
        this.attackDamage = 1 + this.swordDamageBonus; // Base 1 + 3 from sword = 4 total

        console.log(`Sword equipped! Damage increased to ${this.attackDamage}`);
        return true;
    }

    // Equip enemy sword (10 damage)
    equipEnemySword() {
        this.hasSword = true;
        this.swordDamageBonus = 9; // 1 base + 9 = 10 total damage
        this.attackDamage = 1 + this.swordDamageBonus;

        console.log(`Enemy Sword equipped! Damage: ${this.attackDamage}`);
        return true;
    }

    // Equip slingshot (15 damage ranged)
    equipSlingshot() {
        this.hasSlingshot = true; // Enable ranged attacks
        this.projectileDamage = 15; // Projectile damage

        console.log(`🏹 Slingshot equipped! Ranged damage: ${this.projectileDamage}, hasSlingshot: ${this.hasSlingshot}`);
        return true;
    }

    // Equip elite armor (+30 HP, thorns damage)
    equipEliteArmor() {
        if (this.hasEliteArmor) {
            console.log('Elite Armor already equipped!');
            return false;
        }

        this.hasEliteArmor = true;
        this.hasArmor = true; // Elite armor counts as armor
        this.armorThornsDamage = 1; // 1 damage per second to touching enemies

        // Increase max health by 30
        this.maxHealth = this.baseMaxHealth + this.eliteArmorHealthBonus;

        // Heal to new max health
        if (this.health < this.maxHealth) {
            this.health = this.maxHealth;
        }

        console.log(`⚔️ Elite Armor with Spikes equipped! Max HP: ${this.maxHealth}, Thorns: ${this.armorThornsDamage}/sec`);
        return true;
    }

    // Equip elite sword (20 damage)
    equipEliteSword() {
        this.hasSword = true;
        this.swordDamageBonus = 19; // 1 base + 19 = 20 total damage
        this.attackDamage = 1 + this.swordDamageBonus;

        console.log(`👑 Elite Sword equipped! Damage: ${this.attackDamage}`);
        return true;
    }

    // Unequip sword (for potential future use)
    unequipSword() {
        if (!this.hasSword) return false;

        this.hasSword = false;
        this.attackDamage = 1; // Reset to base damage

        console.log(`Sword unequipped. Damage: ${this.attackDamage}`);
        return true;
    }

    // Collect key
    collectKey() {
        if (this.hasKey) {
            console.log('Key already collected!');
            return false;
        }

        this.hasKey = true;
        console.log('🗝️ KEY COLLECTED! You can now open the door!');
        return true;
    }

    // Use key (to open door)
    useKey() {
        if (!this.hasKey) {
            console.log('No key in inventory!');
            return false;
        }

        this.hasKey = false;
        console.log('🚪 Key used to open door!');
        return true;
    }

    // Player death
    die() {
        this.isAlive = false;
        console.log('Player died!');
    }

    // Reset player (for respawn)
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.health = this.maxHealth;
        this.isAlive = true;
        this.invincible = false;
        this.invincibilityTimer = 0;
        this.isAttacking = false;
        this.attackTimer = 0;
    }

    render(ctx) {
        if (!this.isAlive) {
            // Render dead player
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#666';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
            return;
        }

        ctx.save();

        // Flicker when invincible
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // === MARIO-STYLE SQUASH AND STRETCH TRANSFORM ===
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Move to center, apply squash/stretch, move back
        ctx.translate(centerX, centerY);

        // Squash vertically = wider horizontally (preserve volume)
        const horizontalScale = 1.0 / Math.sqrt(this.jumpSquashStretch);
        const verticalScale = this.jumpSquashStretch;

        ctx.scale(horizontalScale, verticalScale);
        ctx.translate(-centerX, -centerY);

        // Flip horizontally if facing left
        if (!this.facingRight) {
            ctx.translate(this.x + this.width / 2, this.y);
            ctx.scale(-1, 1);
            ctx.translate(-(this.x + this.width / 2), -this.y);
        }

        // === FUNKO POP GOJO SATORU STYLE ===

        // === SILKSONG-STYLE RUN ANIMATION OFFSETS ===
        let leftLegOffset = 0;
        let rightLegOffset = 0;
        let leftArmOffset = 0;
        let rightArmOffset = 0;

        if (this.state === 'running') {
            switch (this.runFrame) {
                case 0:
                    leftLegOffset = -1;
                    rightLegOffset = 1;
                    leftArmOffset = 1;
                    rightArmOffset = -1;
                    break;
                case 1:
                    leftLegOffset = 0;
                    rightLegOffset = 0;
                    leftArmOffset = 0;
                    rightArmOffset = 0;
                    break;
                case 2:
                    leftLegOffset = 1;
                    rightLegOffset = -1;
                    leftArmOffset = -1;
                    rightArmOffset = 1;
                    break;
                case 3:
                    leftLegOffset = 0;
                    rightLegOffset = 0;
                    leftArmOffset = 0;
                    rightArmOffset = 0;
                    break;
            }
        }

        // === TINY LEGS (Funko Pop style - very small) ===
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(this.x + 11, this.y + 40 + leftLegOffset, 4, 6); // Left leg
        ctx.fillRect(this.x + 17, this.y + 40 + rightLegOffset, 4, 6); // Right leg

        // Tiny shoes
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 11, this.y + 45 + leftLegOffset, 5, 3);
        ctx.fillRect(this.x + 16, this.y + 45 + rightLegOffset, 5, 3);

        // === SMALL BODY (Funko Pop proportions - tiny body) ===
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 10, this.y + 28, 12, 12);

        // White collar
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + 13, this.y + 29, 6, 2);

        // === TINY ARMS (Funko Pop - stubby arms) ===
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 6, this.y + 30 + leftArmOffset, 4, 6); // Left arm
        ctx.fillRect(this.x + 22, this.y + 30 + rightArmOffset, 4, 6); // Right arm

        // Small hands
        ctx.fillStyle = this.skinColor;
        ctx.fillRect(this.x + 6, this.y + 35 + leftArmOffset, 3, 3);
        ctx.fillRect(this.x + 23, this.y + 35 + rightArmOffset, 3, 3);

        // === MASSIVE HEAD (Funko Pop - oversized head!) ===
        // Head outline (rounded square)
        ctx.fillStyle = this.skinColor;
        ctx.fillRect(this.x + 7, this.y + 4, 18, 20); // Main head
        ctx.fillRect(this.x + 8, this.y + 3, 16, 1); // Top round
        ctx.fillRect(this.x + 8, this.y + 24, 16, 1); // Bottom round
        ctx.fillRect(this.x + 6, this.y + 6, 2, 16); // Left round
        ctx.fillRect(this.x + 24, this.y + 6, 2, 16); // Right round

        // === HAIR (Spiky white Gojo hair - Funko style) ===
        ctx.fillStyle = this.hairColor;

        // Hair base on top of head
        ctx.fillRect(this.x + 6, this.y - 2, 20, 8);

        // Funko-style hair spikes (simple and bold)
        ctx.fillRect(this.x + 8, this.y - 4, 4, 2); // Left spike
        ctx.fillRect(this.x + 13, this.y - 5, 6, 3); // Center spike (biggest)
        ctx.fillRect(this.x + 20, this.y - 4, 4, 2); // Right spike

        // Side hair tufts
        ctx.fillRect(this.x + 5, this.y + 5, 2, 6);
        ctx.fillRect(this.x + 25, this.y + 5, 2, 6);

        // Hair highlights (bright white)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + 14, this.y - 3, 4, 1);
        ctx.fillRect(this.x + 8, this.y + 1, 2, 1);

        // === BLINDFOLD (Black - Funko style) ===
        ctx.fillStyle = this.blindfoldColor;
        ctx.fillRect(this.x + 8, this.y + 12, 16, 5);

        // Blindfold fabric lines
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(this.x + 9, this.y + 13, 3, 1);
        ctx.fillRect(this.x + 13, this.y + 13, 3, 1);
        ctx.fillRect(this.x + 17, this.y + 13, 3, 1);
        ctx.fillRect(this.x + 10, this.y + 15, 2, 1);
        ctx.fillRect(this.x + 14, this.y + 15, 2, 1);
        ctx.fillRect(this.x + 18, this.y + 15, 2, 1);

        // === CUTE FUNKO SMILE ===
        ctx.fillStyle = '#FF9999';
        ctx.fillRect(this.x + 12, this.y + 20, 8, 2); // Wide smile

        // Smile curve details
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(this.x + 11, this.y + 21, 1, 1);
        ctx.fillRect(this.x + 20, this.y + 21, 1, 1);

        // Armor visual overlay (if equipped) - Funko Pop style
        if (this.hasArmor) {
            // Silver armor chest (small, Funko proportions)
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(this.x + 10, this.y + 29, 12, 10);

            // Shoulder pads (cute and small)
            ctx.fillRect(this.x + 6, this.y + 30, 4, 5);
            ctx.fillRect(this.x + 22, this.y + 30, 4, 5);

            // Armor shine (Funko glossy look)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x + 12, this.y + 31, 3, 2);
            ctx.fillRect(this.x + 7, this.y + 31, 1, 1);
            ctx.fillRect(this.x + 23, this.y + 31, 1, 1);

            // Blue energy glow (Gojo's power - Funko style)
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#00FFFF';
            ctx.fillRect(this.x + 8, this.y + 27, 16, 14);
            ctx.globalAlpha = 1.0;
        }

        ctx.restore();

        // Attack hitbox - Gojo's Blue technique style
        if (this.isAttacking) {
            const hitbox = this.getAttackHitbox();

            // Blue cursed energy effect
            ctx.fillStyle = 'rgba(0, 191, 255, 0.5)';
            ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);

            // Energy particles/aura
            ctx.fillStyle = 'rgba(135, 206, 250, 0.7)';
            ctx.fillRect(hitbox.x + 5, hitbox.y + 5, hitbox.width - 10, hitbox.height - 10);

            // Attack energy border (bright cyan)
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 3;
            ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);

            // Inner glow
            ctx.strokeStyle = '#87CEEB';
            ctx.lineWidth = 1;
            ctx.strokeRect(hitbox.x + 3, hitbox.y + 3, hitbox.width - 6, hitbox.height - 6);
        }

        // Health bar above player
        const barWidth = 40;
        const barHeight = 5;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 12;

        // Background (dark red)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health (gradient from green to red)
        const healthPercent = this.health / this.maxHealth;
        const healthWidth = healthPercent * barWidth;

        if (healthPercent > 0.5) {
            ctx.fillStyle = '#00FF00';
        } else if (healthPercent > 0.25) {
            ctx.fillStyle = '#FFFF00';
        } else {
            ctx.fillStyle = '#FF0000';
        }
        ctx.fillRect(barX, barY, healthWidth, barHeight);

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // State text (Gojo style with cyan glow)
        ctx.fillStyle = '#00FFFF';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        const stateText = this.hasSlingshot ? `${this.state} (${this.projectiles.length} proj)` : this.state;
        ctx.strokeText(stateText, this.x + this.width / 2, this.y - 20);
        ctx.fillText(stateText, this.x + this.width / 2, this.y - 20);

        // Render slingshot projectiles
        for (const proj of this.projectiles) {
            ctx.save();

            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#8B4513';

            // Stone projectile (gray)
            ctx.fillStyle = '#696969';
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
            ctx.fill();

            // Stone highlight
            ctx.fillStyle = '#A9A9A9';
            ctx.beginPath();
            ctx.arc(proj.x - 1, proj.y - 1, proj.radius / 2, 0, Math.PI * 2);
            ctx.fill();

            // Motion trail effect
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(139, 69, 19, 0.3)'; // Brown trail
            for (let i = 1; i <= 3; i++) {
                const trailX = proj.x - (proj.vx > 0 ? i * 3 : -i * 3);
                ctx.fillRect(trailX, proj.y - 1, 2, 2);
            }

            ctx.restore();
        }
    }

    // Update status effects from boss abilities
    updateStatusEffects(deltaTime) {
        // Acid damage over time
        if (this.statusEffects.acid.active) {
            this.statusEffects.acid.timer -= deltaTime;

            // Apply damage every second
            this.acidTickTimer -= deltaTime;
            if (this.acidTickTimer <= 0) {
                this.takeDamage(this.statusEffects.acid.damage);
                this.acidTickTimer = 1.0; // Next tick in 1 second
                console.log(`🧪 Acid damage: ${this.statusEffects.acid.damage}`);
            }

            if (this.statusEffects.acid.timer <= 0) {
                this.statusEffects.acid.active = false;
                console.log('✓ Acid effect expired');
            }
        }

        // Slow effect
        if (this.statusEffects.slow.active) {
            this.statusEffects.slow.timer -= deltaTime;
            if (this.statusEffects.slow.timer <= 0) {
                this.statusEffects.slow.active = false;
                console.log('✓ Slow effect expired');
            }
        }

        // Freeze effect
        if (this.statusEffects.freeze.active) {
            this.statusEffects.freeze.timer -= deltaTime;
            if (this.statusEffects.freeze.timer <= 0) {
                this.statusEffects.freeze.active = false;
                console.log('✓ Freeze effect expired');
            }
        }
    }

    // Helper method to set input
    setInput(direction, value) {
        if (this.input.hasOwnProperty(direction)) {
            this.input[direction] = value;
        }
    }
}
