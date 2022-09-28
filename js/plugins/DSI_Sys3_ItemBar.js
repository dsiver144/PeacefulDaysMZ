
class ItemBarManager extends SaveableObject {
    /**
     * This class handle item bar controller
     */
    constructor() {
        super();
        ItemBarManager.inst = this;
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
        EventManager.on(BagEvent.REFRESH_BAG, this.refresh, this);
    }
    /**
     * Create UI
     */
    createUI() {
        this.backgroundSprite = new Sprite(ImageManager.loadMenu("ItemBarBG", "itemBar"));
        this.backgroundSprite.x = -8;
        this.backgroundSprite.y = -1;

        this.iconSprite = new Sprite(ImageManager.loadMenu("BagIcon", "itemBar"));
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
        MyBag.inst.currentRowItems().forEach((item, i) => {
            const slot = new Sprite_ItemBarSlot(startIndex + i, MyBag.inst, i);
            this.addChild(slot);
            slot.x = startX + (i % maxRowItems) * (slotSize.x + spacing);
            slot.y = startY + Math.floor(i / maxRowItems) * (slotSize.y + spacing);
            slot.onClick = () => {
                this.onItemSlotClick(slot.slotIndex);
            }
        });
        this.width = maxRowItems * (slotSize.x + spacing) - spacing;
    }
    /**
     * On Item Slot Click
     * @param {number} index 
     */
    onItemSlotClick(index) {
        MyBag.inst.select(index);
    }
    /**
     * Refresh Bag
     */
    refresh(slotIndex) {
        console.log("Refresh Bag At " + slotIndex, this);
    }
    /**
     * @inheritdoc
     */
    destroy() {
        EventManager.off(BagEvent.REFRESH_BAG, this.refresh);
        super.destroy();
    }
    /**
     * Set position
     */
    setPosition() {
        this.x = 64;//(Graphics.width - this.width) / 2;
        this.y = (Graphics.height - 64);
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
    }
}

class Sprite_ItemBarSlot extends Sprite_ItemSlot {
    static slotNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
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
}

var DSI_Sys3_ItemBar_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys3_ItemBar_Game_System_createSaveableObjects.call(this);
    this._itemBarManager = new ItemBarManager();
}