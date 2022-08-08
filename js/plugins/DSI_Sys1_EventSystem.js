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
    on(eventName, callback) {
        let event = this.events[eventName];
        if (!event) {
            event = new EmitterEvent(eventName);
            this.events[eventName] = event;
        }
        event.addCallback(callback);
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
    }
    /**
     * Add callback to event
     * @param {Function} callback 
     */
    addCallback(callback) {
        this.callbacks.push(callback);
    }
    /**
     * Remove callback from event
     * @param {Function} callback 
     */
    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index >= 0) {
            this.callbacks.splice(index, 1);
        }
    }
    /**
     * Fire the event
     * @param {any} data 
     */
    fire(data) {
        const callbacks = this.callbacks.slice(0);
        callbacks.forEach(callback => {
            callback(data);
        })
    }
}

/** @type {EventEmitter} */
const EventManager = new EventEmitter();