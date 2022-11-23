const MiningConfig = {
    dbPaths: ["Mining/OldMine.json", "Mining/VolcanoMine.json"]
}

class MineManager extends SaveableObject {
    /**
     * Handle mining feature for Peaceful Days.
     */
    constructor() {
        super();
        MineManager.inst = this;
        /** @type {Object.<string, number>} */
        this._minedItems = {};
    }
    /**
     * Save mine item
     * @param {string} itemID 
     * @param {number} value 
     */
    saveMineItem(itemID, value) {
        this._minedItems[itemID] = this._minedItems[itemID] || 0;
        this._minedItems[itemID] += value;
    }
    /**
     * Get Mine Item Number
     * @param {string} itemID 
     * @returns {number} number of item has been mined
     */
    getMinedItemNumber(itemID) {
        return this._minedItems[itemID] || 0;
    }
    /**
     * @inheritdoc
     */
    getSaveData() {
        const data = super.getSaveData();

        return data;
    }
    /**
     * @inheritdoc
     */
    loadSaveData(data) {
        super.loadSaveData(data);
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ['_minedItems', null]
        ]
    }
}
/** @type {MineManager} */
MineManager.inst = null;

class MineDB {
    /**
     * This handle DB work for mining in Peaceful Days.
     */
    constructor() {
        /** @type {Map<string, Map<string, Game_MineItem>>} */
        this._map = new Map();
        this.loadMineItems();
    }
    /**
     * Get item by ID
     * @param {string} mineID 
     * @param {string} itemID 
     * @returns {Game_MineItem}
     */
    getItemByID(mineID, itemID) {
        return this._map.get(mineID).get(itemID);
    }
    /**
     * Load all mine items
     */
    async loadMineItems() {
        const promise = [];
        MiningConfig.dbPaths.forEach((path) => {
            promise.push(MyUtils.loadJSON(path));
        })
        const lists = await Promise.all(promise);
        MiningConfig.dbPaths.forEach((path, index) => {
            const array = lists[index];
            const key = path.match(/Mining\/(.+)\.json/i)[1];
            this._map.set(key || path, new Map());
            for (let data of array) {
                const object = new Game_MineItem(data);
                this._map.get(key).set(object.itemID, object);
            }
        })
        this._isDatabaseLoaded = true;
    }
    /**
     * Get all foraging items
     * @returns {Game_ForagingItem[]}
     */
    allItems(mineID) {
        const items = [];
        for (const item of this._map.get(mineID).values()) {
            items.push(item);
        }
        return items;
    }
    /**
     * Check if is ready 
     * @returns {boolean}
     */
    isReady() {
        return this._isDatabaseLoaded;
    }
}

//============================================================================
// INIT THE FISHING SYSTEM
//============================================================================
/** @type {MineDB} */
MineDB.inst = new MineDB();

class Game_MineItem {
    /**
     * This handle game foraging database item
     */
    constructor(data) {
        /** @type {string} */
        this.itemID = data.itemID ? data.itemID : "";
        /** @type {boolean} */
        this.ore = data.ore ? data.ore : false;
        /** @type {number[]} */
        this.floor = data.floor ? data.floor.split(",").map(n => Number(n)) : {};
        /** @type {number} */
        this.rate = data.rate ? data.rate : 0;;
        /** @type {number} */
        this.number = data.number ? data.number : 0;
    }
}

//========================================================================
// RPG MAKER SECTION
//========================================================================

var DSI_Sys2_MiningSystem_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function () {
    const result = DSI_Sys2_MiningSystem_Scene_Boot_isReady.call(this);
    return result && MineDB.inst.isReady();
};

var DSI_Sys2_MiningSystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys2_MiningSystem_Game_System_createSaveableObjects.call(this);
    this._mineManager = new MineManager();
}