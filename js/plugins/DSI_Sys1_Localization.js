//=======================================================================
// * Plugin Name  : DSI_Sys1_Localization.js
// * Last Updated : 8/10/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) A custom plugin by dsiver144
 * @help 
 * Empty Help
 * 
 */

const LocalizeConfig = {
    path: "Localization",
    systemFiles: ["System.json", "Controller.json"],
    itemFile: "Item.json",
    npcPath: "NPC",
    NPCList: [
        "Robert.json",
        "Azalea.json",
    ]
}

class LocalizeManager {
    /**
     * This class handle Localization part of the game.
     */
    constructor() {
        /** @type {Map.<string, LocalizeEntry>} */
        this._texts = new Map();
        /** @type {Map<string, NpcLocalizeEntry[]} */
        this._npcEntries = new Map();
        this._language = 'vn';
        this.init();
        this.loadFiles();
    }
    /**
     * Get text by key
     * @param {string} key 
     * @param {string} prefix 
     * @param {string} language 
     * @returns {string}
     */
    getText(key, prefix = null, language = null) {
        key = prefix ? prefix + "_" + key : key;
        language = language || this._language;
        const entry = this._texts.get(key);
        return entry ? entry.lang[language] : `[${key}]`;
    }
    /**
     * Get Item Text
     * @param {string} key 
     * @returns {{name: string, description: string}}
     */
    getItemText(key, language = null) {
        language = language || this._language;
        const entry = this._texts.get(key);
        return entry ? {
            name: entry.lang[language],
            description: entry.description[language]
        } : {
            name: `[${key}]`,
            description: `[${key}'s Description]`
        }
    }
    /**
     * Init variables
     */
    init() {
        this._isSystemLoaded = false;
        this._isItemLoaded = false;
        this._isNPCLoaded = false;
        this._totalNpcLoaded = 0;
    }
    /**
     * Load important files
     */
    loadFiles() {
        this.loadSystem();
        this.loadItem();
        this.loadNPC();
    }
    /**
     * Check if is ready 
     * @returns {boolean}
     */
    isReady() {
        return this._isSystemLoaded && this._isItemLoaded && this._isNPCLoaded;
    }
    /**
     * Load localize json file
     * @param {string} path 
     * @returns {Promise<string>}
     */
    loadJson(path) {
        path = LocalizeConfig.path + "/" + path;
        return new Promise((resolve, reject) => {
            MyUtils.loadFile(path, (data) => {
                resolve(data);
            });
        })
    }
    /**
     * Load system entries
     */
    async loadSystem() {
        const promises = [];
        LocalizeConfig.systemFiles.forEach(filename => {
            promises.push(this.loadJson(filename));
        });
        const arrayData = await Promise.all(promises);
        arrayData.forEach(data => {
            /** @type any[] */
            const array = JSON.parse(data);
            array.forEach(data => {
                const newEntry = new SystemLocalizeEntry();
                for (let key in data) {
                    newEntry[key] = data[key];
                }
                this._texts.set(data.key, newEntry);
            })
        })
        this._isSystemLoaded = true;
    }
    /**
     * Load item entries
     */
    async loadItem() {
        const path = LocalizeConfig.itemFile;
        const data = await this.loadJson(path);
        /** @type any[] */
        const array = JSON.parse(data);
        array.forEach(data => {
            const newEntry = new ItemLocalizeEntry();
            for (let key in data) {
                newEntry[key] = data[key];
            }
            this._texts.set(data.key, newEntry);
        })
        this._isItemLoaded = true;
    }
    /**
     * Load NPC entries.
     */
    async loadNPC() {
        const folderPath = LocalizeConfig.npcPath + "/";
        const promises = [];
        LocalizeConfig.NPCList.forEach(npcFilename => {
            const path = folderPath + npcFilename;
            promises.push(this.loadJson(path));
        });
        const arrayData = await Promise.all(promises);
        arrayData.forEach(data => {
            /** @type any[] */
            const array = JSON.parse(data);
            array.forEach(data => {
                const newEntry = new NpcLocalizeEntry();
                for (let key in data) {
                    newEntry[key] = data[key];
                }
                this._texts.set(data.npc + "_" + data.key, newEntry);
                // Caching npc entries.
                if (!this._npcEntries.get(data.npc)) {
                    this._npcEntries.set(data.npc, [])
                }
                this._npcEntries.get(data.npc).push(newEntry);
            });
        })
        this._isNPCLoaded = true;
    }
}
/** @type {LocalizeManager}*/
LocalizeManager.inst = new LocalizeManager();
/**
 * Get Text Shortcut
 * @param {string} key 
 * @param {string?} prefix 
 * @param {string?} language 
 * @returns {string}
 */
const GT = function (key, prefix = null, language = null) {
    return LocalizeManager.inst.getText(key, prefix, language);
}
/**
 * Get Text By Key
 */
LocalizeManager.t = GT;
/**
 * Get NPC Text Data
 * @param {string} npcKey the key of the NPC
 * @returns {NpcLocalizeEntry[]}
 */
LocalizeManager.NPC = function (npcKey) {
    return this.inst._npcEntries.get(npcKey);
}
/**
 * Get item
 * @param {string} itemKey 
 */
LocalizeManager.item = function (itemKey) {
    return this.inst.getItemText(itemKey);
}

class LocalizeEntry {
    /**
     * LocalizeData
     */
    constructor() {
        this.key = null;
        /** @type {Object.<string, string>} */
        this.lang = null;
    }
}

class SystemLocalizeEntry extends LocalizeEntry {

}

class ItemLocalizeEntry extends LocalizeEntry {
    /**
     * ItemLocalizeEntry
     */
    constructor() {
        super();
        /** @type {Object.<string, string>} */
        this.description = null;
    }
}

class NpcLocalizeEntry extends LocalizeEntry {
    /**
     * NpcLocalizeEntry
     */
    constructor() {
        super();
        /** @type {string} */
        this.npc = null;
        /** @type {string[]} */
        this.condition = [];
    }
}

//========================================================================
// RPG MAKER SECTION
//========================================================================

var DSI_Sys1_Localization_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function () {
    const result = DSI_Sys1_Localization_Scene_Boot_isReady.call(this);
    return result && LocalizeManager.inst.isReady();
};