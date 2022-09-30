class Window_Bag extends Window_Base {
    /**
     * This class handle bag menu display for Peaceful Days
     */
    constructor() {
        super(new Rectangle(0, 0, 560, 360));
        this.createAllSlots();
        this.createHelp();
        this.refreshHelp(MyBag.inst._selectedSlotId);
    }
    /**
     * Create all slots
     */
    createAllSlots() {
        this._itemSlots = [];
        const maxSlots = MyBag.inst.maxPageSlots();
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
        const slot = new Sprite_ItemSlot(index, MyBag.inst);
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
        this.contents.clear();
        const itemData = this.itemLocalizeDataAt(slotIndex);
        this.titleText.text = itemData.name;
        this.hoverText.text = itemData.description;
    }
    /**
     * Get localize item data at slot
     * @param {number} slotIndex 
     * @returns 
     */
    itemLocalizeDataAt(slotIndex) {
        const item = MyBag.inst.item(slotIndex);
        const itemData = item ? LocalizeManager.item(item.id) : null;
        if (itemData) {
            return itemData;
        }
        if (MyBag.inst.isSlotUnlocked(slotIndex)) {
            return {name: LocalizeManager.t("Lbl_Empty"), description: LocalizeManager.t("Lbl_EmptySlotDesc")};
        }
        return {name: LocalizeManager.t("Lbl_Locked"), description: ''};
    }
    /**
     * On Item Slot Click
     * @param {number} slotIndex 
     */
    onItemSlotClick(slotIndex) {
        if (!MyBag.inst.isSlotUnlocked(slotIndex)) {
            SoundManager.playBuzzer();
            return;
        }
        SoundManager.playCursor();
        MyBag.inst.select(slotIndex);
        this.refreshHelp(slotIndex);
    }
    /**
     * On Item Slot Click
     * @param {number} index 
     */
    onItemSlotHover(index) {
        if (index >= 0) {
            const itemData = this.itemLocalizeDataAt(index);
            MouseCursor.setHoverText(itemData.name);
        }
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
    }
    /**
     * Cycle Item Left Or Right
     * @param {number} direction 
     */
    cycleItem(direction = 1) {
        MyBag.inst.cycleItem(direction, (slotIndex) => {
            if (slotIndex >= 0) {
                SoundManager.playCursor();
                this.refreshHelp(slotIndex);
            } else {
                SoundManager.playBuzzer();
            }
        })
    }
    /**
     * Cycle Row Up Or Down
     * @param {number} direction 
     */
    cycleRow(direction = 1) {
        MyBag.inst.cycleRow(direction, (slotIndex) => {
            if (slotIndex >= 0) {
                SoundManager.playCursor();
                this.refreshHelp(slotIndex);
            } else {
                SoundManager.playBuzzer();
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

