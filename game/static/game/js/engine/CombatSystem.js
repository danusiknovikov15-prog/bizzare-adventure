// Combat system for handling player-enemy interactions
export class CombatSystem {
    constructor() {
        console.log('CombatSystem initialized');
        this.pvpEnabled = false;
        this.gameMode = 'coop'; // 'coop' or 'pvp'
        this.networkManager = null;
    }

    /**
     * Enable PvP mode for multiplayer
     */
    enablePvP(networkManager) {
        this.pvpEnabled = true;
        this.gameMode = 'pvp';
        this.networkManager = networkManager;
        console.log('[CombatSystem] PvP mode enabled');
    }

    /**
     * Set to Co-op mode
     */
    enableCoop(networkManager) {
        this.pvpEnabled = false;
        this.gameMode = 'coop';
        this.networkManager = networkManager;
        console.log('[CombatSystem] Co-op mode enabled');
    }

    // Check if two boxes overlap (AABB collision)
    boxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }

    /**
     * Check PvP combat between local player and remote players
     */
    checkPvPCombat(player, remotePlayers, deltaTime) {
        if (!this.pvpEnabled || !player.isAlive) return;

        // Check player attack hitting other players
        if (player.isAttacking && !player.hasHitThisAttack) {
            const attackBox = player.getAttackHitbox();
            if (attackBox) {
                for (const [playerId, remotePlayer] of remotePlayers) {
                    if (!remotePlayer.isAlive() || playerId === player.playerId) continue;

                    const targetBox = remotePlayer.getHitbox();
                    if (this.boxesOverlap(attackBox, targetBox)) {
                        // Hit another player!
                        console.log(`[PvP] Player ${player.playerId} hit Player ${playerId} for ${player.attackDamage} damage!`);

                        // Send damage over network
                        if (this.networkManager) {
                            this.networkManager.sendDamage(playerId, 'player', player.attackDamage);
                        }

                        player.hasHitThisAttack = true;
                        break;
                    }
                }
            }
        }

        // Check player projectiles hitting other players
        if (player.projectiles && player.projectiles.length > 0) {
            for (const projectile of player.projectiles) {
                if (projectile.hasHit) continue;

                const projBox = {
                    x: projectile.x - projectile.radius,
                    y: projectile.y - projectile.radius,
                    width: projectile.radius * 2,
                    height: projectile.radius * 2
                };

                for (const [playerId, remotePlayer] of remotePlayers) {
                    if (!remotePlayer.isAlive() || playerId === player.playerId) continue;

                    const targetBox = remotePlayer.getHitbox();
                    if (this.boxesOverlap(projBox, targetBox)) {
                        console.log(`[PvP] Player ${player.playerId} projectile hit Player ${playerId} for ${projectile.damage} damage!`);

                        if (this.networkManager) {
                            this.networkManager.sendDamage(playerId, 'player', projectile.damage);
                        }

                        projectile.hasHit = true;
                        break;
                    }
                }
            }
        }
    }

    // Handle combat between player and enemies
    update(player, enemies, potions, armors, swords, enemySwords, slingshots, eliteArmors, eliteSwords, elementalShards, totems, unoCards = [], deltaTime = 0.016) {
        if (!player.isAlive) return;

        // Check player attack hitting enemies
        if (player.isAttacking && !player.hasHitThisAttack) {
            const attackBox = player.getAttackHitbox();
            if (attackBox) {
                console.log(`⚔️ Player attacking! Checking ${enemies.length} enemies for collision`);
                for (const enemy of enemies) {
                    if (!enemy.isAlive || enemy.isBeingFinished) continue;

                    const enemyBox = enemy.getBounds();
                    console.log(`Checking enemy ${enemy.constructor.name} at (${enemyBox.x}, ${enemyBox.y}) size ${enemyBox.width}x${enemyBox.height}`);
                    if (this.boxesOverlap(attackBox, enemyBox)) {
                        // Player hit the enemy!
                        console.log(`✅ Hit detected on ${enemy.constructor.name}!`);

                        // Check if enemy can be finished (low HP)
                        if (enemy.canBeFinished && enemy.canBeFinished()) {
                            // Perform finisher!
                            player.performFinisher(enemy);
                            player.hasHitThisAttack = true;
                            console.log(`💀 FINISHER on ${enemy.constructor.name}!`);
                            break;
                        }

                        // Normal damage
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
                    // Pass enemy as attacker for UNO Reverse Card
                    if (player.takeDamage(enemy.damage, enemy)) {
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
                    if (!enemy.isAlive || enemy.isBeingFinished) continue;

                    const enemyBox = enemy.getBounds();
                    if (this.boxesOverlap(projBox, enemyBox)) {
                        // Projectile hit enemy!
                        console.log(`💥 Player projectile hit enemy! Damage: ${projectile.damage}, Enemy HP before: ${enemy.health}`);

                        // Check for finisher (slingshot headshot)
                        const healthAfterDamage = enemy.health - projectile.damage;
                        const healthPercentAfter = healthAfterDamage / enemy.maxHealth;
                        if (healthPercentAfter <= 0.25 && enemy.canBeFinished) {
                            // Apply damage first, then check if can be finished
                            enemy.takeDamage(projectile.damage);
                            if (enemy.canBeFinished()) {
                                player.performFinisher(enemy);
                                console.log(`🎯 SLINGSHOT FINISHER on ${enemy.constructor.name}!`);
                            }
                        } else {
                            enemy.takeDamage(projectile.damage);
                        }

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
                        // Projectile hit player! Pass enemy as attacker for UNO Reverse
                        if (player.takeDamage(projectile.damage, enemy)) {
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
                        // Player in fire zone - apply damage (pass enemy as attacker for UNO Reverse)
                        if (!player.fireDamageTimer || player.fireDamageTimer <= 0) {
                            player.takeDamage(zone.damage, enemy);
                            player.fireDamageTimer = 1.0; // Damage once per second
                            console.log('🔥 Player taking fire damage!');
                        }
                    }
                }
            }
        }

        // Decrease fire damage timer
        if (player.fireDamageTimer > 0) {
            player.fireDamageTimer -= deltaTime;
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

                    // Use pullRadius for pull range (1300 pixels), radius for damage (60 pixels)
                    const pullRange = hole.pullRadius || hole.radius;
                    if (distance < pullRange) {
                        // Apply pull force (stronger when closer)
                        const pullStrength = hole.pullStrength * (1 - distance / pullRange);
                        player.vx += (dx / distance) * pullStrength * deltaTime;
                        player.vy += (dy / distance) * pullStrength * deltaTime;
                    }
                }
            }
        }

        // Check zombie archer arrows hitting player
        for (const enemy of enemies) {
            if (enemy.arrows && enemy.arrows.length > 0) {
                const playerBox = player.getBounds();
                for (const arrow of enemy.arrows) {
                    // Arrow hitbox
                    const arrowBox = {
                        x: arrow.x - arrow.length / 2,
                        y: arrow.y - arrow.width / 2,
                        width: arrow.length,
                        height: arrow.width
                    };

                    if (this.boxesOverlap(playerBox, arrowBox)) {
                        // Arrow hit player! Pass enemy as attacker for UNO Reverse
                        if (player.takeDamage(arrow.damage, enemy)) {
                            console.log(`🏹 Zombie archer arrow hit player for ${arrow.damage} damage!`);
                        }
                        // Remove arrow after hit
                        arrow.lifetime = 0;
                        break;
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

        // Check player collecting elemental shards
        if (elementalShards) {
            for (const shard of elementalShards) {
                if (shard.isCollected) continue;

                const playerBox = player.getBounds();
                const shardBox = shard.getBounds();

                if (this.boxesOverlap(playerBox, shardBox)) {
                    // Player collected elemental shard
                    shard.collect();
                    player.collectElementalShard(shard.elementType);
                    console.log(`✨ Player collected ${shard.elementType} elemental shard!`);
                }
            }
        }

        // Check player collecting totems
        if (totems) {
            for (const totem of totems) {
                if (totem.isCollected) continue;

                const playerBox = player.getBounds();
                const totemBox = totem.getBounds();

                if (this.boxesOverlap(playerBox, totemBox)) {
                    // Player collected totem
                    totem.collect();
                    player.equipTotem();
                }
            }
        }

        // Check player collecting UNO Reverse Cards
        if (unoCards) {
            for (const card of unoCards) {
                if (card.isCollected) continue;

                const playerBox = player.getBounds();
                const cardBox = card.getBounds();

                if (this.boxesOverlap(playerBox, cardBox)) {
                    // Player collected UNO Reverse Card
                    card.collect();
                    player.equipUnoReverse();
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
