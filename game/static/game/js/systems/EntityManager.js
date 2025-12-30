// Entity Manager - Manages lifecycle of all game entities
export class EntityManager {
    constructor(game) {
        this.game = game;

        // Categories for different entity types
        this.categories = {
            enemies: [],
            potions: [],
            armors: [],
            swords: [],
            enemySwords: [],
            slingshots: [],
            eliteArmors: [],
            eliteSwords: []
        };

        console.log('EntityManager initialized');
    }

    /**
     * Add entity to a specific category
     * @param {string} category - Category name (enemies, potions, etc.)
     * @param {Object} entity - Entity to add
     */
    addEntity(category, entity) {
        if (!this.categories[category]) {
            console.error(`Unknown category: ${category}`);
            return;
        }

        this.categories[category].push(entity);
        this.game.addEntity(entity);
        console.log(`Added ${entity.constructor.name} to ${category}`);
    }

    /**
     * Remove entity from a specific category
     * @param {string} category - Category name
     * @param {Object} entity - Entity to remove
     */
    removeEntity(category, entity) {
        const arr = this.categories[category];
        const index = arr.indexOf(entity);
        if (index > -1) {
            arr.splice(index, 1);
            this.game.removeEntity(entity);
            console.log(`Removed ${entity.constructor.name} from ${category}`);
        }
    }

    /**
     * Get all entities in a category
     * @param {string} category - Category name
     * @returns {Array} Array of entities
     */
    getEntities(category) {
        return this.categories[category] || [];
    }

    /**
     * Clean up collected items in a specific category
     * @param {string} category - Category name
     * @returns {number} Number of entities removed
     */
    cleanupCollected(category) {
        const entities = this.categories[category];
        const toRemove = entities.filter(e => e.isCollected);

        for (const entity of toRemove) {
            this.removeEntity(category, entity);
        }

        if (toRemove.length > 0) {
            console.log(`Cleaned up ${toRemove.length} collected items from ${category}`);
        }

        return toRemove.length;
    }

    /**
     * Clean up all collected items across all item categories
     * @returns {number} Total number of entities removed
     */
    cleanupAllCollected() {
        const itemCategories = ['potions', 'armors', 'swords', 'enemySwords', 'slingshots', 'eliteArmors', 'eliteSwords'];
        let totalRemoved = 0;

        for (const category of itemCategories) {
            totalRemoved += this.cleanupCollected(category);
        }

        if (totalRemoved > 0) {
            console.log(`Total collected items cleaned up: ${totalRemoved}`);
        }

        return totalRemoved;
    }

    /**
     * Clear all entities from all categories
     */
    clear() {
        for (const category in this.categories) {
            this.categories[category] = [];
        }
        console.log('EntityManager cleared all categories');
    }

    /**
     * Get total count of entities across all categories
     * @returns {Object} Object with counts per category
     */
    getCounts() {
        const counts = {};
        for (const category in this.categories) {
            counts[category] = this.categories[category].length;
        }
        return counts;
    }
}
