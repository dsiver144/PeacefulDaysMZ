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
     * @param {Position} position 
     * @param {number} mapId 
     */
    constructor(position, mapId) {
        super();
        /** @type {Position} */
        this.position = position;
        /** @type {number} */
        this.mapId = mapId;
        /** @type {string} */
        this.type = 'FarmObject';
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
}
