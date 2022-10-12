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
        this.select(0);
        this.setName('Lb_Backpack');
    }
    /**
     * @inheritdoc
     */
    onItemChanged(slotId) {
        super.onItemChanged(slotId);
        GameInteractionManager.inst.reset();
    }
    /**
     * @inheritdoc
     */
    onItemContainerFull() {
        AudioController.playBuzzer();
        Notify.inst.showInventoryFull();
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

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys2_InventorySystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys2_InventorySystem_Game_System_createSaveableObjects.call(this);
    this._myBag = new MyBag();
}
