// Inventory system for storing items
export class Inventory {
    constructor(maxSlots = 5) {
        this.maxSlots = maxSlots;
        this.items = {}; // Store items by type with count

        console.log(`Inventory created with ${maxSlots} slots`);
    }

    // Add item to inventory
    addItem(itemType, amount = 1) {
        if (!this.items[itemType]) {
            this.items[itemType] = 0;
        }

        this.items[itemType] += amount;
        console.log(`Added ${amount}x ${itemType}. Total: ${this.items[itemType]}`);
        return true;
    }

    // Remove item from inventory
    removeItem(itemType, amount = 1) {
        if (!this.items[itemType] || this.items[itemType] < amount) {
            console.log(`Not enough ${itemType} in inventory`);
            return false;
        }

        this.items[itemType] -= amount;
        console.log(`Removed ${amount}x ${itemType}. Remaining: ${this.items[itemType]}`);

        // Clean up if count reaches 0
        if (this.items[itemType] === 0) {
            delete this.items[itemType];
        }

        return true;
    }

    // Get item count
    getItemCount(itemType) {
        return this.items[itemType] || 0;
    }

    // Check if has item
    hasItem(itemType, amount = 1) {
        return this.getItemCount(itemType) >= amount;
    }

    // Get all items
    getAllItems() {
        return { ...this.items };
    }

    // Get total number of unique items
    getUniqueItemCount() {
        return Object.keys(this.items).length;
    }

    // Clear inventory
    clear() {
        this.items = {};
        console.log('Inventory cleared');
    }
}
