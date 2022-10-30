//=======================================================================
// * Plugin Name  : DSI_Sprite_KeyHint.js
// * Last Updated : 8/5/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Sprite Key Hint
 * @help 
 * Empty Help
 */

ImageManager.loadKey = function (filename, dir) {
    return ImageManager.loadBitmap("img/system/keys/" + dir + "/", filename);
}

class Sprite_KeyHint extends Sprite {
    /**
     * Sprite Key Hint 
     * @param {string} keyAction 
     * @param {string} textKey 
     */
    constructor(keyAction, textKey, autoRefresh = true, mode = null) {
        super();
        this._keyAction = keyAction;
        this._textKey = textKey;
        this.create();
        this._autoRefresh = autoRefresh;
        if (autoRefresh) {
            EventManager.on(GameEvent.InputModeChanged, this.onInputModeChanged, this);
        } else {
            this.mode = mode;
        }
        this.refresh();
    }
    /**
     * Get hint bg path
     * @returns {string}
     */
    hintBGPath() {
        return "img/menus/KeyHintBG.png";
    }
    /**
     * Create all sprites
     */
    create() {
        const bg = new PIXI.NineSlicePlane(PIXI.Texture.from(this.hintBGPath()), 6, 7, 6, 7);
        bg.alpha = 0.85;
        this.addChild(bg);
        this._background = bg;

        const style = new PIXI.TextStyle({
            fill: "#eeb051",
            fontFamily: "Verdana",
            fontSize: 16,
            fontWeight: "bold",
            align: "center",
        });
        const keyText = new PIXI.Text("", style);
        this._keyText = keyText;
        this._keyText.style.fontFamily = "Verdana";
        this.addChild(keyText);

        this._keySprite = new Sprite();
        this.addChild(this._keySprite);
        
        const actionStyle = new PIXI.TextStyle({
            fill: "#fff5de",
            fontFamily: "Verdana",
            fontSize: 16,
        });
        const actionText = new PIXI.Text("", actionStyle);
        this._actionText = actionText;
        this.addChild(actionText);
    }
    /**
     * Get Input Mode
     * @returns {string}
     */
    getInputMode() {
        return this.mode || Input.getInputMode();
    }
    /**
     * Refresh sprite
     * @param {string} mode 
     */
    refresh() {
        const inputMode = this.getInputMode();
        const isKeyboard = inputMode === 'keyboard';
        const isGamepad = inputMode === 'gamepad';
        const currentMappedKey = Input.getCurrentMapping(this._keyAction, inputMode);
        const data = isKeyboard ? KeyCodeToNameConverter[currentMappedKey] : ButtonConverter[currentMappedKey];
        let buttonName = data;
        if (isGamepad) {
            const button = currentMappedKey;
            this._keySprite.bitmap = button != undefined ? ImageManager.loadMenu('Gamepad_' + button, 'keys') : null;
            buttonName = "";
            this._keySprite.visible = true;
        } else {
            if (buttonName && buttonName.match(/\@(.+)/i)) {
                buttonName = '';
                this._keySprite.visible = true;
                this._keySprite.bitmap = ImageManager.loadMenu(RegExp.$1, 'keys');
                this._keySprite.bitmap.smooth = false;
            } else {
                this._keySprite.visible = false;
            }
        }
        const actionName = this._textKey ? LocalizeManager.t(this._textKey) : "";
        if (buttonName && actionName.length == 0 && isKeyboard) {
            // Add padding when there is only key name is presented
            buttonName = " " + buttonName + " ";
        }
        this._keyText.text = `${buttonName}`;
        this._actionText.text = ` ${actionName}`;

        const keyWidth = buttonName ? this._keyText.width : 20; 
        const actionWidth = actionName ? this._actionText.width : 0;

        this._background.width = keyWidth + actionWidth + 10;
        this._background.height = 27;

        this._keyText.x = 4;
        this._keyText.y = 4;

        this._keySprite.x = this._keyText.x;
        this._keySprite.y = this._keyText.y;
        
        this._actionText.x = this._keyText.x + keyWidth;
        this._actionText.y = this._keyText.y;

        this.width = this._background.width;
        this.height = this._background.height;
    }
    /**
     * On Input Mode Changed
     * @param {string} mode 
     */
    onInputModeChanged(mode) {
        this.refresh(mode);
    }
    /**
     * Destroy Sprite
     */
    destroy() {
        if (this._autoRefresh) {
            EventManager.off(GameEvent.InputModeChanged, this.onInputModeChanged, this);
        }
        super.destroy();
    }

}