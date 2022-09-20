const FurnitureConfig = {
    dbPath: "Furniture/List.json"
}

class MyFurniture extends Building {
    /**
     * Image File
     * @returns {string}
     */
    imageFile() {
        return this.folder() + this.filename();
    }
    /**
     * Image folder
     * @returns {string}
     */
    folder() {
        return "furnitures/";
    }
    /**
     * Set furniture ID
     * @param {string} itemID 
     */
    setFurnitureID(itemID) {
        this._furnitureID = itemID;
        this._variantIndex = 0;
        this._maxVariantIndex = this.furnitureData().variants.length - 1;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        const data = super.saveProperties();
        data.push(['_furnitureID', null]);
        data.push(['_variantIndex', null]);
        data.push(['_maxVariantIndex', null]);
        return data;
    }
    /**
     * Get furniture data
     * @returns {Game_Furniture}
     */
    furnitureData() {
        return FurnitureDB.inst.getFurnitureByID(this._furnitureID);
    }
    /**
     * Get furniture variant
     * @returns {Game_Furniture_Variant}
     */
    furnitureVariant() {
        return this.furnitureData().variants[this._variantIndex];
    }
    /**
     * Filename
     * @returns {string}
     */
    filename() {
        return this.furnitureVariant().imageFile;
    }
    /**
     * @inheritdoc
     */
    validRegionIDs() {
        return this.furnitureData().regionIds;
    }
    /**
     * @inheritdoc
     */
    interactable() {
        return this.furnitureData().interactable;
    }
    /**
     * Preview Sprite Key
     * @returns {string}
     */
    previewSpriteKey() {
        return 'furniturePreview';
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_Furniture;
    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return this.furnitureVariant().bottomSize;
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return this.furnitureVariant().imageRect;
    }
    /**
     * @inheritdoc
     */
    interactionRange() {
        return this.furnitureVariant().interactionRange;
    }
    /**
     * Check if this furniture can be rotate.
     * @returns {boolean}
     */
    isRotatable() {
        return this._maxVariantIndex > 0 && this.isBeingMove();
    }
    /**
     * Rotate furniture
     */
    rotate(value) {
        if (!this.isRotatable()) return;
        this._variantIndex += value;
        if (this._variantIndex > this._maxVariantIndex) this._variantIndex = 0;
        if (this._variantIndex < 0) this._variantIndex = this._maxVariantIndex;
        console.log(this.furnitureVariant());
    }
}

MyFurniture.place = function(constClass, itemID, startX = 10, startY = 10) {
    /** @type {MyFurniture} */
    const construction = new constClass(new Vector2(startX, startY), $gameMap.mapId());
    construction.setFurnitureID(itemID);
    construction.startMove();
    return construction;
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

