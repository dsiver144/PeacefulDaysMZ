class Window_Bag extends Window_Base {
    /**
     * This class handle bag menu display for Peaceful Days
     */
    constructor() {
        super(new Rectangle(0, 0, 560, 360));
        this.createAllSlots();
        this.createHelp();
        this.refreshHelp(0);
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
        const slot = new Sprite_BagItemSlot(index);
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
     * @param {number} index 
     */
    refreshHelp(index) {
        this.contents.clear();
        const itemData = this.itemLocalizeDataAt(index);
        this.titleText.text = itemData.name;
        this.hoverText.text = itemData.description;
    }
    /**
     * Get localize item data at slot
     * @param {number} index 
     * @returns 
     */
    itemLocalizeDataAt(index) {
        const item = MyBag.inst.item(index);
        const itemData = item ? LocalizeManager.item(item.id) : null;
        return itemData ? itemData : {name: "", description: ""};
    }
    /**
     * On Item Slot Click
     * @param {number} index 
     */
    onItemSlotClick(index) {
        MyBag.inst.select(index);
        this.refreshHelp(index);
    }
    /**
     * On Item Slot Click
     * @param {number} index 
     */
    onItemSlotHover(index) {
        if (index >= 0) {
            const itemData = this.itemLocalizeDataAt(index);
            SceneManager._scene.setHoverText(itemData.name);
        }
    }
    /**
     * Update hover text
     */
    updateHoverText() {
        const {x, y} = TouchInput;
        if (x <= this.x || x >= this.x + this.width - this.padding * 2 ||
            y <= this.y || y >= this.y + 180) {
            SceneManager._scene.setHoverText("");
        }
    }
    /**
     * @inheritdoc
     */
    update() {
        super.update();
        this.updateHoverText();
    }
}

class Sprite_BagItemSlot extends Sprite_Clickable {
    /**
     * Sprite Bag Item Slot
     */
    constructor(slotIndex) {
        super();
        this.slotIndex = slotIndex;
        this.bitmap = ImageManager.loadMenu("ItemBG", "bag");
        const iconSlot = new Sprite_Icon(0);
        iconSlot.anchor.x = 0.5;
        iconSlot.anchor.y = 0.5;
        iconSlot.bitmap.smooth = false;
        this.addChild(iconSlot);
        this.bitmap.addLoadListener(() => {
            iconSlot.x = this.width / 2;
            iconSlot.y = this.height / 2;
        });
        this.itemIcon = iconSlot;
        this.numberSprite = new Sprite(new Bitmap(40, 40));
        this.numberSprite.bitmap.fontSize = 12;
        this.addChild(this.numberSprite);
        this.refresh();
    }
    /**
     * Refresh current item slot
     */
    refresh() {
        if (this.currentItem == MyBag.inst.item(this.slotIndex)) return;
        const curItem = MyBag.inst.item(this.slotIndex);
        this.currentItem = curItem;
        if (curItem.id) {
            this.itemIcon.setIcon(ItemDB.get(curItem.id).iconIndex);
            this.numberSprite.bitmap.drawText(curItem.quantity, 0, 40 - 12 - 2, 40 - 2, 12, 'right');
        } else {
            this.itemIcon.setIcon(0);
            this.numberSprite.bitmap.clear();
        }
    }
    /**
     * Update select
     */
    updateSelect() {
        this.refresh();
        this.bitmap = MyBag.inst._selectedSlotId == this.slotIndex ? ImageManager.loadMenu("ItemBG_selected", "bag") : ImageManager.loadMenu("ItemBG", "bag");
    }
    /**
     * Update
     */
    update() {
        super.update();
        this.updateSelect();
    }
}