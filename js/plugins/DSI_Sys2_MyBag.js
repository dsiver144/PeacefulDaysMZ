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
        return items;
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



//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys2_InventorySystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys2_InventorySystem_Game_System_createSaveableObjects.call(this);
    this._myBag = new MyBag();
}
