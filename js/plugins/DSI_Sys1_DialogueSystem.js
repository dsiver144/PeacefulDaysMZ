
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
    /**
     * Get Dialogue Sprite
     * @returns {Sprite_DialogueBox}
     */
    get messageBox() {
        if (!this._messageBox) {
            this._messageBox = new Sprite_DialogueBox();
            ScreenOverlay.addChild(this._messageBox);
        }
        return this._messageBox;
    }
    /**
     * Display Content
     * @param {string} content 
     */
    display(content) {
        this.messageBox.display(content);
    }
    /**
     * Check if dialogue system is busy
     * @returns {boolean}
     */
    isBusy() {
        return this.messageBox.isBusy();
    }
}

// Show Choices
Game_Interpreter.prototype.command102 = function(params) {
    if ($gameMessage.isBusy()) {
        return false;
    }
    this.setupChoices(params);
    this.setWaitMode("message");
    return true;
}

Game_Interpreter.prototype.setupChoices = function(params) {
    const choices = params[0].clone();
    const cancelType = params[1] < choices.length ? params[1] : -2;
    const defaultType = params.length > 2 ? params[2] : 0;
    const positionType = params.length > 3 ? params[3] : 2;
    const background = params.length > 4 ? params[4] : 0;
    $gameMessage.setChoices(choices, defaultType, cancelType);
    $gameMessage.setChoiceBackground(background);
    $gameMessage.setChoicePositionType(positionType);
    $gameMessage.setChoiceCallback(n => {
        this._branch[this._indent] = n;
    });
}

Game_Message.prototype.isBusy = function() {
    return DialogueManager.inst.isBusy();
}

DialogueManager.init();