class FarmObject {
    /**
     * Create farm object
     * @param {Position} position 
     * @param {number} mapId 
     */
    constructor(position, mapId) {
        /** @type {Position} */
        this.position = position;
        /** @type {number} */
        this.mapId = mapId;
    }
    /**
     * Will be called when being spawned.
     */
    onSpawned() {

    }
    /**
     * Will be called when being removed;
     */
    onRemoved() {
        
    }
}
