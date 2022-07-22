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

class FarmManager {

    constructor() {
        /** @type {Farmland[]} */
        this.farmlands = [];
        this.lastModified = Date.now();
        console.log("Create farm manager");
        
    }

    test() {
        this.farmlands.push(new Farmland(1));
        this.farmlands[0].addObject(new FarmCrop(new Position(0, 0), 1));
        this.lastModified = Date.now();
    }

}

var DSI_Sys2_FarmingSystem_DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
	DSI_Sys2_FarmingSystem_DataManager_setupNewGame.call(this);
    $gameSystem.farmManager = FarmManager.getInstance();
};

/** @type {FarmManager} */
FarmManager.inst = null;
FarmManager.getInstance = function() {
    const inst = FarmManager.inst || new FarmManager();
    FarmManager.inst = inst;
    return inst;
}


//========================================================================
// END OF PLUGIN
//========================================================================
/*~struct~StrFarmCrop:
 * @param seedItemID:num
 * @text Seed Item
 * @desc Select item for seed
 * @type item
 * 
 * @param productID:num
 * @text ProductID
 * @desc Enter product id
 * @type item
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