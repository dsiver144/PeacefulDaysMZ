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
/** @enum */
const FieldKeyAction = {
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
    "SwitchItemRowUp": "switch_item_row_up",
    "SwitchItemRowDown": "switch_item_row_down",
    "Mission": "mission",
    "None": "none"
}
/** @enum */
const MenuKeyAction = {
    "MoveUp": "menu_up",
    "MoveLeft": "menu_left",
    "MoveRight": "menu_right",
    "MoveDown": "menu_down",
    "Confirm": "menu_confirm",
    "Cancel": "menu_cancel",
    "PageLeft": "menu_pageleft",
    "PageRight": "menu_pageright",
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
DefaultKeyboardConfig[FieldKeyAction.MoveUp] = 87;
DefaultKeyboardConfig[FieldKeyAction.MoveLeft] = 65;
DefaultKeyboardConfig[FieldKeyAction.MoveRight] = 68;
DefaultKeyboardConfig[FieldKeyAction.MoveDown] = 83;
DefaultKeyboardConfig[FieldKeyAction.UseTool] = 256; // Mouse 0
DefaultKeyboardConfig[FieldKeyAction.Check] = 258; // Mouse 1
DefaultKeyboardConfig[FieldKeyAction.Menu] = 27;
// DefaultKeyboardConfig[KeyAction.Cancel] = 27;
DefaultKeyboardConfig[FieldKeyAction.Map] = 77;
DefaultKeyboardConfig[FieldKeyAction.Run] = 16;
DefaultKeyboardConfig[FieldKeyAction.Mission] = 70;
DefaultKeyboardConfig[FieldKeyAction.SwitchItemLeft] = 90;
DefaultKeyboardConfig[FieldKeyAction.SwitchItemRight] = 88;
DefaultKeyboardConfig[FieldKeyAction.PageLeft] = 81;
DefaultKeyboardConfig[FieldKeyAction.PageRight] = 69;

DefaultKeyboardConfig[MenuKeyAction.Confirm] = 32;
DefaultKeyboardConfig[MenuKeyAction.Cancel] = 27;
DefaultKeyboardConfig[MenuKeyAction.PageLeft] = 81;
DefaultKeyboardConfig[MenuKeyAction.PageRight] = 69;
DefaultKeyboardConfig[MenuKeyAction.MoveUp] = 87;
DefaultKeyboardConfig[MenuKeyAction.MoveLeft] = 65;
DefaultKeyboardConfig[MenuKeyAction.MoveRight] = 68;
DefaultKeyboardConfig[MenuKeyAction.MoveDown] = 83;

const DefaultGamePadConfig = {}
DefaultGamePadConfig[FieldKeyAction.UseTool] = 2;
DefaultGamePadConfig[FieldKeyAction.Check] = 0;
DefaultGamePadConfig[FieldKeyAction.Menu] = 9;
DefaultGamePadConfig[FieldKeyAction.Cancel] = 1;
DefaultGamePadConfig[FieldKeyAction.Mission] = 8;
DefaultGamePadConfig[FieldKeyAction.Map] = 3;
DefaultGamePadConfig[FieldKeyAction.SwitchItemLeft] = 4;
DefaultGamePadConfig[FieldKeyAction.SwitchItemRight] = 5;
DefaultGamePadConfig[FieldKeyAction.PageLeft] = 6;
DefaultGamePadConfig[FieldKeyAction.PageRight] = 7;
DefaultGamePadConfig[FieldKeyAction.MoveUp] = 12;
DefaultGamePadConfig[FieldKeyAction.MoveDown] = 13;
DefaultGamePadConfig[FieldKeyAction.MoveLeft] = 14;
DefaultGamePadConfig[FieldKeyAction.MoveRight] = 15;

DefaultGamePadConfig[MenuKeyAction.Confirm] = 0;
DefaultGamePadConfig[MenuKeyAction.Cancel] = 1;
DefaultGamePadConfig[MenuKeyAction.PageLeft] = 6;
DefaultGamePadConfig[MenuKeyAction.PageRight] = 7;
DefaultGamePadConfig[MenuKeyAction.MoveUp] = 12;
DefaultGamePadConfig[MenuKeyAction.MoveDown] = 13;
DefaultGamePadConfig[MenuKeyAction.MoveLeft] = 14;
DefaultGamePadConfig[MenuKeyAction.MoveRight] = 15;

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
    Input.keyMapper[keyname] = DefaultKeyboardConfig[keyname];
}

