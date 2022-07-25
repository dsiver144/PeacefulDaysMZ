//=======================================================================
// * Plugin Name  : DSI_Sys2_FarmingSystem.js
// * Last Updated : 7/20/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * @param seedConfig:arr_struct
 * @text Seed Config
 * @type struct<StrFarmCrop>[]
 * @desc Setup seeds
 * 
 * @param farmRegionIds:arr_num
 * @text Farm Region IDs
 * @type number[]
 * @default ["111","112"]
 * 
 * @param farmMaps:arr_num
 * @text Farm Map IDs
 * @type number[]
 * 
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
/*~struct~SoundEffect:
 * @param name:str
 * @text name
 * @type file
 * @dir audio/se/
 * @desc Choose the name of SE you want to use.
 *
 * @param volume:num
 * @text volume
 * @default 70
 * @desc Choose the volume value of the se
 * 
 * @param pitch:num
 * @text pitch
 * @default 100
 * @desc Choose the pitch value of the se
 * 
 * @param pan:num
 * @text pan
 * @default 0
 * @desc Choose the pan value of the se
 * 
 */

/** @type {PluginParams} */
let FarmParams = PluginManager.parameters('DSI_Sys2_FarmingSystem');
FarmParams = PluginManager.processParameters(FarmParams);


var DSI_Sys2_FarmingSystem_Scene_Boot_onItemDatabaseCreated = Scene_Boot.prototype.onItemDatabaseCreated;
Scene_Boot.prototype.onItemDatabaseCreated = function() {
	DSI_Sys2_FarmingSystem_Scene_Boot_onItemDatabaseCreated.call(this);
    // ================================================
    // Set seedId ref to each seed item.
    // ================================================
    FarmParams.seedConfig.forEach((seedConfig, index) => {
        const seedItem = ItemDB.get(seedConfig.seedItemID);
        if (seedItem) {
            seedItem.seedId = index;
        }
    })
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
    /**
     * Get Current Farm land
     * @returns {Farmland}
     */
    currentFarmland() {
        return this.getFarmlandById($gameMap.mapId());
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

/** @type {FarmManager} */
FarmManager.inst = null;
/**
 * Get Seed Data
 * @param {number} seedId 
 * @returns {StrFarmCrop}
 */
FarmManager.getSeedData = function(seedId) {
    return FarmParams.seedConfig[seedId];
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys2_FarmingSystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
	DSI_Sys2_FarmingSystem_Game_System_createSaveableObjects.call(this);
    this._farmLand = new FarmManager();
}

//========================================================================
// END OF PLUGIN
//========================================================================
class StrFarmCrop {
    constructor() {
         /** @type {number} */
         this.seedItemID = null;
         /** @type {number} */
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