class Scene_Chest extends Scene_MenuBase {
    /**
     * Prepare Chest
     * @param {ItemContainer} topContainer 
     */
    prepare(topContainer, bottomContainer) {
        /** @type {ItemContainer} */
        this._topContainer = topContainer;
        /** @type {ItemContainer} */
        this._bottomContainer = bottomContainer;
    }
    /**
     * Create
     */
    create() {
        super.create();
        this.createItemDescription();
        this.createChestWindow();
    }
    /**
     * Create Chest Window
     */
    createChestWindow() {
        this._selectionMode = true;
        this._topContainer.select(0);
        this._bottomContainer.select(null);

        this._topWindow = new Window_ChestContainer(this._topContainer);
        this._topWindow.x = (Graphics.width - this._topWindow.width) / 2;
        this._topWindow.y = 40;

        this.addChild(this._topWindow);
        this._bottomWindow = new Window_ChestContainer(this._bottomContainer);
        this._bottomWindow.x = (Graphics.width - this._bottomWindow.width) / 2;
        this._bottomWindow.y = Graphics.height - this._bottomWindow.height - 80;
        this.addChild(this._bottomWindow);

        this._topWindow.onSlotClickSuccess = (lastSlotIndex, slotIndex) => {
            this._bottomContainer.select(null);

            const itemData = this._topWindow.itemLocalizeDataAt(slotIndex);
            this.setDescription(itemData.description);

            if (lastSlotIndex == slotIndex) {
                const item = this._topContainer.selectingItem();
                if (item) {
                    const holdingAlt = Input.checkKeyState(18);
                    const number = holdingAlt || !this._selectionMode ? 1 : item.quantity;
                    if (this._bottomContainer.addItem(item.id, number)) {
                        this._topContainer.updateItemWithSlotID(slotIndex, -number);
                    }
                }
            }
        }
        this._bottomWindow.onSlotClickSuccess = (lastSlotIndex, slotIndex) => {
            this._topContainer.select(null);

            const itemData = this._bottomWindow.itemLocalizeDataAt(slotIndex);
            this.setDescription(itemData.description);

            if (lastSlotIndex == slotIndex) {
                const item = this._bottomContainer.selectingItem();
                if (item) {
                    const holdingAlt = Input.checkKeyState(18);
                    const number = holdingAlt || !this._selectionMode ? 1 : item.quantity;
                    if (this._topContainer.addItem(item.id, number)) {
                        this._bottomContainer.updateItemWithSlotID(slotIndex, -number);
                    }
                }
            }
        }

        this._topWindow.onSlotHoverSuccess = (itemData) => {
            this.setDescription(itemData.description);
        }

        this._bottomWindow.onSlotHoverSuccess = (itemData) => {
            this.setDescription(itemData.description);
        }

        this._topWindow.onRefreshHelp = (itemData) => {
            this.setDescription(itemData.description);
        }

        this._bottomWindow.onRefreshHelp = (itemData) => {
            this.setDescription(itemData.description);
        }

        this._topWindow.refreshHelp(0);
    }
    /**
     * Create item description text
     */
    createItemDescription() {
        const descriptionStyle = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            fontSize: 20,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: Graphics.width - 30
        });
        const description = new PIXI.Text("", descriptionStyle);
        description.anchor.x = 0.5;
        description.x = Graphics.width / 2;
        description.y = Graphics.height - 80;
        this.descriptionText = description;
        this.addChild(description);
    }
    /**
     * Set description
     * @param {string} text 
     */
    setDescription(text) {
        this.descriptionText.text = text;
    }
    /**
     * @inheritdoc
     */
    start() {
        super.start();
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.updateInput();
        this.updateHoverText();
    }
    /**
     * Update input
     */
    updateInput() {
        if (Input.isTriggered(ContainerMenuKeyAction.Switch)) {
            AudioController.playOk();
            if (this._topContainer._selectedSlotId != null) {
                this._topContainer.select(null);
                this._bottomContainer.select(0);
                this._bottomWindow.refreshHelp(0);
            } else {
                this._bottomContainer.select(null);
                this._topContainer.select(0);
                this._topWindow.refreshHelp(0);
            }
        }
        if (Input.isTriggered(ContainerMenuKeyAction.ToggleMode)) {
            AudioController.playOk();
            this._selectionMode = !this._selectionMode;
        }
    }
    /**
     * Update hover text
     */
    updateHoverText() {
        const { x, y } = TouchInput;
        let failCount = 0;
        if (x <= this._topWindow.x || x >= this._topWindow.x + this._topWindow.width - this._topWindow.padding * 2 ||
            y <= this._topWindow.y || y >= this._topWindow.y + this._topWindow.height) {
            failCount += 1;
        }
        if (x <= this._bottomWindow.x || x >= this._bottomWindow.x + this._bottomWindow.width - this._bottomWindow.padding * 2 ||
            y <= this._bottomWindow.y || y >= this._bottomWindow.y + this._bottomWindow.height) {
            failCount += 1;
        }
        failCount >= 2 && MouseCursor.clearHoverText();
    }
}


class Window_ChestContainer extends Window_ItemContainer {
    /**
     * Window Chest Container
     * @param {ItemContainer} itemContainer 
     */
    constructor(itemContainer, rect = new Rectangle(0, 0, 560, 210)) {
        super(itemContainer, rect);
        this.opacity = 0;
        this.backOpacity = 0;
        const menuBGPlane = new PIXI.NineSlicePlane(PIXI.Texture.from("img/menus/MenuBG.png"), 8, 8, 8, 8);
        menuBGPlane.width = this.innerWidth;
        menuBGPlane.height = this.innerHeight;
        this.addChildToBack(menuBGPlane);
    }
    /**
     * Create core elements
     */
    create() {
        this.createAllSlots();
    }
    /**
     * @inheritdoc
     */
    onItemSlotHover(slotId) {
        // if (this.itemContainer._selectedSlotId == null) return;
        super.onItemSlotHover(slotId);
    }
    /**
     * @inheritdoc
     */
    updateHoverText() {
        // Disable hover text check
    }
    /**
     * Can Input ?
     * @returns {boolean}
     */
    canInput() {
        return this.itemContainer._selectedSlotId != null;
    }
}