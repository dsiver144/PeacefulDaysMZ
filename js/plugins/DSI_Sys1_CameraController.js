//=======================================================================
// * Plugin Name  : DSI_Sys1_CameraController.js
// * Last Updated : 8/17/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Camera Controller. Inspired by Galv
 * @help 
 * Empty Help
 */
class CameraController extends SaveableObject {
    /** @type {CameraController} */
    static inst = null;
    /**
     * CameraController
     */
    constructor() {
        super();
        CameraController.inst = this;
        this._target = null;
        this._targetType = null;
        this._lastScrollX = null;
        this._lastScrollY = null;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ['_targetType', ''],
            ['_lastScrollX', ''],
            ['_lastScrollY', ''],
        ]
    }
    /**
     * @inheritdoc
     */
    getSaveData() {
        this._targetType = this._target.constructor.name;
       return super.getSaveData(); 
    }
    Auto
    /**
     * @inheritdoc
     */
    loadSaveData(data) {
        super.loadSaveData(data);
        /** @type {string} */
        const targeType = data._targetType;
        switch(targeType) {
            case 'Game_Player':
                this.setTarget($gamePlayer, this._speed);
                break;
        }
    }
    /**
     * Set Target
     * @param {any} target Target for the camera to follow
     * @param {number} speed Speed of the camera
     */
    setTarget(target, speed = 200) {
        this._lastTarget = this._target;
        this._target = target;
        try {
            this._lastScrollX = this._target.scrolledX();
            this._lastScrollY = this._target.scrolledY();
        } catch(err) {
            console.warn(err);
            this._lastScrollX = 0;
            this._lastScrollY = 0;
        }
    }
    /**
     * Restore
     */
    restore() {
        this._target = this._lastTarget;
    }
    /**
     * Update per frame
     */
    update() {
        this.updateScroll();
    }
    /**
     * Update scroll
     * @returns {void}
     */
    updateScroll() {
        if (!this._target) return;
        const x1 = this._lastScrollX;
        const y1 = this._lastScrollY;
        const x2 = this._target.scrolledX();
        const y2 = this._target.scrolledY();
        let amount = 0;
        let ratio = 1;
        if (y2 > y1 && y2 > this.centerY()) {
            amount = (y2 - y1) * ratio;
            $gameMap.scrollDown(amount);
        }
        if (x2 < x1 && x2 < this.centerX()) {
            amount = (x1 - x2) * ratio;
            $gameMap.scrollLeft(amount);
        }
        if (x2 > x1 && x2 > this.centerX()) {
            amount = (x2 - x1) * ratio;
            $gameMap.scrollRight(amount);
        }
        if (y2 < y1 && y2 < this.centerY()) {
            amount = (y1 - y2) * ratio;
            $gameMap.scrollUp(amount);
        }
        this._lastScrollX = this._target.scrolledX();
        this._lastScrollY = this._target.scrolledY();
    }
    /**
     * Center X
     * @returns {number}
     */
    centerX() {
        return ($gameMap.screenTileX() - 1) / 2;
    };
    /**
     * Center Y
     * @returns {number}
     */
    centerY() {
        return ($gameMap.screenTileY() - 1) / 2;
    };

}

Game_Player.prototype.updateScroll = function (lastScrolledX, lastScrolledY) {
    
};

var DSI_Sys1_CameraController_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys1_CameraController_Game_System_createSaveableObjects.call(this);
    this._cameraController = new CameraController();
}

Game_Map.prototype.updateScroll = function () {
    CameraController.inst?.update();
}

var DSI_Sys1_CameraController_Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function () {
    DSI_Sys1_CameraController_Game_Player_initMembers.call(this);
    CameraController.inst?.setTarget(this);
}