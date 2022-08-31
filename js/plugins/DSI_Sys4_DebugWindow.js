//=======================================================================
// * Plugin Name  : DSI_Sys4_DebugWindow.js
// * Last Updated : 8/15/2022
//========================================================================


class DebugConfig {
    constructor() {
        this.status = false;
        this.wallHack = false;
        this.waterHack = false;
        this.seasonHack = false;
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
        this.addOption('Ignore Crop Season', 'seasonHack', this.onSeasonHack.bind(this));
        this.addOption('Spawn Farm Objects', 'spawnFarmObject', this.onSpawnFarmObjects.bind(this));
        this.addOption('New Day', 'newDay', this.onNewDay.bind(this));
        this.addOption('Test Tree Swing', 'testTreeSwing', this.onTestTreeSwing.bind(this));
        this.addOption('Set Ambient', 'setAmbient', this.onSetAmbientLight.bind(this));
        this.addOption('Custom', 'custom', this.onCustomCommand.bind(this));
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
     * On Season Hack
     */
    onSeasonHack() {
        MyUtils.DEBUG.seasonHack = !MyUtils.DEBUG.seasonHack;
        this.onCommandOK();
    }
    /**
     * On Spawn Farm Objects
     */
    onSpawnFarmObjects() {
        for (var i = 0; i < $gameMap.width(); i++) {
            for (var j = 0; j < $gameMap.height(); j++) {
                if (FarmManager.isFarmRegion(i, j)) {
                    if (FarmManager.inst.currentFarmland().getObject(i, j)) continue;
                    var object = new FarmTile(new Vector2(i, j), 1);
                    const seedID = Object.values(FarmParams.allSeeds).randomizeItem().itemID;
                    object.applySeed(seedID);
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
        }, 60 / 1000)
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
     * On Custom Command
     */
    onCustomCommand() {
        setInterval(() => {
            if (Input.isTriggered(FieldKeyAction.Map)) {
                const { x, y } = $gamePlayer.frontPosition();
                const object = new WoodenFence(new Vector2(x, y), $gameMap.mapId());
                FarmManager.inst.currentFarmland().addObject(object, false);
            }
        }, 60 / 1000);
        // Building.place(Coop);

        // var object = new Coop(new Vector2(10, 10), 1);
        // FarmManager.inst.currentFarmland().addObject(object);
        // let startX = 0;
        // let startY = 0;
        // const interval = setInterval(() => {
        //     switch (Input.dir4) {
        //         case 2: startY += 1; break;
        //         case 4: startX -= 1; break;
        //         case 6: startX += 1; break;
        //         case 8: startY -= 1; break;
        //     }
        //     if (Input.dir4 > 0) {
        //         console.log({startX, startY}, object.canPlaceAt(startX, startY));
        //     }
        //     if (Input.isTriggered(MenuKeyAction.PageLeft)) {
        //         FarmManager.inst.currentFarmland().addObject(object);
        //     }
        // }, 60/1000);
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
            case 'seasonHack':
                return MyUtils.DEBUG.seasonHack ? "ON" : "OFF";
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
Scene_Base.prototype.update = function () {
    DSI_Sys4_DebugWindow_Scene_Base_update.call(this);
    this.updateDebugInput();
}

Scene_Base.prototype.updateDebugInput = function () {
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