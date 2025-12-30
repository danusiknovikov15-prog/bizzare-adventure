// Item Factory - Centralized item creation system
import { HealthPotion } from '../entities/HealthPotion.js';
import { Armor } from '../entities/Armor.js';
import { Sword } from '../entities/Sword.js';
import { EnemySword } from '../entities/EnemySword.js';
import { Slingshot } from '../entities/Slingshot.js';
import { EliteArmor } from '../entities/EliteArmor.js';
import { EliteSword } from '../entities/EliteSword.js';

export class ItemFactory {
    constructor() {
        // Register all item types with their classes
        this.itemTypes = {
            'healthPotion': HealthPotion,
            'armor': Armor,
            'sword': Sword,
            'enemySword': EnemySword,
            'slingshot': Slingshot,
            'eliteArmor': EliteArmor,
            'eliteSword': EliteSword
        };

        // Standard drop offset from enemy center
        this.dropOffset = {
            x: -10,
            y: -10
        };

        console.log('ItemFactory initialized');
    }

    /**
     * Create an item of the specified type at given coordinates
     * @param {string} type - Item type (healthPotion, armor, sword, etc.)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Object|null} Created item instance or null if type unknown
     */
    createItem(type, x, y) {
        const ItemClass = this.itemTypes[type];
        if (!ItemClass) {
            console.error(`Unknown item type: ${type}`);
            return null;
        }
        return new ItemClass(x, y);
    }

    /**
     * Calculate drop position from enemy center
     * @param {Object} enemy - Enemy entity
     * @returns {Object} Position {x, y} for item drop
     */
    getDropPosition(enemy) {
        return {
            x: enemy.x + enemy.width / 2 + this.dropOffset.x,
            y: enemy.y + enemy.height / 2 + this.dropOffset.y
        };
    }

    /**
     * Get mapping from item type to entity manager category
     * @returns {Object} Map of item types to category names
     */
    getCategoryMap() {
        return {
            'healthPotion': 'potions',
            'armor': 'armors',
            'sword': 'swords',
            'enemySword': 'enemySwords',
            'slingshot': 'slingshots',
            'eliteArmor': 'eliteArmors',
            'eliteSword': 'eliteSwords'
        };
    }
}
