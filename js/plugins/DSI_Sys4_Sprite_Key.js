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
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this._keySprite = new Sprite();
        this._keySprite.anchor.x = 0.5;
        this._keySprite.anchor.y = 0.5;
        this.addChild(this._keySprite);
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
        return this._maxFrameIndex;
    }
    /**
     * Set Key Image
     * @param {Bitmap} bitmap
     * @param {number} bitmap
     */
    setImage(bitmap, maxFrames = 1) {
        this.bitmap = bitmap;
        this._maxFrameIndex = maxFrames - 1;
        bitmap && this.bitmap.addLoadListener(bitmap => {
            this.updateFrame();
        });
        this.refreshKeySprite();
    }
    /**
     * Refresh Key Sprite
     */
    refreshKeySprite() {
        const inputMode = Input.getInputMode();
        const data = inputMode === 'keyboard' ? KeyCodeToNameConverter[DefaultKeyboardConfig[this._keyAction]] : ButtonConverter[DefaultGamePadConfig[this._keyAction]];
        let buttonName = data;
        let buttonColor = '#ddcebf';
        let isImage = false;
        if (Array.isArray(data)) {
            buttonName = data[0];
            buttonColor = data[1];
        }
        if (buttonName.match(/@(.+)/i)) {
            isImage = true;
            buttonName = RegExp.$1;
        }
        let bitmap = null;
        console.log(this._keyAction, isImage, buttonName, buttonColor);
        if (isImage) {
            bitmap = ImageManager.loadKey(buttonName, inputMode);
        } else {
            bitmap = new Bitmap(48, 48);
            bitmap.textColor = buttonColor;
            bitmap.fontSize = 22;
            bitmap.outlineColor = 'ddcebf';
            bitmap.outlineWidth = 3;
            bitmap.drawText(buttonName, 0, 0, bitmap.width, bitmap.height, 'center');
        }
        this._keySprite.bitmap = bitmap;
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