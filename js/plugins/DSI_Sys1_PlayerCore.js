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
    offset: 0, // This is to prevent speed is too low at default.
    runBonus: 2,
    speedRatio: Math.pow(2, 10), // This should be power of 2. The bigger the slower the speed
    animationWaitMultiplier: 3, // The bigger the slower the animation is
    horseMoveSpeed: 7,
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

Game_Player.prototype.distancePerFrame = function () {
    return 0.025 * this.realMoveSpeed();//Math.pow(2, this.realMoveSpeed()) / PlayerCoreConfig.speedRatio;
};

Game_Player.prototype.animationWait = function () {
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

Game_Player.prototype.triggerButtonAction = function() {
    if (Input.isTriggered(FieldKeyAction.Check)) {
        /** @type {Vector2[]} */
        let checkPositions = [];
        let mousePos = null;
        if (Input.getInputMode() === 'keyboard') {
            const px = Math.round(this._x);
            const py = Math.round(this._y);
            const x = $gameMap.canvasToMapX(TouchInput.x);
            const y = $gameMap.canvasToMapY(TouchInput.y);
            const dist = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
            if (dist > 1.5) {
                return false;
            }
            mousePos = new Vector2(x, y);
            checkPositions.push(mousePos);
        } else {
            const offsets = [[Math.floor(this._x), Math.floor(this._y)], [Math.ceil(this._x), Math.ceil(this._y)]];
            const d = this.direction();
            offsets.forEach(([ox, oy]) => {
                var dx = $gameMap.roundXWithDirection(ox, d);
                var dy = $gameMap.roundYWithDirection(oy, d);
                checkPositions.push(new Vector2(dx, dy));
            });
        }
        for (var i = 0; i < checkPositions.length; i++) {
            const v = checkPositions[i];
            const event = $gameMap.eventsXy(v.x, v.y)[0];
            if (event) {
                this.turnTowardCharacter(event);
                event.start();
            }
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
        }
        // Check interact with farm object.
        const checkPos = mousePos ? mousePos : this.frontPosition();
        if (this.checkInteractWithFarmObjects(checkPos.x, checkPos.y)) {
            return true;
        }
        if (this.checkInteractWithEventInACircle()) {
            return true;
        }
    }
    return false;
};

Game_Player.prototype.checkInteractWithEventInACircle = function() {
    let events = $gameMap.events().filter((event) => {
        const dx = event.x - this.x;
        const dy = event.y - this.y;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);
        event._tempDist = dist;
        const maxDist = event.isMoving() ? event.isNPC() ? PlayerCoreConfig.npcInteractionRange : PlayerCoreConfig.normalInteractionRange : 0.1;
        return dist <= maxDist;
    });
    events = events.sort((a, b) => a._tempDist - b._tempDist);
    if (events.length > 0) {
        const event = events.shift();
        this.turnTowardCharacter(event);
        event.start();
        return true;
    }
    return false;
};

Game_Player.prototype.checkInteractWithFarmObjects = function() {
    return false;
};