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
class Sprite_FarmObject extends Sprite_Shakeable {
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
     * Check for collision.
     */
    checkForCollision() {
        if (!this.farmObject) return;
        const x = Math.round($gamePlayer._x);
        const y = Math.round($gamePlayer._y);
        if (x === this.farmObject.position.x && y === this.farmObject.position.y) {
            if (!this._collided) {
                this._collided = true;
                this.onCollideWithObject();
            }
        } else {
            if (this._collided) {
                this._collided = false;
                this.onCollideWithObject();
            }
        }
    }
    /**
     * On collide with object
     */
    onCollideWithObject() {
        
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.updatePosition();
        this.checkForCollision();
        // this.checkForVisibility();
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
    /**
     * Set Top Left Position
     * @param {number} x 
     * @param {number} y 
     */
    setTopLeftOffset(x, y) {
        // this._topLeftOffset = new Vector2(0, 0);
    }

    updateTopLeftOffset() {
        this._topLeftOffset = new Vector2(-this.width * this.anchor.x, -this.height * this.anchor.y);
    }
    /**
     * Set offscreen limit
     * @param {number} x 
     * @param {number} y 
     */
    setOffscreenLimit(x, y) {
        this._offscreenLimit = new Vector2(x, y);
    }
    /**
     * 
     */
    checkForVisibility() {
        // // console.log($gameMap.displayX() * 32, $gameMap.displayY() * 32)
        // if (!this._topLeftOffset) return;
        // if (!this._offscreenLimit) return;
        // const offsetX = this._offscreenLimit.x;
        // const offsetY = this._offscreenLimit.y;
        // const objectX = this.farmObject.position.x;
        // const objectY = this.farmObject.position.y;
        // const cameraX = $gameMap.displayX();
        // const cameraY = $gameMap.displayY();
        // if (objectX >= cameraX - offsetX && objectY >= cameraY - offsetY &&
        //     objectX) {
        //         if (!this.renderable) this.renderable = true;
        //     } else {
        //         if (this.renderable) this.renderable = false;
        //     }
    }
}