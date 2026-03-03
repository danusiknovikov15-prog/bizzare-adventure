// Inventory system for storing items in slots
export class Inventory {
    constructor(maxSlots = 10) {
        this.maxSlots = maxSlots;
        this.slots = new Array(maxSlots).fill(null); // Slot-based storage
        this.items = {}; // Legacy: Store items by type with count (for backwards compatibility)

        console.log(`Inventory created with ${maxSlots} slots`);
    }

    // Add item to the leftmost empty slot
    addItem(itemType, amount = 1) {
        // Legacy system - keep for backwards compatibility
        if (!this.items[itemType]) {
            this.items[itemType] = 0;
        }
        this.items[itemType] += amount;

        // New slot system - find leftmost empty slot
        let slotIndex = this.findItemSlot(itemType);

        if (slotIndex === -1) {
            // Item not in any slot yet, find empty slot
            slotIndex = this.findEmptySlot();
            if (slotIndex !== -1) {
                this.slots[slotIndex] = { type: itemType, count: amount };
                console.log(`Added ${amount}x ${itemType} to slot ${slotIndex}`);
            } else {
                console.log(`No empty slots for ${itemType}, but added to legacy inventory`);
            }
        } else {
            // Item already in a slot, increase count
            this.slots[slotIndex].count += amount;
            console.log(`Added ${amount}x ${itemType} to existing slot ${slotIndex}. Total: ${this.slots[slotIndex].count}`);
        }

        return true;
    }

    // Add item to a specific slot
    addItemToSlot(slotIndex, itemType, amount = 1) {
        if (slotIndex < 0 || slotIndex >= this.maxSlots) {
            console.log(`Invalid slot index: ${slotIndex}`);
            return false;
        }

        // Legacy system
        if (!this.items[itemType]) {
            this.items[itemType] = 0;
        }
        this.items[itemType] += amount;

        // Slot system
        if (this.slots[slotIndex] === null) {
            this.slots[slotIndex] = { type: itemType, count: amount };
        } else if (this.slots[slotIndex].type === itemType) {
            this.slots[slotIndex].count += amount;
        } else {
            // Slot occupied by different item - find another slot
            return this.addItem(itemType, amount);
        }

        console.log(`Added ${amount}x ${itemType} to slot ${slotIndex}`);
        return true;
    }

    // Find which slot contains an item type
    findItemSlot(itemType) {
        for (let i = 0; i < this.maxSlots; i++) {
            if (this.slots[i] && this.slots[i].type === itemType) {
                return i;
            }
        }
        return -1;
    }

    // Find the leftmost empty slot
    findEmptySlot() {
        for (let i = 0; i < this.maxSlots; i++) {
            if (this.slots[i] === null) {
                return i;
            }
        }
        return -1;
    }

    // Remove item from inventory
    removeItem(itemType, amount = 1) {
        if (!this.items[itemType] || this.items[itemType] < amount) {
            console.log(`Not enough ${itemType} in inventory`);
            return false;
        }

        // Legacy system
        this.items[itemType] -= amount;

        // Slot system
        const slotIndex = this.findItemSlot(itemType);
        if (slotIndex !== -1) {
            this.slots[slotIndex].count -= amount;
            if (this.slots[slotIndex].count <= 0) {
                this.slots[slotIndex] = null;
            }
        }

        console.log(`Removed ${amount}x ${itemType}. Remaining: ${this.items[itemType]}`);

        // Clean up legacy if count reaches 0
        if (this.items[itemType] === 0) {
            delete this.items[itemType];
        }

        return true;
    }

    // Get item count
    getItemCount(itemType) {
        return this.items[itemType] || 0;
    }

    // Get item in specific slot
    getSlotItem(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.maxSlots) {
            return null;
        }
        return this.slots[slotIndex];
    }

    // Check if has item
    hasItem(itemType, amount = 1) {
        return this.getItemCount(itemType) >= amount;
    }

    // Get all items (legacy)
    getAllItems() {
        return { ...this.items };
    }

    // Get all slots
    getAllSlots() {
        return [...this.slots];
    }

    // Get total number of unique items
    getUniqueItemCount() {
        return Object.keys(this.items).length;
    }

    // Clear inventory
    clear() {
        this.items = {};
        this.slots = new Array(this.maxSlots).fill(null);
        console.log('Inventory cleared');
    }
}
