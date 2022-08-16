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
class CraftManager {
    /**
     * This is the core of the crafting in Peaceful Days.
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
/** @type {CraftManager} */
CraftManager.inst = new CraftManager();
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
    return result && CraftManager.inst.isReady();
};