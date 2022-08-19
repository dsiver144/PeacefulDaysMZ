
//=======================================================================
// * Plugin Name  : DSI-AutotileUtils.js
// * Last Updated : 8/19/2022
//========================================================================
/*:
* @author dsiver144
* @plugindesc (v1.1) An utility plugin for handling autotiling for Nhat Nguyen's plugins.
* @help 
* Handle autotiling calculating.
* 
*/
const RpgMakerTileIdSpecial = "0 = 46, 2 = 44, 8 = 45, 10 = 39, 11 = 38, 16 = 43, 18 = 41, 22 = 40, 24 = 33, 26 = 31, 27 = 30, 30 = 29, 31 = 28, 64 = 42, 66 = 32, 72 = 37, 74 = 27, 75 = 25, 80 = 35, 82 = 19, 86 = 18, 88 = 23, 90 = 15, 91 = 14, 94 = 13, 95 = 12, 104 = 36, 106 = 26, 107 = 24, 120 = 21, 122 = 7, 123 = 6, 126 = 5, 127 = 4, 208 = 34, 210 = 17, 214 = 16, 216 = 22, 218 = 11, 219 = 10, 222 = 9, 223 = 8, 248 = 20, 250 = 3, 251 = 2, 254 = 1, 255 = 0"
const EightDirections = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
var BitmaskToTileIDTable = {}
RpgMakerTileIdSpecial.split(",").forEach((str) => {
    const [mask, tileId] = str.split("=").map(n => Number(n));
    BitmaskToTileIDTable[mask] = tileId;
});

const Autotile47TileTable =
[
	"empty", "empty", "empty", "empty", "A3", "B3", "C3", "D3", "A1", "B3", "C3", "D3", "A3", "B1", "C3", "D3", "A1", "B1", "C3", "D3", "A3", "B3", "C3", "D1", "A1", "B3", "C3", "D1", "A3", "B1", "C3", "D1", "A1", "B1", "C3", "D1", "A3", "B3", "C1", "D3", "A1", "B3", "C1", "D3", "A3", "B1", "C1", "D3", "A1", "B1", "C1", "D3", "A3", "B3", "C1", "D1", "A1", "B3", "C1", "D1", "A3", "B1", "C1", "D1", "A1", "B1", "C1", "D1", "A5", "B3", "C5", "D3", "A5", "B1", "C5", "D3", "A5", "B3", "C5", "D1", "A5", "B1", "C5", "D1", "A4", "B4", "C3", "D3", "A4", "B4", "C3", "D1", "A4", "B4", "C1", "D3", "A4", "B4", "C1", "D1", "A3", "B5", "C3", "D5", "A3", "B5", "C1", "D5", "A1", "B5", "C3", "D5", "A1", "B5", "C1", "D5", "A3", "B3", "C4", "D4", "A1", "B3", "C4", "D4", "A3", "B1", "C4", "D4", "A1", "B1", "C4", "D4", "A5", "B5", "C5", "D5", "A4", "B4", "C4", "D4", "A2", "B4", "C5", "D3", "A2", "B4", "C5", "D1", "A4", "B2", "C3", "D5", "A4", "B2", "C1", "D5", "A3", "B5", "C4", "D2", "A1", "B5", "C4", "D2", "A5", "B3", "C2", "D4", "A5", "B1", "C2", "D4", "A2", "B2", "C5", "D5", "A2", "B4", "C2", "D4", "A5", "B5", "C2", "D2", "A4", "B2", "C4", "D2", "A2", "B2", "C2", "D2"
]

const SubTileTable = 
{
	"A1": 2,
	"B1": 3,
	"C1": 6,
	"D1": 7,
	"A2": 8,
	"B4": 9,
	"A4": 10,
	"B2": 11,
	"C5": 12,
	"D3": 13,
	"C3": 14,
	"D5": 15,
	"A5": 16,
	"B3": 17,
	"A3": 18,
	"B5": 19,
	"C2": 20,
	"D4": 21,
	"C4": 22,
	"D2": 23
}

function AutotileUtils() {
    return new Error("Cant init static class");
}

