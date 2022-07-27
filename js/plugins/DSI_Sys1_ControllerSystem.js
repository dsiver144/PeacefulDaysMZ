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
    "Menu": "menu",
    "Map": "map",
    "Run": "run",
    "SwitchItemLeft": "switchleft",
    "SwitchItemRight": "switchright",
    "Mission": "mission",
    "PageLeft": "pageup",
    "PageRight": "pagedown",
}

const DefaultKeyboardConfig = {}
DefaultKeyboardConfig[KeyAction.MoveUp] = 87;
DefaultKeyboardConfig[KeyAction.MoveLeft] = 65;
DefaultKeyboardConfig[KeyAction.MoveRight] = 68;
DefaultKeyboardConfig[KeyAction.MoveDown] = 83;
DefaultKeyboardConfig[KeyAction.UseTool] = "M0";
DefaultKeyboardConfig[KeyAction.Check] = "M2";
DefaultKeyboardConfig[KeyAction.Menu] = 27;
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
DefaultGamePadConfig[KeyAction.Menu] = 1;
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

Input.keyMapper = {};
Input.gamepadMapper = {};
for (var keyname in DefaultKeyboardConfig) {
    Input.keyMapper[DefaultKeyboardConfig[keyname]] = keyname;
}
for (var keyname in DefaultGamePadConfig) {
    Input.gamepadMapper[DefaultGamePadConfig[keyname]] = keyname;
}

console.log(Input.gamepadMapper);

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys1_PlayerController_Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(sceneActive) {
    if (sceneActive) {
        this.updateCustomInput();
    }
	DSI_Sys1_PlayerController_Game_Player_update.call(this, sceneActive);
};

Game_Player.prototype.updateCustomInput = function() {
    if (Input.isTriggered(KeyAction.UseTool)) {
        console.log("Use tool");
    }
};



// Overwrite default system

Window_Selectable.prototype.isOkTriggered = function() {
    return this._canRepeat ? Input.isRepeated(KeyAction.Check) : Input.isTriggered(KeyAction.Check);
};

Scene_Map.prototype.isMenuCalled = function() {
    return Input.isTriggered(KeyAction.Menu);
};

Game_Player.prototype.triggerButtonAction = function() {
    if (Input.isTriggered(KeyAction.Check)) {
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


var DSI_Sys1_ControllerSystem_TouchInput__onMouseDown = TouchInput._onMouseDown;
TouchInput._onMouseDown = function(event) {
    const buttonName = Input.keyMapper['M' + event.button];
    if (buttonName) {
        Input.setState(buttonName, true);
    }
	DSI_Sys1_ControllerSystem_TouchInput__onMouseDown.call(this, event);
};

var DSI_Sys1_ControllerSystem_TouchInput__onMouseUp = TouchInput._onMouseUp;
TouchInput._onMouseUp = function(event) {
    const buttonName = Input.keyMapper['M' + event.button];
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