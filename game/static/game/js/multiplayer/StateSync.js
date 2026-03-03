/**
 * StateSync - Handles game state synchronization between clients
 */
export class StateSync {
    constructor(networkManager, isHost) {
        this.network = networkManager;
        this.isHost = isHost;

        // Remote players map: playerId -> RemotePlayer
        this.remotePlayers = new Map();

        // Enemy state buffer (for non-host clients)
        this.enemyStates = new Map();
        this.itemStates = new Map();

        // Sync callbacks
        this.onRemotePlayerUpdate = null;
        this.onEnemyUpdate = null;
        this.onItemUpdate = null;
        this.onDamage = null;
        this.onDeath = null;

        // Setup network callbacks
        this.setupNetworkCallbacks();
    }

    /**
     * Setup network event handlers
     */
    setupNetworkCallbacks() {
        this.network.onPlayerState = (playerId, state) => {
            this.handleRemotePlayerState(playerId, state);
        };

        this.network.onGameState = (state) => {
            if (!this.isHost) {
                this.handleGameState(state);
            }
        };

        this.network.onDamageDealt = (attackerId, targetId, targetType, damage) => {
            if (this.onDamage) {
                this.onDamage(attackerId, targetId, targetType, damage);
            }
        };

        this.network.onEntityDeath = (entityId, entityType, killerId) => {
            if (this.onDeath) {
                this.onDeath(entityId, entityType, killerId);
            }
        };

        this.network.onPlayerDisconnected = (playerId, username) => {
            this.remotePlayers.delete(playerId);
            console.log(`[StateSync] Player ${username} disconnected`);
        };
    }

    /**
     * Handle remote player state update
     */
    handleRemotePlayerState(playerId, state) {
        if (this.onRemotePlayerUpdate) {
            this.onRemotePlayerUpdate(playerId, state);
        }
    }

    /**
     * Handle game state from host
     */
    handleGameState(state) {
        // Update enemy states
        if (state.enemies) {
            for (const enemyState of state.enemies) {
                this.enemyStates.set(enemyState.id, enemyState);
            }
            if (this.onEnemyUpdate) {
                this.onEnemyUpdate(state.enemies);
            }
        }

        // Update item states
        if (state.items) {
            for (const itemState of state.items) {
                this.itemStates.set(itemState.id, itemState);
            }
            if (this.onItemUpdate) {
                this.onItemUpdate(state.items);
            }
        }
    }

    /**
     * Send local player state
     */
    sendPlayerState(player) {
        const state = {
            x: Math.round(player.x),
            y: Math.round(player.y),
            vx: Math.round(player.velocityX * 10) / 10,
            vy: Math.round(player.velocityY * 10) / 10,
            hp: player.health,
            maxHp: player.maxHealth,
            facing: player.facingRight ? 1 : 0,
            grounded: player.isGrounded ? 1 : 0,
            attacking: player.isAttacking ? 1 : 0,
            weapon: player.currentWeaponIndex || 0,
            anim: player.currentAnimation || 'idle',
            equippedClass: player.equippedClass || ''
        };

        this.network.sendPlayerState(state);
    }

    /**
     * Send game state (host only)
     */
    sendGameState(enemies, items) {
        if (!this.isHost) return;

        const state = {
            enemies: enemies.map(e => ({
                id: e.id,
                x: Math.round(e.x),
                y: Math.round(e.y),
                hp: e.health,
                state: e.currentState || 'idle',
                vx: Math.round((e.velocityX || 0) * 10) / 10,
                vy: Math.round((e.velocityY || 0) * 10) / 10
            })),
            items: items.map(i => ({
                id: i.id,
                x: Math.round(i.x),
                y: Math.round(i.y),
                type: i.type,
                active: i.active ? 1 : 0
            }))
        };

        this.network.sendGameState(state);
    }

    /**
     * Send damage event
     */
    sendDamage(targetId, targetType, damage) {
        this.network.sendDamage(targetId, targetType, damage);
    }

    /**
     * Send death event
     */
    sendDeath(entityId, entityType, killerId) {
        this.network.sendEntityDeath(entityId, entityType, killerId);
    }

    /**
     * Apply enemy state from network (non-host)
     */
    applyEnemyState(enemy, networkState) {
        if (!networkState) return;

        // Interpolate position
        const interpSpeed = 0.2;
        enemy.x += (networkState.x - enemy.x) * interpSpeed;
        enemy.y += (networkState.y - enemy.y) * interpSpeed;

        // Apply health
        enemy.health = networkState.hp;

        // Apply velocity
        if (networkState.vx !== undefined) {
            enemy.velocityX = networkState.vx;
        }
        if (networkState.vy !== undefined) {
            enemy.velocityY = networkState.vy;
        }
    }

    /**
     * Get enemy state from buffer
     */
    getEnemyState(enemyId) {
        return this.enemyStates.get(enemyId);
    }

    /**
     * Apply item state from network (non-host)
     */
    applyItemState(item, networkState) {
        if (!networkState) return;

        item.x = networkState.x;
        item.y = networkState.y;
        item.active = networkState.active === 1;
    }

    /**
     * Get item state from buffer
     */
    getItemState(itemId) {
        return this.itemStates.get(itemId);
    }

    /**
     * Clear all state
     */
    clear() {
        this.remotePlayers.clear();
        this.enemyStates.clear();
        this.itemStates.clear();
    }
}
