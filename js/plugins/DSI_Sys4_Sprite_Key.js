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
    constructor(keyAction, textKey) {
        super();
        this._keyAction = keyAction;
        this._textKey = textKey;
        this.create();
        EventManager.on(GameEvent.InputModeChanged, this.onInputModeChanged, this);
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
        });
        const keyText = new PIXI.Text("", style);
        keyText.x += 4;
        keyText.y += 4;
        this._keyText = keyText;
        this.addChild(keyText);
        
        const actionStyle = new PIXI.TextStyle({
            fill: "#fff5de",
            fontFamily: "Verdana",
            fontSize: 16,
        });
        const actionText = new PIXI.Text("", actionStyle);
        actionText.y += 4;
        this._actionText = actionText;
        this.addChild(actionText);
    }
    /**
     * Refresh sprite
     * @param {string} mode 
     */
    refresh(mode) {
        const inputMode = mode || Input.getInputMode();
        const data = inputMode === 'keyboard' ? KeyCodeToNameConverter[DefaultKeyboardConfig[this._keyAction]] : ButtonConverter[DefaultGamePadConfig[this._keyAction]];
        let buttonName = data;
        let buttonColor = '#ddcebf';
        if (Array.isArray(data)) {
            buttonName = data[0];
            buttonColor = data[1];
        }
        const actionName = this._textKey ? LocalizeManager.t(this._textKey) : "";
        this._keyText.text = `${buttonName} `;
        this._actionText.text = `${actionName}`;
        this._actionText.x = this._keyText.x + this._keyText.width;
        this._background.width = this._keyText.width + this._actionText.width + (actionName ? 8 : -4);
        this._background.height = 26;
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
        EventManager.off(GameEvent.InputModeChanged, this.onInputModeChanged, this);
        super.destroy();
    }

}