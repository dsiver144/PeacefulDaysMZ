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
     * @inheritdoc
     */
    createOptionalSprites() {
        const {x, y} = this.farmObject.position;
        this._soilSprite = new Sprite();
        this._soilSprite.bitmap = ImageManager.loadFarm("Soil");
        this._soilSprite.setFrame(0, 0, 32, 32);
        this._soilSprite.anchor.x = 0.5;
        this._soilSprite.anchor.y = 1.0;
        MyUtils.addCustomSpriteToTilemap(`soil_${x}_${y}`, this._soilSprite);
    }
    /**
     * @inheritdoc
     */
    updatePosition() {
        super.updatePosition();
        this._soilSprite.x = this.x;
        this._soilSprite.y = this.y;
        this._soilSprite.z = 0;
    }
    /**
     * @inheritdoc
     */
    refreshBitmap() {
        /** @type {FarmTile} */
        const farmTile = this.farmTile();
        if (farmTile.hasSeed()) {
            const seedConfig = FarmManager.getSeedData(farmTile.seedId);
            this.bitmap = ImageManager.loadFarm(seedConfig.imageFile);
            this.bitmap.addLoadListener(bitmap => {
                const stageIndex = farmTile.currentStage;
                const frameWidth = bitmap.width / (seedConfig.stages.length + 1);
                const frameHeight = bitmap.height;
                this.setFrame(frameWidth * stageIndex, 0, frameWidth, frameHeight);
                this.anchor.y = 1.0;
                this.anchor.x = 0.5;
            });
        }
    }
    /**
     * @inheritdoc
     */
    screenY() {
        return super.screenY();
    }
    /**
     * @inheritdoc
     */
    screenZ() {
        return 3;
    }

}