// Player character with movement, jumping, and attacking
// Version 10 - lightsaber weapon added
import { Entity } from './Entity.js';
import { Inventory } from '../systems/Inventory.js';

console.log('🎮 Player.js v10 loaded with lightsaber weapon');

export class Player extends Entity {
    // Player slot colors for multiplayer
    static SLOT_COLORS = [
        { body: '#4a90d9', outline: '#2d5a8a', hair: '#E8E8E8' },  // Blue (slot 0)
        { body: '#d94a4a', outline: '#8a2d2d', hair: '#FFD700' },  // Red (slot 1)
        { body: '#4ad94a', outline: '#2d8a2d', hair: '#8B4513' },  // Green (slot 2)
        { body: '#d9d94a', outline: '#8a8a2d', hair: '#000000' },  // Yellow (slot 3)
    ];

    constructor(x, y) {
        super(x, y, 32, 48); // 32x48 pixels

        // Multiplayer properties
        this.playerId = null;
        this.playerSlot = 0;
        this.username = '';
        this.slotColors = null; // Will be set if in multiplayer

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
        this.hasLightsaber = false; // Is lightsaber equipped
        this.lightsaberDamage = 25; // Lightsaber damage
        this.hasEliteArmor = false; // Is elite armor with spikes equipped
        this.eliteArmorHealthBonus = 30; // +30 HP from elite armor
        this.armorThornsDamage = 0; // Thorns damage when wearing elite armor
        this.thornsCooldown = 1.0; // 1 second between thorns damage
        this.thornsTimer = 0; // Timer for thorns damage
        this.hasTotem = false; // Totem of Undying - saves from death once
        this.hasUnoReverse = false; // UNO Reverse Card - reflects damage back

        // Inventory system
        this.inventory = new Inventory(10); // 10 slots

        // Hotbar system
        this.hotbarSlots = 10; // Number of hotbar slots (0=potions, 1=totem, 2=sword, 3=lightsaber, 4=slingshot, 5-9=shards)
        this.selectedSlot = 0; // Currently selected slot (0-9)

        // State
        this.facingRight = true;
        this.state = 'idle'; // idle, running, jumping, attacking

        // Attack properties
        this.isAttacking = false;
        this.attackDuration = 0.3; // seconds
        this.attackTimer = 0;
        this.baseAttackDamage = 1; // Base fist damage
        this.attackDamage = 1; // Current damage (calculated dynamically)
        this.attackWidth = 50; // larger hitbox
        this.attackHeight = 40;
        this.hasHitThisAttack = false; // Track if we've hit something this attack

        // Weapon damage values (used when weapon is selected in hotbar)
        this.weaponDamage = {
            'sword': 4,
            'evilSword': 5,
            'eliteSword': 6,
            'lightsaber': 8,
            'cleave': 100,  // Sukuna's cleave
            'boxingGlove': 5,  // Boxer's glove
            'fryingPan': 3,
            'fist': 1
        };

        // Finisher system
        this.isPerformingFinisher = false;
        this.finisherTarget = null;
        this.finisherProgress = 0;
        this.finisherDuration = 0.5; // seconds
        this.finisherType = null; // 'sword', 'fist', 'slingshot'

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

        // Visual (Pixel Art Gojo Satoru style) - default skin
        this.color = '#1a1a2e'; // Dark uniform
        this.hairColor = '#E8E8E8'; // White/silver hair
        this.blindfoldColor = '#000000'; // Black blindfold
        this.skinColor = '#FFD7B5'; // Skin tone

        // Current equipped skin
        this.equippedSkin = 'default';

        // Equipped title (displayed above player)
        this.equippedTitle = null;
        this.titleData = {
            'title_warrior': { icon: '⚔️', name: 'Warrior' },
            'title_legend': { icon: '⭐', name: 'Legend' },
            'title_champion': { icon: '🏆', name: 'Champion' },
            'title_godslayer': { icon: '💀', name: 'Godslayer' },
            'title_shadow': { icon: '🌑', name: 'Shadow' },
            'title_phoenix': { icon: '🔥', name: 'Phoenix' },
            'title_frost': { icon: '❄️', name: 'Frost' },
            'title_thunder': { icon: '⚡', name: 'Thunder' }
        };

        // Skin definitions
        this.skinStyles = {
            'default': {
                color: '#1a1a2e',
                hairColor: '#E8E8E8',
                blindfoldColor: '#000000',
                skinColor: '#FFD7B5',
                name: 'Default'
            },
            'skin_knight': {
                color: '#4a4a5e',
                hairColor: '#8B4513',
                blindfoldColor: '#C0C0C0',
                skinColor: '#FFD7B5',
                name: 'Knight',
                hasHelmet: true
            },
            'skin_ninja': {
                color: '#1a1a1a',
                hairColor: '#000000',
                blindfoldColor: '#8B0000',
                skinColor: '#FFD7B5',
                name: 'Ninja',
                hasMask: true
            },
            'skin_robot': {
                color: '#708090',
                hairColor: '#00FFFF',
                blindfoldColor: '#FF0000',
                skinColor: '#A9A9A9',
                name: 'Robot',
                isRobot: true
            },
            'skin_dragon': {
                color: '#8B0000',
                hairColor: '#FF4500',
                blindfoldColor: '#FFD700',
                skinColor: '#FF6347',
                name: 'Dragon',
                hasHorns: true
            }
        };

        // Animation properties
        this.animationTimer = 0;
        this.runFrame = 0; // 0-3 for run cycle
        this.runFrameDuration = 0.1; // Change frame every 0.1 seconds
        this.jumpSquashStretch = 1.0; // For Mario-style squash and stretch
        this.landingSquash = 0; // Squash amount when landing
        this.wasGrounded = true; // Track landing detection

        // Attack animation properties
        this.attackAnimationProgress = 0; // 0 to 1 progress through attack
        this.attackSwingAngle = 0; // Current angle of sword/arm swing
        this.attackTrailPoints = []; // Trail effect points for sword swing

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

        // Update finisher animation
        if (this.isPerformingFinisher) {
            this.finisherProgress += deltaTime / this.finisherDuration;
            if (this.finisherProgress >= 1) {
                this.finisherProgress = 1;
                this.isPerformingFinisher = false;
                this.finisherTarget = null;
                this.finisherType = null;
            }
            return; // Can't do anything else during finisher
        }

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
        if (this.statusEffects.freeze.active || this.isFrozen) {
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
        // Get current weapon from selected slot
        const currentWeapon = this.getCurrentWeapon();

        // If slingshot is SELECTED in hotbar, shoot projectile instead of melee
        if (this.hasSlingshot && currentWeapon === 'slingshot') {
            if (this.input.attack && this.shootTimer <= 0) {
                console.log('🏹 Slingshot attack triggered!');
                this.shootProjectile();
                this.shootTimer = this.shootCooldown;
            }
            return;
        }

        // Sukuna shoots cleave only when cleave is SELECTED in hotbar
        if (this.isSukuna && currentWeapon === 'cleave' && this.input.attack && this.shootTimer <= 0) {
            this.shootCleave();
            this.shootTimer = 0.5; // Faster than slingshot
        }

        // Normal melee attack
        if (Math.random() < 0.01) { // Log 1% of the time
            console.log(`Attack input check: input.attack=${this.input.attack}, isAttacking=${this.isAttacking}, attackTimer=${this.attackTimer.toFixed(2)}`);
        }
        if (this.input.attack && !this.isAttacking && this.attackTimer <= 0) {
            this.updateCurrentDamage(); // Calculate damage based on selected weapon
            this.isAttacking = true;
            this.attackTimer = this.attackDuration;
            this.hasHitThisAttack = false; // Reset hit tracking
            this.attackAnimationProgress = 0; // Start animation
            this.attackTrailPoints = []; // Clear trail
            this.vx *= 0.5; // Slow down during attack
            console.log(`⚔️ Player attacked! attackDamage=${this.attackDamage}, facingRight=${this.facingRight}`);
        }

        // Update attack timer and animation
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;

            // Update attack animation progress (0 to 1)
            this.attackAnimationProgress = 1 - (this.attackTimer / this.attackDuration);

            // Calculate swing angle based on progress
            // Swing from -45 degrees to +90 degrees (overhead to forward swing)
            if (this.attackAnimationProgress < 0.3) {
                // Wind-up phase (0-30%): arm goes back
                this.attackSwingAngle = -45 * (this.attackAnimationProgress / 0.3);
            } else if (this.attackAnimationProgress < 0.7) {
                // Swing phase (30-70%): fast forward swing
                const swingProgress = (this.attackAnimationProgress - 0.3) / 0.4;
                this.attackSwingAngle = -45 + (135 * swingProgress); // -45 to +90
            } else {
                // Follow-through phase (70-100%): slow down
                const followProgress = (this.attackAnimationProgress - 0.7) / 0.3;
                this.attackSwingAngle = 90 - (20 * followProgress); // 90 to 70
            }

            // Add trail point during swing phase
            if (this.attackAnimationProgress >= 0.3 && this.attackAnimationProgress <= 0.7) {
                const armX = this.x + (this.facingRight ? this.width + 5 : -5);
                const armY = this.y + 32;
                const swordLength = this.hasSword ? 25 : 12; // Longer for sword
                const angleRad = (this.attackSwingAngle - 90) * Math.PI / 180;
                const tipX = armX + Math.cos(angleRad) * swordLength * (this.facingRight ? 1 : -1);
                const tipY = armY + Math.sin(angleRad) * swordLength;

                this.attackTrailPoints.push({
                    x: tipX,
                    y: tipY,
                    alpha: 1.0,
                    time: Date.now()
                });
            }

            if (this.attackTimer <= 0) {
                this.isAttacking = false;
                this.hasHitThisAttack = false;
                this.attackAnimationProgress = 0;
                this.attackSwingAngle = 0;
            }
        }

        // Fade out trail points
        this.attackTrailPoints = this.attackTrailPoints.filter(point => {
            point.alpha -= deltaTime * 4; // Fade over 0.25 seconds
            return point.alpha > 0;
        });
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

    // Sukuna's Cleave attack - cursed energy projectile
    shootCleave() {
        const projectileX = this.facingRight
            ? this.x + this.width
            : this.x - 15;

        const projectileY = this.y + this.height / 2 - 8;

        const cleaveProjectile = {
            x: projectileX,
            y: projectileY,
            vx: this.facingRight ? 600 : -600, // Fast projectile
            vy: 0,
            radius: 12, // Bigger than normal
            damage: 100, // 100 damage!
            lifetime: 2.0,
            hasHit: false,
            isCleave: true, // Mark as cleave for special rendering
            rotation: 0
        };

        this.projectiles.push(cleaveProjectile);
        console.log(`👹 CLEAVE! Sukuna fires cursed energy! Damage: 100`);
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

    // Take damage from enemy (attacker parameter for UNO reverse)
    takeDamage(amount, attacker = null) {
        if (!this.isAlive || this.invincible) return false;

        // Check for UNO Reverse Card - reflect damage back!
        if (this.hasUnoReverse && attacker && attacker.takeDamage) {
            this.hasUnoReverse = false; // Consume the card
            this.inventory.removeItem('unoReverse', 1); // Remove from inventory
            console.log('🔄 UNO REVERSE! Damage reflected back to attacker!');
            this.unoReverseActivated = true;
            this.unoReverseTimer = 1.5; // Animation timer

            // Reflect damage to attacker
            attacker.takeDamage(amount);

            // Player takes no damage
            return false;
        }

        this.health -= amount;
        this.invincible = true;
        this.invincibilityTimer = this.invincibilityDuration;

        console.log(`Player took ${amount} damage! Health: ${this.health}/${this.maxHealth}`);

        if (this.health <= 0) {
            // Check for Totem of Undying!
            if (this.hasTotem) {
                this.health = Math.floor(this.maxHealth * 0.5); // Restore to 50% HP
                this.hasTotem = false; // Consume totem
                this.inventory.removeItem('totem', 1); // Remove from inventory
                this.invincible = true;
                this.invincibilityTimer = 3.0; // 3 seconds of invincibility after totem use
                console.log('🗿 TOTEM OF UNDYING ACTIVATED! Player saved from death!');
                // Trigger totem animation flag
                this.totemActivated = true;
                this.totemAnimationTimer = 2.0; // Animation lasts 2 seconds
                return true;
            }
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
            this.updateCurrentDamage(); // Update damage when slot changes
            console.log(`Selected hotbar slot ${slotIndex + 1}`);
        }
    }

    // Get current weapon from selected slot
    getCurrentWeapon() {
        const item = this.inventory.getSlotItem(this.selectedSlot);
        return item ? item.type : null;
    }

    // Update attack damage based on currently selected weapon
    updateCurrentDamage() {
        const currentWeapon = this.getCurrentWeapon();
        let baseDamage = this.baseAttackDamage; // Default fist damage

        // Check what weapon is in selected slot
        if (currentWeapon) {
            if (this.weaponDamage[currentWeapon]) {
                baseDamage = this.weaponDamage[currentWeapon];
            } else if (currentWeapon === 'sword' || currentWeapon === 'weapon_fire_sword') {
                baseDamage = this.weaponDamage.sword;
            } else if (currentWeapon === 'evilSword') {
                baseDamage = this.weaponDamage.evilSword;
            } else if (currentWeapon === 'eliteSword') {
                baseDamage = this.weaponDamage.eliteSword;
            } else if (currentWeapon === 'lightsaber') {
                baseDamage = this.weaponDamage.lightsaber;
            } else if (currentWeapon === 'cleave') {
                baseDamage = this.weaponDamage.cleave;
            } else if (currentWeapon === 'fryingPan') {
                baseDamage = this.weaponDamage.fryingPan;
            }
        }

        // Apply class bonuses
        let multiplier = 1;
        if (this.isSukuna) multiplier *= 1.5;
        if (this.isBoxer) multiplier *= 1.25;
        if (this.isEnemyKing) multiplier *= 1.2;

        this.attackDamage = Math.ceil(baseDamage * multiplier);
        console.log(`⚔️ Damage updated: ${this.attackDamage} (base: ${baseDamage}, multiplier: ${multiplier}, weapon: ${currentWeapon || 'fist'})`);
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

        // Add to inventory slot system (leftmost empty slot)
        if (this.inventory.findItemSlot('sword') === -1) {
            this.inventory.addItem('sword', 1);
        }

        this.updateCurrentDamage();
        console.log(`Sword equipped! Select it in hotbar to use (damage: ${this.weaponDamage.sword})`);
        return true;
    }

    // Equip enemy sword (evilSword - 5 damage)
    equipEnemySword() {
        this.hasSword = true;

        // Add evil sword to inventory
        if (this.inventory.findItemSlot('evilSword') === -1) {
            this.inventory.addItem('evilSword', 1);
        }

        this.updateCurrentDamage();
        console.log(`Enemy Sword equipped! Select it in hotbar to use (damage: ${this.weaponDamage.evilSword})`);
        return true;
    }

    // Equip slingshot (15 damage ranged)
    equipSlingshot() {
        this.hasSlingshot = true; // Enable ranged attacks
        this.projectileDamage = 15; // Projectile damage

        // Add to inventory slot system (leftmost empty slot)
        if (this.inventory.findItemSlot('slingshot') === -1) {
            this.inventory.addItem('slingshot', 1);
        }

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

    // Equip elite sword (6 damage)
    equipEliteSword() {
        this.hasSword = true;

        // Add elite sword to inventory
        if (this.inventory.findItemSlot('eliteSword') === -1) {
            this.inventory.addItem('eliteSword', 1);
        }

        this.updateCurrentDamage();
        console.log(`👑 Elite Sword equipped! Select it in hotbar (damage: ${this.weaponDamage.eliteSword})`);
        return true;
    }

    // Equip Lightsaber (8 damage)
    equipLightsaber() {
        if (this.hasLightsaber) {
            console.log('⚔️ Lightsaber already equipped!');
            return false;
        }
        this.hasLightsaber = true;
        this.hasSword = false; // Replace sword

        // Add to inventory slot system (leftmost empty slot)
        if (this.inventory.findItemSlot('lightsaber') === -1) {
            // Remove sword from slots if present
            const swordSlot = this.inventory.findItemSlot('sword');
            if (swordSlot !== -1) {
                this.inventory.slots[swordSlot] = null;
                delete this.inventory.items['sword'];
            }
            this.inventory.addItem('lightsaber', 1);
        }

        this.updateCurrentDamage();
        console.log(`⚔️ Lightsaber equipped! Select it in hotbar (damage: ${this.weaponDamage.lightsaber})`);
        return true;
    }

    // Equip Enemy King class (+20% damage bonus, evil sword)
    equipEnemyKing() {
        if (this.isEnemyKing) {
            console.log('👑 Enemy King already equipped!');
            return false;
        }
        this.isEnemyKing = true;
        this.hasEvilSword = true;

        // Add evil sword to inventory
        if (this.inventory.findItemSlot('evilSword') === -1) {
            this.inventory.addItem('evilSword', 1);
        }

        this.updateCurrentDamage();
        console.log(`👑 Enemy King equipped! +20% damage bonus`);
        return true;
    }

    equipChef() {
        if (this.isChef) {
            console.log('👨‍🍳 Chef already equipped!');
            return false;
        }
        this.isChef = true;
        this.hasFryingPan = true;
        this.fryingPanDamage = 15;

        // Apply +15% attack speed bonus
        this.attackSpeedMultiplier = (this.attackSpeedMultiplier || 1) * 1.15;
        if (this.attackCooldown) {
            this.attackCooldown = Math.floor(this.attackCooldown / 1.15);
        }

        // Add frying pan to inventory
        if (this.inventory.findItemSlot('fryingPan') === -1) {
            this.inventory.addItem('fryingPan', 1);
        }

        console.log(`👨‍🍳 Chef equipped! Attack speed +15%`);
        return true;
    }

    equipSkibidi() {
        if (this.isSkibidi) {
            console.log('🚽 Skibidi already equipped!');
            return false;
        }
        this.isSkibidi = true;
        this.hasToilet = true;

        // Skibidi special: +30% jump height, +25% speed, sonic attack
        this.jumpForce = (this.jumpForce || -15) * 1.3;
        this.speed = (this.speed || 5) * 1.25;
        this.skibidiSonicDamage = 25;

        // Add toilet to inventory
        if (this.inventory.findItemSlot('toilet') === -1) {
            this.inventory.addItem('toilet', 1);
        }

        console.log(`🚽 Skibidi Toilet equipped! Jump +30%, Speed +25%, Sonic Attack!`);
        return true;
    }

    equipSukuna() {
        if (this.isSukuna) {
            console.log('👹 Sukuna already equipped!');
            return false;
        }
        this.isSukuna = true;
        this.hasCleave = true;
        this.cleaveRange = 80; // Cleave hits in a wider area
        this.cleaveActive = true;

        // Add cleave to inventory
        if (this.inventory.findItemSlot('cleave') === -1) {
            this.inventory.addItem('cleave', 1);
        }

        this.updateCurrentDamage();
        console.log(`👹 Sukuna equipped! +50% damage bonus, Cleave attack (100 dmg projectile)!`);
        return true;
    }

    // Equip Boxer class
    equipBoxer() {
        if (this.isBoxer) {
            console.log('🥊 Boxer already equipped!');
            return false;
        }
        this.isBoxer = true;
        this.attackCooldown = Math.max(0.15, (this.attackCooldown || 0.3) * 0.8); // 20% faster attacks

        // Add boxing glove to inventory
        if (this.inventory.findItemSlot('boxingGlove') === -1) {
            this.inventory.addItem('boxingGlove', 1);
        }

        this.updateCurrentDamage();
        console.log(`🥊 Boxer equipped! +25% damage bonus, faster attacks!`);
        return true;
    }

    // Generic class equip system for 100 new classes
    // Uses CLASS_STATS from ClassDatabase.js
    equipGenericClass(classId) {
        if (this._genericClassEquipped === classId) {
            console.log(`Class ${classId} already equipped!`);
            return false;
        }
        this._genericClassEquipped = classId;

        // Get stats from CLASS_STATS (defined in ClassDatabase.js)
        const stats = (typeof CLASS_STATS !== 'undefined') ? CLASS_STATS[classId] : null;
        if (!stats) {
            console.log(`No stats found for class: ${classId}`);
            return false;
        }

        // Apply damage multiplier
        if (stats.dmg && stats.dmg !== 1.0) {
            this.attackDamage = Math.floor(this.attackDamage * stats.dmg);
        }

        // Apply speed multiplier
        if (stats.spd && stats.spd !== 1.0) {
            this.speed = this.speed * stats.spd;
        }

        // Apply jump multiplier
        if (stats.jump && stats.jump !== 1.0) {
            this.jumpForce = (this.jumpForce || -15) * stats.jump;
        }

        // Apply health bonus
        if (stats.hp && stats.hp !== 0) {
            this.maxHealth += stats.hp;
            this.health = Math.min(this.health + Math.max(0, stats.hp), this.maxHealth);
        }

        // Apply attack speed multiplier
        if (stats.atkSpd && stats.atkSpd !== 1.0) {
            this.attackCooldown = Math.max(0.1, (this.attackCooldown || 0.3) / stats.atkSpd);
        }

        // Apply lifesteal
        if (stats.lifesteal) {
            this.lifesteal = (this.lifesteal || 0) + stats.lifesteal;
        }

        // Add weapon to inventory if class has one
        if (stats.weapon) {
            if (this.inventory.findItemSlot(stats.weapon) === -1) {
                this.inventory.addItem(stats.weapon, 1);
            }
            // Register weapon damage
            if (stats.weaponDmg) {
                this.weaponDamage = this.weaponDamage || {};
                this.weaponDamage[stats.weapon] = stats.weaponDmg;
            }
        }

        this.updateCurrentDamage();
        const bonuses = [];
        if (stats.dmg > 1) bonuses.push(`+${Math.round((stats.dmg - 1) * 100)}% DMG`);
        if (stats.spd > 1) bonuses.push(`+${Math.round((stats.spd - 1) * 100)}% SPD`);
        if (stats.jump > 1) bonuses.push(`+${Math.round((stats.jump - 1) * 100)}% JUMP`);
        if (stats.hp > 0) bonuses.push(`+${stats.hp} HP`);
        if (stats.atkSpd > 1) bonuses.push(`+${Math.round((stats.atkSpd - 1) * 100)}% ATK SPD`);
        if (stats.lifesteal) bonuses.push(`${Math.round(stats.lifesteal * 100)}% LIFESTEAL`);
        if (stats.weapon) bonuses.push(stats.weapon);
        console.log(`Equipped ${classId}: ${bonuses.join(', ')}`);
        return true;
    }

    // Collect elemental shard
    collectElementalShard(elementType) {
        console.log(`🔍 collectElementalShard called with elementType: ${elementType}`);
        // Add to inventory (you can expand this later for special abilities)
        const itemName = `${elementType}Shard`;
        this.inventory.addItem(itemName, 1);
        console.log(`✨ Collected ${elementType} elemental shard! Added to inventory as ${itemName}.`);
        console.log(`📦 Current inventory:`, this.inventory.getAllItems());
        return true;
    }

    // Equip Totem of Undying
    equipTotem() {
        if (this.hasTotem) {
            console.log('🗿 Already have a Totem of Undying!');
            return false;
        }
        this.hasTotem = true;

        // Add to inventory slot system (leftmost empty slot)
        if (this.inventory.findItemSlot('totem') === -1) {
            this.inventory.addItem('totem', 1);
        }

        console.log('🗿 Totem of Undying equipped! Will save you from death once.');
        return true;
    }

    // Equip UNO Reverse Card
    equipUnoReverse() {
        if (this.hasUnoReverse) {
            console.log('🔄 Already have a UNO Reverse Card!');
            return false;
        }
        this.hasUnoReverse = true;

        // Add to inventory slot system (leftmost empty slot)
        if (this.inventory.findItemSlot('unoReverse') === -1) {
            this.inventory.addItem('unoReverse', 1);
        }

        console.log('🔄 UNO Reverse Card equipped! Next attack will be reflected!');
        return true;
    }

    // Unequip sword (for potential future use)
    unequipSword() {
        if (!this.hasSword) return false;

        this.hasSword = false;
        this.updateCurrentDamage();

        console.log(`Sword unequipped.`);
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

    // Perform finisher on enemy
    performFinisher(enemy) {
        if (!enemy || !enemy.canBeFinished || !enemy.canBeFinished()) {
            return false;
        }

        // Determine finisher type based on current weapon/class
        let finisherType = 'fist'; // default
        if (this.isSukuna) {
            finisherType = 'sukuna';
        } else if (this.isBoxer) {
            finisherType = 'boxer';
        } else if (this.isSkibidi) {
            finisherType = 'skibidi';
        } else if (this.isChef) {
            finisherType = 'chef';
        } else if (this.isEnemyKing) {
            finisherType = 'king';
        } else if (this.hasLightsaber) {
            finisherType = 'lightsaber';
        } else if (this.hasSlingshot) {
            finisherType = 'slingshot';
        } else if (this.hasSword) {
            finisherType = 'sword';
        }

        // Start finisher
        this.isPerformingFinisher = true;
        this.finisherTarget = enemy;
        this.finisherProgress = 0;
        this.finisherType = finisherType;
        this.vx = 0; // Stop movement

        // Tell enemy to start finisher animation
        enemy.startFinisher(finisherType);

        // Make player invincible during finisher
        this.invincible = true;
        this.invincibilityTimer = this.finisherDuration + 0.5;

        console.log(`💀 FINISHER! Type: ${finisherType}`);
        return true;
    }

    // Get finisher type for current weapon/class
    getFinisherType() {
        if (this.isSukuna) return 'sukuna';
        if (this.isBoxer) return 'boxer';
        if (this.isSkibidi) return 'skibidi';
        if (this.isChef) return 'chef';
        if (this.isEnemyKing) return 'king';
        if (this.hasLightsaber) return 'lightsaber';
        if (this.hasSlingshot) return 'slingshot';
        if (this.hasSword) return 'sword';
        return 'fist';
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

    /**
     * Serialize player state for network transmission
     */
    serializeState() {
        return {
            x: Math.round(this.x),
            y: Math.round(this.y),
            vx: Math.round(this.vx * 10) / 10,
            vy: Math.round(this.vy * 10) / 10,
            hp: this.health,
            maxHp: this.maxHealth,
            facing: this.facingRight ? 1 : 0,
            grounded: this.isGrounded ? 1 : 0,
            attacking: this.isAttacking ? 1 : 0,
            weapon: this.getCurrentWeaponIndex(),
            anim: this.state || 'idle',
            slot: this.playerSlot,
            username: this.username
        };
    }

    /**
     * Get current weapon index for network sync
     */
    getCurrentWeaponIndex() {
        if (this.hasLightsaber) return 3; // Lightsaber
        if (this.hasSlingshot) return 2;
        if (this.hasSword) return 1;
        return 0; // Fist
    }

    /**
     * Apply slot colors for multiplayer
     */
    applySlotColors(slot) {
        this.playerSlot = slot;
        this.slotColors = Player.SLOT_COLORS[slot % 4];
    }

    /**
     * Apply a skin to the player
     * @param {string} skinId - The skin ID (e.g., 'skin_knight', 'skin_ninja', etc.)
     */
    applySkin(skinId) {
        const skin = this.skinStyles[skinId] || this.skinStyles['default'];

        this.equippedSkin = skinId;
        this.color = skin.color;
        this.hairColor = skin.hairColor;
        this.blindfoldColor = skin.blindfoldColor;
        this.skinColor = skin.skinColor;

        // Store special skin properties
        this.skinHasHelmet = skin.hasHelmet || false;
        this.skinHasMask = skin.hasMask || false;
        this.skinIsRobot = skin.isRobot || false;
        this.skinHasHorns = skin.hasHorns || false;

        console.log(`🎨 Applied skin: ${skin.name} (${skinId})`);
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
        ctx.fillStyle = this.color;
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
        // Left arm (non-attacking arm)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 6, this.y + 30 + leftArmOffset, 4, 6);
        ctx.fillStyle = this.skinColor;
        ctx.fillRect(this.x + 6, this.y + 35 + leftArmOffset, 3, 3);

        // Right arm (attacking arm) - animate during attack
        if (this.isAttacking && !this.hasSlingshot) {
            // Calculate arm position based on swing angle
            const armPivotX = this.x + 24;
            const armPivotY = this.y + 32;
            const armLength = 8;
            const angleRad = (this.attackSwingAngle - 90) * Math.PI / 180;

            ctx.save();
            ctx.translate(armPivotX, armPivotY);
            ctx.rotate(angleRad);

            // Arm
            ctx.fillStyle = this.color;
            ctx.fillRect(-2, 0, 4, armLength);

            // Hand/fist
            ctx.fillStyle = this.skinColor;
            if (this.hasSword) {
                // Hand gripping sword
                ctx.fillRect(-2, armLength - 1, 4, 4);

                // === SWORD ===
                const swordLength = 22;
                const swordWidth = 3;

                // Blade (silver with gradient effect)
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(-swordWidth / 2, armLength + 3, swordWidth, swordLength);

                // Blade shine
                ctx.fillStyle = '#E8E8E8';
                ctx.fillRect(-swordWidth / 2, armLength + 3, 1, swordLength);

                // Blade tip (pointed)
                ctx.fillStyle = '#C0C0C0';
                ctx.beginPath();
                ctx.moveTo(-swordWidth / 2, armLength + 3 + swordLength);
                ctx.lineTo(0, armLength + 3 + swordLength + 4);
                ctx.lineTo(swordWidth / 2, armLength + 3 + swordLength);
                ctx.closePath();
                ctx.fill();

                // Crossguard (gold)
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(-5, armLength + 1, 10, 3);

                // Handle wrap (brown)
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-1, armLength - 2, 2, 4);

                // Pommel (gold)
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(0, armLength - 3, 2, 0, Math.PI * 2);
                ctx.fill();

                // Sword glow effect during swing
                if (this.attackAnimationProgress >= 0.3 && this.attackAnimationProgress <= 0.7) {
                    ctx.globalAlpha = 0.4;
                    ctx.fillStyle = '#00FFFF';
                    ctx.fillRect(-swordWidth, armLength + 3, swordWidth * 2, swordLength + 4);
                    ctx.globalAlpha = 1.0;
                }
            } else {
                // === FIST (no sword) ===
                // Clenched fist - larger during attack
                const fistSize = 5;
                ctx.fillRect(-fistSize / 2, armLength, fistSize, fistSize);

                // Knuckle details
                ctx.fillStyle = '#E8C8A8';
                ctx.fillRect(-fistSize / 2 + 1, armLength, 1, 1);
                ctx.fillRect(-fistSize / 2 + 3, armLength, 1, 1);

                // Fist glow during punch
                if (this.attackAnimationProgress >= 0.3 && this.attackAnimationProgress <= 0.7) {
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = '#00FFFF';
                    ctx.beginPath();
                    ctx.arc(0, armLength + fistSize / 2, fistSize + 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                }
            }

            ctx.restore();
        } else {
            // Normal right arm (not attacking)
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x + 22, this.y + 30 + rightArmOffset, 4, 6);
            ctx.fillStyle = this.skinColor;
            ctx.fillRect(this.x + 23, this.y + 35 + rightArmOffset, 3, 3);

            // Show lightsaber at rest if equipped (not attacking)
            if (this.hasLightsaber) {
                ctx.save();
                const hx = this.x + 24; // Handle X
                const hy = this.y + 32; // Handle Y

                // Handle - metallic gradient effect
                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(hx, hy, 6, 14); // Main handle body

                // Handle details - grip rings
                ctx.fillStyle = '#444';
                ctx.fillRect(hx, hy + 2, 6, 1);
                ctx.fillRect(hx, hy + 5, 6, 1);
                ctx.fillRect(hx, hy + 8, 6, 1);
                ctx.fillRect(hx, hy + 11, 6, 1);

                // Handle highlight
                ctx.fillStyle = '#666';
                ctx.fillRect(hx + 1, hy, 1, 14);

                // Emitter shroud
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(hx + 1, hy - 3, 4, 4);

                // Activation button (red)
                ctx.fillStyle = '#ff3333';
                ctx.fillRect(hx + 5, hy + 4, 2, 2);
                ctx.fillStyle = '#ff6666';
                ctx.fillRect(hx + 5, hy + 4, 1, 1);

                // Blade with plasma glow effect
                const bladeX = hx + 2;
                const bladeY = hy - 25;
                const bladeHeight = 22;

                // Outer glow
                ctx.shadowColor = '#7df9ff';
                ctx.shadowBlur = 20;
                ctx.fillStyle = 'rgba(125, 249, 255, 0.3)';
                ctx.fillRect(bladeX - 1, bladeY, 4, bladeHeight);

                // Main blade
                ctx.shadowBlur = 12;
                ctx.fillStyle = '#7df9ff';
                ctx.fillRect(bladeX, bladeY, 2, bladeHeight);

                // Bright core
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(bladeX + 0.5, bladeY + 1, 1, bladeHeight - 2);

                // Blade tip (rounded)
                ctx.fillStyle = '#7df9ff';
                ctx.beginPath();
                ctx.arc(bladeX + 1, bladeY, 1, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
            // Show sword at rest if equipped (not attacking)
            else if (this.hasSword && !this.hasSlingshot) {
                ctx.save();
                // Sword held down at side
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(this.x + 26, this.y + 36, 2, 12); // Blade
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(this.x + 24, this.y + 34, 6, 2); // Crossguard
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x + 26, this.y + 32, 2, 3); // Handle
                ctx.restore();
            }
        }

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

        // Frozen effect overlay
        if (this.isFrozen) {
            // Ice overlay
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            // Ice crystals around player
            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;

            // Draw ice crystals
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + Date.now() / 300;
                const radius = this.width / 2 + 5;
                const cx = this.x + this.width / 2 + Math.cos(angle) * radius;
                const cy = this.y + this.height / 2 + Math.sin(angle) * radius;

                ctx.beginPath();
                ctx.moveTo(cx - 3, cy);
                ctx.lineTo(cx + 3, cy);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cx, cy - 3);
                ctx.lineTo(cx, cy + 3);
                ctx.stroke();
            }

            ctx.globalAlpha = 1.0;
        }

        ctx.restore();

        // === ATTACK SWING TRAIL EFFECT ===
        if (this.attackTrailPoints.length > 1) {
            ctx.save();

            // Draw trail as connected arcs
            for (let i = 1; i < this.attackTrailPoints.length; i++) {
                const prev = this.attackTrailPoints[i - 1];
                const curr = this.attackTrailPoints[i];

                // Gradient from cyan to white
                const alpha = curr.alpha * 0.8;
                ctx.strokeStyle = this.hasSword
                    ? `rgba(0, 255, 255, ${alpha})`
                    : `rgba(255, 200, 100, ${alpha})`; // Orange for fist

                ctx.lineWidth = this.hasSword ? (6 * curr.alpha) : (4 * curr.alpha);
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(curr.x, curr.y);
                ctx.stroke();
            }

            // Draw glowing tip at the last point
            if (this.attackTrailPoints.length > 0) {
                const lastPoint = this.attackTrailPoints[this.attackTrailPoints.length - 1];
                if (lastPoint.alpha > 0.3) {
                    ctx.beginPath();
                    ctx.arc(lastPoint.x, lastPoint.y, this.hasSword ? 4 : 3, 0, Math.PI * 2);
                    ctx.fillStyle = this.hasSword
                        ? `rgba(255, 255, 255, ${lastPoint.alpha})`
                        : `rgba(255, 220, 150, ${lastPoint.alpha})`;
                    ctx.fill();
                }
            }

            ctx.restore();
        }

        // === ATTACK IMPACT EFFECT ===
        if (this.isAttacking && this.attackAnimationProgress >= 0.4 && this.attackAnimationProgress <= 0.6) {
            const hitbox = this.getAttackHitbox();
            ctx.save();

            // Impact flash
            ctx.globalAlpha = 0.3 * (1 - Math.abs(this.attackAnimationProgress - 0.5) * 4);

            if (this.hasSword) {
                // Sword slash arc
                ctx.strokeStyle = '#00FFFF';
                ctx.lineWidth = 4;
                ctx.beginPath();
                const arcCenterX = this.facingRight ? hitbox.x : hitbox.x + hitbox.width;
                const arcCenterY = hitbox.y + hitbox.height / 2;
                const startAngle = this.facingRight ? -Math.PI / 2 : Math.PI / 2;
                const endAngle = this.facingRight ? Math.PI / 4 : Math.PI * 3 / 4;
                ctx.arc(arcCenterX, arcCenterY, 30, startAngle, endAngle);
                ctx.stroke();

                // Inner arc
                ctx.strokeStyle = '#87CEEB';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(arcCenterX, arcCenterY, 25, startAngle, endAngle);
                ctx.stroke();
            } else {
                // Fist impact burst
                ctx.fillStyle = '#FFAA00';
                const burstX = this.facingRight ? hitbox.x + hitbox.width / 2 : hitbox.x + hitbox.width / 2;
                const burstY = hitbox.y + hitbox.height / 2;

                // Star burst
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const innerRadius = 5;
                    const outerRadius = 15;

                    ctx.beginPath();
                    ctx.moveTo(
                        burstX + Math.cos(angle) * innerRadius,
                        burstY + Math.sin(angle) * innerRadius
                    );
                    ctx.lineTo(
                        burstX + Math.cos(angle) * outerRadius,
                        burstY + Math.sin(angle) * outerRadius
                    );
                    ctx.strokeStyle = '#FFDD00';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // Central flash
                ctx.beginPath();
                ctx.arc(burstX, burstY, 8, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
                ctx.fill();
            }

            ctx.restore();
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

        // Render equipped title above player
        if (this.equippedTitle && this.titleData[this.equippedTitle]) {
            const title = this.titleData[this.equippedTitle];
            const titleText = `${title.icon} ${title.name}`;
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFD700'; // Gold color
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeText(titleText, this.x + this.width / 2, this.y - 32);
            ctx.fillText(titleText, this.x + this.width / 2, this.y - 32);
        }

        // Render projectiles
        for (const proj of this.projectiles) {
            ctx.save();

            if (proj.isCleave) {
                // Sukuna's Cleave projectile - red cursed energy slash
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ff0044';

                // Rotating slash effect
                proj.rotation = (proj.rotation || 0) + 0.3;
                ctx.translate(proj.x, proj.y);
                ctx.rotate(proj.rotation);

                // Main slash lines (X pattern)
                ctx.strokeStyle = '#ff0044';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(-proj.radius, -proj.radius);
                ctx.lineTo(proj.radius, proj.radius);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(proj.radius, -proj.radius);
                ctx.lineTo(-proj.radius, proj.radius);
                ctx.stroke();

                // Inner bright lines
                ctx.strokeStyle = '#ff6688';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-proj.radius * 0.7, -proj.radius * 0.7);
                ctx.lineTo(proj.radius * 0.7, proj.radius * 0.7);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(proj.radius * 0.7, -proj.radius * 0.7);
                ctx.lineTo(-proj.radius * 0.7, proj.radius * 0.7);
                ctx.stroke();

                // Center glow
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2);
                ctx.fill();

                ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform

                // Trail effect
                ctx.shadowBlur = 0;
                ctx.fillStyle = 'rgba(255, 0, 68, 0.4)';
                for (let i = 1; i <= 5; i++) {
                    const trailX = proj.x - (proj.vx > 0 ? i * 8 : -i * 8);
                    ctx.beginPath();
                    ctx.arc(trailX, proj.y, proj.radius - i * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Normal slingshot projectile
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
            }

            ctx.restore();
        }

        // Render finisher effect
        if (this.isPerformingFinisher && this.finisherTarget) {
            ctx.save();

            const targetX = this.finisherTarget.x + this.finisherTarget.width / 2;
            const targetY = this.finisherTarget.y + this.finisherTarget.height / 2;
            const playerCenterX = this.x + this.width / 2;
            const playerCenterY = this.y + this.height / 2;

            // Screen flash
            if (this.finisherProgress < 0.3) {
                ctx.globalAlpha = (0.3 - this.finisherProgress) * 0.5;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }

            // Draw finisher effect based on type
            if (this.finisherType === 'sword') {
                // Multiple slash arcs
                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 4;
                for (let i = 0; i < 3; i++) {
                    const slashProgress = Math.min(1, this.finisherProgress * 3 - i * 0.3);
                    if (slashProgress > 0) {
                        ctx.globalAlpha = slashProgress * 0.8;
                        ctx.beginPath();
                        const startAngle = -Math.PI / 2 + i * 0.3;
                        const endAngle = Math.PI / 4 + i * 0.3;
                        ctx.arc(targetX, targetY, 40 + i * 15, startAngle, startAngle + (endAngle - startAngle) * slashProgress);
                        ctx.stroke();
                    }
                }

                // "FINISH" text
                if (this.finisherProgress > 0.5) {
                    ctx.globalAlpha = (this.finisherProgress - 0.5) * 2;
                    ctx.font = 'bold 24px Arial';
                    ctx.fillStyle = '#FF0000';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'center';
                    ctx.strokeText('FINISH!', targetX, targetY - 50);
                    ctx.fillText('FINISH!', targetX, targetY - 50);
                }
            } else if (this.finisherType === 'fist') {
                // Impact waves
                const waveCount = 3;
                for (let i = 0; i < waveCount; i++) {
                    const waveProgress = Math.min(1, this.finisherProgress * 2 - i * 0.2);
                    if (waveProgress > 0) {
                        ctx.globalAlpha = (1 - waveProgress) * 0.6;
                        ctx.strokeStyle = '#FFAA00';
                        ctx.lineWidth = 5 - waveProgress * 3;
                        ctx.beginPath();
                        ctx.arc(targetX, targetY, waveProgress * 60 + i * 20, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }

                // SMASH text
                if (this.finisherProgress > 0.4) {
                    ctx.globalAlpha = Math.min(1, (this.finisherProgress - 0.4) * 2);
                    ctx.font = 'bold 28px Arial';
                    ctx.fillStyle = '#FFAA00';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'center';
                    ctx.strokeText('SMASH!', targetX, targetY - 50);
                    ctx.fillText('SMASH!', targetX, targetY - 50);
                }
            } else if (this.finisherType === 'slingshot') {
                // Multiple projectile trails converging
                ctx.globalAlpha = 0.7;
                for (let i = 0; i < 5; i++) {
                    const angle = (i / 5) * Math.PI * 2;
                    const startX = targetX + Math.cos(angle) * 100;
                    const startY = targetY + Math.sin(angle) * 100;
                    const progress = Math.min(1, this.finisherProgress * 2);

                    const currentX = startX + (targetX - startX) * progress;
                    const currentY = startY + (targetY - startY) * progress;

                    // Trail
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(currentX, currentY);
                    ctx.stroke();

                    // Projectile
                    ctx.fillStyle = '#696969';
                    ctx.beginPath();
                    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Impact at center
                if (this.finisherProgress > 0.5) {
                    const impactProgress = (this.finisherProgress - 0.5) * 2;
                    ctx.globalAlpha = 1 - impactProgress;
                    ctx.fillStyle = '#FFFF00';
                    ctx.beginPath();
                    ctx.arc(targetX, targetY, impactProgress * 50, 0, Math.PI * 2);
                    ctx.fill();

                    // HEADSHOT text
                    ctx.globalAlpha = impactProgress;
                    ctx.font = 'bold 20px Arial';
                    ctx.fillStyle = '#FF6600';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.textAlign = 'center';
                    ctx.strokeText('HEADSHOT!', targetX, targetY - 50);
                    ctx.fillText('HEADSHOT!', targetX, targetY - 50);
                }
            } else if (this.finisherType === 'lightsaber') {
                // Lightsaber finisher - multiple light slashes
                const colors = ['#00FF00', '#00FFFF', '#FFFFFF'];
                for (let i = 0; i < 5; i++) {
                    const slashProgress = Math.min(1, this.finisherProgress * 4 - i * 0.15);
                    if (slashProgress > 0) {
                        ctx.globalAlpha = slashProgress * 0.9;
                        ctx.strokeStyle = colors[i % colors.length];
                        ctx.lineWidth = 6 - i;
                        ctx.shadowBlur = 20;
                        ctx.shadowColor = ctx.strokeStyle;
                        ctx.beginPath();
                        const angle = (i * 0.5) - 1.2;
                        ctx.arc(targetX, targetY, 40 + i * 10, angle, angle + Math.PI * slashProgress);
                        ctx.stroke();
                    }
                }
                ctx.shadowBlur = 0;

                // "EXECUTED" text
                if (this.finisherProgress > 0.5) {
                    ctx.globalAlpha = (this.finisherProgress - 0.5) * 2;
                    ctx.font = 'bold 26px Arial';
                    ctx.fillStyle = '#00FF00';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'center';
                    ctx.strokeText('EXECUTED!', targetX, targetY - 50);
                    ctx.fillText('EXECUTED!', targetX, targetY - 50);
                }
            } else if (this.finisherType === 'chef') {
                // Chef finisher - frying pan slam with food particles
                const panProgress = Math.min(1, this.finisherProgress * 2);

                // Frying pan swing arc
                ctx.strokeStyle = '#4a4a4a';
                ctx.lineWidth = 8;
                ctx.globalAlpha = 0.9;
                ctx.beginPath();
                ctx.arc(targetX, targetY - 20, 35, -Math.PI, -Math.PI + Math.PI * panProgress);
                ctx.stroke();

                // Pan circle
                if (panProgress > 0.5) {
                    ctx.fillStyle = '#3a3a3a';
                    ctx.beginPath();
                    ctx.arc(targetX + 30 * (1 - panProgress), targetY - 10, 20, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Food particles flying
                for (let i = 0; i < 8; i++) {
                    const particleProgress = Math.min(1, this.finisherProgress * 3 - i * 0.1);
                    if (particleProgress > 0.3) {
                        ctx.globalAlpha = (1 - particleProgress) * 0.8;
                        const angle = (i / 8) * Math.PI * 2;
                        const dist = particleProgress * 60;
                        const px = targetX + Math.cos(angle) * dist;
                        const py = targetY + Math.sin(angle) * dist - particleProgress * 30;

                        // Different food colors
                        const foodColors = ['#FFD700', '#FF6347', '#32CD32', '#FFA500', '#8B4513'];
                        ctx.fillStyle = foodColors[i % foodColors.length];
                        ctx.beginPath();
                        ctx.arc(px, py, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                // "BON APPÉTIT!" text
                if (this.finisherProgress > 0.5) {
                    ctx.globalAlpha = (this.finisherProgress - 0.5) * 2;
                    ctx.font = 'bold 22px Arial';
                    ctx.fillStyle = '#FFD700';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'center';
                    ctx.strokeText('BON APPÉTIT!', targetX, targetY - 55);
                    ctx.fillText('BON APPÉTIT!', targetX, targetY - 55);
                }
            } else if (this.finisherType === 'king') {
                // Enemy King finisher - dark crown slam with shadow tendrils

                // Dark energy tendrils
                for (let i = 0; i < 6; i++) {
                    const tendrilProgress = Math.min(1, this.finisherProgress * 2.5 - i * 0.1);
                    if (tendrilProgress > 0) {
                        ctx.globalAlpha = tendrilProgress * 0.7;
                        ctx.strokeStyle = '#4B0082';
                        ctx.lineWidth = 4;
                        const angle = (i / 6) * Math.PI * 2;
                        const startX = targetX;
                        const startY = targetY;
                        const endX = targetX + Math.cos(angle) * tendrilProgress * 70;
                        const endY = targetY + Math.sin(angle) * tendrilProgress * 70;

                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        // Wavy tendril
                        const midX = (startX + endX) / 2 + Math.sin(tendrilProgress * 10) * 15;
                        const midY = (startY + endY) / 2 + Math.cos(tendrilProgress * 10) * 15;
                        ctx.quadraticCurveTo(midX, midY, endX, endY);
                        ctx.stroke();
                    }
                }

                // Crown appearing above
                if (this.finisherProgress > 0.3) {
                    const crownProgress = (this.finisherProgress - 0.3) / 0.7;
                    ctx.globalAlpha = crownProgress;
                    ctx.fillStyle = '#FFD700';
                    ctx.strokeStyle = '#4B0082';
                    ctx.lineWidth = 2;

                    // Crown shape
                    const crownY = targetY - 40 - crownProgress * 20;
                    ctx.beginPath();
                    ctx.moveTo(targetX - 20, crownY + 15);
                    ctx.lineTo(targetX - 20, crownY);
                    ctx.lineTo(targetX - 10, crownY + 10);
                    ctx.lineTo(targetX, crownY - 5);
                    ctx.lineTo(targetX + 10, crownY + 10);
                    ctx.lineTo(targetX + 20, crownY);
                    ctx.lineTo(targetX + 20, crownY + 15);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }

                // "KNEEL!" text
                if (this.finisherProgress > 0.5) {
                    ctx.globalAlpha = (this.finisherProgress - 0.5) * 2;
                    ctx.font = 'bold 28px Arial';
                    ctx.fillStyle = '#4B0082';
                    ctx.strokeStyle = '#FFD700';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'center';
                    ctx.strokeText('KNEEL!', targetX, targetY - 70);
                    ctx.fillText('KNEEL!', targetX, targetY - 70);
                }
            } else if (this.finisherType === 'boxer') {
                // Boxer finisher - Knockout punch combo

                // Impact shockwave
                const shockwaveSize = this.finisherProgress * 80;
                ctx.globalAlpha = (1 - this.finisherProgress) * 0.5;
                ctx.strokeStyle = '#ff4444';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(targetX, targetY, shockwaveSize, 0, Math.PI * 2);
                ctx.stroke();

                // Multiple punch impacts
                const punches = [
                    { time: 0.0, x: -20, y: -10 },
                    { time: 0.2, x: 20, y: -5 },
                    { time: 0.4, x: -15, y: 10 },
                    { time: 0.6, x: 25, y: 0 },
                    { time: 0.8, x: 0, y: -15 }  // Final uppercut
                ];

                punches.forEach((punch, i) => {
                    if (this.finisherProgress >= punch.time && this.finisherProgress < punch.time + 0.25) {
                        const punchProgress = (this.finisherProgress - punch.time) / 0.25;
                        ctx.globalAlpha = (1 - punchProgress) * 0.9;

                        // Boxing glove
                        ctx.fillStyle = '#ff4444';
                        ctx.beginPath();
                        ctx.ellipse(targetX + punch.x, targetY + punch.y, 15 - punchProgress * 10, 12 - punchProgress * 8, 0, 0, Math.PI * 2);
                        ctx.fill();

                        // Impact star
                        ctx.fillStyle = '#ffff00';
                        const starSize = 20 * (1 - punchProgress);
                        for (let j = 0; j < 8; j++) {
                            const angle = (j / 8) * Math.PI * 2;
                            ctx.beginPath();
                            ctx.moveTo(targetX + punch.x, targetY + punch.y);
                            ctx.lineTo(
                                targetX + punch.x + Math.cos(angle) * starSize,
                                targetY + punch.y + Math.sin(angle) * starSize
                            );
                            ctx.lineTo(
                                targetX + punch.x + Math.cos(angle + 0.2) * starSize * 0.5,
                                targetY + punch.y + Math.sin(angle + 0.2) * starSize * 0.5
                            );
                            ctx.fill();
                        }
                    }
                });

                // "K.O.!" text
                if (this.finisherProgress > 0.7) {
                    ctx.globalAlpha = (this.finisherProgress - 0.7) * 3.3;
                    ctx.font = 'bold 32px Arial';
                    ctx.fillStyle = '#ff4444';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 4;
                    ctx.textAlign = 'center';
                    ctx.strokeText('K.O.!', targetX, targetY - 50);
                    ctx.fillText('K.O.!', targetX, targetY - 50);
                }
            } else if (this.finisherType === 'sukuna') {
                // Sukuna finisher - Cleave/Dismantle attack with cursed energy

                // Dark red cursed energy aura
                const auraSize = 60 + Math.sin(this.finisherProgress * Math.PI * 8) * 10;
                const gradient = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, auraSize);
                gradient.addColorStop(0, 'rgba(255, 0, 68, 0.8)');
                gradient.addColorStop(0.5, 'rgba(139, 0, 0, 0.4)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(targetX, targetY, auraSize, 0, Math.PI * 2);
                ctx.fill();

                // Multiple cleave slashes
                const numSlashes = 6;
                for (let i = 0; i < numSlashes; i++) {
                    const slashProgress = Math.min(1, this.finisherProgress * 3 - i * 0.15);
                    if (slashProgress > 0 && slashProgress < 1) {
                        ctx.globalAlpha = (1 - Math.abs(slashProgress - 0.5) * 2) * 0.9;
                        ctx.strokeStyle = '#ff0044';
                        ctx.lineWidth = 4;

                        const angle = (i / numSlashes) * Math.PI + slashProgress * Math.PI;
                        const startX = targetX + Math.cos(angle) * 20;
                        const startY = targetY + Math.sin(angle) * 15;
                        const endX = targetX + Math.cos(angle + Math.PI) * 50;
                        const endY = targetY + Math.sin(angle + Math.PI) * 40;

                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.stroke();

                        // Inner bright line
                        ctx.strokeStyle = '#ff6688';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }

                // Blood/curse particles
                for (let i = 0; i < 10; i++) {
                    const particleTime = Math.min(1, this.finisherProgress * 2 - i * 0.08);
                    if (particleTime > 0) {
                        ctx.globalAlpha = (1 - particleTime) * 0.7;
                        const angle = (i / 10) * Math.PI * 2 + this.finisherProgress * Math.PI * 4;
                        const dist = particleTime * 70;
                        const px = targetX + Math.cos(angle) * dist;
                        const py = targetY + Math.sin(angle) * dist;

                        ctx.fillStyle = i % 2 === 0 ? '#ff0044' : '#8B0000';
                        ctx.beginPath();
                        ctx.arc(px, py, 5 - particleTime * 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                // Sukuna's eyes appearing (4 eyes like the real Sukuna)
                if (this.finisherProgress > 0.3 && this.finisherProgress < 0.8) {
                    ctx.globalAlpha = Math.sin((this.finisherProgress - 0.3) * Math.PI / 0.5);
                    ctx.fillStyle = '#ff0044';
                    // Top pair of eyes
                    ctx.beginPath();
                    ctx.arc(targetX - 12, targetY - 30, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(targetX + 12, targetY - 30, 4, 0, Math.PI * 2);
                    ctx.fill();
                    // Bottom pair of eyes
                    ctx.beginPath();
                    ctx.arc(targetX - 8, targetY - 20, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(targetX + 8, targetY - 20, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // "CLEAVE!" text
                if (this.finisherProgress > 0.5) {
                    ctx.globalAlpha = (this.finisherProgress - 0.5) * 2;
                    ctx.font = 'bold 26px Arial';
                    ctx.fillStyle = '#ff0044';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'center';
                    ctx.strokeText('👹 CLEAVE! 👹', targetX, targetY - 60);
                    ctx.fillText('👹 CLEAVE! 👹', targetX, targetY - 60);
                }
            } else if (this.finisherType === 'skibidi') {
                // Skibidi Toilet finisher - toilet spinning and flushing

                // Spinning toilet effect
                const spinAngle = this.finisherProgress * Math.PI * 6; // 3 full rotations
                ctx.save();
                ctx.translate(targetX, targetY);
                ctx.rotate(spinAngle);

                // Toilet bowl
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#87CEEB';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(0, 0, 25, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Water swirl inside
                ctx.fillStyle = '#87CEEB';
                ctx.beginPath();
                ctx.ellipse(0, 0, 15, 12, spinAngle * 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();

                // Flush water particles spiraling
                for (let i = 0; i < 12; i++) {
                    const particleProgress = Math.min(1, this.finisherProgress * 2 - i * 0.05);
                    if (particleProgress > 0) {
                        ctx.globalAlpha = (1 - particleProgress) * 0.6;
                        const angle = (i / 12) * Math.PI * 2 + spinAngle;
                        const dist = particleProgress * 80;
                        const px = targetX + Math.cos(angle) * dist * (1 - particleProgress * 0.5);
                        const py = targetY + Math.sin(angle) * dist * (1 - particleProgress * 0.5);

                        ctx.fillStyle = '#87CEEB';
                        ctx.beginPath();
                        ctx.arc(px, py, 6 - particleProgress * 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                // "FLUSHED!" text with toilet emoji effect
                if (this.finisherProgress > 0.5) {
                    ctx.globalAlpha = (this.finisherProgress - 0.5) * 2;
                    ctx.font = 'bold 24px Arial';
                    ctx.fillStyle = '#00CED1';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'center';
                    ctx.strokeText('🚽 FLUSHED! 🚽', targetX, targetY - 55);
                    ctx.fillText('🚽 FLUSHED! 🚽', targetX, targetY - 55);
                }
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

        // Freeze effect (from status effects system)
        if (this.statusEffects.freeze.active) {
            this.statusEffects.freeze.timer -= deltaTime;
            if (this.statusEffects.freeze.timer <= 0) {
                this.statusEffects.freeze.active = false;
                console.log('✓ Freeze effect expired');
            }
        }

        // Freeze effect (from Ice Boss freeze ability)
        if (this.isFrozen && this.frozenTimer !== undefined) {
            this.frozenTimer -= deltaTime;
            if (this.frozenTimer <= 0) {
                this.isFrozen = false;
                this.frozenTimer = 0;
                console.log('✓ Freeze expired - player can move again');
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
