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
        this.checkForVisibility();
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
     * Update top left offset
     */
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
     * Check for visibility
     */
    checkForVisibility() {
        if (!this._topLeftOffset) return;
        if (!this._offscreenLimit) return;
        const topLeftX = this.x + this._topLeftOffset.x;
        const topLeftY = this.y + this._topLeftOffset.y;
        if (topLeftX >= -this._offscreenLimit.x * 32 && topLeftX + this.width <= Graphics.boxWidth + this._offscreenLimit.x * 32 &&
            topLeftY >= -this._offscreenLimit.y * 32 && topLeftY + this.height <= Graphics.boxHeight + this._offscreenLimit.y * 32) {
                if (!this.renderable) this.toggleDisplay(true);
            } else {
                if (this.renderable) this.toggleDisplay(false);
            }
    }
    /**
     * Toggle Display
     * @param {boolean} value 
     */
    toggleDisplay(value) {
        this.renderable = value;
    }
}