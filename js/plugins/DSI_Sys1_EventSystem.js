//=======================================================================
// * Plugin Name  : DSI_Sys1_EventSystem.js
// * Last Updated : 8/8/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Event System
 * @help 
 * Empty Help
 * 
 */

class EventEmitter {
    /**
     * This class handle the system event 
     */
    constructor() {
        /** @type {EmitterEvent[]} */
        this.events = [];
    }
    /**
     * Emit
     * @param {string} eventName 
     * @param {any} data 
     */
    emit(eventName, data) {
        const event = this.events[eventName];
        if (event) {
            event.fire(data);
        }
    }
    /**
     * Listen to the specific event
     * @param {string} eventName 
     * @param {Function} callback 
     */
    on(eventName, callback, target) {
        let event = this.events[eventName];
        if (!event) {
            event = new EmitterEvent(eventName);
            this.events[eventName] = event;
        }
        event.addCallback(callback, target);
    }
    /**
     * Stop listen on specific event
     * @param {string} eventName 
     * @param {Function} callback 
     */
    off(eventName, callback) {
        const event = this.events[eventName];
        if (event && event.callbacks.indexOf(callback) > -1) {
            event.removeCallback(callback);
            if (event.callbacks.length === 0) {
                delete this.events[eventName];
            }
        }
    }
}

class EmitterEvent {
    /**
     * This class handle callback addition & removal.
     * @param {string} eventName 
     */
    constructor(eventName) {
        /** @type {string} */
        this.eventName = eventName;
        /** @type {Function[]} */
        this.callbacks = [];
        /** @type {object[]} */
        this.targets = [];
    }
    /**
     * Add callback to event
     * @param {Function} callback 
     */
    addCallback(callback, target) {
        this.callbacks.push(callback);
        this.targets.push(target);
    }
    /**
     * Remove callback from event
     * @param {Function} callback 
     */
    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index >= 0) {
            this.callbacks.splice(index, 1);
            this.targets.splice(index, 1);
        }
    }
    /**
     * Fire the event
     * @param {any} data 
     */
    fire(data) {
        this.callbacks.forEach((callback, index) => {
            callback.call(this.targets[index], data);
        })
    }
}

/** @type {EventEmitter} */
var EventManager = new EventEmitter();