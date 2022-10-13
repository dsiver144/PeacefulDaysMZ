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
const NotificationConfig = {
    spacing: 40,
    limitY: 180
}

class Notify {
    /** @type {Notify} */
    static inst = null;
    static init() {
        new Notify();
    }
    /**
     * This class handle all stuff related to notification for Peaceful Days
     */
    constructor() {
        Notify.inst = this;
        /** @type {Sprite_Notification[]} */
        this._notifications = [];
    }
    /**
     * Get notifications
     */
    get notifications() {
        return this._notifications;
    }
    /**
     * Show Inventory Full Notification
     */
    showInventoryFull() {
        const content = LocalizeManager.t('Lb_InventoryFull');
        this.show(content, 1);
    }
    /**
     * Show Item
     * @param {string} itemId 
     * @param {number} amount 
     */
    showItem(itemId, amount) {
        const {localizeKey, iconIndex} = ItemDB.get(itemId);
        const sign = amount < 0 ? " -" : " +";
        const content = LocalizeManager.t(localizeKey) + sign + amount;
        this.show(content, iconIndex);
    }
    /**
     * Show Notification
     * @param {string} textKey 
     * @param {number} iconIndex 
     */
    show(textKey, iconIndex = -1) {
        this.pushUpOtherNotifications();
        const notification = new Sprite_SlideNotification();
        notification.showNotif(textKey, iconIndex);
        ScreenOverlay.addChild(notification);
        this._notifications.push(notification);
    }
    /**
     * Remove notification
     * @param {Sprite_Notification} sprite 
     */
    removeNotification(sprite) {
        this._notifications.splice(
            this._notifications.indexOf(sprite),
            1
        );
    }
    /**
     * Push up all notifications
     */
    pushUpOtherNotifications() {
        this._notifications.forEach(notif => {
            notif.pushUp();
        });
    }
}

Notify.init();

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
     * @param {string} text 
     * @param {number} iconIndex 
     * @param {number} slotId 
     */
    showNotif(text, iconIndex = -1, slotId) {
        this._phase = 'show';
        this._slotId = slotId;
        this.updateContent(text, iconIndex);
        this.startShow();
    }
    /**
     * Push Up
     */
    pushUp() {
        this._targetY = this.y - NotificationConfig.spacing;
        if (this.y <= NotificationConfig.limitY) {
            this.visible = false;
        }
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
            fontSize: 14,
            fontWeight: "bold",
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
     * @param {string} text 
     * @param {number} iconIndex 
     * @param {number} slotId 
     */
    updateContent(text, iconIndex = -1) {
        this._icon.setIcon(iconIndex);
        this._content.text = text;
        const padding = 0;
        const spacing = 4;
        const iconSize = iconIndex >= 0 ? 32 + spacing : 0;
        const totalWidth = iconSize + this._content.width + padding + 25;
        this._background.width = totalWidth;
        this._background.height = 32;
        const yOffset = 2;
        this._icon.x = padding / 2;
        this._content.x = this._icon.x + iconSize;
        this._icon.y = yOffset;
        this._content.y = yOffset + 4;
    }
    /**
     * On Start Show Notification
     * @param {number} slotId
     */
    startShow() {

    }
    /**
     * Hide Notification
     */
    hideNotif() {
        Notify.inst.removeNotification(this);
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
     * @inheritdoc
     */
    destroy() {
        super.destroy();
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
     * Update Push Up
     */
    #updatePushUp() {
        if (this._targetY == null) return;
        this.y += (this._targetY - this.y) * 0.5;
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.#updateHideTimer();
        this.#updatePushUp();
    }
}

class Sprite_SlideNotification extends Sprite_Notification {
    /**
     * @inheritdoc
     */
    notifyBGConfig() {
        return ['img/menus/notify/NotifyBG.png', 0, 0, 15, 0];
    }
    /**
     * @inheritdoc
     */
    startShow() {
        this.y = 350;
        this.x = -300;
        this.opacity = 0;
        this.startTween({ x: 0, opacity: 255 }, 15).ease(Easing.easeInOutExpo);
        this.setHideTimer(120);
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