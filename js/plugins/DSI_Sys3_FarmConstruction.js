//=======================================================================
// * Plugin Name  : DSI_Sys3_FarmConstruction.js
// * Last Updated : 8/17/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Farm Construction
 * @help 
 * Empty Help
 * 
 * 
 */
class FarmConstruction extends FarmObject {
    /**
     * Create farm object
     * @param {Vector2} position 
     * @param {number} mapId 
     */
    constructor(position, mapId) {
        super(position, mapId);
        this.type = this.constructor.name;
        this.init();
    }
    /**
     * Image File
     * @returns {string}
     */
    imageFile() {
        return "Buildings/"
    }
    /**
     * Get Image Rect 
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 32,
            height: 32
        }
    }
    /**
     * Display Offset
     * @returns {Vector2}
     */
    displayOffset() {
        return {
            x: 0,
            y: 0,
        }
    }
    /**
     * @inheritdoc
     */
    isCollidable() {
        return true;
    }
    /**
     * Save properties
     */
    saveProperties() {
        const props = super.saveProperties();
        return props.concat([
            // ['hp', 0]
        ]);
    }
    /**
     * Init object
     */
    init() {
        this.type = this.constructor.name;
    }
    /**
     * On Interact
     */
    onInteract() {
        // Player pick up the obstacle
        console.log('You interact with', this.type);
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_FarmConstruction;
    }
}

class Coop extends FarmConstruction {
    /**
     * @inheritdoc
     */
    init() {

    }
    /**
     * @inheritdoc
     */
    interactable() {
        return true;
    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return {x: 5, y: 2};
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 160,
            height: 160
        }
    }
    /**
     * @inheritdoc
     */
    displayOffset() {
        return {x: 0, y: -64}
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "Coop";
    }
}