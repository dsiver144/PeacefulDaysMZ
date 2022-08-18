//=======================================================================
// * Plugin Name  : DSI_Sys3_Farmland.js
// * Last Updated : 7/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Farm Land
 * @help 
 * Empty Help
 */
class Farmland extends SaveableObject {
    /**
     * Create a farm land
     * @param {number} mapId 
     * @param {number} mapWidth 
     */
    constructor(mapId) {
        super();
        /** @type {number} */
        this.mapId = mapId;
        /** @type {Object.<string, FarmObject>} */
        this.farmObjects = {};
    }
    /**
     * On New Day
     */
    onNewDay() {
        for (const pos in this.farmObjects) {
            this.farmObjects[pos].onNewDay();
        }
    }
    /**
     * Check interact with farm object;
     * @param {number} x 
     * @param {number} y 
     */
    checkInteract(x, y) {
        const object = this.getObject(x, y);
        if (!object) return false;
        if (!object.interactable()) return false;
        object.interact();
        return true;
    }
    /**
     * Use Tool
     * @param {ToolType} toolType 
     * @param {number} x 
     * @param {number} y 
     * @param {any} toolEx 
     * @returns {boolean}
     */
    useTool(toolType, x, y, toolEx = null) {
        let result = false;
        switch(toolType) {
            case ToolType.hoe:
                result = this.useHoe(x, y);
                break;
            case ToolType.wateringCan:
                result = this.useWateringCan(x, y);
                break;
            case ToolType.seedPack:
                result = this.useSeed(x, y, toolEx);
                break;
            case ToolType.sapling:
                result = this.useSapling(x, y, toolEx);
                break;
            case ToolType.hammer:
                result = this.useHammer(x, y);
                break;
            case ToolType.sickle:
                result = this.useSickle(x, y);
                break;
            case ToolType.axe:
                result = this.useAxe(x, y);
                break;
        }
        return result;
    }
    /**
     * Region ID
     * @param {number} x 
     * @param {number} y 
     * @returns {number}
     */
    regionId(x, y) {
        return $gameMap.regionId(x, y);
    }
    /**
     * Use Hoe
     * @param {number} x 
     * @param {number} y 
     */
    useHoe(x, y) {
        const object = this.getObject(x, y);
        if (object) {
            return object.onHitByTool(ToolType.hoe);
        }
        return !!this.createFarmTile(x, y);
    }
    /**
     * Create and return a FarmTile at specific position
     * @param {number} x 
     * @param {number} y
     * @param {boolean} force
     * @returns {FarmTile} 
     */
    createFarmTile(x, y, force = false) {
        if (!force && !FarmManager.isFarmRegion(x, y)) {
            return null;
        }
        const farmTile = new FarmTile(v2(x, y), this.mapId);
        this.addObject(farmTile);
        return farmTile;
    }
    /**
     * Use Seed Pack
     * @param {number} x 
     * @param {number} y 
     * @param {number} seedId
     */
    useSeed(x, y, seedId) {
        const object = this.getObject(x, y);
        if (!object) return false;
        return object.onHitByTool(ToolType.seedPack, seedId);
    }
    /**
     * Use Sapling
     * @param {number} x 
     * @param {number} y 
     * @param {number} seedId
     */
    useSapling(x, y, seedId) {
        let object = this.getObject(x, y);
        if (!object) {
            object = this.createFarmTile(x, y);
        }
        if (!object) {
            return false;
        }
        return object.onHitByTool(ToolType.sapling, seedId);
    }
    /**
     * Use Hammer
     * @param {number} x 
     * @param {number} y 
     */
    useHammer(x, y) {
        const object = this.getObject(x, y);
        if (!object) return false;
        return object.onHitByTool(ToolType.hammer);
    }
    /**
     * Use Watering Can
     * @param {number} x 
     * @param {number} y 
     */
    useWateringCan(x, y) {
        const object = this.getObject(x, y);
        if (!object) return false;
        return object.onHitByTool(ToolType.wateringCan);
    }
    /**
     * Use Sickle
     * @param {number} x 
     * @param {number} y 
     */
    useSickle(x, y) {
        const object = this.getObject(x, y);
        if (!object) return false;
        return object.onHitByTool(ToolType.sickle);
    }
    /**
     * Use Axe
     * @param {number} x 
     * @param {number} y 
     */
    useAxe(x, y) {
        const object = this.getObject(x, y);
        if (!object) return false;
        return object.onHitByTool(ToolType.axe);
    }
    /**
     * Get Object At
     * @param {number} x 
     * @param {number} y 
     * @returns {FarmObject}
     */
    getObject(x, y) {
        return this.farmObjects[this.pos(x, y)];
    }
    /**
     * Add Object
     * @param {FarmObject} object 
     */
    addObject(object) {
        const { x, y } = object.position;
        this.farmObjects[this.pos(x, y)] = object;
        object.spawn();
        // Spawm child object
        for (let ox = 0; ox < object.bottomSize().x; ox++) {
            for (let oy = 0; oy < object.bottomSize().y; oy++) {
                if (ox == 0 && oy == 0) continue;
                const childObject = new FarmChildObject(new Vector2(x + ox, y + oy), object.mapId);
                childObject.setParentPosition(object.position);
                this.farmObjects[this.pos(x + ox, y + oy)] = childObject;
            }
        }
    }
    /**
     * Replace Object
     * @param {FarmObject} object 
     */
    replaceObject(object) {
        const { x, y } = object.position;
        this.removeObjectAt(x, y);
        this.addObject(object);
    }
    /**
     * 
     * @param {FarmObject} object 
     */
    removeObject(object) {
        const { x, y } = object.position;
        delete this.farmObjects[this.pos(x, y)];
        object.remove();
        // Remove child objects
        for (let ox = 0; ox < object.bottomSize().x; ox++) {
            for (let oy = 0; oy < object.bottomSize().y; oy++) {
                if (ox == 0 && oy == 0) continue;
                const checkX = x + ox;
                const checkY = y + oy;
                const childObject = this.farmObjects[this.pos(checkX, checkY)];
                delete this.farmObjects[this.pos(checkX, checkY)];
                childObject.remove();
            }
        }
    }
    /**
     * Remove farm object at
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    removeObjectAt(x, y) {
        const object = this.farmObjects[this.pos(x, y)];
        if (!object) return false;
        this.removeObject(object);
        return true;
    }
    /**
     * Convert position to array position.
     * @param {number} x 
     * @param {number} y 
     * @returns {number}
     */
    pos(x, y) {
        return new Vector2(x, y).toString();
    }
    /**
     * Get All Save Properties
     * @returns {any[]}
     */
    saveProperties() {
        return [
            ["mapId", null],
        ]
    }
    /**
     * Get Save Data
     * @returns {any}
     */
    getSaveData() {
        const result = super.getSaveData();
        const savedObjects = {};
        for (const position in this.farmObjects) {
            savedObjects[position] = this.farmObjects[position].getSaveData();
        }
        result['farmObjects'] = savedObjects;
        return result;
    }
    /**
     * Load Save Data
     * @param {any} data 
     */
    loadSaveData(data) {
        super.loadSaveData(data);
        this.farmObjects = {};  
        for (const position in data['farmObjects']) {
            let savedObject = data['farmObjects'][position];
            if (!savedObject.type) {
                console.warn("@@ Save handle error for :", savedObject);
            }
            let newFarmObject = eval(`new ${savedObject.type}()`);
            newFarmObject.loadSaveData(savedObject);
            this.farmObjects[position] = newFarmObject;
        }
    }
    /**
     * Get array of all farm objects
     * @returns {FarmObject[]}
     */
    allObjects() {
        return Object.values(this.farmObjects);
    }
}