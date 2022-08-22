//=======================================================================
// * Plugin Name  : DSI_Sys1_PlayerCore.js
// * Last Updated : 8/22/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Player Core
 * @help 
 * Empty Help
 */

const PlayerCoreConfig = {
    offset: 2, // This is to prevent speed is too low at default.
    runBonus: 0.75,
    speedRatio: Math.pow(2, 10), // This should be power of 2. The bigger the slower the speed
    animationWaitMultiplier: 5, // The bigger the slower the animation is
    horseMoveSpeed: 7.25,
    normalInteractionRange: 0.5,
    npcInteractionRange: 1.35,
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

Game_CharacterBase.prototype.realMoveSpeed = function () {
    if (this.isRidingHorse()) {
        return this.horseMoveSpeed();
    }
    return PlayerCoreConfig.offset + this._moveSpeed + (this.isDashing() ? PlayerCoreConfig.runBonus : 0) + this.bonusSpeed();
};

Game_CharacterBase.prototype.distancePerFrame = function () {
    return Math.pow(2, this.realMoveSpeed()) / PlayerCoreConfig.speedRatio;
};

Game_CharacterBase.prototype.animationWait = function () {
    return (9 - this.realMoveSpeed()) * PlayerCoreConfig.animationWaitMultiplier;
};

var DSI_Sys1_EngineOverhaul_Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function () {
    if (this.isMoveDisable()) return false;
    return DSI_Sys1_EngineOverhaul_Game_Player_canMove.call(this);
};

Game_Player.prototype.setMoveStatus = function(v) {
    this._disableMove = !v;
}

Game_Player.prototype.isMoveDisable = function() {
    return !!this._disableMove;
}

// var DSI_Sys1_EngineOverhaul_Game_Player_isDashing = Game_Player.prototype.isDashing;
// Game_Player.prototype.isDashing = function () {
//     const result = DSI_Sys1_EngineOverhaul_Game_Player_isDashing.call(this);
//     return result || true;
// }

Game_Player.prototype.checkEventTriggerThere = function (triggers) {
    if (Input.getInputMode() === 'keyboard') return;
    if (this.canStartLocalEvents()) {
        // const cx = Math.round(this.x);
        // const cy = Math.round(this.y);
        // const x2 = $gameMap.roundXWithDirection(cx, this.direction());
        // const y2 = $gameMap.roundYWithDirection(cy, this.direction());
        const {x: x2, y: y2} = this.frontPosition();
        let events = $gameMap.events().filter((event) => {
            const dx = event.x - x2;
            const dy = event.y - y2;
            const dist = Math.sqrt(dx ** 2 + dy ** 2);
            event._tempDist = dist;
            const maxDist = event.isNPC() ? PlayerCoreConfig.npcInteractionRange : PlayerCoreConfig.normalInteractionRange;
            return dist <= maxDist;
        });
        events = events.sort((a, b) => a._tempDist - b._tempDist);
        if (events.length > 0) {
            const event = events.shift();
            this.turnTowardCharacter(event);
            this.startMapEvent(event.x, event.y, triggers, true);
        }
        // const direction = this.direction();
        // const x11 = Math.ceil(this.x);
        // const y11 = Math.ceil(this.y);
        // const x12 = Math.floor(this.x);
        // const y12 = Math.floor(this.y);
        // const x21 = $gameMap.roundXWithDirection(x11, direction);
        // const y21 = $gameMap.roundYWithDirection(y11, direction);
        // const x22 = $gameMap.roundXWithDirection(x12, direction);
        // const y22 = $gameMap.roundYWithDirection(y12, direction);
        // this.startMapEvent(x21, y21, triggers, true);
        // if (!$gameMap.isAnyEventStarting()) {
        //     this.startMapEvent(x22, y22, triggers, true);
        // }
        // if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x21, y21)) {
        //     const x3 = $gameMap.roundXWithDirection(x21, direction);
        //     const y3 = $gameMap.roundYWithDirection(y21, direction);
        //     this.startMapEvent(x3, y3, triggers, true);
        // }
        // if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x22, y22)) {
        //     const x3 = $gameMap.roundXWithDirection(x22, direction);
        //     const y3 = $gameMap.roundYWithDirection(y22, direction);
        //     this.startMapEvent(x3, y3, triggers, true);
        // }
    }
}