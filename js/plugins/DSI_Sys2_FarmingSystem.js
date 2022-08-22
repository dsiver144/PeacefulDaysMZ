//=======================================================================
// * Plugin Name  : DSI_Sys2_FarmingSystem.js
// * Last Updated : 8/2/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * @param seedConfig:arr_struct
 * @text Normal Crop Config
 * @type struct<StrFarmCrop>[]
 * @desc Setup seeds
 * 
 * @param treeConfig:arr_struct
 * @text Tree Config
 * @type struct<StrFarmCrop>[]
 * @desc Setup tree
 * 
 * @command updateNewDay
 * 
 * 
 */

const FarmConfig = {
    nonWaterDayThreshold: 3,
    treeHP: 100,
    farmableRegionIDs: [111, 112],
}

/** @type {PluginParams} */
let FarmParams = PluginManager.parameters('DSI_Sys2_FarmingSystem');
FarmParams = PluginManager.processParameters(FarmParams);

PluginManager.registerCommand('DSI_Sys2_FarmingSystem', 'updateNewDay', () => {
    FarmManager.inst.onNewDay();
});

var DSI_Sys2_FarmingSystem_Scene_Boot_onItemDatabaseCreated = Scene_Boot.prototype.onItemDatabaseCreated;
Scene_Boot.prototype.onItemDatabaseCreated = function() {
	DSI_Sys2_FarmingSystem_Scene_Boot_onItemDatabaseCreated.call(this);
    // ================================================
    // Set seedId ref to each seed item.
    // ================================================
    /** @type {StrFarmCrop[]} */
    const allSeeds = FarmParams.seedConfig.concat(FarmParams.treeConfig);
    FarmParams.allSeeds = allSeeds;
    allSeeds.forEach((seedConfig, index) => {
        const seedItem = ItemDB.get(seedConfig.seedItemID);
        if (seedItem) {
            seedItem.seedId = index;
        }
    });
};

class FarmManager extends SaveableObject {
    /**
     * This call is the core of Farming System.
     */
    constructor() {
        super();
        FarmManager.inst = this;
        /** @type {Object.<string, Farmland>} */
        this.farmlands = {};
    }
    
    test() {
        var object = new OHugeStone(new Vector2(3, 5), 1);
        FarmManager.inst.currentFarmland().addObject(object)
    }
    /**
     * Check if player collide with any farm objects
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    checkCollision(x, y) {
        const farmland = this.currentFarmland();
        if (!farmland) return false;
        const object = farmland.getObject(x, y);
        if (!object) return false;
        return object.isCollidable();
    }
    /**
     * Get Current Farm land
     * @returns {Farmland}
     */
    currentFarmland() {
        return this.getFarmlandById($gameMap.mapId());
    }
    /**
     * Use Tool
     * @param {ToolType} toolType 
     * @param {number} x 
     * @param {number} y 
     * @param {any} toolEx
     * @returns {boolean} true if use successfully else false
     */
    useTool(toolType, x, y, toolEx = null) {
        let result = false;
        if (NetCore.isReady()) {
            if (NetCore.isHost()) {
                result = this.currentFarmland().useTool(toolType, x, y, toolEx);
                const object = this.currentFarmland().getObject(x, y).getSaveData();
                NetCore.send({action: 'updateObject', params: {objects: [object]}});
            } else {
                NetCore.send({action: 'remoteUseTool', params: {toolType, x, y, toolEx}});
                return false;
            }
        } else {
            result = this.currentFarmland().useTool(toolType, x, y, toolEx);
        }
        return result; 
    }
    /**
     * Check if player is interact with farm object
     * @param {number} x 
     * @param {number} y 
     */
    checkInteract(x, y) {
        return this.currentFarmland().checkInteract(x, y);
    }
    /**
     * Get Farm Land By ID
     * @param {number} mapId - map id of the farm land
     * @returns {Farmland}
     */
    getFarmlandById(mapId) {
        let land = this.farmlands[mapId.toString()];
        if (land) return land;
        land = new Farmland(mapId);
        this.farmlands[mapId.toString()] = land;
        return land;
    }
    /**
     * On New Day
     */
    onNewDay() {
        for (let mapId in this.farmlands) {
            this.farmlands[mapId].onNewDay();
        }
    }
    /**
     * Get Save Data
     * @returns {Object}
     */
    getSaveData() {
        const result = super.getSaveData();
        const farmlands = {};
        for (let mapId in this.farmlands) {
            farmlands[mapId] = this.farmlands[mapId].getSaveData();
        }
        result['farmlands'] = farmlands;
        return result;
    }
    /**
     * Load Save Data
     * @param {Object} data 
     */
    loadSaveData(data) {
        super.loadSaveData(data);
        const farmlands = {};
        for (let mapId in data['farmlands']) {
            const landData = data['farmlands'][mapId];
            let newFarmLand = new Farmland();
            newFarmLand.loadSaveData(landData);
            farmlands[mapId] = newFarmLand;
        }
        this.farmlands = farmlands;
    }
}

ImageManager.loadFarm = function(filename, dir = "") {
    let path = "img/farms/" + dir;
    if (dir.length > 0) path += "/";
    return ImageManager.loadBitmap(path, filename);
}

