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
    constructor(rect = new Rectangle(0, 0, 640, 370)) {
        super(rect);
    }
    /**
     * Make Command List
     */
    makeCommandList() {
        this.makeOptions();
        this.setHandler('ok', this.onOptionOK.bind(this));
    }
    /**
     * Make Options
     */
    makeOptions() {
        this.addHeader('Lb_Option_Graphics');
        this.addOption('Lb_Option_Fullscreen', {
            type: "selection",
            object: Graphics,
            property: "isFullscreen",
            displayKeys: ['Lb_No', 'Lb_Yes'],
            method: this.onFullScreenControl
        });
        this.addHeader('Lb_Option_Audio');
        this.addOption('Lb_Option_BGMVolume', {
            type: "slider",
            object: ConfigManager,
            currentProperty: 'bgmVolume',
            maxProperty: 100,
            scrollable: true,
            method: this.onBGMVolumeControl
        });
        this.addOption('Lb_Option_SEVolume', {
            type: "slider",
            object: ConfigManager,
            currentProperty: 'seVolume',
            maxProperty: 100,
            scrollable: true,
            method: this.onSEVolumeControl
        });
        this.addHeader('Lb_Option_Gameplay');
        this.addOption('Lb_Option_AutoDash', {
            type: "selection",
            object: ConfigManager,
            property: "alwaysDashEx",
            displayKeys: ['Lb_No', 'Lb_Yes'],
            method: this.onFullScreenControl
        });
        this.addOption('Lb_Option_ClockPosition', {
            type: "selection",
            object: ConfigManager,
            property: "clockPosition",
            displayKeys: ['Lb_Left', 'Lb_Right'],
            method: this.onFullScreenControl
        });
        this.addOption('Lb_Option_ClockMode', {
            type: "selection",
            object: ConfigManager,
            property: "clockMode",
            displayKeys: ['Lb_Option_ClockMode_12', 'Lb_Option_ClockMode_24'],
            method: this.onFullScreenControl
        });
    }
    /**
     * On Option OK
     */
    onOptionOK() {
        const { method, type, object, property, displayKeys } = this.currentOptionData();
        method && method.call(this, OptionControl.OK);
        switch (type) {
            case 'selection':
                let value = object[property] + 1;
                if (value > displayKeys.length - 1) value = 0;
                object[property] = value;
                const selectionTexts = this.getSelectionTexts(this.index());
                selectionTexts.forEach(text => text.alpha = 0.5);
                selectionTexts[value].alpha = 1.0;
                break;
        }
        this.activate();
    }
    /**
     * @inheritdoc
     */
    cursorLeft() {
        const { method, type, object, property, displayKeys } = this.currentOptionData();
        method && method.call(this, OptionControl.Left);
        switch (type) {
            case 'selection':
                let value = object[property] - 1;
                if (value < 0) value = displayKeys.length - 1;
                object[property] = value;
                const selectionTexts = this.getSelectionTexts(this.index());
                selectionTexts.forEach(text => text.alpha = 0.5);
                selectionTexts[value].alpha = 1.0;
                break;
        }
    }
    /**
     * @inheritdoc
     */
    cursorRight() {
        const { method, type, object, property, displayKeys } = this.currentOptionData();
        method && method.call(this, OptionControl.Right);
        switch (type) {
            case 'selection':
                let value = object[property] + 1;
                if (value > displayKeys.length - 1) value = 0;
                object[property] = value;
                const selectionTexts = this.getSelectionTexts(this.index());
                selectionTexts.forEach(text => text.alpha = 0.5);
                selectionTexts[value].alpha = 1.0;
                break;
        }
    }
    /**
     * @inheritdoc
     */
    smoothScrollDown(n) {
        const scrollable = this.currentOptionData().scrollable;
        if (!scrollable) return super.smoothScrollDown(n);
        this.cursorLeft();
    }
    /**
     * @inheritdoc
     */
    smoothScrollUp(n) {
        const scrollable = this.currentOptionData().scrollable;
        if (!scrollable) return super.smoothScrollUp(n);
        this.cursorRight();
    }
    /**
     * On Full Screen Control
     * @param {OptionControl} type 
     */
    onFullScreenControl(type) {
        this.select(this.index());
    }
    /**
     * On BGM Volume Control
     * @param {OptionControl} type 
     */
    onBGMVolumeControl(type) {
        const value = 10;
        if (type === OptionControl.Left) {
            if (ConfigManager.bgmVolume > 0) {
                ConfigManager.bgmVolume -= value;
                ConfigManager.bgsVolume -= value;
                AudioController.playCursor();
            }
        }
        if (type === OptionControl.Right) {
            if (ConfigManager.bgmVolume < 100) {
                ConfigManager.bgmVolume += value;
                ConfigManager.bgsVolume += value;
                AudioController.playCursor();
            }
        }
    }
    /**
     * On SE Volume Control
     * @param {OptionControl} type 
     */
    onSEVolumeControl(type) {
        const value = 10;
        if (type === OptionControl.Left) {
            if (ConfigManager.seVolume > 0) {
                ConfigManager.seVolume -= value;
                AudioController.playCursor();
            }
        }
        if (type === OptionControl.Right) {
            if (ConfigManager.seVolume < 100) {
                ConfigManager.seVolume += value;
                AudioController.playCursor();
            }
        }
    }
    /**
     * Add Header
     * @param {string} textKey  
     */
    addHeader(textKey) {
        this.addCommand(textKey, 'header', true, { type: 'header' });
    }
    /**
     * Add option
     * @param {string} textKey 
     * @param {any} data
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
                const gauge = this.getGauge(index, {
                    ...optionData,
                    gaugeBG: "GaugeBG",
                    gaugeFill: "GaugeFill",
                });
                gauge.x = rect.x + 350;
                gauge.y = rect.y + 4;
                break;
            case 'selection':
                const selectionTexts = this.getSelectionTexts(index, optionData);
                const spacing = 12;
                let nextX = rect.width;
                for (var i = selectionTexts.length - 1; i >= 0; i--) {
                    const text = selectionTexts[i];
                    text.x = nextX - text.width;
                    text.y = rect.y + 4;
                    nextX = text.x - spacing;
                    text.alpha = 0.5;
                }
                const value = optionData.object[optionData.property];
                selectionTexts[value].alpha = 1.0;
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
            fontSize: 23,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
        });
        const text = new PIXI.Text("", style);
        this._optionTexts[index] = text;
        this.addInnerChild(text);
        return text;
    }
    /**
     * Get Gauge
     * @param {number} index 
     * @param {GagueTrackOptions} trackOptions 
     * @returns {Sprite_MyGauge}
     */
    getGauge(index, trackOptions) {
        this._optionGauges ||= {};
        if (this._optionGauges[index]) return this._optionGauges[index];
        const gauge = new Sprite_MyGauge(trackOptions);
        this._optionGauges[index] = gauge;
        this.addInnerChild(gauge);
        return gauge;
    }
    /**
     * Get Selection Texts
     * @param {number} index 
     * @param {any} optionData 
     * @returns {PIXI.Text[]} 
     */
    getSelectionTexts(index, optionData) {
        this._selectionTexts ||= {};
        if (this._selectionTexts[index]) return this._selectionTexts[index];
        const { displayKeys } = optionData;
        const allTexts = [];
        displayKeys.forEach((textKey) => {
            const style = new PIXI.TextStyle({
                fill: "#f5b642",
                fontFamily: "Verdana",
                fontSize: 18,
                lineJoin: "round",
                stroke: "#6f4949",
                strokeThickness: 5,
            });
            const text = new PIXI.Text(LocalizeManager.t(textKey), style);
            this.addInnerChild(text);
            allTexts.push(text);
        })
        this._selectionTexts[index] = allTexts;
        return allTexts;
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
    /**
     * @inheritdoc
     */
    deactivate() {
        super.deactivate();
        ConfigManager.save();
    }
    /**
     * @inheritdoc
     */
    cursorDown(wrap) {
        wrap = true;
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((index + maxCols) % maxItems);
        }
        const { type } = this.currentOptionData();
        if (type === 'header') {
            this.cursorDown();
        }
    };
    /**
     * @inheritdoc
     */
    cursorUp(wrap) {
        wrap = true;
        const index = Math.max(0, this.index());
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index >= maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((index - maxCols + maxItems) % maxItems);
        }
        console.log(this.index());
        const { type } = this.currentOptionData();
        if (type === 'header') {
            this.cursorUp();
        }
    };
}