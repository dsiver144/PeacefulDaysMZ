//=======================================================================
// * Plugin Name  : DSI_Sys2_Interfaces.js
// * Last Updated : 7/25/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Interfaces
 * @help 
 * Empty Help
 * 
 */
/** @enum */
const ToolType = {
    "seedPack": "seedPack",
    "sapling": "sapling",
    "wateringCan": "wateringCan",
    "hoe": "hoe",
    "hammer": "hammer",
    "axe": "axe",
    "sickle": "sickle",
    "fishingRod": "fishingRod",
    "milker": "milker",
    "brush": "brush",
    "shears": "shears",
    "harvestGloves": "harvestGloves",
    "none": "none",
}

const GameEvent = {
    "InputModeChanged": "InputModeChanged"
}

const YellowLightColor = [255, 218, 69];

const KeyCodeToNameConverter = {
    9: '@K9',
    13: 'ENT',
    16: 'SHIFT',
    17: 'CTRL',
    18: 'ALT',
    19: 'PSE',
    27: 'ESC',
    32: '@K32',
    33: 'PGUP',
    34: 'PGDN',
    35: 'END',
    36: 'HOME',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    44: 'PRSCR',
    45: 'INS',
    46: 'DEL',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    58: ',',
    59: ';',
    61: '=',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    91: 'OS',
    96: 'N.0',
    97: 'N.1',
    98: 'N.2',
    99: 'N.3',
    100: 'N.4',
    101: 'N.5',
    102: 'N.6',
    103: 'N.7',
    104: 'N.8',
    105: 'N.9',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    220: '\\',
    222: '\'',
    256: '@M0',
    257: '@M1',
    258: '@M2',
}

const ButtonConverter = {
    0: ["A", "#4bf542"],
    1: ["B", "#f56342"],
    2: ["X", "#429cf5"],
    3: ["Y", "#f5c542"],
    4: "LB",
    5: "RB",
    6: "LT",
    7: "RT",
    8: "BACK",
    9: "START",
    10: "LSB",
    11: "RSB",
    12: "UP",
    13: "DOWN",
    14: "LEFT",
    15: "RIGHT",
}