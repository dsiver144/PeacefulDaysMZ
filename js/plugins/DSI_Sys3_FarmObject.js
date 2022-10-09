//=======================================================================
// * Plugin Name  : DSI_Sys3_FarmObject.js
// * Last Updated : 7/23/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Farm Object
 * @help 
 * Empty Help
 */
class FarmObject extends SaveableObject {
    /**
     * Create farm object
     * @param {Vector2} position 
     * @param {number} mapId 
     */
    constructor(position, mapId) {
        super();
        /** @type {Vector2} */
        this.position = position;
        /** @type {number} */
        this.mapId = mapId;
        /** @type {string} */
        this.type = this.constructor.name;
        /** @type {number} */
        this.autotileId = 46;
    }
    /**
     * Layer Index
     * @returns {number}
     */
    get layerIndex() {
        return 0;
    }
    /**
     * Get autotile type
     * @returns {string}
     */
    autotileType() {
        return null;
    }
    /**
     * Size
     * @returns {Vector2}
     */
    size() {
        return {x: 1, y: 1};
    }
    /**
     * Bottom Size
     * @returns {Vector2}
     */
    bottomSize() {
        return {x: 1, y: 1};
    }
    /**
     * Collision Condition
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    collisionCondition(x, y) {
        const size = this.bottomSize();
        return x >= 0 && x <= size.x && y >= 0 && y <= size.y;
    }
    /**
     * Override: saveProperties
     */
    saveProperties() {
        return [
            ['position', null],
            ['type', null],
            ['mapId', null],
            ['autotileId', null],
        ];
    }
    /**
     * Spawn
     */
    spawn() {
        this.objectSprite();
        this.onSpawned();
    }
    /**
     * Call this to remove this object from its farmland
     */
    removeSelf() {
        FarmManager.inst.getFarmlandById(this.mapId).removeObject(this);
    }
    /**
     * Remove
     */
    remove() {
        this.removeSprite();
        this.onRemoved();
    }
    /**
     * Interact
     */
    interact(object, force = false) {
        this.onInteract(object || this, force);
    }
    /**
     * Will be called when being spawned.
     */
    onSpawned() {
        console.log("> A new ", this.type, " has been spawned at " + this.position.toString(), this);
    }
    /**
     * Will be called when being removed;
     */
    onRemoved() {
        console.log("> A ", this.type, " has been removed at " + this.position.toString(), this);
    }
    /**
     * On New Day
     */
    onNewDay() {
        
    }
    /**
     * On Interact
     * @param {FarmObject} object
     * @param {boolean} force
     */
    onInteract(object, force = false) {
        console.log("> A ", this.type, " has been interacted at " + this.position.toString(), this);
    }
    /**
     * On Hit By Tool
     * @param {ToolType} toolType 
     */
    checkHitByTool(toolType) {
        if (!this.hittingTools().includes(toolType)) return false;
        return this.onHitByTool(toolType);
    }
    /**
     * Return all tool that can be used to hit this object
     * @returns {ToolType[]}
     */
    hittingTools() {
        return [];
    }
    /**
     * On Hit By Tool. 
     * Must return correct boolean value if successfully or not.
     * @param {ToolType} toolType 
     * @param {any} extraData 
     * @returns {boolean}
     */
    onHitByTool(toolType, extraData) {
        return false;
    }
    /**
     * Check if this object is interactable
     * @returns {boolean}
     */
    interactable() {
        return false;
    }
    /**
     * Check if RPG Character can collide with farm objects.
     * @returns {boolean}
     */
    isCollidable() {
        return false;
    }
    /**
     * Sprite Identifier Key
     * @returns {string}
     */
    spriteKey() {
        const {x, y} = this.position;
        return `farmObject_${x}_${y}`;
    }
    /**
     * Get object sprite
     * @returns {Sprite_FarmObject}
     */
    objectSprite(preview = false) {
        if (preview) {
            const constructor = this.spriteClass();
            return new constructor(this);
        }
        const key = this.spriteKey();
        let sprite = MyUtils.getMapSprite(key);
        if (!sprite && this.mapId == $gameMap.mapId()) {
            const constructor = this.spriteClass();
            sprite = new constructor(this);
            MyUtils.addMapSprite(key, sprite);
            this.onObjectSpriteCreated();
        }
        return sprite;
    }
    /**
     * On Created Sprite First Time
     */
    onObjectSpriteCreated() {

    }
    /**
     * Refresh object sprite
     * @param {string} type
     */
    refreshSprite(type = "") {
        const sprite = this.objectSprite();
        sprite && sprite.refreshBitmap(type);
    }
    /**
     * Remove sprite
     */
    removeSprite() {
        const sprite = this.objectSprite();
        if (sprite) {
            sprite.removeOptionalSprites();
            MyUtils.removeMapSprite(this.spriteKey());
        }
    }
    /**
     * Shake sprite
     * @param {number} power
     */
    shakeSprite(power = 0.1) {
        const sprite = this.objectSprite();
        if (sprite) {
            sprite.shake(power);
        }
    }
    /**
     * Sprite Class
     * @returns {any}
     */
    spriteClass() {
        return Sprite_FarmObject;
    }
    /**
     * Interact Position For `GameInteractionManager`
     * @returns {Vector2}
     */
    interactionRange() {
        return new Rectangle(this.position.x, this.position.y, 1, 1);
    }
    /**
     * Start Interact For `GameInteractionManager`
     * @returns {boolean}
     */
    startInteract() {
        return this.interact(this, true);
    }
    /**
     * Interact Object Name For `GameInteractionManager`
     * @returns {string}
     */
    interactObjectName() {
        return this.type;
    }
    /**
     * onEnterInteractRange For `GameInteractionManager`
     */
    onEnterInteractRange() {
        console.log("Enter interact range", this.interactObjectName(), this);
    }
    /**
     * onLeaveInteractRange For `GameInteractionManager`
     */
    onLeaveInteractRange() {
        console.log("Leave interact range", this.interactObjectName());
    }
}

