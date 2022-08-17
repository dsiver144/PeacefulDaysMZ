//=======================================================================
// * Plugin Name  : DSI_Sys4_Sprite_FarmConstruction.js
// * Last Updated : 8/17/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Sprite Farm Obstacle
 * @help 
 * Empty Help
 */

class Sprite_FarmConstruction extends Sprite_FarmObject {
    /**
     * Check if this can be control
     * @returns {boolean}
     */
    isControlable() {
        return this.construction().isBeingMove();
    }
    /**
     * Update input
     */
    updateInput() {
        if (!this.isControlable()) return;
        const construction = this.construction();
        const inputMode = Input.getInputMode();
        if (inputMode === 'keyboard') {
            const x = $gameMap.canvasToMapX(TouchInput.x);
            const y = $gameMap.canvasToMapY(TouchInput.y);
            construction.position.x = x;
            construction.position.y = y;
            const valid = construction.canPlaceAt(x, y);
            this.opacity = valid ? 255 : 100;
        } else {
            if (Input.isRepeated(FieldKeyAction.MoveLeft)) {
                this.farmObject.position.x -= 1;
            }
            if (Input.isRepeated(FieldKeyAction.MoveRight)) {
                this.farmObject.position.x += 1;
            }
            if (Input.isRepeated(FieldKeyAction.MoveUp)) {
                this.farmObject.position.y -= 1;
            }
            if (Input.isRepeated(FieldKeyAction.MoveDown)) {
                this.farmObject. position.y += 1;
            }
        }
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateInput();
    }
    /**
     * Get Farm Tile
     * @returns {FarmConstruction}
     */
    construction() {
        return this.farmObject;
    }
    /**
     * @inheritdoc
     */
    createOptionalSprites() {

    }
    /**
     * @inheritdoc
     */
    removeOptionalSprites() {

    }
    /**
     * @inheritdoc
     */
    updatePosition() {
        super.updatePosition();
    }
    /**
     * @inheritdoc
     */
    refreshBitmap() {
        const construction = this.construction();
        this.displayOffset = construction.displayOffset();
        this.bitmap = ImageManager.loadFarm(construction.imageFile());
        this.bitmap.addLoadListener(bitmap => {
            const { x, y, width, height } = construction.imageRect();
            this.setFrame(x, y, width, height);
            this.updatePosition();
            this.anchor.x = 0;
            this.anchor.y = 1.0;
            this.displayOffset.y += bitmap.height * this.anchor.y;
            this.updateTopLeftOffset();
            this.setOffscreenLimit(1, 1);
        });
    }
    /**
     * @inheritdoc
     */
    onCollideWithObject() {
        return;
    }
    /**
     * Screen X
     * @returns {number}
     */
    screenX() {
        const tw = $gameMap.tileWidth();
        return Math.floor(this.scrolledX() * tw) + this.displayOffset.x;
    }
    /**
     * Screen Y
     * @returns {number}
     */
    screenY() {
        const th = $gameMap.tileHeight();
        return Math.floor(
            this.scrolledY() * th
        ) + this.displayOffset.y;
    }
    /**
     * @inheritdoc
     */
    screenZ() {
        return 3;
    }

}