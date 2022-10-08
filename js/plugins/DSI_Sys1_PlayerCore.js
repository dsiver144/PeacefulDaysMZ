//=======================================================================
// * Plugin Name  : DSI_Sys1_PlayerCore.js
// * Last Updated : 10/8/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Player Core
 * @help 
 * Empty Help
 */

const PlayerCoreConfig = {
    offset: 0, // This is to prevent speed is too low at default.
    runBonus: 1,
    speedRatio: Math.pow(2, 10), // This should be power of 2. The bigger the slower the speed
    animationWaitMultiplier: 3, // The bigger the slower the animation is
    horseMoveSpeed: 6,
    normalInteractionRange: 1.8,
    npcInteractionRange: 2.0,
}

Game_CharacterBase.prototype.horseMoveSpeed = function () {
    return PlayerCoreConfig.horseMoveSpeed;
}

Game_CharacterBase.prototype.isRidingHorse = function () {
    return !!this._ridingHorse;
}

Game_CharacterBase.prototype.rideHorse = function (value) {
    this._ridingHorse = value;
}

Game_CharacterBase.prototype.bonusSpeed = function () {
    return 0;
}

Game_Player.prototype.realMoveSpeed = function () {
    if (this.isRidingHorse()) {
        return this.horseMoveSpeed();
    }
    return PlayerCoreConfig.offset + this._moveSpeed + (this.isDashing() ? PlayerCoreConfig.runBonus : 0) + this.bonusSpeed();
};

// Game_Player.prototype.distancePerFrame = function () {
//     return 0.0256 * this.realMoveSpeed();//Math.pow(2, this.realMoveSpeed()) / PlayerCoreConfig.speedRatio;
// };

// Game_Player.prototype.animationWait = function () {
//     return (9 - this.realMoveSpeed()) * PlayerCoreConfig.animationWaitMultiplier;
// };

var DSI_Sys1_EngineOverhaul_Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function () {
    if (this.isMoveDisable()) return false;
    return DSI_Sys1_EngineOverhaul_Game_Player_canMove.call(this);
};

Game_Player.prototype.setMoveStatus = function (v) {
    this._disableMove = !v;
}

Game_Player.prototype.isMoveDisable = function () {
    return !!this._disableMove;
}