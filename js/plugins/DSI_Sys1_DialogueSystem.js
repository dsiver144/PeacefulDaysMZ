
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
     * Get Choice Box Sprite
     */
    get choiceBox() {
        if (!this._choiceBox) {
            this._choiceBox = new Sprite_ChoiceBox();
            ScreenOverlay.addChild(this._choiceBox);
        }
        return this._choiceBox;
    }
    /**
     * Display Content
     * @param {string} content 
     */
    display(content) {
        this.messageBox.display(content);
    }
    /**
     * Show Choices
     * @param {string[]} choices 
     * @param {(n: number) => void} choiceCallback 
     */
    showChoices(choices, choiceCallback) {
        this._choices = choices;
        this._choiceCallback = choiceCallback;
        this.choiceBox.showChoices(choices);
    }
    /**
     * Select choice
     * @param {number} index 
     */
    selectChoice(index) {
        if (!this.hasChoice()) return;
        this._choiceCallback(index);
        this.clearChoices();
    }
    /**
     * Clear Choices
     */
    clearChoices() {
        this._choices = null;
        this._choiceCallback = null;
    }
    /**
     * Has Choice?
     * @returns {boolean}
     */
    hasChoice() {
        return !!this._choices;
    }
    /**
     * Check if dialogue system is busy
     * @returns {boolean}
     */
    isBusy() {
        return this.messageBox.isBusy() || this.hasChoice();
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
    DialogueManager.inst.showChoices(choices, (n) => {
        this._branch[this._indent] = n;
    });
}

Game_Message.prototype.isBusy = function() {
    return DialogueManager.inst.isBusy();
}

DialogueManager.init();