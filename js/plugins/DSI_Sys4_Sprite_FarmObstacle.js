//=======================================================================
// * Plugin Name  : DSI_Sys4_Sprite_FarmObstacle.js
// * Last Updated : 8/3/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Sprite Farm Obstacle
 * @help 
 * Empty Help
 */

class Sprite_FarmObstacle extends Sprite_FarmObject {
    /**
     * Get Farm Tile
     * @returns {FarmObstacle}
     */
    obstacle() {
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
        const obstacle = this.obstacle();
        this.displayOffset = obstacle.displayOffset();
        this.bitmap = ImageManager.loadFarm(obstacle.imageFile());
        this.bitmap.addLoadListener(bitmap => {
            const {x, y, width, height} = obstacle.imageRect();
            this.setFrame(x, y, width, height);
            this.updatePosition();
            this.anchor.x = 0;
            this.anchor.y = 0;
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

}