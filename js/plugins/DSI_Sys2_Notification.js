//=======================================================================
// * Plugin Name  : DSI_Sys2_Notification.js
// * Last Updated : 10/12/2022
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

class Notify {
    /** @type {Notify} */
    static inst = null;
    /**
     * This class handle all stuff related to notification for Peaceful Days
     */
    constructor() {
        Notify.inst = this;
    }
    /**
     * Show Notification
     * @param {string} textKey 
     * @param {number} iconIndex 
     */
    show(textKey, iconIndex = -1) {
        if (!SceneManager._scene) return;
        if (this._lastNofication) {
            this._lastNofication.hideNotif();
        }
        const notify = new Sprite_SlideNotification();
        notify.showNotif(textKey, iconIndex);
        SceneManager._scene.addChild(notify);
        this._lastNofication = notify;
    }
    /**
     * Show Inventory Full Notification
     */
    showInventoryFull() {
        this.show('Lb_InventoryFull', 1);
    }
}

new Notify();

class Sprite_Notification extends Sprite {
    /**
     * Sprite Notification
     */
    constructor() {
        super();
        this.#initMembers();
        this.#create();
    }
    /**
     * Show Notification
     * @param {string} textKey 
     * @param {number} iconIndex 
     */
    showNotif(textKey, iconIndex = -1) {
        this._phase = 'show';
        this.#updateContent(textKey, iconIndex);
        this.startShow();
    }
    /**
     * Set Hide Timer Duration
     * @param {number} duration 
     */
    setHideTimer(duration) {
        this._endTimerCounter = duration;
    }
    /**
     * Init Members
     */
    #initMembers() {
        this._phase = 'none';
    }
    /**
     * Notify Background Config
     * @returns any[]
     */
    notifyBGConfig() {
        return ['', 0, 0, 0, 0];
    }
    /**
     * Create Background
     */
    #createBackground() {
        const [img, left, top, right, bottom] = this.notifyBGConfig();
        const bg = new PIXI.NineSlicePlane(PIXI.Texture.from(img), left, top, right, bottom);
        this.addChild(bg);
        this._background = bg;
    }
    /**
     * Create Content Text
     */
    #createText() {
        const style = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            fontSize: 20,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
        });
        const text = new PIXI.Text("", style);
        this._content = text;
        this.addChild(text);
    }
    /**
     * Create Icon
     */
    #createIcon() {
        const icon = new Sprite_Icon(0);
        this._icon = icon;
        this.addChild(icon);
    }
    /**
     * Create all display objects
     */
    #create() {
        this.#createBackground();
        this.#createText();
        this.#createIcon();
    }
    /**
     * Update Content
     * @param {string} textKey 
     * @param {number} iconIndex 
     */
    #updateContent(textKey, iconIndex = -1) {
        this._icon.setIcon(iconIndex);
        this._content.text = LocalizeManager.t(textKey);
        const padding = 8;
        const spacing = 4;
        const iconSize = iconIndex >= 0 ? 32 + spacing : 0;
        const totalWidth = iconSize + this._content.width + padding + 25;
        this._background.width = totalWidth;
        const yOffset = 10;
        this._icon.x = padding / 2;
        this._content.x = this._icon.x + iconSize;
        this._icon.y = yOffset;
        this._content.y = yOffset;
    }
    /**
     * On Start Show Notification
     */
    startShow() {

    }
    /**
     * Hide Notification
     */
    hideNotif() {
        this._phase = 'ended';
        this.endShow();
    }
    /**
     * On end Show
     */
    endShow() {

    }
    /**
     * Check if this is busy
     * @returns {boolean}
     */
    isBusy() {
        return this._phase != 'ended';
    }
    /**
     * Check if hide timer is enabled
     * @returns {boolean}
     */
    timerEnabled() {
        return false;
    }
    /**
     * Update hide timer
     */
    #updateHideTimer() {
        if (!this.timerEnabled()) return;
        if (this._phase === 'ended') return;
        if (this._endTimerCounter < 0) return;
        this._endTimerCounter -= 1;
        if (this._endTimerCounter == 0) {
            this.hideNotif();
        }
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.#updateHideTimer();
    }
}

class Sprite_SlideNotification extends Sprite_Notification {
    /**
     * @inheritdoc
     */
    notifyBGConfig() {
        return ['img/menus/notify/NotifyBG.png', 0, 0, 25, 0];
    }
    /**
     * @inheritdoc
     */
    startShow() {
        this.y = 350;
        this.x = -300;
        this.opacity = 0;
        this.startTween({ x: 0, opacity: 255 }, 15).ease(Easing.easeInOutExpo);
        this.setHideTimer(60);
    }
    /**
     * @inheritdoc
     */
    timerEnabled() {
        return true;
    }
    /**
     * Update end show
     */
    updateEnd() {
        if (this._phase !== 'ended') return;
        this.y -= 1;
        this.opacity -= 25;
        if (this.opacity <= 0) {
            this.destroy();
        }
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.updateEnd();
    }
}