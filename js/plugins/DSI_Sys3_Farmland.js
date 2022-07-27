//=======================================================================
// * Plugin Name  : DSI_Sys3_Farmland.js
// * Last Updated : 7/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Farm Land
 * @help 
 * Empty Help
 */
class Farmland extends SaveableObject {
    /**
     * Create a farm land
     * @param {number} mapId 
     * @param {number} mapWidth 
     */
    constructor(mapId) {
        super();
        /** @type {number} */
        this.mapId = mapId;
        /** @type {Object.<string, FarmObject>} */
        this.farmObjects = {};
    }
    /**
     * On New Day
     */
    onNewDay() {
        for (const pos in this.farmObjects) {
            this.farmObjects[pos].onNewDay();
        }
    }
    /**
     * Check interact with farm object;
     * @param {number} x 
     * @param {number} y 
     */
    checkInteract(x, y) {
        const object = this.getObject(x, y);
        if (!object) return false;
        if (!object.interactable()) return false;
        object.onInteract();
        return true;
    }
    /**
     * Use Tool
     * @param {ToolType} toolType 
     * @param {number} x 
     * @param {number} y 
     * @param {any} toolEx 
     */
    useTool(toolType, x, y, toolEx = null) {
        console.log({toolType, x, y, toolEx});
        switch(toolType) {
            case ToolType.hoe:
                this.useHoe(x, y);
                break;
            case ToolType.seedPack:
                this.useSeed(x, y, toolEx);
            case ToolType.hammer:
                this.useHammer(x, y);
                break;
        }
    }
    /**
     * Use Hoe
     * @param {number} x 
     * @param {number} y 
     */
    useHoe(x, y) {
        if (this.getObject(x, y)) return;
        const farmTile = new FarmTile(v2(x, y), this.mapId);
        this.addObject(farmTile);
    }
    /**
     * Use Hammer
     * @param {number} x 
     * @param {number} y 
     * @param {number} seedId
     */
    useSeed(x, y, seedId) {
        
    }
    /**
     * Use Hammer
     * @param {number} x 
     * @param {number} y 
     */
    useHammer(x, y) {
        
    }
    /**
     * Get Object At
     * @param {number} x 
     * @param {number} y 
     * @returns {FarmObject}
     */
    getObject(x, y) {
        return this.farmObjects[this.pos(x, y)];
    }
    /**
     * Add Object
     * @param {FarmObject} object 
     */
    addObject(object) {
        const { x, y } = object.position;
        this.farmObjects[this.pos(x, y)] = object;
        object.onSpawned();
    }
    /**
     * 
     * @param {FarmObject} object 
     */
    removeObject(object) {
        const { x, y } = object.position;
        this.farmObjects.splice(this.pos(x, y), 1);
        object.onRemoved();
    }
    /**
     * Remove farm object at
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    removeObjectAt(x, y) {
        const object = this.farmObjects[this.pos(x, y)];
        if (!object) return false;
        this.removeObject(object);
        return true;
    }
    /**
     * Convert position to array position.
     * @param {number} x 
     * @param {number} y 
     * @returns {number}
     */
    pos(x, y) {
        return new Vector2(x, y).toString();
    }
    /**
     * Get All Save Properties
     * @returns {any[]}
     */
    saveProperties() {
        return [
            ["mapId", null],
        ]
    }
    /**
     * Get Save Data
     * @returns {any}
     */
    getSaveData() {
        const result = super.getSaveData();
        const savedObjects = {};
        for (const position in this.farmObjects) {
            savedObjects[position] = this.farmObjects[position].getSaveData();
        }
        result['farmObjects'] = savedObjects;
        return result;
    }
    /**
     * Load Save Data
     * @param {any} data 
     */
    loadSaveData(data) {
        super.loadSaveData(data);
        this.farmObjects = {};  
        for (const position in data['farmObjects']) {
            let savedObject = data['farmObjects'][position];
            let newFarmObject = eval(`new ${savedObject.type}()`);
            newFarmObject.loadSaveData(savedObject);
            this.farmObjects[position] = newFarmObject;
        }
    }
}