//=======================================================================
// * Plugin Name  : DSI_Sys1_ControllerSystem.js
// * Last Updated : 7/27/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Player Controller
 * @help 
 * Empty Help
 */
/**
 * @enum
 */
const KeyAction = {
    "MoveUp": "up",
    "MoveLeft": "left",
    "MoveRight": "right",
    "MoveDown": "down",
    "UseTool": "tool",
    "Check": "check",
    "Cancel": "cancel",
    "Menu": "menu",
    "Map": "map",
    "Run": "run",
    "SwitchItemLeft": "switchleft",
    "SwitchItemRight": "switchright",
    "Mission": "mission",
    "PageLeft": "pageup",
    "PageRight": "pagedown",
    "None": "none"
}

const KeyCodeToNameConverter = {
    9: 'TAB',
    13: 'ENT',
    16: 'SHF',
    17: 'CTR',
    18: 'ALT',
    19: 'PSE',
    27: 'ESC',
    32: 'SPACE',
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
    256: 'L.Clk',
    257: 'M.Clk',
    258: 'R.Clk',
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

const DefaultKeyboardConfig = {}
DefaultKeyboardConfig[KeyAction.MoveUp] = 87;
DefaultKeyboardConfig[KeyAction.MoveLeft] = 65;
DefaultKeyboardConfig[KeyAction.MoveRight] = 68;
DefaultKeyboardConfig[KeyAction.MoveDown] = 83;
DefaultKeyboardConfig[KeyAction.UseTool] = 256; // Mouse 0
DefaultKeyboardConfig[KeyAction.Check] = 258; // Mouse 1
DefaultKeyboardConfig[KeyAction.Menu] = 27;
// DefaultKeyboardConfig[KeyAction.Cancel] = 27;
DefaultKeyboardConfig[KeyAction.Map] = 77;
DefaultKeyboardConfig[KeyAction.Run] = 16;
DefaultKeyboardConfig[KeyAction.Mission] = 70;
DefaultKeyboardConfig[KeyAction.SwitchItemLeft] = 90;
DefaultKeyboardConfig[KeyAction.SwitchItemRight] = 88;
DefaultKeyboardConfig[KeyAction.PageLeft] = 81;
DefaultKeyboardConfig[KeyAction.PageRight] = 69;

const DefaultGamePadConfig = {}
DefaultGamePadConfig[KeyAction.UseTool] = 2;
DefaultGamePadConfig[KeyAction.Check] = 0;
DefaultGamePadConfig[KeyAction.Menu] = 9;
DefaultGamePadConfig[KeyAction.Cancel] = 1;
DefaultGamePadConfig[KeyAction.Mission] = 8;
DefaultGamePadConfig[KeyAction.Map] = 3;
DefaultGamePadConfig[KeyAction.SwitchItemLeft] = 4;
DefaultGamePadConfig[KeyAction.SwitchItemRight] = 5;
DefaultGamePadConfig[KeyAction.PageLeft] = 6;
DefaultGamePadConfig[KeyAction.PageRight] = 7;
DefaultGamePadConfig[KeyAction.MoveUp] = 12;
DefaultGamePadConfig[KeyAction.MoveDown] = 13;
DefaultGamePadConfig[KeyAction.MoveLeft] = 14;
DefaultGamePadConfig[KeyAction.MoveRight] = 15;

for (var i in DefaultKeyboardConfig) {
    console.log(i, KeyCodeToNameConverter[DefaultKeyboardConfig[i]]);
}
for (var i in DefaultGamePadConfig) {
    console.log(i, ButtonConverter[DefaultGamePadConfig[i]]);
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

Input.keyMapper = {};
Input.gamepadMapper = {};
for (var keyname in DefaultKeyboardConfig) {
    Input.keyMapper[DefaultKeyboardConfig[keyname]] = Input.keyMapper[DefaultKeyboardConfig[keyname]] || [];
    Input.keyMapper[DefaultKeyboardConfig[keyname]].push(keyname);
}

for (var keyname in DefaultGamePadConfig) {
    Input.gamepadMapper[DefaultGamePadConfig[keyname]] = keyname;
}

var DSI_Sys1_PlayerController_Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(sceneActive) {
    if (sceneActive) {
        this.updateCustomInput();
    }
	DSI_Sys1_PlayerController_Game_Player_update.call(this, sceneActive);
};

Game_Player.prototype.updateCustomInput = function() {
    this.updateUseToolInput();
};

//==================================================================================
// Overwrite default system
//==================================================================================
Game_Player.prototype.isDashButtonPressed = function() {
    const shift = Input.isPressed(KeyAction.Run) || Input.isPressed(KeyAction.Cancel);
    if (ConfigManager.alwaysDash) {
        return !shift;
    } else {
        return shift;
    }
};

Window_Selectable.prototype.isOkTriggered = function() {
    const key = Input.getInputMode() == "keyboard" ? KeyAction.None : KeyAction.Check;
    return this._canRepeat ? Input.isRepeated(key) : Input.isTriggered(key);
};

Window_Selectable.prototype.isCancelTriggered = function() {
    return Input.isRepeated(KeyAction.Menu) || Input.isRepeated(KeyAction.Cancel);
};

// This handle touch on RPG Windows
Window_Selectable.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
        if (this.isHoverEnabled() && TouchInput.isHovered()) {
            this.onTouchSelect(false);
        } else if (TouchInput.isTriggered()) {
            this.onTouchSelect(true);
        }
        if (TouchInput.isClicked()) {
            this.onTouchOk();
        }
    }
};

