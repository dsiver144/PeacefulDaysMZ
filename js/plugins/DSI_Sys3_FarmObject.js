//=======================================================================
// * Plugin Name  : DSI_Sys3_FarmObject.js
// * Last Updated : 7/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Farm Object
 * @help 
 * Empty Help
 */
class FarmObject extends SaveableObject {
    /**
     * Create farm object
     * @param {Vector2} position 
     * @param {number} mapId 
     */
    constructor(position, mapId) {
        super();
        /** @type {Vector2} */
        this.position = position;
        /** @type {number} */
        this.mapId = mapId;
        /** @type {string} */
        this.type = 'FarmObject';
    }
    /**
     * Size
     * @returns {Vector2}
     */
    size() {
        return {x: 1, y: 1};
    }
    /**
     * Bottom Size
     * @returns {Vector2}
     */
    bottomSize() {
        return {x: 1, y: 1};
    }
    /**
     * Override: saveProperties
     */
    saveProperties() {
        return [
            ['position', null],
            ['type', null],
            ['mapId', null]
        ];
    }
    /**
     * Will be called when being spawned.
     */
    onSpawned() {

    }
    /**
     * Will be called when being removed;
     */
    onRemoved() {
        
    }
    /**
     * On New Day
     */
    onNewDay() {

    }
    /**
     * On Interact
     */
    onInteract() {

    }
    /**
     * On Hit By Tool
     * @param {TOOL_TYPE} toolType 
     */
    checkHitByTool(toolType) {
        if (!this.hittingTools().includes(toolType)) return false;
        return this.onHitByTool(toolType);
    }
    /**
     * Return all tool that can be used to hit this object
     * @returns {TOOL_TYPE[]}
     */
    hittingTools() {
        return [];
    }
    /**
     * On Hit By Tool. 
     * Must return correct boolean value if successfully or not.
     * @param {TOOL_TYPE} toolType 
     * @returns {boolean}
     */
    onHitByTool(toolType) {
        return false;
    }
    /**
     * Check if this object is interactable
     * @returns {boolean}
     */
    interactable() {
        return false;
    }
}
