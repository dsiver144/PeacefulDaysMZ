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
class FarmLayer extends SaveableObject {
    /**
     * Farm Layer
     * @param {number} index 
     */
    constructor(index) {
        super();
        /** @type {Object.<string, FarmObject>} */
        this.objects = {};
        /** @type {number} */
        this.index = index;
    }
    /**
     * On New Day
     */
    onNewDay() {
        for (const pos in this.objects) {
            this.objects[pos].onNewDay();
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
     * Get Object At
     * @param {number} x 
     * @param {number} y 
     * @returns {FarmObject}
     */
    getObject(x, y) {
        return this.objects[this.pos(x, y)];
    }
    /**
     * Set Farm Object
     * @param {number} x 
     * @param {number} y 
     * @param {FarmObject} object 
     */
    set(x, y, object) {
        this.objects[this.pos(x, y)] = object;
    }
    /**
     * Remove Farm Object
     * @param {number} x 
     * @param {number} y 
     */
    remove(x, y) {
        delete this.objects[this.pos(x, y)];
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
     * Get Save Data
     * @returns {any}
     */
    getSaveData() {
        const result = super.getSaveData();
        const savedObjects = {};
        for (const position in this.objects) {
            savedObjects[position] = this.objects[position].getSaveData();
        }
        result['objects'] = savedObjects;
        return result;
    }
    /**
     * Load Save Data
     * @param {any} data 
     */
    loadSaveData(data) {
        super.loadSaveData(data);
        this.objects = {};
        for (const position in data['objects']) {
            let savedObject = data['objects'][position];
            if (!savedObject.type) {
                console.warn("@@ Save handle error for :", savedObject);
            }
            let newFarmObject = eval(`new ${savedObject.type}()`);
            newFarmObject.loadSaveData(savedObject);
            this.objects[position] = newFarmObject;
        }
    }
}
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
        /** @type {FarmLayer[]} */
        this.layers = [new FarmLayer(0), new FarmLayer(1)];
    }
    /**
     * On New Day
     */
    onNewDay() {
        this.layers.forEach(layer => layer.onNewDay());
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
        switch (toolType) {
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
     * @param {string} seedId
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
     * @param {string} seedId
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
    getObject(x, y, layerIndex = -1) {
        const objects = [];
        if (layerIndex >= 0) {
            return this.layers[layerIndex].getObject(x, y);
        }
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const obj = this.layers[i].getObject(x, y);
            obj && objects.push(obj);
        }
        return objects[0];
    }
    /**
     * Calculate Autotile for farm object
     * @param {FarmObject} object 
     * @param {boolean} recursive 
     * @returns 
     */
    calculateAutotileForObject(object, times = 2) {
        const autotileType = object.autotileType();
        if (!autotileType) return;
        object.autotileId = AutotileUtils.calcIndexBy8Direction((offset) => {
            const neighbor = this.getObject(object.position.x + offset.x, object.position.y + offset.y, object.layerIndex);
            if (neighbor && neighbor.autotileType() == object.autotileType()) {
                if (times > 0) {
                    this.calculateAutotileForObject(neighbor, times - 1);
                }
                return true;
            }
            return false;
        })
    }
    /**
     * Add Object
     * @param {FarmObject} object 
     */
    addObject(object, force = true) {
        const { x, y } = object.position;
        const layerIndex = object.layerIndex;
        if (!force && this.getObject(x, y, layerIndex)) return;
        this.layers[layerIndex].set(x, y, object);
        // Calculate autotile
        this.calculateAutotileForObject(object);
        // Spawm child object
        for (let ox = 0; ox < object.bottomSize().x; ox++) {
            for (let oy = 0; oy < object.bottomSize().y; oy++) {
                if (ox == 0 && oy == 0) continue;
                if (!object.collisionCondition(ox, oy)) continue;
                const childObject = new FarmChildObject(new Vector2(x + ox, y + oy), object.mapId);
                childObject.setParentPosition(object.position);
                this.layers[layerIndex].set(x + ox, y + oy, childObject);
            }
        }
        object.spawn();
    }
    /**
     * Replace Object
     * @param {FarmObject} object
     * @deprecated 
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
        const layerIndex = object.layerIndex;
        // delete this.farmObjects[this.pos(x, y)];
        this.layers[layerIndex].remove(x, y);
        object.remove();
        // Calculate autotile
        this.calculateAutotileForObject(object);
        // Remove child objects
        for (let ox = 0; ox < object.bottomSize().x; ox++) {
            for (let oy = 0; oy < object.bottomSize().y; oy++) {
                if (ox == 0 && oy == 0) continue;
                if (!object.collisionCondition(ox, oy)) continue;
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
    removeObjectAt(x, y, layerIndex = -1) {
        const object = this.getObject(x, y, layerIndex);
        if (!object) return false;
        this.removeObject(object);
        return true;
    }
    /**
     * Get All Save Properties
     * @returns {any[]}
     */
    saveProperties() {
        return [
            ["mapId", null],
            ["@Arr(FarmLayer):layers", null]
        ]
    }
    // /**
    //  * Get Save Data
    //  * @returns {any}
    //  */
    // getSaveData() {
    //     const result = super.getSaveData();
    //     const savedObjects = {};
    //     for (const position in this.farmObjects) {
    //         savedObjects[position] = this.farmObjects[position].getSaveData();
    //     }
    //     result['farmObjects'] = savedObjects;
    //     return result;
    // }
    // /**
    //  * Load Save Data
    //  * @param {any} data 
    //  */
    // loadSaveData(data) {
    //     super.loadSaveData(data);
    //     this.farmObjects = {};
    //     for (const position in data['farmObjects']) {
    //         let savedObject = data['farmObjects'][position];
    //         if (!savedObject.type) {
    //             console.warn("@@ Save handle error for :", savedObject);
    //         }
    //         let newFarmObject = eval(`new ${savedObject.type}()`);
    //         newFarmObject.loadSaveData(savedObject);
    //         this.farmObjects[position] = newFarmObject;
    //     }
    // }
    /**
     * Get array of all farm objects
     * @returns {FarmObject[]}
     */
    allObjects() {
        let allObjects = [];
        for (const layer of this.layers) {
            allObjects = allObjects.concat(Object.values(layer.objects));
        }
        return allObjects;
    }
}