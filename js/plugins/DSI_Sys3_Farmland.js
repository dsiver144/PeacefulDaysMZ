class Farmland {
    /**
     * Create a farm land
     * @param {number} mapId 
     * @param {number} mapWidth 
     */
    constructor(mapId) {
        /** @type {number} */
        this.mapId = mapId;
        /** @type {Object.<string, FarmObject>} */
        this.farmObjects = {};
    }
    /**
     * Add Object
     * @param {FarmObject} object 
     */
    addObject(object) {
        const {x, y} = object.position;
        this.farmObjects[this.pos(x, y)] = object;
        object.onSpawned();
    }
    /**
     * 
     * @param {FarmObject} object 
     */
    removeObject(object) {
        const {x, y} = object.position;
        this.farmObjects.splice(this.pos(x, y), 1);
        object.onRemoved();
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
        return new Position(x, y).toString();
    }
}