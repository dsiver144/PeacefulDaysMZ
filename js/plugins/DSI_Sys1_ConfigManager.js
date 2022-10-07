//=======================================================================
// * Plugin Name  : DSI_Sys1_ConfigManager.js
// * Last Updated : 10/5/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Config Manager
 * @help 
 * Empty Help
 */

ConfigManager.clockMode = 0;
ConfigManager.clockPosition = 0;
ConfigManager.keyMapper = {};
ConfigManager.gamepadMapper = {};
ConfigManager.dashMode = 2;

var DSI_Sys1_ConfigManager_ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
	const config = DSI_Sys1_ConfigManager_ConfigManager_makeData.call(this);
    config['clockMode'] = this.clockMode;
    config['clockPosition'] = this.clockPosition;
    config['keyMapper'] = this.keyMapper;
    config['gamepadMapper'] = this.gamepadMapper;
    config['dashMode'] = this.dashMode;
    return config;
};

var DSI_Sys1_ConfigManager_ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
	DSI_Sys1_ConfigManager_ConfigManager_applyData.call(this, config);
    this.clockMode = this.readData(config, "clockMode", 0);
    this.clockPosition = this.readData(config, "clockPosition", 0);
    this.keyMapper = this.readData(config, "keyMapper", {});
    this.gamepadMapper = this.readData(config, "gamepadMapper", {});
    this.dashMode = this.readData(config, "dashMode", 2);
    Input.applyKeybindings();
};

Object.defineProperty(Graphics, "isFullscreen", {
    get: function() {
        return Graphics._isFullScreen() ? 1 : 0;
    },
    set: function(value) {
        if (value == 1) {
            Graphics._requestFullScreen();
        } else {
            Graphics._cancelFullScreen();
        }
    },
    configurable: true
});

Object.defineProperty(ConfigManager, "alwaysDashEx", {
    get: function() {
        return ConfigManager.alwaysDash ? 1 : 0;
    },
    set: function(value) {
        if (value == 1) {
            ConfigManager.alwaysDash = true;
        } else {
            ConfigManager.alwaysDash = false;
        }
    },
    configurable: true
});

ConfigManager.readData = function(config, name, defaultValue = 0) {
    if (name in config) {
        return config[name];
    } else {
        return defaultValue;
    }
};

var DSI_Sys1_Bitmap_Graphics__isFullScreen = Graphics._isFullScreen;
Graphics._isFullScreen = function () {
    if (Utils.isNwjs()) {
        const win = nw.Window.get();
        return win.isFullscreen;
    } else {
        return DSI_Sys1_Bitmap_Graphics__isFullScreen.call(this);
    }
};
var DSI_Sys1_Bitmap_Graphics__requestFullScreen = Graphics._requestFullScreen;
Graphics._requestFullScreen = function () {
    if (Graphics._isFullScreen()) return;
    if (Utils.isNwjs()) {
        const win = nw.Window.get();
        win.enterFullscreen();
    } else {
        DSI_Sys1_Bitmap_Graphics__requestFullScreen.call(this);
    }
};
var DSI_Sys1_Bitmap_Graphics__cancelFullScreen = Graphics._cancelFullScreen;
Graphics._cancelFullScreen = function () {
    DSI_Sys1_Bitmap_Graphics__cancelFullScreen.call(this);
    if (Utils.isNwjs()) {
        const win = nw.Window.get();
        win.leaveFullscreen();
    } else {
        DSI_Sys1_Bitmap_Graphics__cancelFullScreen.call(this);
    }
};

