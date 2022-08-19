//=======================================================================
// * Plugin Name  : DSI_Sys6_Sprite_FarmDecor.js
// * Last Updated : 8/20/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 */
class Sprite_FarmDecor extends Sprite_FarmBuilding {
    /**
     * Get decor object
     * @returns {DecoratingObject}
     */
    get decor() {
        return this.farmObject;
    }
    /**
     * @inheritdoc
     */
    refreshBitmap() {
        if (this.farmObject.autotileType()) {
            this.refreshAutotileBitmap();
        } else {
            super.refreshBitmap();
        }
    }
    /**
     * Refresh bitmap for autotile object
     */
    refreshAutotileBitmap() {
        this.autotileId = this.decor.autotileId;
        this.bitmap = this.bitmap || new Bitmap(32, 32);
        this.bitmap.clear();
        const bitmap = ImageManager.loadFarm(this.decor.imageFile());
        bitmap.addLoadListener(bitmap => {
            AutotileUtils.makeSegmentTile(bitmap, this.bitmap, this.autotileId);
        });
        this._screenZ = 1;
    }
    /**
     * Check for autotile changed
     */
    checkAutotileChange() {
        if (!this.farmObject.autotileType()) return;
        if (this.autotileId == this.farmObject.autotileId) return;
        console.log(this.farmObject.autotileId);
        this.refreshBitmap();
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update()
        this.checkAutotileChange();
    }
}