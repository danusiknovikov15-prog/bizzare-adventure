/**
 * ProgressManager - handles saving and loading game progress to backend
 */

export class ProgressManager {
    constructor(game) {
        this.game = game;
        this.sessionId = null;
        this.saveInterval = null;
        this.lastSaveTime = 0;
        this.saveFrequency = 10000; // Auto-save every 10 seconds

        // Track statistics
        this.sessionStats = {
            kills: 0,
            deaths: 0,
            levelsCompleted: 0,
            startTime: Date.now(),
        };
    }

    /**
     * Get CSRF token from cookies
     */
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    /**
     * Start a new game session
     */
    async startSession() {
        try {
            const response = await fetch('/api/session/start/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (data.success) {
                this.sessionId = data.session_id;
                console.log('Game session started:', this.sessionId);

                // Start auto-save
                this.startAutoSave();
            }
        } catch (error) {
            console.error('Failed to start session:', error);
        }
    }

    /**
     * End the current game session
     */
    async endSession() {
        if (!this.sessionId) return;

        this.stopAutoSave();

        const duration = Math.floor((Date.now() - this.sessionStats.startTime) / 1000);

        try {
            await fetch('/api/session/end/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    duration: duration,
                    levels_completed: this.sessionStats.levelsCompleted,
                    kills: this.sessionStats.kills,
                    deaths: this.sessionStats.deaths,
                }),
            });
            console.log('Game session ended');
        } catch (error) {
            console.error('Failed to end session:', error);
        }
    }

    /**
     * Load progress from server
     */
    async loadProgress() {
        try {
            const response = await fetch('/api/load/');
            const data = await response.json();

            if (data.success) {
                console.log('Progress loaded:', data);
                return {
                    currentLevel: data.current_level,
                    maxLevelReached: data.max_level_reached,
                    totalKills: data.total_kills,
                    totalDeaths: data.total_deaths,
                    totalBossKills: data.total_boss_kills,
                    inventory: data.inventory,
                    levelProgress: data.level_progress,
                };
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        }

        return null;
    }

    /**
     * Save current game progress
     */
    async saveProgress() {
        const now = Date.now();
        if (now - this.lastSaveTime < 5000) {
            // Don't save more often than every 5 seconds
            return;
        }

        this.lastSaveTime = now;

        const progressData = this.collectProgressData();

        try {
            const response = await fetch('/api/save/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCookie('csrftoken'),
                },
                body: JSON.stringify(progressData),
            });

            const data = await response.json();
            if (data.success) {
                console.log('Progress saved successfully');
            } else {
                console.error('Failed to save progress:', data.error);
            }
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    }

    /**
     * Collect current game data for saving
     */
    collectProgressData() {
        const game = this.game;

        // Get current level index (1-based)
        const currentLevel = game.currentLevelIndex + 1;

        // Collect inventory data
        const inventory = [];
        if (game.player && game.player.hotbar) {
            for (let i = 0; i < game.player.hotbar.slots.length; i++) {
                const item = game.player.hotbar.slots[i];
                if (item) {
                    inventory.push({
                        item_type: item.type || 'unknown',
                        item_id: item.id || item.name || `item_${i}`,
                        quantity: item.quantity || 1,
                        equipped: i === game.player.hotbar.selectedSlot,
                    });
                }
            }
        }

        // Collect level stats (simplified for now)
        const levelStats = {};
        // You can expand this to track detailed per-level statistics

        return {
            current_level: currentLevel,
            total_kills: this.sessionStats.kills,
            total_deaths: this.sessionStats.deaths,
            total_boss_kills: 0, // Track this separately if needed
            inventory: inventory,
            level_stats: levelStats,
        };
    }

    /**
     * Start auto-save timer
     */
    startAutoSave() {
        this.stopAutoSave(); // Clear any existing timer

        this.saveInterval = setInterval(() => {
            this.saveProgress();
        }, this.saveFrequency);

        console.log('Auto-save enabled (every 10 seconds)');
    }

    /**
     * Stop auto-save timer
     */
    stopAutoSave() {
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
    }

    /**
     * Record player death
     */
    recordDeath() {
        this.sessionStats.deaths++;
    }

    /**
     * Record enemy kill
     */
    recordKill() {
        this.sessionStats.kills++;
    }

    /**
     * Record level completion
     */
    recordLevelComplete() {
        this.sessionStats.levelsCompleted++;
        this.saveProgress(); // Save immediately on level complete
    }

    /**
     * Apply loaded progress to game
     */
    applyProgressToGame(progress) {
        if (!progress) return;

        // Set current level
        if (progress.currentLevel > 1) {
            this.game.currentLevelIndex = progress.currentLevel - 1;
            console.log(`Resuming at level ${progress.currentLevel}`);
        }

        // Restore inventory
        if (progress.inventory && progress.inventory.length > 0 && this.game.player) {
            // Clear current hotbar
            for (let i = 0; i < this.game.player.hotbar.slots.length; i++) {
                this.game.player.hotbar.slots[i] = null;
            }

            // Restore saved items
            for (const item of progress.inventory) {
                // You'll need to implement item restoration based on your item system
                // This is a placeholder
                console.log('Restoring item:', item);
            }
        }

        console.log('Progress applied to game');
    }
}
