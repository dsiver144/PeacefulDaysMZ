//=======================================================================
// * Plugin Name  : DSI_Sys2_ItemContainer.js
// * Last Updated : 7/29/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Item Container System
 * @help 
 * Empty Help
 * 
 */

const ContainerConfig = {
    unlockedRows: 1,
    maxSlotPerRow: 4,
    maxRows: 4,
    maxItemPerStacks: 100,
}

class ItemContainer extends SaveableObject {
    /**
     * This class handle Inventory system for Peaceful Days
     */
    constructor(unlockedRows = ContainerConfig.unlockedRows) {
        super();
        /** @type {Map<number, GameItem>} */
        this._items = new Map();
        /** @type {number} */
        this._unlockedRows = unlockedRows;
        /** @type {number} */
        this._pageIndex = 0;
        /** @type {string} */
        this._name = '';
        /** @type {number} */
        this._selectedSlotId = 0;
    }
    /**
     * Select a slot
     * @param {number} slotId 
     */
    select(slotId) {
        this._selectedSlotId = slotId;
    }
    /**
     * Get selecting item
     * @returns {GameItem}
     */
    selectingItem() {
        return this._items.get(this._selectedSlotId);
    }
    /**
     * Get container name
     * @returns {string}
     */
    name() {
        return this._name;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ["_unlockedRows", 0],
            ["_pageIndex", 0],
            ["_name", ''],
            ["_selectedIndex", 0],
        ]
    }
    /**
     * Add Item
     * @param {number} id 
     * @param {number} number 
     */
    addItem(id, number) {
        if (ItemDB.get(id) == null) {
            console.log('There is no ' + id + ' in Item Database!');
            return;
        }
        const slotId = this.findAvailableSlotId(id, number);
        if (slotId >= 0) {
            const bagItem = this._items.get(slotId) || new GameItem(id, 0);
            bagItem.addQuantity(number);
            this._items.set(slotId, bagItem);
            console.log(`> Container: ${bagItem.id} (${number}) has been added to #${slotId}! | Quantity: ${bagItem.quantity}`);
        } else {
            console.log(`> Container: Can't not add ${id} (${number})`);
        }
    }
    /**
     * Remove Item
     * @param {number} id 
     * @param {number} number 
     * @param {(item: BagItem) => boolean} conditionFunc 
     */
    removeItem(id, number, conditionFunc = null) {
        let totalNumber = number;
        for (let [slotId, bagItem] of this._items.entries()) {
            const conditionMet = conditionFunc ? conditionFunc(bagItem) : true;
            if (bagItem.id === id && conditionMet) {
                totalNumber = bagItem.removeQuantity(number);
                if (bagItem.quantity <= 0) {
                    this._items.delete(slotId);
                }
                if (totalNumber <= 0) {
                    break;
                }
            }
        };
    }
    /**
     * Check if this container has item with a specific amount.
     * @param {string} id 
     * @param {number} number 
     * @param {(item: BagItem) => boolean} conditionFunc 
     * @returns {boolean}
     */
    hasItem(id, number, conditionFunc = null) {
        let totalNumber = 0;
        for (let [slotId, bagItem] of this._items.entries()) {
            const conditionMet = conditionFunc ? conditionFunc(bagItem) : true;
            if (bagItem.id === id && conditionMet) {
                totalNumber += bagItem.quantity;
            }
        }
        return totalNumber >= number;
    }
    /**
     * Find available slot id to add item to
     * @param {number} id 
     * @param {number} number 
     * @returns {number}
     */
    findAvailableSlotId(id, number) {
        let emptySlots = [];
        for (let slotId = 0; slotId <= this.maxAvailableIndex(); slotId++) {
            const bagItem = this._items.get(slotId);
            if (bagItem) {
                if (bagItem.id == id && bagItem.quantity + number <= ContainerConfig.maxItemPerStacks) {
                    return slotId;
                }
            } else {
                emptySlots.push(+slotId);
            }
        }
        if (emptySlots.length > 0) return emptySlots[0];
        return -1;
    }
    /**
     * Check if a slot is available
     * @param {number} slotId 
     */
    isSlotAvailable(slotId) {
        return slotId <= this.maxAvailableIndex() && !this._items.get(slotId);
    }
    /**
     * Get the max bag slot index at the moment
     * @returns {number}
     */
    maxAvailableIndex() {
        return ContainerConfig.maxSlotPerRow * this._unlockedRows - 1;
    }
    /**
     * Get the max slot of a page
     * @returns {number}
     */
    maxPageSlots() {
        return ContainerConfig.maxRows * ContainerConfig.maxSlotPerRow;
    }
    /**
     * Get the max possible page index
     * @returns {number}
     */
    availablePageIndex() {
        return Math.floor((this.maxAvailableIndex()) / this.maxPageSlots());
    }
    /**
     * @inheritdoc
     */
    getSaveData() {
        const data = super.getSaveData();
        const saveItems = {}
        for (let [slotId, bagItem] of this._items.entries()) {
            saveItems[slotId] = bagItem.getSaveData();
        }
        data['items'] = saveItems;
        return data;
    }
    /**
     * @inheritdoc
     */
    loadSaveData(data) {
        super.loadSaveData(data);
        /** @type {Map<number, GameItem>} */
        const items = new Map();
        const savedItems = data['items'];
        for (let slotId in savedItems)  {
            let bagItem = new GameItem();
            bagItem.loadSaveData(savedItems[slotId]);
            items.set(+slotId, bagItem);
        }
        this._items = items;
    }
}
class GameItem extends SaveableObject {
    /**
     * Container Item
     * @param {number} id id of the item
     * @param {number} quantity number of the item in the Inventory
     */
    constructor(id, quantity, level = 0) {
        super();
        /** @type {number} */
        this.id = id;
        /** @type {number} */
        this.quantity = quantity;
        /** @type {number} */
        this.level = level;
    }
    /**
     * Get raw item data
     * @returns {PD_Item}
     */
    data() {
        return ItemDB.get(this.id);
    }
    /**
     * Add quantity
     * @param {number} value 
     */
    addQuantity(value) {
        this.quantity += value;
    }
    /**
     * Remove quantity
     * @param {number} value 
     * @returns {number} the amount left after the removal
     */
    removeQuantity(value) {
        this.quantity -= value;
        if (this.quantity < 0) {
            const remain = Math.abs(this.quantity);
            this.quantity = 0;
            return remain;
        }
        return 0;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ["id"],
            ["quantity"],
            ["level"],
        ]
    }
}