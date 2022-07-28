//=======================================================================
// * Plugin Name  : DSI_Sys2_InventorySystem.js
// * Last Updated : 7/25/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Inventory System
 * @help 
 * Empty Help
 * 
 */

const BagConfig = {
    unlockedRows: 1,
    maxSlotPerRow: 4,
    maxRows: 4,
    maxItemPerStacks: 100,
}



class MyBag extends SaveableObject {
    /**
     * This class handle Inventory system for Peaceful Days
     */
    constructor() {
        super();
        MyBag.inst = this;
        /** @type {Object.<string, BagItem>} */
        this.items = {};
        this.unlockedRows = BagConfig.unlockedRows;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ["unlockedRows", 0]
        ]
    }
    /**
     * Add Item
     * @param {number} id 
     * @param {number} number 
     */
    addItem(id, number) {
        const slotId = this.findAvailableSlotId(id, number);
        if (slotId >= 0) {
            let bagItem = this.items[slotId] || new BagItem(id, 0);
            bagItem.addQuantity(number);
            this.items[slotId] = bagItem;
            console.log(`> Bag: ${bagItem.id} (${bagItem.quantity}) has been added to #${slotId}!`);
        } else {
            console.log(`> Bag: Can't not add ${id} (${number})`);
        }
    }
    /**
     * Remove Item
     * @param {number} id 
     * @param {number} number 
     */
    removeItem(id, number) {
        
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
            const bagItem = this.items[slotId];
            if (bagItem) {
                if (bagItem.id == id && bagItem.quantity + number <= BagConfig.maxItemPerStacks) {
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
     * Get the max bag slot index at the moment
     * @returns {number}
     */
    maxAvailableIndex() {
        return BagConfig.maxSlotPerRow * this.unlockedRows - 1;
    }
    /**
     * @inheritdoc
     */
    getSaveData() {
        const data = super.getSaveData();
        const saveItems = {};
        for (let slotId in this.items) {
            const bagItem = this.items[slotId];
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
        const items = {};
        const savedItems = data['items'];
        for (let slotId in savedItems) {
            const savedBagItem = savedItems[slotId];
            let bagItem = new BagItem();
            bagItem.loadSaveData(savedBagItem);
            items[slotId] = bagItem;
        }
        this.items = items;
    }
}
/** @type {MyBag} */
MyBag.inst = null;

class BagItem extends SaveableObject {
    /**
     * InventoryItem
     * @param {number} id id of the item
     * @param {number} quantity number of the item in the Inventory
     */
    constructor(id, quantity) {
        super();
        /** @type {number} */
        this.id = id;
        /** @type {number} */
        this.quantity = quantity;
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
     */
    removeQuantity(value) {
        this.quantity -= value;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ["id"],
            ["quantity"]
        ]
    }
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys2_InventorySystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function() {
	DSI_Sys2_InventorySystem_Game_System_createSaveableObjects.call(this);
    this._myBag = new MyBag();
}