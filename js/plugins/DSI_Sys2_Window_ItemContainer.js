class Window_ItemContainer extends Window_Base {
    /**
     * This class handle bag menu display for Peaceful Days
     * @param {ItemContainer} container
     */
    constructor(container, rect = new Rectangle(0, 0, 560, 360)) {
        super(rect);
        /** @type {ItemContainer} */
        this.itemContainer = container;
        this.create();
    }
    /**
     * Create core elements
     */
    create() {
        this.createAllSlots();
        this.createHelp();
        this.refreshHelp(this.itemContainer._selectedSlotId);
    }
    /**
     * Create all slots
     */
    createAllSlots() {
        this._itemSlots = [];
        const maxSlots = this.itemContainer.maxPageSlots();
        const maxRowItems = ContainerConfig.maxSlotPerRow;
        const startX = 5;
        const startY = 5;
        const spacing = 4;
        const slotSize = new Vector2(40, 40);
        for (var i = 0; i < maxSlots; i++) {
            const slot = this.createItemSlot(i);
            slot.x = startX + (i % maxRowItems) * (slotSize.x + spacing);
            slot.y = startY + Math.floor(i / maxRowItems) * (slotSize.y + spacing);
        }
    }
    /**
     * Create Item Slot
     * @param {number} index 
     */
    createItemSlot(index) {
        const slot = new Sprite_ItemSlot(index, this.itemContainer);
        // slot.bitmap.smooth = false;
        slot.onClick = () => {
            this.onItemSlotClick(index);
        }
        slot.onMouseEnter = () => {
            this.onItemSlotHover(index);
        }
        slot.onMouseExit = () => {
            this.onItemSlotHover(-1);
        }
        this.addChildToBack(slot);
        this._itemSlots.push(slot);
        return slot;
    }
    /**
     * Create help texts
     */
    createHelp() {
        const helpPos = new Vector2(0, 165);

        const titleStyle = new PIXI.TextStyle({
            fill: "#ffcd94",
            fontFamily: "Verdana",
            fontSize: 26,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5
        });
        const title = new PIXI.Text("", titleStyle);
        this.addInnerChild(title);
        title.x = helpPos.x;
        title.y = helpPos.y;
        this.titleText = title;

        const descriptionStyle = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            fontSize: 18,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: 510
        });
        const description = new PIXI.Text("", descriptionStyle);
        this.addInnerChild(description);
        description.x = helpPos.x;
        description.y = helpPos.y + 40;

        this.hoverText = description;
    }
    /**
     * Refresh Help
     * @param {number} slotIndex 
     */
    refreshHelp(slotIndex) {
        const itemData = this.itemLocalizeDataAt(slotIndex);
        if (this.titleText) {
            this.titleText.text = itemData.name;
        }
        if (this.hoverText) {
            this.hoverText.text = itemData.description;
        }
        this.onRefreshHelp(itemData);
    }
    /**
     * On Refresh Help
     * @param {{name: string, description: string}} itemData 
     */
    onRefreshHelp(itemData) {

    }
    /**
     * Get localize item data at slot
     * @param {number} slotIndex 
     * @returns 
     */
    itemLocalizeDataAt(slotIndex) {
        const item = this.itemContainer.item(slotIndex);
        const itemData = item ? LocalizeManager.item(item.id) : null;
        if (itemData) {
            return itemData;
        }
        if (this.itemContainer.isSlotUnlocked(slotIndex)) {
            return {name: LocalizeManager.t("Lbl_Empty"), description: LocalizeManager.t("Lbl_EmptySlotDesc")};
        }
        return {name: LocalizeManager.t("Lbl_Locked"), description: ''};
    }
    /**
     * On Item Slot Click
     * @param {number} slotIndex 
     */
    onItemSlotClick(slotIndex) {
        if (!this.itemContainer.isSlotUnlocked(slotIndex)) {
            AudioController.playBuzzer();
            return;
        }
        AudioController.playCursor();
        this.onSlotClickSuccess(this.itemContainer._selectedSlotId, slotIndex);
        this.itemContainer.select(slotIndex);
        this.refreshHelp(slotIndex);
    }
    /**
     * Will be called after successfully select a slot
     */
    onSlotClickSuccess(lastSlotIndex, slotIndex) {

    }
    /**
     * On Item Slot Click
     * @param {number} index 
     */
    onItemSlotHover(index) {
        if (index >= 0) {
            const itemData = this.itemLocalizeDataAt(index);
            MouseCursor.setHoverText(itemData.name);
            this.onSlotHoverSuccess(itemData);
        }
    }
    /**
     * On Slot Hover Success
     * @param {{name: string, description: string}} itemData 
     */
    onSlotHoverSuccess(itemData) {

    }
    /**
     * Update hover text
     */
    updateHoverText() {
        const {x, y} = TouchInput;
        if (x <= this.x || x >= this.x + this.width - this.padding * 2 ||
            y <= this.y || y >= this.y + 180) {
            MouseCursor.clearHoverText();
        }
    }
    /**
     * Update input
     */
    updateInput() {
        if (!this.visible) return;
        if (!this.canInput()) return;
        if (Input.isRepeated(MenuKeyAction.MoveDown)) {
            this.cycleRow(1);
        }
        if (Input.isRepeated(MenuKeyAction.MoveUp)) {
            this.cycleRow(-1);
        }
        if (Input.isRepeated(MenuKeyAction.MoveLeft)) {
            this.cycleItem(-1);
        }
        if (Input.isRepeated(MenuKeyAction.MoveRight)) {
            this.cycleItem(1);
        }
        if (Input.isTriggered(ContainerMenuKeyAction.Sort)) {
            AudioController.playSelect();
            this.itemContainer.sort();
        }
        if (Input.isTriggered(MenuKeyAction.Confirm)) {
            this.onItemSlotClick(this.itemContainer._selectedSlotId);
        }
    }
    /**
     * Can Input
     * @returns {boolean}
     */
    canInput() {
        return true;
    }
    /**
     * Cycle Item Left Or Right
     * @param {number} direction 
     */
    cycleItem(direction = 1) {
        this.itemContainer.cycleItem(direction, (slotIndex) => {
            if (slotIndex >= 0) {
                AudioController.playCursor();
                this.refreshHelp(slotIndex);
            } else {
                AudioController.playBuzzer();
            }
        })
    }
    /**
     * Cycle Row Up Or Down
     * @param {number} direction 
     */
    cycleRow(direction = 1) {
        this.itemContainer.cycleRow(direction, (slotIndex) => {
            if (slotIndex >= 0) {
                AudioController.playCursor();
                this.refreshHelp(slotIndex);
            } else {
                AudioController.playBuzzer();
            }
        })
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.updateHoverText();
        this.updateInput();
    }
    /**
     * @inheritdoc
     */
    deactivate() {
        super.deactivate();
        MouseCursor.clearHoverText();
    }
}

