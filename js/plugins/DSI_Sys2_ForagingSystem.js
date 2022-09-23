const ForagingConfig = {
    dbPath: "Foraging/Forageable.json"
}

class ForagingManager extends SaveableObject {
    /**
     * This handle foraging in Peaceful Days.
     */
    constructor() {
        super();
        ForagingManager.inst = this;
        /** @type {Object.<string, number>} */
        this._foragedItems = {};
    }
    /**
     * Save foraging item
     * @param {string} itemID 
     * @param {number} value 
     */
    saveForagedItem(itemID, value) {
        this._foragedItems[itemID] = this._foragedItems[itemID] || 0;
        this._foragedItems[itemID] += value;
    }
    /**
     * Get total of a specific item that has been foraged
     * @param {string} itemID 
     * @returns {number}
     */
    getTotalForagedItem(itemID) {
        return this._foragedItems[itemID] || 0;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ["_foragedItems", null]
        ]
    }
}
/** @type {ForagingManager} */
ForagingManager.inst = null;

class ForagingDB {
    /**
     * This handle DB work for foraging in Peaceful Days.
     */
    constructor() {
        /** @type {Map<string, Game_ForagingItem>} */
        this._map = new Map();
        this.loadForagingItems();
    }
    /**
     * Get item by ID
     * @param {string} itemID 
     * @returns {Game_ForagingItem}
     */
    getItemByID(itemID) {
        return this._map.get(itemID);
    }
    /**
     * Load all foraging items
     */
    async loadForagingItems() {
        const array = await MyUtils.loadJSON(ForagingConfig.dbPath);
        for (let data of array) {
            const object = new Game_ForagingItem(data);
            this._map.set(object.itemID, object);
        }
        this._isDatabaseLoaded = true;
    }
    /**
     * Get all foraging items
     * @returns {Game_ForagingItem[]}
     */
    allItems() {
        const items = [];
        for (const item of this._map.values()) {
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
/** @type {ForagingDB} */
ForagingDB.inst = new ForagingDB();

class Game_ForagingItem {
    /**
     * This handle game foraging database item
     */
    constructor(data) {
        /** @type {string} */
        this.itemID = data.itemID ? data.itemID : "";
        /** @type {number[]} */
        this.seasons = data.seasons ? data.seasons : [];
    }
}

//========================================================================
// RPG MAKER SECTION
//========================================================================

var DSI_Sys2_ForagingSystem_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function () {
    const result = DSI_Sys2_ForagingSystem_Scene_Boot_isReady.call(this);
    return result && ForagingDB.inst.isReady();
};

var DSI_Sys2_ForagingSystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys2_ForagingSystem_Game_System_createSaveableObjects.call(this);
    this._foragingManager = new ForagingManager();
}