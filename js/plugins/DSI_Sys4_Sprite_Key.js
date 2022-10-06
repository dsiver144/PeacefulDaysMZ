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

ImageManager.loadKey = function (filename, dir) {
    return ImageManager.loadBitmap("img/system/keys/" + dir + "/", filename);
}

class Sprite_KeyHint extends Sprite {
    /**
     * Sprite Key Hint 
     * @param {string} keyAction 
     * @param {string} textKey 
     */
    constructor(keyAction, textKey, autoRefresh = true) {
        super();
        this._keyAction = keyAction;
        this._textKey = textKey;
        this.create();
        this._autoRefresh = autoRefresh;
        if (autoRefresh) {
            EventManager.on(GameEvent.InputModeChanged, this.onInputModeChanged, this);
        }
        this.refresh();
    }
    /**
     * Create all sprites
     */
    create() {
        const bg = new PIXI.NineSlicePlane(PIXI.Texture.from("img/menus/KeyHintBG.png"), 6, 7, 6, 7);
        this.addChild(bg);
        this._background = bg;

        const style = new PIXI.TextStyle({
            fill: "#ffd985",
            fontFamily: "Verdana",
            fontSize: 16,
            align: "center"
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
     * Refresh sprite
     * @param {string} mode 
     */
    refresh(mode) {
        const inputMode = mode || Input.getInputMode();
        const isKeyboard = inputMode === 'keyboard';
        const isGamepad = inputMode === 'gamepad';
        const currentMappedKey = Input.getCurrentMapping(this._keyAction, inputMode);
        const data = isKeyboard ? KeyCodeToNameConverter[currentMappedKey] : ButtonConverter[currentMappedKey];
        let buttonName = data;
        if (isGamepad) {
            console.log(this._keyAction, currentMappedKey);
            const button = currentMappedKey;
            this._keySprite.bitmap = ImageManager.loadMenu('Gamepad_' + button, 'keys');
            buttonName = "";
            this._keySprite.visible = true;
        } else {
            this._keySprite.visible = false;
        }

        const actionName = this._textKey ? LocalizeManager.t(this._textKey) : "";
        if (actionName.length == 0 && isKeyboard) {
            // Add padding when there is only key name is presented
            buttonName = " " + buttonName + " ";
        }
        this._keyText.text = `${buttonName}`;
        this._actionText.text = ` ${actionName}`;

        const keyWidth = buttonName ? this._keyText.width : 20; 
        const actionWidth = actionName ? this._actionText.width : 0;

        this._background.width = keyWidth + actionWidth + 8;
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