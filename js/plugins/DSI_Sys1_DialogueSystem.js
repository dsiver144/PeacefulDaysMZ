
//=======================================================================
// * Plugin Name  : DSI_Sys1_DialogueSystem.js
// * Last Updated : 10/13/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Dialogue System For Peaceful Days
 * @help 
 * Empty Help
 * 
 */
const DialogConfig = {
    defaultSize: [770, 145],
    characterDelayDuration: 1,
    defaultY: 350
}

class DialogueManager {
    /** @type {DialogueManager} */
    static inst = null;
    static init() {
        this.inst = new DialogueManager();
    }
    /**
     * This class handle dialogue system for Peaceful Days.
     */
    constructor() {

    }

    get messageBox() {
        if (!this._messageBox) {
            this._messageBox = new Sprite_DialogueBox();
            ScreenOverlay.addChild(this._messageBox);
        }
        return this._messageBox;

    }

    display(content) {
        this.messageBox.display(content);
    }
}

DialogueManager.init();