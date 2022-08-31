//=======================================================================
// * Plugin Name  : DSI_Sys3_FarmBuilding.js
// * Last Updated : 8/17/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Farm Building
 * @help 
 * Empty Help
 * 
 * 
 */
const ConstructionConfig = {
    regionIds: [111, 112],
}

class Building extends FarmObject {
    /**
     * Create farm object
     * @param {Vector2} position 
     * @param {number} mapId 
     */
    constructor(position, mapId) {
        super(position, mapId);
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
        return Sprite_FarmBuilding;
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
     * Check if this object is being moved
     * @returns {boolean}
     */
    isBeingMove() {
        return !!this._moving;
    }
    /**
     * Preview Sprite Key
     * @returns {string}
     */
    previewSpriteKey() {
        return 'constructionPreview';
    }
    /**
     * Start move construction
     */
    startMove() {
        this._moving = true;
        const sprite = this.objectSprite(true);
        MyUtils.addMapSprite(this.previewSpriteKey(), sprite);
        $gamePlayer.setMoveStatus(false);
        CameraController.inst.setTarget(sprite, 600);
    }
    /**
     * End move construction
     */
    endMove() {
        this._moving = false;
        const farmland = FarmManager.inst.getFarmlandById(this.mapId);
        MyUtils.removeMapSprite(this.previewSpriteKey());
        farmland.addObject(this);
        $gamePlayer.setMoveStatus(true);
        CameraController.inst.restore();
    }
    /**
     * Check if this construction can be placed at specific position
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    canPlaceAt(x, y) {
        const validRegionIDs = this.validRegionIDs();
        const farmland = FarmManager.inst.getFarmlandById(this.mapId);
        const bottomSize = this.bottomSize();
        for (let ox = 0; ox < bottomSize.x; ox++) {
            for (let oy = 0; oy < bottomSize.y; oy++) {
                if (!this.collisionCondition(ox, oy)) continue;
                const checkX = x + ox;
                const checkY = y + oy;
                const regionId = $gameMap.regionId(checkX, checkY);
                if (farmland.getObject(checkX, checkY) || !validRegionIDs.includes(regionId)) return false;
            }
        }
        return true;
    }
    /**
     * Get valid region ids that object can be placed at.
     * @returns {number[]}
     */
    validRegionIDs() {
        return ConstructionConfig.regionIds;
    }
}

Building.place = function (constClass) {
    /** @type {Building} */
    const construction = new constClass(new Vector2(10, 10), $gameMap.mapId());
    construction.startMove();
    return construction;
}