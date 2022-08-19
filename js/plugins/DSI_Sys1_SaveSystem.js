//=======================================================================
// * Plugin Name  : DSI_Sys1_SaveSystem.js
// * Last Updated : 7/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Save System
 * @help 
 * Empty Help
 */
class SaveableObject {
    /**
     * This array will contains multiple array which has 2 values [propetyName, defaultValue].
     * For example [{name: 'Test', defaultValue: 10}]
     * @returns {any[]}
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
            let data = this[property];
            if (property.match(/@Arr\((.+?)\):(.+)/i)) {
                property = RegExp.$2;
                const array = this[property] || [];
                const newData = [];
                for (const entry of array) {
                    newData.push(entry.getSaveData());
                }
                data = newData;
            }
            // if (property.match(/@Map\((.+?)\):(.+?)/i)) {
            //     const klass = RegExp.$1;
            //     data = this[RegExp.$2];
            //     let newData = {};
            //     for (const [key, value] of data) {
            //         newData[key] = value.getSaveData();
            //     }
            //     data['special'] = `Map(${klass})`;
            //     data = newData;
            // }
            if (this[property] instanceof SaveableObject) {
                data = this[property].getSaveData();
                data['klass'] = this[property].constructor.name;
            }
            result[property] = data;
        })
        return (result);
    }
    /**
     * Load Save Data
     * @param {Object} savedData 
     */
    loadSaveData(savedData) {
        this.saveProperties().forEach(([property, defaultValue]) => {
            let value = savedData[property];
            if (property.match(/@Arr\((.+?)\):(.+)/i)) {
                const klass = RegExp.$1;
                property = RegExp.$2;
                const array = savedData[property];
                const newData = [];
                for (const entry of array) {
                    const obj = eval(`new ${klass}()`);
                    obj.loadSaveData(entry)
                    newData.push(obj);
                }
                value = newData;
            }
            if (value && value.klass) {
                value = eval(`new ${value.klass}()`);
                value.loadSaveData(savedData[property]);
            }
            this[property] = value != undefined ? value : defaultValue;
        })
    }
}

//========================================================================
// CREATE SAVEABLE OBJECTS
//========================================================================

var DSI_Sys1_SaveSystem_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
	DSI_Sys1_SaveSystem_Game_System_initialize.call(this);
    this.recreateSaveableObjects();
}

Game_System.prototype.createSaveableObjects = function() {
    // To be aliased by other plugins
}

Game_System.prototype.recreateSaveableObjects = function() {
    this.createSaveableObjects();
    const savedData = this.savedData;
    for (let key in savedData) {
        const object = this[key];
        const data = savedData[key];
        if (object instanceof SaveableObject) {
            object.loadSaveData(data);
        }
    }
}

var DSI_Sys1_SaveSystem_Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
Game_System.prototype.onBeforeSave = function () {
	DSI_Sys1_SaveSystem_Game_System_onBeforeSave.call(this);
    const savedData = {};
    for (let key in this) {
        const object = this[key];
        if (object instanceof SaveableObject) {
            savedData[key] = object.getSaveData();
            delete this[key];
        }
    }
    this.savedData = savedData;
};

var DSI_Sys1_SaveSystem_Scene_Save_onSaveSuccess = Scene_Save.prototype.onSaveSuccess;
Scene_Save.prototype.onSaveSuccess = function () {
    $gameSystem.recreateSaveableObjects();
	DSI_Sys1_SaveSystem_Scene_Save_onSaveSuccess.call(this);
};

var DSI_Sys1_SaveSystem_Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
Scene_Load.prototype.onLoadSuccess = function () {
    $gameSystem.recreateSaveableObjects();
	DSI_Sys1_SaveSystem_Scene_Load_onLoadSuccess.call(this);
};