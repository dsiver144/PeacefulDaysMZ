//=======================================================================
// * Plugin Name  : DSI_Utils.js
// * Last Updated : 7/22/2022
//========================================================================
/*:
 * @author dsiver144
 * @target MZ
 * @plugindesc (v1.0) An Utils plugin by dsiver144
 * @help 
 * Empty Help
 * 
 * 
 */
class Position extends SaveableObject {
    /**
     * Object position
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super();
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
    }
    /**
     * Save Properties
     */
    saveProperties() {
        return [
            ['x', 0],
            ['y', 0],
        ];
    }
    /**
     * Overwrite toString
     * @returns {string}
     */
    toString() {
        return `${this.x}-${this.y}`;
    }
}

//========================================================================
// END OF PLUGIN
//========================================================================