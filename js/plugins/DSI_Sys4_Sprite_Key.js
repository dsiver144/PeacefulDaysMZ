//=======================================================================
// * Plugin Name  : DSI_Sys4_Sprite_Key.js
// * Last Updated : 8/5/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Sprite Key
 * @help 
 * Empty Help
 */

ImageManager.loadKey = function(filename, dir) {
    return ImageManager.loadBitmap("img/system/keys/" + dir + "/", filename);
}

class Sprite_KeyHint extends Sprite {
    /**
     * This class handle key hint display
     * @param {string} keyAction 
     */
    constructor(keyAction) {
        super();
        /** @type {string} */
        this._keyAction = keyAction;
        /** @type {boolean} */
        this._animated = false;
        /** @type {number} */
        this._frameIndex = 0;
        /** @type {number} */
        this._invervalCount = 0;
        this.setImage();
    }
    /**
     * Get frame change interval
     * @returns {number}
     */
    frameChangeInterval() {
        return 30;
    }
    /**
     * Max Frames
     * @returns {number}
     */
    maxFrameIndex() {
        return 1;
    }
    /**
     * Set Key Image
     */
    setImage() {
        this.bitmap = ImageManager.loadKey(...this.imagePath());
        this.bitmap.addLoadListener(bitmap => {
            this.updateFrame();
        });
    }
    /**
     * Image Path
     * @returns {string[]}
     */
    imagePath() {
        return ['89', 'keyboard'];
    }
    /**
     * Update frame
     * @returns {void}
     */
    updateFrame() {
        const frameWidth = this.bitmap.width / (this.maxFrameIndex() + 1);
        this.setFrame(this._frameIndex * frameWidth, 0, frameWidth, this.bitmap.height);
    }
    /**
     * Update Image
     * @returns {void}
     */
    updateImage() {
        if (!this.bitmap) return;
        if (this._animated) {
            this._invervalCount += 1;
            if (this._invervalCount >= this.frameChangeInterval()) {
                this._invervalCount = 0;
                this._frameIndex += 1;
                if (this._frameIndex > this.maxFrameIndex()) {
                    this._frameIndex = 0;
                }
                this.updateFrame();
            }
        } else {
            const frameIndex = Input.isPressed(this._keyAction) ? 1: 0;
            if (this._frameIndex != frameIndex) {
                this._frameIndex = frameIndex;
                this.updateFrame();
            }
        }
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateImage();
    }
}

class Sprite_KeyboardHint extends Sprite_KeyHint {
    /**
     * Image Path
     * @returns {string[]}
     */
     imagePath() {
        const img = DefaultKeyboardConfig[this._keyAction].toString();
        return [img, 'keyboard'];
    }
    /**
     * @inheritdoc
     */
     maxFrameIndex() {
        return 2;
    }
}

class Sprite_GamePadHint extends Sprite_KeyHint {
    /**
     * Image Path
     * @returns {string[]}
     */
     imagePath() {
        const img = DefaultGamePadConfig[this._keyAction].toString();
        return [img, 'gamepad'];
    }
}