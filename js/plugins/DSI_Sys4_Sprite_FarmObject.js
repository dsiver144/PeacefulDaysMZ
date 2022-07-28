//=======================================================================
// * Plugin Name  : DSI_Sys4_Sprite_FarmObject.js
// * Last Updated : 7/25/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Sprite Farm Object
 * @help 
 * Empty Help
 */
class Sprite_FarmObject extends Sprite {
    /**
     * A class that handle farm object display.
     * @param {FarmObject} farmObject
     */
    constructor(farmObject) {
        super();
        this.farmObject = farmObject;
        this.createOptionalSprites();
        this.refreshBitmap();
        this.updatePosition();
    }
    /**
     * Create optional sprites
     */
    createOptionalSprites() {
        
    }
    /**
     * Remove optional sprites
     */
    removeOptionalSprites() {

    }
    /**
     * Refresh bitmap
     */
    refreshBitmap() {
        this.bitmap = ImageManager.loadFarm("StonePath", "decorators");
        this.setFrame(0, 0, 32, 32);
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.updatePosition();
    }
    /**
     * Update sprite position
     */
    updatePosition() {
        this.x = this.screenX();
        this.y = this.screenY();
        this.z = this.screenZ();
    }
    /**
     * Display X
     * @returns {number}
     */
    displayX() {
        return this.farmObject.position.x;
    }
    /**
     * Display Y
     * @returns {number}
     */
    displayY() {
        return this.farmObject.position.y;
    }
    /**
     * Scrolled X
     * @returns {number}
     */
    scrolledX() {
        return $gameMap.adjustX(this.displayX());
    }
    /**
     * Scrolled Y
     * @returns {number}
     */
    scrolledY() {
        return $gameMap.adjustY(this.displayY());
    }
    /**
     * Screen X
     * @returns {number}
     */
    screenX() {
        const tw = $gameMap.tileWidth();
        return Math.floor(this.scrolledX() * tw + tw / 2);
    }
    /**
     * Screen Y
     * @returns {number}
     */
    screenY() {
        const th = $gameMap.tileHeight();
        return Math.floor(
            this.scrolledY() * th + th
        );
    }
    /**
     * Screen Z
     * @returns {number}
     */
    screenZ() {
        return 0;
    }
}