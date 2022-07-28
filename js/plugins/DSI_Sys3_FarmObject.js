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
        console.log("> A new ", this.type, " has been spawned at " + this.position.toString(), this);
        this.objectSprite();
    }
    /**
     * Will be called when being removed;
     */
    onRemoved() {
        console.log("> A ", this.type, " has been removed at " + this.position.toString(), this);
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
        console.log("> A ", this.type, " has been interacted at " + this.position.toString(), this);
    }
    /**
     * On Hit By Tool
     * @param {ToolType} toolType 
     */
    checkHitByTool(toolType) {
        if (!this.hittingTools().includes(toolType)) return false;
        return this.onHitByTool(toolType);
    }
    /**
     * Return all tool that can be used to hit this object
     * @returns {ToolType[]}
     */
    hittingTools() {
        return [];
    }
    /**
     * On Hit By Tool. 
     * Must return correct boolean value if successfully or not.
     * @param {ToolType} toolType 
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
    /**
     * Check if RPG Character can collide with farm objects.
     * @returns {boolean}
     */
    isCollidable() {
        return false;
    }
    /**
     * Get object sprite
     */
    objectSprite() {
        let sprite = FarmManager.inst.getObjectSprite(this.position.x, this.position.y);
        if (!sprite && this.mapId == $gameMap.mapId()) {
            const constructor = this.spriteClass();
            sprite = new constructor(this);
            FarmManager.inst.addObjectSprite(this.position.x, this.position.y, sprite);
        }
        return sprite;
    }
    /**
     * Refresh object sprite
     */
    refreshSprite() {
        const sprite = this.objectSprite();
        sprite && sprite.refreshBitmap();
    }
    /**
     * Sprite Class
     * @returns {any}
     */
    spriteClass() {
        return Sprite_FarmObject;
    }
}
