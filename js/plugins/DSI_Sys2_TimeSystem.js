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
    morningHour: 6,
    maxHour: 24,
    extendedHour: 3,
    maxMin: 60,
    maxMonthDay: 28,
    frameRequiredPerUpdate: 100,
    minPerUpdate: 5,
    maxSeason: 4
}
/** @enum */
const WeatherType = {
    "rain": "rain",
    "sunny": "sunny",
    "windy": "windy",
    "cloudy": "cloudy",
    "thunderstorm": "thunderstorm",
    "storm": "storm",
    "snowy": "snowy",
    "snowStorm": "snowStorm",
}
/** @enum */
const TimeEvent = {
    UpdateTime: "updateTime"
}

const WeatherConfig = {
    0: {
        rain: 25,
        sunny: 45,
        cloudy: 10,
        windy: 10
    },
    1: {
        rain: 30,
        thunderstorm: 10,
        sunny: 40,
        windy: 10,
        cloudy: 10,
        storm: 2
    },
    2: {
        rain: 20,
        sunny: 40,
        cloudy: 20,
        windy: 20
    },
    3: {
        sunny: 20,
        cloudy: 15,
        snowy: 60,
        snowStorm: 2
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
        this.hour = 6;
        this.min = 0;
        this.monthDay = 1;
        this.year = 1;
        this.frameCount = 0;
        this.season = 0;
        this.weatherType = WeatherType.windy;
        this.paused = true;
        this.totalMins = 0;
    }
    /**
     * Get time session in a day
     * @returns {"morning" | "noon" | "night"}
     */
    session() {
        if (this.hour >= 6 && this.hour < 12) {
            return "morning";
        }
        if (this.hour >= 12 && this.hour < 18) {
            return "noon";
        }
        return "night";
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
     * Check if player is in valid hour
     * @returns {boolean}
     */
    isValidHour() {
        return this.hour >= 6 && this.hour <= 24;
    }
    /**
     * Check if player is in late hour
     * @returns {boolean1}
     */
    isLateHour() {
        return this.hour >= 0 && this.hour < 6;
    }
    /**
     * Process to next day.
     * @param {boolean} increaseDay
     */
    nextDay(increaseDay = true) {
        // Calculate total mins until morning
        const totalHoursToMorning = (this.isValidHour() ? TimeConfig.maxHour - this.hour : -this.hour) + TimeConfig.morningHour;
        const minLeft = TimeConfig.maxMin - this.min;
        this.totalMins += totalHoursToMorning * TimeConfig.maxMin + minLeft;
        // Recalculate the time values when morning comes.
        if (increaseDay) {
            this.updateMonthDay(1);
        }
        this.hour = TimeConfig.morningHour;
        this.min = 0;
        this.weatherType = this.randomizeWeather(this.season);
        console.log(this.totalMins, this.weatherType, { totalHoursToMorning, minLeft });
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
        this.totalMins += value;
        if (this.min >= TimeConfig.maxMin) {
            this.min = this.min - TimeConfig.maxMin;
            this.updateHour(1);
        }
        EventManager.emit(TimeEvent.UpdateTime);
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
        if (this.isLateHour() && this.hour >= TimeConfig.extendedHour) {
            this.nextDay(false);
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
 * Get Total Mins Have Passed
 * @returns {number}
 */
GameTime.totalMins = function () {
    return GameTime.inst.totalMins;
}
/**
 * Get Season
 * @returns {number}
 */
GameTime.season = function () {
    return GameTime.inst.season;
}
/**
 * Get Time Session
 */
GameTime.session = function () {
    return GameTime.inst.session();
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
 * Get Weather Type
 * @returns {string}
 */
GameTime.weatherType = function () {
    return GameTime.inst.weatherType;
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