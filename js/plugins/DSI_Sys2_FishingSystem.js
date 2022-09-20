const FishConfig = {
    dbPath: "Fishing/Catchable.json"
}

class FishManager extends SaveableObject {
    /**
     * This handle all stuff relate to fishing
     */
    constructor() {
        super();
        FishManager.inst = this;
        /** @type {Object.<string, number>} */
        this._caughtFishes = {};
    }

    randomFish(area) {
        const time = GameTime.session();
        const weather = GameTime.weatherType();
        const season = GameTime.season();
        const fishTrap = true;

        const availableFishes = [];
        FishDB.inst.fishes.forEach(fish => {
            const validAreas = fish.seasons[season];
            if (!validAreas || !validAreas.includes(area)) return;
            if (fish.fishTrap && !fishTrap) return;
            // if (fish.time && fish.time != time) return;
            // if (fish.weathers.length > 0 && !fish.weathers.includes(weather)) return;
            for (var count = 0; count < fish.rate * 10; count++) {
                availableFishes.push(fish);
            }
        })
        /** @type {Game_Fish} */
        const randomFish = MyUtils.randomArrayItem(availableFishes);
        console.log({availableFishes, name: randomFish.itemID});
        
    }   
}
/** @type {FishManager} */
FishManager.inst = null;

class FishDB {
    /**
     * This handle DB work for crafting in Peaceful Days.
     */
    constructor() {
        /** @type {Game_Fish[]} */
        this._fishes = [];
        /** @type {Map<string, Game_Fish>} */
        this._fishByItemID = new Map();
        this.loadFishes();
    }
    /**
     * Get all fishes
     */
    get fishes() {
        return this._fishes;
    }
    /**
     * Get fish by ID
     * @param {string} itemID 
     * @returns {Game_Fish}
     */
    getFishByID(itemID) {
        return this._fishByItemID.get(itemID);
    }
    /**
     * Load all blueprints
     */
    async loadFishes() {
        const data = await MyUtils.loadJSON(FishConfig.dbPath);
        for (let fish of data) {
            const gameFish = new Game_Fish(fish);
            this._fishes.push(gameFish);
            this._fishByItemID[gameFish.itemID] = gameFish;
        }
        this._isFishesLoaded = true;
    }
    /**
     * Check if is ready 
     * @returns {boolean}
     */
    isReady() {
        return this._isFishesLoaded;
    }
}
//============================================================================
// INIT THE FISHING SYSTEM
//============================================================================
/** @type {FishDB} */
FishDB.inst = new FishDB();

class Game_Fish {
    /**
     * Handle fish data entry
     * @param {any} data 
     */
    constructor(data) {
        /** @type {string} */
        this.itemID = data.itemID;
        /** @type {Object.<string, string[]>} */
        this.seasons = data.seasons;
        /** @type {number[]} */
        this.size = data.size ? data.size.split(",").map(n => Number(n)) : [0, 0];
        /** @type {number} */
        this.difficulty = data.difficulty ? data.difficulty : 0;
        /** @type {"morning" | "noon" | "night"} */
        this.time = data.time ? data.time : "";
        /** @type {string[]} */
        this.weathers = data.weathers ? data.weathers : [];
        /** @type {number} */
        this.rate = data.rate ? data.rate : 0;
        /** @type {boolean} */
        this.legendary = data.legendary ? data.legendary : false;
        /** @type {boolean} */
        this.rare = data.rare ? data.rare : false;
        /** @type {boolean} */
        this.fishTrap = data.fishTrap ? data.fishTrap : false;
        /** @type {boolean} */
        this.object = data.object ? data.object : false;
    }
}

//========================================================================
// RPG MAKER SECTION
//========================================================================

var DSI_Sys2_FishingSystem_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function () {
    const result = DSI_Sys2_FishingSystem_Scene_Boot_isReady.call(this);
    return result && FishDB.inst.isReady();
};

var DSI_Sys2_FishingSystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys2_FishingSystem_Game_System_createSaveableObjects.call(this);
    this._fishManager = new FishManager();
}