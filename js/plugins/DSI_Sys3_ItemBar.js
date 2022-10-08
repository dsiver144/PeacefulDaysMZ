
class ItemBarManager extends SaveableObject {
    /**
     * This class handle item bar controller
     */
    constructor() {
        super();
        ItemBarManager.inst = this;
    }
    /**wD
     * Set item bar sprite
     * @param {ItemBarSprite} sprite 
     */
    setSprite(sprite) {
        this._sprite = sprite;
    }
}
/** @type {ItemBarManager} */
ItemBarManager.inst = null;

class ItemBarSprite extends Sprite {
    /**
     * This class handle hot bar interaction
     */
    constructor() {
        super();
        this.createUI();
        this.createAllSlots();
        this.setPosition();
        EventManager.on(MyBag.inst.onContainerItemChangedEventName(), this.refresh, this);
    }
    /**
     * Create UI
     */
    createUI() {
        this.backgroundSprite = new Sprite(ImageManager.loadMenu("ItemBarBG", "itemBar"));
        this.backgroundSprite.x = -8;
        this.backgroundSprite.y = -1;

        this.iconSprite = new Sprite_Clickable();
        this.iconSprite.bitmap = ImageManager.loadMenu("BagIcon", "itemBar");
        this.iconSprite.onClick = () => {
            SceneManager.push(Scene_MainMenu);
            SceneManager.prepareNextScene(0);
        }
        this.iconSprite.x = -52;
        this.iconSprite.y = -20;
        // this.iconSprite.followMouse(true);

        this.addChild(this.backgroundSprite);
        this.addChild(this.iconSprite);
    }
    /**
     * Create All Slots
     */
    createAllSlots() {
        const currentRowIndex = MyBag.inst.currentRowIndex;
        const maxRowItems = ContainerConfig.maxSlotPerRow;
        const startIndex = currentRowIndex * maxRowItems;

        const startX = 5;
        const startY = 5;
        const spacing = 4;
        const slotSize = new Vector2(40, 40);
        /** @type {Sprite_ItemBarSlot[]} */
        this._slots = [];
        MyBag.inst.currentRowItems().forEach((item, i) => {
            const slot = new Sprite_ItemBarSlot(startIndex + i, MyBag.inst, i);
            this.addChild(slot);
            slot.onMouseEnter = () => {
                this.onItemSlotHover(slot.slotIndex);
            }
            slot.onMouseExit = () => {
                this.onItemSlotHover(-1);
            }
            slot.x = startX + (i % maxRowItems) * (slotSize.x + spacing);
            slot.y = startY + Math.floor(i / maxRowItems) * (slotSize.y + spacing);
            slot.onClick = () => {
                this.onItemSlotClick(slot.slotIndex);
            }
            this._slots.push(slot);
        });
        this.width = maxRowItems * (slotSize.x + spacing) - spacing;
        this.height = 48;
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
     * Update hover text
     */
    updateHoverText() {
        const {x, y} = TouchInput;
        if (x <= this.x || x >= this.x + this.width ||
            y <= this.y || y >= this.y + this.height) {
            MouseCursor.clearHoverText();
        }
    }
    /**
     * Clear All Slots
     */
    clearAllSlots() {
        this._slots.forEach(slot => this.removeChild(slot));
    }
    /**
     * On Item Slot Click
     * @param {number} index 
     */
    onItemSlotClick(index) {
        SoundManager.playCursor();
        MyBag.inst.select(index);
    }
    /**
     * Refresh Bag
     */
    refresh(slotIndex) {
        // console.log("Refresh Bag At " + slotIndex, this);
    }
    /**
     * @inheritdoc
     */
    destroy() {
        EventManager.off(MyBag.inst.onContainerItemChangedEventName(), this.refresh);
        super.destroy();
    }
    /**
     * Set position
     */
    setPosition() {
        this.x = 64;
        this.y = (Graphics.height - 64);
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateInput();
        this.updateMouseWheel();
        this.updateHoverText();
    }
    /**
     * Update input
     */
    updateInput() {
        for (var i = 1; i <= 12; i++) {
            if (Input.isTriggered(NumKeys["N" + i])) {
                this.quickSelect(i);
            }
        }
        if (Input.isRepeated(FieldKeyAction.SwitchItemLeft)) {
            this.cycleItem(-1);
        }
        if (Input.isRepeated(FieldKeyAction.SwitchItemRight)) {
            this.cycleItem(1);
        }
        if (Input.isTriggered(FieldKeyAction.SwitchItemRowUp)) {
            this.cycleRow(-1);
        }
        if (Input.isTriggered(FieldKeyAction.SwitchItemRowDown)) {
            this.cycleRow(1);
        }
    }
    /**
     * Update Mouse Wheel
     */
    updateMouseWheel() {
        const threshold = 20;
        const holdingAlt = Input.checkKeyState(18);
        if (TouchInput.wheelY >= threshold) {
            !holdingAlt ? this.cycleItem(1) : this.cycleRow(1);
        }
        if (TouchInput.wheelY <= -threshold) {
            !holdingAlt ? this.cycleItem(-1) : this.cycleRow(-1);
        }
    }
    /**
     * Quick select
     * @param {number} numIndex 
     */
    quickSelect(numIndex) {
        const currentRowIndex = MyBag.inst.currentRowIndex;
        const maxRowItems = ContainerConfig.maxSlotPerRow;
        const startIndex = currentRowIndex * maxRowItems;
        this.onItemSlotClick(startIndex + numIndex - 1);
    }
    /**
     * Cycle Item Left Or Right
     * @param {number} direction 
     */
    cycleItem(direction = 1) {
        MyBag.inst.cycleItem(direction, (slotIndex) => {
            if (slotIndex >= 0) {
                SoundManager.playCursor();
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
        if (this.hasTween()) return;
        MyBag.inst.cycleRow(direction, (slotIndex) => {
            if (slotIndex >= 0) {
                SoundManager.playCursor();
                const currentRowIndex = MyBag.inst.currentRowIndex;
                const maxRowItems = ContainerConfig.maxSlotPerRow;
                const startIndex = currentRowIndex * maxRowItems;
                this._slots.forEach((slot, i) => {
                    slot.slotIndex = startIndex + i;
                    slot.refresh();
                });
                this.startTween({offsetY: 5}, 5).ease(Easing.easeInOutBack);
                Input.rumble(100);
            } else {
                SoundManager.playBuzzer();
            }
        });
    }
}

class Sprite_ItemBarSlot extends Sprite_ItemSlot {
    static slotNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    /**
     * Sprite_ItemBarSlot
     * @param {number} slotIndex 
     * @param {ItemContainer} itemContainer 
     */
    constructor(slotIndex, itemContainer, index) {
        super(slotIndex, itemContainer);
        this.slotNumberSprite = new Sprite(new Bitmap(40, 40));
        this.slotNumberSprite.bitmap.fontSize = 12;
        this.slotNumberSprite.bitmap.textColor = '#ffd747';
        this.slotNumberSprite.bitmap.drawText(Sprite_ItemBarSlot.slotNames[index], 3, 3, 40, 12);
        this.addChild(this.slotNumberSprite);
    }
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys2_MyBag_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function () {
    DSI_Sys2_MyBag_Spriteset_Map_createUpperLayer.call(this);
    this._itemBarController = new ItemBarSprite();
    this.addChild(this._itemBarController);
    ItemBarManager.inst.setSprite(this._itemBarController);
}

var DSI_Sys3_ItemBar_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys3_ItemBar_Game_System_createSaveableObjects.call(this);
    this._itemBarManager = new ItemBarManager();
}