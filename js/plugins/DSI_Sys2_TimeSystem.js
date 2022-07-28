//=======================================================================
// * Plugin Name  : DSI_Sys2_TimeSystem.js
// * Last Updated : 7/25/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Time System
 * @help 
 * Empty Help
 * 
 */
const TimeConfig = {
    maxHour: 24,
    maxMin: 60,
    maxMonthDay: 28,
    frameRequiredPerUpdate: 100,
    minPerUpdate: 5,
    maxSeason: 4
}

const WeatherConfig = {
    0: {
        rain: 20,
        sunny: 60,
        windy: 20
    },
    1: {
        rain: 50,
        sunny: 25,
        windy: 20,
        storm: 5
    },
    2: {
        rain: 20,
        sunny: 40,
        windy: 40
    },
    3: {
        sunny: 20,
        snowy: 75,
        snowStorm: 5
    }
}

// Formula: 100 * (60 / 5) * 24 ) / 60 / 60 = 8 min per in game day.

class GameTime extends SaveableObject {
    /**
     * A class that handle intime for Peaceful Days.
     */
    constructor() {
        super();
        GameTime.inst = this;
        this.init();
    }
    /**
     * Init
     */
    init() {
        this.hour = 0;
        this.min = 0;
        this.monthDay = 1;
        this.year = 1;
        this.frameCount = 0;
        this.season = 0;
        this.paused = true;
    }
    /**
     * Randomize Weather
     * @param {number} season 
     * @returns {string}
     */
    randomizeWeather(season) {
        const weatherPool = [];
        for (let season in WeatherConfig) {
            const array = [];
            for (let weatherType in WeatherConfig[season]) {
                for (let i = 0; i < WeatherConfig[season][weatherType]; i++) {
                    array.push(weatherType);
                }
            }
            weatherPool[season] = array;
        }
        return MyUtils.randomArrayItem(weatherPool[season]);
    }
    /**
     * Pause Time
     */
    pause() {
        this.paused = true;
    }
    /**
     * Resume Time
     */
    resume() {
        this.paused = false;
    }
    /**
     * Save properties
     */
    saveProperties() {
        return [
            ["hour", 0],
            ["min", 0],
            ["monthDay", 1],
            ["year", 1],
            ["frameCount", 0],
            ["season", 0],
            ["paused", true]
        ]
    }
    /**
     * Update per frame.
     */
    update() {
        this.updateFrame();
    }
    /**
     * Check if time system is active
     * @returns {boolean}
     */
    isActive() {
        return !this.paused;
    }
    /**
     * Update Frame
     */
    updateFrame() {
        if (!this.isActive()) return;
        this.frameCount += 1;
        if (this.frameCount >= TimeConfig.frameRequiredPerUpdate) {
            this.frameCount = 0;
            this.updateMin(TimeConfig.minPerUpdate);
            console.log(`${this.hour}:${this.min} | ${this.monthDay} Season: ${this.season} | Year: ${this.year}`);
        }
    }
    /**
     * Update min
     * @param {number} value 
     */
    updateMin(value) {
        this.min += value;
        if (this.min >= TimeConfig.maxMin) {
            this.min = this.min - TimeConfig.maxMin;
            this.updateHour(1);
        }
    }
    /**
     * Update hour
     * @param {number} value 
     */
    updateHour(value) {
        this.hour += value;
        if (this.hour >= TimeConfig.maxHour) {
            this.hour = this.hour - TimeConfig.maxHour;
            this.updateMonthDay(1);
        }
    }
    /**
     * Update month day
     * @param {number} value 
     */
    updateMonthDay(value) {
        this.monthDay += value;
        if (this.monthDay >= TimeConfig.maxMonthDay) {
            this.monthDay = this.monthDay - TimeConfig.maxMonthDay;
            this.updateSeason(1);
        }
    }
    /**
     * Update season
     * @param {number} value 
     */
    updateSeason(value) {
        this.season += value;
        if (this.season >= TimeConfig.maxSeason) {
            this.season = this.season - TimeConfig.maxSeason;
            this.updateYear(1);
        }
    }
    /**
     * Update year
     * @param {number} value 
     */
    updateYear(value) {
        this.year += value;
    }
}
/** @type {GameTime} */
GameTime.inst = null;
/**
 * Get Hour
 * @returns {number}
 */
GameTime.hour = function () {
    return GameTime.inst.hour;
}
/**
 * Get Min
 * @returns {number}
 */
GameTime.min = function () {
    return GameTime.inst.min;
}
/**
 * Get Season
 * @returns {number}
 */
GameTime.season = function () {
    return GameTime.inst.season;
}
/**
 * Get Month Day
 * @returns {number}
 */
GameTime.monthDay = function () {
    return GameTime.inst.monthDay;
}
/**
 * Get Year
 * @returns {number}
 */
GameTime.year = function () {
    return GameTime.inst.year;
}
/**
 * Pause Time
 */
GameTime.pause = function () {
    GameTime.inst.pause();
}
/**
 * Resume Time
 */
GameTime.resume = function () {
    GameTime.inst.resume();
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

var DSI_Sys2_TimeSystem_Game_System_createSaveableObjects = Game_System.prototype.createSaveableObjects;
Game_System.prototype.createSaveableObjects = function () {
    DSI_Sys2_TimeSystem_Game_System_createSaveableObjects.call(this);
    this._time = new GameTime();
}

var DSI_Sys2_TimeSystem_Scene_Map_updateMain = Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain = function () {
    DSI_Sys2_TimeSystem_Scene_Map_updateMain.call(this);
    GameTime.inst.update();
};