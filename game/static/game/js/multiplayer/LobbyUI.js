/**
 * LobbyUI - Handles lobby interface for multiplayer
 */
export class LobbyUI {
    constructor(roomCode, isHost) {
        this.roomCode = roomCode;
        this.isHost = isHost;
        this.socket = null;
        this.players = [];
        this.roomSettings = {
            mode: 'coop',
            level: 1,
            isPrivate: false
        };

        // Callbacks
        this.onGameStart = null;
        this.onPlayerUpdate = null;
        this.onSettingsUpdate = null;
        this.onError = null;

        // DOM elements (will be set after init)
        this.elements = {};
        this.roomPollTimer = null;
    }

    /**
     * Initialize lobby connection
     */
    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/lobby/${this.roomCode}/`;

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log('[LobbyUI] Connected to lobby');
            this.startRoomPolling();
        };

        this.socket.onclose = (event) => {
            console.log('[LobbyUI] Disconnected from lobby');
            this.stopRoomPolling();
        };

        this.socket.onerror = (error) => {
            console.error('[LobbyUI] WebSocket error:', error);
            if (this.onError) {
                this.onError(error);
            }
        };

        this.socket.onmessage = (event) => {
            this.handleMessage(JSON.parse(event.data));
        };
    }

    startRoomPolling() {
        this.stopRoomPolling();
        this.roomPollTimer = setInterval(async () => {
            try {
                const response = await fetch('/api/room/find/' + encodeURIComponent(this.roomCode) + '/');
                const data = await response.json();
                if (data.success && data.room) this.updateRoomState(data.room);
            } catch (e) {
                // WebSocket remains the primary transport; polling is only a fallback.
            }
        }, 2000);
    }

    stopRoomPolling() {
        if (this.roomPollTimer) {
            clearInterval(this.roomPollTimer);
            this.roomPollTimer = null;
        }
    }

    /**
     * Handle incoming messages
     */
    handleMessage(data) {
        switch (data.type) {
            case 'room.state':
            case 'room.update':
                this.updateRoomState(data.room);
                break;

            case 'game.start':
                if (this.onGameStart) {
                    this.onGameStart(data.room_code);
                }
                break;

            case 'player.joined':
                this.addPlayer(data.player);
                break;

            case 'player.left':
                this.removePlayer(data.player_id);
                break;

            case 'chat.message':
                this.addChatMessage(data.username, data.message);
                break;
        }
    }

    /**
     * Update room state
     */
    updateRoomState(room) {
        if (!room) return;

        this.players = room.players || [];
        this.roomSettings = {
            mode: room.mode,
            level: room.level,
            isPrivate: room.is_private
        };

        this.renderPlayers();
        this.renderSettings();

        if (this.onPlayerUpdate) {
            this.onPlayerUpdate(this.players);
        }
        if (this.onSettingsUpdate) {
            this.onSettingsUpdate(this.roomSettings);
        }
    }

    /**
     * Add player to list
     */
    addPlayer(player) {
        const existing = this.players.find(p => p.id === player.id);
        if (!existing) {
            this.players.push(player);
            this.renderPlayers();
        }
    }

    /**
     * Remove player from list
     */
    removePlayer(playerId) {
        this.players = this.players.filter(p => p.id !== playerId);
        this.renderPlayers();
    }

    /**
     * Send ready toggle
     */
    toggleReady() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'room.ready' }));
        }
    }

    /**
     * Send start game (host only)
     */
    startGame() {
        if (!this.isHost) return;

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'room.start' }));
        }
    }

    /**
     * Update room settings (host only)
     */
    updateSettings(settings) {
        if (!this.isHost) return;

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'room.settings',
                settings
            }));
        }
    }

    /**
     * Send chat message
     */
    sendChat(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'chat.message',
                message
            }));
        }
    }

    /**
     * Render players list
     */
    renderPlayers() {
        const container = this.elements.playersList;
        if (!container) return;

        container.innerHTML = '';

        const slotColors = ['#4a90d9', '#d94a4a', '#4ad94a', '#d9d94a'];

        for (let i = 0; i < 4; i++) {
            const player = this.players.find(p => p.slot === i);
            const slotDiv = document.createElement('div');
            slotDiv.className = 'player-slot' + (player ? ' occupied' : ' empty');
            slotDiv.style.borderColor = slotColors[i];

            if (player) {
                const statusIcon = player.is_ready ? '✓' : '○';
                const hostBadge = player.is_host ? ' [HOST]' : '';
                slotDiv.innerHTML = `
                    <span class="player-status" style="color: ${player.is_ready ? '#4a4' : '#aaa'}">${statusIcon}</span>
                    <span class="player-name" style="color: ${slotColors[i]}">${player.username}${hostBadge}</span>
                `;
            } else {
                slotDiv.innerHTML = `<span class="empty-slot">Slot ${i + 1} - Waiting...</span>`;
            }

            container.appendChild(slotDiv);
        }

        // Update start button
        this.updateStartButton();
    }

    /**
     * Render settings
     */
    renderSettings() {
        if (this.elements.modeSelect) {
            this.elements.modeSelect.value = this.roomSettings.mode;
            this.elements.modeSelect.disabled = !this.isHost;
        }

        if (this.elements.levelSelect) {
            this.elements.levelSelect.value = this.roomSettings.level;
            this.elements.levelSelect.disabled = !this.isHost;
        }

        if (this.elements.privateCheck) {
            this.elements.privateCheck.checked = this.roomSettings.isPrivate;
            this.elements.privateCheck.disabled = !this.isHost;
        }
    }

    /**
     * Update start button state
     */
    updateStartButton() {
        const btn = this.elements.startButton;
        if (!btn) return;

        if (!this.isHost) {
            btn.style.display = 'none';
            return;
        }

        btn.style.display = 'block';

        // Check if all non-host players are ready
        const nonHostPlayers = this.players.filter(p => !p.is_host);
        const allReady = nonHostPlayers.length > 0 && nonHostPlayers.every(p => p.is_ready);

        btn.disabled = !allReady;
        btn.textContent = allReady ? 'START GAME' : 'Waiting for players...';
    }

    /**
     * Add chat message to UI
     */
    addChatMessage(username, message) {
        const container = this.elements.chatMessages;
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message';
        msgDiv.innerHTML = `<strong>${username}:</strong> ${this.escapeHtml(message)}`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    /**
     * Escape HTML for safety
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Copy room code to clipboard
     */
    copyRoomCode() {
        navigator.clipboard.writeText(this.roomCode).then(() => {
            console.log('Room code copied!');
        });
    }

    /**
     * Disconnect from lobby
     */
    disconnect() {
        this.stopRoomPolling();
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    /**
     * Bind UI elements
     */
    bindElements(elements) {
        this.elements = elements;

        // Bind events
        if (elements.readyButton) {
            elements.readyButton.onclick = () => this.toggleReady();
        }

        if (elements.startButton) {
            elements.startButton.onclick = () => this.startGame();
        }

        if (elements.copyCodeButton) {
            elements.copyCodeButton.onclick = () => this.copyRoomCode();
        }

        if (elements.modeSelect && this.isHost) {
            elements.modeSelect.onchange = (e) => {
                this.updateSettings({ mode: e.target.value });
            };
        }

        if (elements.levelSelect && this.isHost) {
            elements.levelSelect.onchange = (e) => {
                this.updateSettings({ level: parseInt(e.target.value) });
            };
        }

        if (elements.privateCheck && this.isHost) {
            elements.privateCheck.onchange = (e) => {
                this.updateSettings({ is_private: e.target.checked });
            };
        }

        if (elements.chatInput && elements.chatSendButton) {
            const sendChat = () => {
                const msg = elements.chatInput.value.trim();
                if (msg) {
                    this.sendChat(msg);
                    elements.chatInput.value = '';
                }
            };

            elements.chatSendButton.onclick = sendChat;
            elements.chatInput.onkeypress = (e) => {
                if (e.key === 'Enter') sendChat();
            };
        }
    }
}
