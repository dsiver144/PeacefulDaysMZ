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
        this.#createSpeakerSprite();
        this.#createBackground();
        this.#createContent();
        this.#createWaitForInputIcon();
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
     * Create speaker sprite
     */
    #createSpeakerSprite() {
        const speakerSprite = new Sprite_DialogueSpeaker();
        this.addChild(speakerSprite);
        this._speakerSprite = speakerSprite;
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
        this._displayCharacterIndex = 0;
        this._displayDelay = 0;
        this._currentDisplayX = this._content.offsetX;
        this._currentDisplayY = this._content.offsetY;
        /** @type {MessageDisplayEntry[]} */
        this._displayEntries = null;
        this._content.clear();
        this._pause = false;
    }
    /**
     * Create Content
     */
    #createContent() {
        const contentSprite = new Sprite();
        const bitmap = new Bitmap(this._maxTextWidth, this._maxTextHeight);
        contentSprite.bitmap = bitmap;
        this.addChild(contentSprite);
        contentSprite.x = this._textOffsetX; 
        contentSprite.y = this._textOffsetY; 
        bitmap.fontSize = 19;
        bitmap.textColor = "#fed690";
        bitmap.defaultTextColor = bitmap.textColor;
        bitmap.fontFace = "Verdana";
        bitmap.fontBold = true;
        bitmap.outlineWidth = 5;
        bitmap.outlineColor = "#6f4949";
        bitmap.offsetX = 4;
        bitmap.offsetY = 4;
        this._content = bitmap;
    }
    /**
     * Create wait for input icon
     */
    #createWaitForInputIcon() {
        const icon = new Sprite_Icon(18);
        this.addChild(icon);
        icon.x = DialogConfig.waitForInputPos[0];
        icon.y = DialogConfig.waitForInputPos[1];
        this._waitForInputIcon = icon;
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
        this.showDialogue();
    }
    /**
     * Calculate Special Effect
     * @param {string} content
     */
    calculateSpecialEffect(content) {
        const displayEntries = this.convertToDisplayEntries(content);
        const spliter = ' ';

        let currentWidth = 0;
        for (let i = 0; i < displayEntries.length; i++) {
            const entry = displayEntries[i];
            const {type, params} = entry;
            if (type === 'page') {
                currentWidth = 0;
                continue;
            }
            if (type !== 'character') continue;
            const word = params[0];
            const part = word;
            currentWidth += this.calcTextWidth(part);
            if (currentWidth >= this._maxTextWidth - this._content.offsetX) {
                for (var j = i; j >= 0; j--) {
                    const entry2 = displayEntries[j];
                    const {type, params} = entry2;
                    if (type === 'character' && params[0] == ' ') {
                        entry2.params[0] = '\n'
                        break;
                    }
                }
                currentWidth = 0;
            }
        }
        this._displayEntries = displayEntries;
    }
    /**
     * Convert text to display entries
     * @param {string} content 
     * @returns {MessageDisplayEntry[]}
     */
    convertToDisplayEntries(content) {
        let result = [];
        for (var i = 0; i < content.length; i++) {
            if (content[i] === '<') {
                let specialCode = content[i];
                for (var j = i + 1; j < content.length; j++) {
                    specialCode += content[j];
                    if (content[j] === '>') {
                        break;
                    }
                }
                if (specialCode.match(/<(.+?)>/i)) {
                    const [type, params] = RegExp.$1.split(':');
                    switch(type) {
                    case 'c':
                        let newParams = params.split(",");
                        result.push({type: 'color', params: newParams});
                        break;
                    case 'page':
                        result.push({type: 'page', params: []});
                        break;
                    // case 'v':
                    //     const varId = Number(params);
                    //     const characters = $gameVariables.value(varId).toString();
                    //     characters.split('').forEach((c) => {
                    //         result.push({type: 'character', params: [c]});
                    //     });
                    //     break;
                    }
                    i = j;
                }
            } else {
                result.push({type: 'character', params: [content[i]]});
            }
        }
        return result;
    }
    /**
     * Check if the message box is busy
     * @returns {boolean}
     */
    isBusy() {
        return this._isShowed;
    }
    /**
     * Check if messagebox is finished display dialoge
     * @returns {boolean}
     */
    isFinishDisplayDialogue() {
        return !this._displayEntries || (this._displayEntries && this._displayEntries.length == 0);
    }
    /**
     * Check if this dialog has waiting for input icon
     * @returns {boolean}
     */
    hasWaitingForInputIcon() {
        return this.isFinishDisplayDialogue() || this._pause;
    }
    /**
     * Update display character 
     */
    updateDisplayCharacter() {
        if (this._pause) return;
        if (!this._displayEntries) return;
        if (this._displayEntries.length == 0) return;
        if (this._displayDelay > 0) {
            this._displayDelay -= 1;
            return;
        }
        const entry = this._displayEntries.shift();
        switch (entry.type) {
            case 'character':
                const character = entry.params[0];
                if (character == '\n') {
                    this._currentDisplayX = 0; //this._content.offsetX;  
                    this._currentDisplayY += this._lineHeight; 
                }
                const dx = this._currentDisplayX;
                const dy = this._currentDisplayY;
                this._content.drawText(character, dx, dy, 20, 20);
                const width = this.calcTextWidth(character);
                this._currentDisplayX += width;
                this._displayDelay = DialogConfig.characterDelayDuration;
                break;
            case 'color':
                const number = +entry.params[0];
                let color = null;
                if (number == 0) {
                    color = this._content.defaultTextColor;
                } else {
                    color = ColorManager.textColor(number);
                }
                this._content.textColor = color;
                break;
            case 'page':
                this._currentDisplayX = this._content.offsetX;
                this._currentDisplayY = this._content.offsetY;
                this.pause();
                break;
            default:
                console.log("===");
                break;
        }
        this._displayCharacterIndex += 1;
    }
    /**
     * Update control
     */
    updateControl() {
        // If there is a dialogue choice box visible, then disable message box input.
        if (DialogueManager.inst.isChoiceBoxBusy()) return;
        if (Input.isTriggeredCheck()) {
            Input.update();
            if (this._pause) {
                this.resume();
            } else {
                if (this.isFinishDisplayDialogue()) {
                    this.hideDialogue();
                }
            }
        }
    }
    /**
     * Update wait for input icon
     */
    updateWaitForInputIcon() {
        this._waitForInputIcon.y = DialogConfig.waitForInputPos[1] + Math.sin(Graphics.frameCount / 5) * 3;
        this._waitForInputIcon.visible = this.hasWaitingForInputIcon();
    }
    /**
     * Pause
     */
    pause() {
        this._pause = true;
    }
    /**
     * Resume
     */
    resume() {
        this._pause = false;
        this._content.clear();
        AudioController.playPage();
    }
    /**
     * Show Dialogue
     */
    showDialogue() {
        this.alpha = 0;
        const targetY = DialogConfig.defaultY;
        this.y = Graphics.height;
        this.startTween({alpha: 1.0, y: targetY}, 10).ease(Easing.easeInOutCubic);
        this._speakerSprite.setSpeaker(DialogueManager.inst.activeSpeaker);
        this._isShowed = true;
    }
    /**
     * Hide Dialogue
     */
    hideDialogue(instant = false) {
        if (instant) {
            this.y = Graphics.height;
            this.alpha = 0.0;
            return;
        }
        AudioController.playPage();
        const targetY = Graphics.height;
        this.startTween({alpha: 0.0, y: targetY}, 10).ease(Easing.easeInOutCubic);
        this._isShowed = false;
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        // this.updateDisplay();
        this.updateDisplayCharacter();
        this.updateControl();
        this.updateWaitForInputIcon();
    }
}

class MessageDisplayEntry {
    /**
     * Message Display Entry
     * @param {string} type 
     * @param {any[]} params 
     */
    constructor(type, params) {
        /** @type {string} */
        this.type = type;
        /** @type {any[]} */
        this.params = params;
    }
}