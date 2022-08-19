// TL TR BR BL L T R B
// 1 + 1                 0


class WoodenFence extends FarmObject {
    /**
     * @inheritdoc
     */
    autotileType() {
        return 'WoodenPath';
    }

    isCollidable() {
        return true;
    }
    /**
     * @inheritdoc
     */
    spriteClass() {
        return Sprite_FarmDecor;
    }
}

class Sprite_FarmDecor extends Sprite_FarmObject {
    /**
     * @inheritdoc
     */
    refreshBitmap() {
        this.autotileId = this.farmObject.autotileId;
        this.bitmap = this.bitmap || new Bitmap(32, 32);
        this.bitmap.clear();
        if (this.farmObject.autotileType()) {
            const bitmap = ImageManager.loadFarm('CustomFence8b', 'decorators');
            bitmap.addLoadListener(bitmap => {
                AutotileUtils.makeSegmentTile(bitmap, this.bitmap, this.autotileId);

                // const posX = this.autotileId % 8;
                // const posY = Math.floor(this.autotileId / 8);
                // this.bitmap.blt(bitmap, posX * 32, posY * 32, 32, 32, 0, 0);
            });
            // AutotileUtils.makeSegmentTile(ImageManager.loadFarm('WoodFence2', 'decorators'), this.bitmap, this.autotileId);
        }
    }
    /**
     * Check for autotile changed
     */
    checkAutotileChange() {
        if (this.autotileId == this.farmObject.autotileId) return;
        console.log(this.farmObject.autotileId);
        this.refreshBitmap();
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
    update() {
        super.update()
        this.checkAutotileChange();
    }
}