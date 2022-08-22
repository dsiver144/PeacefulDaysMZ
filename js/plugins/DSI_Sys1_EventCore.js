//=======================================================================
// * Plugin Name  : DSI_Sys1_EventCore.js
// * Last Updated : 8/22/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Event Core
 * @help 
 * Empty Help
 */

/**
 * Check if this event is an NPC
 * @returns {boolean}
 */
Game_Event.prototype.isNPC = function() {
    this._isNPC = this._isNPC != null ? this._isNPC : this.event().note.includes('NPC');
    return this._isNPC;
}

class Sprite_EventCharacter extends Sprite_Character {
    /**
     * Check if the position is inside character sprite.
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    isInRange(x, y) {
        const width = this.width || 32;
        const height = this.height || 32;
        if (x >= this.x - this.anchor.x * width && x <= this.x + width - this.anchor.x * width &&
            y >= this.y - this.anchor.y * height && y <= this.y + height - this.anchor.y * height) {
                return true;
            }
        return false;
    }
    /**
     * @returns {Game_Event}
     */
    get event() {
        return this._character;
    }
    /**
     * Update Other
     */
    updateOther() {
        super.updateOther();
        // this.updateTriggerEvent();
    }
    /**
     * Update trigger event by mouse
     * @returns {void}
     */
    updateTriggerEvent() {
        if (Input.getInputMode() === 'gamepad') return;
        if (Input.isTriggered(FieldKeyAction.Check)) {
        console.log(this.bitmap, this.event.eventId());
            if (this.isInRange(TouchInput.x, TouchInput.y)) {
                if (!$gamePlayer.canMove()) return;
                if ($gameMap.isAnyEventStarting()) return;
                if (!this.event.isNormalPriority()) return;
                const dist = Math.abs($gamePlayer.x - this.event.x) + Math.abs($gamePlayer.y - this.event.y);
                if (dist > 2) return;
                $gamePlayer.turnTowardCharacter(this.event);
                this.event.start();
            }
        }
    }   
}