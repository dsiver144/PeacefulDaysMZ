//=======================================================================
// * Plugin Name  : DSI_Sys3_Sprite_DialogueSpeaker.js
// * Last Updated : 11/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * @param testParam:number
 * @text Test Param
 * @type number
 * @default 144
 * @desc A Test Param
 * 
 */
/*~struct~PositionObject:
 * @param x:num
 * @text x
 * @desc X position
 * 
 * @param y:num
 * @text y
 * @desc Y Position
 *
 */
/*~struct~SoundEffect:
 * @param name:str
 * @text name
 * @type file
 * @dir audio/se/
 * @desc Choose the name of SE you want to use.
 *
 * @param volume:num
 * @text volume
 * @default 70
 * @desc Choose the volume value of the se
 * 
 * @param pitch:num
 * @text pitch
 * @default 100
 * @desc Choose the pitch value of the se
 * 
 * @param pan:num
 * @text pan
 * @default 0
 * @desc Choose the pan value of the se
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
            this.startTween({opacity: 255}, 10).ease(Easing.easeInOutCubic);
        } else {
            this.bitmap = null;
            this._dialogueSpeaker = null;
        }
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