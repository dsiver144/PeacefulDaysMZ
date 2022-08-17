//=======================================================================
// * Plugin Name  : DSI_Sys1_CameraController.js
// * Last Updated : 8/17/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Camera Controller
 * @help 
 * Empty Help
 */
class CameraController {
    /**
     * CameraController
     */
    constructor() {
        CameraController.inst = this;
        this._tileSize = 32;
        this._width = Graphics.width / 2;
        this._height = Graphics.height / 2;
        this._speed = 200;
        this._target = null;
    }
    /**
     * Set Target
     * @param {any} target Target for the camera to follow
     * @param {number} speed Speed of the camera
     */
    setTarget(target, speed = 200) {
        this._lastTarget = this._target;
        this._lastSpeed = this._speed;
        this._target = target;
        this._speed = speed;
    }
    /**
     * Restore
     */
    restore() {
        this._target = this._lastTarget;
        this._speed = this._lastSpeed;
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
        const cw = this._width;
        const ch = this._height;
        const screenX = this._target.screenX();
        const screenY = this._target.screenY();
        let sx = Math.abs(screenX - cw) / this._speed;
        let sy = Math.abs(screenY - ch) / this._speed;

        if (sx < 0.01) (sx = 0);
        if (sy < 0.01) (sy = 0);

        if (screenY < ch) {
            $gameMap.scrollUp(sy);
        } else if (screenY > ch) {
            $gameMap.scrollDown(sy);
        };
        if (screenX < cw) {
            $gameMap.scrollLeft(sx);
        } else if (screenX > cw) {
            $gameMap.scrollRight(sx);
        };
    }

}
/** @type {CameraController} */
CameraController.inst = null;

Game_Map.prototype.displayX = function() {return Math.ceil(this._displayX * 32) / 32};
Game_Map.prototype.displayY = function() {return Math.ceil(this._displayY * 32) / 32};

Game_Player.prototype.update = function(sceneActive) {
    // const lastScrolledX = this.scrolledX();
    // const lastScrolledY = this.scrolledY();
    const wasMoving = this.isMoving();
    this.updateDashing();
    if (sceneActive) {
        this.moveByInput();
    }
    Game_Character.prototype.update.call(this);
    // this.updateScroll(lastScrolledX, lastScrolledY);
    this.updateVehicle();
    if (!this.isMoving()) {
        this.updateNonmoving(wasMoving, sceneActive);
    }
    this._followers.update();
};

var DSI_Sys1_CameraController_Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function () {
    DSI_Sys1_CameraController_Game_Map_initialize.call(this);
    this._cameraController = new CameraController();
}

Game_Map.prototype.updateScroll = function () {
    this._cameraController.update();
}

var DSI_Sys1_CameraController_Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function () {
    DSI_Sys1_CameraController_Game_Player_initMembers.call(this);
    CameraController.inst.setTarget(this);
}