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
const ConstructionConfig = {
    regionIds: [111, 112],
}

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
        this._moving = false;
    }
    /**
     * On Interact
     * @param {FarmObject} object
     */
    onInteract(object) {
        const offsetX = object.position.x - this.position.x;
        const offsetY = object.position.y - this.position.y;
        const { x, y, width, height } = this.interactionRange();
        if (offsetX >= x && offsetX <= x + width - 1 && offsetY >= y && offsetY <= y + height - 1) {
            console.log('You interact with', { offsetX, offsetY }, object);
        }
    }
    /**
     * Get interaction range
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    interactionRange() {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_FarmConstruction;
    }
    /**
     * Image File
     * @returns {string}
     */
    imageFile() {
        return "constructions/"
    }
    /**
     * @inheritdoc
     */
    interactable() {
        return true;
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
        const topTiles = this.imageRect().height / 32 - this.bottomSize().y;
        return {
            x: 0,
            y: -topTiles * 32,
        }
    }
    /**
     * @inheritdoc
     */
    isCollidable() {
        return true;
    }
    /**
     * Check if this construction is removable
     * @returns {boolean}
     */
    isRemovable() {
        return true;
    }
    /**
     * Check if this construction is movable
     * @returns {boolean}
     */
    isMovable() {
        return true;
    }
    /**
     * Check if this object is being move
     * @returns {boolean}
     */
    isBeingMove() {
        return !!this._moving;
    }
    /**
     * Start move construction
     */
    startMove() {
        this._moving = true;
        const sprite = this.objectSprite(true);
        MyUtils.addMapSprite('constructionPreview', sprite);
        CameraController.inst.setTarget(sprite, 600);
    }
    /**
     * End move construction
     */
    endMove() {
        this._moving = false;
        const farmland = FarmManager.inst.getFarmlandById(this.mapId);
        MyUtils.removeMapSprite('constructionPreview');
        farmland.addObject(this);
        CameraController.inst.restore();
    }
    /**
     * Check if this construction can be placed at specific position
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    canPlaceAt(x, y) {
        const farmland = FarmManager.inst.getFarmlandById(this.mapId);
        for (let ox = 0; ox < this.bottomSize().x; ox++) {
            for (let oy = 0; oy < this.bottomSize().y; oy++) {
                const checkX = x + ox;
                const checkY = y + oy;
                const regionId = $gameMap.regionId(checkX, checkY);

                if (farmland.getObject(checkX, checkY) || !ConstructionConfig.regionIds.includes(regionId)) return false;
            }
        }
        return true;
    }
}

FarmConstruction.placeConstruction = function (constClass) {
    /** @type {FarmConstruction} */
    const construction = new constClass(new Vector2(10, 10), $gameMap.mapId());
    construction.startMove();
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
    bottomSize() {
        return { x: 5, y: 2 };
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 160,
            height: 128
        }
    }
    /**
     * Get interaction range
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    interactionRange() {
        return { x: 1, y: 1, width: 1, height: 1 };
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "Coop";
    }
}

class Windmill extends FarmConstruction {
    /**
     * @inheritdoc
     */
    init() {

    }
    /**
     * @inheritdoc
     */
    bottomSize() {
        return { x: 3, y: 2 };
    }
    /**
     * @inheritdoc
     */
    imageRect() {
        return {
            x: 0,
            y: 0,
            width: 96,
            height: 224
        }
    }
    /**
     * Get interaction range
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    interactionRange() {
        return { x: 1, y: 1, width: 1, height: 1 };
    }
    /**
     * @inheritdoc
     */
    imageFile() {
        return super.imageFile() + "Windmill";
    }
}