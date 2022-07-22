//=======================================================================
// * Plugin Name  : DSI_Utils.js
// * Last Updated : 7/22/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) An Utils plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * 
 */
class Position {
    /**
     * Object position
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
    }
    /**
     * Overwrite toString
     * @returns {string}
     */
    toString() {
        return `${this.x}-${this.y}`;
    }
}

class SaveableObject {
    /**
     * This array will contains multiple array which has 2 values [propetyName, defaultValue].
     * For example [{name: 'Test', defaultValue: 10}]
     * @returns {number[][]}
     */
    saveProperties() {
        return [];
    }
    /**
     * Get Save Data
     * @returns {Object} 
     */
    getSaveData() {
        const result = {};
        this.saveProperties().forEach(([property, _]) => {
            result[property] = this[property];
        })
        return (result);
    }
    /**
     * Load Save Data
     * @param {Object} savedData 
     */
    loadSaveData(savedData) {
        // Do stuff here.
        this.saveProperties().forEach(([property, defaultValue]) => {
            const value = savedData[property];
            this[property] = value != undefined ? value : defaultValue;
        })
    }
}
//========================================================================
// CREATE SAVEABLE OBJECTS
//========================================================================

var DSI_FarmingSystem_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    DSI_FarmingSystem_Game_System_initialize.call(this);
    this.recreateSaveableObjects();
}

Game_System.prototype.recreateSaveableObjects = function() {
    // To be aliased by other plugins
}

//========================================================================
// END OF PLUGIN
//========================================================================