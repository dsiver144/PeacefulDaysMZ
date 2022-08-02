//=======================================================================
// * Plugin Name  : DSI_Sys2_RangeManager.js
// * Last Updated : 7/25/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Range Manager
 * @help 
 * Empty Help
 * 
 */

const RangeConfig = {
    rangeByLevel: [0, 3, 3, 6, 9],
    sideRangeByLevel: [0, 0, 1, 2, 3],
    aoeRangeByLevel: [0, 1, 2, 3, 4]
}

function RangeManager() {
    return new Error('This is a static class.');
}
/**
 * Get Tool Range
 * @param {number} level 
 * @param {Game_Character} character 
 * @returns {Vector2[]}
 */
RangeManager.getToolRangeTiles = function(level, character) {
    const direction = character.direction();
    const nearestFrontPoint = character.nearestFrontPoint();
    let cx = nearestFrontPoint.x; 
    let cy = nearestFrontPoint.y;
    /** @type {Vector2[]} */
    const tiles = [];
    let range = RangeConfig.rangeByLevel[level];
    let sideLimit = RangeConfig.sideRangeByLevel[level];
    for (var x = -range; x <= range; x++) {
        for (var y = -range; y <= range; y++) {
            if (x == 0 && y == 0) continue;
            if (this.isHorizontal(direction)) {
                const sideValid = sideLimit == 0 ? y == 0 : Math.abs(y) <= sideLimit;
                if (sideValid && this.isMetXCondition(direction, x)) tiles.push(new Vector2(cx + x, cy + y));
            } else {
                const sideValid = sideLimit == 0 ? x == 0 : Math.abs(x) <= sideLimit;
                if (sideValid && this.isMetYCondition(direction, y)) tiles.push(new Vector2(cx + x, cy + y));
            }
        }
    }
    return tiles;
}
/**
 * Get Tool AOE Range
 * @param {number} level 
 * @param {Game_Character} character 
 * @returns {Vector2[]}
 */
RangeManager.getToolAOERangeTiles = function(level, character) {
    const cx = Math.round(character._x);
    const cy = Math.round(character._y);
    /** @type {Vector2[]} */
    const tiles = [];
    let range = RangeConfig.aoeRangeByLevel[level];
    for (var x = -range; x <= range; x++) {
        for (var y = -range; y <= range; y++) {
            if (x == 0 && y == 0) continue;
            const isValue = Math.abs(x) + Math.abs(y) <= range;
            if (isValue) tiles.push(new Vector2(cx + x, cy + y));
        }
    }
    return tiles;
}

RangeManager.isHorizontal = function(direction) {
    return direction == 4 || direction == 6;
}

RangeManager.isMetXCondition = function(direction, x) {
    return direction == 4 ? x < 0 : x > 0;
}

RangeManager.isMetYCondition = function(direction, y) {
    return direction == 8 ? y < 0 : y > 0;
}