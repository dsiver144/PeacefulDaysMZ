//=======================================================================
// * Plugin Name  : DSI_Sys2_CraftingSystem.js
// * Last Updated : 8/16/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Crafting System for Peaceful Days
 * @help 
 * Empty Help
 * 
 * 
 */
/** @enum */
const CraftType = {
    "None": "None",
    "HandCraft": "HandCraft",
    "Fermenter": "Fermenter",
    "Furnace": "Furnace",
    "MachinePartMaker": "MachinePartMaker",
    "WeavingMachine": "WeavingMachine",
    "Windmill": "Windmill",
}
const Craftingconfig = {
    path: "Crafting",
    blueprints: {
        "HandCraft": "HandcraftBlueprints.json",
        "Fermenter": "FermenterRecipes.json",
        "Furnace": "FurnaceBlueprints.json",
        "MachinePartMaker": "MachinePartMakerBlueprints.json",
        "WeavingMachine": "WeavingMachineRecipes.json",
        "Windmill": "WindmillRecipes.json",
    }
}

class CraftManager extends SaveableObject {
    /**
     * This handle the crafting system for Peaceful Days
     */
    constructor() {
        super();
        CraftManager.inst = this;
        /** @type {CraftTask[]} */
        this._tasks = [new CraftTask('Test1')];
        this._tasks = [new CraftTask('Test2')];
    }
    /**
     * Check if player can craft
     * @param {Blueprint} blueprint 
     */
    isCraftable(blueprint) {
        // blueprint.require
    }
    /**
     * Update when time is running
     */
    update() {

    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        const data = super.saveProperties();
        data.push(['@Arr(CraftTask):_tasks', null]);
        return data;
    }
}
/** @type {CraftManager} */
CraftManager.inst = null;

class CraftTask extends SaveableObject {
    /**
     * Handle crafting task
     * @param {string} assignee 
     */
    constructor(assignee) {
        super();
        /** @type {string} */
        this._assignee = assignee;
        this._beginTime = null;
        this._endTime = null;
        this._product = {
            itemID: null,
            number: 0,
            level: 0
        }
    }
    /**
     * Update
     */
    update() {
        
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ['_assignee', null],
            ['_beginTime', null],
            ['_endTime', null],
            ['_product', null],
        ]
    }
}

class CraftDB {
    /**
     * This handle DB work for crafting in Peaceful Days.
     */
    constructor() {
        /** @type {Map<CraftType, Blueprint[]} */
        this._blueprints = new Map();
        this.loadAllBlueprints();
    }
    /**
     * Get all blueprints
     */
    get blueprints() {
        return this._blueprints;
    }
    /**
     * Load all blueprints
     */
    async loadAllBlueprints() {
        for (var craftType in Craftingconfig.blueprints) {
            const path = Craftingconfig.blueprints[craftType];
            const data = await this.loadJson(path);
            /** @type {Blueprint[]} */
            const blueprints = [];
            data.forEach((rawBlueprint) => {
                const blueprint = new Blueprint();
                for (var key in rawBlueprint) {
                    blueprint[key] = rawBlueprint[key];
                    if (key === 'components') {
                        blueprint[key] = [];
                        rawBlueprint[key].forEach(compRaw => {
                            const component = new BlueprintComponent();
                            for (var ckey in compRaw) {
                                component[ckey] = compRaw[ckey];
                            }
                            blueprint[key].push(component);
                        })
                    }
                }
                blueprints.push(blueprint)
            });
            this._blueprints.set(craftType, blueprints);
        }
        this._isBlueprintsLoaded = true;
    }
    /**
     * Load json file
     * @param {string} path 
     * @returns {Promise<object>}
     */
    loadJson(path) {
        path = Craftingconfig.path + "/" + path;
        return new Promise((resolve, reject) => {
            MyUtils.loadFile(path, (data) => {
                resolve(JSON.parse(data));
            });
        })
    }
    /**
     * Check if is ready 
     * @returns {boolean}
     */
    isReady() {
        return this._isBlueprintsLoaded;
    }
}
//============================================================================
// INIT THE CRAFTING SYSTEM
//============================================================================
/** @type {CraftDB} */
CraftDB.inst = new CraftDB();
//============================================================================
// Crafting Blueprint Class
//============================================================================
class Blueprint {
    /**
     * Handle blueprint
     */
    constructor() {
        /** @type {string} */
        this.itemID = '';
        /** @type {BlueprintComponent[]} */
        this.components = [];
        /** @type {number} */
        this.level = 0;
        /** @type {number} */
        this.exp = 1;
        /** @type {number} */
        this.quantity = 1;
        /** @type {number} In-game minutes */
        this.duration = 10;
        /** @type {boolean} */
        this.quality = false;
        /** @type {string} */
        this.require = CraftType.None;
    }
}
//============================================================================
// Crafting Component Class
//============================================================================
class BlueprintComponent {
    /**
     * Handle for crafting component
     */
    constructor() {
        /** @type {string} */
        this.itemID = '';
        /** @type {string} */
        this.tag = '';
        /** @type {number} */
        this.number = 0;
        /** @type {number} */
        this.level = 0;
    }
}

//========================================================================
// RPG MAKER SECTION
//========================================================================

var DSI_Sys2_CraftingSystem_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function () {
    const result = DSI_Sys2_CraftingSystem_Scene_Boot_isReady.call(this);
    return result && CraftDB.inst.isReady();
};

var DSI_Sys2_CraftingSystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys2_CraftingSystem_Game_System_createSaveableObjects.call(this);
    this._craftingSystem = new CraftManager();
}