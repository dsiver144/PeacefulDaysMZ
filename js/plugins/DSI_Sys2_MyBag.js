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

class MyBag extends ItemContainer {
    /**
     * This class handle Inventory system for Peaceful Days
     */
    constructor(unlockedRows = ContainerConfig.unlockedRows) {
        super(unlockedRows);
        MyBag.inst = this;
        this._selectingRowIndex = 0;
    }
    /**
     * Get selecting row index
     */
    get selectingRowIndex() {
        return this._selectingRowIndex;
    }

    currentRowItems() {
        const items = [];
        const startIndex = this._selectingRowIndex * ContainerConfig.maxSlotPerRow;
        const endIndex = startIndex + ContainerConfig.maxSlotPerRow - 1;
        for (var i = startIndex; i <= endIndex; i++) {
            items.push(this._items.get(i));
        }
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        const data = super.saveProperties();
        return data.concat([
            ['_selectingRowIndex', 0],
        ]);
    }
}
/** @type {MyBag} */
MyBag.inst = null;

class ItemBarController extends Sprite {
    /**
     * This class handle hot bar interaction
     */
    constructor() {
        super();
        this.bitmap = new Bitmap(32 * 12, 32);
        this.bitmap.fillAll("#ff0000");
        this.opacity = 100;
        this.setPosition();
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

var DSI_Sys2_InventorySystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys2_InventorySystem_Game_System_createSaveableObjects.call(this);
    this._myBag = new MyBag();
}

var DSI_Sys2_MyBag_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function () {
    DSI_Sys2_MyBag_Spriteset_Map_createUpperLayer.call(this);
    this._itemBarController = new ItemBarController();
    this.addChild(this._itemBarController);
}