//=======================================================================
// * Plugin Name  : DSI_Sys4_Sprite_FarmBuilding.js
// * Last Updated : 8/17/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Sprite Farm Building
 * @help 
 * Empty Help
 */
const BuildingSpriteConfig = {
    previewOpacity: 200,
    previewValidColor: [146, 235, 52, 150],
    previewInvalidColor: [235, 73, 52, 150],
    previewZ: 5
}

class Sprite_FarmBuilding extends Sprite_FarmObject {
    /**
     * Check if this can be control
     * @returns {boolean}
     */
    isControlable() {
        return this.building().isBeingMove();
    }
    /**
     * @inheritdoc
     */
    checkForVisibility() {
        if (this.isControlable()) return;
        super.checkForVisibility();
    }
    /**
     * Update input
     */
    updateInput() {
        if (!this.isControlable()) return;
        const building = this.building();
        const inputMode = Input.getInputMode();
        const lastX = building.position.x;
        const lastY = building.position.y;
        this._screenZ = BuildingSpriteConfig.previewZ;
        this.opacity = BuildingSpriteConfig.previewOpacity;
        
        if (inputMode === 'keyboard') {
            const x = $gameMap.canvasToMapX(TouchInput.x);
            const y = $gameMap.canvasToMapY(TouchInput.y);
            building.position.x = x;
            building.position.y = y;
        } else {
            if (Input.isRepeated(FieldKeyAction.MoveLeft)) {
                building.position.x -= 1;
            }
            if (Input.isRepeated(FieldKeyAction.MoveRight)) {
                building.position.x += 1;
            }
            if (Input.isRepeated(FieldKeyAction.MoveUp)) {
                building.position.y -= 1;
            }
            if (Input.isRepeated(FieldKeyAction.MoveDown)) {
                building.position.y += 1;
            }
        }
        if (building.position.x != lastX || building.position.y != lastY) {
            const {x, y} = building.position;
            this.isValidPosToPlaceObject = building.canPlaceAt(x, y);
            const {previewValidColor, previewInvalidColor} = BuildingSpriteConfig;
            this.setBlendColor(this.isValidPosToPlaceObject ? previewValidColor: previewInvalidColor);
        }
        if (this.isValidPosToPlaceObject && Input.isTriggered(FieldKeyAction.Check)) {
            building.endMove();
        }
        this.updateCustomInput();
    }
    /**
     * Update custom input
     */
    updateCustomInput() {

    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateInput();
        this.updateAnimation();
    }
    /**
     * Get Farm building
     * @returns {Building}
     */
    building() {
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
     * Get offset limit
     * @returns {Vector2}
     */
    offsetLimit() {
        const imgRect = this.building().imageRect();
        return {
            x: imgRect.width / 32, 
            y: imgRect.height / 32
        }
    }
    /**
     * @inheritdoc
     */
    refreshBitmap() {
        const building = this.building();
        this.displayOffset = building.displayOffset();
        this.bitmap = ImageManager.loadFarm(building.imageFile());
        this.bitmap.addLoadListener(bitmap => {
            const { x, y, width, height } = building.imageRect();
            this.setFrame(x, y, width, height);
            this.anchor.x = building.displayAnchor().x;
            this.anchor.y = building.displayAnchor().y;
            this.displayOffset.y += bitmap.height * this.anchor.y;
            
            this.updateTopLeftOffset();
            const limit = this.offsetLimit();
            this.setOffscreenLimit(limit.x, limit.y);

            this._hasAnim = building.animationFrames() > 0;
            this._animIndex = 0;
            this._animationCount = 0;

            this.updatePosition();
            this.setFade(true, 32);
        });
        this._screenZ = 3;
    }
    /**
     * Update animation
     * @returns {void}
     */
    updateAnimation() {
        if (!this.hasAnimation()) return;
        this._animationCount += 1;
        if (this._animationCount >= this.building().animationInterval()) {
            const building = this.building();
            this._animIndex = (this._animIndex + 1) % building.animationFrames();
            const { y, width, height } = building.imageRect();
            this.setFrame(width * this._animIndex, y, width, height);
            this._animationCount = 0;
        }
    }
    /**
     * Has Animation
     * @returns {boolean}
     */
    hasAnimation() {
        return this._hasAnim;
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
        return this._screenZ;
    }

}

