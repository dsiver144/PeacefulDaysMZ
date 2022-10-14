//=======================================================================
// * Plugin Name  : DSI_Sys2_Sprite_DialogueBox.js
// * Last Updated : 10/14/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Sprite Dialogue Box
 * @help 
 * Empty Help
 * 
 */
class Sprite_DialogueBox2 extends Sprite {
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
        this.#createContent();
        this.reset();
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

        this._textOffsetX = 16;
        this._textOffsetY = 16;
        this._maxTextWidth = this.width - this._textOffsetX;
        this._maxTextHeight = this.height - this._textOffsetY;
        this._lineHeight = 48;
    }
    /**
     * Reset
     */
    reset() {
        this._displayDelay = 0;
        this._targetWord = null;
        this._displayCharacters = null;
        this._displayWords = null;
        /** @type {PIXI.Text[]} */
        this._texts = [];
        this._currentDisplayX = this._textOffsetX;
        this._currentDisplayY = this._textOffsetY;
        /** @type {Map<number,MessageTextEffect>} */
        this._specialEffects = new Map();
    }
    /**
     * Create Content Text
     */
    #createText(wordWrap = false) {
        const style = new PIXI.TextStyle({
            fill: "#fed690",
            fontFamily: "Verdana",
            fontSize: 18,
            fontWeight: "bold",
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 4,
        });
        if (wordWrap) {
            style.wordWrap = true;
            style.wordWrapWidth = this._maxTextWidth;
        }
        const text = new PIXI.Text("", style);
        this.addChild(text);
        return text;
    }
    /**
     * Create Content
     */
    #createContent() {
        this._content = this.#createText(true);
        this._content.x = this._textOffsetX;
        this._content.y = this._textOffsetY;
    }
    /**
     * Display Message
     * @param {string} content 
     */
    display(content) {
        this.reset();
        this.calculateSpecialEffect(content);
        // this._content.text = '';
        // this._displayDelay = 0;
    }
    /**
     * Calculate Special Effect
     * @param {string} content
     */
    calculateSpecialEffect(content) {
        content = this.scanForSpecialCodes(content);
        const spliter = ' ';
        this._displayWords = content.split(spliter);
        let newContent = '';
        for (const word of this._displayWords) {
            const lastHeight = this._content.height;
            const lastText = this._content.text;
            this._content.text += word;
            if (this._content.height > lastHeight) {
                this._content.text = lastText;
                const newWord = "\n" + word + " ";
                this._content.text += newWord;
                newContent += newWord;
                this._content.updateTransform();
            } else {
                const newWord = word + " ";
                this._content.text += newWord;
                newContent += newWord;
                this._content.updateTransform();
            }
        }
        this._content.text = '';
        console.log(newContent);
        // this._displayWords = null;
    }
    /**
     * Scan For Sepcial Codes
     * @param {string} content 
     */
    scanForSpecialCodes(content) {
        let newContent = content;
        console.log(content);
        newContent = content.replace(/<(\w+):(\d+)>(.+?)<\/\1>/gi, (match, type, params, text) => {
            const index = content.indexOf(match);
            // let effect = new MessageTextEffect();
            // switch (type) {
            // case 'c':
            //     break;
            // }
            console.log(index, match, type, params, text);
            return text;
        })
        return newContent;
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

        const word = this._displayWords.shift();
        const lastHeight = this._content.height;
        const lastText = this._content.text;
        this._content.text += word;
        if (this._content.height > lastHeight) {
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
        if (this._displayDelay > 0) {
            this._displayDelay -= 1;
            return;
        }
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
    }
}

class MessageTextEffect {
    /**
     * Message Text Special Effect
     * @param {string} name 
     * @param {any[]} params 
     */
    constructor(name, params) {
        this.name = name;
        this.params = params;
    }
}