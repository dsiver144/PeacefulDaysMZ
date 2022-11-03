//=======================================================================
// * Plugin Name  : DSI_Sys2_Sprite_ChoiceBox.js
// * Last Updated : 10/27/2022
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

class Sprite_ChoiceBox extends Sprite {
    /**
     * This class handle choice box display for Peaceful Days.
     */
    constructor() {
        super();
        this.initMembers();
        this.create();
    }
    /**
     * Init Members
     */
    initMembers() {
        this._choices = [];
        this._cursorIndex = 0;
        this._choiceSprites = [];
    }
    /**
     * Get cursor index
     */
    get cursorIndex() { return this._cursorIndex }
    /**
     * Create display components
     */
    create() {
        this.#createBackground();
    }
    /**
     * Create background
     */
    #createBackground() {

    }
    /**
     * Show Choices
     * @param {string[]} choices 
     */
    showChoices(choices) {
        this.initMembers();
        this._choices = choices;
        this.displayChoices();
    }
    /**
     * Display Choices
     */
    displayChoices() {
        /** @type {Sprite[]} */
        const style = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            fontSize: 23,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
        });
        this._choices.forEach((text, index) => {
            const sprite = new Sprite();
            const choiceText = new PIXI.Text(text, style);
            sprite.addChild(choiceText);
            sprite.width = choiceText.width;
            sprite.height = choiceText.height;
            sprite.y = index * sprite.height;
            this.addChild(sprite);
            this._choiceSprites.push(sprite);
        });
    }
    /**
     * Hide choices
     */
    hideChoices(instant = false) {
        this._choiceSprites.forEach(sprite => {
            this.removeChild(sprite);
        })
        this._choiceSprites.splice(0);
    }
    /**
     * Update control
     */
    updateControl() {
        if (!DialogueManager.inst.hasChoice()) return;
        if (DialogueManager.inst.isMessageBoxBusy()) return;
        if (Input.isTriggered(MenuKeyAction.MoveDown)) {
            this.moveCursor(1);
        }
        if (Input.isTriggered(MenuKeyAction.MoveUp)) {
            this.moveCursor(-1); 
        }
        if (Input.isTriggered(MenuKeyAction.Confirm)) {
            this.confirm();
        }
        for (var i = 0; i < this._choiceSprites.length; i++) {
            const sprite = this._choiceSprites[i];
            if (i == this.cursorIndex) {
                sprite.opacity += 25;
            } else {
                sprite.opacity = 100;
            }
        }
    }
    /**
     * Move cursor
     * @param {number} direction 
     */
    moveCursor(direction) {
        let index = this.cursorIndex + direction;
        const maxIndex = this._choices.length - 1;
        if (index > maxIndex) {
            index = 0;
        }
        if (index < 0) {
            index = maxIndex;
        }
        this.select(index);
    }
    /**
     * Select
     * @param {number} index 
     */
    select(index) {
        this._cursorIndex = index;
        AudioController.playCursor();
        console.log("Select choice: " + index);
    }
    /**
     * Confirm
     */
    confirm() {
        DialogueManager.inst.selectChoice(this.cursorIndex);
        AudioController.playOk();
        console.log("Confirm :" + this.cursorIndex);
        this.hideChoices();
    }
    /**
     * Update
     */
    update() {
        super.update();
        this.updateControl();
    }
}