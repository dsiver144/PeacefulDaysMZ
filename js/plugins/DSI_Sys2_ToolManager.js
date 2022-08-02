//=======================================================================
// * Plugin Name  : DSI_Sys2_ToolManager.js
// * Last Updated : 8/2/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Range Manager
 * @help 
 * Empty Help
 * 
 */

class ToolManager extends SaveableObject {
    /**
     * This call will handle all tools in Peaceful Days.
     */
    constructor() {
        super();
        ToolManager.inst = this;
        /** @type {Map<string, PD_Tool>} */
        this._tools = new Map();
        this.addBasicTools();
    }
    /**
     * Add Tool
     * @param {PD_Tool} tool 
     */
    addTool(tool) {
        this._tools.set(tool.getType(), tool);
    }
    /**
     * Add basic tools
     */
    addBasicTools() {
        const hoe = new Hoe();
        this.addTool(hoe);
        const hammer = new Hammer();
        this.addTool(hammer);
        const axe = new Axe();
        this.addTool(axe);
        const sickle = new Sickle();
        this.addTool(sickle);
        const seedPack = new SeedPack();
        this.addTool(seedPack);
        const wateringCan = new WateringCan();
        this.addTool(wateringCan);
    }
    /**
     * Use A Tool 
     * @param {Game_CharacterBase} user 
     * @param {string} toolType 
     * @param {number} x 
     * @param {number} y 
     * @param {number} powerCharged 
     */
    useTool(user, toolType, x, y, powerCharged) {
        const tool = this._tools.get(toolType);
        tool && tool.use(user, x, y, powerCharged);
    }
    /**
     * @inheritdoc
     */
    getSaveData() {
        const data = super.getSaveData();
        const savedTools = {};
        for (const [type, tool] of this._tools.entries()) {
            savedTools[type] = tool.getSaveData();
        }
        data.tools = savedTools;
    }
    /**
     * @inheritdoc
     */
    loadSaveData(data) {
        super.loadSaveData(data);
        const savedTools = data.tools;
        /** @type {Map<string, PD_Tool>} */
        const newTools = new Map();
        for (const type in savedTools) {
            const tool = new PD_Tool();
            tool.loadSaveData(savedTools[type]);
            newTools.set(type, tool);
        }
        this._tools = newTools;
    }
    
}
/** @type {ToolManager} */
ToolManager.inst = null;

class PD_Tool extends SaveableObject {
    /**
     * This class will handle tool interact with farmland.
     */
    constructor() {
        super();
        this.level = 1;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ['level', 0]
        ]
    }
    /**
     * Get I
     * @returns {string}
     */
    itemId() {
        return ''
    }
    /**
     * Get Tool Type
     * @returns {string}
     */
    getType() {
        return ToolType.none;
    }
    /**
     * Use Tool
     * @param {Game_CharacterBase} user
     * @param {number} x X position when level 0
     * @param {number} y Y position when level 0
     * @param {number} powerCharged the power has been charged by user
     */
    use(user, x, y, powerCharged) {
        
    }
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys2_ToolManager_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
	DSI_Sys2_ToolManager_Game_System_createSaveableObjects.call(this);
    this._toolManager = new ToolManager();
}