Scene_MenuBase.prototype.createButtons = function() {}

Scene_Map.prototype.isMenuCalled = function() {
    return Input.isTriggered(KeyAction.Menu);
};

Game_Player.prototype.triggerButtonAction = function() {
    if (Input.isTriggered(KeyAction.Check)) {
        if (this.checkInteractWithFarmObjects()) {
            return true;
        }
        if (this.getOnOffVehicle()) {
            return true;
        }
        this.checkEventTriggerHere([0]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
        this.checkEventTriggerThere([0, 1, 2]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
    }
    return false;
};

Game_Player.prototype.checkInteractWithFarmObjects = function() {
    return false;
}

var DSI_Sys1_ControllerSystem_TouchInput__onMouseDown = TouchInput._onMouseDown;
TouchInput._onMouseDown = function(event) {
    const buttonName = Input.keyMapper[256 + event.button];
    if (buttonName) {
        Input.setState(buttonName, true);
    }
	DSI_Sys1_ControllerSystem_TouchInput__onMouseDown.call(this, event);
};

var DSI_Sys1_ControllerSystem_TouchInput__onMouseUp = TouchInput._onMouseUp;
TouchInput._onMouseUp = function(event) {
    const buttonName = Input.keyMapper[256 + event.button];
    if (buttonName) {
        Input.setState(buttonName, false);
    }
	DSI_Sys1_ControllerSystem_TouchInput__onMouseUp.call(this, event);
};

Input._signX = function() {
    const left = this.isPressed(KeyAction.MoveLeft) ? 1 : 0;
    const right = this.isPressed(KeyAction.MoveRight) ? 1 : 0;
    return right - left;
};

Input._signY = function() {
    const up = this.isPressed(KeyAction.MoveUp) ? 1 : 0;
    const down = this.isPressed(KeyAction.MoveDown) ? 1 : 0;
    return down - up;
};


Input.setState = function(name, value) {
    this._currentState[name] = value;
};

// Disable touch input movement
Game_Temp.prototype.isDestinationValid = function() {
    return false;
};

// /**
//  * Checks whether the mouse button or touchscreen has been pressed and
//  * released at the same position.
//  *
//  * @returns {boolean} True if the mouse button or touchscreen is clicked.
//  */
//  TouchInput.isClicked = function() {
//     return false;
// };

// /**
//  * Checks whether the mouse button or touchscreen is currently pressed down.
//  *
//  * @returns {boolean} True if the mouse button or touchscreen is pressed.
//  */
// TouchInput.isPressed = function() {
//     return false;
// };

// /**
//  * Checks whether the left mouse button or touchscreen is just pressed.
//  *
//  * @returns {boolean} True if the mouse button or touchscreen is triggered.
//  */
// TouchInput.isTriggered = function() {
//     return false;
// };

// /**
//  * Checks whether the left mouse button or touchscreen is just pressed
//  * or a pseudo key repeat occurred.
//  *
//  * @returns {boolean} True if the mouse button or touchscreen is repeated.
//  */
// TouchInput.isRepeated = function() {
//     return false;
// };

// /**
//  * Checks whether the left mouse button or touchscreen is kept depressed.
//  *
//  * @returns {boolean} True if the left mouse button or touchscreen is long-pressed.
//  */
// TouchInput.isLongPressed = function() {
//     return false;
// };

// /**
//  * Checks whether the right mouse button is just pressed.
//  *
//  * @returns {boolean} True if the right mouse button is just pressed.
//  */
// TouchInput.isCancelled = function() {
//     return false;
// };

// /**
//  * Checks whether the mouse or a finger on the touchscreen is moved.
//  *
//  * @returns {boolean} True if the mouse or a finger on the touchscreen is moved.
//  */
// TouchInput.isMoved = function() {
//     return false;
// };

// /**
//  * Checks whether the mouse is moved without pressing a button.
//  *
//  * @returns {boolean} True if the mouse is hovered.
//  */
// TouchInput.isHovered = function() {
//     return false;
// };

// /**
//  * Checks whether the left mouse button or touchscreen is released.
//  *
//  * @returns {boolean} True if the mouse button or touchscreen is released.
//  */
// TouchInput.isReleased = function() {
//     return false;
// };
