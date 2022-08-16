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
const ToolConfig = {
    timeToCharge: 40,
    chargeTimeReduction: 20,
}

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
     * Get Equipped Tool
     * @returns {PD_Tool}
     */
    equippedTool() {
        return this._tools.get(window.curTool || "hoe");
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
        const sapling = new TreeSapling();
        this.addTool(sapling);
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
        return data;
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
            const tool = eval(`new ${savedTools[type].type}()`);
            tool.loadSaveData(savedTools[type]);
            newTools.set(type, tool);
        }
        this._tools = newTools;
    }
    /**
     * Update tools
     */
    update() {
        this.updateTools();
        this.updateInput();
    }
    /**
     * Update tools
     */
    updateTools() {
        this._tools.forEach(tool => tool.update());
    }
    /**
     * Update input
     */
    updateInput() {
        if (Input.isTriggered(FieldKeyAction.UseTool)) {
            const equippedTool = this.equippedTool();
            if (!equippedTool) return;       
            if (!equippedTool.isUsable()) return; 
            this._toolChargeAble = equippedTool.isChargeAble();
            this._toolChargeTime = equippedTool.chargeTime();
            this._toolMaxChargeLevel = equippedTool.maxChargeLevel();
            this._toolChargedLevel = 0;
            if (Input.getInputMode() === 'keyboard') {
                const px = Math.round($gamePlayer._x);
                const py = Math.round($gamePlayer._y);
                const x = $gameMap.canvasToMapX(TouchInput.x);
                const y = $gameMap.canvasToMapY(TouchInput.y);
                const dist = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
                if (dist <= 1.5) {
                    this._targetToolPos = new Vector2(x, y);
                    $gamePlayer.turnTowardPoint(x, y);
                    this._pressingToolBtn = true;
                    this._pressingToolCounter = 0;
                }
            } else {
                this._targetToolPos = $gamePlayer.frontPosition();
                this._pressingToolBtn = true;
                this._pressingToolCounter = 0;
            }
        }
        if (this._pressingToolBtn) {
            if (this._toolChargeAble && Input.isTriggered(FieldKeyAction.Check) || Input.isTriggered(FieldKeyAction.Cancel)) {
                SoundManager.playCancel();
                this._pressingToolBtn = false;
                return;
            }
            if (this._toolChargeAble && Input.isPressed(FieldKeyAction.UseTool)) {
                if (this._pressingToolCounter < this._toolChargeTime) {
                    this._pressingToolCounter += 1;
                } else {
                    this._pressingToolCounter = 0;
                    if (this._toolChargedLevel < this._toolMaxChargeLevel) {
                        this._toolChargedLevel += 1;
                        console.log("POWER LEVEL INCREASE: ", this._toolChargedLevel);
                        if (this._toolChargedLevel == this._toolMaxChargeLevel) {
                            SoundManager.playRecovery();
                        } else {
                            SoundManager.playReflection();
                        }
                    }
                }
                // console.log("Hold tool btn: ", this._pressingToolCounter);
            } else {
                const toolType = window.curTool || "hoe";
                const pos = this._targetToolPos;
                const power = this._toolChargedLevel;
                console.log("POWER LEVEL: ", this._toolChargedLevel);
                ToolManager.inst.useTool(this, toolType, pos.x, pos.y, power);
                this._pressingToolBtn = false;
            }
        }
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
        this.type = this.constructor.name;
        this.level = 0;
        this.coolDownCount = 0;
    }
    /**
     * Update per frame
     */
    update() {
        this.updateCooldown();
    }
    /**
     * Get the max cooldown
     * @returns {number} total frames
     */
    maxCooldown() {
        return 5;
    }
    /**
     * Check if the tool is on cooldown
     * @returns {boolean}
     */
    isOnCoolDown() {
        return this.coolDownCount > 0;
    }
    /**
     * Set cooldown to max cooldown
     */
    setCooldown() {
        this.coolDownCount = this.maxCooldown();
    }
    /**
     * Update cooldown timer
     */
    updateCooldown() {
        if (this.coolDownCount <= 0) return;
        this.coolDownCount -= 1;
    }
    /**
     * Check if this tool is usable
     * @returns {boolean}
     */
    isUsable() {
        return !this.isOnCoolDown();
    }
    /**
     * Check if this tool is chargeable.
     * @returns {boolean}
     */
    isChargeAble() {
        return this.level > 0;
    }
    /**
     * Get tool charge time in frames.
     * @returns {number}
     */
    chargeTime() {
        return ToolConfig.timeToCharge;
    }
    /**
     * Max charge level
     * @returns {number}
     */
    maxChargeLevel() {
        return this.level;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ['level', 0],
            ['type']
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
        this.onUse(user, x, y, powerCharged);
        this.setCooldown();
    }
    /**
     * On Tool Using
     * @param {Game_CharacterBase} user
     * @param {number} x X position when level 0
     * @param {number} y Y position when level 0
     * @param {number} powerCharged the power has been charged by user
     */
    onUse(user, x, y, powerCharged) {
        
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