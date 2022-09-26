/** @enum */
var BagEvent = {
    REFRESH_BAG: "refreshBag"
}

class ItemBarManager extends SaveableObject {
    /**
     * This class handle item bar controller
     */
    constructor() {
        super();
        ItemBarManager.inst = this;
        this._slotIndex = 0;
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
        this.bitmap = new Bitmap(32 * 12, 32);
        this.bitmap.fillAll("#ff0000");
        this.opacity = 100;
        this.setPosition();
        EventManager.on(BagEvent.REFRESH_BAG, this.refresh, this);
    }
    /**
     * Refresh Bag
     */
    refresh() {
        console.log("Refresh Bag", this);
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
        this.x = (Graphics.width - this.width) / 2;
        this.y = (Graphics.height - 48);
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
    }
}

class Sprite_GameItem extends Sprite {
    /**
     * This class handle display for each GameItem
     */
    constructor() {
        this._itemSprite = new Sprite();
        this._backgroundSprite = new Sprite();
        this._quantitySprite = new Sprite();
        this._quantitySprite.bitmap = new Bitmap(32, 32);
    }

    isSelected() {

    }
    
    select() {
        // this._backgroundSprite = 
    }
    /**
     * Refresh
     * @param {GameItem} gameItem 
     */
    refresh(gameItem) {
        this._item = gameItem;
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