class FarmChildObject extends FarmObject {
    /**
     * Create farm object
     * @param {Vector2} position 
     * @param {number} mapId 
     */
     constructor(position, mapId) {
        super(position, mapId);
        this.type = 'FarmChildObject';
    }
    /**
     * Set Parent Position
     * @param {Vector2} position 
     */
    setParentPosition(position) {
        /** @type {Vector2} */
        this._parentPosition = position;
    }
    /**
     * Get Parent Object
     * @returns {FarmObject}
     */
    parentObject() {
        const {x, y} = this._parentPosition;
        return FarmManager.inst.farmlands[this.mapId].getObject(x, y);
    }
    /**
     * Size
     * @returns {Vector2}
     */
    size() {
        return {x: 1, y: 1};
    }
    /**
     * Bottom Size
     * @returns {Vector2}
     */
    bottomSize() {
        return {x: 1, y: 1};
    }
    /**
     * Override: saveProperties
     */
    saveProperties() {
        const props = super.saveProperties();
        return props.concat([
            ['_parentPosition', null]
        ]);
    }
    /**
     * Spawn
     */
    spawn() {
        
    }
    /**
     * Remove
     */
    remove() {
        // this.parentObject()?.remove();
    }
    /**
     * Interact
     */
    interact() {
        this.parentObject().interact(this);
    }
    /**
     * Will be called when being spawned.
     */
    onSpawned() {
        // console.log("> A new ", this.type, " has been spawned at " + this.position.toString(), this);
    }
    /**
     * Will be called when being removed;
     */
    onRemoved() {
        // console.log("> A ", this.type, " has been removed at " + this.position.toString(), this);
    }
    /**
     * On New Day
     */
    onNewDay() {
        
    }
    /**
     * On Interact
     * @param {FarmObject} object
     * @param {boolean} false
     */
    onInteract(object, force = false) {
        console.log("> A ", this.type, " has been interacted at " + this.position.toString(), this);
    }
    /**
     * On Hit By Tool
     * @param {ToolType} toolType 
     */
    checkHitByTool(toolType) {
        if (!this.hittingTools().includes(toolType)) return false;
        return this.parentObject().onHitByTool(toolType);
    }
    /**
     * Return all tool that can be used to hit this object
     * @returns {ToolType[]}
     */
    hittingTools() {
        return this.parentObject().hittingTools();
    }
    /**
     * On Hit By Tool. 
     * Must return correct boolean value if successfully or not.
     * @param {ToolType} toolType 
     * @param {any} extraData 
     * @returns {boolean}
     */
    onHitByTool(toolType, extraData) {
        return this.parentObject().onHitByTool(toolType, extraData);
    }
    /**
     * Check if this object is interactable
     * @returns {boolean}
     */
    interactable() {
        return false;
    }
    /**
     * Check if RPG Character can collide with farm objects.
     * @returns {boolean}
     */
    isCollidable() {
        return this.parentObject().isCollidable();
    }
    /**
     * Sprite Identifier Key
     * @returns {string}
     */
    spriteKey() {
        return this.parentObject().spriteKey();
    }
    /**
     * Get object sprite
     * @returns {Sprite_FarmObject}
     */
    objectSprite() {
        const key = this.spriteKey();
        let sprite = MyUtils.getMapSprite(key);
        return sprite;
    }
    /**
     * Refresh object sprite
     */
    refreshSprite() {
        this.parentObject().refreshSprite();
    }
    /**
     * Remove sprite
     */
    removeSprite() {
        this.parentObject().removeSprite();
    }
    /**
     * Shake sprite
     * @param {number} power
     */
    shakeSprite(power = 0.1) {
        this.parentObject().shakeSprite(power);
    }
    /**
     * Sprite Class
     * @returns {any}
     */
    spriteClass() {
        return this.parentObject().spriteClass();
    }
}