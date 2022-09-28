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
    "UseToolEx": "toolEx",
    "Check": "check",
    "CheckEx": "checkEx",
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
/** @enum */
const NumKeys = {
    "N1": "num1",
    "N2": "num2",
    "N3": "num3",
    "N4": "num4",
    "N5": "num5",
    "N6": "num6",
    "N7": "num7",
    "N8": "num8",
    "N9": "num9",
    "N10": "num10",
    "N11": "num11",
    "N12": "num12",
}
/** @enum */
const DebugKeyAction = {
    "DebugMenu": "debugMenu"
}

const DefaultKeyboardConfig = {}
DefaultKeyboardConfig[FieldKeyAction.MoveUp] = 87;
DefaultKeyboardConfig[FieldKeyAction.MoveLeft] = 65;
DefaultKeyboardConfig[FieldKeyAction.MoveRight] = 68;
DefaultKeyboardConfig[FieldKeyAction.MoveDown] = 83;
DefaultKeyboardConfig[FieldKeyAction.UseTool] = 86;
DefaultKeyboardConfig[FieldKeyAction.UseToolEx] = 256; // Mouse 0
DefaultKeyboardConfig[FieldKeyAction.Check] = 67; 
DefaultKeyboardConfig[FieldKeyAction.CheckEx] = 258; // Mouse 1
DefaultKeyboardConfig[FieldKeyAction.Menu] = 27;
DefaultKeyboardConfig[FieldKeyAction.Cancel] = 27;
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

DefaultKeyboardConfig[DebugKeyAction.DebugMenu] = 192;
DefaultKeyboardConfig[NumKeys.N1] = 49;
DefaultKeyboardConfig[NumKeys.N2] = 50;
DefaultKeyboardConfig[NumKeys.N3] = 51;
DefaultKeyboardConfig[NumKeys.N4] = 52;
DefaultKeyboardConfig[NumKeys.N5] = 53;
DefaultKeyboardConfig[NumKeys.N6] = 54;
DefaultKeyboardConfig[NumKeys.N7] = 55;
DefaultKeyboardConfig[NumKeys.N8] = 56;
DefaultKeyboardConfig[NumKeys.N9] = 57;
DefaultKeyboardConfig[NumKeys.N10] = 48;
DefaultKeyboardConfig[NumKeys.N11] = 189;
DefaultKeyboardConfig[NumKeys.N12] = 187;

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
    // console.log(i, KeyCodeToNameConverter[DefaultKeyboardConfig[i]]);
}
for (var i in DefaultGamePadConfig) {
    // console.log(i, ButtonConverter[DefaultGamePadConfig[i]]);
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
/**
 * Check if player is triggering tool using input
 * @returns {number} 0 = None | 1 = Normal | 2 = Mouse
 */
Input.isTriggeredUsingTool = function() {
    const useToolNormal = Input.isTriggered(FieldKeyAction.UseTool);
    const useToolExtra = Input.isTriggered(FieldKeyAction.UseToolEx);
    if (useToolExtra) return 2;
    if (useToolNormal) return 1;
    return 0;
}
/**
 * Check if player is triggering check input
 * @returns {number} 0 = None | 1 = Normal | 2 = Mouse
 */
Input.isTriggeredCheck = function() {
    const checkNormal = Input.isTriggered(FieldKeyAction.Check);
    const checkExtra = Input.isTriggered(FieldKeyAction.CheckEx);
    if (checkExtra) return 2;
    if (checkNormal) return 1;
    return 0;
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

var DSI_Sys1_ControllerSystem_TouchInput__onMouseDown = TouchInput._onMouseDown;
TouchInput._onMouseDown = function(event) {
    Input.setState(256 + event.button, true);
	DSI_Sys1_ControllerSystem_TouchInput__onMouseDown.call(this, event);
};

var DSI_Sys1_ControllerSystem_TouchInput__onMouseUp = TouchInput._onMouseUp;
TouchInput._onMouseUp = function(event) {
    Input.setState(256 + event.button, false);
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