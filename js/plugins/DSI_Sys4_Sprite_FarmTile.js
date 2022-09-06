//=======================================================================
// * Plugin Name  : DSI_Sys4_Sprite_FarmTile.js
// * Last Updated : 7/27/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Sprite Farm Tile
 * @help 
 * Empty Help
 */

class Sprite_FarmTile extends Sprite_FarmObject {
    /**
     * Get Farm Tile
     * @returns {FarmTile}
     */
    farmTile() {
        return this.farmObject;
    }
    /**
     * Soil sprite key
     * @returns {string}
     */
    soilSpriteKey() {
        const {x, y} = this.farmObject.position;
        return `soil_${x}_${y}`;
    }
    /**
     * @inheritdoc
     */
    createOptionalSprites() {
        this._soilSprite = new Sprite();
        this._soilSprite.bitmap = ImageManager.loadFarm("Soil");
        this._soilSprite.setFrame(0, 0, 32, 32);
        this._soilSprite.anchor.x = 0.5;
        this._soilSprite.anchor.y = 1.0;
        MyUtils.addMapSprite(this.soilSpriteKey(), this._soilSprite);
    }
    /**
     * @inheritdoc
     */
    toggleDisplay(value) {
        super.toggleDisplay(value);
        this._soilSprite.renderable = value;
    }
    /**
     * @inheritdoc
     */
    removeOptionalSprites() {
        MyUtils.removeMapSprite(this.soilSpriteKey());
    }
    /**
     * @inheritdoc
     */
    updatePosition() {
        super.updatePosition();
        this._soilSprite.x = this.x;
        this._soilSprite.y = super.screenY();
        this._soilSprite.z = 0;
    }
    /**
     * @inheritdoc
     */
    refreshBitmap() {
        /** @type {FarmTile} */
        const farmTile = this.farmTile();
        // Refresh water image for soil sprite
        const waterRectX = farmTile.isWatered ? 32 : 0;
        this._soilSprite.setFrame(waterRectX, 0, 32, 32);
        // Refresh crop sprite
        if (this.refreshDead()) return;
        if (this.refreshNormal()) return;
        this.bitmap = null;
    }
    /**
     * Refresh on dead state
     * @returns {boolean}
     */
    refreshDead() {
        const farmTile = this.farmTile();
        if (!farmTile.hasSeed()) return false;
        if (!farmTile.isDead()) return false;
        this.bitmap = ImageManager.loadFarm("crops/CropDie");
        this.bitmap.addLoadListener(bitmap => {
            const frameWidth = bitmap.width;
            const frameHeight = bitmap.height;
            this.setFrame(0, 0, frameWidth, frameHeight);
            this.anchor.y = 1.0;
            this.anchor.x = 0.5;
            this._customScreenZ = 1;
            this._customYOffset = 0;
            this.updatePosition();
        });
        return true;
    }
    /**
     * Refresh on normal state
     * @returns {boolean}
     */
    refreshNormal() {
        const farmTile = this.farmTile();
        if (!farmTile.hasSeed()) return false;
        const seedConfig = farmTile.seedData();
        this.bitmap = ImageManager.loadFarm(seedConfig.imageFile, "crops");
        this.bitmap.addLoadListener(bitmap => {
            const stageIndex = farmTile.currentStage;
            const frameWidth = bitmap.width / (seedConfig.stages.length + 1);
            const frameHeight = bitmap.height;
            this.setFrame(frameWidth * stageIndex, 0, frameWidth, frameHeight);
            this.anchor.y = 0.75;
            this.anchor.x = 0.5;
            this._customYOffset = -bitmap.height * (1.0 - this.anchor.y);
            this.updatePosition();
            this.updateTopLeftOffset();
        });
        // Separate between fruit tree display and normal display.
        if (seedConfig.treeFlag) {
            // Hide soil sprite when it's fruit tree.
            this._soilSprite.opacity = 0;
            this.setOffscreenLimit(3, 4);
            if (farmTile.currentStage > 1) {
                // Only fade sprite when tree is grown up
                this.setFade(true);
            }
        } else {
            this._customScreenZ = farmTile.currentStage > 0 ? 3 : 1;
            this.setOffscreenLimit(1, 2);
        }
        return true;
    }
    /**
     * @inheritdoc
     */
    onCollideWithObject() {
        if (!this._collided) return;
        const farmTile = this.farmTile();
        if (!farmTile.hasSeed()) return;
        if (farmTile.isTree()) return;
        if (farmTile.isSeedStage()) return;
        this.shake(0.05);
    }
    /**
     * @inheritdoc
     */
    screenY() {
        const value = super.screenY();
        return value + (this._customYOffset ? this._customYOffset : 0);
    }
    /**
     * @inheritdoc
     */
    screenZ() {
        return this._customScreenZ != null ? this._customScreenZ : 3;
    }

}