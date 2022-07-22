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
        /** @type {Farmland[]} */
        this.farmlands = [];
        this.lastModified = Date.now();
        
    }

    test() {
        const farmland = new Farmland(1);
        const crop = new FarmCrop(new Position(0, 0), 1);
        crop.setSeed(0);
        farmland.addObject(crop);
        this.farmlands.push(farmland);
    }
    /**
     * On New Day
     */
    onNewDay() {
        this.farmlands.forEach(farmland => farmland.onNewDay());
    }
    /**
     * Get Save Data
     * @returns {Object}
     */
    getSaveData() {
        const result = super.getSaveData();
        const farmlands = this.farmlands.map(farmLand => farmLand.getSaveData());
        result['farmlands'] = farmlands;
        return result;
    }
    /**
     * Load Save Data
     * @param {Object} data 
     */
    loadSaveData(data) {
        super.loadSaveData(data);
        this.farmlands = data['farmlands'].map((data) => {
            console.log({data});
            let newFarmLand = new Farmland();
            newFarmLand.loadSaveData(data);
            return newFarmLand;
        })
    }

}

/** @type {FarmManager} */
FarmManager.inst = null;
FarmManager.getInstance = function() {
    return FarmManager.inst;
}
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

var DSI_Sys2_FarmingSystem_Game_System_recreateSaveableObjects = Game_System.prototype.recreateSaveableObjects;
Game_System.prototype.recreateSaveableObjects = function () {
	DSI_Sys2_FarmingSystem_Game_System_recreateSaveableObjects.call(this);
    this._farmLand = new FarmManager();
}

var DSI_FarmingSystem_Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
Game_System.prototype.onBeforeSave = function () {
    DSI_FarmingSystem_Game_System_onBeforeSave.call(this);
    const savedData = {};
    $gameTemp.temporaryObjects = {};
    for (let key in this) {
        var object = this[key];
        if (object instanceof SaveableObject) {
            savedData[key] = object.getSaveData();
            $gameTemp.temporaryObjects[key] = object;
            delete this[key];
        }
    }
    this.savedData = savedData;
};

Game_System.prototype.onAfterSaveTemporaryObjects = function() {
    for (let key in $gameTemp.temporaryObjects) {
        var object = $gameTemp.temporaryObjects[key];
        $gameSystem[key] = object;
    }
    $gameTemp.temporaryObjects = null;
}

var DSI_FarmingSystem_Scene_Save_onSaveSuccess = Scene_Save.prototype.onSaveSuccess;
Scene_Save.prototype.onSaveSuccess = function () {
    $gameSystem.onAfterSaveTemporaryObjects();
    DSI_FarmingSystem_Scene_Save_onSaveSuccess.call(this);
};

var DSI_Sys2_FarmingSystem_Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
Scene_Load.prototype.onLoadSuccess = function () {
    $gameSystem.recreateSaveableObjects();
    const savedData = $gameSystem.savedData;
    for (let key in savedData) {
        var object = $gameSystem[key];
        var data = savedData[key];
        if (object instanceof SaveableObject) {
            object.loadSaveData(data);
        }
    }
	DSI_Sys2_FarmingSystem_Scene_Load_onLoadSuccess.call(this);
};

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