

//=======================================================================
// * Plugin Name  : DSI_Sys3_TimeUI.js
// * Last Updated : 10/5/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Time UI
 * @help 
 * Empty Help
 * 
 */
const TimeUIConfig = {
    bgSize: [150, 96],
    offset: [10, 10],
}

class Sprite_TimeUI extends Sprite {
    /**
     * Handle UI for time system in Peaceful Days.
     */
    constructor() {
        super();
        this.create();
        this.setPosition();
    }
    /**
     * Create display objects
     */
    create() {
        this.createBackground();
        this.createClockText();
        this.createDateText();
        this.createWeatherBanner();
        this.refreshDateAndTime();
        EventManager.on(TimeEvent.UpdateTime, this.onTimeChanged, this);
    }
    /**
     * Create Background
     */
    createBackground() {
        const background = new Sprite(ImageManager.loadMenu('MainBG', 'timeHud'));
        this.addChild(background);
    }
    /**
     * Create Time Text
     */
    createClockText() {
        const timeStyle = new PIXI.TextStyle({
            fill: "#f5b642",
            fontFamily: "Verdana",
            align: "center",
            fontSize: 35,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 5,
            wordWrap: true,
            wordWrapWidth: 150
        });
        const timeText = new PIXI.Text('12:00', timeStyle);
        timeText.anchor.x = 0.5;
        timeText.x = 150 / 2;
        timeText.y = 5;
        this._timeText = timeText;
        this.addChild(timeText);
    }
    /**
     * Create Date Text
     */
    createDateText() {
        const dateStyle = new PIXI.TextStyle({
            fill: "#fff7d1",
            fontFamily: "Verdana",
            align: "center",
            fontSize: 14,
            lineJoin: "round",
            stroke: "#6f4949",
            strokeThickness: 4,
        });
        const dateText = new PIXI.Text('Thu 24th Spr', dateStyle);
        dateText.anchor.x = 0.5;
        dateText.x = 150 / 2;
        dateText.y = 45;
        this._dateText = dateText;
        this.addChild(dateText);
    }
    /**
     * Create weather banner
     */
    createWeatherBanner() {
        const weatherBanner = new Sprite();
        this.addChild(weatherBanner);
        this._weatherBanner = weatherBanner;
        this._weatherBanner.x = 7;
        this._weatherBanner.y = 72;
        this.refreshWeatherBanner();
    }
    /**
     * On Time Changed
     */
    onTimeChanged() {
        this.refreshDateAndTime();
        this.refreshWeatherBanner();
    }
    /**
     * Refresh Date and Time
     */
    refreshDateAndTime() {
        const hour = GameTime.hour().toString().padStart(2, "0");
        const min = GameTime.min().toString().padStart(2, "0");
        const timeStr = `${hour}:${min}`;
        this._timeText.text = timeStr;
    }
    /**
     * Refresh Weather Banner
     */
    refreshWeatherBanner() {
        const currentWeather = GameTime.weatherType();
        this._weatherBanner.bitmap = ImageManager.loadMenu('Weather_' + currentWeather, 'timeHud');
    }
    /**
     * Set Position
     */
    setPosition() {
        const {bgSize, offset} = TimeUIConfig;
        const pos = new Vector2(0, 0);
        const type = ConfigManager.clockPosition == 1 ? 'right' : 'left';
        pos.x = type === 'right' ? (Graphics.width - bgSize[0] - offset[0]) : offset[0];
        pos.y = offset[1];
        this.x = pos.x;
        this.y = pos.y;
    }
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys3_TimeUI_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function () {
    DSI_Sys3_TimeUI_Spriteset_Map_createUpperLayer.call(this);
    this._timeUI = new Sprite_TimeUI();
    this.addChild(this._timeUI);
}