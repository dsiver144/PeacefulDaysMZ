//=======================================================================
// * Plugin Name  : DSI_Sys1_ItemDatabase.js
// * Last Updated : 7/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * @param testParam:number
 * @text Test Param
 * @type number
 * @default 144
 * @desc A Test Param
 * 
 */
class ItemDB {
    /**
     * My Item 
     */
    constructor() {
        ItemDB.inst = this;
        /** @type {Object.<string, PD_Item>} */
        this.items = {};
    }
    /**
     * Add Item To Database
     * @param {PD_Item} item 
     */
    addItem(item) {
        if (!item || !item.name) return;
        this.items[item.name] = item;
    }
    /**
     * Get Item By Name
     * @param {string} name 
     * @returns {PD_Item}
     */
    item(name) {
        return this.items[name];
    }
    /**
     * Get Item By ID
     * @param {number} id 
     * @returns {PD_Item}
     */
    itemById(id) {
        return Object.values(this.items).find(item => item.id == id);
    }
}
/** @type {ItemDB} */
ItemDB.inst = null;
ItemDB.getInstance = function() {
    return ItemDB.inst;
}
/**
 * Get Item By Name
 * @param {string} name 
 * @returns {PD_Item}
 */
ItemDB.get = function(name) {
    return ItemDB.inst.item(name);
}
/**
 * Get Item By Id
 * @param {number} id 
 * @returns {PD_Item}
 */
ItemDB.getById = function(id) {
    return ItemDB.inst.itemById(id);
}
/**
 * Get Item By Id
 * @param {number} id 
 * @returns {Object.<string, PD_Item>}
 */
 ItemDB.items = function() {
    return ItemDB.inst.items;
}

class PD_Item {
    constructor({iconIndex, localizeKey, name, note, price, shipPrice, tag, stamina}) {
        /** @type {number} */
        this.iconIndex = Number(iconIndex);
        /** @type {string} */
        this.localizeKey = localizeKey;
        /** @type {string} */
        this.name = name;
        /** @type {string} */
        this.note = note;
        /** @type {number} */
        this.price = Number(price);
        /** @type {number} */
        this.shipPrice = Number(shipPrice);
        /** @type {string[]} */
        this.tags = tag.split(';').map(t => t.trim());
        /** @type {number[]} */
        this.staminaData = stamina.split(";").map(t => Number(t));
    }
}

//========================================================================
// RPG MAKER SECTION
//========================================================================

var DSI_Sys1_ItemDatabase_Scene_Boot_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
	DSI_Sys1_ItemDatabase_Scene_Boot_create.call(this);
    this.loadCustomDatabase();
};

Scene_Boot.prototype.loadCustomDatabase = function() {
    new ItemDB();
    MyUtils.parseCSV("itemTable.csv", (data) => {
        data.forEach(i => {
            if (!i || !i.name) return;
            ItemDB.getInstance().addItem(new PD_Item(i));
        })
        this.customDatabaseLoaded = true;
        this.onItemDatabaseCreated();
    })
}

Scene_Boot.prototype.onItemDatabaseCreated = function() {
    // To be aliased by other function
};

var DSI_Sys1_ItemDatabase_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
	const result = DSI_Sys1_ItemDatabase_Scene_Boot_isReady.call(this);
    return result && !!this.customDatabaseLoaded;
};

//========================================================================
// END OF PLUGIN
//========================================================================