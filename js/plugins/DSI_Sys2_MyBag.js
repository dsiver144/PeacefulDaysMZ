//=======================================================================
// * Plugin Name  : DSI_Sys2_MyBag.js
// * Last Updated : 7/25/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Player Bag
 * @help 
 * Empty Help
 * 
 */

/** @enum */
var BagEvent = {
    REFRESH_BAG: "refreshBag"
}

class MyBag extends ItemContainer {
    /**
     * This class handle Inventory system for Peaceful Days
     */
    constructor(unlockedRows = ContainerConfig.unlockedRows) {
        super(unlockedRows);
        MyBag.inst = this;
        this.select(0);
    }
    /**
     * @inheritdoc
     */
    onContainerItemChangedEventName() {
        return BagEvent.REFRESH_BAG;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        const data = super.saveProperties();
        return data.concat([
            // ['_symbol', 0],
        ]);
    }
}
/** @type {MyBag} */
MyBag.inst = null;

class Sprite_ItemSlot extends Sprite_Clickable {
    /**
     * Sprite Bag Item Slot
     * @param {number} slotIndex
     * @param {ItemContainer} itemContainer
     */
    constructor(slotIndex, itemContainer) {
        super();
        this.slotIndex = slotIndex;
        this.itemContainer = itemContainer;
        this.bitmap = ImageManager.loadMenu("ItemBG", "bag");
        const iconSlot = new Sprite_Icon(0);
        iconSlot.anchor.x = 0.5;
        iconSlot.anchor.y = 0.5;
        iconSlot.x = 40 / 2;
        iconSlot.y = 40 / 2;
        iconSlot.bitmap.smooth = false;
        this.addChild(iconSlot);
        this.itemIcon = iconSlot;
        this.numberSprite = new Sprite(new Bitmap(40, 40));
        this.numberSprite.bitmap.fontSize = 12;
        this.addChild(this.numberSprite);
        EventManager.on(itemContainer.onContainerItemChangedEventName(), this.refresh, this);
        this.refresh();
    }
    /**
     * @inheritdoc
     */
    destroy() {
        EventManager.off(this.itemContainer.onContainerItemChangedEventName(), this.refresh);
        super.destroy();
    }
    /**
     * Refresh current item slot
     */
    refresh() {
        const curItem = this.itemContainer.item(this.slotIndex);
        if (curItem && curItem.id) {
            this.itemIcon.setIcon(ItemDB.get(curItem.id).iconIndex);
            this.numberSprite.bitmap.clear();
            this.numberSprite.bitmap.drawText(curItem.quantity, 0, 40 - 12 - 2, 40 - 2, 12, 'right');
        } else {
            this.itemIcon.setIcon(0);
            this.numberSprite.bitmap.clear();
        }
        this.bitmap = this.itemContainer._selectedSlotId == this.slotIndex ? ImageManager.loadMenu("ItemBG_selected", "bag") : ImageManager.loadMenu("ItemBG", "bag");
    }
    /**
     * Update
     */
    update() {
        super.update();
    }
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys2_InventorySystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys2_InventorySystem_Game_System_createSaveableObjects.call(this);
    this._myBag = new MyBag();
}
