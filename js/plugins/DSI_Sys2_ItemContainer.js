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
    maxSlotPerRow: 12,
    maxRows: 4,
    maxItemPerStacks: 100,
}

class ItemContainer extends SaveableObject {
    /**
     * This class handle Inventory system for Peaceful Days
     */
    constructor(unlockedRows = ContainerConfig.maxRows) {
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
        this.onItemChanged(slotId);
    }
    /**
     * Get selecting item
     * @returns {GameItem}
     */
    selectingItem() {
        const item = this._items.get(this._selectedSlotId);
        return item && item.id ? item : null;
    }
    /**
     * Cycle Item
     * @param {number} direction 
     * @param {(slotIndex: number) => void} callback 
     */
    cycleItem(direction = 1, callback) {
        const currentRowIndex = this.currentRowIndex;
        const maxRowItems = ContainerConfig.maxSlotPerRow;
        const startIndex = currentRowIndex * maxRowItems;
        const endIndex = startIndex + maxRowItems - 1;
        let index = this._selectedSlotId + direction;
        if (index < startIndex) index = endIndex;
        if (index > endIndex) index = startIndex;
        if (this.isSlotUnlocked(index)) {
            this.select(index);
            callback(index);
        } else {
            callback(-1);
        }
    }
    /**
     * Cycle Row Up Or Down
     * @param {number} direction 
     * @param {(slotIndex: number) => void} callback 
     */
    cycleRow(direction = 1, callback) {
        if (this._unlockedRows < 2) return;
        const maxSlotIndex = (this._unlockedRows * ContainerConfig.maxSlotPerRow) - 1;
        let index = this._selectedSlotId + ContainerConfig.maxSlotPerRow * direction;
        if (index > maxSlotIndex) {
            index = index - maxSlotIndex - 1;
        }
        if (index < 0) {
            index = maxSlotIndex + index + 1;
        }
        if (this.isSlotUnlocked(index)) {
            this.select(index);
            callback(index);
        } else {
            callback(-1);
        }
    }
    /**
     * Sort the container
     */
    sort() {
        let items = Array.from(this._items.values());
        console.log([...items]);
        items = items.sort((a, b) => {
            const dataA = ItemDB.get(a.id);
            const dataB = ItemDB.get(b.id);
            if (dataA.tags[0] == 'tool' && dataB.tags[0] != 'tool') return -1;
            if (dataA.tags[0] != 'tool' && dataB.tags[0] == 'tool') return 1;
            if (dataA.tags[0] == 'seed' && dataB.tags[0] != 'seed') return -1;
            if (dataA.tags[0] != 'seed' && dataB.tags[0] == 'seed') return 1;
            if (dataA.tags[0] < dataB.tags[0]) return -1;
            if (dataA.tags[0] > dataB.tags[0]) return 1;
            return 0;
        });
        console.log([...items]);
        items.forEach((item, index) => {
            this._items.set(index, item);
            this.onItemChanged(index);
        })
    }
    /**
     * Get Item At specific index
     * @param {number} index 
     * @returns {GameItem}
     */
    item(index) {
        return this._items.get(index);
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
     * Get current row index
     * @returns {number}
     */
    get currentRowIndex() {
        return Math.floor(this._selectedSlotId / ContainerConfig.maxSlotPerRow);
    }
    /**
     * Get current row items
     * @returns {GameItem[]}
     */
    currentRowItems() {
        const selectingRowIndex = this.currentRowIndex;
        const items = [];
        const startIndex = selectingRowIndex * ContainerConfig.maxSlotPerRow;
        const endIndex = startIndex + ContainerConfig.maxSlotPerRow - 1;
        for (var i = startIndex; i <= endIndex; i++) {
            items.push(MyBag.inst.item(i));
        }
        return items;
    }
    /**
     * Get On Container Item Changed Event Name
     * @returns {string}
     */
    onContainerItemChangedEventName() {
        return null;
    }
    /**
     * On Item Changed
     */
    onItemChanged(slotId) {
        const eventName = this.onContainerItemChangedEventName();
        eventName && EventManager.emit(eventName, slotId);
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
            this.onItemChanged(slotId);
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
                this.onItemChanged(slotId);
                if (totalNumber <= 0) {
                    break;
                }
            }
        };
    }
    /**
     * Update item at slot id
     * @param {string} slotId 
     * @param {number} number 
     */
    updateItemWithSlotID(slotId, number) {
        if (slotId < 0) slotId = this._selectedSlotId;
        const item = this._items.get(slotId);
        if (!item) return;
        item.quantity += number;
        if (item.quantity <= 0) {
            this._items.delete(slotId);
        }
        this.onItemChanged(slotId);
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
     * @private
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
     * @private
     */
    isSlotAvailable(slotId) {
        return this.isSlotUnlocked(slotId) && !this._items.get(slotId);
    }
    /**
     * Check if a slot is unlocked or not
     * @returns {boolean}
     */
    isSlotUnlocked(slotId) {
        return slotId <= this.maxAvailableIndex();
    }
    /**
     * Get the max bag slot index at the moment
     * @returns {number}
     * @private
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
     * @private
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
        for (let slotId in savedItems) {
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
     * @param {string} id id of the item
     * @param {number} quantity number of the item in the Inventory
     */
    constructor(id, quantity, level = 0) {
        super();
        /** @type {string} */
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