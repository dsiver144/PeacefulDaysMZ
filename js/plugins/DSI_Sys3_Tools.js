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
     use(user, x, y, powerCharged) {
        /** @type {Vector2[]} */
        let targetPos = [];
        if (this.level != 0) {
            targetPos = targetPos.concat(RangeManager.getToolRangeTiles(this.level, user));
        } else {
            targetPos.push(new Vector2(x, y));
        }
        targetPos.forEach(tile => {
            FarmManager.inst.useTool(this.getType(), tile.x, tile.y, window.toolEx);
        })
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
     use(user, x, y, powerCharged) {
        /** @type {Vector2[]} */
        let targetPos = [];
        if (this.level != 0) {
            targetPos = targetPos.concat(RangeManager.getToolAOERangeTiles(this.level, user));
        } else {
            targetPos.push(new Vector2(x, y));
        }
        targetPos.forEach(tile => {
            FarmManager.inst.useTool(this.getType(), tile.x, tile.y, window.toolEx);
        })
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
}

class Sickle extends AoeTool {
    /**
     * @inheritdoc
     */
    getType() {
        return ToolType.sickle;
    }
}