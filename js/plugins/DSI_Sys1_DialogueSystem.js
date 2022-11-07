
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
            this._messageBox.hideDialogue(true);
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
            this._choiceBox.hideChoices(true);
            ScreenOverlay.addChild(this._choiceBox);
        }
        return this._choiceBox;
    }
    /**
     * Display Content
     * @param {string} content 
     */
    display(content) {
        this.messageBox.display(this.processContent(content));
    }
    /**
     * Process content
     * @param {string} content 
     */
    processContent(content) {
        // Replace text key with correct localize data
        content = content.replace(/{(.+?)}/gi, (_, textKey) => {
            return LocalizeManager.t(textKey);
        });
        // Replace variable tag <v: varId> with value.
        content = content.replace(/<v:\s*(\d+)>/gi, (_, varID) => {
            return $gameVariables.value(+varID);
        });
        return content;
    }
    /**
     * Show Choices
     * @param {string[]} choices 
     * @param {(n: number) => void} choiceCallback 
     */
    showChoices(choices, choiceCallback) {
        console.log("Show choices", { choices });
        // Process choice content before show
        for (var i = 0; i < choices; i++) {
            choices[i] = this.processContent(choices[i]);
        }
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
        this.messageBox.hideDialogue();
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
        return this.isMessageBoxBusy() || this.isChoiceBoxBusy();
    }
    /**
     * Check if message box is busy
     * @returns {boolean}
     */
    isMessageBoxBusy() {
        return this.messageBox.isBusy();
    }
    /**
     * Check if choice box is busy
     * @returns {boolean}
     */
    isChoiceBoxBusy() {
        return this.hasChoice();
    }
}

Game_Interpreter.prototype.command101 = function (params) {
    if ($gameMessage.isBusy()) {
        return false;
    }
    // $gameMessage.setFaceImage(params[0], params[1]);
    // $gameMessage.setBackground(params[2]);
    // $gameMessage.setPositionType(params[3]);
    // $gameMessage.setSpeakerName(params[4]);
    let text = '';
    while (this.nextEventCode() === 401) {
        // Text data
        this._index++;
        text += this.currentCommand().parameters[0] + "\n";
    }
    DialogueManager.inst.display(text);
    // switch (this.nextEventCode()) {
    //     case 102: // Show Choices
    //         this._index++;
    //         this.setupChoices(this.currentCommand().parameters);
    //         break;
    //     case 103: // Input Number
    //         this._index++;
    //         this.setupNumInput(this.currentCommand().parameters);
    //         break;
    //     case 104: // Select Item
    //         this._index++;
    //         this.setupItemChoice(this.currentCommand().parameters);
    //         break;
    // }
    this.setWaitMode("message");
    return true;
};


// Show Choices
Game_Interpreter.prototype.command102 = function (params) {
    if ($gameMessage.isBusy()) {
        return false;
    }
    this.setupChoices(params);
    this.setWaitMode("message");
    return true;
}

Game_Interpreter.prototype.setupChoices = function (params) {
    const choices = params[0].clone();
    DialogueManager.inst.showChoices(choices, (n) => {
        this._branch[this._indent] = n;
    });
}

Game_Message.prototype.isBusy = function () {
    return DialogueManager.inst.isBusy();
}

DialogueManager.init();