//=======================================================================
// * Plugin Name  : DSI_Sys1_EngineOverhaul.js
// * Last Updated : 8/9/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) RPG Maker Engine Overhaul
 * @help 
 * Empty Help
 */

const SpeedConfig = {
    offset: 2, // This is to prevent speed is too low at default.
    runBonus: 0.75,
    speedRatio: Math.pow(2, 10), // This should be power of 2. The bigger the slower the speed
    animationWaitMultiplier: 5, // The bigger the slower the animation is
    horseMoveSpeed: 7.25
}

Game_CharacterBase.prototype.horseMoveSpeed = function () {
    return SpeedConfig.horseMoveSpeed;
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

Game_CharacterBase.prototype.realMoveSpeed = function () {
    if (this.isRidingHorse()) {
        return this.horseMoveSpeed();
    }
    return SpeedConfig.offset + this._moveSpeed + (this.isDashing() ? SpeedConfig.runBonus : 0) + this.bonusSpeed();
};

Game_CharacterBase.prototype.distancePerFrame = function () {
    return Math.pow(2, this.realMoveSpeed()) / SpeedConfig.speedRatio;
};

Game_CharacterBase.prototype.animationWait = function () {
    return (9 - this.realMoveSpeed()) * SpeedConfig.animationWaitMultiplier;
};

// var DSI_Sys1_EngineOverhaul_Game_Player_isDashing = Game_Player.prototype.isDashing;
// Game_Player.prototype.isDashing = function () {
//     const result = DSI_Sys1_EngineOverhaul_Game_Player_isDashing.call(this);
//     return result || true;
// }
