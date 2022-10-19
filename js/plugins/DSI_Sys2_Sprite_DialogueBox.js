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
        this._lineHeight = 30;
    }
    /**
     * Reset
     */
    reset() {
        this._content.text = '';
        this._displayCharacterIndex = 0;
        this._displayDelay = 0;
        this._targetWord = null;
        this._displayCharacters = null;
        this._displayWords = null;
        /** @type {PIXI.Text[]} */
        this._texts = [];
        this._currentDisplayX = this._textOffsetX;
        this._currentDisplayY = this._textOffsetY;
        /** @type {MessageTextEffect[]} */
        this._specialEffects = [];
    }
    /**
     * Create Content Text
     * @param {boolean} wordWrap
     * @returns {PIXI.Text}
     */
    #createText() {
        const contentSprite = new Sprite();
        const bitmap = new Bitmap(this._maxTextWidth, this._maxTextHeight);
        contentSprite.bitmap = bitmap;
        this.addChild(contentSprite);
        contentSprite.x = this._textOffsetX;
        contentSprite.y = this._textOffsetY;
        return text;
    }
    /**
     * Create Content
     */
    #createContent() {
        const contentSprite = new Sprite();
        const bitmap = new Bitmap(this._maxTextWidth, this._maxTextHeight);
        contentSprite.bitmap = bitmap;
        this.addChild(contentSprite);
        contentSprite.x = 0; //this._textOffsetX;
        contentSprite.y = 0; //this._textOffsetY;
        bitmap.fontSize = 20;
        bitmap.textColor = "#fed690";
        bitmap.fontFace = "Verdana";
        bitmap.fontBold = true;
        bitmap.outlineWidth = 5;
        bitmap.outlineColor = "#6f4949";
        this._content = bitmap;
    }
    /**
     * Calculate Text Width
     * @param {string} str 
     * @returns {number}
     */
    calcTextWidth(str) {
        return this._content.measureTextWidth(str);
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
        let currentHeight = 20;
        let currentWidth = 0;
        for (const word of this._displayWords) {
            const part = word + spliter;
            currentWidth += this.calcTextWidth(part);
            if (currentWidth >= this._maxTextWidth) {
                console.log("BREAK AT ", word);
                currentWidth = 0;
                newContent += "\n" + part;
            } else {
                newContent += part;
            }
        }
        console.log(newContent);
        this._displayCharacters = newContent.split("");
    }
    /**
     * Scan For Sepcial Codes
     * @param {string} content 
     */
    scanForSpecialCodes(content) {
        let newContent = content;
        // console.log(content);
        // let counter = -1;
        /** @type {MessageTextEffect[]} */
        // const specialData = [];
        // newContent = content.replace(/<(\w+):(\d+)>(.+?)<\/\1>/gi, (match, type, params, text) => {
        //     const index = content.indexOf(match);
        //     const specialWidth = this.calcTextWidth(text);
        //     const totalSpaces = Math.floor(specialWidth / this._spaceWidth);
        //     specialData.push(new MessageTextEffect(type, params, text, totalSpaces));
        //     return '';
        // });
        // counter = 0;
        // for (var i = 0; i < newContent.length; i++) {
        //     if (newContent[i] == '\e') {
        //         const lastSpaces = specialData[counter - 1] ? specialData[counter - 1].spaces : 0;
        //         specialData[counter].index = i + lastSpaces;
        //         counter += 1;
        //     }
        // }
        // counter = 0;
        // newContent = newContent.replace(/\e/gi, () => {
        //     counter += 1;
        //     const spaces = "".padEnd(specialData[counter - 1].spaces, " ");
        //     return spaces;
        // });
        // console.log(specialData);
        // this._specialEffects = specialData;
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
     * Update display character 
     */
    updateDisplayCharacter() {
        if (!this._displayCharacters) return;
        if (this._displayCharacters.length == 0) return;
        if (this._displayDelay > 0) {
            this._displayDelay -= 1;
            return;
        }
        const character = this._displayCharacters.shift();
        // const effect = this._specialEffects.find(effect => effect.index == this._displayCharacterIndex);
        // if (effect) {
        //     const specialText = this.#createText(false);
        //     specialText.text = effect.text;
        //     specialText.x = this._currentDisplayX;
        //     specialText.y = this._currentDisplayY;
        // }
        // // console.log(word, this._displayCharacterIndex);
        // const lastHeight = this._content.height;
        // this._content.text += character;
        // // if (this._content.height > lastHeight) {
        // //     this._currentDisplayX = this._textOffsetX;
        // //     this._currentDisplayY += this._lineHeight;
        // // }
        // // console.log(this._content.text);
        // console.log(this._content.text);
        if (character == '\n') {
            this._currentDisplayX = this._textOffsetX;  
            this._currentDisplayY += this._lineHeight; 
        }
        const dx = this._currentDisplayX;
        const dy = this._currentDisplayY;
        this._content.drawText(character, dx, dy, 20, 20);
        const width = this.calcTextWidth(character);
        this._currentDisplayX += width;

        this._displayDelay = DialogConfig.characterDelayDuration;
        this._displayCharacterIndex += 1;
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        // this.updateDisplay();
        this.updateDisplayCharacter();
    }
}

class MessageTextEffect {
    /**
     * Message Text Special Effect
     * @param {string} name 
     * @param {any[]} params 
     */
    constructor(name, params, text, spaces) {
        this.name = name;
        this.params = params;
        this.text = text;
        this.index = -1;
        this.spaces = spaces;
    }
}