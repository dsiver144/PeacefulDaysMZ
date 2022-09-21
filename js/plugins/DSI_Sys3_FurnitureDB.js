//=======================================================================
// * Plugin Name  : DSI_Sys3_FurnitureDB.js
// * Last Updated : 9/21/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Furniture Database
 * @help 
 * Empty Help
 */
const FurnitureConfig = {
    dbPath: "Furniture/List.json"
}

class FurnitureDB {
    /**
     * This handle DB work for crafting in Peaceful Days.
     */
    constructor() {
        /** @type {Map<string, Game_Furniture>} */
        this._furnitureByID = new Map();
        this.loadFurnitures();
    }
    /**
     * Get fish by ID
     * @param {string} itemID 
     * @returns {Game_Furniture}
     */
    getFurnitureByID(itemID) {
        return this._furnitureByID.get(itemID);
    }
    /**
     * Load all furnitures
     */
    async loadFurnitures() {
        const data = await MyUtils.loadJSON(FurnitureConfig.dbPath);
        for (let furniture of data) {
            const gameFurniture = new Game_Furniture(furniture);
            this._furnitureByID.set(gameFurniture.itemID, gameFurniture);
        }
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
/** @type {FurnitureDB} */
FurnitureDB.inst = new FurnitureDB();

class Game_Furniture {
    /**
     * Handle fish data entry
     * @param {any} data 
     */
    constructor(data) {
        /** @type {string} */
        this.itemID = data.itemID;
        /** @type {boolean} */
        this.interactable = data.interactable ? data.interactable : false;
        /** @type {boolean} */
        this.isCollidable = data.isCollidable ? data.isCollidable : false;
        /** @type {number[]} */
        this.regionIds = data.regionIds ? data.regionIds : [];
        /** @type {Game_Furniture_Variant[]} */
        this.variants = [];
        if (data.variants) {
            data.variants.forEach(variantData => {
                this.variants.push(new Game_Furniture_Variant(variantData));
            })
        }
        /** @type {string} */
        this.className = data.className ? data.className : 'MyFurniture';
    }
}

class Game_Furniture_Variant {
    constructor(data) {
        /** @type {string} */
        this.imageFile = data.imageFile ? data.imageFile : "";
        /** @type {Rectangle} */
        this.imageRect = data.imageRect ? new Rectangle(...data.imageRect) : new Rectangle(0, 0, 0, 0);
        /** @type {Rectangle} */
        this.interactionRange = data.interactionRange ? new Rectangle(...data.interactionRange) : new Rectangle(0, 0, 0, 0);
        /** @type {Vector2} */
        this.bottomSize = data.bottomSize ? new Vector2(...data.bottomSize) : new Vector2(0, 0);
    }
}

//========================================================================
// RPG MAKER SECTION
//========================================================================

var DSI_Sys3_Furniture_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function () {
    const result = DSI_Sys3_Furniture_Scene_Boot_isReady.call(this);
    return result && FurnitureDB.inst.isReady();
};

