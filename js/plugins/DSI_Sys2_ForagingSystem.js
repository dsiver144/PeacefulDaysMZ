const ForagingConfig = {
    dbPath: "Foraging/Forageable.json"
}

class ForagingDB {
    /**
     * This handle DB work for crafting in Peaceful Days.
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

    allItems() {
        
        return 
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