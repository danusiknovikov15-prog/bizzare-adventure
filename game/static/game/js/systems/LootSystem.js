// Loot System - Manages loot tables and drop generation
export class LootSystem {
    constructor(itemFactory) {
        this.itemFactory = itemFactory;

        // Loot tables for each enemy type
        this.lootTables = {
            'Enemy': [
                { item: 'healthPotion', chance: 0.05 },  // 5% chance
                { item: 'armor', chance: 0.0 },  // Conditional on hasArmor
                { item: 'sword', chance: 0.10 }  // 10% chance
            ],
            'EliteEnemy': [
                { item: 'eliteArmor', chance: 0.50 },  // 50% chance - Elite Armor with spikes (+30 HP, thorns damage)
                { item: 'eliteSword', chance: 0.05 }   // 5% chance - Elite Sword (20 damage)
            ],
            'Boss': [
                { item: 'armor', chance: 1.0 },     // 100% chance
                { item: 'sword', chance: 0.50 },    // 50% chance
                { item: 'enemySword', chance: 0.10 }, // 10% chance
                { item: 'slingshot', chance: 0.05 },   // 5% chance
                { item: 'eliteSword', chance: 0.05 },  // 5% chance - Elite Sword (20 damage)
                { item: 'eliteArmor', chance: 0.05 }   // 5% chance - Elite Armor (+30 HP, thorns)
            ]
        };

        console.log('LootSystem initialized with loot tables:', Object.keys(this.lootTables));
    }

    /**
     * Generate loot drops for a defeated enemy
     * @param {Object} enemy - Enemy entity that was defeated
     * @returns {Array} Array of drop objects {type, x, y}
     */
    generateLoot(enemy) {
        const enemyType = enemy.constructor.name;
        const lootTable = this.lootTables[enemyType];

        if (!lootTable) {
            console.warn(`No loot table found for enemy type: ${enemyType}`);
            return [];
        }

        const drops = [];
        const dropPos = this.itemFactory.getDropPosition(enemy);

        for (const entry of lootTable) {
            // Special logic for armor - only drop if enemy has armor
            if (entry.item === 'armor') {
                if (enemy.hasArmor) {
                    drops.push({
                        type: entry.item,
                        x: dropPos.x,
                        y: dropPos.y
                    });
                }
                continue;
            }

            // Random chance check for all other items
            if (Math.random() < entry.chance) {
                drops.push({
                    type: entry.item,
                    x: dropPos.x,
                    y: dropPos.y
                });
            }
        }

        if (drops.length > 0) {
            console.log(`${enemyType} dropped ${drops.length} items:`, drops.map(d => d.type));
        }

        return drops;
    }

    /**
     * Add or modify loot table for an enemy type
     * @param {string} enemyType - Enemy class name
     * @param {Array} lootTable - Array of {item, chance} entries
     */
    setLootTable(enemyType, lootTable) {
        this.lootTables[enemyType] = lootTable;
        console.log(`Loot table updated for ${enemyType}`);
    }

    /**
     * Get loot table for an enemy type
     * @param {string} enemyType - Enemy class name
     * @returns {Array|null} Loot table or null if not found
     */
    getLootTable(enemyType) {
        return this.lootTables[enemyType] || null;
    }
}
