class GameInteractionManager {
    /** @type {GameInteractionManager} */
    static inst = null;
    constructor() {
        GameInteractionManager.inst = this;
        /** @type {InteractableObject} */
        this._lastObject = null;
    }
    /**
     * Reset
     */
    reset() {
        this._lastObject = null;
        this._delayCounter = 15;
    }
    /**
     * Get all interactable objects
     * @returns {InteractableObject[]}
     */
    allObjects() {
        let objects = [
            ...$gameMap.events(),
            ...FarmManager.inst.currentFarmland().allObjects()
        ];
        return objects;
    }
    /**
     * Update interaction manager
     */
    update() {
        this.updateDelay();
        this.updateCheck();
        this.updateControl();
    }
    /**
     * Update Delay
     */
    updateDelay() {
        if (this._delayCounter > 0) this._delayCounter -= 1;
    }
    /**
     * Check if system is enabled 
     * @returns {boolean}
     */
    isEnabled() {
        return $gamePlayer.canMove() && !this._delayCounter;
    }
    /**
     * Get Nearest Object At A Specific Position
     * @param {Vector2} pos 
     * @returns {InteractableObject}
     */
    getNearestObjectAtPosition(pos) {
        if (!this.isEnabled()) return null;
        const checkPos = pos;
        checkPos.x += 0.5;
        checkPos.y += 0.5;
        let minDist = Number.POSITIVE_INFINITY;
        /** @type {InteractableObject} */
        let targetObject = null;
        this.allObjects().forEach((object) => {
            if (!object.interactable()) return;
            const rect = object.interactionRange();
            if (checkPos.x >= rect.x && checkPos.x <= rect.x + rect.width &&
                checkPos.y >= rect.y && checkPos.y <= rect.y + rect.height) {
                const midPointX = (rect.x + rect.width) / 2;
                const midPointY = (rect.y + rect.height) / 2;
                const dx = midPointX - checkPos.x;
                const dy = midPointY - checkPos.y;
                const dist = dx ** 2 + dy ** 2;
                if (dist < minDist) {
                    minDist = dist;
                    targetObject = object;
                }
            }
        })
        return targetObject;
    }
    /**
     * Update check for nearest object 
     */
    updateCheck() {
        /** @type {InteractableObject} */
        let targetObject = this.getNearestObjectAtPosition($gamePlayer.frontPosition());
        if (targetObject) {
            if (this._lastObject != targetObject) {
                this._lastObject = targetObject;
                this._lastObject.onEnterInteractRange();
            }
        } else {
            Sprite_InteractionHint.inst.removeTarget();
            this._lastObject?.onLeaveInteractRange();
            this._lastObject = null;
        }
    }
    /**
    * Update control
    */
    updateControl() {
        const checkInput = Input.isTriggeredCheck();
        if (checkInput > 0) {
            if (checkInput == 2) {
                const px = Math.round($gamePlayer._x);
                const py = Math.round($gamePlayer._y);
                const x = $gameMap.canvasToMapX(TouchInput.x);
                const y = $gameMap.canvasToMapY(TouchInput.y);
                const dist = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
                if (dist > 1.5) {
                    return false;
                }
                var mousePos = new Vector2(x, y);
                /** @type {InteractableObject} */
                let targetObject = this.getNearestObjectAtPosition(mousePos);
                if (targetObject) {
                    targetObject.startInteract();
                }
            } else {
                this._lastObject?.startInteract();
            }
        }
    }
}

new GameInteractionManager();

class InteractableObject {

    interactionRange() {
        return new Rectangle(0, 0, 0, 0);
    }

    interactable() {
        return true;
    }

    startInteract() {

    }

    interactObjectName() {

    }

    onLeaveInteractRange() {

    }

    onEnterInteractRange() {

    }
}

var DSI_Sys1_InteractionManager_Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function (sceneActive) {
    DSI_Sys1_InteractionManager_Game_Map_update.call(this, sceneActive);
    GameInteractionManager.inst.update();
}

//===================================================================
// GAME EVENT
//===================================================================
Game_Event.prototype.interactionRange = function () {
    return new Rectangle(this._x, this._y, 1, 1);
}

Game_Event.prototype.interactable = function () {
    return this._priorityType == 1;
}

Game_Event.prototype.interactObjectName = function () {
    return this.event().name;
}

Game_Event.prototype.onEnterInteractRange = function () {
    Sprite_InteractionHint.inst.setTarget('Lb_Interact')
    console.log("Enter interact range", this.interactObjectName());
}

Game_Event.prototype.onLeaveInteractRange = function () {
    console.log("Leave interact range", this.interactObjectName());
}

Game_Event.prototype.startInteract = function () {
    $gamePlayer.turnTowardCharacter(this);
    this.start();
    $gameMap.setupStartingEvent();
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys2_InteractionManager_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function () {
    DSI_Sys2_InteractionManager_Spriteset_Map_createUpperLayer.call(this);
    this._interactionHintSprite = new Sprite_InteractionHint(FieldKeyAction.Check, 'Lb_Ok');
    // this._interactionHintSprite.anchor.x = 0.5;
    // this._interactionHintSprite.anchor.y = 0.5;
    this._interactionHintSprite.x = Graphics.width / 2;
    this._interactionHintSprite.y = Graphics.height - 120;
    this.addChild(this._interactionHintSprite);
    GameInteractionManager.inst.reset();
}

class Sprite_InteractionHint extends Sprite_KeyHint {
    /** @type {Sprite_InteractionHint} */
    static inst = null;
    constructor(keyAction, textKey, autoRefresh = true, mode = null) {
        super(keyAction, textKey, autoRefresh, mode);
        Sprite_InteractionHint.inst = this;
        this.opacity = 0;
    }
    /**
     * Set display target
     * @param {string} textKey 
     * @param {string} keyAction 
     */
    setTarget(textKey, keyAction = FieldKeyAction.Check) {
        this._hasTarget = true;
        this._keyAction = keyAction;
        this._textKey = textKey;
        this.refresh();
    }
    /**
     * @inheritdoc
     */
    hintBGPath() {
        return "img/menus/InteractHintBG.png";
    }
    /**
     * Remove target
     */
    removeTarget() {
        this._hasTarget = false;
    }
    /**
     * Update
     */
    update() {
        super.update();
        this.updateFade();
        this.updatePosition();
    }
    /**
     * Update Fade
     */
    updateFade() {
        if (this._hasTarget) {
            this.opacity += 25;
        } else {
            this.opacity -= 25;
        }
    }
    /**
     * Update Position
     */
    updatePosition() {
        this.x = $gamePlayer.screenX() - this.width / 2;
        this.y = $gamePlayer.screenY() - this.height - 80;
    }
}