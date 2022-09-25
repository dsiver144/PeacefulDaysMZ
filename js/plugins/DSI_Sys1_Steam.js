//=======================================================================
// * Plugin Name  : DSI_Sys1_Steam.js
// * Last Updated : 8/15/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) Steam API for Peaceful Days
 * @help 
 * Empty Help
 */
class SteamAPI {
    /**
     * This class handle steam integration for PD
     */
    constructor() {
        SteamAPI.inst = this;
        this.isInitialized = false;
        try {
            this.greenworks = require('./greenworks');
            this.isInitialized = this.greenworks.initialize();
        } catch(err) {
            console.warn("Error occured when initializing greenwork.", err);
        }
    }
    /**
     * Activate Achievement
     * @param {string} name 
     */
    activateAchievement(name) {
        if (!this.isInitialized) return;
        if (!name) {
            console.log("Please specify achievement name.");
            return;
        }
        this.greenworks.activateAchievement(name, () => {
            console.log("Successfully activate " + name);
        })
    }
    /**
     * Clear Achievement
     * @param {string} name 
     */
    clearAchievement(name) {
        if (!this.isInitialized) return;
        if (!name) {
            console.log("Please specify achievement name.");
            return;
        }
        this.greenworks.clearAchievement(name, () => {
            console.log("Successfully clear " + name);
        });
    }
}
/** @type {SteamAPI} */
SteamAPI.inst = null;
/**
 * Start Steam API
 */
SteamAPI.start = function() {
    SteamAPI.inst = new SteamAPI();
}
/**
 * Set Achievement
 * @param {string} name 
 */
SteamAPI.setAchievement = function(name) {
    SteamAPI.inst.setAchievement(name);
}
/**
 * Clear Achievement
 * @param {string} name 
 */
SteamAPI.clearAchievement = function(name) {
    SteamAPI.inst.clearAchievement(name);
}

SteamAPI.start();