/** @type {FarmManager} */
FarmManager.inst = null;
/**
 * Get Seed Data
 * @param {number} seedId 
 * @returns {StrFarmCrop}
 */
FarmManager.getSeedData = function(seedId) {
    return FarmParams.allSeeds[seedId];
}
/**
 * Check if this region id is farm region.
 * @param {number} x 
 * @param {number} y
 * @returns {boolean}
 */
FarmManager.isFarmRegion = function(x, y) {
    const regionId = $gameMap.regionId(x, y);
    return FarmConfig.farmableRegionIDs.includes(regionId);
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

Game_Player.prototype.updateUseToolInput = function() {
    ToolManager.inst.update();
};

Game_Player.prototype.checkInteractWithFarmObjects = function(x, y) {
    // /** @type {Vector2} */
    // if (Input.getInputMode() === 'keyboard') {
    //     const px = Math.round(this._x);
    //     const py = Math.round(this._y);
    //     const x = $gameMap.canvasToMapX(TouchInput.x);
    //     const y = $gameMap.canvasToMapY(TouchInput.y);
    //     const dist = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
    //     if (dist > 1.5) {
    //         return false;
    //     }
    //     pos = new Vector2(x, y);
    // } else {
    //     pos = this.frontPosition();
    // }
    const result = FarmManager.inst.checkInteract(x, y);
    return result;
}
// ================================================================================
// Handle collision with farm objects.
// ================================================================================
var DSI_Sys2_FarmingSystem_Game_CharacterBase_isCollidedWithCharacters = Game_CharacterBase.prototype.isCollidedWithCharacters;
Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
	const result = DSI_Sys2_FarmingSystem_Game_CharacterBase_isCollidedWithCharacters.call(this, x, y);
    return result || FarmManager.inst.checkCollision(x, y);
}

var DSI_Sys2_FarmingSystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
	DSI_Sys2_FarmingSystem_Game_System_createSaveableObjects.call(this);
    this._farmLand = new FarmManager();
}
// ================================================================================
// Handle display Farm Objects
// ================================================================================

var DSI_Sys2_FarmingSystem_Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function () {
	DSI_Sys2_FarmingSystem_Spriteset_Map_createCharacters.call(this);
    this.createFarmObjectSprites();
}

Spriteset_Map.prototype.createFarmObjectSprites = function() {
    FarmManager.inst.currentFarmland().allObjects().forEach(object => {
        object.objectSprite();
    })
}

//========================================================================
// END OF PLUGIN
//========================================================================
class StrFarmCrop {
    constructor() {
         /** @type {number} */
         this.itemPreview = null;
         /** @type {string} */
         this.seedItemID = null;
         /** @type {string} */
         this.productID = null;
         /** @type {number[]} */
         this.stages = null;
         /** @type {boolean} */
         this.resetable = null;
         /** @type {number} */
         this.resetStageIndex = null;
         /** @type {number} */
         this.resetTimes = null;
         /** @type {boolean} */
         this.sickleRequired = null;
         /** @type {boolean} */
         this.isTree = null;
         /** @type {boolean} */
         this.isCollidable = null;
         /** @type {boolean} */
         this.nonWaterFlag = null;
         /** @type {number[]} */
         this.seasons = null;
         /** @type {string} */
         this.imageFile = null;
     }
 }
/*~struct~StrFarmCrop:
 * 
 * @param itemPreview:num
 * @text Item Preview
 * @desc Item preview, won't be used
 * @type item
 * 
 * @param seedItemID:str
 * @text Seed Item
 * @desc Select item id for seed
 * 
 * @param productID:str
 * @text ProductID
 * @desc Enter product id
 * 
 * @param stages:arr_num
 * @text Stages
 * @desc Enter stages
 * @type number[]
 * 
 * @param resetable:bool
 * @text Resetable
 * @desc Set reset state
 * @type boolean
 * @default false
 * 
 * @param resetStageIndex:num
 * @text Reset Stage Index
 * @desc Enter the stage index will reset to
 * @default 0
 * 
 * @param resetTimes:num
 * @text Reset Times
 * @default 0
 * @desc Enter how many times the crop will reset
 * 
 * @param sickleRequired:bool
 * @text Require Sickle To Harvest
 * @type boolean
 * @default false
 * 
 * @param isTree:bool
 * @text Tree Flag
 * @type boolean
 * @default false
 * 
 * @param isCollidable:bool
 * @text Collidable Flag
 * @type boolean
 * @default false
 * 
 * @param nonWaterFlag:bool
 * @text Non Water Flag
 * @type boolean
 * @default false
 * 
 * @param seasons:arr_num
 * @text Seasons
 * @type select[]
 * @option Spring
 * @value 0
 * @option Summer
 * @value 1
 * @option Autumn
 * @value 2
 * @option Winter
 * @value 3
 * 
 * @param imageFile:str
 * @text Image file
 * @type file
 * @dir img/farms
 * @desc Enter filename for image
 * 
 */
/*~struct~PositionObject:
 * @param x:num
 * @text x
 * @desc X position
 * 
 * @param y:num
 * @text y
 * @desc Y Position
 *
 */