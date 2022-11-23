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
    }
    /**
     * Get cursor index
     */
    get cursorIndex() { return this._cursorIndex }
    /**
     * Create display components
     */
    create() {
        this.#createChoiceSprites();
    }
    /**
     * Create background
     */
    #createChoiceSprites() {
        /** @type {Sprite_Clickable[]} */
        this._choiceSprites = [];
        const maxChoices = 6;
        /** @type {Sprite[]} */
        const style = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            fontSize: 18,//23,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
        });
        // Create choice sprites
        for (let index = 0; index < maxChoices; index++) {
            const sprite = new Sprite_Clickable();
            const choiceText = new PIXI.Text('Test', style);
            const keyHint = new Sprite_KeyHint(MenuKeyAction.Confirm);
            keyHint.visible = false;
            sprite.addChild(choiceText);
            sprite.addChild(keyHint);
            sprite.height = choiceText.height;
            sprite.choiceText = choiceText;
            sprite.keyHint = keyHint;
            sprite.onClick = () => {
                if (this.cursorIndex != index) {
                    this.select(index);
                } else {
                    this.confirm();
                }
            }
            this._choiceSprites.push(sprite);
        }
        // Create choice backgrounds
        this._choiceSprites.forEach((sprite, index) => {
            const [img, left, top, right, bottom] = this.choiceBGConfig();
            const bg = new PIXI.NineSlicePlane(PIXI.Texture.from(img), left, top, right, bottom);
            sprite.addChildAt(bg, 0);
            bg.height = 35;
            bg.x = -left;
            bg.y = -2;
            this.addChild(sprite);
            sprite.visible = false;
            sprite.background = bg;
        });
    }
    /**
     * Show Choices
     * @param {string[]} choices 
     */
    showChoices(choices) {
        this.initMembers();
        this._choices = choices;
        // If dialogue box is currently displaying then wait for it to finish to display choices
        if (DialogueManager.inst.messageBox.isFinishDisplayDialogue()) {
            this.displayChoices();
        } else {
            this._waitForDialogueToFinish = true;
        }
    }
    /**
     * Display Choices
     */
    displayChoices() {
        // Setup display params
        const spacing = 12;
        const totalHeight = this._choices.length * (this._choiceSprites[0].height + spacing) - spacing;
        const yStart = DialogConfig.defaultY - totalHeight - spacing;
        const widthOffset = 75;
        let maxWidth = 300;
        // Calculate max width
        for (var index = 0; index < this._choices.length; index++) {
            const sprite = this._choiceSprites[index];
            sprite.choiceText.text = this._choices[index];
            maxWidth = Math.max(maxWidth, sprite.choiceText.width + 80);
        }
        // Set correct display position on screen.
        for (var index = 0; index < this._choices.length; index++) {
            const sprite = this._choiceSprites[index];
            sprite.visible = true;
            sprite.width = maxWidth;
            sprite.background.width = maxWidth;

            sprite.x = Graphics.width - sprite.background.width - widthOffset;
            sprite.y = yStart + index * (sprite.height + spacing);
            
            sprite.keyHint.x = sprite.width - sprite.keyHint.width - 40;
            sprite.keyHint.y = 2;

            sprite.opacity = 0;
            const orginalX = sprite.x;
            sprite.x += 100;
            sprite.startTween({ opacity: 255, x: orginalX }, 15).delay(index * 5).ease(Easing.easeOutExpo);
        }
    }
    /**
     * Update display choices
     */
    updateDisplayChoices() {
        if (!this._waitForDialogueToFinish) return;
        if (!DialogueManager.inst.messageBox.isFinishDisplayDialogue()) return;
        this.displayChoices();
        this._waitForDialogueToFinish = false;
    }
    /**
     * Notify Background Config
     * @returns any[]
     */
    choiceBGConfig() {
        return ['img/menus/Dialogue/ChoiceBG.png', 20, 0, 24, 0];
    }
    /**
     * Hide choices
     */
    hideChoices(instant = false) {
        this._choiceSprites.forEach(sprite => {
            sprite.visible = false;
        });
    }
    /**
     * Update control
     */
    updateControl() {
        if (!DialogueManager.inst.hasChoice()) return;
        if (!DialogueManager.inst.messageBox.isFinishDisplayDialogue()) return;
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
                sprite.keyHint.visible = true;
            } else {
                sprite.opacity = 140;
                sprite.keyHint.visible = false;
            }
        }
    }
    /**
     * Move cursor
     * @param {number} direction 
     */
    moveCursor(direction) {
        let index = this._cursorIndex + direction;
        const maxIndex = this._choices.length - 1;
        if (index > maxIndex) {
            index = 0;
        }
        if (index < 0) {
            index = maxIndex;
        }
        this.select(index);
        Input.update();
    }
    /**
     * Select
     * @param {number} index 
     */
    select(index) {
        this._cursorIndex = index;
        AudioController.playCursor();
    }
    /**
     * Confirm
     */
    confirm() {
        DialogueManager.inst.selectChoice(this.cursorIndex);
        AudioController.playOk();
        console.log("Confirm :" + this.cursorIndex);
        this.hideChoices();
        Input.update();
    }
    /**
     * Update
     */
    update() {
        super.update();
        this.updateDisplayChoices();
        this.updateControl();
    }
}