AutotileUtils.autoTileTable = BitmaskToTileIDTable;
AutotileUtils.allSegments = [
    [13, 14, 17, 18],
    [2, 14, 17, 18],
    [13, 3, 17, 18],
    [2, 3, 17, 18],
    [13, 14, 17, 7],
    [2, 14, 17, 7],
    [13, 3, 13, 7],
    [2, 3, 17, 7],

    [13, 14, 6, 18],
    [2, 14, 6, 18],
    [13, 3, 6, 18],
    [2, 3, 6, 18],
    [13, 14, 6, 7],
    [2, 14, 6, 7],
    [13, 3, 6, 7],
    [2, 3, 6, 7],

    [12, 14, 16, 18],
    [12, 3, 16, 18],
    [12, 14, 16, 7],
    [12, 3, 16, 7],
    [9, 10, 17, 18],
    [9, 10, 17, 7],
    [9, 10, 6, 18],
    [9, 10, 6, 7],

    [13, 15, 17, 19],
    [13, 15, 6, 19],
    [2, 15, 17, 19],
    [2, 15, 6, 19],
    [13, 14, 21, 22],
    [2, 14, 21, 22],
    [13, 3, 21, 22],
    [2, 3, 21, 22],

    [12, 15, 16, 19],
    [9, 10, 21, 22],
    [8, 9, 12, 18],
    [8, 9, 12, 7],
    [10, 11, 17, 15],
    [10, 11, 6, 15],
    [13, 19, 22, 23],
    [2, 19, 22, 23],

    [16, 14, 20, 21],
    [16, 3, 20, 21],
    [8, 11, 12, 15],
    [8, 9, 20, 21],
    [16, 19, 20, 23],
    [10, 11, 22, 23],
    [8, 11, 20, 23],
    [8, 11, 20, 23],
];
/**
 * Get Refined Autotile Index From Bitmask Number
 * @param {Number} bitmask 
 * @returns {Number}
 */
AutotileUtils.calcAutoTileIndex = function (bitmask) {
    // ========================
    // BR B BL R L TR T TL
    // 7  6 5  4 3 2  1 0
    // ========================
    const top = (bitmask & (2 ** 1)) > 0
    const left = (bitmask & (2 ** 3)) > 0
    const right = (bitmask & (2 ** 4)) > 0
    const bottom = (bitmask & (2 ** 6)) > 0
    const topLeft = (top && left && bitmask & (2 ** 0)) > 0
    const topRight = (top && right && bitmask & (2 ** 2)) > 0
    const bottomLeft = (bottom && left && bitmask & (2 ** 5)) > 0
    const bottomRight = (bottom && right && bitmask & (2 ** 7)) > 0
    const refinedBitmask = topLeft * (2 ** 0) + top * (2 ** 1) + topRight * (2 ** 2) + left * (2 ** 3) + right * (2 ** 4) + bottomLeft * (2 ** 5) + bottom * (2 ** 6) + bottomRight * (2 ** 7);
    return BitmaskToTileIDTable[refinedBitmask];
}
/**
 * Calculate autotile index using 8 direction check
 * @param {(pos: Vector2) => boolean} callback 
 * @returns 
 */
AutotileUtils.calcIndexBy8Direction = function(callback) {
    let bitmask = 0;
    EightDirections.forEach((offset, index) => {
        const value = callback(new Vector2(...offset)) ? 1 : 0;
        bitmask += value * (2 ** index);
    });
    return AutotileUtils.calcAutoTileIndex(bitmask);
}
AutotileUtils.getSubTileRect = function(tileID, tileSize) {
    let value = SubTileTable[tileID];
    console.log({tileID}, value);

    let subtileSize = tileSize / 2;
    return new Rectangle((value % 4) * subtileSize, Math.floor(value / 4) * subtileSize, subtileSize, subtileSize);
}
/**
 * Copy Correct Part Of Autotile Bitmap To Destinate Bitmap By `autoTileId`
 * @param {Bitmap} source 
 * @param {Bitmap} bitmap 
 * @param {Number} autoTileId 
 */ 
AutotileUtils.makeSegmentTile = function (source, bitmap, autoTileId) {
    const tileSize = 32;
    var x = 0;
    var y = 0;
    for (var i = 0; i < 4; i++) {
        const rect = this.getSubTileRect(Autotile47TileTable[autoTileId * 4 + i], tileSize);
        var dx = x + (i % 2) * tileSize / 2;
        var dy = y + Math.floor(i / 2) * tileSize / 2;
        bitmap.blt(source, rect.x, rect.y, rect.width, rect.height, dx, dy);
    }
    // var segments = AutotileUtils.allSegments[autoTileId];
    // var x = 0; y = 0;
    // for (var i = 0; i < segments.length; i++) {
    //     var dx = x + (i % 2) * tileWidth / 2;
    //     var dy = y + Math.floor(i / 2) * tileWidth / 2;
    //     var index = segments[i];
    //     var sx = (index % 4) * tileWidth / 2;
    //     var sy = Math.floor(index / 4) * tileWidth / 2;
    //     bitmap.blt(source, sx, sy, tileWidth / 2, tileHeight / 2, dx, dy);
    // }
};