/**
 * NetworkManager - Handles WebSocket connection and message routing for multiplayer
 */
export class NetworkManager {
    constructor() {
        this.socket = null;
        this.roomCode = null;
        this.isHost = false;
        this.playerId = null;
        this.playerSlot = 0;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;

        // Event callbacks
        this.onConnect = null;
        this.onDisconnect = null;
        this.onPlayerState = null;
        this.onPlayerInput = null;
        this.onGameState = null;
        this.onDamageDealt = null;
        this.onEntityDeath = null;
        this.onItemPickup = null;
        this.onLevelComplete = null;
        this.onGameOver = null;
        this.onPlayerJoined = null;
        this.onPlayerLeft = null;
        this.onPlayerDisconnected = null;
        this.onError = null;
        this.onVoiceSignal = null;
        this.onMultiplayerEvent = null;

        // State sync timing
        this.lastStateSend = 0;
        this.stateSendInterval = 50; // 20 Hz
        this.lastGameStateSend = 0;
        this.gameStateSendInterval = 100; // 10 Hz (host only)

        // Ping tracking
        this.ping = 0;
        this.lastPingTime = 0;
    }

    /**
     * Connect to game WebSocket
     */
    connect(roomCode, playerId, playerSlot, isHost) {
        this.roomCode = roomCode;
        this.playerId = playerId;
        this.playerSlot = playerSlot;
        this.isHost = isHost;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/game/${roomCode}/`;

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log('[NetworkManager] Connected to game server');
            this.connected = true;
            this.reconnectAttempts = 0;

            if (this.onConnect) {
                this.onConnect();
            }
        };

        this.socket.onclose = (event) => {
            console.log('[NetworkManager] Disconnected:', event.code, event.reason);
            this.connected = false;

            if (this.onDisconnect) {
                this.onDisconnect(event);
            }

            // Attempt reconnect
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                console.log(`[NetworkManager] Reconnecting... attempt ${this.reconnectAttempts}`);
                setTimeout(() => {
                    this.connect(this.roomCode, this.playerId, this.playerSlot, this.isHost);
                }, this.reconnectDelay * this.reconnectAttempts);
            }
        };

        this.socket.onerror = (error) => {
            console.error('[NetworkManager] WebSocket error:', error);
            if (this.onError) {
                this.onError(error);
            }
        };

        this.socket.onmessage = (event) => { try { this.handleMessage(JSON.parse(event.data)); } catch (e) { console.error('[NetworkManager] Invalid message', e); } };
    }

    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.connected = false;
    }

    /**
     * Handle incoming messages
     */
    handleMessage(data) {
        const type = data.type;

        switch (type) {
            case 'game.connected':
                console.log('[NetworkManager] Game connected:', data.player);
                break;

            case 'multiplayer.event':
                if (this.onMultiplayerEvent) this.onMultiplayerEvent(data.event);
                break;

            case 'voice.signal':
                if (this.onVoiceSignal) {
                    this.onVoiceSignal(data.sender_id, data.signal);
                }
                break;

            case 'player.state':
                if (this.onPlayerState) {
                    this.onPlayerState(data.player_id, data.state);
                }
                break;

            case 'player.input':
                if (this.onPlayerInput) {
                    this.onPlayerInput(data.player_id, data.input);
                }
                break;

            case 'game.state':
                if (this.onGameState) {
                    this.onGameState(data.state);
                }
                break;

            case 'damage.dealt':
                if (this.onDamageDealt) {
                    this.onDamageDealt(data.attacker_id, data.target_id, data.target_type, data.damage);
                }
                break;

            case 'entity.death':
                if (this.onEntityDeath) {
                    this.onEntityDeath(data.entity_id, data.entity_type, data.killer_id);
                }
                break;

            case 'item.pickup':
                if (this.onItemPickup) {
                    this.onItemPickup(data.player_id, data.item_id);
                }
                break;

            case 'level.complete':
                if (this.onLevelComplete) {
                    this.onLevelComplete(data.next_level, data.finished);
                }
                break;

            case 'game.over':
                if (this.onGameOver) {
                    this.onGameOver(data.reason);
                }
                break;

            case 'player.joined':
                if (this.onPlayerJoined) {
                    this.onPlayerJoined(data.player);
                }
                break;

            case 'player.left':
                if (this.onPlayerLeft) {
                    this.onPlayerLeft(data.player_id);
                }
                break;

            case 'player.disconnected':
                if (this.onPlayerDisconnected) {
                    this.onPlayerDisconnected(data.player_id, data.username);
                }
                break;

            default:
                console.log('[NetworkManager] Unknown message type:', type, data);
        }
    }

    sendMultiplayerEvent(event) {
        this.send('multiplayer.event', { event });
    }

    /**
     * Send message to server
     */
    send(type, data = {}) {
        if (!this.connected || !this.socket) {
            console.warn('[NetworkManager] Cannot send - not connected');
            return;
        }

        this.socket.send(JSON.stringify({
            type,
            ...data
        }));
    }

    /**
     * Send player state (position, health, animation) - rate limited
     */
    sendPlayerState(state) {
        const now = performance.now();
        if (now - this.lastStateSend < this.stateSendInterval) {
            return;
        }
        this.lastStateSend = now;

        this.send('player.state', { state });
    }

    /**
     * Send player input (immediate)
     */
    sendPlayerInput(input) {
        this.send('player.input', { input });
    }

    /**
     * Send game state (enemies, items) - host only, rate limited
     */
    sendGameState(state) {
        if (!this.isHost) return;

        const now = performance.now();
        if (now - this.lastGameStateSend < this.gameStateSendInterval) {
            return;
        }
        this.lastGameStateSend = now;

        this.send('game.state', { state });
    }

    /**
     * Send damage event (immediate)
     */
    sendDamage(targetId, targetType, damage) {
        this.send('damage.dealt', {
            target_id: targetId,
            target_type: targetType,
            damage
        });
    }

    /**
     * Send entity death event (immediate)
     */
    sendEntityDeath(entityId, entityType, killerId) {
        this.send('entity.death', {
            entity_id: entityId,
            entity_type: entityType,
            killer_id: killerId
        });
    }

    /**
     * Send item pickup event (immediate)
     */
    sendItemPickup(itemId) {
        this.send('item.pickup', { item_id: itemId });
    }

    /**
     * Send level complete (host only)
     */
    sendLevelComplete() {
        if (!this.isHost) return;
        this.send('level.complete');
    }

    /**
     * Send game over (host only)
     */
    sendGameOver(reason) {
        if (!this.isHost) return;
        this.send('game.over', { reason });
    }

    /**
     * Serialize player state for network transmission
     */
    static serializePlayerState(player) {
        return {
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
            anim: player.currentAnimation || 'idle'
        };
    }

    /**
     * Serialize game state (enemies, items) for network transmission
     */
    static serializeGameState(enemies, items) {
        const enemyStates = enemies.map(e => ({
            id: e.id,
            x: Math.round(e.x),
            y: Math.round(e.y),
            hp: e.health,
            state: e.currentState || 'idle'
        }));

        const itemStates = items.map(i => ({
            id: i.id,
            x: Math.round(i.x),
            y: Math.round(i.y),
            type: i.type,
            active: i.active ? 1 : 0
        }));

        return { enemies: enemyStates, items: itemStates };
    }
}
