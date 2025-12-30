// Combat system for handling player-enemy interactions
export class CombatSystem {
    constructor() {
        console.log('CombatSystem initialized');
    }

    // Check if two boxes overlap (AABB collision)
    boxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }

    // Handle combat between player and enemies
    update(player, enemies, potions, armors, swords, enemySwords, slingshots, eliteArmors, eliteSwords) {
        if (!player.isAlive) return;

        // Check player attack hitting enemies
        if (player.isAttacking && !player.hasHitThisAttack) {
            const attackBox = player.getAttackHitbox();
            if (attackBox) {
                console.log(`⚔️ Player attacking! Checking ${enemies.length} enemies for collision`);
                for (const enemy of enemies) {
                    if (!enemy.isAlive) continue;

                    const enemyBox = enemy.getBounds();
                    console.log(`Checking enemy ${enemy.constructor.name} at (${enemyBox.x}, ${enemyBox.y}) size ${enemyBox.width}x${enemyBox.height}`);
                    if (this.boxesOverlap(attackBox, enemyBox)) {
                        // Player hit the enemy!
                        console.log(`✅ Hit detected on ${enemy.constructor.name}!`);
                        enemy.takeDamage(player.attackDamage);
                        player.hasHitThisAttack = true; // Only hit once per attack
                        console.log('Player hit enemy!');
                        break; // Only hit one enemy per attack
                    }
                }
            }
        }

        // Check enemies hitting player (collision damage)
        for (const enemy of enemies) {
            if (!enemy.isAlive) continue;

            const playerBox = player.getBounds();
            const enemyBox = enemy.getBounds();

            if (this.boxesOverlap(playerBox, enemyBox)) {
                // Enemy touching player - deal damage
                console.log(`💥 ${enemy.constructor.name} touching player! Can attack: ${enemy.canAttack()}`);
                if (enemy.canAttack()) {
                    if (player.takeDamage(enemy.damage)) {
                        enemy.attack(); // Start enemy attack cooldown
                        console.log(`Enemy hit player for ${enemy.damage} damage!`);
                    }
                }

                // Elite armor thorns damage - deal damage back to enemy
                if (player.hasEliteArmor && player.armorThornsDamage > 0 && player.thornsTimer <= 0) {
                    enemy.takeDamage(player.armorThornsDamage);
                    player.thornsTimer = player.thornsCooldown; // Reset thorns cooldown
                    console.log(`⚡ Elite Armor spikes dealt ${player.armorThornsDamage} damage to ${enemy.constructor.name}!`);
                }
            }
        }

        // Check player projectiles (slingshot) hitting enemies
        if (player.projectiles && player.projectiles.length > 0) {
            console.log(`🔍 Checking ${player.projectiles.length} player projectiles for collisions with ${enemies.length} enemies`);
            for (const projectile of player.projectiles) {
                if (projectile.hasHit) continue;

                const projBox = {
                    x: projectile.x - projectile.radius,
                    y: projectile.y - projectile.radius,
                    width: projectile.radius * 2,
                    height: projectile.radius * 2
                };

                for (const enemy of enemies) {
                    if (!enemy.isAlive) continue;

                    const enemyBox = enemy.getBounds();
                    if (this.boxesOverlap(projBox, enemyBox)) {
                        // Projectile hit enemy!
                        console.log(`💥 Player projectile hit enemy! Damage: ${projectile.damage}, Enemy HP before: ${enemy.health}`);
                        enemy.takeDamage(projectile.damage);
                        projectile.hasHit = true; // Mark for removal
                        console.log(`💀 Enemy HP after: ${enemy.health}, Is alive: ${enemy.isAlive}`);
                        break;
                    }
                }
            }
        }

        // Check boss projectiles hitting player
        for (const enemy of enemies) {
            if ((enemy.bossType || enemy.constructor.name === 'Boss') && enemy.isAlive && enemy.projectiles) {
                for (const projectile of enemy.projectiles) {
                    const playerBox = player.getBounds();
                    const projBox = {
                        x: projectile.x - projectile.radius,
                        y: projectile.y - projectile.radius,
                        width: projectile.radius * 2,
                        height: projectile.radius * 2
                    };

                    if (this.boxesOverlap(playerBox, projBox)) {
                        // Projectile hit player!
                        if (player.takeDamage(projectile.damage)) {
                            console.log('Boss projectile hit player!');
                        }

                        // Apply status effects based on projectile type
                        if (projectile.type === 'acid') {
                            player.statusEffects.acid.active = true;
                            player.statusEffects.acid.timer = player.statusEffects.acid.duration;
                            player.acidTickTimer = 1.0; // Start ticking immediately
                            console.log('🧪 Player afflicted with acid!');
                        } else if (projectile.type === 'ice') {
                            // Slow effect
                            player.statusEffects.slow.active = true;
                            player.statusEffects.slow.timer = player.statusEffects.slow.duration;
                            console.log('❄️ Player slowed by ice!');

                            // Check for freeze (every 4th hit)
                            player.freezeHitCount++;
                            if (player.freezeHitCount >= 4) {
                                player.statusEffects.freeze.active = true;
                                player.statusEffects.freeze.timer = player.statusEffects.freeze.duration;
                                player.freezeHitCount = 0;
                                console.log('🧊 Player frozen!');
                            }
                        } else if (projectile.type === 'water') {
                            // Knockback effect
                            const knockbackDirection = projectile.velocityX > 0 ? 1 : -1;
                            player.vx += knockbackDirection * 200;
                            console.log('🌊 Player knocked back by water!');
                        }

                        // Remove projectile after hit
                        projectile.lifetime = 0;
                        break;
                    }
                }
            }
        }

        // Check boss fire zones damaging player
        for (const enemy of enemies) {
            if (enemy.fireZones && enemy.fireZones.length > 0) {
                const playerBox = player.getBounds();
                for (const zone of enemy.fireZones) {
                    if (this.boxesOverlap(playerBox, zone)) {
                        // Player in fire zone - apply damage
                        if (!player.fireDamageTimer || player.fireDamageTimer <= 0) {
                            player.takeDamage(zone.damage);
                            player.fireDamageTimer = 1.0; // Damage once per second
                            console.log('🔥 Player taking fire damage!');
                        }
                    }
                }
            }
        }

        // Decrease fire damage timer
        if (player.fireDamageTimer > 0) {
            player.fireDamageTimer -= 0.016; // Approximate delta (will be properly updated in game loop)
        }

        // Check boss black holes pulling player
        for (const enemy of enemies) {
            if (enemy.blackHoles && enemy.blackHoles.length > 0) {
                const playerBox = player.getBounds();
                const playerCenterX = playerBox.x + playerBox.width / 2;
                const playerCenterY = playerBox.y + playerBox.height / 2;

                for (const hole of enemy.blackHoles) {
                    const dx = hole.x - playerCenterX;
                    const dy = hole.y - playerCenterY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < hole.radius) {
                        // Apply pull force (stronger when closer)
                        const pullStrength = hole.pullStrength * (1 - distance / hole.radius);
                        const pullFactor = 0.016; // Approximate deltaTime
                        player.vx += (dx / distance) * pullStrength * pullFactor;
                        player.vy += (dy / distance) * pullStrength * pullFactor;
                    }
                }
            }
        }

        // Check player collecting potions
        if (potions) {
            for (const potion of potions) {
                if (potion.isCollected) continue;

                const playerBox = player.getBounds();
                const potionBox = potion.getBounds();

                if (this.boxesOverlap(playerBox, potionBox)) {
                    // Player collected the potion - add to inventory instead of instant heal
                    potion.collect();
                    player.inventory.addItem('healthPotion', 1);
                    console.log('Health potion added to inventory!');
                }
            }
        }

        // Check player collecting armor
        if (armors) {
            for (const armor of armors) {
                if (armor.isCollected) continue;

                const playerBox = player.getBounds();
                const armorBox = armor.getBounds();

                if (this.boxesOverlap(playerBox, armorBox)) {
                    // Player collected armor - equip it immediately
                    armor.collect();
                    player.equipArmor();
                }
            }
        }

        // Check player collecting swords
        if (swords) {
            for (const sword of swords) {
                if (sword.isCollected) continue;

                const playerBox = player.getBounds();
                const swordBox = sword.getBounds();

                if (this.boxesOverlap(playerBox, swordBox)) {
                    // Player collected sword - equip it immediately
                    sword.collect();
                    player.equipSword();
                }
            }
        }

        // Check player collecting enemy swords
        if (enemySwords) {
            for (const enemySword of enemySwords) {
                if (enemySword.isCollected) continue;

                const playerBox = player.getBounds();
                const swordBox = enemySword.getBounds();

                if (this.boxesOverlap(playerBox, swordBox)) {
                    // Player collected enemy sword (10 damage)
                    enemySword.collect();
                    player.equipEnemySword();
                }
            }
        }

        // Check player collecting slingshots
        if (slingshots) {
            for (const slingshot of slingshots) {
                if (slingshot.isCollected) continue;

                const playerBox = player.getBounds();
                const slingshotBox = slingshot.getBounds();

                if (this.boxesOverlap(playerBox, slingshotBox)) {
                    // Player collected slingshot (15 damage)
                    slingshot.collect();
                    player.equipSlingshot();
                }
            }
        }

        // Check player collecting elite armors
        if (eliteArmors) {
            for (const eliteArmor of eliteArmors) {
                if (eliteArmor.isCollected) continue;

                const playerBox = player.getBounds();
                const armorBox = eliteArmor.getBounds();

                if (this.boxesOverlap(playerBox, armorBox)) {
                    // Player collected elite armor (+30 HP, thorns)
                    eliteArmor.collect();
                    player.equipEliteArmor();
                }
            }
        }

        // Check player collecting elite swords
        if (eliteSwords) {
            for (const eliteSword of eliteSwords) {
                if (eliteSword.isCollected) continue;

                const playerBox = player.getBounds();
                const swordBox = eliteSword.getBounds();

                if (this.boxesOverlap(playerBox, swordBox)) {
                    // Player collected elite sword (20 damage)
                    eliteSword.collect();
                    player.equipEliteSword();
                }
            }
        }
    }

    // Clean up dead enemies
    cleanupDeadEnemies(enemies) {
        // Remove enemies that have been dead for a while
        return enemies.filter(enemy => {
            if (!enemy.isAlive) {
                // Could add a death timer here if you want bodies to remain briefly
                return false; // Remove immediately for now
            }
            return true;
        });
    }
}
