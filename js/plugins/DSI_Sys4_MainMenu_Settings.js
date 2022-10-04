/** @enum */
const OptionControl = {
    "OK": 'ok',
    "Left": 'left',
    "Right": 'right',
}

class Window_Settings extends Window_Command {
    /**
     * This class handle bag menu display for Peaceful Days
     * @param {ItemContainer} container
     */
    constructor(rect = new Rectangle(0, 0, 640, 360)) {
        super(rect);
    }
    /**
     * Make Command List
     */
    makeCommandList() {
        // for (var i = 0; i < 10; i++) {
        //     this.addCommand('Command #' + i, 'item', true);
        // }
        this.addHeader('Lb_Option_Audio', 2);
        this.addOption('Lb_Option_BGMVolume', { type: "slider", iconIndex: 2, min: 0, max: 100, step: 1, fastStep: 10, method: this.onBGMVolumeControl });
        
        this.setHandler('ok', this.onOptionOK.bind(this));
    }
    /**
     * On Option OK
     */
    onOptionOK() {
        this.currentOptionData().method?.call(this, OptionControl.OK);
        this.activate();
    }
    /**
     * @inheritdoc
     */
    cursorLeft() {
        this.currentOptionData().method?.call(this, OptionControl.Left);
    }
    /**
     * @inheritdoc
     */
    cursorRight() {
        this.currentOptionData().method?.call(this, OptionControl.Right);
    }
    /**
     * 
     * @param {OptionControl} type 
     */
    onBGMVolumeControl(type) {
        console.log(type);
    }
    /**
     * Add Header
     * @param {string} textKey 
     * @param {string} textKey 
     */
    addHeader(textKey, iconIndex) {
        this.addCommand(textKey, 'header', true, { type: 'header', iconIndex: iconIndex });
    }
    /**
     * 
     * @param {*} textKey 
     * @param {*} type 
     * @param {*} method 
     */
    addOption(textKey, data) {
        this.addCommand(textKey, 'ok', true, data);
    }
    /**
     * Get current option data
     */
    currentOptionData() {
        return this.currentExt();
    }
    /**
     * @inheritdoc
     */
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const optionName = LocalizeManager.t(this.commandName(index));
        const optionData = this._list[index].ext;
        // Display attributes
        let fontSize = 18;
        let offset = new Vector2(0, 4);
        let strokeThickness = 5;
        let color = '#fff7d1';
        let prefix = '● ';
        let backgroundRect = false;
        switch (optionData.type) {
            case 'header':
                offset.x = 0;
                strokeThickness = 5;
                color = '#f5b642';
                fontSize = 23;
                prefix = '';
                backgroundRect = true;
                break;
            case 'slider':
                break;
        }
        this.resetTextColor();
        if (backgroundRect) {
            this.contents.fillRect(0, rect.y - 1, this.contentsWidth(), rect.height + 2, "#856b4a");
        }
        const optionText = this.getOptionText(index);
        optionText.style.fontSize = fontSize;
        optionText.style.strokeThickness = strokeThickness;
        optionText.style.fill = color;
        optionText.text = prefix + optionName;
        optionText.x = rect.x + offset.x;
        optionText.y = rect.y + offset.y;
    }
    /**
     * Get option text
     * @param {number} index 
     * @returns {PIXI.Text} 
     */
    getOptionText(index) {
        this._optionTexts ||= {};
        if (this._optionTexts[index]) return this._optionTexts[index];
        const style = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            align: "center",
            fontSize: 23,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: Graphics.width - 30
        });
        const text = new PIXI.Text("", style);
        this._optionTexts[index] = text;
        this.addInnerChild(text);
        return text;
    }
    /**
     * @inheritdoc
     */
    maxCols() {
        return 1;
    }
    /**
     * @inheritdoc
     */
    playOkSound() {

    }
    /**
     * @inheritdoc
     */
    playBuzzerSound() {

    }
}