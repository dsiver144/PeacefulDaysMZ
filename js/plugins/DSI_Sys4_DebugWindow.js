//=======================================================================
// * Plugin Name  : DSI_Sys4_DebugWindow.js
// * Last Updated : 8/15/2022
//========================================================================


class DebugConfig {
    constructor() {
        this.status = false;
        this.wallHack = false;
        this.waterHack = false;
    }
}

MyUtils.DEBUG = new DebugConfig();

class Window_MyDebug extends Window_Command {
    /**
     * Window_MyDebug
     */
    constructor() {
        const DebugWindowConfig = {
            x: 50,
            y: 50,
            width: 450,
            height: 400
        }
        super(new Rectangle(DebugWindowConfig.x, DebugWindowConfig.y, DebugWindowConfig.width, DebugWindowConfig.height));
        this.alpha = 0.9;
        this.makeCommandList();
        Input.update();
    }
    /**
     * Make command list
     */
    makeCommandList() {
        // if (!this._options) return;
        this.addOption('Wallhack', 'wallHack', this.onWallHack.bind(this));
        this.addOption('Always Water', 'water', this.onWaterHack.bind(this));
        this.addOption('Spawn Farm Objects', 'spawnFarmObject', this.onSpawnFarmObjects.bind(this));
        this.addOption('New Day', 'newDay', this.onNewDay.bind(this));
        this.addOption('Test Tree Swing', 'testTreeSwing', this.onTestTreeSwing.bind(this));
        this.addOption('Set Ambient', 'setAmbient', this.onSetAmbientLight.bind(this));
        this.addOption('Exit', 'cancel', this.onCancelCommand.bind(this));
    }
    /**
     * Add Option
     * @param {string} name 
     * @param {string} symbol 
     * @param {Function} method 
     */
    addOption(name, symbol, method) {
        this.addCommand(name, symbol, true);
        this.setHandler(symbol, method);
    }
    /**
     * On Debug Mode
     */
    onDebugModeOK() {
        MyUtils.DEBUG.status = !MyUtils.DEBUG.status;
        this.onCommandOK();
    }
    /**
     * On Wall Hack
     */
    onWallHack() {
        MyUtils.DEBUG.wallHack = !MyUtils.DEBUG.wallHack;
        this.onCommandOK();
    }
    /**
     * On Water Hack
     */
    onWaterHack() {
        MyUtils.DEBUG.waterHack = !MyUtils.DEBUG.waterHack;
        this.onCommandOK();
    }
    /**
     * On Spawn Farm Objects
     */
    onSpawnFarmObjects() {
        for (var i = 0; i < $gameMap.width(); i++) {
            for (var j = 0; j < $gameMap.height(); j++) {
                if (FarmManager.isFarmRegion(i, j)) {
                    var object = new FarmTile(new Vector2(i, j), 1);
                    object.applySeed(Math.randomInt(5))
                    FarmManager.inst.currentFarmland().addObject(object)
                }
            }
        }
        this.onCommandOK();
    }
    /**
     * On Cancel Command
     */
    onCancelCommand() {
        this.deactivate();
        this.close();
    }
    /**
     * On New Day
     */
    onNewDay() {
        FarmManager.inst.onNewDay();
        this.onCommandOK();
    }
    /**
     * On Test Tree Swing
     */
    onTestTreeSwing() {
        setInterval(() => {
            for (var i = 1; i <= 8; i++) SceneManager._scene._spriteset._characterSprites[i].skew.x = Math.sin(Date.now() * 0.005) * 0.035;
        }, 60/1000) 
        this.onCommandOK();
    }
    /**
     * On Set Ambient Light
     */
    onSetAmbientLight() {
        let ambientColor = prompt('Enter 4 values r, g, b, a:');
        ambientColor = ambientColor.split(",").map(n => Number(n));
        AmbientController.inst.set(...ambientColor);
        this.onCommandOK();
    }
    /**
     * On Command OK
     */
    onCommandOK() {
        this.activate();
        this.redrawCurrentItem();
    }
    /**
     * Get option value
     * @param {string} symbol 
     * @returns {string}
     */
    getOptionValue(symbol) {
        switch (symbol) {
            case 'wallHack':
                return MyUtils.DEBUG.wallHack ? "ON" : "OFF";
            case 'water':
                return MyUtils.DEBUG.waterHack ? "ON" : "OFF";
        }
        return null;
    }
    /**
     * Draw item
     * @param {number} index 
     */
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const symbol = this.commandSymbol(index);
        this.resetTextColor();
        const optionValue = this.getOptionValue(symbol);
        if (optionValue != null) {
            this.changeTextColor(ColorManager.textColor(0));
            this.drawText(optionValue, rect.x, rect.y, rect.width, 'right');
        } else {
            this.changeTextColor(ColorManager.textColor(3));
        }
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'left');
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        if (Input.isTriggered(DebugKeyAction.DebugMenu)) {
            this.onCancelCommand();
        }
    }
}

Game_Player.prototype.isDebugThrough = function () {
    return MyUtils.DEBUG.wallHack;
};

var DSI_Sys4_DebugWindow_Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
	DSI_Sys4_DebugWindow_Scene_Base_update.call(this);
    this.updateDebugInput();
}

Scene_Base.prototype.updateDebugInput = function() {
    console.log("update input", Input.isTriggered(DebugKeyAction.DebugMenu));
    if (Input.isTriggered(DebugKeyAction.DebugMenu)) {
        if (!this._debugWindow) {
            this._debugWindow = new Window_MyDebug();
            this.addChild(this._debugWindow);
        }
        if (!this._debugWindow.isClosed()) return;
        this._debugWindow.openess = 0;
        this._debugWindow.refresh();
        this._debugWindow.activate();
        this._debugWindow.open();
    }
}