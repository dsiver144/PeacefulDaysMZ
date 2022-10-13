
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

class Sprite_DialogueBox extends Sprite {
    /**
     * This class handle dialogue box display for Peaceful Days.
     */
    constructor() {
        super();
        this.create();
    }
    /**
     * Create display components
     */
    create() {
        this.#createBackground();
        this.#createText();
    }
    /**
     * Create background
     */
    #createBackground() {
        const imagePath = 'img/menus/Dialogue/DialogueBG.png';
        const [left, top, right, bottom] = [8, 8, 8, 8];
        const bg = new PIXI.NineSlicePlane(PIXI.Texture.from(imagePath), left, top, right, bottom);
        this.addChild(bg);
        this._background = bg;
        this.setSize();
    }
    /**
     * Set Size
     * @param {number} width 
     * @param {number} height 
     */
    setSize(width, height) {
        this._background.width = width || DialogConfig.defaultSize[0];
        this._background.height = height || DialogConfig.defaultSize[1];
        this.width = this._background.width;
        this.height = this._background.height;
        this.x = (Graphics.width - this.width) / 2;
        this.y = DialogConfig.defaultY;
    }
    /**
     * Create Content Text
     */
    #createText() {
        const style = new PIXI.TextStyle({
            fill: "#fed690",
            fontFamily: "Verdana",
            fontSize: 18,
            fontWeight: "bold",
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 4,
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: this._background.width - 18 * 2
        });
        const text = new PIXI.Text("", style);
        text.x = 18;
        text.y = 18;
        this._content = text;
        this.addChild(text);
    }
    /**
     * Display Message
     * @param {string} content 
     */
    display(content) {
        this.reset();
        this._displayWords = content.split(' ');
        this._content.text = '';
        this._displayDelay = 0;
    }
    /**
     * Reset
     */
    reset() {
        this._displayDelay = 0;
        this._targetWord = null;
        this._displayCharacters = null;
        this._displayWords = null;
    }
    /**
     * Check if the message box is busy
     * @returns {boolean}
     */
    isBusy() {
        return !!this._displayCharacters && !!this._displayWords;
    }
    /**
     * Update display
     */
    updateDisplay() {
        if (this._targetWord) return;
        if (!this._displayWords) return;
        if (this._displayWords.length == 0) return;
        if (this._displayDelay > 0) {
            this._displayDelay -= 1;
            return;
        }
        const word = this._displayWords.shift();
        const lastHeight = this._content.height;
        const lastText = this._content.text;
        this._content.text += word;
        if (this._content.height > lastHeight) {
            console.log("Overflow at " + word);
            this._content.text = lastText;
            this._content.text += "\n" + word;
            this._targetWord = "\n" + word + " ";
            this._displayCharacters = this._targetWord.split("");
        } else {
            this._targetWord = word + " ";
            this._displayCharacters = this._targetWord.split("");
        }
        this._content.text = lastText;
        if (this._displayWords.length == 0) {
            this._displayWords = null;
        }
    }
    /**
     * Update display character 
     */
    updateDisplayCharacter() {
        if (!this._displayCharacters) return;
        if (this._displayCharacters.length == 0) return;
        const word = this._displayCharacters.shift();
        this._content.text += word;
        if (this._displayCharacters.length == 0) {
            this._targetWord = null;
        }
        this._displayDelay = DialogConfig.characterDelayDuration;
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateDisplay();
        this.updateDisplayCharacter();
        console.log(this.isBusy());
    }
}