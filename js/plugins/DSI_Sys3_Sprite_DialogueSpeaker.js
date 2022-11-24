//=======================================================================
// * Plugin Name  : DSI_Sys3_Sprite_DialogueSpeaker.js
// * Last Updated : 11/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Sprite Dialogue Speaker
 * @help 
 * Empty Help
 * 
 */
class Sprite_DialogueSpeaker extends Sprite {
    /**
     * Dialogue Speaker Sprite
     */
    constructor() {
        super();
        this.opacity = 0;
        this.y = -0;
        this.scale.x = 2.0;
        this.scale.y = 2.0;
        this.anchor.y = 1.0;
        this._blinkDelay = -1;
        this._eyeClosed = false;
    }
    /**
     * Set Speaker
     * @param {DialogueSpeaker} dialogueSpeaker 
     */
    setSpeaker(dialogueSpeaker) {
        this._dialogueSpeaker = dialogueSpeaker;
        if (dialogueSpeaker.isAvailable()) {
            this._eyeClosed = true;
            this.bitmap = ImageManager.loadNPC(dialogueSpeaker.npcKey, dialogueSpeaker.emotion);
            this.x = -50;
            this.alpha = 0.0;
            this.startTween({x: 0, alpha: 1.0}, 20).delay(10).ease(Easing.easeInOutCubic);
        } else {
            this.bitmap = null;
            this._dialogueSpeaker = null;
        }
    }
    /**
     * Refresh
     */
    refresh() {
        if (!this._dialogueSpeaker) return;
        if (!this._dialogueSpeaker.isAvailable()) return;
        this._eyeClosed = true;
        this.bitmap = ImageManager.loadNPC(this._dialogueSpeaker.npcKey, this._dialogueSpeaker.emotion);
    }
    /**
     * Update blink animation
     */
    updateBlinkAnimation() {
        if (!this._dialogueSpeaker) return;
        if (!this._dialogueSpeaker.hasBlinkAnimation()) return;
        if (this._blinkDelay == -1) {
            this._blinkDelay = this._eyeClosed ? 30 + Math.random() * 120 : 5;
        } else {
            if (this._blinkDelay > 0) {
                this._blinkDelay -= 1;
            } else {
                this._blinkDelay = -1;
                this._eyeClosed = !this._eyeClosed;
                this.bitmap = ImageManager.loadNPC(this._dialogueSpeaker.npcKey, this._eyeClosed ? "Normal" : "Blink");
            }
        }
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateBlinkAnimation();
    }
}