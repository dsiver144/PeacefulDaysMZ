const KeyMappingGroups = [
    {
        "name": "Lb_MapGroup_Field",
        "types": [FieldKeyAction],
        "groupIndex": 0
    },
    {
        "name": "Lb_MapGroup_Menu",
        "types": [MenuKeyAction],
        "groupIndex": 1,
    },
    {
        "name": "Lb_MapGroup_Container",
        "types": [ContainerMenuKeyAction],
        "groupIndex": 1,
    }
]
const ExcludeKeys = [
    FieldKeyAction.CheckEx,
    FieldKeyAction.UseToolEx,
    FieldKeyAction.None,
]

class Window_KeyMapping extends Window_Command {
    /**
     * This class handle bag menu display for Peaceful Days
     * @param {ItemContainer} container
     */
    constructor(rect = new Rectangle(0, 0, 700, 370)) {
        super(rect);
    }
    /**
     * Show hints
     */
    showHints() {
        const keys = [
            [MenuKeyAction.Cancel, "Lb_Exit"],
        ]
        ScreenOverlay.showButtonHints(...keys);
        this.setMode(Input.getInputMode());
        this.select(1);
    }
    /**
     * Set input mode
     * @param {string} mode 
     */
    setMode(mode) {
        this._inputMode = mode;
        this.refresh();
    }
    /**
     * @inheritdoc
     */
    makeCommandList() {
        if (!this._inputMode) return;
        KeyMappingGroups.forEach((group) => {
            this.addHeader(group.name);
            group.types.forEach(type => {
                Object.entries(type).forEach(([key, textKey]) => {
                    if (ExcludeKeys.includes(textKey)) return;
                    this.addKeybind(textKey, group.groupIndex);
                })
            })
        })
    }
    /**
     * Add header
     * @param {string} textKey 
     */
    addHeader(textKey) {
        this.addCommand('Header_' + textKey, 'header', true, { type: 'header', textKey: textKey });
    }
    /**
     * Add key bind
     * @param {string} textKey 
     * @param {number} groupIndex 
     */
    addKeybind(textKey, groupIndex) {
        this.addCommand('Keybind_' + textKey, 'keybind', true, { type: 'keybind', textKey, groupIndex });
    }
    /**
     * @inheritdoc
     */
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const commandData = this._list[index].ext;
        const commandName = LocalizeManager.t(commandData.textKey);
        // Display attributes
        let fontSize = 18;
        let offset = new Vector2(0, 4);
        let strokeThickness = 5;
        let color = '#fff7d1';
        let prefix = '● ';
        let backgroundRect = false;
        switch (commandData.type) {
            case 'header':
                offset.x = 0;
                strokeThickness = 5;
                color = '#f5b642';
                fontSize = 23;
                prefix = '';
                backgroundRect = true;
                break;
            case 'keybind':
                const keySprite = new Sprite_KeyHint(commandData.textKey, '', false, this._inputMode);
                this.addInnerChild(keySprite);
                keySprite.x = rect.x + rect.width - keySprite.width;
                keySprite.y = rect.y + offset.y;
                break;
        }
        this.resetTextColor();
        if (backgroundRect) {
            this.contents.fillRect(0, rect.y - 1, this.contentsWidth(), rect.height + 2, "#856b4a");
        }
        const commandText = this.getCommandText(index);
        commandText.style.fontSize = fontSize;
        commandText.style.strokeThickness = strokeThickness;
        commandText.style.fill = color;
        commandText.text = prefix + commandName;
        commandText.x = rect.x + offset.x;
        commandText.y = rect.y + offset.y;
    }
    /**
     * Get option text
     * @param {number} index 
     * @returns {PIXI.Text} 
     */
    getCommandText(index) {
        this._commandTexts ||= {};
        if (this._commandTexts[index]) return this._commandTexts[index];
        const style = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            fontSize: 23,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
        });
        const text = new PIXI.Text("", style);
        this._commandTexts[index] = text;
        this.addInnerChild(text);
        return text;
    }
}