for (var keyname in DefaultGamePadConfig) {
    Input.gamepadMapper[keyname] = DefaultGamePadConfig[keyname];
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
    const shift = Input.isPressed(FieldKeyAction.Run) || Input.isPressed(FieldKeyAction.Cancel);
    if (ConfigManager.alwaysDash) {
        return !shift;
    } else {
        return shift;
    }
};

Window_Selectable.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated(MenuKeyAction.MoveDown)) {
            this.cursorDown(Input.isTriggered(MenuKeyAction.MoveDown));
        }
        if (Input.isRepeated(MenuKeyAction.MoveUp)) {
            this.cursorUp(Input.isTriggered(MenuKeyAction.MoveUp));
        }
        if (Input.isRepeated(MenuKeyAction.MoveRight)) {
            this.cursorRight(Input.isTriggered(MenuKeyAction.MoveRight));
        }
        if (Input.isRepeated(MenuKeyAction.MoveLeft)) {
            this.cursorLeft(Input.isTriggered(MenuKeyAction.MoveLeft));
        }
        if (!this.isHandled(MenuKeyAction.PageLeft) && Input.isTriggered(MenuKeyAction.PageLeft)) {
            this.cursorPagedown();
        }
        if (!this.isHandled(MenuKeyAction.PageRight) && Input.isTriggered(MenuKeyAction.PageRight)) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

Window_Selectable.prototype.processHandling = function() {
    if (this.isOpenAndActive()) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            return this.processOk();
        }
        if (this.isCancelEnabled() && this.isCancelTriggered()) {
            return this.processCancel();
        }
        if (this.isHandled(MenuKeyAction.PageLeft) && Input.isTriggered(MenuKeyAction.PageLeft)) {
            return this.processPagedown();
        }
        if (this.isHandled(MenuKeyAction.PageRight) && Input.isTriggered(MenuKeyAction.PageRight)) {
            return this.processPageup();
        }
    }
};

Window_Selectable.prototype.isOkTriggered = function() {
    const key = MenuKeyAction.Confirm;
    return this._canRepeat ? Input.isRepeated(key) : Input.isTriggered(key);
};

Window_Selectable.prototype.isCancelTriggered = function() {
    return Input.isRepeated(FieldKeyAction.Menu) || Input.isRepeated(MenuKeyAction.Cancel);
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
    return Input.isTriggered(FieldKeyAction.Menu);
};

Game_Player.prototype.triggerButtonAction = function() {
    if (Input.isTriggered(FieldKeyAction.Check)) {
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
    const buttonNames = Input.keyMapper[256 + event.button];
    if (buttonNames) {
        buttonNames.forEach(button => {
            Input.setState(button, true);
        })
    }
	DSI_Sys1_ControllerSystem_TouchInput__onMouseDown.call(this, event);
};

var DSI_Sys1_ControllerSystem_TouchInput__onMouseUp = TouchInput._onMouseUp;
TouchInput._onMouseUp = function(event) {
    const buttonNames = Input.keyMapper[256 + event.button];
    if (buttonNames) {
        buttonNames.forEach(button => {
            Input.setState(button, false);
        })
    }
	DSI_Sys1_ControllerSystem_TouchInput__onMouseUp.call(this, event);
};

Input._signX = function() {
    const left = this.isPressed(FieldKeyAction.MoveLeft) ? 1 : 0;
    const right = this.isPressed(FieldKeyAction.MoveRight) ? 1 : 0;
    return right - left;
};

Input._signY = function() {
    const up = this.isPressed(FieldKeyAction.MoveUp) ? 1 : 0;
    const down = this.isPressed(FieldKeyAction.MoveDown) ? 1 : 0;
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
