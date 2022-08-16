//=======================================================================
// * Plugin Name  : DSI_Sys3_Tools.js
// * Last Updated : 8/2/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Range Manager
 * @help 
 * Empty Help
 * 
 */

// =================================================================
// PEACEFUL DAYS ABSTRACT TOOLS
// =================================================================

class LineTool extends PD_Tool {
    /**
     * Use Tool
     * @param {Game_CharacterBase} user
     * @param {number} x X position when level 0
     * @param {number} y Y position when level 0
     * @param {number} powerCharged the power has been charged by user
     */
    onUse(user, x, y, powerCharged) {
        /** @type {Vector2[]} */
        let targetPos = this.targetPositions(user, x, y, powerCharged);
        targetPos.forEach(tile => {
            FarmManager.inst.useTool(this.getType(), tile.x, tile.y, window.toolEx);
        })
    }
    /**
     * Target Positions
     * @param {Game_CharacterBase} user 
     * @param {number} x 
     * @param {number} y 
     * @param {powerCharged} powerCharged 
     * @returns {Vector2[]}
     */
    targetPositions(user, x, y, powerCharged) {
        /** @type {Vector2[]} */
        let targetPos = [];
        if (this.level != 0) {
            targetPos = targetPos.concat(RangeManager.getToolRangeTiles(powerCharged, user));
        } else {
            targetPos.push(new Vector2(x, y));
        }
        return targetPos;
    }
}

class AoeTool extends PD_Tool {
    /**
     * Use Tool
     * @param {Game_CharacterBase} user
     * @param {number} x X position when level 0
     * @param {number} y Y position when level 0
     * @param {number} powerCharged the power has been charged by user
     */
    onUse(user, x, y, powerCharged) {
        /** @type {Vector2[]} */
        let targetPos = this.targetPositions(user, x, y, powerCharged);
        targetPos.forEach(tile => {
            FarmManager.inst.useTool(this.getType(), tile.x, tile.y, window.toolEx);
        })
    }
    /**
     * Target Positions
     * @param {Game_CharacterBase} user 
     * @param {number} x 
     * @param {number} y 
     * @param {powerCharged} powerCharged 
     * @returns {Vector2[]}
     */
     targetPositions(user, x, y, powerCharged) {
        /** @type {Vector2[]} */
        let targetPos = [];
        if (this.level != 0) {
            x = this.isAimAtCenter() ? Math.round(user._x) : x;
            y = this.isAimAtCenter() ? Math.round(user._y) : y;
            targetPos = targetPos.concat(RangeManager.getToolAOERangeTiles(powerCharged, x, y));
        } else {
            targetPos.push(new Vector2(x, y));
        }
        return targetPos;
    }
    /**
     * Check if this tool is aiming at center when being charged
     * @returns {boolean}
     */
    isAimAtCenter() {
        return false;
    }
}

// =================================================================
// PEACEFUL DAYS BASIC TOOLS
// =================================================================

class Hoe extends LineTool {
    /**
     * @inheritdoc
     */
    getType() {
        return ToolType.hoe;
    }
}

class SeedPack extends LineTool {
    /**
     * @inheritdoc
     */
    getType() {
        return ToolType.seedPack;
    }
}

class TreeSapling extends LineTool {
    /**
     * @inheritdoc
     */
     getType() {
        return ToolType.sapling;
    }
}

class WateringCan extends LineTool {
    /**
     * @inheritdoc
     */
    getType() {
        return ToolType.wateringCan;
    }
}

class Hammer extends AoeTool {
    /**
     * @inheritdoc
     */
    getType() {
        return ToolType.hammer;
    }
}

class Axe extends AoeTool {
    /**
     * @inheritdoc
     */
    getType() {
        return ToolType.axe;
    }
    /**
     * @inheritdoc
     */
    isAimAtCenter() {
        return true;
    }
}

class Sickle extends AoeTool {
    /**
     * @inheritdoc
     */
    getType() {
        return ToolType.sickle;
    }
    /**
     * @inheritdoc
     */
    isAimAtCenter() {
        return true;
    }
}