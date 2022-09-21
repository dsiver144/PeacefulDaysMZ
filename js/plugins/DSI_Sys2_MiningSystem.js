const MiningConfig = {
    dbPaths: ["Mining/OldMine.json", "Mining/VolcanoMine.json"]
}

class MineDB {
    /**
     * This handle DB work for crafting in Peaceful Days.
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
        // /** @type {number[]} */
        // this.seasons = data.seasons ? data.seasons : [];
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