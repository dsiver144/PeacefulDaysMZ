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
        this._zoomRatio = 1.0;
    }
    /**
     * @inheritdoc
     */
    saveProperties() {
        return [
            ['_targetType', ''],
            ['_lastScrollX', ''],
            ['_lastScrollY', ''],
            ['_zoomRatio', ''],
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
        switch (targeType) {
            case 'Game_Player':
                this.setTarget($gamePlayer, this._speed);
                break;
        }
    }
    /**
     * Set Zoom
     * @param {number} zoomRatio 
     */
    setZoom(zoomRatio, duration = 0) {
        if (duration == 0) {
            this._zoomRatio = zoomRatio;
            return;
        }
        this._targetZoomRatio = zoomRatio;
        this._zoomDuration = duration;
    }
    /**
     * Get Zoom Ratio
     */
    get zoomRatio() {
        return this._zoomRatio;
    }
    /**
     * Update zoom
     */
    updateZoom() {
        if (this._zoomDuration > 0) {
            const d = this._zoomDuration;
            const t = this._targetZoomRatio;
            this._zoomRatio = (this._zoomRatio * (d - 1) + t) / d;
            this._zoomDuration--;
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
        } catch (err) {
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
        this.updateZoom();
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

var DSI_Sys1_CameraController_Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function () {
    DSI_Sys1_CameraController_Spriteset_Map_update.call(this);
    this.scale.x = CameraController.inst.zoomRatio || 1.0;
    this.scale.y = CameraController.inst.zoomRatio || 1.0;
}

// Game_Map.prototype.screenTileX = function() {
//     const zoomRatio = CameraController.inst.zoomRatio || 1.0;
//     return Math.round((Graphics.width / this.tileWidth()) * 16) / 16 / zoomRatio;
// };

// Game_Map.prototype.screenTileY = function() {
//     const zoomRatio = CameraController.inst.zoomRatio || 1.0;
//     return Math.round((Graphics.height / this.tileHeight()) * 16) / 16 / zoomRatio;
// };