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
        this._lastSlotIndex = this._bottomContainer._selectedSlotId;
    }
    /**
     * Create
     */
    create() {
        super.create();
        this.createItemDescription();
        this.createChestWindow();
        this.showHints();
    }
    /**
     * Show hints
     */
    showHints() {
        const keys = [
            [MenuKeyAction.Confirm, "Lb_Select"],
            [MenuKeyAction.Cancel, "Lb_Exit"],
            [ContainerMenuKeyAction.Switch, "container_menu_switch"],
            [ContainerMenuKeyAction.ToggleMode, "container_menu_toggle_mode"],
        ]
        ScreenOverlay.showButtonHints(...keys);
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
                    const leftover = this._bottomContainer.addItem(item.id, number);
                    this._topContainer.updateItemWithSlotID(slotIndex, -number + leftover);
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
                    const leftover = this._topContainer.addItem(item.id, number);
                    this._bottomContainer.updateItemWithSlotID(slotIndex, -number + leftover);
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

        this._topWindow.alpha = 0.0;
        this._bottomWindow.alpha = 0.0;
        // this._descriptionText.alpha = 0.0;

        this._bottomWindow.addChild(this._descriptionText);
        this._descriptionText.x = this._bottomWindow.width / 2;
        this._descriptionText.y = 185;

        this._topWindow.startTween({ offsetY: -50, alpha: 1.0 }, 30).ease(Easing.easeOutExpo);
        this._bottomWindow.startTween({ offsetY: 50, alpha: 1.0 }, 30).ease(Easing.easeOutExpo);
    }
    /**
     * Create item description text
     */
    createItemDescription() {
        const descriptionStyle = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            align: "center",
            fontSize: 20,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: Graphics.width - 30
        });
        const description = new PIXI.Text("", descriptionStyle);
        description.anchor.x = 0.5;
        this._descriptionText = description;
    }
    /**
     * Set description
     * @param {string} text 
     */
    setDescription(text) {
        this._descriptionText.text = text;
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
        this.updateControl();
        this.updateHoverText();
    }
    /**
     * Update control
     */
    updateControl() {
        if (this._returningToMap) return;
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
        if (Input.isTriggered(FieldKeyAction.Menu) || Input.isTriggered(FieldKeyAction.Cancel)) {
            if (this.canReturnToMap()) {
                this.returnToMap();
            } else {
                AudioController.playBuzzer();
            }
        }
    }
    /**
     * Check if player can return to map scene
     * @returns {boolean}
     */
    canReturnToMap() {
        return true;
    }
    /**
     * Return to map function
     */
    returnToMap() {
        AudioController.playOk();
        this.popScene();
    }
    /**
     * Pop Scene
     */
    popScene() {
        this._returningToMap = true;
        ScreenOverlay.clearAllHints();
        this._topWindow.startTween({ alpha: 0.0 }, 30).ease(Easing.easeOutExpo);
        this._bottomWindow.startTween({ alpha: 0.0 }, 30).ease(Easing.easeOutExpo);
        setTimeout(() => {
            this._bottomContainer.select(this._lastSlotIndex);
            super.popScene();
        }, 250);
    }
    /**
     * Update hover text
     */
    updateHoverText() {
        const { x, y } = TouchInput;
        let failCount = 0;
        if (x <= this._topWindow.x || x >= this._topWindow.x + this._topWindow.width - this._topWindow.padding * 2 ||
            y <= this._topWindow.y || y >= this._topWindow.y + this._topWindow.height - 20) {
            failCount += 1;
        }
        if (x <= this._bottomWindow.x || x >= this._bottomWindow.x + this._bottomWindow.width - this._bottomWindow.padding * 2 ||
            y <= this._bottomWindow.y || y >= this._bottomWindow.y + this._bottomWindow.height - 20) {
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
    constructor(itemContainer, rect = new Rectangle(0, 0, 560, 205)) {
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
        this.createContainerNameText();
        this.createInteractiveButtons();
    }
    /**
     * Create container name text
     */
    createContainerNameText() {
        const nameStyle = new PIXI.TextStyle({
            fill: "#f5b642",
            fontFamily: "Verdana",
            fontSize: 20,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: Graphics.width - 30
        });
        const containerNameTxt = new PIXI.Text(this.itemContainer.name(), nameStyle);
        containerNameTxt.x = 0
        containerNameTxt.y = -containerNameTxt.height - 3;
        this.addChild(containerNameTxt);
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